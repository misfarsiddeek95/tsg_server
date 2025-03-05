import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TimeOffDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Time off  details',example:["time of details"] })
  time_off_details: any;
}

export class TimeOffDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;

  @ApiProperty({ type: 'string', example: 'Applied' })
  message: string;
}

export class TimeOffDto403 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}
