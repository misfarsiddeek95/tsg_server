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
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { QualificationService } from './qualification.service';
import {
  AuditorSubmitQualificationsDto,
  QualificationDataDto
} from './qualification.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class QualificationController {
  constructor(private qualificationService: QualificationService) {}

  @Get('/qualification-data')
  @ApiOperation({ summary: 'Fetch Qualification Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchQualificationDetails(@Request() req) {
    return this.qualificationService.fetchQualificationDetails(req.user.userId);
  }

  @Get('/qualification-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Qualification Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchQualificationDetailsNT(@Query() query: NTDto) {
    return this.qualificationService.fetchQualificationDetails(
      Number(query.nonTutorId)
    );
  }

  @Post('/qualification-data')
  @ApiOperation({ summary: 'Save Qualification Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveQualificationDetails(
    @Request() req,
    @Body() body: QualificationDataDto
  ) {
    return this.qualificationService.saveQualificationDetails(
      req.user.userId,
      body
    );
  }

  @Post('qualification-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Qualifications details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitQualifications(
    @Request() req,
    @Body() body: AuditorSubmitQualificationsDto
  ) {
    return this.qualificationService.auditorSubmitQualificationDetails(
      req.user.userId,
      body
    );
  }
}
