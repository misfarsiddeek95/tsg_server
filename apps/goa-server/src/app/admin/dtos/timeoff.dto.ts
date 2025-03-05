import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TimeOffDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'Reason' })
  reason: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'tutor name' })
  tutor_name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 'tutor id' })
  tutor_id: number;

  @IsString()
  @ApiProperty({ type: String, example: 'comment' })
  comment: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'effective date' })
  effective_date: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], example: 'time off request details' })
  time_off_request_details: any;
}

export class SubordinateTimeOffDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;
}

export class TimeOffDto400 {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '400' })
  reason: string;

  @ApiProperty({ type: String, example: 'Error Bad Request' })
  tutor_name: string;
}

export class SubordinateTimeOffDto400 {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '400' })
  reason: string;

  @ApiProperty({ type: String, example: 'Error Bad Request' })
  tutor_name: string;
}
export class GetBusinessUnit201 {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], example: ['Primary'] })
  0: any;
}
export class TimeOffDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class TimeOffDetails201 {
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 1 })
  id: number;
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 1 })
  slot: number;
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: '13:00' })
  time: string;
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: {
      state: 'P',
      status: null,
      timeOffId: null
    }
  })
  availability: any;
}

export class TimeOffTutorAvailability201 {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 1,
        time: '13:30',
        thursday: {
          tutorTimeSlotDataId: 2515,
          tutor_time_slots_id: 1,
          slotId: 22,
          slotStatusId: 8,
          slotData: 'H',
          hour_status: 'OH'
        },
        friday: {
          tutorTimeSlotDataId: 2416,
          tutor_time_slots_id: 1,
          slotId: 29,
          slotStatusId: 2,
          slotData: 'S',
          hour_status: 'OH'
        },
        monday: {
          tutorTimeSlotDataId: 2531,
          tutor_time_slots_id: 1,
          slotId: 1,
          slotStatusId: 8,
          slotData: 'H',
          hour_status: 'OH'
        },
        tuesday: {
          tutorTimeSlotDataId: 2545,
          tutor_time_slots_id: 1,
          slotId: 8,
          slotStatusId: 8,
          slotData: 'H',
          hour_status: 'OH'
        },
        wednesday: {
          tutorTimeSlotDataId: 2503,
          tutor_time_slots_id: 1,
          slotId: 15,
          slotStatusId: 2,
          slotData: 'S',
          hour_status: 'OH'
        }
      }
    ]
  })
  slots: any;
}
