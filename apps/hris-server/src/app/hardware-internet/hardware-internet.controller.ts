import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param
} from '@nestjs/common';
import { AccessGuard, Accesses } from '../auth/access.guard';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';
import { HardwareInternetService } from './hardware-internet.service';
import {
  AuditorItSubmitDetailsDto,
  HardwareDetails200Response,
  FetchHardwareDetailsDto,
  SubmitItDetailsDto,
  AuditorItDetails200Response,
  AuditorDetailsData200Dto
} from './hardware-internet.dto';
@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Hardware Details')
@Controller('hardware-internet')
export class HardwareInternetController {
  constructor(private hardwareInternet: HardwareInternetService) {}

  @Get()
  @ApiOperation({ summary: 'Tutor: Fetch It Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch IT Details',
    type: FetchHardwareDetailsDto
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
    return this.hardwareInternet.fetchDetails(req.user.userId);
  }

  @Get('/candidate-details-4it/:id')
  @ApiOperation({ summary: 'Tutor: Fetch Candidate It Details' })
  async candidateDetails(@Param('id') id: string) {
    return this.hardwareInternet.fetchDetails(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Tutor: Submit It Details' })
  @ApiBody({ type: SubmitItDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit It Details',
    type: HardwareDetails200Response
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
  async submitDetails(@Request() req, @Body() body: SubmitItDetailsDto) {
    return this.hardwareInternet.submitDetails(req.user.userId, body);
  }

  @Accesses('HR_IT', 'AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/auditor')
  @ApiOperation({ summary: 'Auditor: Submit It Details' })
  @ApiBody({ type: AuditorItSubmitDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit It Details',
    type: AuditorItDetails200Response
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
    @Body() body: AuditorItSubmitDetailsDto
  ) {
    return this.hardwareInternet.auditorSubmitDetails(req.user.userId, body);
  }

  // @Accesses('HR_IT', 'AUDITOR', 'HR_ADMIN', 'HR_USER')
  // @UseGuards(AccessGuard)
  @Post('/auditor-fields-data')
  @ApiOperation({ summary: 'Auditor: Get Auditor Fields Meta Data' })
  @ApiResponse({
    status: 200,
    description: 'success response',
    type: AuditorDetailsData200Dto
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
  async auditorFieldsAudit() {
    return this.hardwareInternet.auditorFieldsAudit();
  }
}
