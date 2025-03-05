import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import moment from 'moment';

@Injectable()
export class MailService {
  from = {
    email: 'business.systems@thirdspaceportal.com',
    name: 'Third Space Global'
  };
  replyTo: 'business.systems@thirdspaceportal.com';
  constructor(@InjectSendGrid() private readonly client: SendGridService) {}

  async sendLeaveApplicationEmail(managerData, leaveData) {
    return this.client.send({
      from: this.from,
      to: managerData.userEmail,
      replyTo: this.replyTo,
      subject: 'New Leave Application',
      templateId: 'd-c9136af1b0c44e798eed5bde74368051',
      dynamicTemplateData: {
        managerName: managerData.userName,
        employeeName: leaveData.short_name,
        leaveType: leaveData.policy_name,
        reason: leaveData.reason,
        duration: leaveData.leave_duration,
        shift: leaveData.shift,
        fromDate: moment(leaveData.from_date).format('YYYY-MM-DD'),
        toDate: moment(leaveData.to_date).format('YYYY-MM-DD'),
        numDays: leaveData.num_of_days,
        btnUrl: 'https://beta.thirdspaceglobal.com'
      }
    });
  }

  async sendLeaveCancelEmail(managerData, leaveData) {
    return this.client.send({
      from: this.from,
      to: managerData.userEmail,
      replyTo: this.replyTo,
      subject: 'Leave Application Cancelled',
      templateId: 'd-d4b112da328c47a785a9a1e6b7807f4f',
      dynamicTemplateData: {
        managerName: managerData.userName,
        employeeName: leaveData.short_name,
        leaveType: leaveData.policy_name,
        reason: leaveData.cancel_request_reason,
        duration: leaveData.leave_duration,
        shift: leaveData.shift,
        fromDate: moment(leaveData.from_date).format('YYYY-MM-DD'),
        toDate: moment(leaveData.to_date).format('YYYY-MM-DD'),
        numDays: leaveData.num_of_days,
        btnUrl: 'https://beta.thirdspaceglobal.com'
      }
    });
  }

  async sendLeaveUpdateEmail(userData, leaveData, leaveStatus) {
    let template = '';
    switch (leaveStatus) {
      case 2:
        template = 'd-048cb7ea31754ca886475f8fee1d61d2';
        break;
      case 3:
        template = 'd-e5d2725bb88242f9b47056c401f767cc';
        break;
      case 4:
        template = 'd-53ac1859f5ea4d04a44478833ade03c6';
        break;
      default:
        template = 'd-a283ac3266b84d829513e8cd2379ebff';
    }

    return this.client.send({
      from: this.from,
      to: userData.userEmail,
      replyTo: this.replyTo,
      templateId: template,
      dynamicTemplateData: {
        employeeName: leaveData.short_name,
        leaveType: leaveData.policy_name,
        reason: leaveData.reason,
        duration: leaveData.leave_duration,
        shift: leaveData.shift,
        fromDate: moment(leaveData.from_date).format('YYYY-MM-DD'),
        toDate: moment(leaveData.to_date).format('YYYY-MM-DD'),
        numDays: leaveData.num_of_days
      }
    });
  }

  async sendAuditRemindEmail(ntData) {
    return this.client.send({
      from: this.from,
      to: ntData.workEmail,
      replyTo: this.replyTo,
      subject: 'Audit Profile Reminder',
      templateId: 'd-c9136af1b0c44e798eed5bde74368051xx',
      dynamicTemplateData: {
        ntName: ntData.prefered_name,
        ntTspId: ntData.hr_tsp_id,
        btn_url: 'https://beta.thirdspaceglobal.com'
      }
    });
  }

  async sendProfileUpdateRemindEmail(ntData) {
    return this.client.send({
      from: this.from,
      to: ntData.workEmail,
      replyTo: this.replyTo,
      subject: 'Audit Profile Reminder',
      templateId: 'd-c9136af1b0c44e798eed5bde74368051xx',
      dynamicTemplateData: {
        ntName: ntData.prefered_name,
        ntTspId: ntData.hr_tsp_id,
        btn_url: 'https://beta.thirdspaceglobal.com'
      }
    });
  }
}
