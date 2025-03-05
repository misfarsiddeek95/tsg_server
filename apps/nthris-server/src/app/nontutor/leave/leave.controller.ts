import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { LeaveService } from './leave.service';
import {
  CalendarFilterDto,
  CancelLeaveDto,
  CreateLeaveDto,
  LeaveCalendarDateDto,
  LeaveCalendarDto,
  LeaveQuotaDto,
  LeaveSummaryDto,
  SummaryFilterDto,
  UpdateLeaveDto
} from './leave.dto';
import { Common401Dto, CommonErrorDto } from '../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Leave Endpoint')
@Controller('nontutor/leave')
@ApiBearerAuth()
export class LeaveController {
  constructor(private leaveService: LeaveService) {}

  @Get('/meta-data')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async metaData(@Request() req) {
    return this.leaveService.metaData(Number(req.user.userId));
  }

  @Get('/search-user')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async searchUser(@Request() req) {
    return this.leaveService.searchUser(Number(req.user.userId), req.query.qS);
  }

  @Get('/holidays')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async holidays(@Request() req) {
    return this.leaveService.holidays(Number(req.user.userId));
  }

  @Get('/validate-dates')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async validateDates(@Request() req) {
    return this.leaveService.validateDates(
      Number(req.query.userId),
      Number(req.query.leaveType),
      req.query.leaveDuration,
      req.query.startDate,
      req.query.endDate
    );
  }

  @Get('/self-applications')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async selfApplications(@Request() req) {
    return this.leaveService.selfApplications(Number(req.user.userId));
  }

  @Get('/self-summary')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async selfSummary(@Request() req) {
    return this.leaveService.selfSummary(Number(req.user.userId));
  }

  @Get('/line-managers')
  @ApiOperation({ summary: 'Get Line Managers' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async getLineManager(@Request() req) {
    return this.leaveService.getLineManagers(Number(req.user.userId));
  }

  @Get('/leave-quota')
  @ApiOperation({ summary: 'Get Leave Quota' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async getLeaveQuota(@Request() req) {
    return this.leaveService.getLeaveQuota(Number(req.query.nonTutorId));
  }

  @Post('/leave-quota')
  @ApiOperation({ summary: 'Update Leave Quota' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @ApiOkResponse({ type: LeaveQuotaDto, isArray: false })
  saveLeaveQuota(@Request() req, @Body() params: LeaveQuotaDto) {
    return this.leaveService.saveLeaveQuota(Number(req.user.userId), params);
  }

  @Post('/summary')
  @ApiOperation({ summary: 'Fetch Leave Summary' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @ApiOkResponse({ type: LeaveSummaryDto, isArray: true })
  leaveSummary(@Request() req, @Body() params: SummaryFilterDto) {
    return this.leaveService.leaveSummary(params, Number(req.user.userId));
  }

  @Post('/calendar')
  @ApiOperation({ summary: 'Fetch Leave Calendar' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @ApiOkResponse({ type: LeaveCalendarDto, isArray: true })
  leaveCalendar(@Request() req, @Body() params: CalendarFilterDto) {
    return this.leaveService.leaveCalendar(params, Number(req.user.userId));
  }

  @Post('/calendar/date')
  @ApiOperation({ summary: 'Fetch Leave Calendar by Date' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @ApiOkResponse({ type: LeaveCalendarDto })
  leaveCalendarDate(@Request() req, @Body() params: LeaveCalendarDateDto) {
    return this.leaveService.leaveCalendarDate(params, Number(req.user.userId));
  }

  @Post('/save-application')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async saveApplication(@Request() req, @Body() body: CreateLeaveDto) {
    return this.leaveService.saveApplication(Number(req.user.userId), body);
  }

  @Post('/cancel-application')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async cancelApplication(@Request() req, @Body() body: CancelLeaveDto) {
    return this.leaveService.cancelApplication(Number(req.user.userId), body);
  }

  @Post('/user-applications')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async userApplications(@Body() body: any) {
    return this.leaveService.userApplications(body.params);
  }

  @Post('/update-applications')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async updateApplications(@Body() body: UpdateLeaveDto) {
    return this.leaveService.updateApplications(body);
  }

  @Get('/self-subordinates')
  @ApiOperation({ summary: 'Save Leave Application' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ type: CreateLeaveDto })
  async getSubordinates(@Request() req) {
    return this.leaveService.getSubordinates(Number(req.user.userId));
  }
}
