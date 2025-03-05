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
import { ReferenceService } from './reference.service';
import {
  AuditorSubmitReferenceDetailsDto,
  ReferenceDataDto
} from './reference.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class ReferenceController {
  constructor(private referenceService: ReferenceService) {}

  @Get('/reference-data')
  @ApiOperation({ summary: 'Fetch Reference Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchReferenceDetails(@Request() req) {
    return this.referenceService.fetchReferenceDetails(req.user.userId);
  }

  @Get('/reference-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Reference Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchReferenceDetailsNT(@Query() query: NTDto) {
    return this.referenceService.fetchReferenceDetails(
      Number(query.nonTutorId)
    );
  }

  @Post('/reference-data')
  @ApiOperation({ summary: 'Save Reference Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveReferenceDetails(@Request() req, @Body() body: ReferenceDataDto) {
    return this.referenceService.saveReferenceDetails(req.user.userId, body);
  }

  @Post('/reference-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Reference Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitReferencesDetails(
    @Request() req,
    @Body() body: AuditorSubmitReferenceDetailsDto
  ) {
    return this.referenceService.auditorSubmitReferenceDetails(
      req.user.userId,
      body
    );
  }
}
