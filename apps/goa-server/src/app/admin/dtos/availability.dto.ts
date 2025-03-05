import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  isNotEmpty
} from 'class-validator';

export class updateSlotsStatusDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  // @ArrayMaxSize(2)
  @Type(() => CreateTutorTimeSlotsDataDto)
  slots: CreateTutorTimeSlotsDataDto[];
}
export class CreateTutorTimeSlotsDataDto {
  id: number;
  slot: string;
}

export class list201 {
  @IsNotEmpty()
  @ApiProperty({ type: 'boolean', example: true })
  sucess: boolean;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ type: Date, example: '2023-03-18T00:00:00+00:00' })
  date: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 69 })
  count: number;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 1,
        user_id: 2921,
        tutor_id: 862,
        tutor_name: 'Tester51',
        hour_status: 'OH',
        ppUrl: '',
        tutor_status: 'Active',
        tutor_slot: 35,
        tutor_type: 'Primary',
        contract_id: 'Pending',
        country: 'Sri Lanka',
        supervisorName: 'Supervisor 1',
        batch: '37B',
        Monday1: {
          idtutor_time_slots_data: 2531,
          idslot: 1,
          value: 'H',
          isClose: false,
          movement: false,
          movementType: 'active',
          effective_date: '2023-01-15T00:00:00.000Z'
        },
        Monday2: {
          idtutor_time_slots_data: 2532,
          idslot: 2,
          value: 'N',
          isClose: false,
          movement: false,
          movementType: 'active',
          effective_date: '2023-01-15T00:00:00.000Z'
        },
        Monday3: {
          idtutor_time_slots_data: 2533,
          idslot: 3,
          value: 'PC',
          isClose: false,
          movement: false,
          movementType: 'active',
          effective_date: '2023-01-15T00:00:00.000Z'
        },
        Monday4: {
          idtutor_time_slots_data: 2579,
          idslot: 4,
          value: 'TO',
          isClose: false,
          movement: false,
          movementType: 'active',
          effective_date: '2023-01-15T00:00:00.000Z'
        },
        Monday5: {
          idtutor_time_slots_data: 2575,
          idslot: 5,
          value: 'TO',
          isClose: false,
          movement: false,
          movementType: 'active',
          effective_date: '2023-01-15T00:00:00.000Z'
        },
        Monday6: {
          idtutor_time_slots_data: 2426,
          idslot: 6,
          value: 'H',
          isClose: false,
          movement: false,
          movementType: 'active',
          effective_date: '2023-01-15T00:00:00.000Z'
        },
        Monday7: {
          idtutor_time_slots_data: 2447,
          idslot: 7,
          value: 'S',
          isClose: false,
          movement: false,
          movementType: 'active',
          effective_date: '2023-01-15T00:00:00.000Z'
        }
      }
    ]
  })
  data: any;
}

export class list401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Data must be in an array' })
  message: string;
}

export class UpdateHourStatusReport201 {
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: {
      OH: 4,
      null: 2,
      Flexi: 1
    }
  })
  cover: any;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: { OH: 2429, Flexi: 37, null: 2 }
  })
  uncover: any;

  @IsNumber()
  @ApiProperty({ type: Number, example: 0 })
  pending: number;
  @IsNumber()
  @ApiProperty({ type: Number, example: 46 })
  timeOf: number;
}

export class UpdateHourStatusReport401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class UpdateHourStatus201 {
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  // @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: {
      id: 1,
      hour_status: 'OH'
    }
  })
  data: any;
}
export class UpdateHourStatus {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 10 })
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 120 })
  tsp_id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'HH' })
  hour_status: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '20.12.2023' })
  effective_date: string;
}
export class UpdateSlotStatus201 {
  // @IsNotEmpty()
  // @IsDateString()
  // @ApiProperty({ type: 'string', example: '2023-01-30T15:43:43+05:30' })
  // date: string;

  // @ApiProperty({ type: [], example: [] })
  // slots: any;

  @ApiProperty({ type: 'string', example: 'true' })
  success: string;
}

export class TimeSlot201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 'Monday1',
        date: 'Monday',
        slot: 1
      },
      {
        id: 'Monday2',
        date: 'Monday',
        slot: 2
      },
      {
        id: 'Monday3',
        date: 'Monday',
        slot: 3
      },
      {
        id: 'Monday4',
        date: 'Monday',
        slot: 4
      },
      {
        id: 'Monday5',
        date: 'Monday',
        slot: 5
      },
      {
        id: 'Monday6',
        date: 'Monday',
        slot: 6
      },
      {
        id: 'Monday7',
        date: 'Monday',
        slot: 7
      },
      {
        id: 'Tuesday1',
        date: 'Tuesday',
        slot: 1
      },
      {
        id: 'Tuesday2',
        date: 'Tuesday',
        slot: 2
      },
      {
        id: 'Tuesday3',
        date: 'Tuesday',
        slot: 3
      },
      {
        id: 'Tuesday4',
        date: 'Tuesday',
        slot: 4
      },
      {
        id: 'Tuesday5',
        date: 'Tuesday',
        slot: 5
      },
      {
        id: 'Tuesday6',
        date: 'Tuesday',
        slot: 6
      },
      {
        id: 'Tuesday7',
        date: 'Tuesday',
        slot: 7
      },
      {
        id: 'Wednesday1',
        date: 'Wednesday',
        slot: 1
      },
      {
        id: 'Wednesday2',
        date: 'Wednesday',
        slot: 2
      },
      {
        id: 'Wednesday3',
        date: 'Wednesday',
        slot: 3
      },
      {
        id: 'Wednesday4',
        date: 'Wednesday',
        slot: 4
      },
      {
        id: 'Wednesday5',
        date: 'Wednesday',
        slot: 5
      },
      {
        id: 'Wednesday6',
        date: 'Wednesday',
        slot: 6
      },
      {
        id: 'Wednesday7',
        date: 'Wednesday',
        slot: 7
      },
      {
        id: 'Thursday1',
        date: 'Thursday',
        slot: 1
      },
      {
        id: 'Thursday2',
        date: 'Thursday',
        slot: 2
      },
      {
        id: 'Thursday3',
        date: 'Thursday',
        slot: 3
      },
      {
        id: 'Thursday4',
        date: 'Thursday',
        slot: 4
      },
      {
        id: 'Thursday5',
        date: 'Thursday',
        slot: 5
      },
      {
        id: 'Thursday6',
        date: 'Thursday',
        slot: 6
      },
      {
        id: 'Thursday7',
        date: 'Thursday',
        slot: 7
      },
      {
        id: 'Friday1',
        date: 'Friday',
        slot: 1
      },
      {
        id: 'Friday2',
        date: 'Friday',
        slot: 2
      },
      {
        id: 'Friday3',
        date: 'Friday',
        slot: 3
      },
      {
        id: 'Friday4',
        date: 'Friday',
        slot: 4
      },
      {
        id: 'Friday5',
        date: 'Friday',
        slot: 5
      },
      {
        id: 'Friday6',
        date: 'Friday',
        slot: 6
      },
      {
        id: 'Friday7',
        date: 'Friday',
        slot: 7
      }
    ]
  })
  data: any;
}

export class SearchBatchFilter201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        tspId: null,
        name: '38B'
      },
      {
        tspId: null,
        name: '39B'
      },
      {
        tspId: null,
        name: '37B'
      }
    ]
  })
  data: any;
}

export class AdminAvailabilityGetStatus201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: ['On Hold', 'Resignation', 'Active']
  })
  data: any;
}

export class SearchTutorIdFilter201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 2924,
        name: '865'
      }
    ]
  })
  data: any;
}

export class AvailabilitySearchTutorNameFilter201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 2464,
        name: 'testclient001'
      },
      {
        tspId: 2921,
        name: 'Tester51'
      },
      {
        tspId: 2922,
        name: 'Tester52'
      },
      {
        tspId: 2923,
        name: 'Tester53'
      }
    ]
  })
  data: any;
}

export class SearchTutorTimeSlotID201 {
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 2437 })
  idtutor_time_slots_data: number;
}

class DemandDto {
  @IsNotEmpty()
  @IsString()
  effectiveDate: string;
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  @IsString()
  businessUnit: string;
  @IsNotEmpty()
  @IsNumber()
  slotId: number;
  @IsNotEmpty()
  @IsNumber()
  hourStatusId: number;
}

export class UpdateDemandDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DemandDto)
  @ApiProperty({
    type: DemandDto,
    example: [
      {
        effectiveDate: '2024-01-14',
        amount: 30000,
        businessUnit: 'UK',
        slotId: 2,
        hourStatusId: 1
      }
    ]
  })
  values: DemandDto[];
}
export class Common201Dto {
  @IsString()
  @ApiProperty({ type: Boolean, example: 'true' })
  success: boolean;
}

export class Common401Dto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class ResignedTutor {
  @IsNumber()
  @IsNotEmpty()
  tspId: number;

  @IsString()
  @IsNotEmpty()
  lastWorkingDate: string;

  @IsNumber()
  @IsNotEmpty()
  actionedUserId: number;
}

export class SaveUkBookedSessions {
  @IsNumber()
  @IsNotEmpty()
  tspId: number;

  @IsString()
  @IsNotEmpty()
  status: 'CANCELED' | 'BOOKED';

  @IsString()
  @IsNotEmpty()
  effectiveDate: string;

  @IsNumber()
  @IsNotEmpty()
  goaSlotId: number;

  @IsString()
  @IsNotEmpty()
  sessionType: string;

  @IsNumber()
  @IsNotEmpty()
  sessionId: number;
}

/*
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Tutor name / id fetching API response
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
class SuccessOutputTutorNameOrId {
  @ApiProperty({ type: Number, example: 9001 })
  tsp_id: number;

  @ApiProperty({ type: Number, example: 9001 })
  tutor_id: number;

  @ApiProperty({ type: String, example: 'Misfar Siddeek' })
  name: string;
}

export class TutorNameOrIdSuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: SuccessOutputTutorNameOrId, isArray: true })
  data: SuccessOutputTutorNameOrId[];
}
export class TutorNameOrIdErrorResponse {
  @ApiProperty({ type: Boolean, example: false })
  success: boolean;

  @ApiProperty({ type: Array, example: [] })
  data: [];
}
