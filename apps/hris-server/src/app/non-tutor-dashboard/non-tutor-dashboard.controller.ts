import { Controller, UseGuards, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { NonTutorDashboardService } from './non-tutor-dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('non-tutor-dashboard')
export class NonTutorDashboardController {
  constructor(private nonTutorDashboardService: NonTutorDashboardService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get Dashboard Data' })
  getDashboardChartData() {
    return this.nonTutorDashboardService.getDashboardChartData();
  }
}
