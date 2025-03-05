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
import { PersonalService } from './personal.service';
import {
  AuditorSubmitPersonalDetailsDto,
  PersonalDataDto,
  SaveBioDto
} from './personal.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class PersonalController {
  constructor(private personalService: PersonalService) {}

  @Get('/personal-data')
  @ApiOperation({ summary: 'Fetch Personal Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchPersonalDetails(@Request() req) {
    return this.personalService.fetchPersonalDetails(req.user.userId);
  }

  @Get('/personal-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Personal Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchPersonalDetailsNT(@Query() query: NTDto) {
    return this.personalService.fetchPersonalDetails(Number(query.nonTutorId));
  }

  @Post('/personal-data')
  @ApiOperation({ summary: 'Save Personal Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async savePersonalDetails(@Request() req, @Body() body: PersonalDataDto) {
    return this.personalService.savePersonalDetails(req.user.userId, body);
  }

  @Post('/save-bio')
  @ApiOperation({ summary: 'Save Personal Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveBio(@Request() req, @Body() body: SaveBioDto) {
    return this.personalService.saveBio(req.user.userId, body);
  }

  @Get('/get-bio')
  @ApiOperation({ summary: 'Get Non Tutor Bio' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async getBio(@Request() req) {
    return this.personalService.getBio(req.user.userId);
  }

  @Post('/personal-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Personal Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitDetails(
    @Request() req,
    @Body() body: AuditorSubmitPersonalDetailsDto
  ) {
    return this.personalService.auditorSubmitPersonalDetails(
      Number(req.user.userId),
      body
    );
  }
}
