import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested
} from 'class-validator';

export class ExperienceDataDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  localId: number;

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
  havePreTsg: string;

  @IsOptional()
  @IsString()
  havePreTsgStatus: string;

  @IsOptional()
  @IsString()
  havePreTsgRejectReason: string;

  @IsOptional()
  @IsString()
  preTsgType: string;

  @ValidateIf((o) => o.havePreTsg !== 'No')
  @IsOptional()
  @IsString()
  preTsgStart: string;

  @IsOptional()
  @IsString()
  preTsgEnd: string;

  @IsOptional()
  @IsString()
  isCurrentlyEmployed: string;

  @IsOptional()
  @IsString()
  isCurrentlyEmployedStatus: string;

  @IsOptional()
  @IsString()
  isCurrentlyEmployedRejectReason: string;

  @IsOptional()
  @IsString()
  preWorkExp: string;

  @IsOptional()
  @IsString()
  preWorkExpStatus: string;

  @IsOptional()
  @IsString()
  preWorkExpRejectReason: string;

  @IsOptional()
  @IsString()
  currentEmpName: string;

  @IsOptional()
  @IsString()
  currentEmpType: string;

  @IsOptional()
  @IsString()
  currentEmpTitle: string;

  @IsOptional()
  @IsString()
  currentEmpStart: string;

  @IsOptional()
  @IsString()
  currentEmpTeaching: string;

  @IsOptional()
  @IsString()
  currentEmpDocUrl: string;

  @IsOptional()
  @IsString()
  currentEmpDocUrlStatus: string;

  @IsOptional()
  @IsString()
  currentEmpDocUrlRejectReason: string;

  @IsArray()
  @ValidateNested()
  @Type(() => XotherWorkExpData)
  xother_work_exp_data: XotherWorkExpData[];

  @IsOptional()
  @IsBoolean()
  confirm: boolean;
}

class XotherWorkExpData {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  localId: number;

  @IsOptional()
  @IsString()
  employerName: string;

  @IsOptional()
  @IsString()
  employmentType: string;

  @IsOptional()
  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  currentlyEmployed: string;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  teachingExp: string;

  @IsOptional()
  @IsString()
  docUrl: string;

  @IsOptional()
  @IsString()
  docUrlStatus: string;

  @IsOptional()
  @IsString()
  docUrlRejectReason: string;
}

export class AuditorSubmitWorkExperienceDto extends ExperienceDataDto {
  @IsNumber()
  nonTutorId: number;
}
