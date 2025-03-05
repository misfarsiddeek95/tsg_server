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
import { HealthService } from './health.service';
import { AuditorSubmitDetailsDto, HealthDataDto } from './health.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get('/health-data')
  @ApiOperation({ summary: 'Fetch Health Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchHealthDetails(@Request() req) {
    return this.healthService.fetchHealthDetails(req.user.userId);
  }

  @Get('/health-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Health Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchHealthNTDetails(@Query() query: NTDto) {
    return this.healthService.fetchHealthDetails(Number(query.nonTutorId));
  }

  @Post('/health-data')
  @ApiOperation({ summary: 'Save Health Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveHealthDetails(@Request() req, @Body() body: HealthDataDto) {
    return this.healthService.saveHealthDetails(req.user.userId, body);
  }

  @Post('/health-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Health Declaration' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitDetails(
    @Request() req,
    @Body() body: AuditorSubmitDetailsDto
  ) {
    return this.healthService.auditorSubmitDetails(req.user.userId, body);
  }
}
