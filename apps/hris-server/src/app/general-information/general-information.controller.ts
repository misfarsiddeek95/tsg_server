import { AccessGuard, Accesses } from './../auth/access.guard';
import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  UseGuards
} from '@nestjs/common';
import { GeneralInformationService } from './general-information.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';
import {
  FetchPersonalDetailsDto,
  SubmitPersonalDetailsDto,
  SubmitContactDetailsDto,
  AuditorSubmitPersonalDetailsDto,
  AuditorSubmitContactDetailsDto,
  PersonalDetails200Response,
  FetchContactDetailsDto,
  ContactDetails200Response,
  AuditorContactDetails200Response,
  AuditorPersonalDetails200Response
} from './general-information.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS General Information')
@Controller('general-information')
export class GeneralInformationController {
  constructor(private generalInformations: GeneralInformationService) {}

  @Get('/personal-information')
  @ApiOperation({ summary: 'Tutor: Fetch Personal Information Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Personal Information Details ',
    type: FetchPersonalDetailsDto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  async fetchDetails(@Request() req) {
    return this.generalInformations.fetchPersonalDetails(req.user.userId);
  }

  @Post('/personal-information')
  @ApiOperation({ summary: 'Tutor: Submit Personal Information Details' })
  @ApiBody({ type: SubmitPersonalDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Personal Details',
    type: PersonalDetails200Response
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  async submitPersonalInformation(
    @Request() req,
    @Body() body: SubmitPersonalDetailsDto
  ) {
    return this.generalInformations.submitPersonalDetails(
      req.user.userId,
      body
    );
  }

  @Get('/contact-information')
  @ApiOperation({ summary: 'Tutor: Fetch Contact Information Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Contact Information Details ',
    type: FetchContactDetailsDto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  async fetchContactDetails(@Request() req) {
    return this.generalInformations.fetchContactDetails(req.user.userId);
  }

  @Post('/contact-information')
  @ApiOperation({ summary: 'Tutor: Submit Contact Information Details' })
  @ApiBody({ type: SubmitContactDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Contact Information Details ',
    type: ContactDetails200Response
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  async submitContactInformation(
    @Request() req,
    @Body() body: SubmitContactDetailsDto
  ) {
    return this.generalInformations.submitContactDetails(req.user.userId, body);
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/personal-information/auditor')
  @ApiOperation({ summary: 'Auditor: Submit Personal Information Details' })
  @ApiBody({ type: AuditorSubmitPersonalDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Personal Information Details',
    type: AuditorPersonalDetails200Response
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  async auditorSubmitDetails(
    @Request() req,
    @Body() body: AuditorSubmitPersonalDetailsDto
  ) {
    return this.generalInformations.auditorSubmitPersonalInformation(
      req.user.userId,
      body
    );
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/contact-information/auditor')
  @ApiOperation({ summary: 'Auditor: Submit Contact Information Details' })
  @ApiBody({ type: AuditorSubmitContactDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Contact Information Details',
    type: AuditorContactDetails200Response
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  async auditorSubmitContactDetails(
    @Request() req,
    @Body() body: AuditorSubmitContactDetailsDto
  ) {
    return this.generalInformations.auditorSubmitContactInformation(
      req.user.userId,
      body
    );
  }
}
