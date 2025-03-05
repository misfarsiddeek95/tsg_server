import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsIn,
  IsOptional,
  IsBoolean
} from 'class-validator';

export class CreateLeaveDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  tspId?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave appication date',
    example: '2023-09-01'
  })
  appliedDate: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'Leave policy',
    example: 1
  })
  leavePolicyId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave duration',
    example: 'Full Day'
  })
  leaveDuration: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave shift',
    example: 'Sri Lanka'
  })
  shift: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave appication from date',
    example: '2023-09-02'
  })
  fromDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'date',
    description: 'Leave appication to date',
    example: '2023-09-04'
  })
  toDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave appication reason',
    example: 'Study leave'
  })
  reason: string;
}

export class CancelLeaveDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'Leave appication ID',
    example: '1234'
  })
  applicationId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Cancel reason',
    example: 'Change of dates'
  })
  cancelReason: string;
}

export class UpdateLeaveDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'Leave appication IDs',
    example: [1, 2, 3]
  })
  applicationIds: number[];

  @IsNumber()
  @IsNotEmpty()
  @IsIn([2, 3, 4, 5])
  @ApiProperty({
    type: 'number',
    description: 'Update action',
    example: 3
  })
  action: number;
}

export class LeaveUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1234
  })
  tspId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'User Name',
    example: 'John Doe'
  })
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'User Email',
    example: 'john@gmail.com'
  })
  userEmail: string;
}

export class LeaveDateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave Date',
    example: '2023-09-01'
  })
  leaveDate: string;
}

export class LeaveApplicationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'ID',
    example: 1
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave application Id',
    example: '123456'
  })
  leaveApplicationId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'TSP Id',
    example: 1
  })
  tspId: number;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    type: 'object',
    description: 'Leave appication user'
  })
  leaveUser: LeaveUserDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave appication date',
    example: '2023-09-01'
  })
  appliedDate: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'Leave type',
    example: 1
  })
  leaveType: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'Leave duration',
    example: 2
  })
  leaveDuration: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'Leave shift',
    example: 3
  })
  shift: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave appication from date',
    example: '2023-09-02'
  })
  fromDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'date',
    description: 'Leave appication to date',
    example: '2023-09-04'
  })
  toDate: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'Number of days applied',
    example: 3
  })
  numOfDays: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Leave appication reason',
    example: 'Study leave'
  })
  reason: string;
}
export class LeaveManagerDto {
  @IsNumber()
  @IsNotEmpty()
  managerId: number;

  @IsString()
  @IsNotEmpty()
  managerName: string;

  @IsEmail()
  @IsNotEmpty()
  managerEmail: string;
}

export class SummaryFilterDto {
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

export class LeaveSummaryDto {}

export class CalendarFilterDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Full Name',
    example: 'Dinesh Nelundeniya'
  })
  fullName: string;
}

export class LeaveCalendarDto {}

export class LeaveCalendarDateDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Date',
    example: '08-08-2023'
  })
  date: string;
}

export class LeaveQuotaDto {
  @IsNumber()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  tspId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  annualAllocated: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  casualAllocated: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  medicalAllocated: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  anpAllocated: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  unpAllocated: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  lieuAllocated: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  specialAllocated: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  maternityAllocated: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: 1
  })
  paternityAllocated: number;
}
