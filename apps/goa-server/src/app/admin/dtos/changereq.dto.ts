import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ChangeReqDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'change request details',
    example: [10, 'Applied']
  })
  change_request_details: any;
}

export class ChangeReqDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @ApiProperty({ type: 'string', example: 'Applied' })
  message: string;
}

export class ChangeReqDto403 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class ChangeReqDetails201 {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 1,
        time: '13:30',
        monday: {
          id: 0,
          changeReqID: 0,
          tutorTimeSlotDataId: 596,
          tutor_time_slots_id: 18,
          slotId: 1,
          slotData: 'P',
          slotDataId: 1,
          effective_date: '',
          changed: false
        },
        tuesday: {
          id: 0,
          changeReqID: 0,
          tutorTimeSlotDataId: 2432,
          tutor_time_slots_id: 18,
          slotId: 8,
          slotData: 'TO',
          slotDataId: 7,
          effective_date: '',
          changed: false
        },
        wednesday: {
          id: 0,
          changeReqID: 0,
          tutorTimeSlotDataId: 2460,
          tutor_time_slots_id: 18,
          slotId: 15,
          slotData: 'N',
          slotDataId: 5,
          effective_date: '',
          changed: false
        },
        thursday: {
          id: 0,
          changeReqID: 0,
          tutorTimeSlotDataId: 617,
          tutor_time_slots_id: 18,
          slotId: 22,
          slotData: 'P',
          slotDataId: 1,
          effective_date: '',
          changed: false
        },
        friday: {
          id: 0,
          changeReqID: 0,
          tutorTimeSlotDataId: 624,
          tutor_time_slots_id: 18,
          slotId: 29,
          slotData: 'P',
          slotDataId: 1,
          effective_date: '',
          changed: false
        }
      }
    ]
  })
  slots: any;
}
