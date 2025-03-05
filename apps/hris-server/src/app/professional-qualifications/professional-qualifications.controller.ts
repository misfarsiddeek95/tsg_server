import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  UseGuards
} from '@nestjs/common';
import { ProfessionalQualificationsService } from './professional-qualifications.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import {
  SubmitEducationalQualificationsDto,
  SubmitWorkExperienceDto,
  AuditorSubmitEducationalQualificationsDto,
  AuditorSubmitWorkExperienceDto,
  FetchQualificationDetailsDto,
  QualificationDetails200Response,
  FetchWorkExperienceDetailsDto,
  WorkExperienceDetails200Response,
  AuditorQualificationDetails200Response,
  AuditorWorkExperienceDetails200Response
} from './professional-qualifications.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';
import { AccessGuard, Accesses } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Professional Qualifications')
@Controller('professional-qualifications')
export class ProfessionalQualificationsController {
  constructor(
    private professionalQualifications: ProfessionalQualificationsService
  ) {}

  @Get('/educational-qualifications')
  @ApiOperation({ summary: 'Tutor: Fetch Educational Qualifications details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Educational Qualifications Details',
    type: FetchQualificationDetailsDto
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
    return this.professionalQualifications.fetchEducationalQualifications(
      req.user.userId
    );
  }

  @Post('/educational-qualifications')
  @ApiOperation({ summary: 'Tutor: Submit Educational Qualifications details' })
  @ApiBody({ type: SubmitEducationalQualificationsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Educational Qualifications details',
    type: QualificationDetails200Response
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
    @Body() body: SubmitEducationalQualificationsDto
  ) {
    return this.professionalQualifications.submitEducationalQualifications(
      req.user.userId,
      body
    );
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('auditor/educational-qualifications')
  @ApiOperation({
    summary: 'Auditor: Submit Educational Qualifications details'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Educational Qualifications Details',
    type: AuditorQualificationDetails200Response
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
  async auditorSubmitProfessionalQualifications(
    @Request() req,
    @Body() body: AuditorSubmitEducationalQualificationsDto
  ) {
    return this.professionalQualifications.auditorSubmitEducationalQualifications(
      req.user.userId,
      body
    );
  }

  @Get('/work-experience')
  @ApiOperation({ summary: 'Tutor: Fetch Work Experience details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Work Experience Details',
    type: FetchWorkExperienceDetailsDto
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
  async fetchWorkExperience(@Request() req) {
    return this.professionalQualifications.fetchWorkExperience(req.user.userId);
  }

  @Post('/work-experience')
  @ApiOperation({ summary: 'Tutor: Submit Work Experience Details' })
  @ApiBody({ type: SubmitWorkExperienceDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Work Experience Details',
    type: WorkExperienceDetails200Response
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
  async submitWorkExperience(
    @Request() req,
    @Body() body: SubmitWorkExperienceDto
  ) {
    return this.professionalQualifications.submitWorkExperience(
      req.user.userId,
      body
    );
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('auditor/work-experience')
  @ApiOperation({
    summary: 'Auditor: Submit work experience details'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit work experience Details',
    type: AuditorWorkExperienceDetails200Response
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
  async auditorSubmitWorkExperience(
    @Request() req,
    @Body() body: AuditorSubmitWorkExperienceDto
  ) {
    return this.professionalQualifications.auditorSubmitWorkExperience(
      req.user.userId,
      body
    );
  }
}
