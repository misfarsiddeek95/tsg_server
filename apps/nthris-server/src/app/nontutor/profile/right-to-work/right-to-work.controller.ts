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
import { RightToWorkService } from './right-to-work.service';
import {
  AuditorSubmitRightToWorkDetailsDto,
  RightToWorkDataDto
} from './right-to-work.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class RightToWorkController {
  constructor(private rightToWorkService: RightToWorkService) {}

  @Get('/right-to-work-data')
  @ApiOperation({ summary: 'Fetch Right To Work Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ description: 'OK Response', type: AuditDataDto })
  async fetchRightToWorkDetails(@Request() req) {
    return this.rightToWorkService.fetchRightToWorkDetails(req.user.userId);
  }

  @Get('/right-to-work-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Right To Work Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  //@ApiOkResponse({ description: 'OK Response', type: AuditDataDto })
  async fetchRightToWorkDetailsNT(@Query() query: NTDto) {
    return this.rightToWorkService.fetchRightToWorkDetails(
      Number(query.nonTutorId)
    );
  }

  @Post('/right-to-work-data')
  @ApiOperation({ summary: 'Save Right To Work Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveRightToWorkDetails(
    @Request() req,
    @Body() body: RightToWorkDataDto
  ) {
    return this.rightToWorkService.saveRightToWorkDetails(
      req.user.userId,
      body
    );
  }

  @Post('/right-to-work-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Right To Work Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitRightToWorkDetails(
    @Request() req,
    @Body() body: AuditorSubmitRightToWorkDetailsDto
  ) {
    return this.rightToWorkService.auditorSubmitRightToWorkDetails(
      req.user.userId,
      body
    );
  }
}
