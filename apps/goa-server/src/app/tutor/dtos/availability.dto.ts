import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

export class ChangeAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'reason', example: 'Test Reason' })
  reason: string;

  @IsString()
  @ApiProperty({ type: String, description: 'comment', example: 'Test Reason' })
  comment: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'effective date',
    example: '2024-01-12'
  })
  effective_date: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'change request details',
    example: ['change request details']
  })
  change_request_details: any;
}

export class FlagDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Date' })
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'Slot ID' })
  slot_id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'Slot Status ID' })
  slot_status_id: number;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'hour Status' })
  hour_status: string;

  @IsNotEmpty()
  @ApiProperty({ type: Boolean, description: 'Satutary' })
  satutary: boolean;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Concern Type' })
  concern: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'description' })
  description: string;

  @IsString()
  @ApiProperty({ type: String, description: 'document uri' })
  document_url: string;
}

export class ChangeAvailabilityDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @ApiProperty({ type: 'string', example: 'Applied' })
  message: string;
}

export class UserDetailsAvailabilityDto201 {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 1,
        time: '13:30',
        thursday: {
          tutorTimeSlotDataId: 617,
          slotId: 22,
          slotStatusId: 1,
          hour_status: 'OH',
          changed: false,
          disabled: false,
          request: false
        },
        friday: {
          tutorTimeSlotDataId: 624,
          slotId: 29,
          slotStatusId: 1,
          hour_status: 'OH',
          changed: false,
          disabled: false,
          request: false
        },
        monday: {
          tutorTimeSlotDataId: 596,
          slotId: 1,
          slotStatusId: 1,
          hour_status: 'OH',
          changed: false,
          disabled: false,
          request: false
        },
        tuesday: {
          tutorTimeSlotDataId: 2431,
          slotId: 8,
          slotStatusId: 1,
          hour_status: 'OH',
          changed: false,
          disabled: false,
          request: false
        },
        wednesday: {
          tutorTimeSlotDataId: 2460,
          slotId: 15,
          slotStatusId: 5,
          hour_status: 'OH',
          changed: false,
          disabled: false,
          request: false
        }
      }
    ]
  })
  slots: any;
}

export class HistorylistDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 35 })
  count: number;
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 1,
        tableId: 65,
        rowID: 142,
        type: 'timeOff',
        slot_id: 2,
        status: 0,
        time: '14:30',
        slot_status: 7,
        effective_date: '2023-03-22T00:00:00.000Z',
        reason: 'Other',
        comment: 'ss',
        penalty: 'N/A',
        created_at: '2023-03-20T01:20:16.399Z',
        hour_status: 'OH'
      }
    ]
  })
  data: any;
}
export class GetCalendarDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        holidays_type_id: 1,
        country: 'srilankan',
        effective_date: '2023-01-15T00:00:00.000Z',
        description: 'Tamil Thai Pongal Day'
      },
      {
        holidays_type_id: 1,
        country: 'srilankan',
        effective_date: '2023-02-04T00:00:00.000Z',
        description: 'Independance Day'
      },
      {
        holidays_type_id: 1,
        country: 'srilankan',
        effective_date: '2023-04-13T00:00:00.000Z',
        description: 'Day prior to Sinhala & Tamil New Year'
      }
    ]
  })
  data: any;
}

export class TutoringCountry200Dto {
  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @IsString()
  @ApiProperty({
    type: String,
    example: 'UK'
  })
  Country: string;
}
