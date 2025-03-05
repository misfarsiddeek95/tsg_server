import { Accesses, AccessGuard } from '../auth/access.guard';
import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  Query
} from '@nestjs/common';
import { GraApplicationService } from './gra-application.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  BadRequest400Dto,
  Forbidden403Dto,
  UnauthorizedDto
} from '../user/dtos/app.dto';
import {
  AllRemainingFieldsApplication200Dto,
  EducationalQualification200Response,
  FetchEducationalQualificationDto,
  FetchGraSessionAvailabilityDto,
  FetchPersonalContactInfoDto,
  PersonalContactInfo200Response,
  SessionAvailability200Response,
  SubmitEducationalQualificationDto,
  SubmitPersonalContactInfoDto,
  SubmitSessionAvailabilityDto,
  TutorSubmitApplication200Dto
} from './gra-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('GRA Application')
@Controller('gra-application')
export class GraApplicationController {
  constructor(private graApplication: GraApplicationService) {}

  @Get('/personal-contact-info')
  @ApiOperation({ summary: 'Candidate: Fetch Personal Contact Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Candidate: Fetch Personal Contact Details',
    type: FetchPersonalContactInfoDto
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
  async fetchPersonalContactInfo(@Request() req) {
    return this.graApplication.fetchPersonalContactInfo(req.user.userId);
  }

  @Post('/personal-contact-info')
  @ApiOperation({ summary: 'Candidate: Submit Personal Contact Details' })
  @ApiBody({ type: SubmitPersonalContactInfoDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Candidate: Submit Personal Contact Details',
    type: PersonalContactInfo200Response
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
  async submitPersonalContactInfo(
    @Request() req,
    @Body() body: SubmitPersonalContactInfoDto
  ) {
    return this.graApplication.submitPersonalContactInfo(req.user.userId, body);
  }

  @Get('/educational-qualification')
  @ApiOperation({
    summary: 'Candidate: Fetch Educational Qualification Details'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Candidate: Fetch Educational Qualification Details',
    type: FetchEducationalQualificationDto
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
  async fetchEducationalQualification(@Request() req) {
    return this.graApplication.fetchEducationalQualification(req.user.userId);
  }

  @Post('/educational-qualification')
  @ApiOperation({
    summary: 'Candidate: Submit Educational Qualification Details'
  })
  @ApiBody({ type: SubmitEducationalQualificationDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Candidate: Submit Educational Qualification Details',
    type: EducationalQualification200Response
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
  async submitEducationalQualification(
    @Request() req,
    @Body() body: SubmitEducationalQualificationDto
  ) {
    return this.graApplication.submitEducationalQualification(
      req.user.userId,
      body
    );
  }

  @Get('/session-availability')
  @ApiOperation({ summary: 'Candidate: Fetch Session Slots Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Candidate: Fetch Session  Slots Details',
    type: FetchGraSessionAvailabilityDto
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
  async fetchGraSessionAvailability(@Request() req) {
    return this.graApplication.fetchGraSessionAvailability(req.user.userId);
  }

  @Post('/session-availability')
  @ApiOperation({
    summary: 'Candidate: Submit Session Availability'
  })
  @ApiBody({ type: SubmitSessionAvailabilityDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Candidate: Submit Session Availability',
    type: SessionAvailability200Response
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
  async submitGraSessionAvailability(
    @Request() req,
    @Body() body: SubmitSessionAvailabilityDto
  ) {
    return this.graApplication.submitGraSessionAvailability(
      req.user.userId,
      body
    );
  }

  @Get('/submit-application')
  @ApiOperation({ summary: 'Tutor: Submit Application for review' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Submit Application for review',
    type: TutorSubmitApplication200Dto
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
  submitApplication(@Request() req) {
    return this.graApplication.submitApplication(req.user.userId);
  }

  @Get('/remaining-fields-application')
  @ApiOperation({ summary: 'Fetch Remaining Fields' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Remaining Fields',
    type: AllRemainingFieldsApplication200Dto
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
  async fetchDetails(@Request() req) {
    return this.graApplication.remainingFieldsApplication(req.user.userId);
  }

  @Accesses('AP_INT', 'AP_AD', 'CP', 'CP_AD')
  @UseGuards(AccessGuard)
  @Get('/non-tutor-personal-contact-info')
  @ApiOperation({ summary: 'Non-Tutor: Fetch Personal Contact Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Non-Tutor: Fetch Personal Contact Details',
    type: FetchPersonalContactInfoDto
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
  async fetchNonTutorPersonalContactInfo(@Query('userId') userId: string) {
    return this.graApplication.fetchPersonalContactInfo(Number(userId));
  }

  @Accesses('AP_INT', 'AP_AD', 'CP', 'CP_AD')
  @UseGuards(AccessGuard)
  @Get('/non-tutor-educational-qualification')
  @ApiOperation({
    summary: 'Non-Tutor: Fetch Educational Qualification Details'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Non-Tutor: Fetch Educational Qualification Details',
    type: FetchEducationalQualificationDto
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
  async fetchNonTutorEducationalQualification(@Query('userId') userId: string) {
    return this.graApplication.fetchEducationalQualification(Number(userId));
  }

  @Accesses('AP_INT', 'AP_AD', 'CP', 'CP_AD')
  @UseGuards(AccessGuard)
  @Get('/non-tutor-session-availability')
  @ApiOperation({ summary: 'Non-Tutor: Fetch Session Slots Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Non-Tutor: Fetch Session  Slots Details',
    type: FetchGraSessionAvailabilityDto
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
  async fetchNonTutorGraSessionAvailability(@Query('userId') userId: string) {
    return this.graApplication.fetchGraSessionAvailability(Number(userId));
  }
}
