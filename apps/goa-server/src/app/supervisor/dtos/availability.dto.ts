import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

// export class AvailabilityDto {
//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty({ type: 'string', example: 'HH' })
//   hour_status: string;

//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty({ type: Number, example: 1 })
//   id: number;
// }

export class AvailabilityDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 1,
        hour_status: 'HH'
      }
    ]
  })
  data: any;
}
export class SearchtutorId201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 2921,
        name: '862'
      }
    ]
  })
  data: any;
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ type: 'string', example: '14589' })
  // name: string;
}

export class SearchtutorId401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class SearchtutorName201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 2921,
        name: 'Tester51'
      }
    ]
  })
  data: any;
}

export class SearchBatch201 {
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
      }
    ]
  })
  data: any;
}

export class AvailabilityList201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @ApiProperty({ type: {}, example: '2023-03-18T00:00:00+05:30' })
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 20 })
  'count': number;

  @IsNotEmpty()
  @IsArray()
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
        country: '',
        batch: '37B',
        Monday1: {
          idtutor_time_slots_data: 2531,
          idslot: 1,
          value: 'H'
        },
        Monday2: {
          idtutor_time_slots_data: 2532,
          idslot: 2,
          value: 'N'
        },
        Monday3: {
          idtutor_time_slots_data: 2533,
          idslot: 3,
          value: 'PC'
        },
        Monday4: {
          idtutor_time_slots_data: 2579,
          idslot: 4,
          value: 'TO'
        },
        Monday5: {
          idtutor_time_slots_data: 2575,
          idslot: 5,
          value: 'TO'
        },
        Monday6: {
          idtutor_time_slots_data: 2426,
          idslot: 6,
          value: 'H'
        },
        Monday7: {
          idtutor_time_slots_data: 2577,
          idslot: 7,
          value: 'TO'
        }
      }
    ]
  })
  data: any;
}

export class GetStatus201 {
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

export class UpdateHourStatus {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 17 })
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'HH' })
  hour_status: string;
}
