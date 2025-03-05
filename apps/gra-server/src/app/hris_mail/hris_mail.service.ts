import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { MailDataRequired } from '@sendgrid/mail';

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

  // Candidate Email

  sendInitialAuditPass(first_name: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-0ecb91cafba44d5bab00759e9a2826e9', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name
      }
    });
  }

  sendContractFail(
    first_name: string,
    email: string,
    auditorComments: string,
    auditorName: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-6113e1573fa849b2be66b296bb190089', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name,
        auditorComments: auditorComments,
        auditorName: auditorName
      }
    });
  }

  sendFinalFail(first_name: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-0147a3e03256474c89335ecd915ac0ff', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name
      }
    });
  }

  sendInitialFail(
    first_name: string,
    fieldname: string,
    auditorComments: string,
    email: string,
    auditorName: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-8e895ec4795a448fbd921076401624ed', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name,
        fieldname: fieldname,
        auditorComments: auditorComments,
        auditorName: auditorName
      }
    });
  }

  sendTutorActivationMail(
    first_name: string,
    username: string,
    email: string,
    password: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-1d6de4b66d5e4cd3bd3a3a977856cf5e', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name,
        username: username,
        password: password
      }
    });
  }

  sendInitialAuditReject(first_name: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-71b0ed33ef924b3588003a6a954d126e', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name
      }
    });
  }

  //Refree Email

  sendRefree(
    title: string,
    fullname: string,
    candidate_name: string,
    email: string,
    date: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+gra@thirdspaceglobal.com',
      templateId: 'd-74c6dd7c44eb47d1b0b59e9c78a6792e', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        fullname: fullname,
        title: title,
        date: date,
        candidate_name: candidate_name
      }
    });
  }
}
