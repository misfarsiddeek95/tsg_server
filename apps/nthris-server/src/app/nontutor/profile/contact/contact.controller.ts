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
import { ContactService } from './contact.service';
import {
  AuditorSubmitContactDetailsDto,
  SaveContactDataDto
} from './contact.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get('/contact-data')
  @ApiOperation({ summary: 'Fetch Contact Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchContactDetails(@Request() req) {
    return this.contactService.fetchContactDetails(req.user.userId);
  }

  @Get('/contact-data-audit')
  @ApiOperation({ summary: 'Fetch Non Tutor Contact Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async fetchContactDetailsNT(@Query() query: NTDto) {
    return this.contactService.fetchContactDetails(Number(query.nonTutorId));
  }

  @Post('/contact-data')
  @ApiOperation({ summary: 'Save Contact Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async saveContactDetails(@Request() req, @Body() body: SaveContactDataDto) {
    return this.contactService.saveContactDetails(req.user.userId, body);
  }

  @Post('/contact-data-audit')
  @ApiOperation({ summary: 'Auditor: Submit Contact Details' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  async auditorSubmitContactDetails(
    @Request() req,
    @Body() body: AuditorSubmitContactDetailsDto
  ) {
    return this.contactService.auditorSubmitContactDetails(
      req.user.userId,
      body
    );
  }
}
