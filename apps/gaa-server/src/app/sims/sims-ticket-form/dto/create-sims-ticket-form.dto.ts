import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested
} from 'class-validator';

export class CreateSimsTicketFormDto {
  // case detail section ----------------------------
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: '242545789' })
  simsMasterId: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 100099 })
  tutorID: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 9001 })
  tutorTspId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 3886847 })
  sessionId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 91 })
  concernType: number;

  @ApiProperty({ type: String, example: '2023-07-15' })
  @IsNotEmpty()
  @IsDateString()
  escalatedDate: string;

  @ApiProperty({ type: String, example: 'M-131918' })
  @IsNotEmpty()
  @IsString()
  tmsCaseId: string;

  @ApiProperty({ type: String, example: '2023-08-10' })
  @IsOptional()
  @IsDateString()
  suspensionStartDate: string;

  @ApiProperty({ type: String, example: '2023-12-31' })
  @IsOptional()
  @IsDateString()
  suspensionEndDate: string;

  @ApiProperty({ type: String, example: '4 months' })
  @IsOptional()
  @IsString()
  suspensionPeriod: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 2040 })
  relationshipManagerId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Supervisor 10' })
  relationshipManager: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: String, example: '2024-01-03' })
  incidentDate: string;
  // ------------------------------------------------

  // concern detail section -------------------------
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 4 })
  pointOfInvestigation: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 40 })
  concernCategory: number;

  // @IsNumber()
  // @IsOptional()
  // @ApiProperty({ type: Number, example: 68 })
  // academicCycle: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 74 })
  impactLevel: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '<p>xxxxx</p>' })
  descriptionOfTheIncident: string;
  // ------------------------------------------------

  // concern action detail section ------------------
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 26 })
  validityOfThecase: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 78 })
  tutorSuspension: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '<p>xxxx</p>' })
  actionNotes: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 117 })
  tutorError: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 85 })
  actionCategory: number;
  // ------------------------------------------------

  // escalate to hr section -------------------------
  // @IsOptional()
  // @IsDateString()
  // @ApiProperty({ type: String, example: '' })
  // suspensionStartDate: string;

  // @IsOptional()
  // @IsDateString()
  // @ApiProperty({ type: String, example: '' })
  // suspensionEndDate: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ type: String, example: '' })
  // suspensionPeriod: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Test content' })
  notesToHr: string;

  // ------------------------------------------------

  // auto generate email section --------------------
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'amrahazeem@thirdspaceglobal.com' })
  toEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example:
      'omtmanagement@thirdspaceglobal.com,centralacademics@thirdspaceglobal.com,hruser@tsg.com'
  })
  ccEmail: string; // comma seperated emails

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '100099 - Feedback on [CONCERN]' })
  subjectEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example:
      '<p><span style="color: rgb(31, 31, 31);">Hi Misfar Siddeek,</span></p><p><span style="color: rgb(31, 31, 31);">We are from the TSG team with a mission to improve the session delivery standards of our tutors.</span></p><p><span style="color: rgb(31, 31, 31);">We have reviewed one of your recent TSL sessions; please find the details below.</span></p><p><span style="color: rgb(31, 31, 31);">Session Report Link: &lt;Click Here&gt;</span></p><p><span style="color: rgb(31, 31, 31);">In the session, we have identified that (Describe the concern/Observations).</span></p><p><span style="color: rgb(31, 31, 31);">We have included some suggestions that you can follow to avoid such circumstances in future sessions.</span></p><p><span style="color: rgb(31, 31, 31);">(Describe the next steps)</span></p><p><span style="color: rgb(31, 31, 31);">If you are clear on the details mentioned and do not require a discussion, kindly acknowledge this email within </span><strong style="color: rgb(31, 31, 31);">2 working days</strong><span style="color: rgb(31, 31, 31);"> by clicking </span><strong style="color: rgb(31, 31, 31);">“reply all”</strong><span style="color: rgb(31, 31, 31);">. This will serve as confirmation that you are well-informed, and that you commit to avoiding similar issues in the future.</span></p><p><span style="color: rgb(31, 31, 31);">If you require a discussion regarding this email, kindly book an appointment through this </span><a href="https://calendly.com/omtmanagement/15min" rel="noopener noreferrer" target="_blank" style="color: rgb(31, 31, 31);"> link </a><span style="color: rgb(31, 31, 31);"> on or before </span><strong style="color: rgb(31, 31, 31);">DD/MM/YYYY</strong><span style="color: rgb(31, 31, 31);">. There is no need to acknowledge receipt of this email if you intend to schedule a discussion. If you are unable to secure a slot by said date for a valid reason, please respond to this email with the same by clicking "reply all”.</span></p><p><span style="color: rgb(31, 31, 31);">TSG appreciates your invaluable work in delivering sessions. Please be aware that our support is continuously available. Nevertheless, with this formal notice, we trust that you will exercise greater caution and adhere to the established guidelines, ultimately enhancing the quality of your sessions.</span></p><p><span style="color: rgb(31, 31, 31);">Happy Tutoring!</span></p><p><strong style="color: rgb(31, 31, 31);">Team TSG</strong></p>'
  })
  emailBody: string;
  // ------------------------------------------------

  // common section ---------------------------------
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 1 })
  mandatoryFields: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 112 })
  ticketStatus: number;
  // ------------------------------------------------

  // reply email section
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example:
      'omtmanagement@thirdspaceglobal.com,centralacademics@thirdspaceglobal.com,hruser@tsg.com'
  })
  replyEmailCCs: string; // comma seperated emails

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Re: 100099 - Feedback on [CONCERN]' })
  replyEmailSubject: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '<p>Testing reply email body</p>'
  })
  replyEmailBody: string;

  // ------------------------------------------------

  // notice acknowledgement section -----------------
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 0 })
  tutorRequestedCatchUp: number;

  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'tutortCatchUp must be a valid ISO 8601 date string' }
  )
  @ValidateIf((o, value) => value !== undefined && value !== '')
  @ApiProperty({ type: String, example: null })
  tutortCatchUp: string | undefined;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 0 })
  changeTheInitialDecision: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '' })
  noteToIncludeInTheHR: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '' })
  tutorComments: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '' })
  replyToTheTutorApplicableOnly: string;

  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'replyToTheTutorDate must be a valid ISO 8601 date string' }
  )
  @ValidateIf((o, value) => value !== undefined && value !== '')
  @ApiProperty({ type: String, example: '' })
  replyToTheTutorDate: string | undefined;
  // ------------------------------------------------
}

export class EscalateToHRDto {
  @ApiProperty({ type: String, example: '232495567' })
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty({ type: String, example: 'HR User' })
  @IsString()
  @IsNotEmpty()
  hrName: string;

  @ApiProperty({ type: String, example: 'zainabjiffry@thirdspaceglobal.com' })
  @IsEmail()
  @IsNotEmpty()
  hrEmail: string;

  @ApiProperty({ type: String, example: 'Misfar Siddeek' })
  @IsString()
  @IsNotEmpty()
  escalatorName: string;

  @ApiProperty({ type: String, example: 'amrahazeem@thirdspaceglobal.com' })
  @IsEmail()
  @IsNotEmpty()
  fromEmail: string;

  @ApiProperty({ type: Number, example: 91 })
  @IsNumber()
  @IsNotEmpty()
  concernType: number;

  @ApiProperty({ type: String, example: '2023-07-15' })
  @IsNotEmpty()
  @IsDateString()
  escalatedToHRDate: string;

  @ApiProperty({ type: String, example: 'M-131918' })
  @IsNotEmpty()
  @IsString()
  tmsCaseId: string;

  @ApiProperty({ type: String, example: '2023-08-10' })
  @IsOptional()
  @IsDateString()
  suspensionStartDate: string;

  @ApiProperty({ type: String, example: '2023-12-31' })
  @IsOptional()
  @IsDateString()
  suspensionEndDate: string;

  @ApiProperty({ type: String, example: '4 months' })
  @IsOptional()
  @IsString()
  suspensionPeriod: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Test content' })
  notesToHr: string;
}

export class CollaboratorPeople {
  @IsString()
  @ApiProperty({ type: String, example: '8' })
  tspId: string;

  @IsString()
  @ApiProperty({ type: String, example: 'aasma@thirdspaceglobal.com' })
  userEmail: string;

  @IsString()
  @ApiProperty({ type: String, example: 'Fathima Aasma Hussain' })
  userName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Testing note for collaboration' })
  note: string;

  @IsString()
  @ApiProperty({ type: String, example: 'Aca' })
  collaboratorType: string;
}

export class Collaborators {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: '242502756' })
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'HR USER' })
  escalatorName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'hruser@tsg.com' })
  fromEmail: string;

  @IsString()
  @ApiProperty({ type: String, example: 'Aca' })
  collaboratorType: string;

  @ValidateNested({ each: true })
  @Type(() => CollaboratorPeople)
  @ApiProperty({ type: CollaboratorPeople, isArray: true })
  collaborators: CollaboratorPeople[];
}

export class closeTicket {
  @IsString()
  @ApiProperty({ type: String, example: '232489814' })
  id: string;

  @IsString()
  @ApiProperty({ type: String, example: '114' })
  ticketStatus: string;

  @IsString()
  @ApiProperty({ type: String, example: '26' })
  validityOfThecase: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '85' })
  actionCategory: string;

  // Escalate to HR Section
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 0 })
  tutorRequestedCatchUp: number;

  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'tutortCatchUp must be a valid ISO 8601 date string' }
  )
  @ValidateIf((o, value) => value !== undefined && value !== '')
  @ApiProperty({ type: String, example: '' })
  tutortCatchUp: string | undefined;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 0 })
  changeTheInitialDecision: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '' })
  noteToIncludeInTheHR: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '' })
  tutorComments: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '' })
  replyToTheTutorApplicableOnly: string;

  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'replyToTheTutorDate must be a valid ISO 8601 date string' }
  )
  @ValidateIf((o, value) => value !== undefined && value !== '')
  @ApiProperty({ type: String, example: '' })
  replyToTheTutorDate: string | undefined;
}

// Resend primary email dto
export class ResendPrimaryEmail {
  @IsNumber()
  @ApiProperty({ type: Number, example: 232489814 })
  simsMasterId: number;

  @IsString()
  @ApiProperty({ type: String, example: 'amrahazeem@thirdspaceglobal.com' })
  toEmail: string;

  @IsString()
  @ApiProperty({
    type: String,
    example:
      'omtmanagement@thirdspaceglobal.com,centralacademics@thirdspaceglobal.com,hruser@tsg.com'
  })
  ccEmail: string; // comma seperated emails

  @IsString()
  @ApiProperty({ type: String, example: '100099 - Feedback on [CONCERN]' })
  subjectEmail: string;

  @IsString()
  @ApiProperty({
    type: String,
    example:
      '<p><span style="color: rgb(31, 31, 31);">Hi Misfar Siddeek,</span></p><p><span style="color: rgb(31, 31, 31);">We are from the TSG team with a mission to improve the session delivery standards of our tutors.</span></p><p><span style="color: rgb(31, 31, 31);">We have reviewed one of your recent TSL sessions; please find the details below.</span></p><p><span style="color: rgb(31, 31, 31);">Session Report Link: &lt;Click Here&gt;</span></p><p><span style="color: rgb(31, 31, 31);">In the session, we have identified that (Describe the concern/Observations).</span></p><p><span style="color: rgb(31, 31, 31);">We have included some suggestions that you can follow to avoid such circumstances in future sessions.</span></p><p><span style="color: rgb(31, 31, 31);">(Describe the next steps)</span></p><p><span style="color: rgb(31, 31, 31);">If you are clear on the details mentioned and do not require a discussion, kindly acknowledge this email within </span><strong style="color: rgb(31, 31, 31);">2 working days</strong><span style="color: rgb(31, 31, 31);"> by clicking </span><strong style="color: rgb(31, 31, 31);">“reply all”</strong><span style="color: rgb(31, 31, 31);">. This will serve as confirmation that you are well-informed, and that you commit to avoiding similar issues in the future.</span></p><p><span style="color: rgb(31, 31, 31);">If you require a discussion regarding this email, kindly book an appointment through this </span><a href="https://calendly.com/omtmanagement/15min" rel="noopener noreferrer" target="_blank" style="color: rgb(31, 31, 31);"> link </a><span style="color: rgb(31, 31, 31);"> on or before </span><strong style="color: rgb(31, 31, 31);">DD/MM/YYYY</strong><span style="color: rgb(31, 31, 31);">. There is no need to acknowledge receipt of this email if you intend to schedule a discussion. If you are unable to secure a slot by said date for a valid reason, please respond to this email with the same by clicking "reply all”.</span></p><p><span style="color: rgb(31, 31, 31);">TSG appreciates your invaluable work in delivering sessions. Please be aware that our support is continuously available. Nevertheless, with this formal notice, we trust that you will exercise greater caution and adhere to the established guidelines, ultimately enhancing the quality of your sessions.</span></p><p><span style="color: rgb(31, 31, 31);">Happy Tutoring!</span></p><p><strong style="color: rgb(31, 31, 31);">Team TSG</strong></p>'
  })
  emailBody: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: '85' })
  actionCategory: number;
}

// Reply to the tutor email section
export class ReplyEmail {
  @IsNumber()
  @ApiProperty({ type: Number, example: 232489814 })
  simsMasterId: number;

  @IsString()
  @ApiProperty({
    type: String,
    example:
      'omtmanagement@thirdspaceglobal.com,centralacademics@thirdspaceglobal.com,hruser@tsg.com'
  })
  ccEmail: string; // comma seperated emails

  @IsString()
  @ApiProperty({
    type: String,
    example:
      '<p><span style="color: rgb(31, 31, 31);">Hi Misfar Siddeek,</span></p><p><span style="color: rgb(31, 31, 31);">We are from the TSG team with a mission to improve the session delivery standards of our tutors.</span></p><p><span style="color: rgb(31, 31, 31);">We have reviewed one of your recent TSL sessions; please find the details below.</span></p><p><span style="color: rgb(31, 31, 31);">Session Report Link: &lt;Click Here&gt;</span></p><p><span style="color: rgb(31, 31, 31);">In the session, we have identified that (Describe the concern/Observations).</span></p><p><span style="color: rgb(31, 31, 31);">We have included some suggestions that you can follow to avoid such circumstances in future sessions.</span></p><p><span style="color: rgb(31, 31, 31);">(Describe the next steps)</span></p><p><span style="color: rgb(31, 31, 31);">If you are clear on the details mentioned and do not require a discussion, kindly acknowledge this email within </span><strong style="color: rgb(31, 31, 31);">2 working days</strong><span style="color: rgb(31, 31, 31);"> by clicking </span><strong style="color: rgb(31, 31, 31);">“reply all”</strong><span style="color: rgb(31, 31, 31);">. This will serve as confirmation that you are well-informed, and that you commit to avoiding similar issues in the future.</span></p><p><span style="color: rgb(31, 31, 31);">If you require a discussion regarding this email, kindly book an appointment through this </span><a href="https://calendly.com/omtmanagement/15min" rel="noopener noreferrer" target="_blank" style="color: rgb(31, 31, 31);"> link </a><span style="color: rgb(31, 31, 31);"> on or before </span><strong style="color: rgb(31, 31, 31);">DD/MM/YYYY</strong><span style="color: rgb(31, 31, 31);">. There is no need to acknowledge receipt of this email if you intend to schedule a discussion. If you are unable to secure a slot by said date for a valid reason, please respond to this email with the same by clicking "reply all”.</span></p><p><span style="color: rgb(31, 31, 31);">TSG appreciates your invaluable work in delivering sessions. Please be aware that our support is continuously available. Nevertheless, with this formal notice, we trust that you will exercise greater caution and adhere to the established guidelines, ultimately enhancing the quality of your sessions.</span></p><p><span style="color: rgb(31, 31, 31);">Happy Tutoring!</span></p><p><strong style="color: rgb(31, 31, 31);">Team TSG</strong></p>'
  })
  emailBody: string;
}

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
                                              BELOW DTOs ARE USED TO INTEGRATE THE SWAGGER TO THE SYSTEM
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Session detail fetchin API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
class SuccessOutputSessionDetail {
  @ApiProperty({ type: String, example: 'Primary' })
  sessionType: string;

  @ApiProperty({ type: Number, example: 100029 })
  tutorId: number;

  @ApiProperty({ type: Number, example: 3886847 })
  sessionId: number;

  @ApiProperty({ type: Number, example: 0 })
  hasSameSession: number;
}
export class SessionDetailSuccessResponse {
  @ApiProperty({ example: true, type: Boolean })
  success: boolean;

  @ApiProperty({ type: SuccessOutputSessionDetail })
  data: SuccessOutputSessionDetail;
}
export class SessionDetailErrorResponse {
  @ApiProperty({ example: false, type: Boolean })
  success: boolean;

  @ApiProperty({ example: 'No GOALaunchedSessions found', type: String })
  error: string;
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Tutor name / id fetching API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
class SuccessOutputTutorNameOrId {
  @ApiProperty({ type: Number, example: 9001 })
  value: number;

  @ApiProperty({ type: String, example: 'Misfar Siddeek' })
  label: string;
}

export class TutorNameOrIdSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputTutorNameOrId, isArray: true })
  data: SuccessOutputTutorNameOrId[];
}

export class TutorNameOrIdErrorResponse {
  @ApiProperty({ type: Boolean, example: false })
  success: boolean;

  @ApiProperty({ type: Array, example: [] })
  data: [];
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Get tutor detail by id API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
class TutorIssueHistory {
  @ApiProperty({
    type: String,
    example: 'Slot disruption - 2nd instance, more than 10'
  })
  concernCategory: string;

  @ApiProperty({ type: String, example: 'severe notice' })
  actionCategory: string;

  @ApiProperty({
    type: String,
    example: 'Red Flag - Disruptive behaviour (severe)'
  })
  pointOfInvestigation: string;

  @ApiProperty({ type: String, example: 'Major Incident' })
  impactLevel: string;

  @ApiProperty({ type: String, example: '07-11-2023' })
  issueUpdatedDate: string;
}
class SuccessOutputTutorDetail {
  @ApiProperty({ type: Number, example: 9001 })
  tutorTspId: number;

  @ApiProperty({ type: String, example: 'Misfar Siddeek' })
  tutorName: string;

  @ApiProperty({ type: String, example: 'Supervisor 10' })
  relationshipManager: string;

  @ApiProperty({ type: Number, example: 2040 })
  relationshipManagerId: number;

  @ApiProperty({ type: String, example: '27A' })
  tutorBatch: string;

  @ApiProperty({ type: String, example: 'Active' })
  tutorStatus: string;

  @ApiProperty({ type: String, example: 'Academic Operations' })
  raisedDepartment: string;

  @ApiProperty({ type: String, example: 'Primary' })
  businessUnit: string;

  @ApiProperty({ type: String, example: 'Tier 2' })
  tierNo: string;

  @ApiProperty({ type: Number, example: 100099 })
  tutorId: number;

  @ApiProperty({ type: String, example: 'Sri Lanka' })
  tutorCountry: string;

  @ApiProperty({ type: String, example: 'amrahazeem@thirdspaceglobal.com' })
  tutorEmail: string;

  @ApiProperty({ type: TutorIssueHistory, isArray: true })
  tutorIssueHistory: TutorIssueHistory[];
}
export class TutorDetailSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputTutorDetail, isArray: true })
  data: SuccessOutputTutorDetail[];
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Get relavent email template API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/

class SuccessOutputRelaventEmailTemplate {
  @ApiProperty({
    type: String,
    example:
      '<p><span style="font-size: 11pt; font-family: \'Helvetica Neue\', sans-serif; color: rgb(31, 31, 31);">Dear [Tutor Name],</span></p><p><span style="font-size: 11pt; font-family: \'Helvetica Neue\', sans-serif; color: rgb(31, 31, 31);">We are from the TSG team with a mission to improve the session delivery standards of our tutors. We have identified work areas where you have failed to meet the required standards.</span></p><p><span style="font-size: 11pt; font-family: \'Helvetica Neue\', sans-serif; color: rgb(31, 31, 31);">Please find the summary of the concern identified, in the letter attached to this email.</span></p><p><span style="font-size: 11pt; font-family: \'Helvetica Neue\', sans-serif; color: rgb(31, 31, 31); background-color: rgb(244, 204, 204);">Paste Details from Col N (for academic concerns).</span></p><p><span style="font-size: 11pt; font-family: \'Helvetica Neue\', sans-serif; color: rgb(31, 31, 31);">You can find the notice letter attached <span style="font-size: 11pt; font-family: \'Helvetica Neue\', sans-serif; color: rgb(60, 120, 216);">herewith</span>. Please read through the letter carefully. If you are clear on the details mentioned and do not require a discussion, kindly acknowledge this email within <b>2 working days</b> by clicking <b>“reply all”</b>. This will serve as confirmation that you are well-informed, and that you commit to avoiding similar issues in the future.</span></p><p><span style="font-size: 11pt; font-family: \'Helvetica Neue\', sans-serif; color: rgb(31, 31, 31);">If you require a discussion regarding this email, kindly book an appointment through this <a href="https://calendly.com/omtmanagement/15min" target="_blank" style="font-size: 11pt; font-family: \'Helvetica Neue\', sans-serif; color: rgb(17, 85, 204);">link</a> on or before <b>DD/MM/YYYY</b>. There is no need to acknowledge receipt of this email if you intend to schedule a discussion. If you are unable to secure a slot by said date for a valid reason, please respond to this email with the same by clicking "reply all”.</span></p>'
  })
  emailTemplate: string;

  @ApiProperty({ type: String, example: 'Severe Notice' })
  emailSubject: string;

  @ApiProperty({
    type: String,
    example:
      'omtmanagement@thirdspaceglobal.com,hr@thirdspaceglobal.com,centralacademics@thirdspaceglobal.com,hruser@tsg.com'
  })
  emailCCs: string;
}

export class RelaventEmailTemplateSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputRelaventEmailTemplate })
  data: SuccessOutputRelaventEmailTemplate;
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Escalate to HR API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
class SuccessOutputEscalateToHR {
  @ApiProperty({ type: Number, example: 242584267 })
  simsMasterId: number;

  @ApiProperty({ type: Number, example: 1 })
  isEscalatedToHR: number;
}

export class EscalateToHRSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputEscalateToHR })
  data: SuccessOutputEscalateToHR;
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Get Investigator Names API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
class SuccessOutputInvestigators {
  @ApiProperty({ type: String, examples: ['7'] })
  value: string;

  @ApiProperty({ type: String, example: 'Gloria Gunawardana' })
  label: string;

  @ApiProperty({ type: String, example: 'Gloria Valentina Gunawardana' })
  full_name: string;

  @ApiProperty({ type: String, example: 'Academic Operations' })
  division: string;

  @ApiProperty({ type: String, example: 'gloria@thirdspaceglobal.com' })
  tsg_email: string;
}

export class GetInvestigatorNamesSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputInvestigators, isArray: true })
  data: SuccessOutputInvestigators[];
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Collaborate people API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/

class SuccessOutputCollaboratePeople {
  @ApiProperty({ type: Number, example: 1 })
  isCollaborateToAca: number;

  @ApiProperty({ type: Number, example: 242502756 })
  simsMasterId: number;
}

export class CollaboratePeopleSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: String, example: 'Academics' })
  fieldType: string;

  @ApiProperty({ type: SuccessOutputCollaboratePeople, isArray: true })
  data: SuccessOutputCollaboratePeople[];
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Close the ticket API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
class SuccessOutputCloseTicket {
  // @ApiProperty({ type: Number, example: 67 })
  // academicCycle: number;

  @ApiProperty({ type: Number, example: 85 })
  actionCategory: number;

  @ApiProperty({ type: String, example: '<p>zzz</p>' })
  actionNotes: string;

  @ApiProperty({ type: String, example: 'zainabjiffry@thirdspaceglobal.com' })
  ccEmail: string;

  @ApiProperty({ type: Number, example: null })
  changeTheInitialDecision: number;

  @ApiProperty({ type: Number, example: 36 })
  concernCategory: number;

  @ApiProperty({ type: Number, example: null })
  concernType: number;

  @ApiProperty({ type: String, example: '2023-11-06T04:14:34.000Z' })
  createdAt: string;

  @ApiProperty({ type: Number, example: 100147 })
  createdBy: number;

  @ApiProperty({ type: String, example: '<p>aaa</p>' })
  descriptionOfTheIncident: string;

  @ApiProperty({
    type: String,
    example:
      '<p><span style="color: rgb(31, 31, 31);">Hi emjay8918,</span></p><p><span style="color: rgb(31, 31, 31);">We are from the TSG team with a mission to improve the session delivery standards of our tutors.</span></p><p><span style="color: rgb(31, 31, 31);">We have reviewed one of your recent TSL sessions; please find the details below.</span></p><p><span style="color: rgb(31, 31, 31);">Session Report Link: </span><a href="https://staging.thirdspaceportal.com/non-tutor/gaa/master-table-page" rel="noopener noreferrer" target="_blank" style="color: rgb(31, 31, 31);">&lt;Click Here&gt;</a></p><p><span style="color: rgb(31, 31, 31);">In the session, we have identified that </span></p><ul><li>Testing 1</li><li>Testing 2</li><li>Testing 3</li><li>Testing 4</li><li>Testing 5</li><li>Testing 6</li></ul><p><span style="color: rgb(31, 31, 31);">We have included some suggestions that you can follow to avoid such circumstances in future sessions.</span></p><ol><li>Step 1</li><li>Step 2</li><li>Step 3</li><li>Step 4</li><li>Step 5</li><li>Step 6</li></ol><p><span style="color: rgb(31, 31, 31);">If you are clear on the details mentioned and do not require a discussion, kindly acknowledge this email within </span><strong style="color: rgb(31, 31, 31);">2 working days</strong><span style="color: rgb(31, 31, 31);"> by clicking </span><strong style="color: rgb(31, 31, 31);">“reply all”</strong><span style="color: rgb(31, 31, 31);">. This will serve as confirmation that you are well-informed, and that you commit to avoiding similar issues in the future.</span></p><p><span style="color: rgb(31, 31, 31);">If you require a discussion regarding this email, kindly book an appointment through this </span><a href="https://calendly.com/omtmanagement/15min" rel="noopener noreferrer" target="_blank" style="color: rgb(31, 31, 31);"> link </a><span style="color: rgb(31, 31, 31);"> on or before </span><strong style="color: rgb(31, 31, 31);">DD/MM/YYYY</strong><span style="color: rgb(31, 31, 31);">. There is no need to acknowledge receipt of this email if you intend to schedule a discussion. If you are unable to secure a slot by said date for a valid reason, please respond to this email with the same by clicking "reply all”.</span></p><p><span style="color: rgb(31, 31, 31);">TSG appreciates your invaluable work in delivering sessions. Please be aware that our support is continuously available. Nevertheless, with this formal notice, we trust that you will exercise greater caution and adhere to the established guidelines, ultimately enhancing the quality of your sessions.</span></p><p><span style="color: rgb(31, 31, 31);">Happy Tutoring!</span></p><p><strong style="color: rgb(31, 31, 31);">Team TSG</strong></p>'
  })
  emailBody: string;

  @ApiProperty({ type: String, example: '2023-11-06T04:14:34.000Z' })
  emailSentAt: string;

  @ApiProperty({ type: String, example: '2023-07-15' })
  escalatedToHRDate: string;

  @ApiProperty({ type: Number, example: 74 })
  impactLevel: number;

  @ApiProperty({ type: String, example: '2023-11-01T00:00:00.000Z' })
  incidentDate: string;

  @ApiProperty({ type: Number, example: 0 })
  isCollaborateToAca: number;

  @ApiProperty({ type: Number, example: 0 })
  isCollaborateToOps: number;

  @ApiProperty({ type: Number, example: 0 })
  isEscalatedToHR: number;

  @ApiProperty({ type: Number, example: 1 })
  mandatoryFields: number;

  @ApiProperty({ type: String, example: '' })
  noteToIncludeInTheHR: string;

  @ApiProperty({ type: Number, example: 3 })
  pointOfInvestigation: number;

  @ApiProperty({ type: Number, example: 2003 })
  relationshipManagerId: number;

  @ApiProperty({ type: String, example: 'Supervisor 2' })
  relationshipManagerName: string;

  @ApiProperty({ type: String, example: '' })
  replyToTheTutorApplicableOnly: string;

  @ApiProperty({ type: Number, example: 4405588 })
  sessionId: number;

  @ApiProperty({ type: Number, example: 232489814 })
  simsMasterId: number;

  @ApiProperty({
    type: String,
    example: '100017 - Feedback on Testing subject.'
  })
  subjectEmail: string;

  @ApiProperty({ type: String, example: '2023-12-31' })
  suspensionEndDate: string;

  @ApiProperty({ type: String, example: '4 months' })
  suspensionPeriod: string;

  @ApiProperty({ type: String, example: '2023-08-10' })
  suspensionStartDate: string;

  @ApiProperty({ type: String, example: '2024-01-18T06:14:34.214Z' })
  ticketCloseDate: string;

  @ApiProperty({ type: Number, example: 114 })
  ticketStatus: number;

  @ApiProperty({ type: String, example: 'M-131918' })
  tmsCaseId: string;

  @ApiProperty({ type: String, example: 'tester17@gmail.com' })
  toEmail: string;

  @ApiProperty({ type: String, example: 'test' })
  tutorComments: string;

  @ApiProperty({ type: Number, example: 117 })
  tutorError: number;

  @ApiProperty({ type: Number, example: 100017 })
  tutorID: number;

  @ApiProperty({ type: Number, example: 0 })
  tutorRequestedCatchUp: number;

  @ApiProperty({ type: Number, example: null })
  tutorSupportPlan: number;

  @ApiProperty({ type: Number, example: 78 })
  tutorSuspension: number;

  @ApiProperty({ type: Number, example: 8918 })
  tutorTspId: number;

  @ApiProperty({ type: String, example: null })
  tutortCatchUp: string;

  @ApiProperty({ type: String, example: '2024-01-18T06:14:34.000Z' })
  updatedAt: string;

  @ApiProperty({ type: Number, example: 100147 })
  updatedBy: number;

  @ApiProperty({ type: Number, example: 26 })
  validityOfThecase: number;
}
export class CloseTicketSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputCloseTicket })
  data: SuccessOutputCloseTicket;
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Update ticket form API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
export class UpdateTicket400Response {
  @ApiProperty({ type: String, example: 'Bad Request' })
  error: string;

  @ApiProperty({
    example: [
      'suspensionStartDate must be a valid ISO 8601 date string',
      'suspensionEndDate must be a valid ISO 8601 date string'
    ],
    isArray: true
  })
  message: string[];
}
class SuccessOutputUpdateTicketForm {
  @ApiProperty({ type: Number, example: 242545789 })
  simsMasterId: number;

  // @ApiProperty({ type: Number, example: 68 })
  // academicCycle: number;

  @ApiProperty({ type: Number, example: 85 })
  actionCategory: number;

  @ApiProperty({ type: String, example: '<p>xxxx</p>' })
  actionNotes: string;

  @ApiProperty({
    type: String,
    example:
      'omtmanagement@thirdspaceglobal.com,centralacademics@thirdspaceglobal.com,hruser@tsg.com'
  })
  ccEmail: string;

  @ApiProperty({ type: Number, example: null })
  changeTheInitialDecision: number;

  @ApiProperty({ type: Number, example: 40 })
  concernCategory: number;

  @ApiProperty({ type: String, example: null })
  concernType: string;

  @ApiProperty({ type: String, example: '2024-01-18T08:00:09.000Z' })
  createdAt: string;

  @ApiProperty({ type: Number, example: 100147 })
  createdBy: number;

  @ApiProperty({ type: String, example: '<p>xxxxx</p>' })
  descriptionOfTheIncident: string;

  @ApiProperty({
    type: String,
    example:
      '<p><span style="color: rgb(31, 31, 31);">Hi Misfar Siddeek,</span></p><p><span style="color: rgb(31, 31, 31);">We are from the TSG team with a mission to improve the session delivery standards of our tutors.</span></p><p><span style="color: rgb(31, 31, 31);">We have reviewed one of your recent TSL sessions; please find the details below.</span></p><p><span style="color: rgb(31, 31, 31);">Session Report Link: &lt;Click Here&gt;</span></p><p><span style="color: rgb(31, 31, 31);">In the session, we have identified that (Describe the concern/Observations).</span></p><p><span style="color: rgb(31, 31, 31);">We have included some suggestions that you can follow to avoid such circumstances in future sessions.</span></p><p><span style="color: rgb(31, 31, 31);">(Describe the next steps)</span></p><p><span style="color: rgb(31, 31, 31);">If you are clear on the details mentioned and do not require a discussion, kindly acknowledge this email within </span><strong style="color: rgb(31, 31, 31);">2 working days</strong><span style="color: rgb(31, 31, 31);"> by clicking </span><strong style="color: rgb(31, 31, 31);">“reply all”</strong><span style="color: rgb(31, 31, 31);">. This will serve as confirmation that you are well-informed, and that you commit to avoiding similar issues in the future.</span></p><p><span style="color: rgb(31, 31, 31);">If you require a discussion regarding this email, kindly book an appointment through this </span><a href="https://calendly.com/omtmanagement/15min" rel="noopener noreferrer" target="_blank" style="color: rgb(31, 31, 31);"> link </a><span style="color: rgb(31, 31, 31);"> on or before </span><strong style="color: rgb(31, 31, 31);">DD/MM/YYYY</strong><span style="color: rgb(31, 31, 31);">. There is no need to acknowledge receipt of this email if you intend to schedule a discussion. If you are unable to secure a slot by said date for a valid reason, please respond to this email with the same by clicking "reply all”.</span></p><p><span style="color: rgb(31, 31, 31);">TSG appreciates your invaluable work in delivering sessions. Please be aware that our support is continuously available. Nevertheless, with this formal notice, we trust that you will exercise greater caution and adhere to the established guidelines, ultimately enhancing the quality of your sessions.</span></p><p><span style="color: rgb(31, 31, 31);">Happy Tutoring!</span></p><p><strong style="color: rgb(31, 31, 31);">Team TSG</strong></p>'
  })
  emailBody: string;

  @ApiProperty({ type: String, example: null })
  emailSentAt: string;

  @ApiProperty({ type: String, example: null })
  escalatedToHRDate: string;

  @ApiProperty({ type: Number, example: 74 })
  impactLevel: number;

  @ApiProperty({ type: String, example: '2024-01-03T00:00:00.000Z' })
  incidentDate: string;

  @ApiProperty({ type: Number, example: 0 })
  isCollaborateToAca: number;

  @ApiProperty({ type: Number, example: 0 })
  isCollaborateToOps: number;

  @ApiProperty({ type: Number, example: 0 })
  isEscalatedToHR: number;

  @ApiProperty({ type: Number, example: 1 })
  mandatoryFields: number;

  @ApiProperty({ type: String, example: '' })
  noteToIncludeInTheHR: string;

  @ApiProperty({ type: Number, example: 4 })
  pointOfInvestigation: number;

  @ApiProperty({ type: Number, example: 2040 })
  relationshipManagerId: number;

  @ApiProperty({ type: String, example: 'Supervisor 10' })
  relationshipManagerName: string;

  @ApiProperty({ type: String, example: '' })
  replyToTheTutorApplicableOnly: string;

  @ApiProperty({ type: Number, example: 3886847 })
  sessionId: number;

  @ApiProperty({ type: String, example: '100099 - Feedback on [CONCERN]' })
  subjectEmail: string;

  @ApiProperty({ type: String, example: null })
  suspensionEndDate: string;

  @ApiProperty({ type: String, example: '' })
  suspensionPeriod: string;

  @ApiProperty({ type: String, example: null })
  suspensionStartDate: string;

  @ApiProperty({ type: String, example: null })
  ticketCloseDate: string;

  @ApiProperty({ type: Number, example: 112 })
  ticketStatus: number;

  @ApiProperty({ type: Number, example: null })
  tmsCaseId: number;

  @ApiProperty({ type: String, example: 'amrahazeem@thirdspaceglobal.com' })
  toEmail: string;

  @ApiProperty({ type: String, example: '' })
  tutorComments: string;

  @ApiProperty({ type: Number, example: 117 })
  tutorError: number;

  @ApiProperty({ type: Number, example: 100099 })
  tutorID: number;

  @ApiProperty({ type: Number, example: null })
  tutorRequestedCatchUp: number;

  @ApiProperty({ type: String, example: null })
  tutorSupportPlan: string;

  @ApiProperty({ type: Number, example: 78 })
  tutorSuspension: number;

  @ApiProperty({ type: Number, example: 9001 })
  tutorTspId: number;

  @ApiProperty({ type: Number, example: null })
  tutortCatchUp: number;

  @ApiProperty({ type: String, example: '2024-01-18T08:51:12.000Z' })
  updatedAt: string;

  @ApiProperty({ type: Number, example: 100147 })
  updatedBy: number;

  @ApiProperty({ type: Number, example: 26 })
  validityOfThecase: number;
}
export class UpdateTicketSuccessReponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputUpdateTicketForm })
  data: SuccessOutputUpdateTicketForm;
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Fetch data API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
class CommonSimsCollaboratorOutput {
  @ApiProperty({ type: Number })
  tspId: number;

  @ApiProperty({ type: String })
  note: string;

  @ApiProperty({ type: String })
  collaboratorType: string;
}
class ConcerDetailOutput {
  @ApiProperty({
    type: String,
    example: 'Student disruption - Availability Decrease'
  })
  concernCategoryTitle: string;

  @ApiProperty({ type: String, example: 'Red Flag - Others' })
  pointOfInvestigationTitle: string;

  @ApiProperty({ type: String, example: 'Minor Incident' })
  impactLevelTitle: string;
}
class ConcernActionOutput {
  @ApiProperty({ type: Number, example: 85 })
  id: number;

  @ApiProperty({ type: Number, example: 85 })
  value: number;

  @ApiProperty({ type: String, example: 'Feedback Only' })
  label: string;
}

class ConcernActionDetailOutput {
  @ApiProperty({ type: ConcernActionOutput })
  concernActionTitle: ConcernActionOutput;

  @ApiProperty({ type: String, example: 'No' })
  tutorSuspensionTitle: string;
}
class EscalatedToHROutput {
  @ApiProperty({ type: String, example: 'Concern Type' })
  concernTypeTitle: string;

  @ApiProperty({ type: String, example: 'Escalated Date' })
  escalatedDateTitle: string;
}
class AutoGenerateEmailOutput {
  @ApiProperty({ type: String, example: 'Auto Generated Email' })
  summeryTitle: string;

  @ApiProperty({ type: String, example: 'Email Sent Date' })
  emailSentDate: string;
}
class ConcernCategoryDetailOutput {
  @ApiProperty({ type: Number, example: 40 })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Student disruption - Availability Decrease'
  })
  value: string;
}

class SuccessOutputFetchData {
  @ApiProperty({ type: Number, example: 242545789 })
  simsMasterId: number;

  @ApiProperty({ type: Number, example: 112 })
  ticketStatus: number;

  @ApiProperty({ type: String, example: null })
  ticketCloseDate: string;

  @ApiProperty({ type: Number, example: 1 })
  mandatoryFields: number;

  @ApiProperty({ type: Number, example: 0 })
  isEscalatedToHR: number;

  @ApiProperty({ type: Number, example: 1 })
  isCollaborateToOps: number;

  @ApiProperty({ type: Number, example: 1 })
  isCollaborateToAca: number;

  @ApiProperty({ type: Number, example: 100099 })
  tutorID: number;

  @ApiProperty({ type: Number, example: 9001 })
  tutorTspId: number;

  @ApiProperty({ type: Number, example: 3886847 })
  sessionId: number;

  @ApiProperty({ type: Number, example: 4 })
  pointOfInvestigation: number;

  @ApiProperty({ type: Number, example: 40 })
  concernCategory: number;

  // @ApiProperty({ type: Number, example: 68 })
  // academicCycle: number;

  @ApiProperty({ type: Number, example: 74 })
  impactLevel: number;

  @ApiProperty({ type: String, example: '<p>xxxxx</p>' })
  descriptionOfTheIncident: string;

  @ApiProperty({ type: Number, example: 26 })
  validityOfThecase: number;

  @ApiProperty({ type: Number, example: 117 })
  tutorError: number;

  @ApiProperty({ type: Number, example: 78 })
  tutorSuspension: number;

  @ApiProperty({ type: String, example: null })
  tutorSupportPlan: string;

  @ApiProperty({ type: String, example: '<p>xxxx</p>' })
  actionNotes: string;

  @ApiProperty({ type: Number, example: 85 })
  actionCategory: number;

  @ApiProperty({ type: String, example: null })
  concernType: string;

  @ApiProperty({ type: String, example: null })
  escalatedToHRDate: string;

  @ApiProperty({ type: Number, example: null })
  tmsCaseId: number;

  @ApiProperty({ type: String, example: null })
  suspensionStartDate: string;

  @ApiProperty({ type: String, example: null })
  suspensionEndDate: string;

  @ApiProperty({ type: String, example: '' })
  suspensionPeriod: string;

  @ApiProperty({ type: Number, example: null })
  tutorRequestedCatchUp: number;

  @ApiProperty({ type: Number, example: null })
  tutortCatchUp: number;

  @ApiProperty({ type: Number, example: null })
  changeTheInitialDecision: number;

  @ApiProperty({ type: String, example: '' })
  noteToIncludeInTheHR: string;

  @ApiProperty({ type: String, example: '' })
  tutorComments: string;

  @ApiProperty({ type: String, example: '' })
  replyToTheTutorApplicableOnly: string;

  @ApiProperty({ type: String, example: 'amrahazeem@thirdspaceglobal.com' })
  toEmail: string;

  @ApiProperty({
    type: String,
    example:
      'omtmanagement@thirdspaceglobal.com,centralacademics@thirdspaceglobal.com,hruser@tsg.com'
  })
  ccEmail: string;

  @ApiProperty({ type: String, example: '100099 - Feedback on [CONCERN]' })
  subjectEmail: string;

  @ApiProperty({
    type: String,
    example:
      '<p><span style="color: rgb(31, 31, 31);">Hi Misfar Siddeek,</span></p>...'
  })
  emailBody: string;

  @ApiProperty({ type: Number, example: 2040 })
  relationshipManagerId: number;

  @ApiProperty({ type: String, example: 'Supervisor 10' })
  relationshipManagerName: string;

  @ApiProperty({ type: String, example: '2024-01-03T00:00:00.000Z' })
  incidentDate: string;

  @ApiProperty({ type: String, example: '2024-01-18T08:00:09.000Z' })
  createdAt: string;

  @ApiProperty({ type: Number, example: 100147 })
  createdBy: number;

  @ApiProperty({ type: String, example: '2024-01-18T09:32:26.000Z' })
  updatedAt: string;

  @ApiProperty({ type: Number, example: 100147 })
  updatedBy: number;

  @ApiProperty({ type: String, example: null })
  emailSentAt: string;

  @ApiProperty({ type: String, example: 'Misfar Siddeek' })
  tutorName: string;

  @ApiProperty({
    type: [CommonSimsCollaboratorOutput],
    example: [{ tspId: 14, note: '<p>ssss</p>', collaboratorType: 'Aca' }],
    isArray: true
  })
  simsCollaboratorsAca: CommonSimsCollaboratorOutput[];

  @ApiProperty({
    type: [CommonSimsCollaboratorOutput],
    example: [{ tspId: 13, note: '<p>xxxxxx</p>', collaboratorType: 'Ops' }],
    isArray: true
  })
  simsCollaboratorsOps: CommonSimsCollaboratorOutput[];

  @ApiProperty({ type: ConcerDetailOutput })
  concernDetails: ConcerDetailOutput;

  @ApiProperty({ type: ConcernActionDetailOutput })
  concernActionDetails: ConcernActionDetailOutput;

  @ApiProperty({ type: EscalatedToHROutput })
  escalatedToHRTitle: EscalatedToHROutput;

  @ApiProperty({ type: AutoGenerateEmailOutput })
  autoGenerateEmailTitle: AutoGenerateEmailOutput;

  @ApiProperty({ type: ConcernCategoryDetailOutput })
  concernCategoryDetail: ConcernCategoryDetailOutput;

  @ApiProperty({ type: String, example: 'HR USER' })
  ticketCreatedBy: string;

  @ApiProperty({ type: Boolean, example: true })
  hasEditPermission: boolean;
}

export class FetchDataSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputFetchData, isArray: true })
  data: SuccessOutputFetchData[];
}
