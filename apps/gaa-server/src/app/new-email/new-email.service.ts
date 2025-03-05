import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { CreateNewEmailDto } from './dto/create-new-email.dto';
import { UpdateNewEmailDto } from './dto/update-new-email.dto';
import * as sgMail from '@sendgrid/mail';
// import * as fs from "fs";
import path = require('path');
import { PrismaService } from '../prisma/prisma.service';
sgMail.setApiKey(process.env['NX_SENDGRID_KEY']);
const fs = require('fs');
// const axios = require("axios");
const pdf2base64 = require('pdf-to-base64');
import axios from 'axios';
import fetch from 'node-fetch';
@Injectable()
export class NewEmailService {
  create(createNewEmailDto: CreateNewEmailDto) {
    return 'This action adds a new newEmail';
  }
  from = {
    email: 'business.systems@thirdspaceportal.com',
    name: 'Third Space Global'
  };
  replyTo: 'business.systems@thirdspaceportal.com';
  constructor(
    @InjectSendGrid() private readonly client: SendGridService,
    private prisma: PrismaService
  ) {}

  async sendNotifyTutorMailService(
    subject: string,
    email: string,
    emailAc: string,
    first_name: string,
    focusAreas: any,
    linkToBookDiscussion: any,
    reasonForEvaluation: any,
    pillar1: any,
    criteria1: any,
    comment1: any,
    pillar2: any,
    criteria2: any,
    comment2: any,
    pillar3: any,
    criteria3: any,
    comment3: any,
    sesData: any,
    evaluationId: any
  ) {
    const response1 = await this.prisma.sesRevampEvaluationDetail.findMany({
      where: {
        evaluation_id: evaluationId,
        reason_for_evaluation: {
          not: null
        },
        link_to_feedback_call: {
          not: null
        },
        feedback_attendance: {
          not: null
        },
        // feedback_date: {
        //   not: null
        // },
        sr_completion: {
          not: null
        },
        comment_reflection: {
          not: null
        }
      }
    });

    const response2 = await this.prisma.sesRevampSessionEvaluation.findMany({
      where: {
        evaluation_id: evaluationId
      },
      select: {
        lo_evaluated: true
      }
    });

    const response3 = await this.prisma.sesRevampTimespans.findMany({
      where: {
        evaluation_id: evaluationId
      },
      select: {
        from_time: true
      }
    });
    console.log(
      'response1 :' + evaluationId + ' - ' + JSON.stringify(response1)
    );
    console.log(
      'response2 :' + evaluationId + ' - ' + JSON.stringify(response2)
    );
    console.log(
      'response3 :' + evaluationId + ' - ' + JSON.stringify(response3)
    );
    if (
      response1.length > 0 &&
      response2[0].lo_evaluated != null &&
      response2[0].lo_evaluated != '' &&
      response3[0].from_time != '0,0'
    ) {
      console.log(emailAc);
      return this.client.send({
        to: email,
        from: this.from,
        replyTo: this.replyTo,
        cc: emailAc,
        templateId: 'd-cca1d91378864ed18afb0a12bef0f2af',
        dynamicTemplateData: {
          first_name: first_name,
          subject: subject,
          focusAreas: focusAreas,
          linkToBookDiscussion: linkToBookDiscussion,
          reasonForEvaluation: reasonForEvaluation,
          pillar1: pillar1,
          criteria1: criteria1,
          comment1: comment1,
          pillar2: pillar2,
          criteria2: criteria2,
          comment2: comment2,
          pillar3: pillar3,
          criteria3: criteria3,
          comment3: comment3,
          sesData: sesData,
          isfocusAreas: focusAreas ? true : false
        }
      });
    } else {
      return [
        {
          success: false,
          statusCode: 403 //403 Forbidden
        }
      ];
    }
  }

  async submitTutorMailService(
    evaluationId: number,
    subject: string,
    email: string,
    emailAc: string,
    first_name: string,
    pdfName: string,
    type: string,
    tutorId: number
  ): Promise<any> {
    console.log('sending tutor report..');
    try {
      let attachment: any = null;
      let pdfUrl: any = '';
      let result: any = null;

      const customUrl =
        process.env['FRONT_URL'] +
        'session-report/' +
        evaluationId +
        '/' +
        tutorId +
        '/' +
        type;

      console.log('customurl:' + customUrl);
      //Generate and Fetch the pdf URL from S3 Bucket
      const responseURL = await axios.post(process.env['S3_BUCKET_URL_TSG'], {
        url: customUrl,
        evaluationId: evaluationId
      });
      //wait for get the result
      result = await responseURL;
      //Check valiadation and get the PDF URL
      if (result) {
        pdfUrl = result.data.data.url;
      }

      //PDf convert to string(base64)
      await pdf2base64(pdfUrl)
        .then((response) => {
          attachment = response; //cGF0aC90by9maWxlLmpwZw==
        })
        .catch((error) => {
          console.log(error); //Exepection error....
        });

      //Send Email
      const response = await this.client.send({
        to: email,
        from: this.from,
        replyTo: this.replyTo,
        cc: emailAc,
        bcc: 'productdevelopment@thirdspaceglobal.com',
        templateId: 'd-11d7a52067fa4504954bd2243fb5affe',
        dynamicTemplateData: {
          first_name: first_name,
          subject: subject
        },
        attachments: [
          {
            content: attachment,
            filename: 'Final Report.pdf',
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      });
      //Validate the Email using response
      if (response) {
        const status = response[0].statusCode;
        if (status == 202) {
          const updatedRecord = await this.prisma.sesRevampEvaluation.update({
            where: {
              evaluation_id: evaluationId
            },
            data: {
              final_email_sent_at: new Date()
            }
          });
          return {
            success: true,
            status: 200,
            message: `Final email sent to ${email} email address And CC to ${emailAc} email address`
          };
        } else {
          return {
            success: false,
            status: 500
          };
        }
      } else {
        return {
          success: false,
          status: 500
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
