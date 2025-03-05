import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
  Put
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
import { JobService } from './job.service';
import { JobDataDto, JobSaveDto } from './job.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('/job-data')
  @ApiOperation({ summary: 'Fetch Job Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchJobDetails(@Request() req) {
    return this.jobService.fetchJobDetails(req.user.userId);
  }

  @Get('/job-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Job Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchJobDetailsNT(@Query() query: NTDto) {
    return this.jobService.fetchJobDetails(Number(query.nonTutorId));
  }

  @Post('/job-data')
  @ApiOperation({ summary: 'Save Job Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveJobDetails(@Request() req, @Body() body: JobSaveDto) {
    return this.jobService.saveJobDetails(req.user.userId, body);
  }

  @Put('/jobs-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Job details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  auditorSubmitJobDetails(@Body() body: JobSaveDto, @Request() req) {
    return this.jobService.auditorSubmitJobDetails(req.user.userId, body);
  }
}
