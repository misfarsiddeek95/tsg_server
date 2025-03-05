import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator';

export class WebhookSubmitMainDto {
  @ApiProperty({
    type: 'string',
    example: 'UCT101xx'
  })
  @IsString()
  event_id: string;

  @ApiProperty({
    type: 'string',
    example: 'Exam'
  })
  @IsString()
  event_type: string;

  @ApiProperty({
    type: 'string',
    example: 'two'
  })
  @IsString()
  delivery_attempt: string;

  @ApiProperty({
    type: 'string',
    example: '123sdd'
  })
  @IsString()
  deta: string;

  @IsObject()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => WebhookSubmitDataDto)
  data: any;
}

class WebhookSubmitDataDto {
  @IsNotEmpty()
  response_id: string;
  @IsNotEmpty()
  quiz_id: string;
  @IsNotEmpty()
  quiz_name: string;
  @IsNotEmpty()
  user_id: string;

  first_name: string;

  last_name: string;

  email_address: string;

  user_name: string;
  @IsNotEmpty()
  date_submitted: string;
  @IsNotEmpty()
  points: string;
  @IsNotEmpty()
  available_points: string;
  @IsNotEmpty()
  percentage_score: string;
  @IsNotEmpty()
  grade: string;
  @IsNotEmpty()
  pass: boolean;
  @IsNotEmpty()
  duration: string;
  @IsNotEmpty()
  attempt: string;
  @IsNotEmpty()
  ip_address: string;
  @IsNotEmpty()
  status: string;

  publish_type: string;

  certificate_url: string;

  response_report_url: string;
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => RegistrationFilelds)
  registration_fields: RegistrationFilelds[];
}

export class RegistrationFilelds {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  value: string;
}

export class submitexam400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [
      'event_id should not be empty',
      'data should not be empty',
      'data must be an object'
    ],
    example: ['event_id should not be empty']
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class GetAllExamDetails200Dto {
  @ApiProperty({
    type: 'number',
    example: 200
  })
  statusCode: number;

  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Null'
  })
  'data': string;
}

export class GetAllExamDetails400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    example: 'Unexpected token '
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class GetaExamDetailusingID200Dto {
  @ApiProperty({
    type: 'number',
    example: 200
  })
  statusCode: number;

  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Null'
  })
  'data': string;
}

export class GetaExamDetailusingID400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    example: 'Unexpected token '
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}
export class GetExamdetailsbytspId400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    example: 'Unexpected token '
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class GetExamdetailsbytspId200Dto {
  @ApiProperty({
    type: 'number',
    example: 200
  })
  statusCode: number;

  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Null'
  })
  'data': string;
}

export class GetCandidateExamDetailsbyCandiateID400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    example: 'Unexpected token '
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class GetCandidateExamDetailsbyCandiateID200Dto {
  @ApiProperty({
    type: 'number',
    example: 200
  })
  statusCode: number;

  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Null'
  })
  'data': string;
}
