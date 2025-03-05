import { IncomingWebhook } from '@slack/webhook';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import moment = require('moment-timezone');
@Injectable()
export class SlackService {
  private readonly webhook1: IncomingWebhook;
  private readonly webhook2: IncomingWebhook;
  private readonly webhookUrlSwapTsl: string;
  private readonly slackTokenSwapTsl: string;
  private readonly webhookUrlSwapTsg: string;
  private readonly slackTokenSwapTsg: string;

  constructor(private prisma: PrismaService) {
    // Initialize the Third Space Portal (FYI TSG Slack service key is been expired to this is commented out )
    // this.webhook1 = new IncomingWebhook(process.env.SLACK_TOKEN);

    // Initialize the second webhook TSL (this is for TSL testing ***** KEEP ********)
    this.webhook2 = new IncomingWebhook(process.env.SLACK_TOKEN_TSL);
    this.webhookUrlSwapTsl = process.env.NX_SLACK_WEBHOOK_URL_SWAP_TSL;
    this.slackTokenSwapTsl = process.env.NX_SLACK_BOT_TOKEN_SWAP_TSL;
    this.webhookUrlSwapTsg = process.env.NX_SLACK_WEBHOOK_URL_SWAP_TSG;
    this.slackTokenSwapTsg = process.env.NX_SLACK_BOT_TOKEN_SWAP_TSG;
  }

  async sendNotification(message: any): Promise<void> {
    try {
      // Send the message to Third Space Portal (FYI TSG Slack service key is been expired to this is commented out )
      // await this.webhook1.send({
      //   blocks: message
      // });

      // Send the same message to TSL  (this is for TSL testing  ***** KEEP ********)
      await this.webhook2.send({
        blocks: message
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendTutorSwapNotificationSlack({
    timeRangeId,
    hourState,
    sessionDate,
    tutorId
  }: any) {
    try {
      console.log('------');

      const gOATimeRange = await this.prisma.gOATimeRange.findFirst({
        where: {
          id: timeRangeId
        },
        select: {
          hh_time: true,
          oh_time: true
        }
      });
      const time =
        hourState == 'OH' ? gOATimeRange.oh_time : gOATimeRange.hh_time;

      const tslUser = await this.prisma.tslUser.findFirst({
        where: {
          tsl_id: tutorId
        },
        select: {
          tsp_id: true
        }
      });
      const tspId = tslUser.tsp_id;

      const responseUserTutor = await this.prisma.user.findFirst({
        where: {
          tsp_id: tspId
        },
        select: {
          approved_contact_data: {
            select: {
              workEmail: true
            }
          },
          tm_approved_status: {
            select: {
              supervisorTspId: true
            }
          },
          approved_personal_data: {
            select: {
              firstName: true,
              surname: true
            }
          }
        }
      });

      const supervisorTspId =
        responseUserTutor.tm_approved_status.supervisorTspId;

      const responseUserSupervisor =
        await this.prisma.nonTutorDirectory.findFirst({
          where: {
            hr_tsp_id: supervisorTspId
          },
          select: {
            tsg_email: true,
            short_name: true
          }
        });

      // Get All the users
      // const response = await axios.get('https://slack.com/api/users.list', {
      //   headers: {
      //     Authorization: `Bearer ${this.slackToken}`
      //   }
      // });

      // Get User Details by Email Address - Tutor
      const emailTutor =
        process.env.NX_ENVIRONMENT == 'production'
          ? responseUserTutor.approved_contact_data?.workEmail
          : 'inusha@thirdspaceglobal.com'; // responseUserTutor.approved_contact_data?.workEmail
      //-----------------SLACK MESSAGE --- WorkSpace: TSL ------------------------------------
      let responseTutor1 = null;
      if (emailTutor) {
        responseTutor1 = await axios.get(
          'https://slack.com/api/users.lookupByEmail',
          {
            headers: {
              Authorization: `Bearer ${this.slackTokenSwapTsl}`
            },
            params: {
              email: emailTutor
            }
          }
        );
        console.log('------');
        if (!responseTutor1.data.ok) {
          throw new Error(
            responseTutor1.data.error || 'Failed to fetch Slack users'
          );
        }
      }

      // Get User Details by Email Address - Supervisor
      const emailSupervisor =
        process.env.NX_ENVIRONMENT == 'production'
          ? responseUserSupervisor?.tsg_email
          : 'inusha@thirdspaceglobal.com'; //responseUserSupervisor?.tsg_email;
      let responseSupervisor = null;
      if (emailSupervisor) {
        responseSupervisor = await axios.get(
          'https://slack.com/api/users.lookupByEmail',
          {
            headers: {
              Authorization: `Bearer ${this.slackTokenSwapTsl}`
            },
            params: {
              email: emailSupervisor
            }
          }
        );
        if (!responseSupervisor.data.ok) {
          throw new Error(
            responseSupervisor.data.error || 'Failed to fetch Slack users'
          );
        }
      }

      const tutorSlackId1 = responseTutor1.data?.user.id;
      const supervisorSlackId = responseSupervisor?.data.user.id;
      const supervisorName = responseUserSupervisor?.short_name;
      const tutorName =
        responseUserTutor?.approved_personal_data?.firstName +
        ' ' +
        responseUserTutor?.approved_personal_data?.surname;
      const day = moment(sessionDate, 'YYYY-MM-DD').format('dddd');
      //03/12/2024 | Tuesday | Masna Munawwer | 16:30 | @Tutor Manager
      const message1 = `${sessionDate} | ${day} | ${
        tutorSlackId1 ? `<@${tutorSlackId1}>` : tutorName
      } | *${time}* | ${
        supervisorSlackId ? `<@${supervisorSlackId}>` : supervisorName
      }`;

      const payload1 = {
        text: message1
      };

      await axios.post(this.webhookUrlSwapTsl, payload1);
      //-----------------SLACK MESSAGE --- WorkSpace: Third Space Global ------------------------------------
      // Send Slack Messge to a Specific Manager Channel - For Indivitula tutor
      let responseTutor2 = null;
      if (emailTutor) {
        responseTutor2 = await axios.get(
          'https://slack.com/api/users.lookupByEmail',
          {
            headers: {
              Authorization: `Bearer ${this.slackTokenSwapTsg}`
            },
            params: {
              email: emailTutor
            }
          }
        );
        console.log('------');
        if (!responseTutor2.data.ok) {
          throw new Error(
            responseTutor2.data.error || 'Failed to fetch Slack users'
          );
        }
      }
      const tutorSlackId2 = responseTutor2.data?.user.id;
      // @Tutor Name | 10/12/2024 | Wednesday | 16:30 | You got a session!
      const message2 = `${
        tutorSlackId2 ? `<@${tutorSlackId2}>` : tutorName
      }  |  ${sessionDate} | ${day} | *${time}* | You got a session!`;

      const payload2 = {
        text: message2
      };

      await axios.post(this.webhookUrlSwapTsg, payload2);

      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Failed to send Slack notification: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
