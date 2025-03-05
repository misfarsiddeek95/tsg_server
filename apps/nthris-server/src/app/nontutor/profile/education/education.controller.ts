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
import { EducationService } from './education.service';
import { AuditorSubmitDetailsDto, EducationDataDto } from './education.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class EducationController {
  constructor(private educationService: EducationService) {}

  @Get('/education-data')
  @ApiOperation({ summary: 'Fetch Education Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchEducationDetails(@Request() req) {
    return this.educationService.fetchEducationDetails(
      req.query.nonTutorId ? Number(req.query.nonTutorId) : req.user.userId
    );
  }

  @Get('/education-data-audit')
  @ApiOperation({ summary: 'Fetch Education Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchContactDetailsNT(@Query() query: NTDto) {
    return this.educationService.fetchEducationDetails(
      Number(query.nonTutorId)
    );
  }

  @Post('/education-data')
  @ApiOperation({ summary: 'Save Education Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveEducationDetails(@Request() req, @Body() body: EducationDataDto) {
    return this.educationService.saveEducationDetails(req.user.userId, body);
  }

  @Post('/education-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Education Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitDetails(
    @Request() req,
    @Body() body: AuditorSubmitDetailsDto
  ) {
    return this.educationService.auditorSubmitEducationDetails(
      req.user.userId,
      body
    );
  }
}
