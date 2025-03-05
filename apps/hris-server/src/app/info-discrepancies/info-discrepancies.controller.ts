import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InfoDiscrepanciesService } from './info-discrepancies.service';
import { AllRejectedFields200Dto } from './info-discrepancies.dto';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Feature: Info Discrepancies')
@Controller('info-discrepancies')
export class InfoDiscrepanciesController {
  constructor(private infoDiscrepanciesService: InfoDiscrepanciesService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch Info Discrepancies' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Info Discrepancies',
    type: AllRejectedFields200Dto
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
    return this.infoDiscrepanciesService.allRejectedFields(req.user.userId);
  }
}
