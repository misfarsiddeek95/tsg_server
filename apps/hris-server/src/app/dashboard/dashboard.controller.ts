import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Body,
  Post
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  TutorSubmitProfile200Dto,
  DashboardAssignedCandidatesDto,
  DashboardAssignedCandidates200Dto,
  GetProfileStatus200Dto,
  GetProfileSubmitStatus200Dto
} from './dashboard.dto';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS: Dashboard APIs')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @ApiBearerAuth()
  @Get('/submit-profile')
  @ApiOperation({ summary: 'Tutor: Submit Profile for review' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Submit Profile for review',
    type: TutorSubmitProfile200Dto
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
  submitProfile(@Request() req) {
    return this.dashboardService.submitProfile(req.user.userId);
  }

  @Get('get-hr-users')
  async getHrUsers(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return await this.dashboardService.getHrUsers(startDate, endDate);
  }

  @ApiBearerAuth()
  @Get('/profile-submit-status')
  @ApiOperation({ summary: 'Get Profile Submit Status' })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Profile Submit Status',
    type: GetProfileSubmitStatus200Dto
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
  getProfileSubmitStatus(@Request() req) {
    return this.dashboardService.getProfileSubmitStatus(+req.user.userId);
  }

  @ApiBearerAuth()
  @Get('/profile-status')
  @ApiOperation({ summary: 'Get Profile Status' })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Profile Status',
    type: GetProfileStatus200Dto
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
  getProfileStatus(@Request() req) {
    return this.dashboardService.getProfileStatus(+req.user.userId);
  }

  @ApiBearerAuth()
  @Post('/assigned-candidates')
  @ApiOperation({ summary: 'Get Assigned Candidates' })
  @ApiBody({ type: DashboardAssignedCandidatesDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Get Assigned Candidates',
    type: DashboardAssignedCandidates200Dto
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
  fetchAssignedCandidates(@Body() query: DashboardAssignedCandidatesDto) {
    return this.dashboardService.getAssignedCandidateListByAuditor(query);
  }
}
