import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ITMasterService } from './it-master.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ITMasterDto, ITMaster200Dto } from './it-master.dto';
import { Accesses, AccessGuard } from '../auth/access.guard';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Table: IT Master View')
@Controller('it-master-view')
export class ITMasterController {
  constructor(private ITMasterService: ITMasterService) {}

  @Accesses('HR_IT', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get()
  @ApiOperation({ summary: 'Fetch IT Master Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch IT Master Table Data',
    type: ITMaster200Dto
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
  async fetchTableItMasterTb(
    @Query() details: ITMasterDto,
    @Request() req: any
  ) {
    return this.ITMasterService.fetchTableItMasterTb(details);
  }
}
