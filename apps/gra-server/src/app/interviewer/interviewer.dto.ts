import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

export class InterviewerQueryDto {
  @IsOptional()
  @IsString()
  candidateTspId?: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  bookingStatusId?: number;

  @IsOptional()
  status?: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  piDataId?: number;
}

export class CallLogDto {
  @Transform(({ value }) => +value)
  @IsNumber()
  piRefId?: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  bookingStatusId?: number;

  @IsNumber()
  callAttempt: number;

  @IsNumber()
  piStatus: number;

  @IsString()
  date: string;
}

class CallLog {
  @IsNumber()
  callAttempt: number;

  @IsNumber()
  piStatus: number;

  @IsString()
  date: string;
}

export class CallLogsDto {
  @Transform(({ value }) => +value)
  @IsNumber()
  piRefId?: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  bookingStatusId?: number;

  @Type(() => CallLog)
  callLogs: CallLog[];
}

export class PhoneInterviewDto {
  @IsNumber()
  piRefId: number;

  @IsNumber()
  bookingStatusId?: number;

  @IsString()
  finalOutcome: string;

  @IsString()
  finalReason: string;

  @IsString()
  finalReasonOther: string;

  @IsString()
  languageCheck: string;

  @IsNumber()
  grammar: number;

  @IsString()
  languageOther: string;

  @IsString()
  languageReason: string;

  @IsString()
  mathCheck: string;

  @IsString()
  mathOther: string;

  @IsString()
  mathReason: string;

  @IsString()
  educationQualification: string;

  @IsString()
  cityStatus: string;

  @IsString()
  workStatus: string;

  @IsString()
  paymentMethodStatus: string;

  @IsString()
  overallComments: string;

  @IsNumber()
  pronounciation: number;

  @IsNumber()
  sentenceFormation: number;

  @IsNumber()
  simpleMathematics: number;

  @IsNumber()
  callAttempt: number;

  @IsNumber()
  piStatus: number;

  @IsString()
  date: string;

  @IsString()
  detailsStatus: string;

  @Type(() => CallLog)
  callLogs: CallLog[];

  @IsString()
  @IsOptional()
  adminAdditionalComment : string
}

export class UpdatePhoneInterviewDto {
  @IsNumber()
  piRefId: number;

  @IsString()
  finalOutcome: string;

  @IsString()
  finalReason: string;

  @IsString()
  finalReasonOther: string;

  @IsString()
  languageCheck: string;

  @IsNumber()
  grammar: number;

  @IsString()
  languageOther: string;

  @IsString()
  languageReason: string;

  @IsString()
  mathCheck: string;

  @IsString()
  mathOther: string;

  @IsString()
  mathReason: string;

  @IsString()
  educationQualification: string;

  @IsString()
  cityStatus: string;

  @IsString()
  workStatus: string;

  @IsString()
  paymentMethodStatus: string;

  @IsString()
  overallComments: string;

  @IsNumber()
  pronounciation: number;

  @IsNumber()
  sentenceFormation: number;

  @IsNumber()
  simpleMathematics: number;

  @IsString()
  detailsStatus: string;

  @IsString()
  @IsOptional()
  adminAdditionalComment: string;
}
export class Data {
  @ApiProperty()
  completed: string;

  @ApiProperty()
  piRefId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contact: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  tspId: Date;

  @ApiProperty()
  dateTime: string;

  @ApiProperty()
  mathsTest: string;

  @ApiProperty()
  callLogs: string;

  @ApiProperty()
  interviewDetails: string;

}
export class UserDetailsResponseDto {
  @ApiProperty({
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      completed: 'yes | no',
      piRefId: '001',
      name: 'gishan',
      contact: '070353654',
      country: 'india',
      tspId: '01423',
      dateTime: '2022-10-31T10:21:02.778Z',
      mathsTest: 'good',
      callLogs: 'gishan',
      interviewDetails: 'gishan',
    }
  })
  data: Data;
}
export class ExistCalllog400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [['piRefId must be a number', 'Status ID must be a string'], 'Unexpected token : in JSON at position 69'],
    example: ['callAttempt must be a number conforming to the specified constraints', 'Date must be a date Type']
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class ExistsPhoneInterview201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['available', 'exists'],
    example: 'available'
  })
  status: string;

  @ApiProperty({
    type: 'string',
    examples: [
      'This Interview Details are stored.',
      'This Interview Details are already exists'
    ],
    example: 'This Interview Details are stored.'
  })
  message: string;
}

export class ExistsCalllog201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['available', 'exists'],
    example: 'available'
  })
  status: string;

  @ApiProperty({
    type: 'string',
    examples: [
      'Ref id is ok',
      'Booking status ID and Calllogs will be stored'
    ],
    example: 'Booking status ID and Calllogs will be stored'
  })
  message: string;
}

export class MarkBookingCompletedRequestDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 224
  })
  id: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'status',
    example: 4
  })
  status: number;
}