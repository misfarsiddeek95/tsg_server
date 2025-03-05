import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

export class SaveContactDataDto {
  @IsOptional()
  @IsString()
  personalEmail: string;

  @IsOptional()
  @IsString()
  workEmail: string;

  @IsOptional()
  @IsString()
  workEmailStatus: string;

  @IsOptional()
  @IsString()
  workEmailRejectReason: string;

  @IsOptional()
  @IsString()
  mobileNumber: string;

  @IsOptional()
  @IsString()
  mobileNumberStatus: string;

  @IsOptional()
  @IsString()
  mobileNumberRejectReason: string;

  @IsOptional()
  @IsString()
  landlineNumber: string;

  @IsOptional()
  @IsString()
  landlineNumberStatus: string;

  @IsOptional()
  @IsString()
  landlineNumberRejectReason: string;

  @IsOptional()
  @IsString()
  residingAddressL1: string;

  @IsOptional()
  @IsString()
  residingAddressL1Status: string;

  @IsOptional()
  @IsString()
  residingAddressL1RejectReason: string;

  @IsOptional()
  @IsString()
  residingAddressL2: string;

  @IsOptional()
  @IsString()
  residingAddressL2Status: string;

  @IsOptional()
  @IsString()
  residingAddressL2RejectReason: string;

  @IsOptional()
  @IsString()
  residingCity: string;

  @IsOptional()
  @IsString()
  residingCityStatus: string;

  @IsOptional()
  @IsString()
  residingCityRejectReason: string;

  @IsOptional()
  @IsString()
  residingDistrict: string;

  @IsOptional()
  @IsString()
  residingDistrictStatus: string;

  @IsOptional()
  @IsString()
  residingDistrictRejectReason: string;

  @IsOptional()
  @IsString()
  residingProvince: string;

  @IsOptional()
  @IsString()
  residingProvinceStatus: string;

  @IsOptional()
  @IsString()
  residingProvinceRejectReason: string;

  @IsOptional()
  @IsString()
  residingCountry: string;

  @IsOptional()
  @IsString()
  residingCountryStatus: string;

  @IsOptional()
  @IsString()
  residingCountryRejectReason: string;

  @IsOptional()
  @IsString()
  sameResidingPermanent: string;

  @IsOptional()
  @IsString()
  permanentAddressL1: string;

  @IsOptional()
  @IsString()
  permanentAddressL1Status: string;

  @IsOptional()
  @IsString()
  permanentAddressL1RejectReason: string;

  @IsOptional()
  @IsString()
  permanentAddressL2: string;

  @IsOptional()
  @IsString()
  permanentAddressL2Status: string;

  @IsOptional()
  @IsString()
  permanentAddressL2RejectReason: string;

  @IsOptional()
  @IsString()
  permanentCity: string;

  @IsOptional()
  @IsString()
  permanentCityStatus: string;

  @IsOptional()
  @IsString()
  permanentCityRejectReason: string;

  @IsOptional()
  @IsString()
  permanentDistrict: string;

  @IsOptional()
  @IsString()
  permanentDistrictStatus: string;

  @IsOptional()
  @IsString()
  permanentDistrictRejectReason: string;

  @IsOptional()
  @IsString()
  permanentProvince: string;

  @IsOptional()
  @IsString()
  permanentProvinceStatus: string;

  @IsOptional()
  @IsString()
  permanentProvinceRejectReason: string;

  @IsOptional()
  @IsString()
  permanentCountry: string;

  @IsOptional()
  @IsString()
  permanentCountryStatus: string;

  @IsOptional()
  @IsString()
  permanentCountryRejectReason: string;

  @IsOptional()
  @IsString()
  emgContactName: string;

  @IsOptional()
  @IsString()
  emgRelationship: string;

  @IsOptional()
  @IsString()
  emgContactNum: string;

  @IsOptional()
  @IsString()
  emgContactNumStatus: string;

  @IsOptional()
  @IsString()
  emgContactNumRejectReason: string;

  @IsOptional()
  @IsString()
  residingPin: string;

  @IsOptional()
  @IsString()
  residingPinStatus: string;

  @IsOptional()
  @IsString()
  residingPinRejectReason: string;

  @IsOptional()
  @IsString()
  permanentPin: string;

  @IsOptional()
  @IsString()
  permanentPinStatus: string;

  @IsOptional()
  @IsString()
  permanentPinRejectReason: string;

  @IsOptional()
  @IsString()
  recordApproved: string;
}

export class AuditorSubmitContactDetailsDto extends SaveContactDataDto {
  @IsNumber()
  nonTutorId: number;
}
