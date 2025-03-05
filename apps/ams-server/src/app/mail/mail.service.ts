import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import moment from 'moment';

@Injectable()
export class MailService {
  from = { email: 'careers@thirdspaceportal.com', name: 'Third Space Global' };
  replyTo: 'careers@thirdspaceglobal.com';
  constructor(@InjectSendGrid() private readonly client: SendGridService) {}

  sendEmail() {
    return this.client.send({
      from: this.from,
      to: 'gishan.abeysinghe@gmail.com',
      replyTo: this.replyTo,
      bcc: 'productdevelopment+ams@thirdspaceglobal.com',
      text: 'asdfasdf',
      subject: 'No Subject'
    });
  }

  //not in use ph2
  sendOTPEmail(email: string, otp: string, firstName: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+ams@thirdspaceglobal.com',
      // text: `Your otp is ${otp}`,
      subject: 'OTP',
      // templateId: 'd-d03c82640180420b8a2b8d144a747760', v2 emails
      templateId: 'd-80b547c2b7c944eaa38e23b5f0fa6a92', //v3 emails - Dec 2022
      dynamicTemplateData: {
        otp: `${otp}`,
        first_name: firstName
      }
    });
  }

  //not in use ph2
  sendWelcomeEmail(email: string, password: string, firstName: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+ams@thirdspaceglobal.com',
      subject: 'Welcome to TSG',
      // templateId: 'd-1f78185f48fe41f6ad4cbcd556d5709a', v2 emails
      templateId: 'd-6222ba447b504967a041a791c1a421ba', // v3 emails - Dec 2022
      dynamicTemplateData: {
        frontendUrl,
        username: email,
        password: password,
        first_name: firstName
      }
    });
  }

  sendPasswrodResetOTPEmail(email: string, otp: string, firstName: string) {
    return this.client.send({
      from: this.from,
      to: email,
      bcc: 'productdevelopment+ams@thirdspaceglobal.com',
      // replyTo: {
      //   name: 'Third Space Global',
      //   email: this.replyTo
      // },
      // templateId: 'd-164b6b3874c04d1b9a63dd7c7597fe9d',
      templateId: 'd-5820c8a861c540d1954db2302c1998a0',
      dynamicTemplateData: {
        otp: `${otp}`,
        first_name: firstName
      }
    });
  }

  // website registration - pass email
  sendWebPassEmail(
    email: string,
    firstName: string,
    password?: string,
    tspId?: number
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+ams@thirdspaceglobal.com',
      subject: 'NA',
      // templateId: 'd-d03c82640180420b8a2b8d144a747760', v2 emails
      // templateId: 'd-b81b95899df646c4b9ddbaddf01db4c5', //v3 emails - Dec 2022
      templateId: 'd-99c35b3f4ec94193af0bbd114d58051d', //v4 emails - Apr 2024
      dynamicTemplateData: {
        frontendUrl,
        username: email,
        password: password,
        first_name: firstName,
        tsp_id: tspId,
        currentYear: currentYear
      }
    });
  }

  // website registration - fail email
  sendWebFailEmail(
    email: string,
    firstName: string,
    reasons: string,
    thankYouMsg?: string,
    headerText?: string
  ) {
    const currentYear = moment().year();

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+ams@thirdspaceglobal.com',
      subject: 'NA',
      // templateId: 'd-d03c82640180420b8a2b8d144a747760', v2 emails
      // templateId: 'd-3b4301104def4f508ace34cd6a4d4f17', //v3 emails - Dec 2022
      templateId: 'd-648856784cea4421abf5a97166a886f3', //v4 emails - Apr 2024
      dynamicTemplateData: {
        first_name: firstName,
        reasons,
        thankYouMsg: thankYouMsg ?? '',
        headerText: headerText ?? '',
        currentYear: currentYear
      }
    });
  }

  // website registration - fail email
  sendWebOnHoldIndiaEmail(
    email: string,
    firstName: string,
    headerText?: string
  ) {
    const currentYear = moment().year();

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+ams@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-e4f6c9dc86794ca287b56fb98a06cc24', //v4 emails - Sep 2024
      dynamicTemplateData: {
        first_name: firstName,
        headerText: headerText ?? '',
        currentYear: currentYear
      }
    });
  }

  sendLoginDetailsToCandidate(
    email: string,
    password: string,
    firstName: string
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      subject: 'TSG Application Credentials',
      templateId: 'd-b2c250afe98a4f11b44e2b7bed3fba66', // Candidate Credentials
      dynamicTemplateData: {
        frontendUrl,
        username: email,
        password: password,
        first_name: firstName
      }
    });
  }
}
