import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { MailDataRequired } from '@sendgrid/mail';
import moment = require('moment');

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
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      text: 'asdfasdf',
      subject: 'No Subject'
    });
  }

  sendOTPEmail(email: string, otp: string, firstName: string) {
    email = email.toLowerCase();

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
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

  sendWelcomeEmail(email: string, password: string, firstName: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      subject: 'Welcome to TSG',
      // templateId: 'd-6222ba447b504967a041a791c1a421ba', // v3 emails - Dec 2022 - with credentials
      templateId: 'd-8c9451a5863e45eeb735043f464b7266', // v4 emails - Nov 2023 - Omit_Credentials
      dynamicTemplateData: {
        frontendUrl,
        username: email,
        password: password,
        first_name: firstName
      }
    });
  }

  sendOnHoldEmail(firstName: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-b6b48de5b9b74919a2e625a06bb8ef34', v2 Emails
      templateId: 'd-f10cd3e810b74e6f96c4dc81e7f83723', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName
      }
    });
  }

  sendFailEmail(
    firstName: string,
    email: string,
    errors: string[],
    contents: string[]
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-f8802139ad1b47c8bc95672b02a2d932', v2 emails
      // templateId: 'd-411b729972814ad7b98526313c15514f', //v3 emails - Dec 2022
      templateId: 'd-a966e896762f45298162f9c0b09b8ea5', //v3 emails - testing
      dynamicTemplateData: {
        first_name: firstName,
        errors,
        contents
      }
    });
  }

  sendPasswrodResetOTPEmail(email: string, otp: string, firstName: string) {
    return this.client.send({
      from: this.from,
      to: email,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
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

  sendReminderRegistrationStep1(
    details: { email: string; firstName: string }[]
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const allPartialDetails: Partial<MailDataRequired>[] = details.map(
      (detail) => {
        return {
          from: this.from,
          to: detail.email,
          bcc: 'productdevelopment+gra@thirdspaceglobal.com',
          // templateId: 'd-5df6cdc028c14f68bc3b64901df48994', v2 emails
          templateId: 'd-ecf3d0c398a34f878cc61d2c949bdf74', //v3 emails - Dec 2022
          dynamicTemplateData: {
            first_name: detail.firstName ?? 'Candidate',
            frontendUrl
          }
        };
      }
    );
    if (allPartialDetails.length > 0) {
      return this.client.send(allPartialDetails, true);
    } else {
      return null;
    }
  }

  sendReminderQualificationAndProfilingStage(
    details: { email: string; firstName: string }[]
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const allPartialDetails: Partial<MailDataRequired>[] = details.map(
      (detail) => {
        return {
          from: this.from,
          to: detail.email,
          bcc: 'productdevelopment+gra@thirdspaceglobal.com',
          // templateId: 'd-a9f88f0dcbba43b690e6c35f11b40c4e', v2 emails
          templateId: 'd-d3e822d17f104347b624c6f53d72a382', //v3 emails - Dec 2022
          dynamicTemplateData: {
            first_name: detail.firstName ?? 'Candidate',
            frontendUrl
          }
        };
      }
    );
    if (allPartialDetails.length > 0) {
      return this.client.send(allPartialDetails, true);
    } else {
      return null;
    }
  }

  sendReminderOnlineAssessment(
    details: { email: string; firstName: string }[]
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const allPartialDetails: Partial<MailDataRequired>[] = details.map(
      (detail) => {
        return {
          from: this.from,
          to: detail.email,
          bcc: 'productdevelopment+gra@thirdspaceglobal.com',
          // templateId: 'd-6d8da9cdf38a4d169963f908c55b038b', v2 emails
          templateId: 'd-bfbc1a1b2a394838815e048c14a23c77', //v3 emails - Dec 2022
          dynamicTemplateData: {
            first_name: detail.firstName ?? 'Candidate',
            frontendUrl
          }
        };
      }
    );
    if (allPartialDetails.length > 0) {
      return this.client.send(allPartialDetails, true);
    } else {
      return null;
    }
  }

  sendReminderOnlineAssessmentAfterTwoDays(
    details: { email: string; firstName: string }[]
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const allPartialDetails: Partial<MailDataRequired>[] = details.map(
      (detail) => {
        return {
          from: this.from,
          to: detail.email,
          bcc: 'productdevelopment+gra@thirdspaceglobal.com',
          // templateId: 'd-b58e16f4d4ab418588610c1b9dd755bc', v2 emails
          templateId: 'd-a99f102d7b6243b5bd8cf486fa80a4d5', //v3 emails - Dec 2022
          dynamicTemplateData: {
            first_name: detail.firstName ?? 'Candidate',
            frontendUrl
          }
        };
      }
    );
    if (allPartialDetails.length > 0) {
      return this.client.send(allPartialDetails, true);
    } else {
      return null;
    }
  }

  sendReminderPhoneInterview(details: { email: string; firstName: string }[]) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const allPartialDetails: Partial<MailDataRequired>[] = details.map(
      (detail) => {
        return {
          from: this.from,
          to: detail.email,
          bcc: 'productdevelopment+gra@thirdspaceglobal.com',
          // templateId: 'd-d4f20e6ad46441a09f828f032f311078', v2 emails
          templateId: 'd-97858ddd72e948fc8beeaabf16e881c6', //v3 emails - Dec 2022
          dynamicTemplateData: {
            first_name: detail.firstName ?? 'Candidate',
            frontendUrl
          }
        };
      }
    );
    if (allPartialDetails.length > 0) {
      return this.client.send(allPartialDetails, true);
    } else {
      return null;
    }
  }

  sendReminderTeachingInterview(
    details: { email: string; firstName: string }[]
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const allPartialDetails: Partial<MailDataRequired>[] = details.map(
      (detail) => {
        return {
          from: this.from,
          to: detail.email,
          bcc: 'productdevelopment+gra@thirdspaceglobal.com',
          // templateId: 'd-c051f68de1fa4daf9427b8d785c404b7', v2 emails
          templateId: 'd-cb2da5feec5c44e5889b362448d50f15', //v3 emails - Dec 2022
          dynamicTemplateData: {
            first_name: detail.firstName ?? 'Candidate',
            frontendUrl
          }
        };
      }
    );
    if (allPartialDetails.length > 0) {
      return this.client.send(allPartialDetails, true);
    } else {
      return null;
    }
  }

  sendReminderBeforeTeachingInterview(
    details: { email: string; firstName: string }[]
  ) {
    const allPartialDetails: Partial<MailDataRequired>[] = details.map(
      (detail) => {
        return {
          from: this.from,
          to: detail.email,
          bcc: 'productdevelopment+gra@thirdspaceglobal.com',
          templateId: 'd-1575c7ae54224156bbb14df585e2691a',
          dynamicTemplateData: {
            first_name: detail.firstName ?? 'Candidate'
          }
        };
      }
    );
    if (allPartialDetails.length > 0) {
      return this.client.send(allPartialDetails, true);
    } else {
      return null;
    }
  }

  // pass email v2
  sendPassEmailv2(firstName: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-a43efcfa0cb14db5914f050a1fd2fa91',
      dynamicTemplateData: {
        first_name: firstName,
        username: email
      }
    });
  }

  //not in use
  sendOnHoldEmailv2(email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-9f7aaa02992d4a89accf077fa89daee9',
      dynamicTemplateData: {
        // btn_url: url,
        // first_name: firstName
      }
    });
  }

  sendQulificationPassEmail(firstName: string, email: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-3217ac81636a4002a63910789938fdff', //v2 emails
      templateId: 'd-fc1ca4b6a8584b9bbb0d5f403b24f9c0', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName,
        frontendUrl
      }
    });
  }

  sendQulificationFailEmail(
    firstName: string,
    email: string,
    errors: string[]
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-8722dd0c713b4c719fb2f6c2c12f4db5', v2 emails
      templateId: 'd-82f53f7e408d44b9a0de990fcd42240c', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName,
        errors
      }
    });
  }

  sendQulificationBonusEmail(firstName: string, email: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-72103c7d01b54635aecb87608e3ec5f9', v2 emails
      templateId: 'd-b45de23537da4b1fa5f91a764d0c4bf1', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName,
        frontendUrl
      }
    });
  }

  sendPassMathsEmail(email: string, firstName: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-b8fcc584368b44aea775e3e893c0dd8c', v2 emails
      templateId: 'd-1b04ddfe730a4e8ba55d73b07cbc3e00', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName,
        frontendUrl
      }
    });
  }

  sendFailMathsEmail(email: string, firstName: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-c99a654d8be449a6a273421de7f6d63c', v2 emails
      templateId: 'd-029fdcb9c7554c4dae9fa368c18d824c', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName
      }
    });
  }

  // phone interview
  sendPIPassEmailv2(firstName: string, email: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-10648457673842eb85e3caf5ecd439c9', v2 emails
      templateId: 'd-6621fcfe0b61410a98e32fa25dd42b33', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName,
        frontendUrl
      }
    });
  }

  sendPIFailEmailv2(firstName: string, email: string, reasons: string[]) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-8722dd0c713b4c719fb2f6c2c12f4db5',
      // templateId: 'd-fbf4bb781d844c36b80830ecca177aa2', v2 emails
      templateId: 'd-fe2fee438dbe4381b449d2668f8df49d', //v3 emails - Dec 2022
      dynamicTemplateData: {
        // btn_url: url,
        first_name: firstName,
        reasons
      }
    });
  }

  sendPIWrongNumberEmailv2(firstName: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-cc89fdb4feec4ef88f6d5cee34ce735a', v2 emails
      templateId: 'd-ddf22104706c4029b4d335eceb543861', //v3 emails - Dec 2022
      dynamicTemplateData: {
        // btn_url: url,
        first_name: firstName
      }
    });
  }

  sendPINoAnswerEmailv2(
    firstName: string,
    email: string,
    date: string,
    time: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-69b01be098b54766abe9c6296b81a2dd', v2 emails
      templateId: 'd-478b90d163bb41ef83278ebe0a56547c', //v3 emails - Dec 2022
      dynamicTemplateData: {
        // btn_url: url,
        first_name: firstName,
        date,
        time
      }
    });
  }

  // ** Dropout Mail >> Final Outcome Selected as Dropout
  sendPIDropoutEmailv2(firstName: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-f2772962d2f6488689db161c582f971e', v2 emails
      templateId: 'd-231a4147f1974d4c91044e46e7a74195', //v3 emails - Dec 2022
      dynamicTemplateData: {
        // btn_url: url,
        first_name: firstName
      }
    });
  }

  // ** Dropout Mail >> Use Call Back Option 6 Times
  sendPIDropoutNoanswerEmailv2(firstName: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-28fa3a0b55aa4968b6fa627b2fc0f460', v2 emails
      templateId: 'd-f5ca973c2ea24880a405e7f8f71eeee2', //v3 emails - Dec 2022
      dynamicTemplateData: {
        // btn_url: url,
        first_name: firstName
      }
    });
  }

  sendPIInvestigateEmailv2(firstName: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-954e513bc35140b8a440eb0e1a845606', //'d-50493801c82d424abfc132b393eee3f4' old template
      dynamicTemplateData: {
        // btn_url: url,
        first_name: firstName
      }
    });
  }

  bookedMeetingCandidate() {
    return this.client.send({
      from: this.from,
      to: 'inusha@thirdspaceglobal.com',
      replyTo: 'inusha@thirdspaceglobal.com',
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      text: 'You have successfully booked a meeting!',
      subject: 'Successfully Booked'
    });
  }

  bookPhoneInterview(
    firstName: string,
    email: string,
    eventDate: string,
    eventTime: string,
    location: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-d30e8c01f0e54eed925acdf604f7e7fd', v2 emails
      templateId: 'd-f271b3bb5815472daddd412ffc5d6084', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName,
        event_time: eventTime,
        event_date: eventDate,
        location: location
      }
    });
  }

  bookTeachingInterview(
    firstName: string,
    email: string,
    eventDate: string,
    eventTime: string,
    location: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      // templateId: 'd-0e462366bd024f62811f3b6e591c6f44', v2 emails
      templateId: 'd-eb0b3451e89e418d85229d6d4a7bcc1c', //v3 emails - Dec 2022
      dynamicTemplateData: {
        first_name: firstName,
        event_time: eventTime,
        event_date: eventDate,
        location: location
      }
    });
  }

  sendTIPassEmail(
    first_name: string,
    email: string,
    pass_target_1_targets: string,
    pass_explain: string,
    pass_target_2_targets: string,
    pass_explain_2: string,
    orientation_date: string,
    orientation_time: string,
    orientation_url: string,
    orientation_date_2: string,
    orientationHandbookUrl: string,
    details_url: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-0301c5c12ca54ee490e128044e615667', // v3 emails - 16/01/2022
      dynamicTemplateData: {
        first_name: first_name,
        pass_target_1_targets: pass_target_1_targets,
        pass_explain: pass_explain,
        pass_target_2_targets: pass_target_2_targets,
        pass_explain_2: pass_explain_2,
        orientation_date: orientation_date,
        orientation_time: orientation_time,
        orientation_url: orientation_url,
        orientation_date_2: orientation_date_2,
        booklet_url: orientationHandbookUrl,
        details_url: details_url
      }
    });
  }

  sendTIFailEmail(first_name: string, email: string, fail_comment: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-e5f28be00d9249f2af9627c06033ac4b', // v3 emails - 16/01/2022
      dynamicTemplateData: {
        first_name: first_name,
        fail_comment: fail_comment
      }
    });
  }

  sendTIFailReconsiderEmail(
    first_name: string,
    email: string,
    fail_comment: string
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-a53b105788d84417bd8481fceae24de1', // Outcome of Teaching Interview and Another Opportunity: Primary
      dynamicTemplateData: {
        first_name: first_name,
        fail_comment: fail_comment,
        frontendUrl
      }
    });
  }

  sendTIResheduleEmail(first_name: string, email: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-0fda867ab6c94bcb93a587864591d338', // Reschedule - Rebook your slot for Teaching Interview: Primary
      dynamicTemplateData: {
        first_name: first_name,
        frontendUrl
      }
    });
  }

  sendTINoshowEmail(first_name: string, email: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-ab4ddc3e8a044b6990a22cf3e7dc3f57', // No Show - Rebook your slot for Teaching Interview: Primary
      dynamicTemplateData: {
        first_name: first_name,
        frontendUrl
      }
    });
  }

  sendTIDropoutEmail(first_name: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-711f5c7d433346f4a391f7fa05ea5021', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name
      }
    });
  }

  sendFianlOutcomePass(
    name: string,
    email: string,
    scores: { name: string; score: string }[],
    feedback: string[]
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-bf5b0a9d8b4b48f2aef2b32b2e4f0e55', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        name: name,
        scores: scores,
        feedback: feedback
      }
    });
  }

  sendFianlOutcomeFail(
    name: string,
    email: string,
    scores: { name: string; score: string }[],
    feedback: string[]
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-15f83dc6851c4118859625cdfd321eb3', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        name: name,
        scores: scores,
        feedback: feedback
      }
    });
  }

  sendCredentialsToCandidateEmail(
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

  // gra application 2024 - pass email
  sendGraApplicationPassEmail(email: string, firstName: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_application@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-5ff743b915f14978a2fe03869f4872ec', //v1 emails - Aug 2024
      dynamicTemplateData: {
        first_name: firstName,
        frontendUrl,
        currentYear: currentYear
      }
    });
  }

  // gra application 2024 - fail email
  sendGraApplicationFailEmail(
    email: string,
    firstName: string,
    fail_criteria: string[]
  ) {
    const currentYear = moment().year();

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_application@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-e72fe44daeb349b38bd6d7412aaf04fc', //v1 emails - Aug 2024
      dynamicTemplateData: {
        first_name: firstName,
        fail_criteria,
        currentYear: currentYear
      }
    });
  }

  // gra essential skills assessment (esa) outcome templates
  sendGraEsaOutcomeEmail(
    email: string,
    firstName: string,
    finalOutcome: string
  ) {
    const currentYear = moment().year();
    let templateId = '';
    switch (finalOutcome) {
      //v1 emails - Sep 2024
      case 'Pass':
        templateId = 'd-a000aae21677452fadb2fa68dd498a4b';
        break;
      case 'Fail':
        templateId = 'd-225d03c82990419f963b90d540cb6da0';
        break;
      case 'Drop Out':
        templateId = 'd-c8387c383deb433a890a0fb0215b42a5';
        break;
      case 'On Hold':
        templateId = 'd-9044c49bb65d45d2b4badde0747429a2';
        break;
    }

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_esa@thirdspaceglobal.com',
      subject: 'NA',
      templateId: templateId,
      dynamicTemplateData: {
        first_name: firstName,
        currentYear: currentYear
      }
    });
  }

  // gra esa - missed interview
  sendGraEsaMissedEmail(email: string, firstName: string, withdrawn = false) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();

    if (withdrawn) {
      //GRA_ESA_2024_Missed_Withdraw
      return this.client.send({
        from: this.from,
        to: email,
        replyTo: this.replyTo,
        bcc: 'productdevelopment+gra_application@thirdspaceglobal.com',
        subject: 'NA',
        templateId: 'd-7ce88991815d47b8abd8cb468b014bb7', //v1 emails - Sep 2024
        dynamicTemplateData: {
          first_name: firstName,
          currentYear: currentYear
        }
      });
    } else {
      //GRA_ESA_2024_Missed_Reschedule
      return this.client.send({
        from: this.from,
        to: email,
        replyTo: this.replyTo,
        bcc: 'productdevelopment+gra_application@thirdspaceglobal.com',
        subject: 'NA',
        templateId: 'd-cdda17b857b647298d6f17a30149286e', //v1 emails - Sep 2024
        dynamicTemplateData: {
          first_name: firstName,
          frontendUrl,
          currentYear: currentYear
        }
      });
    }
  }

  sendEsaApssBookingAndRescheduleConfirmation(
    email: string,
    firstName: string,
    eventDate: string,
    eventTime: string,
    bookingVsReschedule = 'Booking'
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();
    let templateId = '';
    switch (bookingVsReschedule) {
      //v1 emails - Sep 2024
      case 'Booking':
        //GRA_ESA_2024_APSS_Booking_Confirmation
        templateId = 'd-fdb6672804274a3fb6df5d9d4186d171';
        break;
      case 'Reschedule':
        //GRA_ESA_2024_APSS_Booking_Rechedule_Confirmation
        templateId = 'd-29f73c96542347fc8779df142694a0f6';
        break;
    }

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+apss@thirdspaceglobal.com',
      templateId: templateId,
      dynamicTemplateData: {
        first_name: firstName,
        event_date: eventDate,
        event_time: eventTime,
        frontendUrl: frontendUrl,
        currentYear: currentYear
      }
    });
  }

  // gra apss - withdraw appointment esa
  sendEsaApssAppointmentWithdrawConfirmation(email: string, firstName: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();

    //GRA_ESA_2024_APSS_Booking_Withdraw_Confirmation
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+apss@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-c5436d70b2a84b639447f30c027e0b61', //v1 emails - Sep 2024
      dynamicTemplateData: {
        first_name: firstName,
        frontendUrl: frontendUrl,
        currentYear: currentYear
      }
    });
  }

  // gra apss - reminder to book esa booking
  sendEsaApssBookingReminder48h(
    details: { email: string; firstName: string }[]
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();

    //GRA_ESA_2024_APSS_Booking_Reminder
    const allPartialDetails: Partial<MailDataRequired>[] = details.map(
      (detail) => {
        return {
          from: this.from,
          to: detail.email,
          bcc: 'productdevelopment+apss_cron@thirdspaceglobal.com',
          templateId: 'd-99868c23c811411bb78e0c9f6d255565', //v1 emails - Sep 2024
          dynamicTemplateData: {
            first_name: detail.firstName ?? 'Candidate',
            frontendUrl: frontendUrl,
            currentYear: currentYear
          }
        };
      }
    );
    if (allPartialDetails.length > 0) {
      return this.client.send(allPartialDetails, true);
    } else {
      return null;
    }
  }

  // gra training welcome email
  sendGraTrainingWelcomeEmail(
    email: string,
    firstName: string,
    trainingLeadName: string,
    eventDate: string,
    eventTime: string,
    eventLink: string,
    l1CallDate: string,
    l2CallDate: string
  ) {
    const currentYear = moment().year();
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_esa@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-c65765f498f04f8e81a2bae609dc8c43', //GRA_FTA_2024_Training_Welcome
      dynamicTemplateData: {
        firstName: firstName,
        frontendUrl: frontendUrl,
        currentYear: currentYear,
        trainingLeadName: trainingLeadName,
        eventDate: eventDate,
        eventTime: eventTime,
        eventLink: eventLink,
        l1CallDate: l1CallDate,
        l2CallDate: l2CallDate
      }
    });
  }

  // gra foundation training assessment (fta) level 1 outcome pass
  sendGraFtaL1PassEmail(
    email: string,
    firstName: string,
    tableTagGenerated1: string,
    tableTagGenerated2: string
  ) {
    const currentYear = moment().year();
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_esa@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-232902cf03d945b8bf3c2abdf55a0856', //GRA_FTA_2024_Foundation_Training Level I - Pass
      dynamicTemplateData: {
        firstName: firstName,
        frontendUrl: frontendUrl,
        currentYear: currentYear,
        tableTagGenerated1: tableTagGenerated1,
        tableTagGenerated2: tableTagGenerated2
      }
    });
  }

  // gra foundation training assessment (fta) level 2 outcome pass
  sendGraFtaL2PassEmail(
    email: string,
    firstName: string,
    tableTagGenerated1: string,
    tableTagGenerated2: string
  ) {
    const currentYear = moment().year();
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_esa@thirdspaceglobal.com',
      subject: 'NA',
      templateId: ' d-b2f17862b20147e59161846419fe3a71', //GRA_FTA_2024_Foundation_Training Level II - Pass
      dynamicTemplateData: {
        firstName: firstName,
        frontendUrl: frontendUrl,
        currentYear: currentYear,
        tableTagGenerated1: tableTagGenerated1,
        tableTagGenerated2: tableTagGenerated2
      }
    });
  }

  // gra foundation training assessment (fta) outcome fail
  sendGraFtaL1AndL2FailEmail(
    email: string,
    firstName: string,
    foundationTrainingLevel: string,
    failCriteria: string[],
    tableTagGenerated1: string,
    tableTagGenerated2: string
  ) {
    const currentYear = moment().year();
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_esa@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-be839175384a45f2a500d49c411c0e58', //GRA_FTA_2024_Foundation Training Level I and II - Fail
      dynamicTemplateData: {
        firstName: firstName,
        frontendUrl: frontendUrl,
        currentYear: currentYear,
        foundationTrainingLevel: foundationTrainingLevel,
        failCriteria: failCriteria,
        tableTagGenerated1: tableTagGenerated1,
        tableTagGenerated2: tableTagGenerated2
      }
    });
  }

  // gra foundation training assessment (fta) outcome reconsider
  sendGraFtaL1AndL2ReconsiderEmail(
    email: string,
    firstName: string,
    foundationTrainingLevel: string,
    failCriteria: string[],
    tableTagGenerated1: string,
    tableTagGenerated2: string
  ) {
    const currentYear = moment().year();
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_esa@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-5a2e2e886a1143c4b89384d0907110b9', //GRA_FTA_2024_Foundation_Training_Level I and II - Reattempt
      dynamicTemplateData: {
        firstName: firstName,
        frontendUrl: frontendUrl,
        currentYear: currentYear,
        foundationTrainingLevel: foundationTrainingLevel,
        failCriteria: failCriteria,
        tableTagGenerated1: tableTagGenerated1,
        tableTagGenerated2: tableTagGenerated2
      }
    });
  }

  // gra fta - missed interview
  sendGraFtaL1AndL2MissedEmail(
    email: string,
    firstName: string,
    foundationTrainingLevel = 1
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();

    //GRA_FTA_2024_Missed_Reschedule
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra_application@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-31b1cdeac7f349af97f24133a9261a2c', //v1 emails - nov 2024
      dynamicTemplateData: {
        first_name: firstName,
        frontendUrl,
        currentYear: currentYear,
        foundationTrainingLevel: foundationTrainingLevel === 1 ? 'I' : 'II',
        stepNumber: foundationTrainingLevel === 1 ? 4 : 5
      }
    });
  }

  sendFtaL1AndL2ApssBookingAndRescheduleConfirmation(
    email: string,
    firstName: string,
    eventDate: string,
    eventTime: string,
    isReschedule = false,
    foundationTrainingLevel = 1
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();
    let templateId = '';
    switch (foundationTrainingLevel) {
      case 1:
        //GRA_FTA_L1_2024_APSS_Booking_AND_Rechedule_Confirmation
        templateId = 'd-d88b48242ada44d7a74a205b18b78180'; //v1 emails - nov 2024
        break;
      case 2:
        //GRA_FTA_L2_2024_APSS_Booking_AND_Rechedule_Confirmation
        templateId = 'd-c06bf1ac58f84984952c33fb834fdf94'; //v1 emails - nov 2024
        break;
    }

    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+apss@thirdspaceglobal.com',
      templateId: templateId,
      dynamicTemplateData: {
        firstName: firstName,
        currentYear: currentYear,
        frontendUrl: frontendUrl,
        eventString: isReschedule
          ? `We’re pleased to confirm that your Foundation Training Level ${
              foundationTrainingLevel === 1 ? 'I' : 'II'
            } Assessment for the Online Math Tutor position at Third Space Global has been successfully rescheduled. Your new appointment is booked for ${eventDate} at ${eventTime}.`
          : `Great news! Your Level I Assessment Demo has been successfully scheduled for ${eventTime} on ${eventDate}.`,
        isReschedule: isReschedule
      }
    });
  }

  // gra apss - withdraw appointment fta
  sendFtaL1AndL2ApssAppointmentWithdrawConfirmation(
    email: string,
    firstName: string,
    foundationTrainingLevel = 1
  ) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    const currentYear = moment().year();

    //GRA_FTA_2024_APSS_Booking_Withdraw_Confirmation
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+apss@thirdspaceglobal.com',
      subject: 'NA',
      templateId: 'd-d29b976ab9414d1a949c0be40c07c3cb', //v1 emails - Nov 2024
      dynamicTemplateData: {
        first_name: firstName,
        frontendUrl: frontendUrl,
        currentYear: currentYear,
        foundationTrainingLevel: foundationTrainingLevel === 1 ? 'I' : 'II',
        stepNumber: foundationTrainingLevel === 1 ? 4 : 5
      }
    });
  }

  sendSimpleTestEmail(
    sendtoEmail: string,
    emailSubject: string,
    emailContent: string
  ) {
    return this.client.send({
      from: this.from,
      to: sendtoEmail,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      subject: emailSubject,
      html: emailContent
    });
  }
}
