import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ContractDetailsDto {
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by hr_admin_approval',
    example: 'approved'
  })
  hr_admin_approval: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by contract_url_uploaded state',
    example: 'Signed'
  })
  contract_url_uploaded: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by contract_url audit state',
    example: 'pending'
  })
  contract_url_status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by contract_start_d',
    example: '2023-12-12T13:20:39.000Z'
  })
  contract_start_d: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by activated date from',
    example: '2023-12-12T13:20:39.000Z'
  })
  activatedDateFrom: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by activated date To',
    example: '2023-12-12T13:20:39.000Z'
  })
  activatedDateTo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by contractNo',
    example: '2'
  })
  contractNo: string;
}

export class ContractDetails200Dto {
  @ApiProperty({
    example: {
      success: true,
      data: {
        details: [
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
            tslTutorId: '',
            tslTutorName: '',
            tslTutorEmail: '',
            typeOfIdx: 'National Identity Card No.',
            nic: '543254345v',
            fullName: 'Banu Full Broo',
            address: 'Line 1, Line 2 Stuff, mataleee, 45654, ',
            auditorTspId: 3,
            auditorName: 'Auditor Acc',
            contract_url: '',
            contractNo: 1,
            contractType: 'omt',
            contractStartDate: '2023-10-17',
            contractEndDate: '',
            hr_admin_approval: 'pending',
            updated_by: 5,
            updated_at: '2023-10-25T07:16:31.000Z',
            approved_by: '',
            approved_at: '',
            hr_comment: '',
            contract_uploaded_at: '',
            contract_audited_at: '',
            contract_url_status: '',
            contract_url_reject_reason: ''
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
            tslTutorId: '',
            tslTutorName: '',
            tslTutorEmail: '',
            typeOfIdx: 'Passport No.',
            nic: '1231212121',
            fullName: 'Tete',
            address: 'Line 1, Line 4, Kansas, B123 R33, ',
            auditorTspId: 18,
            auditorName: 'Auditorthree Acc',
            contract_url: '',
            contractNo: 2,
            contractType: 'omt',
            contractStartDate: '2023-11-13',
            contractEndDate: '',
            hr_admin_approval: 'approved',
            updated_by: 4,
            updated_at: '2023-11-29T10:13:53.000Z',
            approved_by: 4,
            approved_at: '2023-11-29T10:13:53.000Z',
            hr_comment: 'test 2',
            contract_uploaded_at: '',
            contract_audited_at: '',
            contract_url_status: '',
            contract_url_reject_reason: ''
          }
        ],
        count: 166
      }
    }
  })
  data: object;
}

export class HrisCreateContractDto {
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
    description: 'contractType',
    example: 'omt'
  })
  contractType: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'startDate',
    example: '2022-02-10'
  })
  startDate: string;

  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'endDate',
    example: '2022-02-20'
  })
  endDate: string;

  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'reasonValue',
    example: 'Testing reason'
  })
  reasonValue: string;
}

export class HrisCreateContract200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        tsp_id: 2,
        contract_url: null,
        contract_no: 1,
        contract_type: 'omt',
        contract_start_d: '2023-12-12T00:00:00.000Z',
        contract_end_d: '2023-12-14T00:00:00.000Z',
        hr_admin_approval: 'approved',
        hr_comment: 'test reason',
        updated_by: 4,
        updated_at: '2023-12-13T13:31:26.000Z',
        approved_by: 4,
        approved_at: '2023-12-13T13:31:26.000Z',
        contract_assigned_at: '2023-12-13T00:00:00.000Z',
        contract_uploaded_at: null,
        contract_audited_at: null,
        contract_audited_by: null,
        contract_url_status: null,
        contract_url_reject_reason: null
      },
      {
        tsp_id: 5,
        contract_url: null,
        contract_no: 1,
        contract_type: 'omt',
        contract_start_d: '2023-12-12T00:00:00.000Z',
        contract_end_d: '2023-12-14T00:00:00.000Z',
        hr_admin_approval: 'approved',
        hr_comment: 'test reason',
        updated_by: 4,
        updated_at: '2023-12-13T13:31:26.000Z',
        approved_by: 4,
        approved_at: '2023-12-13T13:31:26.000Z',
        contract_assigned_at: '2023-12-13T00:00:00.000Z',
        contract_uploaded_at: null,
        contract_audited_at: null,
        contract_audited_by: null,
        contract_url_status: null,
        contract_url_reject_reason: null
      }
    ]
  })
  data: any[];
}

export class UpdateAdminApprovalStatusContractDto {
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

export class UpdateAdminApprovalStatusContract200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: {
      returnLog: [
        {
          tspId: 2,
          success: false,
          msg: 'Status already approved'
        },
        {
          tspId: 3,
          success: true,
          msg: 'Status approved'
        }
      ]
    }
  })
  data: any[];
}

export class UpdateActivationStatusDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    required: true,
    type: [Number],
    description: 'array of tspIds',
    example: [2, 5]
  })
  tspIds: number[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'status to update in to',
    example: 'active'
  })
  status: string;
}

export class UpdateActivationStatus200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: {
      count: 2
    }
  })
  data: any[];
}

export class FetchContractNumbers200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        contractNo: 1
      },
      {
        contractNo: 2
      },
      {
        contractNo: 8
      }
    ]
  })
  data: any[];
}
