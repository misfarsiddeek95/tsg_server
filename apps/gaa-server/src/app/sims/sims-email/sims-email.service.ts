// sims-email.service.ts
import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { PrismaService } from '../../prisma.service';

/**
 * Service for handling email operations in the Sims application.
 * It includes functionalities for collaborating on emails, escalating emails to HR,
 * and sending action category based emails.
 */

@Injectable()
export class SimsEmailService {
  // Predefined email sender and reply-to information
  from = {
    email: 'business.systems@thirdspaceportal.com',
    name: 'Third Space Global'
  };
  replyTo: 'business.systems@thirdspaceportal.com';

  simsUserEmail = {
    email: 'sims@thirdspaceportal.com',
    name: 'Third Space Global'
  };

  simsHREmail = {
    email: 'hr@thirdspaceportal.com',
    name: 'Third Space Global'
  };

  constructor(
    @InjectSendGrid() private readonly client: SendGridService,
    private prisma: PrismaService
  ) {}

  /**
   * Sends an email to collaborators.
   * @param {string} email - The recipient's email.
   * @param {string} nonTutorEmployee - The non-tutor employee involved.
   * @param {string} ticketId - The ticket ID related to the email.
   * @param {string} escalatedUser - The user to whom the issue is escalated.
   * @param {string} subject - The subject of the email.
   * @param {string} primaryUser - The primary user involved in the email.
   * @returns A Promise resolved with the SendGrid response or error.
   */
  async collaborateEmailService(
    email: string,
    nonTutorEmployee: string,
    ticketId: string,
    escalatedUser: string,
    subject: string,
    primaryUser?: string
  ): Promise<any> {
    // Implementing the collaborate email service functionality
    try {
      const emailSendTo = process.env.NX_SIMS_DEFAULT_TO_EMAIL;
      const response = await this.client
        .send({
          to: emailSendTo === 'NO_EMAIL' ? email : emailSendTo,
          from: this.simsUserEmail,
          templateId: 'd-3847687c569d4161948b5fdcaf5c6b87',
          dynamicTemplateData: {
            nonTutorEmployee: nonTutorEmployee,
            ticketId: ticketId,
            escalatedUser: escalatedUser,
            subject: `Hey ${nonTutorEmployee}, ${primaryUser} added you as a collaborator for the ticket ID ${ticketId}`
          }
        })
        .then((res) => {
          return {
            success: true,
            message: 'Email sent successfully',
            response: res
          };
        })
        .catch((error) => {
          return {
            success: false,
            error: error,
            message: 'Email sending failed'
          };
        });
    } catch (error) {
      return { success: false, error: error, message: 'Email sending failed' };
    }
  }

  /**
   * Escalates an email to HR.
   * @param {string} email - The recipient's email.
   * @param {string} nonTutorEmployee - The non-tutor employee involved.
   * @param {string} fromEmail - The sender's email.
   * @param {string} ticketId - The ticket ID related to the email.
   * @param {string} escalatedUser - The user to whom the issue is escalated.
   * @param {string} subject - The subject of the email.
   * @param {string} primaryUser - The primary user involved in the email.
   * @returns A Promise resolved with the SendGrid response or error.
   */
  async escalateToHREmailService(
    email: string,
    nonTutorEmployee: string,
    fromEmail: string,
    ticketId: string,
    escalatedUser: string,
    subject: string,
    primaryUser?: string
    // Implementing the escalate to HR email service functionality
  ): Promise<any> {
    try {
      const emailSendTo = process.env.NX_SIMS_DEFAULT_TO_EMAIL;
      const response = await this.client
        .send({
          to: emailSendTo === 'NO_EMAIL' ? email : emailSendTo,
          from: this.simsUserEmail,
          replyTo: fromEmail,
          cc:
            emailSendTo === 'NO_EMAIL'
              ? [
                  'omtmanagement@thirdspaceglobal.com',
                  'centralacademics@thirdspaceglobal.com'
                ]
              : [],
          templateId: 'd-ae3afb3539a0499e99611ea743a94fea',
          dynamicTemplateData: {
            nonTutorEmployee: nonTutorEmployee,
            ticketId: ticketId,
            escalatedUser: escalatedUser,
            subject: `${escalatedUser} has escalated Ticket ID ${ticketId} to HR`
          }
        })
        .then((res) => {
          return {
            success: true,
            message: 'Email sent successfully',
            response: res
          };
        })

        .catch((error) => {
          return error;
        });
    } catch (error) {
      return { success: false, error: error };
    }
  }

  /**
   * Sends an email based on the action category.
   * @param {string} content - The content of the email.
   * @param {string} email - The recipient's email.
   * @param {string} subject - The subject of the email.
   * @param {string} replyToEmail - The reply-to email address.
   * @param {string} ccEmail - The cc email address(es).
   * @param {any} escalated - Information if the email is escalated.
   * @returns A Promise resolved with the SendGrid response or error.
   */
  async actionCategoryMailsService(
    content: string,
    email: string,
    subject: string,
    replyToEmail?: string,
    ccEmail?: string,
    escalated?: any
  ): Promise<any> {
    // Implementing the action category email service functionality
    const emailSendTo = process.env.NX_SIMS_DEFAULT_TO_EMAIL;
    try {
      console.log({
        to: emailSendTo === 'NO_EMAIL' ? email : emailSendTo,
        from: escalated === 1 ? this.simsHREmail : this.simsUserEmail,
        replyTo: replyToEmail,
        cc: ccEmail && ccEmail.split(','),
        bcc: 'productdevelopment@thirdspaceglobal.com',
        templateId: 'd-e6dd09c6438147e69bbea0965e1f15bd',
        dynamicTemplateData: {
          content: content,
          subject: subject
        }
      });

      const response = await this.client
        .send({
          to: emailSendTo === 'NO_EMAIL' ? email : emailSendTo,
          from: escalated === 1 ? this.simsHREmail : this.simsUserEmail,
          replyTo: replyToEmail,
          cc: ccEmail && ccEmail.split(','),
          bcc: 'productdevelopment@thirdspaceglobal.com',
          templateId: 'd-e6dd09c6438147e69bbea0965e1f15bd',
          dynamicTemplateData: {
            content: content,
            subject: subject
          }
        })
        .then((res) => {
          const messageId = res[0].headers
            ? res[0].headers['x-message-id']
            : undefined;
          return {
            success: true,
            message: 'Email sent successfully',
            response: res,
            messageId: messageId
          };
        })
        .catch((error) => {
          return error;
        });

      return {
        success: true,
        message: 'Email sent successfully',
        resp: response
      };
    } catch (error) {
      return { success: false, error: error, message: 'Email sending failed' };
    }
  }

  // reply email
  async sendReplyEmail(
    content: string,
    email: string,
    subject: string,
    replyToEmail?: string,
    ccEmail?: string,
    escalated?: any,
    messageId?: string
  ): Promise<any> {
    // Implementing the action category email service functionality
    const emailSendTo = process.env.NX_SIMS_DEFAULT_TO_EMAIL;
    try {
      const response = await this.client
        .send({
          to: emailSendTo === 'NO_EMAIL' ? email : emailSendTo,
          from: escalated === 1 ? this.simsHREmail : this.simsUserEmail,
          replyTo: replyToEmail,
          cc: ccEmail && ccEmail.split(','),
          bcc: 'productdevelopment@thirdspaceglobal.com',
          templateId: 'd-e6dd09c6438147e69bbea0965e1f15bd',
          dynamicTemplateData: {
            content: content,
            subject: subject
          },
          headers: {
            Reference: messageId,
            'In-Reply-To': messageId
          }
        })
        .then((res) => {
          return {
            success: true,
            message: 'Reply Email sent successfully',
            response: res
          };
        })
        .catch((error) => {
          return error;
        });

      return {
        success: true,
        message: 'Reply Email sent successfully',
        resp: response
      };
    } catch (error) {
      return { success: false, error: error, message: 'Email sending failed' };
    }
  }
}
