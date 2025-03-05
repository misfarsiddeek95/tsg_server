import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardDataDto, HomeDataDto } from './dashboard.dto';
import { Common401Dto, CommonErrorDto } from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor')
@ApiBearerAuth()
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Fetch Dashboard Details' })
  @ApiOkResponse({ description: 'OK Response', type: DashboardDataDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @Get('/dashboard-data')
  async fetchDashboardDetails(@Request() req) {
    return this.dashboardService.fetchDashboardDetails(req.user.userId);
  }

  @ApiOperation({ summary: 'Fetch Homepage Details' })
  @ApiOkResponse({ description: 'OK Response', type: HomeDataDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @Get('/home-data')
  async fetchHomeDetails(@Request() req) {
    return this.dashboardService.fetchHomeDetails(req.user.userId);
  }
}
