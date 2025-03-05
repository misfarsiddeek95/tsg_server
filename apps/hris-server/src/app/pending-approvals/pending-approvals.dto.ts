import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class UpdatePendingApprovalsDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [Number],
    example: [2, 5]
  })
  tspIds: number[];

  @IsString()
  @ApiProperty({
    example: 'approved'
  })
  approvalStatus: string;
}

export class FilterValuesDto {
  @IsString()
  updaterId: string;

  @IsOptional()
  @IsString()
  auditStatus: string;

  @IsOptional()
  @IsString()
  approvalStatus: string;

  @IsOptional()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  tspId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  auditor: string;

  @IsOptional()
  @IsString()
  assignedStatus: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
