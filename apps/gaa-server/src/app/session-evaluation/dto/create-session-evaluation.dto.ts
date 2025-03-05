import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty
} from 'class-validator';

export class CreateSessionEvaluationDto {
  @IsNumber()
  evaluationId: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  cumulativeRating: string[];

  @IsString()
  overallEvaluationStatus: string;

  @IsNumber()
  evaluationStatus: number;

  @IsString()
  emailFlag: string;

  @IsNumber()
  updatedBy: number;

  @IsString()
  reasonForEvaluation: string;

  @IsString()
  linkToFeedbackCall: string;

  @IsString()
  feedbackAttendance: string;

  @IsString()
  feedbackDate: string;

  @IsString()
  sRCompletion: string;

  @IsString()
  tutorSkill: string;

  @IsString()
  tutorSkillComm: string;

  @IsString()
  tutorMindset: string;

  @IsString()
  tutorMindsetComm: string;

  @IsString()
  tutorReflection: string;

  @IsString()
  tutorEffort: string;

  @IsString()
  commentsOnReflectionOrFeedback: string;

  @IsString()
  otherComment: string;

  @ValidateNested({ each: true })
  @Type(() => EvaluatedSessionList)
  evaluatedSessionList: EvaluatedSessionList[];

  @ValidateNested({ each: true })
  @Type(() => PreviousSEFocusAreas)
  previousSEFocusAreas: PreviousSEFocusAreas[];

  @ValidateNested({ each: true })
  @Type(() => TargetsFields)
  focusAreasFromThisSession: TargetsFields[];

  @ValidateNested({ each: true })
  @Type(() => TargetsFields)
  positiveActions: TargetsFields[];
}

export class EvaluatedSessionList {
  @IsNumber()
  sessionId: number;

  @IsNumber()
  evaluationSessionStatus: number;

  @IsString()
  evaluationSessionComment: string;

  @IsString()
  loEvaluated: string;

  @IsString()
  sessionDate: string;

  @IsString()
  pupilName: string;

  @IsNumber()
  pupilId: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  evaluationSessionRating: string[];

  @IsString()
  pupilsProgress: string;

  @ValidateNested({ each: true })
  @Type(() => Timespan)
  timeSlider: Timespan[];
}

export class PreviousSEFocusAreas {
  @IsString()
  id: string;

  @IsString()
  status: string;

  @IsString()
  comment2: string;
}
export class TargetsFields {
  @IsString()
  id: string;

  @IsString()
  pillar: string;

  @IsString()
  criteria: string;

  @IsString()
  comment1: string;
}
export class Timespan {
  @IsString()
  id: string;

  range: any[];
}

export class SessionStatusUpdate {
  @IsNotEmpty()
  @IsNumber()
  tutorId: number;

  @IsNumber()
  evaluationId: number;

  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  @ArrayMinSize(1)
  sessionIds: number[];

  @IsNumber()
  evaluationStatus: number;

  @IsString()
  statusType: string;
}

export class EmailFlagStatusDto {
  @IsNotEmpty()
  @IsNumber()
  evaluationId: number;
}
export class EditableCountDto {
  @IsNotEmpty()
  @IsNumber()
  evaluationId: number;
}

export class SessionRawDto {
  @IsNumber()
  session_id: number;

  @IsNumber()
  school_id: number;

  @IsNumber()
  pupil_id: number;

  @IsNumber()
  evaluation_session_status: number;

  @IsNumber()
  date_time: string;
}
