import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { HrisFiltersService } from './hris-filters.service';
import { BadRequest400Dto, UnauthorizedDto } from '../app.dto';
import {
  FetchActiveAuditors200Dto,
  FetchAssignedAuditors200Dto,
  FetchAuditStatusList00Dto,
  FetchProfileStatusList00Dto,
  SearchTutorByName200Dto
} from './hris-filters.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Filters')
@Controller('hris-filters')
export class HrisFiltersController {
  constructor(private HrisFiltersService: HrisFiltersService) {}

  @ApiBearerAuth()
  @Get('/search-tutor/:name')
  @ApiOperation({ summary: 'Get Search Name list by keyword' })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Search Name list by keyword',
    type: SearchTutorByName200Dto
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
  searchTutorByName(@Param('name') name: string) {
    return this.HrisFiltersService.searchTutorByName(name);
  }

  @ApiBearerAuth()
  @Get('/fetch-active-auditors')
  @ApiOperation({ summary: 'fetch Active Auditors list' })
  @ApiResponse({
    status: 200,
    description: 'Success: fetch Active Auditors list',
    type: FetchActiveAuditors200Dto
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
  fetchActiveAuditors() {
    return this.HrisFiltersService.fetchActiveAuditors();
  }

  @ApiBearerAuth()
  @Get('/fetch-assigned-auditors')
  @ApiOperation({ summary: 'fetch Assigned Auditors list' })
  @ApiResponse({
    status: 200,
    description: 'Success: fetch Assigned Auditors list',
    type: FetchAssignedAuditors200Dto
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
  fetchAssignedAuditors() {
    return this.HrisFiltersService.fetchAssignedAuditors();
  }

  @ApiBearerAuth()
  @Get('/fetch-audit-status')
  @ApiOperation({ summary: 'fetch Audit Status list AKA tutorStatus' })
  @ApiResponse({
    status: 200,
    description: 'Success: fetch Audit Status list AKA tutorStatus',
    type: FetchAuditStatusList00Dto
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
  fetchAuditStatusList() {
    return this.HrisFiltersService.fetchAuditStatusList();
  }

  @ApiBearerAuth()
  @Get('/fetch-profile-status')
  @ApiOperation({ summary: 'fetch Profile Status list' })
  @ApiResponse({
    status: 200,
    description: 'Success: fetch Profile Status list',
    type: FetchProfileStatusList00Dto
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
  fetchProfileStatusList() {
    return this.HrisFiltersService.fetchProfileStatusList();
  }
}
