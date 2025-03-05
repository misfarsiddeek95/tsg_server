import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBookingHistoryDto {
  @ApiProperty({
    type: String,
    example: 'Online'
  })
  @IsString()
  appointmentType: string;

  @ApiProperty({
    type: String,
    example: 'Online'
  })
  @IsString()
  bookingStatus: string;

  @ApiProperty({
    type: String,
    example: '21/02/2022'
  })
  @IsString()
  date: string;

  @ApiProperty({
    type: 'number',
    example: '00'
  })
  @IsNumber()
  candidateId: number;

  @ApiProperty({
    type: 'number',
    example: '00'
  })
  @IsNumber()
  interviewerId: number;

  @ApiProperty({
    type: 'number',
    example: '00'
  })
  @IsNumber()
  slotTimeId: number;

  @ApiProperty({
    type: String,
    example: 'Withdraw Reason'
  })
  @IsString()
  withdrawReason: string;

  @ApiProperty({
    type: 'number',
    example: '001'
  })
  @IsNumber()
  bookingId: number;
}

export class SubmitBookingHistory201Dto {
  @ApiProperty({
    type: 'number',
    example: 201
  })
  statusCode: number;

  @ApiProperty({
    type: 'boolean',
    example: false
  })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Invalid time value'
  })
  'error': string;
}

export class FetchCandidateBookingStatusResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      id: 1251,
      date: '2024-04-27T00:00:00.000Z',
      slotTime: '05:30 - 06:00 PM',
      slotStartTime: '1970-01-01T17:30:00.000Z',
      slotEndTime: '1970-01-01T18:00:00.000Z',
      candidateLevel: 5,
      slotId: 120,
      lastBookingStatus: 3,
      interviewerMeetingLink: 'https://meet.google.com/not-vald-lnk',
      interviewerId: 1
    }
  })
  data: object;
}