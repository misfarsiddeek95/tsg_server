import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class AvailabilityCountDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'required_date',
    example: '11.11.2023'
  })
  date_of_week_start: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'tutor_phase',
    example: 'Primary'
  })
  tutor_phase: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'type',
    example: 'Normal' // Credit, Normal
  })
  type: string;
}
