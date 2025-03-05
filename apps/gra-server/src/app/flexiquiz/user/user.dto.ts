import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FlexiUserSubmitDto {
  @IsNotEmpty()
  tspId: number;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  flexCanId: string;
  @IsNotEmpty()
  skipCreatingAccount: boolean;
}

export class Data {
  @ApiProperty()
  tspId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  flexCanId: string;

  @ApiProperty()
  skipCreatingAccount: boolean;
}

export class FlexiuserResponseDto {
  @ApiProperty({
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      tspId: 2,
      email: 'sithira@thirdspaceglobal.com',
      firstName: 'Sithira',
      lastName: 'Sanjitha',
      flexCanId: '001',
      skipCreatingAccount: true
    }
  })
  data: Data;
}

export class Flexiuser201Dto {
  @ApiProperty({
    type: 'Boolean',
    examples: ['true', 'false'],
    example: true
  })
  success: boolean;
  @ApiProperty({
    type: 'string',
    example: []
  })
  data: string;
}

export class Flexiuser400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [
      ['TSPId Must be entered', 'It must be a Number'],
      'Unexpected token : in JSON at position 69'
    ],
    example: [
      'ID Type must be a number conforming to the specified constraints',
      'Name & Email must be a string conforming to the specified constraints',
      'Skip Creating Account must be must be a boolean Type'
    ]
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    examples: [
      'tspId must be a number conforming to the specified constraints',
      'Skip Creating Account must be a boolean conforming to the specified constraints'
    ],
    example:
      'Name & Email must be a string conforming to the specified constraints'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class ExistsFlexiuser201Dto {
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
    examples: ['This slot is Available.', 'This slot is already exists'],
    example: 'This slot is Available.'
  })
  message: string;
}

