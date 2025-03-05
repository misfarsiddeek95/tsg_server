import { IsString } from 'class-validator';

export class ActivateProfileByTutorStatusDto {
  @IsString()
  tutorStatus: string;
}

export class DashboardChartDataDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}

export class JobRequisitionCandidateGroupDto {
  @IsString()
  groupName: string;
}

export class JobRequisitionApprovalDto {
  @IsString()
  updatedBy: string;
}

export class PendingApprovalCandidateDetailsDto {
  @IsString()
  hrUserId: string;
}

export class ContractDetailsEntryCandidateDetailsDto {
  @IsString()
  groupName: string;
}
