import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PccHistoryService } from './pcc-history.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PCCHistory200Dto, PCCHistoryDto } from './pcc-history.dto';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';
import { Accesses, AccessGuard } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Table: PCC History')
@Controller('pcc-history')
export class PccHistoryController {
  constructor(private PccHistoryService: PccHistoryService) {}

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Fetch PCC History Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch PCC History Table Data',
    type: PCCHistory200Dto
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
  fetchTablePccHistory(@Query() query: PCCHistoryDto) {
    return this.PccHistoryService.fetchTablePccHistory(query);
  }
}
