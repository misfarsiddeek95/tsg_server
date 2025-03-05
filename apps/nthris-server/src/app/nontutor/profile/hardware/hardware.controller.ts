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
import { HardwareService } from './hardware.service';
import { HardwareDataDto, AuditorSubmitDetailsDto } from './hardware.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class HardwareController {
  constructor(private hardwareService: HardwareService) {}

  @Get('/hardware-data')
  @ApiOperation({ summary: 'Fetch Hardware Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchHardwareDetails(@Request() req) {
    return this.hardwareService.fetchHardwareDetails(req.user.userId);
  }

  @Get('/hardware-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Hardware Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchHardwareDetailsNT(@Query() query: NTDto) {
    return this.hardwareService.fetchHardwareDetails(Number(query.nonTutorId));
  }

  @Post('/hardware-data')
  @ApiOperation({ summary: 'Save Hardware Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveHardwareDetails(@Request() req, @Body() body: HardwareDataDto) {
    return this.hardwareService.saveHardwareDetails(req.user.userId, body);
  }

  @Post('/hardware-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Hardware Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitDetails(
    @Request() req,
    @Body() body: AuditorSubmitDetailsDto
  ) {
    return this.hardwareService.auditorSubmitDetails(req.user.userId, body);
  }
}
