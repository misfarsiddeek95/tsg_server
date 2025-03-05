import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdditionalDocumentsTbDto {
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
    description: 'filter by nic',
    example: '123456789v'
  })
  nic: string;
}

export class AdditionalDocumentsTb200Dto {
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
            nic: '543254345v',
            address: 'Line 1, Line 2 Stuff, mataleee, Sri Lanka',
            auditorTspId: 3,
            auditorName: 'Auditor Acc',
            hasSupportDocuments: false,
            hasAdminDocuments: true
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
            nic: '1231212121',
            address: 'Line 1, Line 4, Kansas, Sri Lanka',
            auditorTspId: 18,
            auditorName: 'Auditorthree Acc',
            hasSupportDocuments: true,
            hasAdminDocuments: true
          }
        ],
        count: 167
      }
    }
  })
  data: object;
}

export class Succes200Dto {
  @ApiProperty({
    type: Number,
    example: 200
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    example: 'true'
  })
  success: string;
}

export class SubmitTsgDocumentsDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'tspId',
    example: 16
  })
  tspId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'documentType',
    example: 'Salary Confirmation'
  })
  documentType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'documentComment',
    example: 'Text Comment'
  })
  documentComment: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'documentUrl',
    example: '/16/support_documents/1702557273976_____1.jpeg'
  })
  documentUrl: string;
}

export class SubmitTsgDocuments200Dto {
  @ApiProperty({
    type: [],
    example: {
      documentType: 'Salary Confirmation',
      documentComment: 'sc 1',
      documentUrl: '/16/support_documents/1702557273976_____1.jpeg'
    }
  })
  data: any[];
}

export class DeleteTsgDocumentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'documentId',
    example: 22
  })
  documentId: number;
}

export class DeleteTsgDocument200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      message: 'Document deleted Successfully !!'
    }
  })
  data: any[];
}

export class FetchTsgDocuments200Dto {
  @ApiProperty({
    type: [],
    example: [
      {
        id: 1,
        tspId: 16,
        documentType: 'Employment Confirmation',
        documentName: null,
        documentComment: 'sds',
        documentUrl: '/16/support_documents/1699438132661_____2.jpg',
        documentEnable: 1,
        updatedBy: 4,
        updatedAt: '2023-11-08T10:08:54.000Z'
      },
      {
        id: 13,
        tspId: 16,
        documentType: 'Warning Letters',
        documentName: null,
        documentComment: 'contt',
        documentUrl: '/16/support_documents/1700232214305_____1.jpg',
        documentEnable: 1,
        updatedBy: 4,
        updatedAt: '2023-11-17T14:43:37.000Z'
      }
    ]
  })
  data: any[];
}

export class FetchUserDocuments200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      data: {
        details: {
          id: 4,
          tspId: 16,
          document01Type: 'Employment Confirmation',
          document01Comment: 'fsgdf',
          document01Url: '/16/support_documents/1699439336078_____4.jpg',
          document01Status: 'approved',
          document01RejectReason: '',
          document02Type: 'Contract Addendum',
          document02Comment: 'dfgdfdas',
          document02Url: '/16/support_documents/1699763816707_____1.jpeg',
          document02Status: 'approved',
          document02RejectReason: '',
          document03Type: '',
          document03Comment: '',
          document03Url: '',
          document03Status: '',
          document03RejectReason: '',
          document04Type: '',
          document04Comment: '',
          document04Url: '',
          document04Status: '',
          document04RejectReason: '',
          document05Type: '',
          document05Comment: '',
          document05Url: '',
          document05Status: '',
          document05RejectReason: '',
          document06Type: '',
          document06Comment: '',
          document06Url: '',
          document06Status: '',
          document06RejectReason: '',
          document07Type: '',
          document07Comment: '',
          document07Url: '',
          document07Status: '',
          document07RejectReason: '',
          document08Type: '',
          document08Comment: '',
          document08Url: '',
          document08Status: '',
          document08RejectReason: '',
          document09Type: '',
          document09Comment: '',
          document09Url: '',
          document09Status: '',
          document09RejectReason: '',
          document10Type: '',
          document10Comment: '',
          document10Url: '',
          document10Status: '',
          document10RejectReason: '',
          document11Type: '',
          document11Comment: '',
          document11Url: '',
          document11Status: '',
          document11RejectReason: '',
          document12Type: '',
          document12Comment: '',
          document12Url: '',
          document12Status: '',
          document12RejectReason: '',
          document13Type: '',
          document13Comment: '',
          document13Url: '',
          document13Status: '',
          document13RejectReason: '',
          document14Type: '',
          document14Comment: '',
          document14Url: '',
          document14Status: '',
          document14RejectReason: '',
          document15Type: '',
          document15Comment: '',
          document15Url: '',
          document15Status: '',
          document15RejectReason: '',
          document16Type: '',
          document16Comment: '',
          document16Url: '',
          document16Status: '',
          document16RejectReason: '',
          document17Type: '',
          document17Comment: '',
          document17Url: '',
          document17Status: '',
          document17RejectReason: '',
          document18Type: '',
          document18Comment: '',
          document18Url: '',
          document18Status: '',
          document18RejectReason: '',
          document19Type: '',
          document19Comment: '',
          document19Url: '',
          document19Status: '',
          document19RejectReason: '',
          document20Type: '',
          document20Comment: '',
          document20Url: '',
          document20Status: '',
          document20RejectReason: '',
          updatedBy: 4,
          updatedAt: '2023-11-12T04:49:37.000Z',
          auditedBy: 4,
          auditedAt: '2023-11-12T04:49:37.000Z'
        },
        approvedDetails: {
          document01Type: 'Employment Confirmation',
          document01Comment: 'fsgdf',
          document01Url: '/16/support_documents/1699439336078_____4.jpg',
          document02Type: 'Contract Addendum',
          document02Comment: 'dfgdfdas',
          document02Url: '/16/support_documents/1699763816707_____1.jpeg',
          document03Type: null,
          document03Comment: null,
          document03Url: null,
          document04Type: null,
          document04Comment: null,
          document04Url: null,
          document05Type: null,
          document05Comment: null,
          document05Url: null,
          document06Type: null,
          document06Comment: null,
          document06Url: null,
          document07Type: null,
          document07Comment: null,
          document07Url: null,
          document08Type: null,
          document08Comment: null,
          document08Url: null,
          document09Type: null,
          document09Comment: null,
          document09Url: null,
          document10Type: null,
          document10Comment: null,
          document10Url: null,
          document11Type: null,
          document11Comment: null,
          document11Url: null,
          document12Type: null,
          document12Comment: null,
          document12Url: null,
          document13Type: null,
          document13Comment: null,
          document13Url: null,
          document14Type: null,
          document14Comment: null,
          document14Url: null,
          document15Type: null,
          document15Comment: null,
          document15Url: null,
          document16Type: null,
          document16Comment: null,
          document16Url: null,
          document17Type: null,
          document17Comment: null,
          document17Url: null,
          document18Type: null,
          document18Comment: null,
          document18Url: null,
          document19Type: null,
          document19Comment: null,
          document19Url: null,
          document20Type: null,
          document20Comment: null,
          document20Url: null
        }
      }
    }
  })
  data: any[];
}

export class FetchCommonResources200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      data: [
        {
          id: 1,
          documentType: 'Schedule',
          documentName: 'e',
          documentComment: 'fsdfdsfds',
          documentUrl: '/hris-resource-documents/1700103704781_____1.jpeg',
          documentEnable: 1,
          documentGroup: null,
          updatedBy: 4,
          updatedAt: '2023-11-16T03:01:46.000Z'
        },
        {
          id: 3,
          documentType: 'Schedule',
          documentName: 'fgdg',
          documentComment: 'fsdfdsfds',
          documentUrl: '/hris-resource-documents/1700104977661_____1.jpeg',
          documentEnable: 1,
          documentGroup: null,
          updatedBy: 4,
          updatedAt: '2023-11-16T03:22:59.000Z'
        }
      ]
    }
  })
  data: any[];
}

export class SubmitCommonResourcesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'documentType',
    example: 'Schedule'
  })
  documentType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'documentComment',
    example: 'Test comment'
  })
  documentComment: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'documentUrl',
    example: '/hris-resource-documents/1702559467491_____1.jpeg'
  })
  documentUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'documentName for internal use',
    example: 'schedule v1'
  })
  documentName: string;
}

export class SubmitCommonResources200Dto {
  @ApiProperty({
    type: [],
    example: 0
  })
  data: any[];
}

export class DeleteCommonResourceDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'documentId',
    example: 4
  })
  documentId: number;
}

export class DeleteCommonResource200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      message: 'Common Resource deleted Successfully !!'
    }
  })
  data: any[];
}

export class AssignCommonResourcesDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    required: true,
    type: [Number],
    description: 'array of tspIds',
    example: [2, 5]
  })
  tspIds: number[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'documentType',
    example: 'Other'
  })
  documentType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'documentComment',
    example: 'Test comment'
  })
  documentComment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'documentName',
    example: 'Budget Documentation'
  })
  documentName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'documentUrl',
    example:
      '/hris-resource-documents/1700190379786_____pexels-photo-5792641.jpg'
  })
  documentUrl: string;
}

export class AssignCommonResources200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      message: 'Resource added successfully'
    }
  })
  data: any[];
}
