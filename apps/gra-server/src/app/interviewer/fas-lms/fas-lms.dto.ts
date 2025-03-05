import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import {
  IsDate,
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class TalentlMS200Dto {
  @IsString()
  tsp_id?: string;

  @IsString()
  email?: string;

  @IsDecimal()
  course_completion?: Decimal;

  @IsDecimal()
  course_score_avg?: Decimal;

  @IsDecimal()
  attendance?: Decimal;

  @IsDecimal()
  cpd_familiarity?: Decimal;

  @IsDecimal()
  cpd_sct?: Decimal;

  @IsDecimal()
  cpd_language?: Decimal;

  @IsDecimal()
  cpd_sk?: Decimal;

  @IsDecimal()
  cpd_reflection?: Decimal;

  @IsDecimal()
  cpd?: Decimal;

  @IsNumber()
  ti_record_id?: number;

  @IsDate()
  created_at?: Date;

  @IsDate()
  updated_at?: Date;

  @IsNumber()
  id?: number;

  @IsNumber()
  copied?: number;

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

  @ApiProperty({
    type: 'number',
    example: 0
  })
  count: number;
}

export class TalentlMS404Dto {
  @ApiProperty({
    type: 'number',
    example: 404
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

export class TalentlMS401Dto {
  @ApiProperty({
    type: 'number',
    example: 401
  })
  statusCode: number;
  @ApiProperty({
    type: 'string',
    example: 'Unauthorized'
  })
  message: string;
}



export class TalentLmsDto {
  @IsOptional()
  @IsString()
  tspId?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsString()
  skip: string;

  @IsString()
  take: string;
}
