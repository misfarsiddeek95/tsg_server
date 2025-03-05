import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetHrisAccessDto {
  @ApiProperty({
    type: 'number',
    example: 10
  })
  @IsNumber()
  tsp_id?: number;
}

export class GetHrisAccess201Dto {
  @ApiProperty({
    type: 'Boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string[]',
    example: '[]'
  })
  data: string;
}
