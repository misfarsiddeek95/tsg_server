import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { InitialAssessmentService } from './initial-assessment.service';
import { InitialAssessmentListDto } from './initial-assessment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Accesses, AccessGuard } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Essential Skills Assessment')
@Controller('initial-assessment')
export class InitialAssessmentController {
  constructor(private initialAssessment: InitialAssessmentService) {}

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Get('fetch-initial-assessment-by-booking-id')
  @ApiOperation({
    summary: 'Non-tutor: Fetch Candiate info and initial assessment'
  })
  async fetchInitialAssessmentByBookingId(@Query() query: any) {
    return this.initialAssessment.fetchInitialAssessmentByBookingId(
      query.bsBookingId,
      query.accessState,
      query.esaRecordId
    );
  }

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Post('submit-initial-assessment')
  @ApiOperation({ summary: 'Non-tutor: Submit initial assessment' })
  async submitInitialAssessment(@Request() req, @Body() body: any) {
    return this.initialAssessment.submitInitialAssessment(
      req.user.userId,
      body
    );
  }

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Post('esa-list')
  @ApiOperation({
    summary: 'Non-tutor: Fetch initial assessment history table'
  })
  getEsaList(
    @Body()
    {
      take,
      skip,
      tspId,
      candiName,
      finalOutcome,
      startDate,
      endDate
    }: InitialAssessmentListDto
  ) {
    return this.initialAssessment.getEsaList(
      take,
      skip,
      tspId,
      candiName,
      finalOutcome,
      startDate,
      endDate
    );
  }

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Get('export')
  @ApiOperation({
    summary: 'Non-tutor: Export initial assessment history table'
  })
  exportInitialAssessment(
    @Query() query: Omit<InitialAssessmentListDto, 'take' | 'skip'>
  ) {
    return this.initialAssessment.exportInitialAssessment(query);
  }
}
