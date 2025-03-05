import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import {
  IsDate,
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';

export class DemoAssesment200Dto {
  id?: number;

  @IsString()
  name?: string;

  // @IsString()
  ol_maths?: string;

  userId?: number;

  @IsString()
  email?: string;

  @IsString()
  batch?: string;

  @IsString()
  tiCreatedBy?: string;

  @IsString()
  familiarity?: string;

  // @IsString()
  familiarity1?: number;

  @IsString()
  attendance1?: string;

  // @IsString()
  language1?: number;

  // @IsString()
  sctassess1?: number;

  // @IsString()
  sctint1?: number;

  // @IsString()
  sk1?: number;

  // @IsString()
  reflection?: number;

  // @IsString()
  overall_session_rating?: number;

  // @IsString()
  demo_status?: string;

  // @IsString()
  demo_percentage?: number;

  @IsString()
  what_went_well?: string;

  @IsString()
  fail_reason?: string;

  // @IsString()
  lang?: string;

  // @IsString()
  sk?: string;

  // @IsString()
  maths?: string;

  // @IsString()
  faCreatedBy?: string;

  // @IsString()
  to_be_improved?: string;

  // @IsString()
  sct?: string;

  // @IsString()
  scti?: string;

  // @IsString()
  coursecomplicaiton?: string;

  // @IsString()
  coursescoreavg?: string;

  // @IsString()
  attendance?: string;

  // @IsString()
  demodate?: string;

  // @IsString()
  familiarity2?: string;

  // @IsString()
  language2?: string;

  // @IsString()
  sk2?: string;

  // @IsString()
  overall_average?: string;

  // @IsString()
  cdp2?: string;

  cpd: any;

  // @IsString()
  reflection2?: string;

  // @IsString()
  reason_comment?: string;

  // @IsString()
  contactNo: string;

  // @IsString()
  interaction_effort?: string;

  // @IsString()
  interaction_professionalism?: string;

  // @IsString()
  vocabulary?: string;

  // @IsString()
  pronunciation?: string;

  // @IsString()
  grammar?: string;

  // @IsString()
  rate_of_speech?: string;

  // @IsString()
  comprehension?: string;

  // @IsString()
  identifying_www?: string;

  // @IsString()
  identifying_ebi?: string;

  // @IsString()
  positive_mindset?: string;

  // @IsString()
  session_flow?: string;

  // @IsString()
  classroom_resources?: string;

  // @IsString()
  session_ops?: string;

  // @IsString()
  familiarity_comment?: string;

  // @IsString()
  language_comment?: string;

  // @IsString()
  sk_comment?: string;

  // @IsString()
  sct_assessment_comment?: string;

  // @IsString()
  interaction_comment?: string;

  // @IsString()
  reflection_comment?: string;

  // @IsString()
  final_outcome?: string;

  // @IsString()
  final_reason?: string;
  // @IsString()

  email_status?: number;

  attempts?: string;
  rank?: string;
}

export class DemoAssesment404Dto {
  @ApiProperty({
    type: 'number',
    example: 404
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unexpected token } in JSON at position 24'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  error: string;
}

export class DemoAssesment401Dto {
  @ApiProperty({
    type: 'number',
    example: 401
  })
  statusCode: number;
  @ApiProperty({
    type: 'string',
    example: 'Unauthorized'
  })
  message: string;
}

export class FinalOutcomeDto {
  @ApiProperty({
    type: 'number',
    example: 401
  })
  @IsNumber()
  fasDataId: number;

  @ApiProperty({
    type: 'string',
    example: 'pass'
  })
  @IsString()
  final_outcome: string;

  @IsString()
  final_reason: string;

  @IsString()
  final_comment: string;
}

export class MasterViewDto {
  @IsOptional()
  @IsString()
  tspId: string;

  @IsOptional()
  @IsString()
  batch: string;

  @IsOptional()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  finalOutcome: string;

  @IsOptional()
  @IsString()
  finalDecision: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  skip: number;

  take: number;

  @IsString()
  @IsOptional()
  demoDateFrom: string;

  @IsString()
  @IsOptional()
  demoDateTo: string;

  @IsString()
  @IsOptional()
  cpdScore: string;

  @IsString()
  @IsOptional()
  attempt: string;
}

export class BatchDto {
  @IsOptional()
  batchList: string[];
}
