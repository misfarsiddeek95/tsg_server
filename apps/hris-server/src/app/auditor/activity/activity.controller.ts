import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AccessGuard, Accesses } from '../../auth/access.guard';
import {
  BadRequest400Dto,
  UnauthorizedDto,
  Forbidden403Dto
} from '../../app.dto';
import {
  GetAuditorActivities200Dto,
  GetAuditorChartData200Dto
} from './activity.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS: Auditor Sidebar fetching data')
@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Accesses('HR_IT', 'AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get Auditor Activities Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Auditor Activities Details',
    type: GetAuditorActivities200Dto
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
  getActivityDetails(@Request() request: any) {
    return this.activityService.getAuditorActivities(+request.user.userId);
  }

  @Accesses('HR_IT', 'AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get('chart-data')
  @ApiOperation({ summary: 'Get Auditor Chart Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Auditor Chart Data',
    type: GetAuditorChartData200Dto
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
  getChartData(@Request() req: any) {
    return this.activityService.getAuditorChartData(+req.user.userId);
  }
}
