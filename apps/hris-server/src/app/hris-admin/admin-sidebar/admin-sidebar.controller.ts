import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { AdminSidebarService } from './admin-sidebar.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ActivateProfileByTutorStatusDto,
  ContractDetailsEntryCandidateDetailsDto,
  DashboardChartDataDto,
  JobRequisitionApprovalDto,
  JobRequisitionCandidateGroupDto,
  PendingApprovalCandidateDetailsDto
} from './admin-sidebar.dto';

@Controller('admin-sidebar')
export class AdminSidebarController {
  constructor(private adminSideBarService: AdminSidebarService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('count-by-tutor-status')
  @ApiOperation({ summary: 'Get Profile Activation Data by Tutor Status' })
  getCountByTutorStatus() {
    return this.adminSideBarService.getCountByTutorStatus();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('activate-profiles-by-tutor-status')
  @ApiOperation({ summary: 'Activate Profiles by Tutor Status' })
  activateProfilesByTutorStatus(
    @Body() { tutorStatus }: ActivateProfileByTutorStatusDto
  ) {
    return this.adminSideBarService.activateProfilesByTutorStatus(tutorStatus);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-count-by-entry-job-requisition')
  @ApiOperation({ summary: 'Get Entry Job Requisition Data by Date' })
  getCountByEntryJobRequisition() {
    return this.adminSideBarService.getCountByEntryJobRequisition();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-dashboard-chart-data')
  @ApiOperation({ summary: 'Get Dashboard Chart Data' })
  getDashboardChartData(
    @Query() { startDate, endDate }: DashboardChartDataDto
  ) {
    return this.adminSideBarService.getTutorProfileStatus(startDate, endDate);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-job-requisition-candidate-group')
  @ApiOperation({ summary: 'Get Job Requisition Candidate Group Data' })
  getJobRequisitionCandidateGroup(
    @Query() { groupName }: JobRequisitionCandidateGroupDto
  ) {
    return this.adminSideBarService.getEntryJobRequisitionUserGroupData(
      groupName
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-pending-approvals-data')
  @ApiOperation({ summary: 'Get Pending Approvals Data' })
  getPendingApprovalsData() {
    return this.adminSideBarService.getPendingApprovalsCountByHrUser();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('approve-job-requisitions-by-hrUser')
  @ApiOperation({ summary: 'Approve Job Requisitions by HR User' })
  approveJobRequisitionsByHrUser(
    @Body() { updatedBy }: JobRequisitionApprovalDto,
    @Request() req: any
  ) {
    return this.adminSideBarService.pendingApprovalByHrUsers(
      updatedBy,
      req.user.userId
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-contract-details-entry-count')
  @ApiOperation({ summary: 'Get Contract Details entry Count' })
  getContractDetailsEntryCount() {
    return this.adminSideBarService.getCountByContractDetailsEntry();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-pending-approval-candidate-details')
  @ApiOperation({ summary: 'Get Pending Approval Candidate Details' })
  getPendingApprovalCandidateDetails(
    @Query() { hrUserId }: PendingApprovalCandidateDetailsDto
  ) {
    return this.adminSideBarService.getPendingApprovalCandidateData(hrUserId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-contract-details-entry-candidate-details')
  @ApiOperation({ summary: 'Get Contract Details Entry Candidate Details' })
  getContractDetailsEntryCandidateDetails(
    @Query() { groupName }: ContractDetailsEntryCandidateDetailsDto
  ) {
    return this.adminSideBarService.getContractDetailsEntryCandidateList(
      groupName
    );
  }
}
