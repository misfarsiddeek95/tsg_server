import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { SummaryService } from './summary.service';
import {
  ActivateProfileDto,
  FinalDecisionDto,
  JobAuditStatusDto,
  ProfileAuditStatusDto,
  RemindSuccessDto,
  RemindUpdateProfileDto,
  SubmitToReviewDto,
  SummaryDataDto,
  UpdateSuccessDto
} from './summary.dto';
import { Common401Dto, CommonErrorDto } from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Summary Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class SummaryController {
  constructor(private summaryService: SummaryService) {}

  @Get('/summary/:tspId')
  @ApiOperation({ summary: 'Fetch Non Tutor Profile Summary' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @ApiOkResponse({ type: SummaryDataDto })
  fetchProfileSummary(@Param('tspId') tspId: number) {
    return this.summaryService.fetchProfileSummary(Number(tspId));
  }

  @Get('/overview/:tspId')
  @ApiOperation({ summary: 'Fetch Non Tutor Profile Summary' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @ApiOkResponse({ type: SummaryDataDto })
  fetchProfileOverview(@Param('tspId') tspId: number) {
    return this.summaryService.fetchProfileOverview(Number(tspId));
  }

  @Get('/audit-status')
  @ApiOperation({ summary: 'Fetch Non Tutor Audit Status' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: SummaryDataDto })
  getAuditStatus(@Request() req) {
    return this.summaryService.getAuditStatus(req.user.userId);
  }

  @Post('/update-job-status')
  @ApiOperation({ summary: 'Update Job Audit Status' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: UpdateSuccessDto })
  @ApiCreatedResponse({
    description: 'Created Response',
    type: UpdateSuccessDto
  })
  updateJobAuditStatus(@Body() params: JobAuditStatusDto) {
    return this.summaryService.updateJobAuditStatus(params);
  }

  @Post('/update-profile-status')
  @ApiOperation({ summary: 'Update Profile Audit Status' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: UpdateSuccessDto })
  @ApiCreatedResponse({
    description: 'Created Response',
    type: UpdateSuccessDto
  })
  updateProfileAuditStatus(@Body() params: ProfileAuditStatusDto) {
    return this.summaryService.updateProfileAuditStatus(params);
  }

  @Post('/remind-profile-update')
  @ApiOperation({ summary: 'Send reminder to update profile' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: RemindSuccessDto })
  @ApiCreatedResponse({
    description: 'Created Response',
    type: RemindSuccessDto
  })
  remindUpdateProfile(@Body() params: RemindUpdateProfileDto) {
    return this.summaryService.remindUpdateProfile(params);
  }

  @Post('/remind-job-audit')
  @ApiOperation({ summary: 'Send reminder to update profile' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: RemindSuccessDto })
  @ApiCreatedResponse({
    description: 'Created Response',
    type: RemindSuccessDto
  })
  remindJobAudit(@Body() params: RemindUpdateProfileDto) {
    return this.summaryService.remindJobAudit(params);
  }

  @Post('/update-final-decision')
  @ApiOperation({ summary: 'Send reminder to update profile' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: ActivateProfileDto })
  @ApiCreatedResponse({
    description: 'Created Response',
    type: ActivateProfileDto
  })
  updateFinalDecision(@Body() params: FinalDecisionDto) {
    return this.summaryService.updateFinalDecision(params);
  }

  @Get('/submit-to-review')
  @ApiOperation({ summary: 'Submit profile to review' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @ApiOkResponse({ type: SummaryDataDto })
  submitToReview(@Request() req) {
    return this.summaryService.submitToReview(req.user.userId);
  }
}
