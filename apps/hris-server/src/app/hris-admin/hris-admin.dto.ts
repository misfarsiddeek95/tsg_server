import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  IsDateString
} from 'class-validator';

export class HrisAdminDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [Number],
    example: [2, 5]
  })
  tspIds: number[];

  @IsString()
  @ApiProperty({
    example: '2'
  })
  batch: string;

  @IsString()
  @ApiProperty({
    example: 'TUTOR OPERATIONS'
  })
  department: string;

  @IsString()
  @ApiProperty({
    example: 'ACADEMIC OPERATIONS'
  })
  division: string;

  @IsString()
  @ApiProperty({
    example: 'TSG'
  })
  center: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 12
  })
  supervisorTspId: number;

  @IsString()
  @ApiProperty({
    example: 'TUTOR'
  })
  employmentType: string;

  @IsString()
  @ApiProperty({
    example: 'OMT'
  })
  jobTitle: string;

  @IsString()
  @ApiProperty({
    example: 'TEST'
  })
  tutorLine: string;

  @IsString()
  @ApiProperty({
    example: 'Testing reason'
  })
  comment: string;

  @IsString()
  @ApiProperty({
    example: '1'
  })
  updatedBy: number;
}

export class HrisContractDto {
  @ApiProperty({
    type: Number
  })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  tspIds: number[];

  @ApiProperty({
    type: String,
    example: 'Part Time'
  })
  @IsString()
  contractType: string;

  @ApiProperty({
    type: String,
    example: '20222-02-10'
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    type: String,
    example: '2022-02-10'
  })
  @IsString()
  endDate: string;

  @ApiProperty({
    type: String,
    example: 'Type the reason'
  })
  @IsString()
  reasonValue: string;
}

export class Succes200Dto {
  @ApiProperty({
    type: Number,
    example: 200
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    example: 'true'
  })
  success: string;
}

export class Error400Dto {
  @ApiProperty({
    type: Number,
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    examples: [
      'tspId must be a number',
      'Unexpected token } in JSON at position 14',
      'batch must be a string'
    ],
    example: 'Unexpected token } in JSON at position 14'
  })
  message: string;

  @ApiProperty({
    type: String,
    example: 'Bad Request'
  })
  error: string;
}

export class ProfileStatusDto {
  // @IsNotEmpty()
  // @IsNumber()
  // tspId: number;

  @IsString()
  profileStatus: string;
}

export class AdminApprovalDto {
  @IsString()
  hrAdminApproval: string;

  @IsNumber()
  approvedBy: number;

  @IsString()
  approvedAt: string;
}
