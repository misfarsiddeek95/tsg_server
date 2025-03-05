import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Imap = require('imap'); // Correct way to import Imap
import { simpleParser } from 'mailparser';
import * as xlsx from 'xlsx';
import { USSessionDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { convertToTimeString, excelToDate } from '../util';
import PQueue from 'p-queue';

@Injectable()
export class ImapEmailService {
  private imap: any;
  private readonly queue = new PQueue({ concurrency: 10 });

  constructor(private prisma: PrismaService) {
    this.imap = new Imap({
      user: 'literaexport@thirdspaceglobal.com',
      password: 'Mm8dDU63PbqD6aY',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false
      },
      connTimeout: 30000, // Increase connection timeout (30 seconds)
      authTimeout: 30000 // Increase authentication timeout (30 seconds)
    });
  }

  private removeSpacesFromKeys(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      const newKey = key.replace(/\s+/g, '');
      newObj[newKey] = obj[key];
    });
    return newObj;
  }

  private openInbox(callback: (error: Error | null, box: any) => void) {
    this.imap.openBox('INBOX', false, callback);
  }

  public readEmail() {
    this.imap.once('ready', () => {
      this.openInbox((error, box) => {
        if (error) throw error;

        const searchCriteria = [
          'UNSEEN',
          ['HEADER', 'SUBJECT', 'US data export']
        ];
        const fetchOptions = { bodies: '', struct: true, markSeen: true };

        this.imap.search(searchCriteria, (error, results) => {
          if (error) throw error;

          if (results.length === 0) {
            console.log('No new emails found with the specified subject.');
            this.logMailRead('No new emails found with the specified subject.');
            this.imap.end();
            return;
          }

          const f = this.imap.fetch(results, fetchOptions);
          f.on('message', (msg, seqno) => {
            msg.on('body', (stream, info) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) throw err;

                const attachments = parsed.attachments;
                for (const attachment of attachments) {
                  if (attachment.filename.endsWith('.xlsx')) {
                    const workbook = xlsx.read(attachment.content, {
                      type: 'buffer'
                    });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    const jsonData = xlsx.utils.sheet_to_json(sheet);
                    const transformedData = jsonData.map(
                      (data: Record<string, any>) =>
                        this.removeSpacesFromKeys(data)
                    );

                    await this.processDataInBatches(transformedData);
                  }
                }
              });
            });
          });
          f.once('error', (err) => {
            console.log('Fetch error: ' + err);
            this.logMailRead('Fetch error: ' + err);
          });
          f.once('end', () => {
            console.log('Done fetching all messages!');
            this.logMailRead('Done fetching all messages!');
            this.imap.end();
          });
        });
      });
    });

    this.imap.once('error', (err) => {
      console.log(err);
      this.logMailRead(err);
    });

    this.imap.connect();
  }

  private async processDataInBatches(data: Record<string, any>[]) {
    const batchSize = 100; // Process in batches of 100

    for (let i = 0; i < data.length; i += batchSize) {
      const batch: any = data.slice(i, i + batchSize);
      await this.queue.add(() => this.saveData(batch));
    }
  }

  private async saveData(usSessionDto: USSessionDto[]) {
    const details = [];

    for (const data of usSessionDto) {
      try {
        const tsgDetails = await this.prisma.tslUser.findFirst({
          where: {
            tsl_email: data.tutoremail
          }
        });

        const result = await this.prisma.gOAUsBookedSession.upsert({
          where: {
            sessionID: data.sessionID
          },
          update: {
            status: data.status,
            sessionScheduledDate: excelToDate(data.sessionscheduleddate),
            sessionScheduledTime: convertToTimeString(
              data.sessionscheduledtime
            ),
            length: data.length,
            tutorUserID: data.tutoruserID.toString(),
            tspId: tsgDetails ? tsgDetails.tsp_id : null,
            tutorEmail: data.tutoremail,
            tutorName: data.tutorname
          },
          create: {
            sessionID: data.sessionID,
            status: data.status,
            sessionScheduledDate: excelToDate(data.sessionscheduleddate),
            sessionScheduledTime: convertToTimeString(
              data.sessionscheduledtime
            ),
            length: data.length,
            tutorUserID: data.tutoruserID.toString(),
            tspId: tsgDetails ? tsgDetails.tsp_id : null,
            tutorEmail: data.tutoremail,
            tutorName: data.tutorname
          }
        });

        details.push(result);
      } catch (error) {
        console.error(`Error saving session ID ${data.sessionID}:`, error);
      }
    }

    console.log(details);
    return details;
  }

  private async logMailRead(message: string) {
    await this.prisma.gOAMailLog.create({
      data: {
        message: message.toString()
      }
    });
  }
}
