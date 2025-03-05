import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class BulkActionDto {
  @IsNotEmpty()
  @Type(() => TimeOff)
  @ApiProperty({type:[], example:["string", "string"]})
  timeOffs: TimeOff[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({type:String,example:"string"})
  penOrRej: string;

  @IsString()
  @ApiProperty({type:String,example:"string"})
  comment: string;
}

class SlotDataDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  day: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 2 })
  slotNumber: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'HH' })
  slotStatus: string;
}

export class AvailabilityBulkActionDto {
  @IsNotEmpty()
  @ApiProperty({ type: [Number], example: [69, 42, 87] })
  tutorIdList: number[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '14.12.2022' })
  startDate: string;

  @IsString()
  @ApiProperty({ type: String, example: '14.01.2023' })
  endDate: string;

  @IsObject()
  @ApiProperty({ type: SlotDataDto,})
  slotStatus: SlotDataDto;

  @IsString()
  @ApiProperty({ type: String, example: 'HH' })
  workHour: string;
}

export class TimeoffBulkActionDto201 {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;
}
export class TimeoffBulkActionDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  statusCode: number;

  @ApiProperty({ type: 'string', example: ' Invalid' })
  message: string;
}
class TimeOff {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  type: number;
}
