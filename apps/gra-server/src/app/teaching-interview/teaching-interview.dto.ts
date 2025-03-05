import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class TeachingInterviewQueryDto {
  @IsOptional()
  @IsString()
  candidateTspId?: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  bookingStatusId?: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  tiRecordId?: number;

  @IsOptional()
  accessState?: string;
}

export class TeachingInterviewDto {
  @IsNumber()
  tspId: number;

  @IsString()
  attendance: string;

  @IsString()
  attendComment: string;

  @IsString()
  workingPlace: string;

  @IsString()
  preparation: string;

  @IsString()
  slideUsed: string;

  @IsString()
  safeguardingQuestion: string;

  @IsString()
  safeguarding: string;

  @IsString()
  safeguardingComment: string;

  @IsString()
  lanVocabulary: string;

  @IsString()
  lanPronunciation: string;

  @IsString()
  lanComprehension: string;

  @IsString()
  lanGrammar: string;

  @IsString()
  lanRateOfSpeech: string;

  @IsString()
  lanComment: string;

  @IsString()
  lanPillarRate: string;

  @IsString()
  skMistakes: string;

  @IsString()
  skConceptual: string;

  @IsString()
  skKnowledgePillarRate: string;

  @IsString()
  skKnowledgeComment: string;

  @IsString()
  assesPreAssessment: string;

  @IsString()
  assesAdaptation: string;

  @IsString()
  assesPostAssessment: string;

  @IsString()
  assesAssessmentPillarRating: string;

  @IsString()
  assesAssessmentComment: string;

  @IsString()
  intToneOfVoice: string;

  @IsString()
  intProfessionalInteraction: string;

  @IsString()
  intInteractionPillarRating: string;

  @IsString()
  intInteractionComment: string;

  @IsString()
  familiarityPreparedTopic: string;

  @IsString()
  familiarityResources: string;

  @IsString()
  familiarityPillarRating: string;

  @IsString()
  familiarityComment: string;

  @IsString()
  strength: string;

  @IsString()
  improvement: string;

  @IsString()
  additionalComment: string;

  @IsString()
  subjectKnowledgeQuestion: string;

  @IsString()
  subjectKnowledge: string;

  @IsString()
  subjectKnowledgeComment: string;

  @IsString()
  redflag: string;

  @IsString()
  redflagComment: string;

  @IsString()
  secondOpinion: string;

  @IsString()
  generalComment: string;

  @IsString()
  status: string;

  @IsString()
  passTarget1Pillar: string;

  @IsString()
  passTarget1Targets: string;

  @IsString()
  passExplain: string;

  @IsString()
  passTarget2Pillar: string;

  @IsString()
  passTarget2Targets: string;

  @IsString()
  passExplain2: string;

  @IsString()
  failReason1: string;

  @IsString()
  failReason2: string;

  @IsString()
  failComment: string;

  @IsString()
  incompleteCompletedUntil: string;

  @IsString()
  incompleteComment: string;

  @IsString()
  tutorEmail: string;

  @IsString()
  tutorName: string;

  @IsNumber()
  bsBookingId: number;

  @IsString()
  orientationDate: string;

  @IsString()
  orientationTime: string;

  @IsString()
  orientationUrl: string;

  @IsString()
  reconsiderReason: string;
}

export class TeachingInterviewListDto {
  take: number;

  skip: number;

  @IsOptional()
  @IsString()
  tspId: string;

  @IsOptional()
  // @IsArray()
  @IsString()
  candiName: string;

  @IsOptional()
  @IsString()
  finalOutcome: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
