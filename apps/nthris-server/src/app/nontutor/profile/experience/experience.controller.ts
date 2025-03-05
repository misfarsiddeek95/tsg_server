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
import { ExperienceService } from './experience.service';
import {
  AuditorSubmitWorkExperienceDto,
  ExperienceDataDto
} from './experience.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class ExperienceController {
  constructor(private experienceService: ExperienceService) {}

  @Get('/experience-data')
  @ApiOperation({ summary: 'Fetch Experience Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchExperienceDetails(@Request() req) {
    return this.experienceService.fetchExperienceDetails(req.user.userId);
  }

  @Get('/experience-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Experience Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchExperienceDetailsNT(@Query() query: NTDto) {
    return this.experienceService.fetchExperienceDetails(
      Number(query.nonTutorId)
    );
  }

  @Post('/experience-data')
  @ApiOperation({ summary: 'Save Experience Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveExperienceDetails(@Request() req, @Body() body: ExperienceDataDto) {
    return this.experienceService.saveExperienceDetails(req.user.userId, body);
  }

  @Post('/experience-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit work experience details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitWorkExperience(
    @Request() req,
    @Body() body: AuditorSubmitWorkExperienceDto
  ) {
    return this.experienceService.auditorSubmitExperienceDetails(
      req.user.userId,
      body
    );
  }
}
