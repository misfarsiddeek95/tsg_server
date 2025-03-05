import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class DateDto {
  @IsNotEmpty()
  @IsString()
  datefrom: string;

  @IsNotEmpty()
  @IsString()
  dateto: string;
}
export class ChangeReqFiltersDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [DateDto],
    example: { datefrom: '12.12.2023', dateto: '15.12.2023' }
  })
  date: DateDto[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: ['tester17', 'tester18']
  })
  tutor_name: any[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Hour State', example: ['HH'] })
  hourType: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Approval State', example: ['Approved'] })
  approval_state: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Business Unit', example:[ 'BSA'] })
  business_unit: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'tutor id', example: ['17'] })
  tutor_id: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'supervisor', example: 'supervisor1' })
  supervisor: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'skip', example: 5 })
  skip: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'take', example: 10 })
  take: number;
}

export class ChangeReqGetListDto201 {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        id: 3,
        tutorID: 895,
        tutorName: 'Tester2',
        supervisor: 'Supervisor 1',
        businessUnit: 'Primary',
        country: 'Sri Lanka',
        hourstatus: 'OH',
        requestedDate: '2023-02-27T06:44:21.128Z',
        effectiveDate: '2023-03-15T00:00:00.000Z',
        changes: {
          incr: 0,
          decr: 8
        },
        reason: {
          reason: 'Higher Studies',
          comment: ''
        },
        impact: 'yes',
        tslContract: false,
        approvalStatus: 2
      }
    ]
  })
  data: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 2 })
  count: number;
}
export class ChangeReqFiltersDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class ChangeRequestSearchTutorNameFilter201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 8903,
        name: 'Tester2'
      }
    ]
  })
  data: any;
}

export class ChangeRequestSearchTutorIdFilter201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 8903,
        name: '895'
      }
    ]
  })
  data: any;
}

export class ChangeReqSearchSupervisorFilter201 {
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
