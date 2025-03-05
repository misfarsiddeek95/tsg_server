import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  isNumber
} from 'class-validator';

export class SummaryDataDto {
  @ApiProperty({
    type: 'string',
    description: 'Profile Audit Status',
    example: 'pending'
  })
  profileAudit: string;

  @ApiProperty({
    type: 'string',
    description: 'Job Audit Status',
    example: 'pending'
  })
  jobAudit: string;

  @ApiProperty({
    type: 'string',
    description: 'Final Decision',
    example: 'pending'
  })
  finalDecision: number;
}

export class JobAuditStatusDto {
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 123
  })
  @IsNumber()
  tspId: number;

  @ApiProperty({
    type: 'string',
    description: 'Job Audit Status',
    example: 'pending'
  })
  @IsString()
  @IsOptional()
  jobAuditStatus: string;

  @ApiProperty({
    type: 'number',
    description: 'Job Audit By',
    example: 123
  })
  @IsNumber()
  jobAuditBy: number;
}

export class ProfileAuditStatusDto {
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 123
  })
  @IsNumber()
  tspId: number;

  @ApiProperty({
    type: 'string',
    description: 'Profile Audit Status',
    example: 'pending'
  })
  @IsString()
  @IsOptional()
  profileAuditStatus: string;

  @ApiProperty({
    type: 'number',
    description: 'Profile Audit By',
    example: 123
  })
  @IsNumber()
  profileAuditBy: number;
}

export class RemindUpdateProfileDto {
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 123
  })
  @IsNumber()
  tspId: number;
}

export class RemindJobAuditDto {
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 123
  })
  @IsNumber()
  tspId: number;
}

export class FinalDecisionDto {
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 123
  })
  @IsNumber()
  tspId: number;

  @ApiProperty({
    type: 'number',
    description: 'updatedBy',
    example: 123
  })
  @IsNumber()
  updatedBy: number;

  @ApiProperty({
    type: 'string',
    description: 'Final Decision',
    example: 'approved'
  })
  finalDecision: string;

  @ApiProperty({
    type: 'string',
    description: 'Final Decision Reason',
    example: 'Invalid documents submitted'
  })
  @IsOptional()
  finalDecisionReason: string;
}

export class SubmitToReviewDto {
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 123
  })
  @IsNumber()
  tspId: number;
}

export class UpdateSuccessDto {}

export class RemindSuccessDto {}

export class ActivateProfileDto {}
