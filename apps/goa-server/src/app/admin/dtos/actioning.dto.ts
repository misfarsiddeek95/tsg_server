import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString
} from 'class-validator';

export class Status401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;
  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class Status201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;
}

export class PaymentConcernsTableDto {
  @IsArray()
  @ApiProperty({ type: [], description: 'Tutor name', example: ['tester17'] })
  tutor_name: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'tutor id', example: [100017] })
  tutor_id: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'Concern  id', example: [17] })
  concern_Id: any;

  @IsObject()
  @ApiProperty({
    type: String,
    description: 'date',
    example: { startDate: '2023-12-14', endDate: '2024-01-14' }
  })
  date: { startDate: string; endDate: string };

  @IsArray()
  @ApiProperty({
    type: [],
    description: 'Business Unit State',
    example: ['UK']
  })
  business_unit: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'tutor Location', example: ['IND'] })
  tutorLocation: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'Slot number' })
  slot_number: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'Action Status' })
  actionStatus: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'Concern Type' })
  concernType: any;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'skip', example: 0 })
  skip: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'take', example: 10 })
  take: number;
}

export class ConcernsDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'status', example: 1 })
  status: number;

  @IsString()
  @ApiProperty({ type: String, description: 'comment', example: 'test' })
  comment: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'cancel request details',
    example: ['test']
  })
  Concern_request_details: any;
}
