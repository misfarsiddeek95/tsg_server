import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

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

class XFamilyMembersParentDto {
  @IsOptional()
  @IsString()
  memberName: string;

  @IsOptional()
  @IsString()
  relationship: string;

  @IsOptional()
  @IsString()
  memberDob: string;

  @IsOptional()
  @IsString()
  memberNic: string;
}

class XFamilyMembersChildDto {
  @IsOptional()
  @IsString()
  childName: string;

  @IsOptional()
  @IsString()
  childDob: string;
}
export class PersonalDataDto {
  @IsOptional()
  @IsString()
  preferredName: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  firstNameRejectReason: string;

  @IsOptional()
  @IsString()
  firstNameStatus: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  surnameRejectReason: string;

  @IsOptional()
  @IsString()
  surnameStatus: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  fullNameRejectReason: string;

  @IsOptional()
  @IsString()
  fullNameStatus: string;

  @IsOptional()
  @IsString()
  nameWithInitials: string;

  @IsOptional()
  @IsString()
  nameWithInitialsRejectReason: string;

  @IsOptional()
  @IsString()
  nameWithInitialsStatus: string;

  @IsOptional()
  @IsString()
  age: string;

  @IsOptional()
  @IsString()
  ppUrl: string;

  @IsOptional()
  @IsString()
  ppUrlRejectReason: string;

  @IsOptional()
  @IsString()
  ppUrlStatus: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  religion: string;

  @IsOptional()
  @IsString()
  dob: string;

  @IsOptional()
  @IsString()
  dobRejectReason: string;

  @IsOptional()
  @IsString()
  dobStatus: string;

  @IsOptional()
  @IsString()
  birthCertificateUrl: string;

  @IsOptional()
  @IsString()
  birthCertificateUrlStatus: string;

  @IsOptional()
  @IsString()
  typeOfId: string;

  @IsOptional()
  @IsString()
  typeOfIdRejectReason: string;

  @IsOptional()
  @IsString()
  typeOfIdStatus: string;

  @IsOptional()
  @IsArray()
  idLanguage: string[];

  @IsOptional()
  @IsString()
  idLanguageRejectReason: string;

  @IsOptional()
  @IsString()
  idLanguageStatus: string;

  @IsOptional()
  @IsString()
  nic: string;

  @IsOptional()
  @IsString()
  nicRejectReason: string;

  @IsOptional()
  @IsString()
  nicStatus: string;

  @IsOptional()
  @IsString()
  passportCountry: string;

  @IsOptional()
  @IsString()
  passportCountryRejectReason: string;

  @IsOptional()
  @IsString()
  passportCountryStatus: string;

  @IsOptional()
  @IsString()
  passportExpirationDate: string;

  @IsOptional()
  @IsString()
  passportExpirationDateRejectReason: string;

  @IsOptional()
  @IsString()
  passportExpirationDateStatus: string;

  @IsOptional()
  @IsString()
  nicUrl: string;

  @IsOptional()
  @IsString()
  nicUrlRejectReason: string;

  @IsOptional()
  @IsString()
  nicUrlStatus: string;

  @IsOptional()
  @IsString()
  maritalState: string;

  @IsOptional()
  @IsString()
  includeFamilyInInsurance: string;

  @IsOptional()
  @IsString()
  whomIncludeInInsurance: string;

  @IsOptional()
  @IsString()
  spouseName: string;

  @IsOptional()
  @IsString()
  spouseNic: string;

  @IsOptional()
  @IsString()
  spouseDob: string;

  @IsOptional()
  @IsString()
  marriageCertificate: string;

  @IsOptional()
  @IsString()
  marriageCertificateStatus: string;

  @IsOptional()
  @IsString()
  haveAffiliations: string;

  @IsOptional()
  @IsString()
  haveChildren: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => XFamilyAffiliationDto)
  xfamily_affiliations: XFamilyAffiliationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  //@IsObject({ each: true })
  @Type(() => XFamilyMembersParentDto)
  //xfamily_members_parents: { [key: string]: XFamilyMembersParentDto };
  xfamily_members_parents: XFamilyMembersParentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  //@IsObject({ each: true })
  @Type(() => XFamilyMembersChildDto)
  //xfamily_members_children: { [key: string]: XFamilyMembersChildDto };
  xfamily_members_children: XFamilyMembersChildDto[];
}

export class AuditorSubmitPersonalDetailsDto extends PersonalDataDto {
  @IsNumber()
  nonTutorId: number;
}
export class SaveBioDto {
  @IsString()
  bio: string;
}
