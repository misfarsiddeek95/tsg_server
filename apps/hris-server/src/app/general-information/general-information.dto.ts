import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsNotEmpty
} from 'class-validator';

export class FetchPersonalDetailsDto {
  @ApiProperty({
    example: {
      fullName: 'Dilki Wijewardhana',
      fullNameStatus: 'approved',
      fullNameRejectReason: 'dd',
      nameWithInitials: 'D S Wijewardhana',
      nameWithInitialsStatus: 'approved',
      nameWithInitialsRejectReason: 'x',
      firstName: 'Dilki',
      firstNameStatus: 'approved',
      firstNameRejectReason: 'cdf',
      surname: 'Wijewardhana',
      surnameStatus: 'approved',
      surnameRejectReason: 'dd',
      gender: 'female',
      dob: '1998-04-22T00:00:00.000Z',
      dobStatus: 'pending',
      dobRejectReason: '',
      birthCertificateUrl: '/5/personal_details/1686145841509_____2.jpeg',
      birthCertificateUrlStatus: null,
      birthCertificateUrlRejectReason: null,
      religion: 'Buddhism',
      maritalState: null,
      spouseName: '',
      haveChildren: null,
      nic: '973353536V',
      nicStatus: 'approved',
      nicRejectReason: 'nic reject',
      nicUrl: '/5/personal_details/1686145841509_____2.jpeg',
      nicUrlStatus: 'approved',
      nicUrlRejectReason: 'nic photo reje',
      haveAffiliations: 'Yes',
      shortName: 'Dilki Wijewardhana',
      age: 25,
      ppUrl: '/5/personal_details/1686145841509_____2.jpeg',
      ppUrlStatus: 'approved',
      ppUrlRejectReason: '',
      nationality: 'Sri Lankan',
      typeOfId: null,
      typeOfIdStatus: 'approved',
      typeOfIdRejectReason: '',
      passportCountry: '',
      passportCountryStatus: 'pending',
      passportCountryRejectReason: '',
      passportExpirationDate: null,
      passportExpirationDateStatus: 'pending',
      passportExpirationDateRejectReason: '',
      haveRtwDocument: '',
      haveRtwDocumentStatus: 'pending',
      haveRtwDocumentRejectReason: '',
      rtwDocumentUrl: '/5/personal_details/1686145841509_____2.jpeg',
      rtwDocumentUrlStatus: 'pending',
      rtwDocumentUrlRejectReason: '',
      haveRtwExpirationDate: '',
      haveRtwExpirationDateStatus: 'pending',
      haveRtwExpirationDateRejectReason: '',
      rtwExpirationDate: null,
      rtwExpirationDateStatus: 'pending',
      rtwExpirationDateRejectReason: '',
      idLanguage: null,
      idLanguageStatus: 'approved',
      idLanguageRejectReason: '',
      xfamily_affiliations: [
        {
          affiliateName: 'Herath',
          affiliateRelationship: 'Sibling',
          affiliateJob: 'Teacher'
        }
      ]
    }
  })
  details: object;

  @ApiProperty({
    example: {
      fullName: 'Dilki Wijewardhana',
      nameWithInitials: 'D S Wijewardhana',
      firstName: 'Dilki',
      surname: 'Wijewardhana',
      gender: null,
      dob: '1998-04-22T00:00:00.000Z',
      birthCertificateUrl: null,
      religion: null,
      maritalState: null,
      spouseName: '',
      haveChildren: null,
      nic: '973353536V',
      nicUrl: null,
      haveAffiliations: 'yes',
      shortName: 'Dilki Wijewardhana',
      age: 24,
      ppUrl: null,
      nationality: 'Sri Lankan',
      typeOfId: null,
      passportCountry: null,
      passportExpirationDate: null,
      haveRtwDocument: null,
      rtwDocumentUrl: null,
      haveRtwExpirationDate: null,
      rtwExpirationDate: null,
      idLanguage: null
    }
  })
  approvedDetails: object;
}

export class FetchContactDetailsDto {
  @ApiProperty({
    example: {
      id: 3112,
      tspId: 129856,
      personalEmail: 'bhariq+1417@thirdspaceglobal.com',
      workEmail: 'bhariq+1417@thirdspaceglobal.com',
      workEmailStatus: 'pending',
      workEmailRejectReason: null,
      mobileNumber: '+94 00 399 3948',
      mobileNumberStatus: 'pending',
      mobileNumberRejectReason: null,
      landlineNumber: '+94 77 266 2661',
      landlineNumberStatus: 'pending',
      landlineNumberRejectReason: null,
      residingAddressL1: '320B, Bbb',
      residingAddressL1Status: 'pending',
      residingAddressL1RejectReason: null,
      residingAddressL2: 'abc',
      residingAddressL2Status: 'pending',
      residingAddressL2RejectReason: null,
      residingCity: 'Er',
      residingCityStatus: 'pending',
      residingCityRejectReason: null,
      residingDistrict: 'Anand - Gujarat',
      residingDistrictStatus: 'pending',
      residingDistrictRejectReason: null,
      residingProvince: 'Gujarat',
      residingProvinceStatus: null,
      residingProvinceRejectReason: null,
      residingCountry: 'India',
      residingCountryStatus: null,
      residingCountryRejectReason: null,
      sameResidingPermanent: 'No',
      permanentAddressL1: '320B, Aaa',
      permanentAddressL1Status: 'pending',
      permanentAddressL1RejectReason: null,
      permanentAddressL2: '',
      permanentAddressL2Status: 'pending',
      permanentAddressL2RejectReason: null,
      permanentCity: 'Hhhh',
      permanentCityStatus: 'pending',
      permanentCityRejectReason: null,
      permanentDistrict: 'Dibang Valley - Arunachal Pradesh',
      permanentDistrictStatus: 'pending',
      permanentDistrictRejectReason: null,
      permanentProvince: 'Arunachal Pradesh',
      permanentProvinceStatus: 'pending',
      permanentProvinceRejectReason: null,
      permanentCountry: 'India',
      permanentCountryStatus: 'pending',
      permanentCountryRejectReason: null,
      emgContactName: 'Dd',
      emgRelationship: 'Sibling',
      emgContactNum: '+91 76888-48848',
      emgContactNumStatus: 'pending',
      emgContactNumRejectReason: null,
      residingPin: '55',
      residingPinStatus: 'pending',
      residingPinRejectReason: null,
      permanentPin: '333',
      permanentPinStatus: 'pending',
      permanentPinRejectReason: null,
      updatedBy: 129856,
      updatedAt: '2023-09-28T07:31:35.000Z',
      auditedBy: null,
      auditedAt: null,
      recordApproved: null
    }
  })
  details: object;

  @ApiProperty({
    example: {
      personalEmail: 'bhariq+1417@thirdspaceglobal.com',
      workEmail: 'bhariq+1417@thirdspaceglobal.com',
      mobileNumber: '+94003993948',
      landlineNumber: null,
      residingAddressL1: null,
      residingAddressL2: null,
      residingCity: '',
      residingDistrict: null,
      residingProvince: 'Gujarat',
      residingCountry: 'India',
      sameResidingPermanent: null,
      permanentAddressL1: null,
      permanentAddressL2: null,
      permanentCity: null,
      permanentDistrict: null,
      permanentProvince: null,
      permanentCountry: null,
      emgContactName: null,
      emgRelationship: null,
      emgContactNum: null,
      residingPin: null,
      permanentPin: null
    }
  })
  approvedDetails: object;
}

export class SubmitPersonalDetailsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 8
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: 'candidate'
  })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'country',
    example: 'Sri Lanka'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Profile Status',
    example: 'active'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Full name',
    example: 'Dilki Wijewardhana'
  })
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Full name status',
    example: 'approved'
  })
  fullNameStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Full name reject reason',
    example: 'dd'
  })
  fullNameRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Name with initials',
    example: 'D S Wijewardhana'
  })
  nameWithInitials: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Name with initials status',
    example: 'approved'
  })
  nameWithInitialsStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Name with initials reject reason',
    example: 'x'
  })
  nameWithInitialsRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'First name',
    example: 'Dilki'
  })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'First name status',
    example: 'approved'
  })
  firstNameStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'First name reject reason',
    example: 'cdf'
  })
  firstNameRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Surname',
    example: 'Wijewardhana'
  })
  surname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Surname status',
    example: 'approved'
  })
  surnameStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Surname reject reason',
    example: 'dd'
  })
  surnameRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Gender',
    example: 'female'
  })
  gender: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Dob',
    example: '1998-04-22T00:00:00.000Z'
  })
  dob: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Dob status',
    example: 'pending'
  })
  dobStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Dob reject reason',
    example: ''
  })
  dobRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Birth certificate url',
    example: '/5/personal_details/1686145841509_____2.jpeg'
  })
  birthCertificateUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Birth certificate url status',
    example: ''
  })
  birthCertificateUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Birth certificate url reject reason',
    example: ''
  })
  birthCertificateUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Religion',
    example: 'Buddhism'
  })
  religion: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Marital state',
    example: 'Single'
  })
  maritalState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Spouse name',
    example: ''
  })
  spouseName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have children',
    example: 'No'
  })
  haveChildren: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Nic',
    example: '973353536V'
  })
  nic: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Nic status',
    example: 'approved'
  })
  nicStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Nic reject reason',
    example: 'nic reject'
  })
  nicRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Nic url',
    example: '/5/personal_details/1686145841509_____2.jpeg'
  })
  nicUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Nic url status',
    example: 'approved'
  })
  nicUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Nic url reject reason',
    example: 'nic photo reje'
  })
  nicUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have affiliations',
    example: 'Yes'
  })
  haveAffiliations: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Short name',
    example: 'Nooha Mumthaz'
  })
  shortName: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Age',
    example: 24
  })
  age: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pp url',
    example: '/8/personal_details/1701846785918_____28-framed-size-small.png'
  })
  ppUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pp url status',
    example: 'pending'
  })
  ppUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pp url reject reason',
    example: ''
  })
  ppUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Nationality',
    example: 'Sri Lankan'
  })
  nationality: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Type of id',
    example: ''
  })
  typeOfId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Type of id status',
    example: 'pending'
  })
  typeOfIdStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Type of id reject reason',
    example: ''
  })
  typeOfIdRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Passport country',
    example: ''
  })
  passportCountry: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Passport country status',
    example: 'pending'
  })
  passportCountryStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Passport country reject reason',
    example: ''
  })
  passportCountryRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Passport expiration date',
    example: ''
  })
  passportExpirationDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Passport expiration date status',
    example: 'pending'
  })
  passportExpirationDateStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Passport expiration date reject reason',
    example: ''
  })
  passportExpirationDateRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have rtw document',
    example: 'Yes'
  })
  haveRtwDocument: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have rtw document status',
    example: 'pending'
  })
  haveRtwDocumentStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have rtw document reject reason',
    example: ''
  })
  haveRtwDocumentRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Rtw document url',
    example: '/5/personal_details/1686145841509_____2.jpeg'
  })
  rtwDocumentUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Rtw document url status',
    example: 'pending'
  })
  rtwDocumentUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Rtw document url reject reason',
    example: ''
  })
  rtwDocumentUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have rtw expiration date',
    example: ''
  })
  haveRtwExpirationDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have rtw expiration date status',
    example: 'pending'
  })
  haveRtwExpirationDateStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have rtw expiration date reject reason',
    example: ''
  })
  haveRtwExpirationDateRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Rtw expiration date',
    example: ''
  })
  rtwExpirationDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Rtw expiration date status',
    example: ''
  })
  rtwExpirationDateStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Rtw expiration date reject reason',
    example: ''
  })
  rtwExpirationDateRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Id language',
    example: ''
  })
  idLanguage: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Id language status',
    example: 'pending'
  })
  idLanguageStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Id language reject reason',
    example: ''
  })
  idLanguageRejectReason: string;

  @IsOptional()
  @IsBoolean()
  confirm: boolean;

  @IsArray()
  @ValidateNested()
  @Type(() => XFamilyAffiliationDto)
  xfamily_affiliations: XFamilyAffiliationDto[];
}

export class SubmitContactDetailsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 8
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Type',
    example: 'candidate'
  })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'country',
    example: 'India'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'profile Status',
    example: 'active'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Personal email',
    example: 'dilki+18@thirdspaceglobal.com'
  })
  personalEmail: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Work email',
    example: 'dilki+18@thirdspaceglobal.com'
  })
  workEmail: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Work email status',
    example: 'pending'
  })
  workEmailStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Work email reject reason',
    example: 'dddd'
  })
  workEmailRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Mobile number',
    example: '+94 76 888 3220'
  })
  mobileNumber: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Mobile number status',
    example: 'pending'
  })
  mobileNumberStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Mobile number reject reason',
    example: 'dfffrre'
  })
  mobileNumberRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Landline number',
    example: '+94 77 555 5554'
  })
  landlineNumber: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Landline number status',
    example: 'pending'
  })
  landlineNumberStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Landline number reject reason',
    example: 'ddarer'
  })
  landlineNumberRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing address l1',
    example: '320B'
  })
  residingAddressL1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing address l1 status',
    example: 'pending'
  })
  residingAddressL1Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing address l1 reject reason',
    example: 'fffgsf'
  })
  residingAddressL1RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing address l2',
    example: 'Saranakara Road'
  })
  residingAddressL2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing address l2 status',
    example: 'pending'
  })
  residingAddressL2Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing address l2 reject reason',
    example: null
  })
  residingAddressL2RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing city',
    example: 'Matale'
  })
  residingCity: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing city status',
    example: 'pending'
  })
  residingCityStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing city reject reason',
    example: ''
  })
  residingCityRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing district',
    example: 'Matale'
  })
  residingDistrict: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing district status',
    example: 'pending'
  })
  residingDistrictStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing district reject reason',
    example: ''
  })
  residingDistrictRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing province',
    example: 'Central'
  })
  residingProvince: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing province status',
    example: ''
  })
  residingProvinceStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing province reject reason',
    example: ''
  })
  residingProvinceRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing country',
    example: 'Sri Lanka'
  })
  residingCountry: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing country status',
    example: 'pending'
  })
  residingCountryStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing country reject reason',
    example: 'ccxc'
  })
  residingCountryRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Same residing permanent',
    example: 'Yes'
  })
  sameResidingPermanent: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent address l1',
    example: '320B'
  })
  permanentAddressL1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent address l1 status',
    example: 'pending'
  })
  permanentAddressL1Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent address l1 reject reason',
    example: 'fffgsf'
  })
  permanentAddressL1RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent address l2',
    example: 'Saranakara Road'
  })
  permanentAddressL2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent address l2 status',
    example: 'pending'
  })
  permanentAddressL2Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent address l2 reject reason',
    example: ''
  })
  permanentAddressL2RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent city',
    example: 'Matale'
  })
  permanentCity: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent city status',
    example: 'pending'
  })
  permanentCityStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent city reject reason',
    example: ''
  })
  permanentCityRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent district',
    example: 'Matale'
  })
  permanentDistrict: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent district status',
    example: 'pending'
  })
  permanentDistrictStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent district reject reason',
    example: ''
  })
  permanentDistrictRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent province',
    example: 'Central'
  })
  permanentProvince: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent province status',
    example: ''
  })
  permanentProvinceStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent province reject reason',
    example: ''
  })
  permanentProvinceRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent country',
    example: 'Sri Lanka'
  })
  permanentCountry: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent country status',
    example: 'pending'
  })
  permanentCountryStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent country reject reason',
    example: 'ccxc'
  })
  permanentCountryRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Emg contact name',
    example: 'J S Hewahata'
  })
  emgContactName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Emg relationship',
    example: 'Relative'
  })
  emgRelationship: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Emg contact num',
    example: '+94 77 828 2820'
  })
  emgContactNum: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Emg contact num status',
    example: ''
  })
  emgContactNumStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Emg contact num reject reason',
    example: 'dsdds'
  })
  emgContactNumRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing pin',
    example: '200220'
  })
  residingPin: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing pin status',
    example: 'pending'
  })
  residingPinStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Residing pin reject reason',
    example: ''
  })
  residingPinRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent pin',
    example: '200220'
  })
  permanentPin: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent pin status',
    example: 'pending'
  })
  permanentPinStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Permanent pin reject reason',
    example: ''
  })
  permanentPinRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Record approved',
    example: null
  })
  recordApproved: string;
}

class XFamilyAffiliationDto {
  @IsOptional()
  @IsString()
  affiliateName: string;

  @IsOptional()
  @IsString()
  affiliateRelationship: string;

  @IsOptional()
  @IsString()
  affiliateJob: string;
}

export class AuditorSubmitPersonalDetailsDto extends SubmitPersonalDetailsDto {
  @IsNumber()
  candidateId: number;
}
export class AuditorSubmitContactDetailsDto extends SubmitContactDetailsDto {
  @IsNumber()
  candidateId: number;
}

export class PersonalDetails200Response {
  @ApiProperty({
    example: {
      fullName: 'Dilki Wijewardhana',
      fullNameStatus: 'approved',
      fullNameRejectReason: 'dd',
      nameWithInitials: 'D S Wijeward',
      nameWithInitialsStatus: 'approved',
      nameWithInitialsRejectReason: 'x',
      firstName: 'Nooha',
      firstNameStatus: 'approved',
      firstNameRejectReason: 'cdf',
      surname: 'Mumthaz',
      surnameStatus: 'approved',
      surnameRejectReason: 'dd',
      gender: 'Female',
      dob: '1998-04-22T00:00:00.000Z',
      dobStatus: 'pending',
      dobRejectReason: '',
      birthCertificateUrl:
        '/8/personal_details/1701846785918_____28-framed-size-small.png',
      birthCertificateUrlStatus: 'pending',
      birthCertificateUrlRejectReason: null,
      religion: 'Buddhism',
      maritalState: 'Single',
      spouseName: '',
      haveChildren: 'No',
      nic: '973353536V',
      nicStatus: 'approved',
      nicRejectReason: 'nic reject',
      nicUrl: '/5/personal_details/1686145841509_____2.jpeg',
      nicUrlStatus: 'approved',
      nicUrlRejectReason: 'nic photo reje',
      haveAffiliations: 'Yes',
      shortName: 'Nooha Mumthaz',
      age: 25,
      ppUrl: '/5/personal_details/1686145841509_____2.jpeg',
      ppUrlStatus: 'approved',
      ppUrlRejectReason: '',
      nationality: 'Sri Lankan',
      typeOfId: null,
      typeOfIdStatus: 'approved',
      typeOfIdRejectReason: '',
      passportCountry: '',
      passportCountryStatus: 'pending',
      passportCountryRejectReason: '',
      passportExpirationDate: null,
      passportExpirationDateStatus: 'pending',
      passportExpirationDateRejectReason: '',
      haveRtwDocument: '',
      haveRtwDocumentStatus: 'pending',
      haveRtwDocumentRejectReason: '',
      rtwDocumentUrl: '/5/personal_details/1686145841509_____2.jpeg',
      rtwDocumentUrlStatus: 'pending',
      rtwDocumentUrlRejectReason: '',
      haveRtwExpirationDate: '',
      haveRtwExpirationDateStatus: 'pending',
      haveRtwExpirationDateRejectReason: '',
      rtwExpirationDate: null,
      rtwExpirationDateStatus: 'pending',
      rtwExpirationDateRejectReason: '',
      idLanguage: null,
      idLanguageStatus: 'approved',
      idLanguageRejectReason: '',
      xfamily_affiliations: [
        {
          affiliateName: 'Herath',
          affiliateRelationship: 'Sibling',
          affiliateJob: 'Teacher'
        }
      ]
    }
  })
  data: object;
}

export class ContactDetails200Response {
  @ApiProperty({
    example: {
      personalEmail: 'dilki+18@thirdspaceglobal.com',
      workEmail: 'dilki+18@thirdspaceglobal.com',
      workEmailStatus: 'pending',
      workEmailRejectReason: 'dddd',
      mobileNumber: '+94 76 888 3220',
      mobileNumberStatus: 'pending',
      mobileNumberRejectReason: 'dfffrre',
      landlineNumber: '+94 77 555 5554',
      landlineNumberStatus: 'pending',
      landlineNumberRejectReason: 'ddarer',
      residingAddressL1: '320B',
      residingAddressL1Status: 'pending',
      residingAddressL1RejectReason: 'fffgsf',
      residingAddressL2: 'Saranakara Road',
      residingAddressL2Status: 'pending',
      residingAddressL2RejectReason: null,
      residingCity: 'Matale',
      residingCityStatus: 'pending',
      residingCityRejectReason: '',
      residingDistrict: 'Matale',
      residingDistrictStatus: 'pending',
      residingDistrictRejectReason: '',
      residingProvince: 'Central',
      residingProvinceStatus: '',
      residingProvinceRejectReason: '',
      residingCountry: 'Sri Lanka',
      residingCountryStatus: 'pending',
      residingCountryRejectReason: 'ccxc',
      sameResidingPermanent: 'Yes',
      permanentAddressL1: '320B',
      permanentAddressL1Status: 'pending',
      permanentAddressL1RejectReason: 'fffgsf',
      permanentAddressL2: 'Saranakara Road',
      permanentAddressL2Status: 'pending',
      permanentAddressL2RejectReason: '',
      permanentCity: 'Matale',
      permanentCityStatus: 'pending',
      permanentCityRejectReason: '',
      permanentDistrict: 'Matale',
      permanentDistrictStatus: 'pending',
      permanentDistrictRejectReason: '',
      permanentProvince: 'Central',
      permanentProvinceStatus: '',
      permanentProvinceRejectReason: '',
      permanentCountry: 'Sri Lanka',
      permanentCountryStatus: 'pending',
      permanentCountryRejectReason: 'ccxc',
      emgContactName: 'J S Hewahata',
      emgRelationship: 'Relative',
      emgContactNum: '+94 77 828 2820',
      emgContactNumStatus: '',
      emgContactNumRejectReason: 'dsdds',
      residingPin: '200220',
      residingPinStatus: 'pending',
      residingPinRejectReason: '',
      permanentPin: '200220',
      permanentPinStatus: 'pending',
      permanentPinRejectReason: '',
      recordApproved: null
    }
  })
  data: object;
}

export class AuditorPersonalDetails200Response {
  @ApiProperty({
    example: {
      fullName: 'Dilki Wijewardhana',
      fullNameStatus: 'approved',
      fullNameRejectReason: '',
      nameWithInitials: 'D S Wijeward',
      nameWithInitialsStatus: 'approved',
      nameWithInitialsRejectReason: '',
      firstName: 'Nooha',
      firstNameStatus: 'approved',
      firstNameRejectReason: '',
      surname: 'Mumthaz',
      surnameStatus: 'approved',
      surnameRejectReason: '',
      gender: 'Female',
      dob: '1998-04-22T00:00:00.000Z',
      dobStatus: 'pending',
      dobRejectReason: '',
      birthCertificateUrl:
        '/8/personal_details/1701846785918_____28-framed-size-small.png',
      birthCertificateUrlStatus: 'pending',
      birthCertificateUrlRejectReason: null,
      religion: 'Buddhism',
      maritalState: 'Single',
      spouseName: '',
      haveChildren: 'No',
      nic: '973353536V',
      nicStatus: 'approved',
      nicRejectReason: '',
      nicUrl: null,
      nicUrlStatus: 'approved',
      nicUrlRejectReason: '',
      haveAffiliations: 'Yes',
      shortName: 'Nooha Mumthaz',
      age: 25,
      ppUrl: null,
      ppUrlStatus: 'approved',
      ppUrlRejectReason: '',
      nationality: 'Sri Lankan',
      typeOfId: 'Passport',
      typeOfIdStatus: 'approved',
      typeOfIdRejectReason: '',
      passportCountry: 'American Samoa',
      passportCountryStatus: 'approved',
      passportCountryRejectReason: '',
      passportExpirationDate: '2025-05-16T00:00:00.000Z',
      passportExpirationDateStatus: 'approved',
      passportExpirationDateRejectReason: '',
      haveRtwDocument: 'Yes',
      haveRtwDocumentStatus: 'approved',
      haveRtwDocumentRejectReason: '',
      rtwDocumentUrl:
        '/8/personal_details/1701955399791_____28-framed-size-small.png',
      rtwDocumentUrlStatus: 'approved',
      rtwDocumentUrlRejectReason: '',
      haveRtwExpirationDate: 'Yes',
      haveRtwExpirationDateStatus: 'approved',
      haveRtwExpirationDateRejectReason: '',
      rtwExpirationDate: '2025-08-14T00:00:00.000Z',
      rtwExpirationDateStatus: 'approved',
      rtwExpirationDateRejectReason: '',
      idLanguage: 'Arabic Najdi Spoken,Assamese,English',
      idLanguageStatus: 'approved',
      idLanguageRejectReason: '',
      xfamily_affiliations: [
        {
          affiliateName: 'Herath',
          affiliateRelationship: 'Sibling',
          affiliateJob: 'Teacher'
        }
      ]
    }
  })
  details: object;

  @ApiProperty({
    example: {
      fullName: 'Dilki Wijewardhana',
      nameWithInitials: 'D S Wijeward',
      firstName: 'Nooha',
      surname: 'Mumthaz',
      gender: 'Female',
      dob: '1998-04-22T00:00:00.000Z',
      birthCertificateUrl:
        '/8/personal_details/1701846785918_____28-framed-size-small.png',
      religion: 'Buddhism',
      maritalState: 'Single',
      spouseName: '',
      haveChildren: 'No',
      nic: '973353536V',
      nicUrl: null,
      haveAffiliations: 'Yes',
      shortName: 'Nooha Mumthaz',
      age: 24,
      ppUrl: null,
      nationality: 'Sri Lankan',
      typeOfId: 'Passport',
      passportCountry: 'American Samoa',
      passportExpirationDate: '2025-05-16T00:00:00.000Z',
      haveRtwDocument: 'Yes',
      rtwDocumentUrl:
        '/8/personal_details/1701955399791_____28-framed-size-small.png',
      haveRtwExpirationDate: 'Yes',
      rtwExpirationDate: '2025-08-14T00:00:00.000Z',
      idLanguage: 'Arabic Najdi Spoken,Assamese,English'
    }
  })
  approvedDetails: object;
}

export class AuditorContactDetails200Response {
  @ApiProperty({
    example: {
      personalEmail: 'dilki+18@thirdspaceglobal.com',
      workEmail: 'dilki+18@thirdspaceglobal.com',
      workEmailStatus: 'approved',
      workEmailRejectReason: '',
      mobileNumber: '+94 76 888 3220',
      mobileNumberStatus: '',
      mobileNumberRejectReason: 'dfffrre',
      landlineNumber: '+94 77 555 5554',
      landlineNumberStatus: '',
      landlineNumberRejectReason: 'ddarer',
      residingAddressL1: '320B',
      residingAddressL1Status: 'approved',
      residingAddressL1RejectReason: '',
      residingAddressL2: 'Saranakara Road',
      residingAddressL2Status: 'pending',
      residingAddressL2RejectReason: null,
      residingCity: 'Matale',
      residingCityStatus: 'pending',
      residingCityRejectReason: '',
      residingDistrict: 'Matale',
      residingDistrictStatus: 'pending',
      residingDistrictRejectReason: '',
      residingProvince: 'Central',
      residingProvinceStatus: '',
      residingProvinceRejectReason: '',
      residingCountry: 'Sri Lanka',
      residingCountryStatus: 'approved',
      residingCountryRejectReason: '',
      sameResidingPermanent: 'Yes',
      permanentAddressL1: '320B',
      permanentAddressL1Status: 'approved',
      permanentAddressL1RejectReason: '',
      permanentAddressL2: 'Saranakara Road',
      permanentAddressL2Status: 'pending',
      permanentAddressL2RejectReason: null,
      permanentCity: 'Matale',
      permanentCityStatus: 'pending',
      permanentCityRejectReason: '',
      permanentDistrict: 'Matale',
      permanentDistrictStatus: 'pending',
      permanentDistrictRejectReason: '',
      permanentProvince: 'Central',
      permanentProvinceStatus: '',
      permanentProvinceRejectReason: '',
      permanentCountry: 'Sri Lanka',
      permanentCountryStatus: 'approved',
      permanentCountryRejectReason: '',
      emgContactName: 'J S Hewahata',
      emgRelationship: 'Relative',
      emgContactNum: '+94 77 828 2820',
      emgContactNumStatus: '',
      emgContactNumRejectReason: 'dsdds',
      residingPin: '200220',
      residingPinStatus: 'pending',
      residingPinRejectReason: '',
      permanentPin: '200220',
      permanentPinStatus: 'pending',
      permanentPinRejectReason: '',
      recordApproved: null
    }
  })
  details: object;

  @ApiProperty({
    example: {
      personalEmail: 'dilki+18@thirdspaceglobal.com',
      workEmail: 'dilki+18@thirdspaceglobal.com',
      mobileNumber: '+94 76 888 3221',
      landlineNumber: '+94 77 555 5555',
      residingAddressL1: '320B',
      residingAddressL2: 'Saranakara Road',
      residingCity: null,
      residingDistrict: '',
      residingProvince: 'North Western',
      residingCountry: 'Sri Lanka',
      sameResidingPermanent: 'Yes',
      permanentAddressL1: '320B',
      permanentAddressL2: 'Saranakara Road',
      permanentCity: null,
      permanentDistrict: '',
      permanentProvince: '',
      permanentCountry: 'Sri Lanka',
      emgContactName: 'J S Hewahata',
      emgRelationship: 'Relative',
      emgContactNum: '+94 77 828 2822',
      residingPin: null,
      permanentPin: null
    }
  })
  approvedDetails: object;
}
