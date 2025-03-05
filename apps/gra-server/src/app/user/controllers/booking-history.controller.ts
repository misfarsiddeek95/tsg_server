import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Query
} from '@nestjs/common';
import { BookingHistoryService } from '../services/booking-history.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  CreateBookingHistoryDto,
  FetchCandidateBookingStatusResponseDto
} from '../dtos/booking-history.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { BadRequest400Dto, Unauthorized401Dto } from '../dtos/bad-request.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('APSS Booking History Controller')
@Controller('user')
export class BookingHistoryController {
  constructor(private bookingHistoryService: BookingHistoryService) {}

  @Post('/booking-history')
  @ApiOperation({ summary: 'Submit Booking History' })
  postBookingHistoryDetails(
    @Body() bookingHistoryDetails: CreateBookingHistoryDto,
    @Request() req: any
  ) {
    return this.bookingHistoryService.bookingHistoryDetails(
      bookingHistoryDetails,
      req.user.userId
    );
  }

  @Get('candidate-booking-status')
  @ApiOperation({
    summary:
      'APSS: candidate/admin: Check whether a candidate have already booked interview slot'
  })
  @ApiResponse({
    status: 200,
    description: 'Check whether a candidate have already booked interview slot',
    type: FetchCandidateBookingStatusResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: Unauthorized401Dto
  })
  fetchCandidateBookingStatus(
    @Query('candidateId') candidateId: string,
    @Query('level') level: string
  ) {
    return this.bookingHistoryService.fetchCandidateBookingStatus(
      candidateId,
      +level
    );
  }
}
