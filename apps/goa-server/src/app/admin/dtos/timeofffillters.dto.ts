import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TimeoffFiltersDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'date',
    example: { datefrom: '11.11.2023', dateto: '12.12.2023' }
  })
  date: { datefrom: string; dateto: string };

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'Tutor name',
    example: ['tester17', 'tester18']
  })
  tutor_name: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Hour State', example: ['HH'] })
  hourType: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'Business Unit State',
    example: ['BSA']
  })
  businessUnit: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Country', example: ['Sri Lanka'] })
  country: any;

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
  @ApiProperty({ type: [], description: 'tutor id', example: ['17', '18'] })
  tutor_id: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'supervisor',
    example: ['supervisor1', 'supervisor2']
  })
  supervisor: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'skip', example: 0 })
  skip: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'take', example: 10 })
  take: number;
}

export class TimeoffReqSearchTutorNameFilter201 {
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
        name: 'Tester51'
      },
      {
        tspId: 2922,
        name: 'Tester52'
      },
      {
        tspId: 2923,
        name: 'Tester53'
      },
      {
        tspId: 2924,
        name: 'Tester54'
      },
      {
        tspId: 2925,
        name: 'Tester55'
      },
      {
        tspId: 2926,
        name: 'Tester56'
      },
      {
        tspId: 8902,
        name: 'Tester1'
      },
      {
        tspId: 8903,
        name: 'Tester2'
      },
      {
        tspId: 8908,
        name: 'Tester7'
      },
      {
        tspId: 8913,
        name: 'Tester12'
      },
      {
        tspId: 8930,
        name: 'Tester29'
      },
      {
        tspId: 8962,
        name: 'Tester61'
      }
    ]
  })
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

export class TimeoffReqSearchSupervisorFilter201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 9001,
        name: 'Supervisor 1'
      }
    ]
  })
  data: any;
}

export class TimeoffReqSearchTutorIdFilter201 {
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
}

export class TimeoffFiltersDto201 {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 52,
        tutorId: 864,
        tutorName: 'Tester53',
        supervisor: 'Supervisor 1',
        appliedDate: '2023-03-16T11:21:23.025Z',
        timeOffDate: '2023-03-20T00:00:00.000Z',
        slotsCount: 1,
        hourState: null,
        reason: {
          reason: 'Career Change',
          comment: 'fffff'
        },
        penalty: 'N/A',
        approvalStatus: 5,
        country: 'Sri Lanka'
      }
    ]
  })
  data: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 10 })
  count: number;
}
export class TimeoffExportDto201 {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 2923,
        tutorId: 864,
        tutorName: 'Tester53',
        supervisor: 'Supervisor 1',
        appliedDate: '16.03.2023',
        timeOffDate: '23.03.2023',
        hourState: null,
        reason: 'Career Change',
        comment: 'fffff',
        penalty: 'N/A',
        approvalStatus: 5,
        country: 'Sri Lanka',
        day: 'Thursday',
        slot: 5,
        status: 'Adhoc Pending'
      }
    ]
  })
  data: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 10 })
  count: number;
}
export class TimeoffFiltersDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Data must be in an array' })
  message: string;
}

export class TimeoffApproveAllDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Penalty' })
  penalty: string;

  @IsNumber()
  @ApiProperty({ type: Number, description: 'type of request' })
  type: number;
}
export class TimeoffApproveAllDto201 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        slot: {
          TimeSlots: {
            id: 4,
            hh_reduce_time: '17:00',
            oh_reduce_time: '16:30'
          },
          date: {
            date: 'Tuesday'
          }
        },
        slot_id: 11,
        effective_date: '2023-03-21T00:00:00.000Z',
        slot_status: 7,
        hour_status: 'OH'
      }
    ]
  })
  timeOffDetails: any;
}
export class TimeoffApproveAllDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Invalid' })
  message: string;
}
export class TimeoffRejectAllDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'rejectReason' })
  rejectReason: string;

  @IsString()
  @ApiProperty({ type: String, description: 'comment' })
  comment: string;

  @IsNumber()
  @ApiProperty({ type: Number, description: 'type of request' })
  type: number;
}

export class TimeoffRejectAllDto201 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        slot: {
          TimeSlots: {
            id: 5,
            hh_reduce_time: '19:00',
            oh_reduce_time: '18:30'
          }
        },
        slot_id: 26,
        effective_date: '2023-03-23T00:00:00.000Z',
        slot_status: 7,
        hour_status: 'OH',
        penalty: 'Insufficient Capacity : '
      }
    ]
  })
  timeOffDetails: any;
}
export class TimeoffRejectAllDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Invalid' })
  message: string;
}
export class TimeOffReqUpdateDto {
  @IsNotEmpty()
  @Type(() => TimeOffReqDetails)
  @ApiProperty({ type: [], example:"String,any" })
  details: TimeOffReqDetails[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example:"String" })
  penOrRej: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, example:1 })
  type: number;

  @IsString()
  @ApiProperty({ type: String, example:"String" })
  comment: string;
}
export class TimeoffReqUpdateDto201 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        req_status: 2,
        penalty: 'N/A',
        updated_at: '2023-03-19T14:30:18.385Z',
        slot: {
          TimeSlots: {
            id: 1,
            hh_reduce_time: '14:00',
            oh_reduce_time: '13:30'
          },
          date: {
            date: 'Friday'
          }
        },
        slot_id: 29,
        effective_date: '2023-03-24T00:00:00.000Z',
        slot_status: 7,
        hour_status: 'Flexi'
      }
    ]
  })
  timeOffDetails: any;
}
export class TimeoffReqUpdateDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Invalid' })
  message: string;
}
class TimeOffReqDetails {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsNumber()
  @IsNotEmpty()
  detailId: number;
}
