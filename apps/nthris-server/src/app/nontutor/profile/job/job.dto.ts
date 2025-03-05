import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

export class JobSaveDto {
  @IsOptional()
  @IsString()
  jobProfile: string;

  @IsOptional()
  @IsString()
  jobPosition: string;

  @IsOptional()
  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  department: string;

  @IsOptional()
  @IsString()
  subDepartment: string;

  @IsOptional()
  @IsString()
  team: string;

  @IsOptional()
  @IsString()
  reportingManager: string;

  @IsOptional()
  @IsNumber()
  //@Transform((value) => Number(value))
  tspId: number;

  @IsOptional()
  @IsString()
  epfNumber: string;

  @IsOptional()
  @IsString()
  employmentType: string;

  @IsOptional()
  @IsString()
  payGrade: string;

  @IsOptional()
  @IsString()
  managementLevel: string;

  @IsOptional()
  @IsString()
  departmentLevel: string;

  @IsOptional()
  @IsString()
  bCardStatus: string;

  @IsOptional()
  @IsString()
  bCardUrl: string;

  @IsOptional()
  @IsString()
  basicSalary: string;

  @IsOptional()
  @IsString()
  applicableAllowances: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  shift: string;

  @IsOptional()
  @IsString()
  workHoursType: string;

  @IsOptional()
  @IsString()
  sessionApplicability: string;

  @IsOptional()
  @IsString()
  bCardReceived: string;

  @IsOptional()
  @IsString()
  probationStatus: string;

  @IsOptional()
  @IsString()
  epfNumberRejectReason: string;

  @IsOptional()
  @IsString()
  epfNumberStatus: string;

  @IsOptional()
  @IsString()
  employeeStatus: string;

  @IsOptional()
  @IsString()
  employeeStatusReason: string;

  @IsOptional()
  @IsString()
  gsCertificate: string;

  @IsOptional()
  @IsString()
  pcCertificate: string;

  @IsOptional()
  @IsString()
  dbsReport: string;

  @IsOptional()
  @IsString()
  fbicCertificate: string;

  @IsNumber()
  nonTutorId: number;
}

export class JobDataDto {
  @IsOptional()
  @IsString()
  skip: string;

  @IsOptional()
  @IsString()
  take: string;

  @IsOptional()
  @IsString()
  export2Csv: string;

  @IsString()
  @IsOptional()
  auditStatus: string;

  @IsString()
  @IsOptional()
  approval: string;

  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  tspId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  auditor: string;

  @IsString()
  @IsOptional()
  assignedStatus: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  profileStatus?: string;
}
