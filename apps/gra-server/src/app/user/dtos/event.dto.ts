import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EventTypeCreateDto {
  @ApiProperty({
    type: 'string',
    example: 'PI'
  })
  @IsString()
  type: string;

  @ApiProperty({
    type: 'string',
    example: 'Phone Interview'
  })
  @IsString()
  event_title: string;

  @ApiProperty({
    type: 'number',
    example: 50
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    type: 'string',
    example: 'Phone Interview'
  })
  @IsString()
  @IsOptional()
  description: string;
}

export class EventTypeCreateResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      id: 2,
      type: 1,
      event_title: 'title',
      created_by: 2,
      event_duration: 45,
      event_description: 'description',
      enabled: 1
    }
  })
  data: object;
}

export class FetchEventAlterationResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        id: 1,
        candi_slot_booking_btn_time: 1440,
        candi_join_btn_time: 10,
        candi_edit_btn_time: 30,
        candi_reschedule_limit: 2,
        int_check_btn_time: 10,
        int_slot_available_btn_time: 30,
        event_title: 'Phone Interview',
        event_duration: 15
      },
      {
        id: 2,
        candi_slot_booking_btn_time: 1440,
        candi_join_btn_time: 10,
        candi_edit_btn_time: 30,
        candi_reschedule_limit: 2,
        int_check_btn_time: 10,
        int_slot_available_btn_time: 30,
        event_title: 'Teaching Interview',
        event_duration: 30
      }
    ]
  })
  intervierTime: object[];
}

export class GetInterviewerEventDataRequestDto {
  @ApiProperty({
    type: Number,
    description: 'interviewerId',
    example: 2
  })
  @IsNumber()
  interviewerId: number;
}

export class GetInterviewerEventDataResponseDto {
  @ApiProperty({
    example: [
      {
        appointment_type: 1,
        status: 1,
        id: 1,
        name: 'Interviewer Acc',
        mail: 'interviewer@tsg.com',
        event_title: 'Phone Interview',
        event_duration: 15,
        type: 'PI'
      },
      {
        appointment_type: 2,
        status: 1,
        id: 1,
        name: 'Interviewer Acc',
        mail: 'interviewer@tsg.com',
        event_title: 'Teaching Interview',
        event_duration: 30,
        type: 'TI'
      }
    ]
  })
  data: object[];
}

export class SubmitEventAlterationDto {
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 1
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
    description: 'event_title',
    example: 'Teaching Interview'
  })
  @IsString()
  @IsOptional()
  event_title: string;

  @ApiProperty({
    type: Number,
    description: 'event_duration',
    example: 1
  })
  @IsNumber()
  event_duration: number;
}

export class SubmitEventAlterationResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;
}
