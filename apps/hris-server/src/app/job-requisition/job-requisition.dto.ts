import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class JobRequisitionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'skip',
    example: '0'
  })
  skip: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'take',
    example: '10'
  })
  take: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'export2Csv',
    example: 'export2Csv'
  })
  export2Csv: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by auditStatus',
    example: 'audit pending'
  })
  auditStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by profileStatus',
    example: 'active'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by country',
    example: 'Sri Lanka'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by tspIds',
    example: '2,123,343'
  })
  tspId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by name',
    example: 'Banuka Knight'
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by email',
    example: 'bsa@thirdspaceglobal.com'
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by auditor',
    example: '1870'
  })
  auditor: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by jobReqApproval',
    example: 'Approved'
  })
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by jobReqApproval',
    example: 'Approved'
  })
  jobReqApproval: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by jobReqUpdatedDate',
    example: '2023-12-07'
  })
  jobReqUpdatedDate: string;
}

export class JobRequisition200Dto {
  @ApiProperty({
    example: {
      success: true,
      details: {
        rowCount: 160,
        data: [
          {
            id: 15,
            tspId: 15,
            shortName: 'Banukax Paniyanduwage',
            residingCountry: 'Sri Lanka',
            workEmail: 'banuka+343@thirdspaceglobal.com',
            mobileNumber: '+94 12 345 6786',
            tutorStatus: 'audit in progress',
            profileStatus: '',
            supervisorName: '',
            employeeStatus: '',
            movementType: '',
            auditorEmail: 'auditor@tsg.com',
            auditorTspId: 3,
            auditorName: 'Auditor Acc',
            batch: 'dfgd',
            supervisor: 'Aamina Nazar',
            employment: 'Tutor',
            division: null,
            department: null,
            jobTitle: 'dsfs',
            tutorLine: 'secondary',
            center: 'TSG',
            adminApproval: 'rejected',
            comment: 'sdfds',
            approvedAt: '2023-08-18T07:29:08.000Z',
            updated_by: 4,
            updated_at: '2023-06-26T11:27:11.000Z',
            approved_by: 4,
            approved_at: '2023-08-18T07:29:08.000Z'
          },
          {
            id: 16,
            tspId: 16,
            shortName: 'Testetete Call',
            residingCountry: 'Sri Lanka',
            workEmail: 'banuka+1@thirdspaceglobal.com',
            mobileNumber: '+94 12 332 4355',
            tutorStatus: 'audit in progress',
            profileStatus: '',
            supervisorName: '',
            employeeStatus: '',
            movementType: '',
            auditorEmail: 'auditor3@tsg.com',
            auditorTspId: 18,
            auditorName: 'Auditorthree Acc',
            batch: '11',
            supervisor: 'rm2',
            employment: 'Tutor',
            division: null,
            department: null,
            jobTitle: 'Online Mathematics Tutor',
            tutorLine: 'Primary and Secondary',
            center: 'TSG',
            adminApproval: 'approved',
            comment: '',
            approvedAt: '2023-08-18T07:29:08.000Z',
            updated_by: 4,
            updated_at: '2023-08-17T09:21:50.000Z',
            approved_by: 4,
            approved_at: '2023-08-18T07:29:08.000Z'
          }
        ]
      }
    }
  })
  data: object;
}

export class AssignAuditorDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    required: true,
    type: [Number],
    description: 'array of tspIds',
    example: [2, 5]
  })
  tspIds: number[];

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'tspId of auditor to assign',
    example: 12
  })
  auditorId: number;
}

export class AssignAuditor200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 1,
        auditor: {
          approved_personal_data: {
            shortName: 'Tutor Math'
          }
        }
      },
      {
        tspId: 2,
        auditor: {
          approved_personal_data: {
            shortName: 'Tutor Math'
          }
        }
      }
    ]
  })
  data: any[];
}

export class UpdateAdminApprovalStatusJobReqDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    required: true,
    type: [Number],
    description: 'array of tspIds',
    example: [2, 5]
  })
  tspIds: number[];

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'status to update in to',
    example: 'approved'
  })
  status: string;
}

export class UpdateAdminApprovalStatusJobReq200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: { ids: [16, 21] }
  })
  data: any[];
}

export class CreateJobRequisitionDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    required: true,
    type: [Number],
    description: 'array of tspIds',
    example: [2, 5]
  })
  tspIds: number[];

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'batch',
    example: '44-B'
  })
  batch: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'tutor center',
    example: 'TSG-IND'
  })
  center: string;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'RM tspId',
    example: 12
  })
  supervisorTspId: number;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'RM name',
    example: 'Test Name'
  })
  supervisorName: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'employmentType',
    example: 'TUTOR'
  })
  employmentType: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'employmentType',
    example: 'Online Mathematics Tutor'
  })
  jobTitle: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'tutorLine',
    example: 'Secondary'
  })
  tutorLine: string;

  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'comment',
    example: 'Testing reason'
  })
  comment: string;
}

export class CreateJobRequisition200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 1,
        batch: '2',
        center: 'TSG',
        department: null,
        division: null,
        comment: 'Testing reason',
        jobTitle: 'OMT',
        employmentType: 'TUTOR',
        tutorLine: 'TEST',
        supervisorTspId: 12
      },
      {
        tspId: 2,
        batch: '2',
        center: 'TSG',
        department: null,
        division: null,
        comment: 'Testing reason',
        jobTitle: 'OMT',
        employmentType: 'TUTOR',
        tutorLine: 'TEST',
        supervisorTspId: 12
      }
    ]
  })
  data: any[];
}

export class FetchActiveRm200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      { tspId: 9, name: 'rm1' },
      { tspId: 10, name: 'rm2' }
    ]
  })
  data: any[];
}