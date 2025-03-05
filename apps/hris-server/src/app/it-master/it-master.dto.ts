import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ITMasterDto {
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
  tutorStatus: string;

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
  shortName: string;

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
    description: 'filter by submitDateFrom',
    example: '2023-12-07'
  })
  submitDateFrom: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by submitDateTo',
    example: '2023-12-17'
  })
  submitDateTo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by itAuditState',
    example: '1'
  })
  itAuditState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by itCompletion',
    example: '50'
  })
  itCompletion: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by automatedState',
    example: '79'
  })
  automatedState: string;
}

export class ITMaster200Dto {
  @ApiProperty({
    example: {
      success: true,
      count: 7,
      details: [
        {
          id: 1,
          tspId: 15,
          shortName: 'Banukax Paniyanduwage',
          residingCountry: 'Sri Lanka',
          workEmail: 'banuka+343@thirdspaceglobal.com',
          mobileNumber: '+94 12 345 6786',
          profileStatus: '',
          tutorStatus: 'audit in progress',
          supervisorName: '',
          movementType: '',
          auditorEmail: 'auditor@tsg.com',
          auditorTspId: 3,
          auditorName: 'Auditor Acc',
          itDataEmp: 6,
          itDataAuditor: 24,
          hrisItDataId: 137,
          pcType: 'Desktop',
          pcTypeStatus: 'rejected',
          pcOs: 'Windows 10',
          pcOsStatus: 'rejected',
          pcBrand: 'Acer',
          pcBrandStatus: 'approved',
          haveHeadset: 'No',
          haveHeadsetStatus: 'rejected',
          headsetUsb: '',
          headsetUsbStatus: '',
          headsetConnectivityType: '',
          laptopBatteryAge: '',
          laptopBatteryRuntime: '',
          desktopUps: '',
          desktopUpsRuntime: '',
          primaryConnectionType: '',
          primaryConnectionTypeStatus: 'rejected',
          primaryIsp: '',
          primaryDownloadSpeed: '4mbps or above',
          primaryUploadSpeed: '2mbps or below',
          primaryPing: '140ms or above',
          haveSecondaryConnection: 'No',
          secondaryConnectionType: '',
          secondaryConnectionTypeStatus: '',
          secondaryIsp: '',
          secondaryDownloadSpeed: '',
          secondaryUploadSpeed: '',
          secondaryPing: '',
          statusId: 79,
          updatedFlag: 3,
          updatedBy: 4,
          updatedAt: '2023-11-17T12:12:39.000Z'
        },
        {
          id: 2,
          tspId: 16,
          shortName: 'Testetete Call',
          residingCountry: 'Sri Lanka',
          workEmail: 'banuka+1@thirdspaceglobal.com',
          mobileNumber: '+94 12 332 4355',
          profileStatus: '',
          tutorStatus: 'audit in progress',
          supervisorName: '',
          movementType: '',
          auditorEmail: 'auditor3@tsg.com',
          auditorTspId: 18,
          auditorName: 'Auditorthree Acc',
          itDataEmp: 8,
          itDataAuditor: 27,
          hrisItDataId: 134,
          pcType: 'Desktop',
          pcTypeStatus: 'approved',
          pcOs: 'Windows 7',
          pcOsStatus: 'approved',
          pcBrand: 'Dell',
          pcBrandStatus: 'approved',
          haveHeadset: 'No',
          haveHeadsetStatus: 'approved',
          headsetUsb: '',
          headsetUsbStatus: '',
          headsetConnectivityType: '',
          laptopBatteryAge: '',
          laptopBatteryRuntime: '',
          desktopUps: 'No',
          desktopUpsRuntime: '',
          primaryConnectionType: 'Wired - Broadband',
          primaryConnectionTypeStatus: 'approved',
          primaryIsp: 'Airtel',
          primaryDownloadSpeed: '4mbps or below',
          primaryUploadSpeed: '2mbps or below',
          primaryPing: '80ms or below',
          haveSecondaryConnection: 'Yes',
          secondaryConnectionType: 'Wired - Broadband',
          secondaryConnectionTypeStatus: 'approved',
          secondaryIsp: 'SLT Mobitel',
          secondaryDownloadSpeed: '',
          secondaryUploadSpeed: '',
          statusId: 79,
          secondaryPing: '',
          updatedFlag: 3,
          updatedBy: 11,
          updatedAt: '2023-11-01T09:37:12.000Z'
        }
      ]
    }
  })
  data: object;
}
