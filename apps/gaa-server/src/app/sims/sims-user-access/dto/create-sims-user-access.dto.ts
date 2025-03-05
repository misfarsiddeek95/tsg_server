import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSimsUserAccessDto {}

export class GetSimsUserAccessDto {
  @ApiProperty({
    type: 'number',
    example: 100147
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

//Response DTOs for the Sims User Access
export class getSimsUserAccess201ResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'string',
    example: 'Academic Operations'
  })
  'division': string;

  @ApiProperty({
    type: 'string',
    example: 'OTHER'
  })
  'accessLevel': string;
}

export class getSimsUserAccess400ResponseDto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'userId must be a number conforming to the specified constraints'
  })
  'message': string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}
