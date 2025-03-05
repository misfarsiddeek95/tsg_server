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

export class RightToWorkDataDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  profileStatus: string;

  @IsOptional()
  @IsString()
  contractUrl: string;

  @IsOptional()
  @IsString()
  contractUrlStatus: string;

  @IsOptional()
  @IsString()
  contractUrlRejectReason: string;

  @IsOptional()
  @IsString()
  gsIssuedDate: string;

  @IsOptional()
  @IsString()
  gsIssuedDateStatus: string;

  @IsOptional()
  @IsString()
  gsIssuedDateRejectReason: string;

  @IsOptional()
  @IsString()
  gsUrl: string;

  @IsOptional()
  @IsString()
  gsUrlStatus: string;

  @IsOptional()
  @IsString()
  gsUrlRejectReason: string;

  @IsOptional()
  @IsString()
  pccIssuedDate: string;

  @IsOptional()
  @IsString()
  pccIssuedDateStatus: string;

  @IsOptional()
  @IsString()
  pccIssuedDateRejectReason: string;

  @IsOptional()
  @IsString()
  pccReferenceNo: string;

  @IsOptional()
  @IsString()
  pccReferenceNoStatus: string;

  @IsOptional()
  @IsString()
  pccReferenceNoRejectReason: string;

  @IsOptional()
  @IsString()
  pccUrl: string;

  @IsOptional()
  @IsString()
  pccUrlStatus: string;

  @IsOptional()
  @IsString()
  pccUrlRejectReason: string;

  @IsOptional()
  @IsString()
  pccExpireDate: string;

  @IsOptional()
  @IsString()
  pccUploadedAt: string;

  @IsOptional()
  @IsString()
  pccState: string;

  @IsOptional()
  @IsString()
  recordApproved: string;

  @IsOptional()
  @IsString()
  contractType: string;

  @IsOptional()
  @IsString()
  contractTypeStatus: string;

  @IsOptional()
  @IsString()
  contractTypeRejectReason: string;

  @IsOptional()
  @IsString()
  contractStartDate: string;

  @IsOptional()
  @IsString()
  contractStartDateStatus: string;

  @IsOptional()
  @IsString()
  contractStartDateRejectReason: string;

  @IsOptional()
  @IsString()
  contractEndDate: string;

  @IsOptional()
  @IsString()
  contractEndDateStatus: string;

  @IsOptional()
  @IsString()
  contractEndDateRejectReason: string;

  @IsOptional()
  @IsString()
  requireBackgroundCheck: string;
}

export class AuditorSubmitRightToWorkDetailsDto extends RightToWorkDataDto {
  @IsNumber()
  nonTutorId: number;
}
