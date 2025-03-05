import { ApiProperty } from '@nestjs/swagger';

export class CandidateLevelSlotDto {
  @ApiProperty({
    type: 'string',
    example: '10'
  })
  candidateId?: string;
}

export class data {
  @ApiProperty()
  level?: string;
}
export class CandidateLevel201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    example: {
      level: 'null'
    }
  })
  data: data;
}

export class AllBookingSlot400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unexpected token } in JSON at position 24'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  error: string;
}
