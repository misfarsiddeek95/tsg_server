import { HealthDeclarationService } from './health-declaration.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request
} from '@nestjs/common';
import { AccessGuard, Accesses } from '../auth/access.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  SubmitDetailsDto,
  AuditorSubmitDetailsDto,
  FetchHealthDetailsDto,
  AuditorHealthDetails200Response,
  HealthDetails200Response
} from './health-declaration.dto';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Health Details')
@Controller('health-declaration')
export class HealthDeclarationController {
  constructor(private healthDeclaration: HealthDeclarationService) {}

  @Get()
  @ApiOperation({ summary: 'Tutor: Fetch Health Declaration' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Health Declaration',
    type: FetchHealthDetailsDto
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
    return this.healthDeclaration.fetchDetails(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Tutor: Submit Health Declaration' })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Health Declaration',
    type: HealthDetails200Response
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
  async submitDetails(@Request() req, @Body() body: SubmitDetailsDto) {
    return this.healthDeclaration.submitDetails(req.user.userId, body);
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/auditor')
  @ApiOperation({ summary: 'Auditor: Submit Health Declaration' })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Health Declaration',
    type: AuditorHealthDetails200Response
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
    @Body() body: AuditorSubmitDetailsDto
  ) {
    return this.healthDeclaration.auditorSubmitDetails(req.user.userId, body);
  }
}
