import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RecruitmentMasterDto {
  take: number;

  skip: number;

  @IsOptional()
  @IsString()
  tspId: string;

  @IsOptional()
  @IsString()
  candiName: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class AssignToBatchDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    required: true,
    type: [Number],
    description: 'array of tspIds',
    example: [2, 5]
  })
  tspIds: number[];

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'batchName',
    example: '44B'
  })
  batchName: string;
}

export class CreateNewBatchDto {
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'batchName',
    example: '44B'
  })
  batchName: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'batchActive',
    example: 111
  })
  batchActive: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'teamLeadTspId',
    example: 111
  })
  teamLeadTspId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'teamLeadName',
    example: 'Jamses Mac'
  })
  teamLeadName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'trainingBrief1Date',
    example: '2022-01-01'
  })
  trainingBrief1Date: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'trainingBrief1Time',
    example: '15:00'
  })
  trainingBrief1Time: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'trainingBrief1Link',
    example: 'www.google.com'
  })
  trainingBrief1Link: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'level1StandupCallDate',
    example: '2022-01-01'
  })
  level1StandupCallDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'level2StandupCallDate',
    example: '2022-01-01'
  })
  level2StandupCallDate: string;
}

export class UpdateCandidateTrainingStatusDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'tspId',
    example: 2
  })
  tspId: number;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'trainingStatus',
    example: 'On hold'
  })
  trainingStatus: string;
}
