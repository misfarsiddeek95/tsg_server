import { AccessGuard, Accesses } from './../auth/access.guard';
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EducationDetailsService } from './education-details.service';

import {
  AuditorEducationDetails200Response,
  AuditorEducationSubmitDetailsDto,
  EducationDetails200Response,
  FetchEducationDetailsDto,
  SubmitEducationDetailsDto
} from './education-details.dto';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Education Details')
@Controller('education-details')
export class EducationDetailsController {
  constructor(private educationDetails: EducationDetailsService) {}

  @Get()
  @ApiOperation({ summary: 'Tutor: Fetch Education Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Education Details',
    type: FetchEducationDetailsDto
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
  async fetchDetails(@Request() request) {
    return this.educationDetails.fetchDetails(request.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Tutor: Submit Education Details' })
  @ApiBody({ type: SubmitEducationDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Education Details',
    type: EducationDetails200Response
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
  async submitDetails(@Request() req, @Body() body: SubmitEducationDetailsDto) {
    return this.educationDetails.submitDetails(req.user.userId, body);
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/auditor')
  @ApiOperation({ summary: 'Auditor: Submit Education Details' })
  @ApiBody({ type: AuditorEducationSubmitDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Education Details',
    type: AuditorEducationDetails200Response
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
    @Body() body: AuditorEducationSubmitDetailsDto
  ) {
    return this.educationDetails.auditorSubmitDetails(req.user.userId, body);
  }
}
