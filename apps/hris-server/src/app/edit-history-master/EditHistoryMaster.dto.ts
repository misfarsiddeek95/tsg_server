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

export class EditHistoryMasterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'skip',
    example: '0'
  })
  skip: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'take',
    example: '10'
  })
  take: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'export2Csv',
    example: 'export2Csv'
  })
  export2Csv: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by auditStatus',
    example: 'audit pending'
  })
  auditStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by profileStatus',
    example: 'active'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by country',
    example: 'Sri Lanka'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by tspIds',
    example: '2,123,343'
  })
  tspId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by name',
    example: 'Banuka Knight'
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by email',
    example: 'bsa@thirdspaceglobal.com'
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'filter by auditor',
    example: '1870'
  })
  auditor: string;
}

export class EditHistoryMaster200Dto {}
