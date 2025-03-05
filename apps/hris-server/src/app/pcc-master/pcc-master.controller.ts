import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PccMasterService } from './pcc-master.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PCCMaster200Dto, PCCMasterDto } from './pcc-master.dto';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';
import { Accesses, AccessGuard } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Table: PCC Master')
@Controller('pcc-master')
export class PccMasterController {
  constructor(private PccMasterService: PccMasterService) {}

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Fetch PCC Master Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch PCC Master Table Data',
    type: PCCMaster200Dto
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
  fetchTablePccMaster(@Query() query: PCCMasterDto) {
    return this.PccMasterService.fetchTablePccMaster(query);
  }
}
