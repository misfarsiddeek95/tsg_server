import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PCCHistoryDto {
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
  auditorId: string;
}

export class PCCHistory200Dto {
  @ApiProperty({
    example: {
      success: true,
      count: 3,
      data: [
        {
          id: 1,
          tspId: 21,
          shortName: 'C D',
          residingCountry: 'Sri Lanka',
          workEmail: 'banuka+1@thirdspaceglobal.com',
          mobileNumber: '+94123324323',
          tutorStatus: 'audit in progress',
          profileStatus: 'onboarding ready',
          supervisorName: 'rm2',
          employeeStatus: 'Inactive',
          movementType: 'Resignation',
          auditorEmail: 'auditor2@tsg.com',
          tslTutorId: 1212,
          tslTutorName: 'ewrwe',
          tslTutorEmail: 'bk@tsg.com',
          emailSentDate: '2023-01-06',
          nameTo: 'Bb',
          emailTo: 'banuka+1@thirdspaceglobal.com',
          OldPccExpiredDate: '2023-01-09',
          emailSubject: 'PCC First Reminder',
          latestPccIssuedDate: '2022-08-02',
          latestPccExpiredDate: '2023-01-09',
          emailBcc:
            "[['banuka+rm@thirdspaceglobal.com',''],['capacityteam@thirdspaceglobal.com','Capacity Team']]",
          pccReferenceNo: '',
          pccStatus: null,
          pccUrl: '/111_sample_pdf.pdf'
        },
        {
          id: 2,
          tspId: 38,
          shortName: 'SLCandidate ACChnlsj',
          residingCountry: 'Sri Lanka',
          workEmail: 'banuka+tt8@thirdspaceglobal.com',
          mobileNumber: '+94123456789',
          tutorStatus: 'audit in progress',
          profileStatus: 'active',
          supervisorName: 'Ahamed Hussain',
          employeeStatus: 'Active',
          movementType: 'On Hold',
          auditorEmail: 'auditor3@tsg.com',
          tslTutorId: '',
          tslTutorName: '',
          tslTutorEmail: '',
          emailSentDate: '2023-16-09',
          nameTo: 'SLCandidate',
          emailTo: 'banuka+tt8@thirdspaceglobal.com',
          OldPccExpiredDate: '2023-17-09',
          emailSubject: 'PCC Deadline Over',
          latestPccIssuedDate: '2021-17-09',
          latestPccExpiredDate: '2023-17-09',
          emailBcc: '[]',
          pccReferenceNo: '534534',
          pccStatus: 'Expired',
          pccUrl: ''
        }
      ]
    }
  })
  data: object;
}
