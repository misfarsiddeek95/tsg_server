import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DocumentMasterDto {
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
}

export class DocumentMaster200Dto {
  @ApiProperty({
    example: {
      success: true,
      details: {
        rowCount: 167,
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
            auditor: 'auditor@tsg.com',
            workStatus: null,
            birthCertificate:
              '15/personal_details/1694154749160_____long-long-pdf-name-long-long-pdf-john-wayne-john-wayne-john-wayne-john-wayne-john-wayne-joe-dsds.pdf',
            nic: '/15/personal_details/1699047111633_____image (24).png',
            profilePicture:
              '/15/personal_details/1699050016383_____pro_pic.png',
            gsCertificate:
              '/15/right_to_work/1694071742533_____111_sample_pdf.pdf',
            policeCertificate:
              '/15/right_to_work/1689069890321_____rail_afco_275_cable_20220203_007_900x900.jpg',
            olCertificate: '',
            alCertificate: '',
            workExperience: null,
            imageOfPC: '/4/hardware_internet/1689994629860_____Group 818.jpg',
            imageOfHeadset: null,
            speedTest: '/15/hardware_internet/1689248465220_____image (17).png',
            bankPassbook: null
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
            auditor: 'auditor3@tsg.com',
            workStatus: null,
            birthCertificate:
              '/16/personal_details/1697808890617_____long-long-pdf-name-long-long-pdf-john-wayne-john-wayne-john-wayne-john-wayne-john-wayne-joe-dsds.pdf',
            nic: '/16/personal_details/1697811634103_____1 tall vec.png',
            profilePicture:
              '/16/personal_details/1699169405005_____pro_pic.png',
            gsCertificate: null,
            policeCertificate: null,
            olCertificate: null,
            alCertificate: null,
            workExperience: null,
            imageOfPC: '',
            imageOfHeadset: null,
            speedTest: '',
            bankPassbook: null
          }
        ]
      }
    }
  })
  data: object;
}
