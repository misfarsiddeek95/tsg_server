import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class AuditorMasterViewDto {
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
    description: 'filter by AuditHistoryStatus',
    example: 'initial audit pass'
  })
  filterAuditHistoryStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by QualificationRating',
    example: '7'
  })
  filterQualificationRating: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by ContractAuditApproval',
    example: 'rejected'
  })
  filterContractAuditApproval: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by SectionName',
    example: 'approved_contact_data'
  })
  filterSectionName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by SectionState',
    example: '1'
  })
  filterSectionState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by PccStateApproved',
    example: 'Valid - In Progress'
  })
  filterPccStateApproved: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by PccExpFrom',
    example: '2023-12-11'
  })
  filterPccExpFrom: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by PccExpTo',
    example: '2023-12-21'
  })
  filterPccExpTo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by submissionDateFrom',
    example: '2023-12-11'
  })
  submissionDateFrom: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by submissionDateTo',
    example: '2023-12-21'
  })
  submissionDateTo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by Pcc Status',
    example: 'rejected'
  })
  filterPccStatus: string;
}

export class AuditorMasterView200Dto {
  @ApiProperty({
    example: {
      success: true,
      count: 167,
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
          submitedAt: '2023-07-12T07:37:18.000Z',
          eligibilityStatus: '',
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
          contract_url_reject_reason: '',
          gsUrl: '/15/right_to_work/1694071742533_____111_sample_pdf.pdf',
          gsUploadedAt: '',
          gsIssuedDate: '2017-05-10T00:00:00.000Z',
          gsUrlStatus: 'approved',
          gsUrlRejectReason: '',
          pccUrl:
            '/15/right_to_work/1689069890321_____rail_afco_275_cable_20220203_007_900x900.jpg',
          pccUploadedAt: '2023-07-11T00:00:00.000Z',
          pccIssuedDate: '2021-08-18T00:00:00.000Z',
          pccExpireDate: '2023-08-18T00:00:00.000Z',
          pccState: 'Expired',
          pccUrlStatus: 'approved',
          pccUrlRejectReason: 'gdfgdf',
          pccUrlApproved:
            '/15/right_to_work/1689069890321_____rail_afco_275_cable_20220203_007_900x900.jpg',
          pccExpireDateApproved: '2023-08-18T00:00:00.000Z',
          pccStateApproved: 'Expired',
          right2workUpdatedFlag: 0,
          personalUpdatedFlag: 3,
          contactUpdatedFlag: 3,
          educationalUpdatedFlag: 0,
          qualificationUpdatedFlag: 0,
          workExperienceUpdatedFlag: 0,
          itUpdatedFlag: 3,
          bankUpdatedFlag: 0,
          refereeUpdatedFlag: 0,
          supportDocUpdatedFlag: 0,
          healthUpdatedFlag: 0,
          right2workDataCount: '',
          personalDataCount: '9/15',
          contactDataCount: '14/17',
          educationalDataCount: '2/6',
          qualificationDataCount: '7/8',
          workExperienceDataCount: '',
          itDataCount: '6/9',
          bankDataCount: '',
          refereeDataCount: '16/16',
          supportDocDataCount: 0,
          healthDataCount: '',
          availabilityDataCount: '',
          auditStatusHistoryx: [
            {
              id: 66,
              tutorStatus: 'audit in progress',
              createdAt: '2023-07-12T07:37:18.000Z'
            },
            {
              id: 63,
              tutorStatus: 'audit in progress',
              createdAt: '2023-06-21T16:21:55.000Z'
            },
            {
              id: 21,
              tutorStatus: 'initial audit fail',
              createdAt: '2023-06-01T09:16:17.000Z'
            },
            {
              id: 20,
              tutorStatus: 'audit in progress',
              createdAt: '2023-06-01T07:42:43.000Z'
            }
          ]
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
          submitedAt: '2023-10-22T18:25:58.000Z',
          eligibilityStatus: '7',
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
          contract_url_reject_reason: '',
          gsUrl: '/16/right_to_work/1697983151695_____long-s.pdf',
          gsUploadedAt: '2023-10-22T00:00:00.000Z',
          gsIssuedDate: '2022-08-22T00:00:00.000Z',
          gsUrlStatus: 'pending',
          gsUrlRejectReason: '',
          pccUrl: '',
          pccUploadedAt: '',
          pccIssuedDate: '2022-08-23T00:00:00.000Z',
          pccExpireDate: '2024-08-23T00:00:00.000Z',
          pccState: 'Valid',
          pccUrlStatus: '',
          pccUrlRejectReason: '',
          pccUrlApproved: '',
          pccExpireDateApproved: '',
          pccStateApproved: '',
          right2workUpdatedFlag: 1,
          personalUpdatedFlag: 3,
          contactUpdatedFlag: 3,
          educationalUpdatedFlag: 0,
          qualificationUpdatedFlag: 0,
          workExperienceUpdatedFlag: 0,
          itUpdatedFlag: 3,
          bankUpdatedFlag: 0,
          refereeUpdatedFlag: 3,
          supportDocUpdatedFlag: 3,
          healthUpdatedFlag: 0,
          right2workDataCount: '',
          personalDataCount: '15/15',
          contactDataCount: '17/17',
          educationalDataCount: '',
          qualificationDataCount: '',
          workExperienceDataCount: '',
          itDataCount: '8/9',
          bankDataCount: '',
          refereeDataCount: '',
          supportDocDataCount: '1/1',
          healthDataCount: '',
          availabilityDataCount: '',
          auditStatusHistoryx: [
            {
              id: 77,
              tutorStatus: 'audit in progress',
              createdAt: '2023-10-22T18:25:58.000Z'
            },
            {
              id: 76,
              tutorStatus: 'initial audit fail',
              createdAt: '2023-10-22T13:43:50.000Z'
            },
            {
              id: 75,
              tutorStatus: 'audit in progress',
              createdAt: '2023-10-20T13:20:04.000Z'
            }
          ]
        }
      ]
    }
  })
  data: object;
}

export class ConfirmAllDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'tspId of candidate',
    example: 16
  })
  candidateId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'formType to approve all records of',
    example: 'personalData',
    examples: [
      'bankData',
      'personalData',
      'contactData',
      'educationData',
      'ItData',
      'rightToWorkData',
      'referenceData',
      'healthData',
      'workExperienceData',
      'qualificationData'
    ]
  })
  formType:
    | 'bankData'
    | 'personalData'
    | 'contactData'
    | 'educationData'
    | 'ItData'
    | 'rightToWorkData'
    | 'referenceData'
    | 'healthData'
    | 'workExperienceData'
    | 'qualificationData';
}

export class ConfirmAll200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      data: {
        id: 451,
        tspId: 16,
        fullName: 'Tete',
        fullNameStatus: 'approved',
        fullNameRejectReason: '',
        nameWithInitials: 'Testeete',
        nameWithInitialsStatus: 'approved',
        nameWithInitialsRejectReason: 'sds',
        firstName: 'Testetete',
        firstNameStatus: 'approved',
        firstNameRejectReason: '',
        surname: 'Call',
        surnameStatus: 'approved',
        surnameRejectReason: '',
        gender: 'Male',
        dob: '1982-08-18T00:00:00.000Z',
        dobStatus: 'approved',
        dobRejectReason: '',
        birthCertificateUrl:
          '/16/personal_details/1697808890617_____long-long-pdf-name-long-long-pdf-john-wayne-john-wayne-john-wayne-john-wayne-john-wayne-joe-dsds.pdf',
        birthCertificateUrlStatus: null,
        birthCertificateUrlRejectReason: '',
        religion: 'Buddhism',
        maritalState: 'Married',
        spouseName: 'Test Call',
        haveChildren: 'Yes',
        nic: '1231212121',
        nicStatus: 'approved',
        nicRejectReason: '',
        nicUrl: '/16/personal_details/1697811634103_____1 tall vec.png',
        nicUrlStatus: 'approved',
        nicUrlRejectReason: '',
        haveAffiliations: 'No',
        shortName: 'Testetete Call',
        age: 41,
        ppUrl: '/16/personal_details/1699169405005_____pro_pic.png',
        ppUrlStatus: 'approved',
        ppUrlRejectReason: '',
        updatedBy: 4,
        updatedAt: '2023-12-14T07:38:52.000Z',
        auditedBy: 4,
        auditedAt: '2023-12-14T07:38:52.000Z',
        nationality: 'Sri Lankan',
        typeOfId: 'Passport',
        typeOfIdStatus: 'approved',
        typeOfIdRejectReason: '',
        passportCountry: 'Angola',
        passportCountryStatus: 'approved',
        passportCountryRejectReason: '',
        passportExpirationDate: '2018-08-15T00:00:00.000Z',
        passportExpirationDateStatus: 'approved',
        passportExpirationDateRejectReason: '',
        haveRtwDocument: 'Yes',
        haveRtwDocumentStatus: 'approved',
        haveRtwDocumentRejectReason: '',
        rtwDocumentUrl:
          '/16/personal_details/1699079991565_____3 sqare vec.jpeg',
        rtwDocumentUrlStatus: 'approved',
        rtwDocumentUrlRejectReason: '',
        haveRtwExpirationDate: 'Yes',
        haveRtwExpirationDateStatus: 'approved',
        haveRtwExpirationDateRejectReason: '',
        rtwExpirationDate: '2022-08-20T00:00:00.000Z',
        rtwExpirationDateStatus: 'approved',
        rtwExpirationDateRejectReason: '',
        idLanguage: 'Arabic Saidi Spoken,Arabic Najdi Spoken',
        idLanguageStatus: 'approved',
        idLanguageRejectReason: ''
      }
    }
  })
  data: any[];
}

export class SetTutorStatusDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'tspId of tutor to change status',
    example: 2
  })
  candidateId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'new audit status to change to',
    example: 'initial audit pass discrepancy'
  })
  tutorStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'discrepancyComment',
    example: 'Test discrepancyComment'
  })
  discrepancyComment: string;
}

export class SetTutorStatus200Dto {
  @ApiProperty({
    example: {
      success: true,
      data: {
        tutorStatus: 'initial audit pass discrepancy'
      }
    }
  })
  data: object;
}

export class SetTutorEligibilityDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'tspId of tutor to change Eligibility',
    example: 2
  })
  candidateId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'new Eligibility to change to',
    example: '5'
  })
  eligibility: string;
}

export class SetTutorEligibility200Dto {
  @ApiProperty({
    example: {
      success: true,
      data: {
        eligibilityStatus: '5'
      }
    }
  })
  data: object;
}

export class AuditorFetchCandidate200Dto {
  @ApiProperty({
    type: [],
    example: {
      hris_contact_data: [
        {
          id: 323,
          tspId: 16,
          personalEmail: 'banukaknight+a1@gmail.com',
          workEmail: 'banuka+1@thirdspaceglobal.com',
          workEmailStatus: 'approved',
          workEmailRejectReason: '',
          mobileNumber: '+94 12 332 4355',
          mobileNumberStatus: 'approved',
          mobileNumberRejectReason: '',
          landlineNumber: '+94 12 312 3123',
          landlineNumberStatus: 'approved',
          landlineNumberRejectReason: '',
          residingAddressL1: 'Line 1',
          residingAddressL1Status: 'approved',
          residingAddressL1RejectReason: '',
          residingAddressL2: 'Line 4',
          residingAddressL2Status: '',
          residingAddressL2RejectReason: '',
          residingCity: 'Kansas',
          residingCityStatus: 'approved',
          residingCityRejectReason: '',
          residingDistrict: 'Puttalam',
          residingDistrictStatus: 'approved',
          residingDistrictRejectReason: '',
          residingProvince: 'North Western',
          residingProvinceStatus: 'approved',
          residingProvinceRejectReason: '',
          residingCountry: 'Sri Lanka',
          residingCountryStatus: 'approved',
          residingCountryRejectReason: '',
          sameResidingPermanent: 'Yes',
          permanentAddressL1: 'Line 1',
          permanentAddressL1Status: 'approved',
          permanentAddressL1RejectReason: '',
          permanentAddressL2: 'Line 4',
          permanentAddressL2Status: '',
          permanentAddressL2RejectReason: '',
          permanentCity: 'Kansas',
          permanentCityStatus: 'approved',
          permanentCityRejectReason: '',
          permanentDistrict: 'Puttalam',
          permanentDistrictStatus: 'approved',
          permanentDistrictRejectReason: '',
          permanentProvince: 'North Western',
          permanentProvinceStatus: 'approved',
          permanentProvinceRejectReason: '',
          permanentCountry: 'Sri Lanka',
          permanentCountryStatus: 'approved',
          permanentCountryRejectReason: '',
          emgContactName: 'Test Call',
          emgRelationship: 'Sibling',
          emgContactNum: '+94 07 777 1115',
          emgContactNumStatus: 'approved',
          emgContactNumRejectReason: '',
          residingPin: 'B123 R33',
          residingPinStatus: 'approved',
          residingPinRejectReason: '',
          permanentPin: 'B123 R33',
          permanentPinStatus: 'approved',
          permanentPinRejectReason: '',
          updatedBy: 4,
          updatedAt: '2023-10-20T14:31:04.000Z',
          auditedBy: 4,
          auditedAt: '2023-10-20T14:31:04.000Z',
          recordApproved: ''
        }
      ],
      approved_contact_data: {
        personalEmail: 'banukaknight+a1@gmail.com',
        workEmail: 'banuka+1@thirdspaceglobal.com',
        mobileNumber: '+94 12 332 4355',
        landlineNumber: '+94 12 312 3123',
        residingAddressL1: 'Line 1',
        residingAddressL2: 'Line 4',
        residingCity: 'Kansas',
        residingDistrict: 'Puttalam',
        residingProvince: 'North Western',
        residingCountry: 'Sri Lanka',
        sameResidingPermanent: 'Yes',
        permanentAddressL1: 'Line 1',
        permanentAddressL2: 'Line 4',
        permanentCity: 'Kansas',
        permanentDistrict: 'Puttalam',
        permanentProvince: 'North Western',
        permanentCountry: 'Sri Lanka',
        emgContactName: 'Test Call',
        emgRelationship: 'Sibling',
        emgContactNum: '+94 07 777 1115',
        residingPin: 'B123 R33',
        permanentPin: 'B123 R33'
      },
      hris_personal_data: [
        {
          fullName: 'Tete',
          fullNameStatus: 'approved',
          fullNameRejectReason: '',
          nameWithInitials: 'Testeete',
          nameWithInitialsStatus: 'rejected',
          nameWithInitialsRejectReason: 'sds',
          firstName: 'Testetete',
          firstNameStatus: 'approved',
          firstNameRejectReason: '',
          surname: 'Call',
          surnameStatus: 'approved',
          surnameRejectReason: '',
          gender: 'Male',
          dob: '1982-08-18T00:00:00.000Z',
          dobStatus: 'approved',
          dobRejectReason: '',
          birthCertificateUrl:
            '/16/personal_details/1697808890617_____long-long-pdf-name-long-long-pdf-john-wayne-john-wayne-john-wayne-john-wayne-john-wayne-joe-dsds.pdf',
          birthCertificateUrlStatus: '',
          birthCertificateUrlRejectReason: '',
          religion: 'Buddhism',
          maritalState: 'Married',
          spouseName: 'Test Call',
          haveChildren: 'Yes',
          nic: '1231212121',
          nicStatus: 'approved',
          nicRejectReason: '',
          nicUrl: '/16/personal_details/1697811634103_____1 tall vec.png',
          nicUrlStatus: 'approved',
          nicUrlRejectReason: '',
          haveAffiliations: 'No',
          shortName: 'Testetete Call',
          age: 41,
          ppUrl: '/16/personal_details/1699169405005_____pro_pic.png',
          ppUrlStatus: 'approved',
          ppUrlRejectReason: '',
          nationality: 'Sri Lankan',
          typeOfId: 'Passport',
          typeOfIdStatus: 'approved',
          typeOfIdRejectReason: '',
          passportCountry: 'Angola',
          passportCountryStatus: 'approved',
          passportCountryRejectReason: '',
          passportExpirationDate: '2018-08-15T00:00:00.000Z',
          passportExpirationDateStatus: 'approved',
          passportExpirationDateRejectReason: '',
          haveRtwDocument: 'Yes',
          haveRtwDocumentStatus: 'approved',
          haveRtwDocumentRejectReason: '',
          rtwDocumentUrl:
            '/16/personal_details/1699079991565_____3 sqare vec.jpeg',
          rtwDocumentUrlStatus: 'approved',
          rtwDocumentUrlRejectReason: '',
          haveRtwExpirationDate: 'Yes',
          haveRtwExpirationDateStatus: 'approved',
          haveRtwExpirationDateRejectReason: '',
          rtwExpirationDate: '2022-08-20T00:00:00.000Z',
          rtwExpirationDateStatus: 'approved',
          rtwExpirationDateRejectReason: '',
          idLanguage: 'Arabic Saidi Spoken,Arabic Najdi Spoken',
          idLanguageStatus: 'approved',
          idLanguageRejectReason: '',
          xfamily_affiliations: []
        }
      ],
      approved_personal_data: {
        fullName: 'Tete',
        nameWithInitials: 'Testeete',
        firstName: 'Testetete',
        surname: 'Call',
        gender: 'Male',
        dob: '1982-08-18T00:00:00.000Z',
        birthCertificateUrl:
          '/16/personal_details/1697808890617_____long-long-pdf-name-long-long-pdf-john-wayne-john-wayne-john-wayne-john-wayne-john-wayne-joe-dsds.pdf',
        religion: 'Buddhism',
        maritalState: 'Married',
        spouseName: 'Test Call',
        haveChildren: 'Yes',
        nic: '1231212121',
        nicUrl: '/16/personal_details/1697811634103_____1 tall vec.png',
        haveAffiliations: 'No',
        shortName: 'Testetete Call',
        age: 41,
        ppUrl: '/16/personal_details/1699169405005_____pro_pic.png',
        nationality: '',
        typeOfId: 'Passport',
        passportCountry: 'Angola',
        passportExpirationDate: '2018-08-15T00:00:00.000Z',
        haveRtwDocument: 'Yes',
        rtwDocumentUrl:
          '/16/personal_details/1699079991565_____3 sqare vec.jpeg',
        haveRtwExpirationDate: 'Yes',
        rtwExpirationDate: '2022-08-20T00:00:00.000Z',
        idLanguage: 'Arabic Saidi Spoken,Arabic Najdi Spoken'
      },
      hris_bank_data: [],
      approved_bank_data: null,
      hris_education_data: [],
      approved_education_data: null,
      hris_it_data: [
        {
          id: 134,
          tspId: 16,
          havePc: 'Yes',
          havePcStatus: 'approved',
          havePcRejectReason: '',
          pcType: 'Desktop',
          pcTypeStatus: 'approved',
          pcTypeRejectReason: '',
          pcOwnership: '3rd party PC',
          pcOwnershipStatus: 'approved',
          pcOwnershipRejectReason: '',
          pcBrand: 'Dell',
          pcBrandStatus: 'approved',
          pcBrandRejectReason: '',
          pcBrandOther: '',
          pcBrandOtherStatus: '',
          pcBrandOtherRejectReason: '',
          pcModel: 'banu',
          pcModelStatus: 'approved',
          pcModelRejectReason: '',
          pcBitVersion: '32 bit',
          pcBitVersionStatus: 'approved',
          pcBitVersionRejectReason: '',
          laptopSerial: '',
          laptopSerialStatus: '',
          laptopSerialRejectReason: '',
          laptopBatteryAge: '',
          laptopBatteryAgeStatus: '',
          laptopBatteryAgeRejectReason: '',
          laptopBatteryRuntime: '',
          laptopBatteryRuntimeStatus: '',
          laptopBatteryRuntimeRejectReason: '',
          pcOs: 'Windows 7',
          pcOsStatus: 'approved',
          pcOsRejectReason: '',
          pcOsOther: '',
          pcOsOtherStatus: '',
          pcOsOtherRejectReason: '',
          pcProcessor: 'I3 9th Generation',
          pcProcessorStatus: 'approved',
          pcProcessorRejectReason: '',
          pcProcessorOther: '',
          pcProcessorOtherStatus: '',
          pcProcessorOtherRejectReason: '',
          pcRam: '8gb',
          pcRamStatus: 'approved',
          pcRamRejectReason: '',
          hdType: 'SSD',
          hdTypeStatus: '',
          hdTypeRejectReason: '',
          hdCapacity: '56',
          hdCapacityStatus: 'approved',
          hdCapacityRejectReason: '',
          pcBrowsers: 'Mozilla Firefox,Opera',
          pcBrowsersStatus: 'approved',
          pcBrowsersRejectReason: '',
          pcAntivirus: 'Avast',
          pcAntivirusStatus: 'approved',
          pcAntivirusRejectReason: '',
          pcAntivirusOther: '',
          pcAntivirusOtherStatus: '',
          pcAntivirusOtherRejectReason: '',
          lastServiceDate: '1 Year ago',
          lastServiceDateStatus: 'approved',
          lastServiceDateRejectReason: '',
          pcIPAddress: '565',
          pcIPAddressStatus: 'approved',
          pcIPAddressRejectReason: '',
          ramUrl: '',
          ramUrlStatus: 'approved',
          ramUrlRejectReason: '',
          pcUrl: '',
          pcUrlStatus: 'approved',
          pcUrlRejectReason: '',
          desktopUps: 'No',
          desktopUpsStatus: 'approved',
          desktopUpsRejectReason: '',
          desktopUpsUrl: '',
          desktopUpsUrlStatus: '',
          desktopUpsUrlRejectReason: '',
          desktopUpsRuntime: '',
          desktopUpsRuntimeStatus: '',
          desktopUpsRuntimeRejectReason: '',
          haveHeadset: 'No',
          haveHeadsetStatus: 'approved',
          haveHeadsetRejectReason: '',
          headsetUsb: '',
          headsetUsbStatus: '',
          headsetUsbRejectReason: '',
          headsetConnectivityType: '',
          headsetConnectivityTypeStatus: '',
          headsetConnectivityTypeRejectReason: '',
          headsetMuteBtn: '',
          headsetMuteBtnStatus: '',
          headsetMuteBtnRejectReason: '',
          headsetNoiseCancel: '',
          headsetNoiseCancelStatus: '',
          headsetNoiseCancelRejectReason: '',
          headsetSpecs: '',
          headsetSpecsStatus: '',
          headsetSpecsRejectReason: '',
          headsetUrl: '',
          headsetUrlStatus: '',
          headsetUrlRejectReason: '',
          primaryConnectionType: 'Wired - Broadband',
          primaryConnectionTypeStatus: 'approved',
          primaryConnectionTypeRejectReason: '',
          primaryIsp: 'Airtel',
          primaryIspStatus: 'approved',
          primaryIspRejectReason: '',
          primaryIspOther: '',
          primaryIspOtherStatus: '',
          primaryIspOtherRejectReason: '',
          primaryConnectedCount: '',
          primaryConnectedCountStatus: '',
          primaryConnectedCountRejectReason: '',
          primaryDownloadSpeed: '4mbps or below',
          primaryDownloadSpeedStatus: 'approved',
          primaryDownloadSpeedRejectReason: '',
          primaryUploadSpeed: '2mbps or below',
          primaryUploadSpeedStatus: 'approved',
          primaryUploadSpeedRejectReason: '',
          primaryPing: '80ms or below',
          primaryPingStatus: 'approved',
          primaryPingRejectReason: '',
          haveSecondaryConnection: 'Yes',
          haveSecondaryConnectionStatus: 'approved',
          haveSecondaryConnectionRejectReason: '',
          secondaryConnectionType: 'Wired - Broadband',
          secondaryConnectionTypeStatus: 'approved',
          secondaryConnectionTypeRejectReason: '',
          secondaryIsp: 'SLT Mobitel',
          secondaryIspStatus: 'approved',
          secondaryIspRejectReason: '',
          secondaryIspOther: '',
          secondaryIspOtherStatus: '',
          secondaryIspOtherRejectReason: '',
          secondaryDownloadSpeed: '',
          secondaryDownloadSpeedStatus: '',
          secondaryDownloadSpeedRejectReason: '',
          secondaryUploadSpeed: '',
          secondaryUploadSpeedStatus: '',
          secondaryUploadSpeedRejectReason: '',
          secondaryPing: '',
          secondaryPingStatus: '',
          secondaryPingRejectReason: '',
          primarySpeedUrl: '',
          primarySpeedUrlStatus: 'approved',
          primarySpeedUrlRejectReason: '',
          secondarySpeedUrl: '',
          secondarySpeedUrlStatus: '',
          secondarySpeedUrlRejectReason: '',
          responsibleItCheck: '',
          updatedBy: 11,
          updatedAt: '2023-11-01T09:37:12.000Z',
          auditedBy: 11,
          auditedAt: '2023-11-01T09:37:12.000Z'
        }
      ],
      approved_it_data: {
        havePc: 'Yes',
        pcType: 'Desktop',
        pcOwnership: '3rd party PC',
        pcBrand: 'Dell',
        pcBrandOther: null,
        pcModel: 'banu',
        pcBitVersion: '32 bit',
        laptopSerial: null,
        laptopBatteryAge: null,
        laptopBatteryRuntime: null,
        pcOs: 'Windows 7',
        pcOsOther: null,
        pcProcessor: 'I3 9th Generation',
        pcProcessorOther: null,
        pcRam: '8gb',
        hdType: null,
        hdCapacity: '56',
        pcBrowsers: 'Mozilla Firefox,Opera',
        pcAntivirus: 'Avast',
        pcAntivirusOther: null,
        lastServiceDate: '1 Year ago',
        pcIPAddress: '565',
        ramUrl: '',
        pcUrl: '',
        desktopUps: 'No',
        desktopUpsUrl: null,
        desktopUpsRuntime: null,
        haveHeadset: 'No',
        headsetUsb: null,
        headsetConnectivityType: null,
        headsetMuteBtn: null,
        headsetNoiseCancel: null,
        headsetSpecs: null,
        headsetUrl: null,
        primaryConnectionType: 'Wired - Broadband',
        primaryIsp: 'Airtel',
        primaryIspOther: null,
        primaryConnectedCount: null,
        primaryDownloadSpeed: '4mbps or below',
        primaryUploadSpeed: '2mbps or below',
        primaryPing: '80ms or below',
        haveSecondaryConnection: 'Yes',
        secondaryConnectionType: 'Wired - Broadband',
        secondaryIsp: 'SLT Mobitel',
        secondaryIspOther: null,
        secondaryDownloadSpeed: null,
        secondaryUploadSpeed: null,
        secondaryPing: null,
        primarySpeedUrl: '',
        secondarySpeedUrl: null,
        responsibleItCheck: ''
      },
      hris_health_data: [],
      approved_health_data: null,
      hris_right2work_data: [
        {
          id: 57,
          tspId: 16,
          contractUrl: '',
          contractUrlStatus: '',
          contractUrlRejectReason: '',
          gsIssuedDate: '2022-08-22T00:00:00.000Z',
          gsIssuedDateStatus: 'pending',
          gsIssuedDateRejectReason: '',
          gsUrl: '/16/right_to_work/1697983151695_____long-s.pdf',
          gsUrlStatus: 'pending',
          gsUrlRejectReason: '',
          gsUploadedAt: '2023-10-22T00:00:00.000Z',
          pccIssuedDate: '2022-08-23T00:00:00.000Z',
          pccIssuedDateStatus: 'pending',
          pccIssuedDateRejectReason: '',
          pccReferenceNo: '44',
          pccReferenceNoStatus: 'pending',
          pccReferenceNoRejectReason: '',
          pccUrl: '',
          pccUrlStatus: '',
          pccUrlRejectReason: '',
          pccUploadedAt: null,
          pccExpireDate: '2024-08-23T00:00:00.000Z',
          pccState: 'Valid',
          requireBackgroundCheck: null,
          contractStartDate: null,
          contractStartDateStatus: 'pending',
          contractStartDateRejectReason: null,
          contractEndDate: null,
          contractEndDateStatus: 'pending',
          contractEndDateRejectReason: null,
          contractType: null,
          contractTypeStatus: 'pending',
          contractTypeRejectReason: null,
          recordApproved: '',
          updatedBy: 16,
          updatedAt: '2023-10-22T13:59:13.000Z',
          auditedBy: null,
          auditedAt: null
        }
      ],
      approved_right2work_data: {
        contractUrl: null,
        gsIssuedDate: null,
        gsUrl: null,
        pccIssuedDate: null,
        pccReferenceNo: null,
        pccUrl: null,
        pccExpireDate: null,
        pccState: null
      },
      approved_contract_data: {
        contract_url: null,
        contract_no: 2,
        contract_type: 'omt',
        contract_start_d: '2023-11-13T00:00:00.000Z',
        contract_end_d: null,
        hr_admin_approval: 'approved',
        hr_comment: 'test 2',
        updated_by: 4,
        updated_at: '2023-11-29T10:13:53.000Z',
        approved_by: 4,
        approved_at: '2023-11-29T10:13:53.000Z',
        contract_assigned_at: '2023-11-29T00:00:00.000Z',
        contract_uploaded_at: null,
        contract_audited_at: null,
        contract_audited_by: null,
        contract_url_status: null,
        contract_url_reject_reason: null
      },
      HrisRefereeData: [
        {
          id: 55,
          tspId: 16,
          refereeTitle1: 'Dr',
          refereeFirstName1: 'Sds',
          refereeLastName1: 'Sds',
          refereeRelationship1: 'Serter',
          refereeEmail1: 'banuka+2@thirdspaceglobal.com',
          refereeTelephoneNumber1: '+94 34 234 2342',
          refereeConfirmation1: 'agree',
          refereeTitle2: '',
          refereeFirstName2: null,
          refereeLastName2: null,
          refereeRelationship2: null,
          refereeEmail2: '',
          refereeTelephoneNumber2: '',
          refereeConfirmation2: '',
          acknowledgement1: 'agree',
          acknowledgement2: '',
          referee1Status: 'approved',
          referee1RejectReason: '',
          referee2Status: '',
          referee2RejectReason: '',
          confirmation: null,
          updatedBy: 4,
          updatedAt: '2023-11-08T10:30:38.000Z',
          auditedBy: 4,
          auditedAt: '2023-11-08T10:30:38.000Z'
        }
      ],
      approved_referee_data: {
        refereeTitle1: 'Dr',
        refereeFirstName1: 'Sds',
        refereeLastName1: 'Sds',
        refereeRelationship1: 'Serter',
        refereeEmail1: 'banuka+2@thirdspaceglobal.com',
        refereeTelephoneNumber1: '+94 34 234 2342',
        refereeConfirmation1: 'agree',
        refereeTitle2: null,
        refereeFirstName2: null,
        refereeLastName2: null,
        refereeRelationship2: null,
        refereeEmail2: null,
        refereeTelephoneNumber2: null,
        refereeConfirmation2: null,
        acknowledgement1: 'agree',
        acknowledgement2: null,
        emailFlag1: -1,
        emailFlag2: null,
        submissionFlag1: -1,
        submissionFlag2: null
      },
      user_hris_progress: {
        tutorStatus: 'audit in progress',
        eligibilityStatus: '7',
        profileStatus: null
      },
      hris_work_exp_data: [],
      approved_work_exp_data: null,
      hris_qualifications_data: [],
      hris_support_documents: [
        {
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
        }
      ],
      ApprovedXotherAdminDocs: [
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
        },
        {
          id: 8,
          tspId: 16,
          documentType: 'Schedule',
          documentName: 'e',
          documentComment: 'fsdfdsfds 3',
          documentUrl: '/hris-resource-documents/1700103704781_____1.jpeg',
          documentEnable: 1,
          updatedBy: 4,
          updatedAt: '2023-11-17T08:49:27.000Z'
        },
        {
          id: 23,
          tspId: 16,
          documentType: 'Schedule',
          documentName: 'sds',
          documentComment: 'yeee',
          documentUrl: '/hris-resource-documents/1700229234146_____100153.jpg',
          documentEnable: 1,
          updatedBy: 4,
          updatedAt: '2023-11-17T15:32:50.000Z'
        }
      ],
      approved_support_documents: {
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
  })
  data: any[];
}

export class CheckRehireStatus200Dto {
  @ApiProperty({
    type: [],
    example: {
      data: {
        foundNICDetails: {
          tspId: 15,
          shortName: 'Banukax Paniyanduwage',
          tooltip: 'NIC/Passport number is found in another account.'
        }
      }
    }
  })
  data: any[];
}

export class FetchEligibilities200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        eligibilityStatus: '7'
      },
      {
        eligibilityStatus: 'N/A'
      },
      {
        eligibilityStatus: '11'
      }
    ]
  })
  data: any[];
}
