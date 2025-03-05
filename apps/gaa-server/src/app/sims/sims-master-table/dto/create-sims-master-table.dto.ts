import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateSimsMasterTableDto {
  @ApiProperty({
    type: 'number',
    example: 100147
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class DeleteSimsMasterTicketDto {
  @ApiProperty({
    type: 'number',
    example: 242555987
  })
  @IsNotEmpty()
  @IsNumber()
  simsMasterId: number;
}

export class TheHubTableDto {
  @IsString()
  @IsOptional()
  createdDateStart: string;

  @IsString()
  @IsOptional()
  createdDateEnd: string;

  @IsString()
  @IsOptional()
  createdEscalatedDateStart: string;

  @IsString()
  @IsOptional()
  createdEscalatedDateEnd: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  skip: number;

  @ApiProperty({
    type: 'number',
    example: 10
  })
  @IsNotEmpty()
  @IsNumber()
  take: number;

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tutorName: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tutorId: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  sessionId: number[];

  @ApiProperty({
    type: 'array',
    example: [111, 112]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  ticketStatus: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  createdBy: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  isEscalatedToHR: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  ticketId: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relationshipManagerName: string[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  ticketValidity: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  pointOfInv: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  concernCat: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  actionCat: number[];

  @ApiProperty({
    type: 'array',
    example: []
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  raisedBy: number[];

  @IsString()
  @IsOptional()
  escalatedDate: string;

  @IsOptional()
  keyword: any;
}

//Response DTOs for the Create Ticket
export class createTicket201ResponseDto {
  @ApiProperty({
    type: 'number',
    example: 242555987
  })
  data: number;

  @ApiProperty({
    type: 'string',
    example: 'Ticket created Successfully !!'
  })
  'message': string;

  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;
}

export class createTicket400ResponseDto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'userId must be a number conforming to the specified constraints'
  })
  'message': string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

//Response DTOs for the Delete Ticket
export class deleteTicket201ResponseDto {
  @ApiProperty({
    type: 'number',
    example: 242555987
  })
  data: number;

  @ApiProperty({
    type: 'string',
    example: 'Ticket deleted Successfully !!'
  })
  'message': string;

  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;
}

export class deleteTicket400ResponseDto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'string',
    example:
      'simsMasterId must be a number conforming to the specified constraints'
  })
  'message': string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class deleteTicket404ResponseDto {
  @ApiProperty({
    type: 'number',
    example: 404
  })
  statusCode: number;

  @ApiProperty({
    type: Boolean,
    example: false
  })
  'success': string;

  @ApiProperty({
    type: 'string',
    example: 'Failed to delete ticket. Ticket not found.'
  })
  'message': string;
}

//Response DTOs for the Get Tickets
export class getTickets200ResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'number',
    example: 3088
  })
  count: number;

  @ApiProperty({
    type: 'array',
    example: [
      232451255, 232451255, 232471998, 232432877, 232489202, 232410963,
      232434177, 232436895, 232444886, 232401426, 232474281, 232407876
    ]
  })
  ColabUserIds: [];

  @ApiProperty({
    type: 'array',
    example: [
      {
        id: 242505768,
        ticketStatus: '1',
        tutorName: null,
        ticketStartDate: '2024-01-16T08:56:25.000Z',
        ticketCloseDate: null,
        isCollaborator: false,
        pointOfInvestigationMeta: null,
        ticketCreator: 'HR USER',
        sessionEvaluationPdfLink: 'test',
        sessionLink:
          'https://app.thirdspacelearning.com/learning_sessions/null',
        actionCategory: null,
        actionCategoryId: null,
        impactLevel: null,
        caseValidity: null,
        overallIssueCount: 527,
        mandatoryFields: 0,
        academicCycle: null,
        tutorError: null,
        escalatedToHRDate: null,
        isEscalatedToHR: 'Not Escalated',
        tutorSuspension: null,
        suspensionStartDate: null,
        suspensionEndDate: null,
        suspensionPeriod: null,
        raisedByDepartment: null,
        tutorBatch: null,
        RMExecutive: null,
        tutorID: null,
        concernCategory: null,
        incidentDate: 'Invalid date',
        weekCommencing: '2024-01-15',
        noOfDays: null,
        csvTicketValue: 'Open Ticket',
        csvTutorName: 'N/A',
        csvTicketStartDate: '2024-01-16',
        csvTicketCloseDate: 'N/A',
        csvPointOfInvestigation: 'N/A',
        csvSessionLink: 'N/A',
        csvActionCategory: 'N/A',
        csvImpactLevel: 'N/A',
        csvCaseValidity: 'N/A'
      },
      {
        id: 242508253,
        ticketStatus: '2',
        tutorName: 'emjay8918',
        ticketStartDate: '2024-01-16T06:15:17.000Z',
        ticketCloseDate: null,
        isCollaborator: false,
        pointOfInvestigationMeta: 'New tutor',
        ticketCreator: 'simsAdmin5 Acc',
        sessionEvaluationPdfLink: 'test',
        sessionLink:
          'https://app.thirdspacelearning.com/learning_sessions/null',
        actionCategory: 'termination',
        actionCategoryId: 90,
        impactLevel: 'Minor Incident',
        caseValidity: 'Valid',
        overallIssueCount: 45,
        mandatoryFields: 1,
        academicCycle: 'T2 C4',
        tutorError: 'Yes',
        escalatedToHRDate: '2024-01-15T18:30:00.000Z',
        isEscalatedToHR: 'Escalated',
        tutorSuspension: 'Yes',
        suspensionStartDate: '2024-01-15T18:30:00.000Z',
        suspensionEndDate: '2024-01-17T18:30:00.000Z',
        suspensionPeriod: '2 days',
        raisedByDepartment: 'Tutor Operations',
        tutorBatch: '27A',
        RMExecutive: 'Supervisor 2',
        tutorID: 100017,
        concernCategory: 'Taught the wrong LO',
        incidentDate: '2024-01-16',
        weekCommencing: '2024-01-15',
        noOfDays: null,
        csvTicketValue: 'Open Ticket',
        csvTutorName: 'emjay8918',
        csvTicketStartDate: '2024-01-16',
        csvTicketCloseDate: 'N/A',
        csvPointOfInvestigation: 'New tutor',
        csvSessionLink: 'N/A',
        csvActionCategory: 'termination',
        csvImpactLevel: 'Minor Incident',
        csvCaseValidity: 'Valid'
      },
      {
        id: 242576133,
        ticketStatus: '2',
        tutorName: null,
        ticketStartDate: '2024-01-16T06:14:44.000Z',
        ticketCloseDate: null,
        isCollaborator: false,
        pointOfInvestigationMeta: null,
        ticketCreator: 'simsAdmin5 Acc',
        sessionEvaluationPdfLink: 'test',
        sessionLink:
          'https://app.thirdspacelearning.com/learning_sessions/null',
        actionCategory: null,
        actionCategoryId: null,
        impactLevel: null,
        caseValidity: null,
        overallIssueCount: 527,
        mandatoryFields: 0,
        academicCycle: null,
        tutorError: null,
        escalatedToHRDate: null,
        isEscalatedToHR: 'Not Escalated',
        tutorSuspension: null,
        suspensionStartDate: null,
        suspensionEndDate: null,
        suspensionPeriod: null,
        raisedByDepartment: null,
        tutorBatch: null,
        RMExecutive: null,
        tutorID: null,
        concernCategory: null,
        incidentDate: 'Invalid date',
        weekCommencing: '2024-01-15',
        noOfDays: null,
        csvTicketValue: 'Open Ticket',
        csvTutorName: 'N/A',
        csvTicketStartDate: '2024-01-16',
        csvTicketCloseDate: 'N/A',
        csvPointOfInvestigation: 'N/A',
        csvSessionLink: 'N/A',
        csvActionCategory: 'N/A',
        csvImpactLevel: 'N/A',
        csvCaseValidity: 'N/A'
      }
    ]
  })
  data: [];
}

export class getTickets400ResponseDto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example:
      'each value in ticketStatus must be a number conforming to the specified constraints'
  })
  'message': string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

//Filter Response DTOs
export class searchTutorNameSuggestion200ResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        value: 8902,
        label: 'Misfar Siddeek'
      },
      {
        value: 9001,
        label: 'Misfar Siddeek'
      }
    ]
  })
  data: [];
}

export class searchTutorIdSuggestion200ResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        value: 8941,
        label: '100040'
      }
    ]
  })
  data: [];
}

export class searchTicketIdSuggestion200ResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        value: 232413275,
        label: '232413275'
      },
      {
        value: 232413984,
        label: '232413984'
      },
      {
        value: 232413986,
        label: '232413986'
      },
      {
        value: 232413998,
        label: '232413998'
      },
      {
        value: 232413759,
        label: '232413759'
      },
      {
        value: 232413953,
        label: '232413953'
      },
      {
        value: 232413098,
        label: '232413098'
      }
    ]
  })
  data: [];
}
export class searchColabTicketIdSuggestion200ResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'array',
    example: [
      2008, 2008, 2008, 2008, 2008, 2008, 2014, 2008, 2009, 2006, 2005, 2007
    ]
  })
  ColabUserIds: [];
}
export class searchRelationshipManagerNameSuggestion200ResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        value: 'Kamal Perera',
        label: 'Kamal Perera'
      }
    ]
  })
  data: [];
}
export class searchTicketCreatorNameSuggestion200ResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        value: 100147,
        label: 'HR USER'
      }
    ]
  })
  data: [];
}
