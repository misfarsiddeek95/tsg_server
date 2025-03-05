import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

export class ChangeReqFiltersDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'date',
    example: { datefrom: '2023-12-14', dateto: '2024-01-14' }
  })
  date: { datefrom: string; dateto: string };

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Tutor name', example: ['tester17'] })
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

export class ChangeReqFiltersDto201 {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        id: ' 3',
        tutorId: '895',
        tutorName: 'Tester2',
        supervisor: 'Supervisor 1',
        businessUnit: 'Primary',
        country: 'Sri Lanka',
        hourstatus: 'OH',
        requestedDate: '2023-02-27T06:44:21.128Z',
        effectiveDate: '2023-03-15T00:00:00.000Z',
        changes: {
          incr: '0',
          decr: '8'
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
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Data must be in an array' })
  message: string;
}

export class ChangeReqSearchTutorNameFilter201 {
  // @IsNotEmpty()
  // @ApiProperty({ type: Number, example: 8902 })
  // tutor_name: number;
  @IsNotEmpty()
  @ApiProperty({ type: 'boolean', example: true })
  sucess: boolean;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [], example: [{ tspId: 2921, name: 'Tester51' }] })
  data: any;
}

export class ChangeReqSearchTutorIdFilter201 {
  // @IsNotEmpty()
  // @ApiProperty({ type: Number, example: 8902 })
  // tutor_id: number;
  @IsNotEmpty()
  @ApiProperty({ type: 'boolean', example: true })
  sucess: boolean;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [], example: [{ tspId: 8903, name: '895' }] })
  data: any;
}
