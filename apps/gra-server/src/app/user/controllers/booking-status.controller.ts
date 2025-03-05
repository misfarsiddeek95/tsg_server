import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Put
} from '@nestjs/common';
import { BookingStatusService } from '../services/booking-status.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  BookingStatusResponseDto,
  CreateBookingStatusDto,
  GetCandidateBookingStatus200Dto,
  GetInterviewerContractDetailsDto,
  GetInterviewerContractDetailsResponseDto,
  InterviewerContractUpdateDto,
  InterviewerContractUpdateResponseDto,
  InterviewerTimeTableFetchDto,
  InterviewerTimeTableFetchDailyResponseDto,
  InterviewerTimeTableDailyExportResponseDto,
  InterviewerTimeTableFetchWeeklyResponseDto,
  InterviewerTimeTableFetchWeeklyExportResponseDto,
  GetRescheduleCountDto,
  GetRescheduleCountResponseDto,
  FetchAvailableSlotsDto,
  AvailableSlotsResponseDto,
  CoverAndRemoveSlotResponseDto,
  CoverAndRemoveSlotRequestDto,
  CandidateBookAppointmentResponseDto,
  CandidateBookAppointmentRequestDto,
  CandidateUpdateWithdrawBookingDto,
  CandidateUpdateWithdrawBookingResponseDto,
  AvailableSlotsInterviewerResponseDto,
  AvailableSlotsInterviewerDto,
  RemoveAllOpenSlotsDto,
  RemoveAllOpenSlotsResponseDto,
  ConvertAllSlotsToCoverRequestDto,
  AddBulkEventAvailabilityDto,
  AddBulkEventAvailabilityResponseDto,
  FetchSlotsForSwapResponseDto,
  DailyInterviewerCalendarFetchRequestDto,
  DailyInterviewerCalendarFetchResponseDto,
  FetchSlotsForSwapRequestDto,
  InterviewerAvailabilitySlotsFetchResponseDto,
  InterviewerAvailabilitySlotsFetchRequestDto,
  ConvertAllSlotsToCoverResponseDto,
  BulkReschedulingTableFetchRequestDto,
  BulkReschedulingTableFetchResponseDto,
  BulkSwapAndRescheduleRequestDto,
  BulkSwapAndRescheduleResponseDto,
  AdminMasterTableResponseDto,
  AdminMasterTableRequestDto,
  GetAppointmentDetailsResponseDto,
  ApssAdminMetaDataResponseDto,
  ApssAdminBookAppointmentTableFetchResponseDto,
  ApssAdminBookAppointmentTableFetchRequestDto,
  GetJobStatusResponseDto,
  JobTerminationsResponseDto
} from '../dtos/booking-status.dto';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  BadRequest400Dto,
  Forbidden403Dto,
  Unauthorized401Dto
} from '../dtos/bad-request.dto';
import { AccessGuard, Accesses } from '../../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('APSS Booking Status Controller')
@Controller('user')
export class BookingStatusController {
  constructor(private bookingStatusService: BookingStatusService) {}

  @Get('/check-candidate-booking-status')
  @ApiOperation({
    summary:
      'APSS: candidate/admin: Check whether a candidate have already booked interview slot'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Check candidate booking status',
    type: GetCandidateBookingStatus200Dto
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
  checkBookingStatus(@Request() req: any) {
    return this.bookingStatusService.checkBookingStatus(+req.user.userId);
  }

  @Post('/get-available-slots')
  @ApiOperation({
    summary:
      'APSS: candiate/admin: Get available slots for appointment booking/reschedule'
  })
  @ApiResponse({
    status: 201,
    description:
      'Success: Get available slots for appointment booking/reschedule',
    type: AvailableSlotsResponseDto
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
  getBookingStatusDetails(
    @Body() getBookingStatusDetails: FetchAvailableSlotsDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.getBookingStatusDetails(
      getBookingStatusDetails
    );
  }

  //TODO:bk to check
  @ApiBearerAuth()
  @Post('/get-available-slots-interviewer')
  @ApiOperation({ summary: 'APSS: admin: get available slots of Interviewer' })
  @ApiResponse({
    status: 201,
    description: 'Success: get available slots of Interviewer',
    type: AvailableSlotsInterviewerResponseDto
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
  getBookingStatusDetailsInterviewer(
    @Body() getBookingStatusDetailsInt: AvailableSlotsInterviewerDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.getBookingStatusDetailsInterviewer(
      getBookingStatusDetailsInt
    );
  }

  @Accesses('AP_AD', 'AP_INT')
  @Post('/cover-and-remove-slot')
  @ApiOperation({
    summary: 'APSS: admin/interviewer: Booking convert cover or remove'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: Booking convert cover or remove',
    type: CoverAndRemoveSlotResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  deleteBookingStatusDetails(
    @Body() coverAndRemoveSlot: CoverAndRemoveSlotRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.CoverAndRemoveSlot(
      coverAndRemoveSlot,
      req.user.userId
    );
  }

  @Accesses('AP_AD', 'AP_INT')
  @Post('/add-bulk-event-availability')
  @ApiOperation({
    summary: 'APSS: admin/interviewer: add bulk event availability'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: admin/interviewer: add bulk event availability',
    type: AddBulkEventAvailabilityResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  addBulkEventAvailability(
    @Body() addBulkEventAvailability: AddBulkEventAvailabilityDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.addBulkEventAvailability(
      addBulkEventAvailability,
      +req.user.userId
    );
  }

  @Put('/candidate-book-appointment')
  @ApiOperation({
    summary: 'APSS: candiate/admin: Submit Booking/Reschedule appointment'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Submit Booking/Reschedule appointment',
    type: CandidateBookAppointmentResponseDto
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
  BookingStatusUpdate(
    @Body() data: CandidateBookAppointmentRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.bookingStatusUpdate(data, req.user.userId);
  }

  @Put('/candidate-update-withdraw-booking')
  @ApiOperation({
    summary: 'APSS: candiate/admin: Submit Candidate withdraw appointment'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Submit Candidate withdraw appointment',
    type: CandidateUpdateWithdrawBookingResponseDto
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
  CandidateUpdate(
    @Body() data: CandidateUpdateWithdrawBookingDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.candidateUpdateWithdrawBooking(
      data,
      +req.user.userId
    );
  }

  @Accesses('AP_AD', 'AP_INT')
  @Post('/daily-interviewer-calendar-fetch')
  @ApiOperation({
    summary: 'APSS: interviewer/admin daily interviewer calendar fetch'
  })
  @ApiResponse({
    status: 201,
    description: 'APSS: daily interviewer calendar fetch',
    type: DailyInterviewerCalendarFetchResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  getAllBookingSlotHistory(
    @Body()
    dailyInterviewerCalendarFetch: DailyInterviewerCalendarFetchRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.dailyInterviewerCalendarFetchDetails(
      dailyInterviewerCalendarFetch
    );
  }

  @Accesses('AP_AD')
  @Post('/apss-fetch-slots-for-swap')
  @ApiOperation({ summary: 'APSS: Admin: fetch slots for swap' })
  @ApiResponse({
    status: 201,
    description: 'Success: fetch slots for swap',
    type: FetchSlotsForSwapResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  getSwapInterviewer(
    @Body() swapDetails: FetchSlotsForSwapRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.apssFetchSlotsForSwap(swapDetails);
  }

  @Accesses('AP_AD')
  @Post('/apss-admin-master-table-fetch')
  @ApiOperation({ summary: 'APSS: admin: master table fetch' })
  @ApiResponse({
    status: 201,
    description: 'Success: master table fetch',
    type: AdminMasterTableResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  apssAdminMasterTableFetch(
    @Body() apssAdminMasterTableFetch: AdminMasterTableRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.apssAdminMasterTableFetch(
      apssAdminMasterTableFetch
    );
  }

  @Accesses('AP_AD')
  @Post('/apss-bulk-swap-and-reschedule')
  @ApiOperation({
    summary: 'APSS: admin: bulk swap and reschedule'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: bulk swap and reschedule',
    type: BulkSwapAndRescheduleResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  bulkSwapAndRescheduleInterviewers(
    @Body() bulkSwapAndRescheduleInterviewers: BulkSwapAndRescheduleRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.bulkSwapAndRescheduleInterviewers(
      bulkSwapAndRescheduleInterviewers,
      +req.user.userId
    );
  }

  @Accesses('AP_AD')
  @UseGuards(JwtAuthGuard)
  @Post('/apss-bulk-reschedule-table-fetch')
  @ApiOperation({ summary: 'APSS: Admin: Bulk rescheduling table fetch' })
  @ApiResponse({
    status: 201,
    description: 'Success: successfully fetched bulk rescheduling table data',
    type: BulkReschedulingTableFetchResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  getDataReschedule(
    @Body() dataReschedule: BulkReschedulingTableFetchRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.getDataReschedule(dataReschedule);
  }

  //TODO:bk to check
  @ApiBearerAuth()
  @Post('/interviewer-candidate-swap-interview')
  @ApiOperation({ summary: 'Submit Candidate Swap Interview' })
  @ApiResponse({
    status: 201,
    description: 'Successful',
    type: BookingStatusResponseDto
  })
  getInterviewerCandidateSwapInterview(
    @Body() interviewerCandidateSwapInterview: CreateBookingStatusDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.getInterviewerCandidateSwapInterview(
      interviewerCandidateSwapInterview
    );
  }

  @Accesses('AP_AD')
  @Post('/apss-admin-book-appointment-table-fetch')
  @ApiOperation({
    summary: 'APSS: admin: Book an Appointment table fetch'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: Book an Appointment table fetch',
    type: ApssAdminBookAppointmentTableFetchResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  apssAdminBookAppointmentTableFetch(
    @Body() data: ApssAdminBookAppointmentTableFetchRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.apssAdminBookAppointmentTableFetch(data);
  }

  //TODO:bk to check
  @ApiBearerAuth()
  @Post('/booking-status-canidate')
  @ApiOperation({ summary: 'Submit Booking Status Canidate' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: BookingStatusResponseDto
  })
  getCanidate(
    @Body() candidateDetails: CreateBookingStatusDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.getCanidate(candidateDetails);
  }

  @Accesses('AP_AD', 'AP_INT')
  @Post('/apss-interviewer-add-avilability-slots-fetch')
  @ApiOperation({
    summary: 'APSS: admin/interviewer: fetch interviewer add avilability slots'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: fetch interviewer add avilability slots',
    type: InterviewerAvailabilitySlotsFetchResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  apssInterviewerAddAvilabilitySlotsFetch(
    @Body() bookingSlotDetails: InterviewerAvailabilitySlotsFetchRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.apssInterviewerAddAvilabilitySlotsFetch(
      bookingSlotDetails
    );
  }

  @Get('/get-job-status')
  @ApiOperation({ summary: 'APSS: candidate/admin: get queue job status' })
  @ApiResponse({
    status: 200,
    description: 'Success: get queue job status',
    type: GetJobStatusResponseDto
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
  getJobStatus(@Request() req) {
    return this.bookingStatusService.getJobStatus(req.query.jobId);
  }

  @Get('/terminate-job')
  @ApiOperation({ summary: 'APSS: candidate/admin: terminate job' })
  @ApiResponse({
    status: 200,
    description: 'Success: terminate the job',
    type: JobTerminationsResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: termination of job failed',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: Unauthorized401Dto
  })
  terminateJob(@Request() req) {
    return this.bookingStatusService.terminateJob(req.query.jobId);
  }

  @Get('/get-appointment-details')
  @ApiOperation({ summary: 'APSS: candiate/admin: Get Appointment Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Appointment Details',
    type: GetAppointmentDetailsResponseDto
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
  getAppointmentDetails(@Request() req) {
    return this.bookingStatusService.getAppointmentDetails(
      req.query.appointmentTypeId
    );
  }

  @Accesses('AP_AD')
  @Post('/convert-all-slots-to-cover')
  @ApiOperation({
    summary: 'APSS: admin: convert all slots to cover'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: converted all slots to cover',
    type: ConvertAllSlotsToCoverResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  convertAllSlotsToCover(
    @Body() postData: ConvertAllSlotsToCoverRequestDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.convertAllSlotsToCover(
      postData,
      +req.user.userId
    );
  }

  @Accesses('AP_AD')
  @Post('/remove-all-open-slots')
  @ApiOperation({
    summary: 'APSS: admin: remove all open slots'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: remove all open slots',
    type: RemoveAllOpenSlotsResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  removeAllOpenSlots(
    @Body() postData: RemoveAllOpenSlotsDto,
    @Request() req: any
  ) {
    return this.bookingStatusService.removeAllOpenSlots(
      postData,
      +req.user.userId
    );
  }

  @Accesses('AP_AD')
  @Get('/apss-admin-meta-data')
  @ApiOperation({ summary: 'APSS: admin: fetch meta data for apss functions' })
  @ApiResponse({
    status: 201,
    description: 'Success: fetch meta data for apss functions',
    type: ApssAdminMetaDataResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  getBookingStatusOptions() {
    return this.bookingStatusService.apssAdminMetaData();
  }

  @Post('/get-reschedule-count')
  @ApiOperation({
    summary: 'APSS: candiate/admin: Fetch Number of reschedules for user'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: converted all slots to cover',
    type: GetRescheduleCountResponseDto
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
  getRescheduleCount(@Body() data: GetRescheduleCountDto) {
    return this.bookingStatusService.getRescheduleCount(data);
  }

  @Accesses('AP_AD')
  @Post('/interviewer-contract-details')
  @ApiOperation({ summary: 'APSS: admin: Fetch Interviewer Contract Details' })
  @ApiResponse({
    status: 201,
    description: 'Success: Fetch Interviewer Contract Details',
    type: GetInterviewerContractDetailsResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  getInterviewerContractDetails(
    @Body() data: GetInterviewerContractDetailsDto
  ) {
    return this.bookingStatusService.getInterviewerContractDetails(data);
  }

  @Accesses('AP_AD')
  @ApiOperation({ summary: 'APSS: admin: Update Interviewer Contracts' })
  @Put('/interviewer-contract-update')
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Interviewer Contract Details',
    type: InterviewerContractUpdateResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  updateInterviewerContracts(
    @Body() data: InterviewerContractUpdateDto[],
    @Request() req
  ) {
    return this.bookingStatusService.updateInterviewerContractDetails(
      data,
      +req.user.userId
    );
  }

  @Accesses('AP_AD')
  @ApiOperation({
    summary: 'APSS: admin: Get Interviewer Daily Time Table Data'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Interviewer Daily Time Table Data',
    type: InterviewerTimeTableFetchDailyResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  @Post('/interviewer-time-table')
  getInterviewerTimeTable(@Body() data: InterviewerTimeTableFetchDto) {
    return this.bookingStatusService.getInterviewerTimeTableData(data);
  }

  @Accesses('AP_AD')
  @ApiOperation({
    summary: 'APSS: admin: Get Interviewer Daily Time Table Data Export'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Interviewer Daily Time Table Data Export',
    type: InterviewerTimeTableDailyExportResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  @Post('/interviewer-time-table-export')
  getInterviewerTimeTableExport(@Body() data: InterviewerTimeTableFetchDto) {
    return this.bookingStatusService.getInterviewerTimeTableExport(data);
  }

  @Accesses('AP_AD')
  @ApiOperation({
    summary: 'APSS: admin: Get Interviewer Weekly Time Table Data'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Interviewer Weekly Time Table Data',
    type: InterviewerTimeTableFetchWeeklyResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  @Post('/interviewer-weekly-time-table')
  getInterviewerWeeklyTimeTable(@Body() data: InterviewerTimeTableFetchDto) {
    return this.bookingStatusService.getInterviewerTimeTableWeeklyViewTableData(
      data
    );
  }

  @Accesses('AP_AD')
  @ApiOperation({
    summary: 'APSS: admin: Get Interviewer Weekly Time Table Data Export'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Interviewer Weekly Time Table Data Export',
    type: InterviewerTimeTableFetchWeeklyExportResponseDto
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
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  @Post('/interviewer-weekly-time-table-export')
  getInterviewerWeeklyTimeTableExport(
    @Body() data: InterviewerTimeTableFetchDto
  ) {
    return this.bookingStatusService.getInterviewerTimeTableWeeklyViewExport(
      data
    );
  }
}
