import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Query,
  Param,
  Put
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditorService } from './auditor.service';
import {
  AuditorMasterViewDto,
  AuditorMasterView200Dto,
  ConfirmAllDto,
  ConfirmAll200Dto,
  SetTutorStatusDto,
  SetTutorStatus200Dto,
  SetTutorEligibilityDto,
  SetTutorEligibility200Dto,
  AuditorFetchCandidate200Dto,
  CheckRehireStatus200Dto,
  FetchEligibilities200Dto
} from './auditor.dto';
import { Accesses, AccessGuard } from '../auth/access.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS: Auditor Landing Table & Auditor actions')
@Controller('auditor')
export class AuditorController {
  constructor(private auditorService: AuditorService) {}

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get('/audit-master-view')
  @ApiOperation({ summary: 'Fetch Auditor Landing Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Auditor Landing Table Data',
    type: AuditorMasterView200Dto
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
  async fetchTableAuditMasterView(
    @Query() details: AuditorMasterViewDto,
    @Request() req: any
  ) {
    return this.auditorService.fetchTableAuditMasterView(
      details,
      +req.user.userId,
      req.accesses
    );
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/confirm-all')
  @ApiOperation({
    summary: 'Audit approve all fields of a section in candidate profile'
  })
  @ApiBody({ type: ConfirmAllDto })
  @ApiResponse({
    status: 201,
    description:
      'Success: Audit approve all fields of a section in candidate profile',
    type: ConfirmAll200Dto
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
  async confirmAll(@Body() body: ConfirmAllDto, @Request() req: any) {
    return this.auditorService.confirmAll(body, req.user.userId);
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get('/candidate-details/:id')
  @ApiOperation({ summary: 'Auditor fetch candidate data for audit' })
  @ApiResponse({
    status: 200,
    description: 'Success: Auditor fetch candidate data for audit',
    type: AuditorFetchCandidate200Dto
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
  async candidateDetails(@Param('id') id: string) {
    return this.auditorService.candidateDetails(+id);
  }

  // @Get('/rejected-field-list/:id')
  // async getRejectedFieldListAuditor(@Param('id') id: string) {
  //   return this.auditorService.getRejectedFieldListAuditor(+id);
  // }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Put('/tutor-status')
  @ApiOperation({ summary: 'Update Tutor Audit Status' })
  @ApiBody({ type: SetTutorStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Success: Update Tutor Audit Status',
    type: SetTutorStatus200Dto
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
  async setTutorStatus(@Body() data: SetTutorStatusDto, @Request() req: any) {
    return this.auditorService.setTutorStatus(data, req.user.userId);
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Put('/eligibility')
  @ApiOperation({ summary: 'Update Tutor Eligibility / Qualification rating' })
  @ApiBody({ type: SetTutorEligibilityDto })
  @ApiResponse({
    status: 200,
    description: 'Success: Update Tutor Eligibility / Qualification rating',
    type: SetTutorEligibility200Dto
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
  async setEligibility(@Body() data: SetTutorEligibilityDto) {
    return this.auditorService.setEligibility(data);
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get('/check-rehire-status/:nic/:tspId')
  @ApiOperation({
    summary: 'Check if candidate is blacklisted or has duplicate nic record'
  })
  @ApiResponse({
    status: 200,
    description:
      'Success: Check if candidate is blacklisted or has duplicate nic record',
    type: CheckRehireStatus200Dto
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
  async checkRehireStatus(
    @Param('nic') nic: string,
    @Param('tspId') tspId: string
  ) {
    return this.auditorService.checkRehireStatus(nic, tspId);
  }

  @Get('/fetch-eligibilities')
  @ApiOperation({ summary: 'Get Eligibilities list' })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Eligibilities list',
    type: FetchEligibilities200Dto
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
  fetchEligibilities() {
    return this.auditorService.fetchEligibilities();
  }
}
