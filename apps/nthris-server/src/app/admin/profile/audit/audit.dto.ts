import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class AuditDataDto {
  @ApiProperty({
    type: 'number',
    description: 'Id',
    example: 0
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Full Name',
    example: 'Dinesh Nelundeniya'
  })
  fullName: string;

  @ApiProperty({
    type: 'number',
    description: 'TSP Id',
    example: 123
  })
  tspId: string;

  @ApiProperty({
    type: 'string',
    description: 'Designation',
    example: 'Software Engineer'
  })
  designation: string;

  @ApiProperty({
    type: 'string',
    description: 'Status',
    example: 'Active'
  })
  status: string;

  @ApiProperty({
    type: 'string',
    description: 'Status Reason',
    example: 'Pending'
  })
  statusReason: string;

  @ApiProperty({
    type: 'string',
    description: 'Profile Audit',
    example: 'Pending'
  })
  profileAudit: string;

  @ApiProperty({
    type: 'string',
    description: 'Job Audit',
    example: 'Pending'
  })
  jobAudit: string;

  @ApiProperty({
    type: 'string',
    description: 'Final Decision',
    example: 'Pending'
  })
  finalDecision: string;
}

export class AuditSearchDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Full Name',
    example: 'Dinesh Nelundeniya'
  })
  fullName: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP Id',
    example: 123
  })
  tspId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Work Email',
    example: 'dinesh@thirdspaceglobal.com'
  })
  workEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Job Audit Status',
    example: 'complete'
  })
  jobAuditStatus: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Profile Audit Status',
    example: 'complete'
  })
  profileAuditStatus: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Designation',
    example: 'Software Engineer'
  })
  designation: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Date of Submission From',
    example: '08-08-2023'
  })
  dateOfSubmissionFrom: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Date of Submission To',
    example: '08-08-2023'
  })
  dateOfSubmissionTo: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'Page',
    example: '1'
  })
  page: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'Per Page',
    example: '10'
  })
  perPage: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: 'noolean',
    description: 'Export To CSV',
    example: true
  })
  exportToCsv: boolean;
}
