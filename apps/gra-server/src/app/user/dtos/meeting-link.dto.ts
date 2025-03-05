import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetMeetingLinkRequestDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'interviewerId',
    example: 1
  })
  interviewerId: number;
}

export class GetMeetingLinkResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: 'object',
    description: 'meeting Url',
    example: {
      url: 'https://meet.google.com/kab-wwqr-qaj'
    }
  })
  data: object;
}

