import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class FinalAssessmentFormDto {
  @ApiProperty({
    type: 'number',
    example: 100
  })
  @IsNumber()
  bookingId: number;

  @ApiProperty({
    type: 'string',
    example: 'John Smith'
  })
  @IsString()
  traineeName: string;

  @ApiProperty({
    type: 'number',
    example: 20
  })
  @IsNumber()
  traineeUserId: number;

  @ApiProperty({
    type: 'string',
    example: 'A-31'
  })
  @IsString()
  batch: string;

  @ApiProperty({
    type: 'string',
    example: 'Second'
  })
  @IsString()
  attempt: string;

  @ApiProperty({
    type: 'string',
    example: 'John@gmail.com'
  })
  @IsEmail()
  traineeEmail: string;

  @ApiProperty({
    type: 'string',
    example: 'Attended'
  })
  @IsString()
  attendance: string;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  attendanceComment: string;

  @ApiProperty({
    type: 'string',
    example: '2022-12-01' //TODO : Add proper example for this property
  })
  @IsString()
  demoDate: string;

  @ApiProperty({
    type: 'string',
    example: '1, 2, 3'
  })
  @IsString()
  audioTechIssues: string;

  @ApiProperty({
    type: 'string',
    example: '1,2, 3'
  })
  @IsString()
  equipmentLocationIssues: string;

  @ApiProperty({
    type: 'string',
    example: '' //TODO : Add proper example
  })
  @IsString()
  speedTestLink: string;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  technicalComment: string;

  @ApiProperty({
    //! Remove is not necessary
    type: 'number',
    example: 1
  })
  @IsNumber()
  microphone: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  mistakesAndMisconceptions: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  conceptualExplanation: number;

  @ApiProperty({
    type: 'number',
    example: 4
  })
  @IsNumber()
  skOverallRatings: number;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  skComment: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  preAssessment: number;

  @ApiProperty({
    type: 'string',
    example: 1
  })
  @IsNumber()
  adaptation: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  postAssessment: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  sctOverallRating: number;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  sctAssessmentComment: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  interactionEngagement: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  interactionEffort: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  interactionProfessionalism: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  interactionOverallRating: number;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  interactionComment: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  vocabulary: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  pronunciation: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  grammar: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  rateOfSpeech: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  comprehension: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  languageOverallRating: number;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  languageComment: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  identifyingWww: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  identifyingEbi: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  positiveMindset: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  reflectionOverallRating: number;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  reflectionComment: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  sessionFlow: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  classroomResources: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  sessionOps: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  familiarityOverallRating: number;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  familiarityComment: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  sessionRating: number;

  @ApiProperty({
    type: 'string',
    example: 'pass'
  })
  @IsString()
  finalOutcome: string;

  @ApiProperty({
    type: 'string',
    example: 'language'
  })
  @IsString()
  @IsOptional()
  failReason_1: string;

  @ApiProperty({
    type: 'string',
    example: 'language'
  })
  @IsString()
  @IsOptional()
  failReason_2: string;

  @ApiProperty({
    type: 'string',
    example: 'Unsatisfactory'
  })
  @IsString()
  overallSessionRating: string;

  @ApiProperty({
    type: 'string',
    example: 'Subject Knowledge'
  })
  @IsString()
  positiveActionsPOne: string;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  positiveActionsPOneComment: string;

  @ApiProperty({
    type: 'string',
    example: 'Subject Knowledge'
  })
  @IsString()
  positiveActionsPTwo: string;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  positiveActionsPTwoComment: string;

  @ApiProperty({
    type: 'string',
    example: 'Subject Knowledge'
  })
  @IsString()
  @IsOptional()
  positiveActionsPThree: string;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  @IsOptional()
  positiveActionsPThreeComment: string;

  @ApiProperty({
    type: 'string',
    example: 'Subject Knowledge'
  })
  @IsString()
  focusAreaPOne: string;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  focusAreaPOneComment: string;

  @ApiProperty({
    type: 'string',
    example: 'Subject Knowledge'
  })
  @IsString()
  focusAreaPTwo: string;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  focusAreaPTwoComment: string;

  @ApiProperty({
    type: 'string',
    example: 'Subject Knowledge'
  })
  @IsString()
  @IsOptional()
  focusAreaPThree: string;

  @ApiProperty({
    type: 'string',
    example: 'All Good'
  })
  @IsString()
  @IsOptional()
  focusAreaPThreeComment: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  createdBy: number;
}

export class FinalAssessment200Dto {}

export class FinalAssessment404Dto {}

export class FinalAssessment401Dto {}

export class FinalAssessment201Dto {}

export class FinalAssessment400Dto {}

export class FinalAssessmentFetchDto {
  @ApiProperty({
    type: 'string',
    example: '1'
  })
  @IsString()
  @IsOptional()
  bookingStatusId: string;

  @ApiProperty({
    type: 'string',
    example: 1
  })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({
    type: 'string',
    example: 1
  })
  @IsString()
  @IsOptional()
  demoId: string;
}

export class ExistingFasRecord200DTO {}

export class ExistingFasRecord404DTO {}

export class ExistingFasRecord401DTO {}
