import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

//data validate
export class TimeofffiltersDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'date',
    example: ['datefrom:2023-12-14', 'dateto:2024-01-14']
  })
  date: { datefrom: string; dateto: string };

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Tutor name', example: ['tester17'] })
  tutor_name: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Hour State', example: ['OH'] })
  hourType: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'Business Unit State',
    example: ['UK']
  })
  businessUnit: any;

  // @IsArray()
  // @IsNotEmpty()
  // @ApiProperty({ type: [], description: 'Country' })
  // country: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'Approval Status',
    example: ['Approved']
  })
  approvalStatus: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'tutor id', example: [100017] })
  tutor_id: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'skip', example: 0 })
  skip: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'take', example: 10 })
  take: number;
}

export class TimeofffiltersDto201 {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        id: ' 61',
        tutorId: '867',
        tutorName: 'Tester56',
        supervisor: 'Supervisor 1',
        appliedDate: '2023-03-17T09:49:16.379Z',
        timeOffDate: '2023-03-16T00:00:00.000Z',
        slotsCount: '4',
        hourState: 'null',
        reason: {
          reason: 'Other',
          comment: 'ASD'
        },
        penalty: 'N/A',
        approvalStatus: 6,
        country: 'Sri Lanka'
      }
    ]
  })
  data: any;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 11 })
  count: number;
}

export class TimeofffiltersDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Invalid' })
  message: string;
}

export class Unauthorized401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class SearchTutorNameFilter201 {
  // @IsNotEmpty()
  // @ApiProperty({ type: [], example: [31] })
  // tutor_name: number;

  @IsNotEmpty()
  @ApiProperty({ type: 'boolean', example: true })
  sucess: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: [], example: [{ tspId: 2921, name: 'Tester51' }] })
  data: any;
}

export class TimeOffDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: {}, description: 'reason', example: 'Test Reason' })
  reason: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: {}, description: 'tutor name', example: 'tester17' })
  tutor_name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: {}, description: 'tutor id', example: 100017 })
  tutor_id: number;

  // @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: {}, description: 'comment' })
  comment: string;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'effective date',
    example: '2024-01-14'
  })
  effective_date: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'time off request details',
    example: ['test details']
  })
  time_off_request_details: any;
}

export class TimeOffDto201 {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: ['Other'] })
  reason: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: ['Dissanayake R.'] })
  tutor_name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: ['46'] })
  tutor_id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: {}, example: ['xc'] })
  comment: string;

  @IsNotEmpty()
  @ApiProperty({ type: {}, example: ['2023-01-10T18:30:00.000Z'] })
  effective_date: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 19,
        rowId: 5,
        field: 'wednesday',
        time: '19:00',
        slotId: 19,
        slotStatusId: 7,
        tutorTimeSlotDataId: 124,
        tutor_time_slots_id: 4,
        hour_status: 'HH'
      }
    ]
  })
  time_off_request_details: any;

  // @IsNotEmpty()
  // @ApiProperty({ type: 'boolean', example: true })
  // sucess: boolean;

  // @IsNotEmpty()
  // @IsString()
  // @ApiProperty({ type: {}, example: 'Success Applied !!!' })
  // message: string;
}

export class TimeOffDto400 {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '400' })
  reason: string;

  @ApiProperty({ type: String, example: 'Error Bad Request' })
  tutor_name: string;
}

export class TimeoffReqSearchTutorIdFilter201 {
  // @IsNotEmpty()
  // @ApiProperty({ type: Number, example: 8902 })
  // tutor_id: number;
  @IsNotEmpty()
  @ApiProperty({ type: 'boolean', example: true })
  sucess: boolean;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [], example: [{ tspId: 2921, name: '862' }] })
  data: any;
}

export class TimeoffReqFiltersDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}
