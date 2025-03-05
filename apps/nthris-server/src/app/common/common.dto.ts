import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommonErrorDto {
  @ApiProperty({
    type: 'boolean',
    description: 'Status',
    example: false
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    description: 'Error Message',
    example: 'Error message'
  })
  message: string;
}

export class Common401Dto {
  @ApiProperty({
    type: 'number',
    example: 401
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unauthorized'
  })
  messages: string;
}

export class NTDto {
  @ApiProperty({
    type: 'string',
    description: 'Non Tutor Id',
    example: '123'
  })
  @IsString()
  nonTutorId: string;
}
