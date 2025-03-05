import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { PrismaService } from '../prisma/prisma.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class EmailService {
  from = {
    email: 'business.systems@thirdspaceportal.com',
    name: 'Third Space Global'
  };
  replyTo: 'business.systems@thirdspaceportal.com';
  constructor(
    @InjectSendGrid() private readonly client: SendGridService,
    private prisma: PrismaService
  ) {}

  // ---- capacity admin approves/ reject the time off requests for the day
  async TutorTimeOffActionedService(params: {
    subject: string;
    email: string;
    first_name: string;
    requests: any;
    date: any;
    reason: any;
    supervisorBcc: string[];
  }) {
    const {
      subject,
      email,
      first_name,
      date,
      requests,
      supervisorBcc,
      reason
    } = params;
    const login = process.env.FRONT_URL;

    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-9185a687c20c4a9a882461370705ce65',
      bcc: supervisorBcc,
      dynamicTemplateData: {
        first_name: first_name,
        subject: subject,
        requests: requests,
        date: date,
        reason: reason,
        buttonUrl: login
      }
    });
  }

  // ---- tutor applies for a time off. All time offs applied through one request will come as one email to Capacity admin
  async AdminTimeOffRequestService(params: {
    subject: string;
    email: string;
    tutorName: string;
    tutorId: string;
    requests: any;
    supervisorBcc: string[];
  }) {
    const { subject, email, tutorName, tutorId, supervisorBcc, requests } =
      params;
    const login = process.env.FRONT_URL;
    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-8e69d2c0358b4cb2be06deefe1a7f9cd',
      bcc: supervisorBcc,
      dynamicTemplateData: {
        tutorName: tutorName,
        subject: subject,
        tutorId: tutorId,
        requests: requests,
        buttonUrl: login
      }
    });
  }

  // ---- capacity admin applies time off for the tutor
  async TutorSubordinateTimeOffService(params: {
    subject: string;
    email: string;
    tutorName: string;
    requests: any;
    supervisorBcc: string[];
  }) {
    const { subject, email, tutorName, supervisorBcc, requests } = params;
    const login = process.env.FRONT_URL;
    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      bcc: supervisorBcc,
      templateId: 'd-37abcac46f1945128f269d39e749a702',
      dynamicTemplateData: {
        tutorName: tutorName,
        subject: subject,
        requests: requests,
        buttonUrl: login
      }
    });
  }

  // ----  tutor cancels an applied time of before approving or rejecting capacity admin will receive the email
  async AdminTimeOffCancellationService(params: {
    subject: string;
    email: string;
    tutorName: string;
    tutorId: string;
    requests: any;
    supervisorBcc: string[];
  }) {
    const { subject, email, tutorName, tutorId, supervisorBcc, requests } =
      params;
    const login = process.env.FRONT_URL;
    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      bcc: supervisorBcc,
      templateId: 'd-409367fc3d5e4518bd7f6e46e45e3c30',
      dynamicTemplateData: {
        tutorName: tutorName,
        tutorId: tutorId,
        subject: subject,
        requests: requests,
        buttonUrl: login
      }
    });
  }

  // ----  tutor cancels an applied time of before approving or rejecting capacity tutor will receive the email
  async TutorTimeOffCancellationService(params: {
    subject: string;
    email: string;
    tutorName: string;
    tutorId: string;
    requests: any;
  }) {
    const { subject, email, tutorName, tutorId, requests } = params;
    const login = process.env.FRONT_URL;

    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-971117052ca7463783b17e957e16b437',
      dynamicTemplateData: {
        tutorName: tutorName,
        tutorId: tutorId,
        subject: subject,
        requests: requests,
        buttonUrl: login
      }
    });
  }

  // ----  relationship manager applies an adhoc time off for the tutor
  async AdhocTimeOffService(params: {
    subject: string;
    email: string;
    tutorName: string;
    requests: any;
    supervisorBcc: string[];
  }) {
    const { subject, email, tutorName, requests, supervisorBcc } = params;
    const login = process.env.FRONT_URL;
    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-7d892cca9c864197b03d5255055d051f',
      bcc: supervisorBcc,
      dynamicTemplateData: {
        tutorName: tutorName,
        subject: subject,
        // tutorId: tutorId,
        // date:date,
        requests: requests,
        buttonUrl: login
      }
    });
  }
  // ---- tutor sends a change request for their availability
  async AdminAvailabilityChangeRequestService(params: {
    subject: string;
    email: string;
    tutorName: string;
    tutorId: string;
    currentAvailability: number;
    effectiveDate: string;
    reasonForChange: string;
    increasedSlots: number;
    decreasedSlots: number;
    supervisorBcc: string[];
    ccEmails?: string[];
  }) {
    const {
      tutorName,
      subject,
      tutorId,
      currentAvailability,
      effectiveDate,
      reasonForChange,
      increasedSlots,
      decreasedSlots,
      email,
      supervisorBcc,
      ccEmails
    } = params;
    const login = process.env.FRONT_URL;

    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-23c3cbf296584f1da756c7903b554213',
      bcc: supervisorBcc,
      cc: ccEmails.length > 0 ? ccEmails : undefined,
      dynamicTemplateData: {
        tutorName: tutorName,
        subject: subject,
        tutorId: tutorId,
        currentAvailability: currentAvailability,
        effectiveDate: effectiveDate,
        reasonForChange: reasonForChange,
        increasedSlots: increasedSlots,
        decreasedSlots: decreasedSlots,
        buttonUrl: login
      }
    });
  }

  // ---- capacity team actions on a change request
  async TutorAvailabilityChangeRequestActionedService(params: {
    subject: string;
    email?: string;
    tutorName?: string;
    date?: string;
    requests?: any;
    rejectedReason?: any;
    unAcceptedReason?: any;
    supervisorBcc: string[];
  }) {
    const {
      subject,
      email,
      tutorName,
      date,
      requests,
      rejectedReason,
      unAcceptedReason,
      supervisorBcc
    } = params;
    const login = process.env.FRONT_URL;
    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-0bdaecc96f3d437b8f42eb2697b67e97',
      bcc: supervisorBcc,
      dynamicTemplateData: {
        tutorName: tutorName,
        subject: subject,
        date: date,
        requests: requests,
        rejectedReason: rejectedReason,
        unAcceptedReason: unAcceptedReason,
        buttonUrl: login
      }
    });
  }

  // ---- tutor cancels a pending change request
  async TutorAvailabilityChangeRequestCancellationService(params: {
    subject: string;
    email: string;
    tutorName: string;
    tutorId: string;
    effectiveDate: string;
    appliedDate: string;
    reasonForChange: string;
    increasedSlots: number;
    decreasedSlots: number;
    cancellationReason: string;
    supervisorBcc: string[];
  }) {
    const {
      tutorName,
      subject,
      tutorId,
      effectiveDate,
      appliedDate,
      reasonForChange,
      cancellationReason,
      increasedSlots,
      decreasedSlots,
      email,
      supervisorBcc
    } = params;
    const login = process.env.FRONT_URL;

    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-a71454a7c42a45f880fde669f8b4b28b',
      bcc: supervisorBcc,
      dynamicTemplateData: {
        tutorName: tutorName,
        subject: subject,
        tutorId: tutorId,
        appliedDate: appliedDate,
        cancellationReason: cancellationReason,
        effectiveDate: effectiveDate,
        reasonForChange: reasonForChange,
        increasedSlots: increasedSlots,
        decreasedSlots: decreasedSlots,
        buttonUrl: login
      }
    });
  }

  // ---- Admin accept the availability changes email send to tutor
  async TutorChangesMadeToAvailabilityByAdminService(params: {
    subject: string;
    email?: string;
    tutorName?: string;
    date?: string;
    requests?: any;
    isInformation?: any;

    supervisorBcc: string[];
    ccEmails?: string[];
  }) {
    const {
      subject,
      email,
      tutorName,
      date,
      requests,
      supervisorBcc,
      isInformation,
      ccEmails
    } = params;
    const login = process.env.FRONT_URL;

    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-b684efa222d640fd8c32ac81af9c7804',
      bcc: supervisorBcc,
      cc: ccEmails.length > 0 ? ccEmails : undefined,
      dynamicTemplateData: {
        tutorName: tutorName,
        subject: subject,
        date: date,
        requests: requests,
        isInformation: isInformation,
        buttonUrl: login
      }
    });
  }

  // ---- tutor initial availability changed
  async TutorInitialAvailabilityActionedService(
    subject: string,
    email: string,
    tutorName: string,
    date: string,
    requests: string,
    unAcceptedToInactive: any,
    activeToInactive: any,
    activeToUnaccepted: any
  ) {
    const login = process.env.FRONT_URL;
    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-190b7ebe44714de3a2ef91bb487fef79',
      dynamicTemplateData: {
        tutorName: tutorName,
        subject: subject,
        date: date,
        requests: requests,
        unAcceptedToInactive: unAcceptedToInactive,
        activeToInactive: activeToInactive,
        activeToUnaccepted: activeToUnaccepted,
        buttonUrl: login
      }
    });
  }
  // ---- get supervisor email
  async getSupervisorEmail(tutorTspId: number) {
    try {
      const supervisor = await this.prisma.tmApprovedStatus.findUnique({
        where: {
          tutorTspId: tutorTspId
        },
        select: {
          supervisorTspId: true
        }
      });

      const email = await this.prisma.nonTutorDirectory.findUnique({
        where: {
          hr_tsp_id: supervisor.supervisorTspId
        },
        select: {
          tsg_email: true
        }
      });
      return email?.tsg_email;
    } catch (error) {
      throw Error(error.message);
    }
  }

  // ---- get tutor name
  async getTutorName(tsp_id: number) {
    const name = await this.prisma.tslUser.findFirst({
      where: {
        tsp_id: tsp_id
      },
      select: {
        tsl_full_name: true
      }
    });

    return name.tsl_full_name;
  }

  // ---- get tutor Id
  async getTutorId(tsp_id: number) {
    const tutorId = await this.prisma.tslUser.findFirst({
      where: {
        tsp_id: tsp_id
      },
      select: {
        tsl_id: true
      }
    });

    return tutorId.tsl_id;
  }

  // ---- get tutor email -
  async getTutorEmail(tsp_id: number) {
    return await this.prisma.$transaction(async (tx) => {
      const email = await tx.approvedContactData.findUnique({
        where: {
          tspId: tsp_id
        },
        select: {
          workEmail: true
        }
      });

      return email.workEmail;
    });
  }

  // send invoice to tutor
  async SendInvoiceService(params: {
    tutorName: string;
    email: any;
    invoiceId: string;
    invoiceType: string;
    invoicePeriod: string;
    subjectDate: string;
    supervisorBcc: string[];
    tutorId: number;
  }) {
    const {
      tutorName,
      email,
      invoiceId,
      invoiceType,
      invoicePeriod,
      subjectDate,
      supervisorBcc,
      tutorId
    } = params;
    const login = process.env.FRONT_URL;
    const date = moment().format();

    const modifiedDate = moment(date);

    if (modifiedDate.day() === 5) {
      // If it's Friday, add 3 days to skip the weekend and go to Monday
      modifiedDate.add(3, 'days');
    } else {
      // Otherwise, add 1 day
      modifiedDate.add(1, 'day');
    }
    const formattedDate = modifiedDate.format('DD-MM-YYYY');

    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      bcc: supervisorBcc,
      templateId: 'd-a79da809734b4c7abf76e04fb8d6359a',
      dynamicTemplateData: {
        tutorName: tutorName,
        date: formattedDate,
        invoiceId: invoiceId,
        invoiceType: invoiceType,
        invoicePeriod: invoicePeriod,
        tutorId: tutorId,
        emailSubject: `Your Invoice for ${subjectDate} has been uploaded`,
        buttonUrl: login
      }
    });
  }

  // send updated invoice to tutor
  async UpdateInvoiceService(params: {
    tutorName: string;
    email: string;
    invoiceId: string;
    invoiceType: string;
    invoicePeriod: string;
    subjectDate: string;
    supervisorBcc: string[];
    tutorId: number;
  }) {
    const {
      tutorName,
      email,
      invoiceId,
      invoiceType,
      invoicePeriod,
      subjectDate,
      supervisorBcc,
      tutorId
    } = params;
    const login = process.env.FRONT_URL;
    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      bcc: supervisorBcc,
      templateId: 'd-eab3233360e34a1a9459e352bfadd572',
      dynamicTemplateData: {
        tutorName: tutorName,
        invoiceId: invoiceId,
        invoiceType: invoiceType,
        invoicePeriod: invoicePeriod,
        emailSubject: `Your Invoice for ${subjectDate} has been updated`,
        tutorId: tutorId,
        buttonUrl: login
      }
    });
  }

  // ---- capacity admin approves/ reject the time off requests for the day
  async PermanentSwapNotificationEmailService(params: {
    email: string;
    firstName: string;
    tutorManagerEmail: string;
    tutorId: number;
    sessionType: string;
    date: any;
    sessionSlot: string;
  }) {
    const {
      email,
      firstName,
      tutorId,
      date,
      sessionType,
      sessionSlot,
      tutorManagerEmail
    } = params;
    const login = process.env.FRONT_URL;

    return this.client.send({
      to: email,
      from: this.from,
      replyTo: this.replyTo,
      templateId: 'd-e8a53ac2aee74b8ba3c913953085abbf',
      bcc: 'tutormanagement@thirdspaceglobal.com',
      cc: tutorManagerEmail,
      dynamicTemplateData: {
        firstName: firstName,
        tutorId: tutorId,
        sessionType: sessionType,
        date: date,
        sessionSlot: sessionSlot,
        emailSubject: `New Session Assigned to You - ${tutorId} - ${sessionSlot}`,
        buttonUrl: login
      }
    });
  }
}
