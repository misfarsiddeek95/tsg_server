import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// SUCCESS - ERROR OUTPUT DTO =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
class SuccessOutputAvailabilityCount {
  @ApiProperty({ type: Number, example: 7 })
  slot_id: number;

  @ApiProperty({ type: Number, example: 100 })
  available: number;

  @ApiProperty({ type: Number, example: 10 })
  on_hold: number;
}

export class FinalSuccessOutputAvailabilityCount {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Successfully retrieved availability data'
  })
  message: string;

  @ApiProperty({ type: SuccessOutputAvailabilityCount, isArray: true })
  data: SuccessOutputAvailabilityCount[];
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export class NewBookedSessionDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'session_id',
    example: '345674'
  })
  session_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'school_id',
    example: '345674'
  })
  school_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'student_id',
    example: '345674'
  })
  student_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'tutor_id',
    example: '345674'
  })
  tutor_id: bigint;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'session_type',
    example: 'Primary'
  })
  session_type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'hour_slot',
    example: 'HH'
  })
  hour_slot: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'slot',
    example: '1'
  })
  slot: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'date',
    example: '11.11.2023'
  })
  date: string;
}

// dummy data for launch sessions
export class NewLaunchedSessionsDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'id',
    example: '4642959'
  })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'tutor_id',
    example: '345674'
  })
  tutor_id: bigint;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'slot',
    example: '1'
  })
  slot: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'date',
    example: '11.11.2023'
  })
  date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'slot status',
    example: 'PA'
  })
  slot_status: string;
}

// dummy data for booked sessions
export class BookedDummySessions {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'session_id',
    example: '345674'
  })
  session_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'school_id',
    example: '345674'
  })
  school_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'student_id',
    example: '345674'
  })
  student_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'tutor_id',
    example: '345674'
  })
  tutor_id: bigint;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'session_type',
    example: 'Primary'
  })
  session_type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'hour_slot',
    example: 'HH'
  })
  hour_slot: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'slot',
    example: '1'
  })
  slot: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'date',
    example: '11.11.2023'
  })
  date: string;
}
