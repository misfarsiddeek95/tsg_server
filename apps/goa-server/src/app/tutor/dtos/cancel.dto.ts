import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CancelDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'reason',example:"test reason" })
  reason: string;

  @IsString()
  @ApiProperty({ type: String, description: 'comment', example:"test comment" })
  comment: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'cancel request details',example:["test cancel request details"] })
  cancel_request_details: any;
}

export class CancelDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;
}

export class CancelDto403 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '403' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}
