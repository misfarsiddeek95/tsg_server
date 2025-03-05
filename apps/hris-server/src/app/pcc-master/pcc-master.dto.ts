import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PCCMasterDto {
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by expireDateFrom',
    example: '2023-12-12'
  })
  expireDateFrom: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by expireDateTo',
    example: '2023-12-22'
  })
  expireDateTo: string;
}

export class PCCMaster200Dto {
  @ApiProperty({
    example: {
      success: true,
      count: 9,
      data: [
        {
          id: 1,
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
          issuedDate: '2021-08-18',
          expireDate: '2023-08-18',
          before5month: '2023-03-18',
          before3month: '2023-05-18',
          before1_5month: '2023-06-18',
          before1day: '2023-08-17',
          after1_5month: '2023-10-18',
          pccUrl:
            '/15/right_to_work/1689069890321_____rail_afco_275_cable_20220203_007_900x900.jpg',
          pccReferenceNo: '76819611',
          pccStatus: 'Expired'
        },
        {
          id: 2,
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
          issuedDate: '',
          expireDate: '',
          before5month: '',
          before3month: '',
          before1_5month: '',
          before1day: '',
          after1_5month: '',
          pccUrl: '',
          pccReferenceNo: '',
          pccStatus: ''
        }
      ]
    }
  })
  data: object;
}
