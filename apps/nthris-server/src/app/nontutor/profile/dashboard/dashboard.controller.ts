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
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardDataDto } from './dashboard.dto';
import { CommonErrorDto, Common401Dto } from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor')
@ApiBearerAuth()
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('/dashboard-data')
  @ApiOperation({ summary: 'Fetch Dashboard Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchDashboardDetails(@Request() req) {
    return this.dashboardService.fetchDashboardDetails(req.user.userId);
  }

  @Get('/home-data')
  @ApiOperation({ summary: 'Fetch Homepage Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchHomeDetails(@Request() req) {
    return this.dashboardService.fetchHomeDetails(req.user.userId);
  }
}
