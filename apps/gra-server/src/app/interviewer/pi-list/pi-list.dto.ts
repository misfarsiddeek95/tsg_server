import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FlexiListDto {
  @ApiProperty({
    type: 'number',
    example: 2
  })
  @IsOptional()
  @IsString()
  take: string;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsOptional()
  @IsString()
  skip: string;

  @IsOptional()
  @IsString()
  export2Csv: string;

  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    example: 25
  })
  tspId: any;

  @ApiProperty({
    type: 'string',
    example: 'Abdhu'
  })
  @IsOptional()
  @IsString()
  candiName: string;

  @ApiProperty({
    type: 'string',
    example: 'abdhu@gmail.com'
  })
  @IsOptional()
  @IsString()
  candiEmail: string;

  @ApiProperty({
    type: 'string',
    example: 'good'
  })
  @IsOptional()
  @IsString()
  finalOutcome: string;

  @ApiProperty({
    type: 'string',
    example: '0765409782'
  })
  @IsOptional()
  @IsString()
  mobileNo: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class PiList201Dto {
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

export class PiList400Dto {
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
export class PiListUnauthorized401Dto {
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
