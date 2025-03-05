import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDetailsDto {
  @IsNotEmpty()
  names: string;

  @IsNotEmpty()
  email: string;

  mobileNo: number;

  @IsNotEmpty()
  startDate: string;

  endData: string;

  tspId: string;

  @IsNotEmpty()
  country: string;
}

export class Data {
  @ApiProperty()
  names: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mobileNo: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  tspId: string;

  @ApiProperty()
  country: string;
}

export class UserDetailsResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      names: 'Sithira',
      email: 'sithira@thirdspaceglobal.com',
      mobileNo: '070353654',
      startDate: '2022-10-31T10:21:02.778Z',
      endData: '2022-10-31T10:21:02.778Z',
      tspId: '001',
      country: 'India'
    }
  })
  data: Data;
}
export class ExistUserDetails400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [
      ['Name Must be entered', 'It must be a string'],
      'Unexpected token : in JSON at position 69'
    ],
    example: [
      'tspID must be a number conforming to the specified constraints',
      'Date must be a date Type'
    ]
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class ExistsPhoneInterview201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['available', 'exists'],
    example: 'available'
  })
  status: string;

  @ApiProperty({
    type: 'string',
    examples: ['This Name is Available.', 'This name is already exists'],
    example: 'This This Name is Available.'
  })
  message: string;
}

export class ExistsCalllog201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['available', 'exists'],
    example: 'available'
  })
  status: string;

  @ApiProperty({
    type: 'string',
    examples: ['Ref id is ok', 'Booking status ID and Calllogs will be stored'],
    example: 'Booking status ID and Calllogs will be stored'
  })
  message: string;
}
