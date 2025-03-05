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

import { FtAssessmentService } from './ft-assessment.service';
import {
  FtAssessmentListDto,
  SendFtAssessmentFinalEmailDto
} from './ft-assessment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Accesses, AccessGuard } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Essential Skills Assessment')
@Controller('ft-assessment')
export class FtAssessmentController {
  constructor(private ftAssessment: FtAssessmentService) {}

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Get('fetch-ft-assessment-by-booking-id')
  @ApiOperation({
    summary: 'Non-tutor: Fetch Candiate info and foundation training assessment'
  })
  async fetchFtAssessmentByBookingId(@Query() query: any) {
    return this.ftAssessment.fetchFtAssessmentByBookingId(
      query.bsBookingId,
      query.foundationTrainingLevel,
      query.accessState,
      query.esaRecordId
    );
  }

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Post('submit-ft-assessment')
  @ApiOperation({ summary: 'Non-tutor: Submit foundation training assessment' })
  async submitFtAssessment(@Request() req, @Body() body: any) {
    return this.ftAssessment.submitFtAssessment(req.user.userId, body);
  }

  @Accesses('AP_AD')
  @UseGuards(AccessGuard)
  @Post('send-ft-assessment-final-email')
  @ApiOperation({ summary: 'Non-tutor: Trigger final email FTA' })
  async sendFtAssessmentFinalEmail(
    @Request() req,
    @Body() data: SendFtAssessmentFinalEmailDto
  ) {
    return this.ftAssessment.sendFtAssessmentFinalEmail(req.user.userId, data);
  }

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Post('ft-l1-list')
  @ApiOperation({
    summary: 'Non-tutor: Fetch foundation training assessment history table'
  })
  getFtA1List(
    @Body()
    {
      take,
      skip,
      tspId,
      candiName,
      finalOutcome,
      startDate,
      endDate
    }: FtAssessmentListDto
  ) {
    return this.ftAssessment.getFtaList(
      1,
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
  @Post('ft-l2-list')
  @ApiOperation({
    summary: 'Non-tutor: Fetch foundation training assessment history table'
  })
  getFtA2List(
    @Body()
    {
      take,
      skip,
      tspId,
      candiName,
      finalOutcome,
      startDate,
      endDate
    }: FtAssessmentListDto
  ) {
    return this.ftAssessment.getFtaList(
      2,
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
    summary: 'Non-tutor: Export foundation training assessment history table'
  })
  exportFtAssessment(
    @Query() query: Omit<FtAssessmentListDto, 'take' | 'skip'>
  ) {
    return this.ftAssessment.exportFtAssessment(query);
  }
}
