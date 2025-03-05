import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

export class CreateSessionInvestigationDto {
  @IsNumber()
  investigationId: number;

  @IsString()
  finalOutcome: string;

  @IsNumber()
  investigationStatus: number;

  @IsString()
  pointOfInvestigation: string;

  @IsString()
  otherComment: string;

  @IsString()
  issueRegisterCaseId: string;

  @IsString()
  requiredAction: string;

  @IsNumber()
  updatedBy: number;

  @ValidateNested({ each: true })
  @Type(() => EvaluatedSessionList)
  evaluatedSessionList: EvaluatedSessionList[];
}

export class EvaluatedSessionList {
  @IsNumber()
  sessionId: number;

  @IsOptional()
  @IsNumber()
  schoolId: number | null;

  @IsOptional()
  @IsNumber()
  pupilId: number | null;

  @IsOptional()
  @IsNumber()
  investigationSessionStatus: number;

  @IsOptional()
  @IsString()
  investigationSessionComment: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  investigationSessionConcern: string[];

  @IsDateString()
  dateTime: string;

  @ValidateNested({ each: true })
  @Type(() => Timespan)
  timeSlider: Timespan[];
}

export class Timespan {
  @IsString()
  id: string;

  range: any[];
}
