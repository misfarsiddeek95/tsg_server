import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  EditHistoryMaster200Dto,
  EditHistoryMasterDto
} from './EditHistoryMaster.dto';
import { EditHistoryMasterService } from './edit-history-master.service';
import { AccessGuard, Accesses } from '../auth/access.guard';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Table: Edit History Master')
@Controller('edit-history-master')
export class EditHistoryMasterController {
  constructor(private editHistoryMaster: EditHistoryMasterService) {}

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Fetch Edit History Master Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Job Requisition Table Data',
    type: EditHistoryMaster200Dto
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
  fetchTableEditHitoryMaster(@Query() query: EditHistoryMasterDto) {
    return this.editHistoryMaster.fetchTableEditHitoryMaster(query);
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get('/section-history/:tspId/:section')
  async fetchCandidateSectionHistory(
    @Param('tspId') tspId: string,
    @Param('section') section: string
  ) {
    return this.editHistoryMaster.fetchCandidateSectionHistory(+tspId, section);
  }
}
