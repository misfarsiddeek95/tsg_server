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
import {
  TeachingInterviewDto,
  TeachingInterviewQueryDto,
  TeachingInterviewListDto
} from './teaching-interview.dto';
import { TeachingInterviewService } from './teaching-interview.service';

@Controller('teaching-interview')
export class TeachingInterviewController {
  constructor(private interviewer: TeachingInterviewService) {}

  @UseGuards(JwtAuthGuard)
  @Get('candidate-details-by-booking-status-4ti')
  async getCandidateDetailsByBookingStatus4ti(
    @Query() query: TeachingInterviewQueryDto
  ) {
    return this.interviewer.getCandidateDetailsByBookingStatus4ti(
      query.bookingStatusId,
      query.accessState,
      query.tiRecordId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit-teaching-interview')
  async submitTeachingInterview(
    @Request() req,
    @Body() body: TeachingInterviewDto
  ) {
    return this.interviewer.submitTeachingInterview(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('ti-list')
  getCandidatesList(
    @Body()
    {
      take,
      skip,
      tspId,
      candiName,
      finalOutcome,
      startDate,
      endDate
    }: TeachingInterviewListDto
  ) {
    return this.interviewer.getTiList(
      take,
      skip,
      tspId,
      candiName,
      finalOutcome,
      startDate,
      endDate
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('export')
  exportTeachingInterview(
    @Query() query: Omit<TeachingInterviewListDto, 'take' | 'skip'>
  ) {
    return this.interviewer.exportTeachingInterview(query);
  }
}
