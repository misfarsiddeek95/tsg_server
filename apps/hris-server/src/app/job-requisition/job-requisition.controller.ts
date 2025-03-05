import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { JobRequisitionService } from './job-requisition.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AssignAuditorDto,
  AssignAuditor200Dto,
  CreateJobRequisitionDto,
  CreateJobRequisition200Dto,
  JobRequisitionDto,
  JobRequisition200Dto,
  UpdateAdminApprovalStatusJobReqDto,
  UpdateAdminApprovalStatusJobReq200Dto,
  FetchActiveRm200Dto
} from './job-requisition.dto';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';
import { AccessGuard, Accesses } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('HRIS Table: Job Requisition')
@Controller('job-requisition')
export class JobRequisitionController {
  constructor(private jobRequisitionService: JobRequisitionService) {}

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get()
  @ApiOperation({ summary: 'Fetch Job Requisition Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Job Requisition Table Data',
    type: JobRequisition200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  fetchTableJobRequisition(@Query() query: JobRequisitionDto) {
    return this.jobRequisitionService.fetchTableJobRequisition(query);
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('entry-job-requisition')
  @ApiOperation({
    summary: 'Insert / Update entry job requisition data'
  })
  @ApiBody({ type: CreateJobRequisitionDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Insert / Update entry job requisition data',
    type: CreateJobRequisition200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  async createOrUpdateJobReq(
    @Body() data: CreateJobRequisitionDto,
    @Request() req: any
  ) {
    return await this.jobRequisitionService.createOrUpdateJobReq(
      data,
      req.user.userId
    );
  }

  @Accesses('HR_ADMIN')
  @UseGuards(AccessGuard)
  @Put('/update-admin-approval-status')
  @ApiOperation({ summary: 'Update Approval Status JobReq' })
  @ApiBody({ type: UpdateAdminApprovalStatusJobReqDto })
  @ApiResponse({
    status: 200,
    description: 'Success: Update Approval Status JobReq',
    type: UpdateAdminApprovalStatusJobReq200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  updateAdminApprovalStatus(
    @Body() data: UpdateAdminApprovalStatusJobReqDto,
    @Request() req: any
  ) {
    return this.jobRequisitionService.updateAdminApprovalStatus(
      data,
      req.user.userId
    );
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('assign-auditor')
  @ApiOperation({
    summary: 'Assign candidates to the auditor'
  })
  @ApiBody({ type: AssignAuditorDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Assign candidates to the auditor',
    type: AssignAuditor200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  async assignAuditor(@Body() data: AssignAuditorDto, @Request() req: any) {
    return await this.jobRequisitionService.assignAuditor(
      data,
      req.user.userId
    );
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get('/fetch-active-rms')
  @ApiOperation({
    summary: 'Fetch active RM list'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch active RM list',
    type: FetchActiveRm200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  fetchActiveRms() {
    return this.jobRequisitionService.fetchActiveRms();
  }

  @Get('/fetch-available-auditors')
  @ApiOperation({ summary: 'fetch Available Auditors list' })
  @ApiResponse({
    status: 200,
    description: 'Success: fetch Available Auditors list'
    // type: FetchAvailableAuditors200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  fetchAvailableAuditors() {
    return this.jobRequisitionService.fetchAvailableAuditors();
  }
}
