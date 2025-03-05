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

export class QualificationDataDto {
  @IsArray()
  @ValidateNested()
  @Type(() => XotherQualiData)
  xother_quali_data: XotherQualiData[];
}

class XotherQualiData {
  @IsOptional()
  @IsString()
  courseType: string;

  @IsOptional()
  @IsString()
  courseTypeRejectReason: string;

  @IsOptional()
  @IsString()
  courseTypeStatus: string;

  @IsOptional()
  @IsString()
  fieldStudy: string;

  @IsOptional()
  @IsString()
  fieldStudyRejectReason: string;

  @IsOptional()
  @IsString()
  fieldStudyStatus: string;

  @IsOptional()
  @IsString()
  hasCompleted: string;

  @IsOptional()
  @IsString()
  hasCompletedRejectReason: string;

  @IsOptional()
  @IsString()
  hasCompletedStatus: string;

  @IsOptional()
  @IsString()
  startYear: string;

  @IsOptional()
  @IsString()
  startYearRejectReason: string;

  @IsOptional()
  @IsString()
  startYearStatus: string;

  @IsOptional()
  @IsString()
  completionYear: string;

  @IsOptional()
  @IsString()
  completionYearRejectReason: string;

  @IsOptional()
  @IsString()
  completionYearStatus: string;

  @IsOptional()
  @IsString()
  isLocal: string;

  @IsOptional()
  @IsString()
  isLocalRejectReason: string;

  @IsOptional()
  @IsString()
  isLocalStatus: string;

  @IsOptional()
  @IsString()
  mainInst: string;

  @IsOptional()
  @IsString()
  mainInstRejectReason: string;

  @IsOptional()
  @IsString()
  mainInstStatus: string;

  @IsOptional()
  @IsString()
  affiInst: string;

  @IsOptional()
  @IsString()
  affiInstRejectReason: string;

  @IsOptional()
  @IsString()
  affiInstStatus: string;

  @IsOptional()
  @IsString()
  areaOfStudy: string;

  @IsOptional()
  @IsString()
  areaOfStudyRejectReason: string;

  @IsOptional()
  @IsString()
  areaOfStudyStatus: string;

  @IsOptional()
  @IsString()
  docUrl: string;

  @IsOptional()
  @IsString()
  docUrlRejectReason: string;

  @IsOptional()
  @IsString()
  docUrlStatus: string;
}

export class AuditorSubmitQualificationsDto extends QualificationDataDto {
  @IsNumber()
  nonTutorId: number;
}
