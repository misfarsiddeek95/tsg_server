import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';

import { CandidateLevel } from '../services/candidate-level.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  AllBookingSlot400Dto,
  CandidateLevel201Dto,
  CandidateLevelSlotDto
} from '../dtos/candidate-level.dto';
import { Unauthorized401Dto } from '../dtos/bad-request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Candidate Level Controller')
@Controller('user')
export class CandidateLevelController {
  constructor(private candidateLevelService: CandidateLevel) {}

  //TODO:bk to check
  @Post('/candidate-level')
  @ApiOperation({ summary: 'Submit Candidate Level' })
  @ApiResponse({
    status: 201,
    type: CandidateLevel201Dto
  })
  @ApiResponse({
    status: 400,
    type: AllBookingSlot400Dto
  })
  @ApiResponse({
    status: 401,
    type: Unauthorized401Dto
  })
  getInterviewSlot(
    @Body() candidateLevDetails: CandidateLevelSlotDto,
    @Request() req: any
  ) {
    return this.candidateLevelService.getCandidateLevel(candidateLevDetails);
  }
}
