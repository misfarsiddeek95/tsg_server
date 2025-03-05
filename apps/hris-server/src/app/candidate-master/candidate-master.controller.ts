import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Get, UseGuards, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CandidateMasterDto } from './candidateMaster.dto';
import { CandidateMasterService } from './candidate-master.service';

@Controller('hris-candidate-master')
export class CandidateMasterController {
  constructor(private CandidateMasterService: CandidateMasterService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Fetch HRIS Candidate Master Table Data' })
  getHrisCandidateMasterData(@Query() query: CandidateMasterDto) {
    return this.CandidateMasterService.getHrisCandidateMasterData(query);
  }
}
