import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ChangeRequestDeatils201 {
  @IsArray()
  @IsNotEmpty()
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
          changed: false,
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
          changed: false,
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
          changed: false,
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
          changed: false,
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
          changed: false,
        },
      },
    ],
  })
  slots: any;
}

export class ChangeRequestDeatils401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Data must be in an array' })
  message: string;
}
