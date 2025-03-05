import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Patch,
  Body,
  Post
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  FilterValuesDto,
  UpdatePendingApprovalsDto
} from './pending-approvals.dto';
import { PendingApprovalsService } from './pending-approvals.service';

@Controller('pending-approvals')
export class PendingApprovalsController {
  constructor(private approvalService: PendingApprovalsService) {}

  @Get('job-requisition-pending-canditates')
  async getJobRequisitionPendingCandidates(
    @Query('updaterId') updaterId: number
  ) {
    return await this.approvalService.getJobRequisitionPendingCandidates(
      updaterId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-job-requisition-status')
  async updateJobReqStatus(
    @Body() approvalStatus: UpdatePendingApprovalsDto,
    @Request() req: any
  ) {
    return await this.approvalService.updateJobReqStatus(
      approvalStatus,
      req.user
    );
  }

  @Get('filter-pending-approvals')
  async filterPendingApprovals(@Query() query: FilterValuesDto) {
    return await this.approvalService.filterPendingApprovals(query);
  }
}
