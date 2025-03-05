import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
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
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
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
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-0ecb91cafba44d5bab00759e9a2826e9', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name
      }
    });
  }

  // notify candidate on contract being assgined
  sendContractAssigned(
    first_name: string,
    tsp_id: number,
    deadline: string,
    omt_sdhedule: string,
    subject: string,
    frontendURL: string,
    email: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-53b0b5663ae247309ec3cf31375b2f7b', // HRIS_TSG Service Provider Contract
      dynamicTemplateData: {
        first_name: first_name,
        tsp_id: tsp_id,
        deadline: deadline,
        omt_sdhedule: omt_sdhedule,
        subject: subject,
        frontendURL: frontendURL
      }
    });
  }

  //NOTE: currently being used for both cotract audit fail & tutor status - contract audit fail
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
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
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
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-0147a3e03256474c89335ecd915ac0ff', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name
      }
    });
  }

  sendInitialAuditFail(
    first_name: string,
    auditorComments: string,
    email: string,
    auditorName: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-8e895ec4795a448fbd921076401624ed', // Initial Fail - Third Space Global
      dynamicTemplateData: {
        first_name: first_name,
        auditorComments: auditorComments,
        auditorName: auditorName
      }
    });
  }

  sendTutorActivationMail(first_name: string, email: string) {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-1d6de4b66d5e4cd3bd3a3a977856cf5e', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name,
        frontendUrl
      }
    });
  }

  sendInitialAuditReject(first_name: string, email: string) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-71b0ed33ef924b3588003a6a954d126e', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name
      }
    });
  }

  // Auditor Email

  sendNotifyAuditorAssigned(
    email: string,
    first_name: string,
    totalRecordsCount: string,
    applicant_name: string,
    tspId: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-f6380e02acf64f2faff589f8c92adc02', // Notify Auditor when Audit Assigned - Third Space Global
      dynamicTemplateData: {
        first_name: first_name,
        applicant_name: applicant_name,
        totalRecordsCount: totalRecordsCount,
        tspId: tspId
      }
    });
  }

  sendNotifyAuditorAssignedBulk(
    email: string,
    first_name: string,
    totalRecordsCount: string,
    tableTagGenerated: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-e79336afe9ea4648b8e26c05ba52c8cf', // Notify Auditor when Bulk Audit Assigned - Third Space Global
      dynamicTemplateData: {
        first_name: first_name,
        totalRecordsCount: totalRecordsCount,
        tableTagGenerated: tableTagGenerated
      }
    });
  }

  //notify auditor when tutor has signed a contract
  sendNotifyAuditorContractUploaded(
    email: string,
    first_name: string,
    candidateName: string,
    tspId: string,
    contract_assigned_at: string,
    contract_uploaded_at: string,
    contract_info: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-6d96c5ff89ff41da84a3e0b522127d17', // Notify Auditor Contract Pending Audit - HRIS
      dynamicTemplateData: {
        first_name: first_name,
        candidateName: candidateName,
        tspId: tspId,
        contract_assigned_at: contract_assigned_at,
        contract_uploaded_at: contract_uploaded_at,
        contract_info: contract_info
      }
    });
  }

  sendNotifyAuditorRight2WorkUploaded(
    email: string,
    first_name: string,
    candidateName: string,
    tspId: string,
    documents_pending_approval: string, //accept html
    profileState: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-14c350d0e85141d68b3384e02e4df7e3', // Notify Auditor Right to Work Pending Audit - HRIS
      dynamicTemplateData: {
        first_name: first_name,
        candidateName: candidateName,
        tspId: tspId,
        documents_pending_approval: documents_pending_approval,
        profileState: profileState
      }
    });
  }

  sendNotifyAuditorResubmission(
    first_name: string,
    candidateName: string,
    field_name: string,
    email: string,
    tspId: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-9a95394c47064695a72c575c5ba346fd', // Notify Auditor When Audit Resubmission - Third Space Global
      dynamicTemplateData: {
        first_name: first_name,
        candidateName: candidateName,
        field_name: field_name,
        tspId: tspId
      }
    });
  }

  // HR User Email

  sendAfterTrainingAuditRejected(
    first_name: string,
    reason: string,
    batch: string,
    email: string,
    tspId: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-948906eab4184ff094a51f8c6c84c419 ', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name,
        reasons: reason,
        batch: batch,
        tspId: tspId
      }
    });
  }

  //NOTE: tableData is expected to be an object of given shape which generate relevent data as table in sendgrid template
  // send to hr admin notification to approve job data (triggered by hr user
  sendHRJobDetails(
    first_name: string,
    totalRecordCount: string,
    batch: string,
    email: string,
    tableData: Array<{ tspId: number; shortName: string }>
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-014f9389a020441395a6ff83e7d5852a', // HRIS_HR Job Details To Be Approved
      dynamicTemplateData: {
        first_name: first_name,
        totalRecordCount: totalRecordCount,
        batch: batch,
        tableData: tableData
      }
    });
  }

  //NOTE: tableData is expected to be an object of given shape which generate relevent data as table in sendgrid template
  // send to hr admin notification to approve contract data (triggered by hr user)
  sendHRContractDetails(
    first_name: string,
    totalRecordCount: string,
    date_assigned: string,
    assigned_by: string,
    contract_type: string,
    contract_start: string,
    tableData: Array<{ tspId: number; shortName: string }>,
    email: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-f648c109766948a0812446a02de37472', // HRIS_HR Contract Details To Be Approved
      dynamicTemplateData: {
        first_name: first_name,
        totalRecordCount: totalRecordCount,
        date_assigned: date_assigned,
        assigned_by: assigned_by,
        contract_type: contract_type,
        contract_start: contract_start,
        tableData: tableData
      }
    });
  }

  sendNotifyHrAdminTutor(
    first_name: string,
    tutorName: string,
    batch: string,
    email: string,
    tspId: string,
    pccStatus: string,
    contractStatus: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-c32c21e0c81c43ba90c442b4c44fc448', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name,
        contractStatus: contractStatus,
        batch: batch,
        tspId: tspId,
        tutorName: tutorName,
        pccStatus: pccStatus
      }
    });
  }

  sendJobRequisitionReject(
    first_name: string,
    batch: string,
    email: string,
    tspId: string,
    reason: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-2e18ee3140f14722a6c7e69bde8006e7', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name,
        reason: reason,
        batch: batch,
        tspId: tspId
      }
    });
  }

  //Operation Email

  sendNotifyOperations(
    first_name: string,
    shortName: string,
    email: string,
    tspId: string,
    workEmail: string,
    gender: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-e3b349c1bee94e6a92a6f5f61427f567 ', // Hey! We've been trying to reach you
      dynamicTemplateData: {
        first_name: first_name,
        workEmail: workEmail,
        shortName: shortName,
        tspId: tspId,
        gender: gender
      }
    });
  }

  //Referee 1st reference request or 3day reminder
  sendRefereeReferenceRequestOrReminder(
    refereeTitleName: string,
    candidateName: string,
    dueDate: string,
    formLink: string,
    toEmail: string,
    isReminder = false
  ) {
    return this.client.send({
      from: this.from,
      to: toEmail,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: isReminder
        ? 'd-bc43dd0e04e94ea9a604f3ad232bcec3'
        : 'd-74c6dd7c44eb47d1b0b59e9c78a6792e', //HRIS_Referee_Reference_Reminder //HRIS_Referee_Reference_Request
      dynamicTemplateData: {
        refereeTitleName,
        candidateName,
        dueDate,
        formLink
      }
    });
  }

  //Candidate 3 day reference reminder
  sendCandidate3DayReferenceReminder(
    refereeTitleName: string,
    candidateName: string,
    dueDate: string,
    toEmail: string
  ) {
    return this.client.send({
      from: this.from,
      to: toEmail,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-6dfa89a533ce4bd290196d82849e133d', //HRIS_Candidate_Reference_Reminder
      dynamicTemplateData: {
        refereeTitleName,
        candidateName,
        dueDate
      }
    });
  }

  //Candidate 5 day reference overdue
  sendCandidate5DayReferenceOverdue(
    refereeTitleName: string,
    candidateName: string,
    toEmail: string
  ) {
    return this.client.send({
      from: this.from,
      to: toEmail,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-9034fc40962e490fa10eae25d159831d', //HRIS_Candidate_Reference_Overdue
      dynamicTemplateData: {
        refereeTitleName,
        candidateName
      }
    });
  }

  /**
   * // PCC reminder emails
   * 'PCC Expiring Notice'
   * 'PCC First Reminder'
   * 'PCC Final Reminder'
   * 'PCC First Extension'
   * 'PCC Deadline Over'
   * 'Termination due to non submission of PCC'
   * 'PCC Requirement'
   */
  sendPccCronNoticeEmail(
    tspIdText: string,
    email: string,
    tutorFirstName: string,
    subject: string,
    ccEmails: any[],
    content: string
  ) {
    return this.client.send({
      from: this.from,
      to: email,
      cc: ccEmails,
      replyTo: this.replyTo,
      bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      // cc: ['banuka+test_pcc@thirdspaceglobal.com', 'banuka'],
      templateId: 'd-4d2ec36801cd438486b609a3049eb543', // PCC_PccCronNoticeEmail
      dynamicTemplateData: {
        tspIdText,
        tutorFirstName,
        subject,
        content
      }
    });
  }

  // notification emails to system/ticketing
  /**
   * notify hris@ticketsthirdspaceportal.com on tutor updating key profile data
   * mentioning that new data have been added to the relevant field
   * Health Declarations
   * Bank Details
   * Qualifications
   * Work Email
   * PCC
   * IT Requirements
   */
  sendNotification2Ticketsthirdspaceportal(
    tspIdText: string,
    tutorName: string,
    tutorEmail: string,
    section: string,
    now?: string
  ) {
    return this.client.send({
      from: this.from,
      to: 'hris@ticketsthirdspaceportal.com',
      // to: 'banuka+test_ticket@thirdspaceglobal.com',
      replyTo: this.replyTo,
      // bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-6f16d8816051443f854f269f63d1a0a9', //HRIS_notify_ticketsthirdspaceportal //TODO: add new tamplate key here Banuka
      dynamicTemplateData: {
        tspIdText,
        tutorName,
        tutorEmail,
        section,
        now: moment().format('DD/MM/YYYY')
      }
    });
  }
  sendHardwareAndITAuditSubmission(params: {
    auditorName: string;
    tspId: string;
    tutorEmail: string;
    name: string;
    email: string[];
  }) {
    const { auditorName, tspId, tutorEmail, name, email } = params;
    return this.client.send({
      from: this.from,
      to: email,
      // bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-48f6d7a04a1a47eba5f4ee0f5933af93',
      dynamicTemplateData: {
        auditorName,
        tspId,
        tutorEmail,
        name,
        submissionDate: moment().format('DD/MM/YYYY')
      }
    });
  }

  sendHardwareAndITAuditRejectedSubmission(params: {
    tutorName: string;
    email: string[];
    rejectedDetails: any;
  }) {
    const { tutorName, email, rejectedDetails } = params;
    return this.client.send({
      from: this.from,
      to: email,
      // bcc: 'productdevelopment+hris@thirdspaceglobal.com',
      templateId: 'd-c688982a78eb4c70a857b5149143774e',
      dynamicTemplateData: {
        tutorName: tutorName,
        rejectedDetails: rejectedDetails
        // submissionDate: moment().format('DD/MM/YYYY')
      }
    });
  }
}
