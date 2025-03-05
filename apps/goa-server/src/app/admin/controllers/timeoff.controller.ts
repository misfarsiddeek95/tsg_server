import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { type } from 'os';

import {
  BulkActionDto,
  TimeoffApproveAllDto,
  TimeoffApproveAllDto201,
  TimeoffApproveAllDto401,
  TimeoffBulkActionDto201,
  TimeoffBulkActionDto401,
  TimeoffExportDto201,
  TimeoffFiltersDto,
  TimeoffFiltersDto201,
  TimeoffFiltersDto401,
  TimeoffRejectAllDto,
  TimeoffRejectAllDto201,
  TimeoffRejectAllDto401,
  TimeoffReqFiltersDto401,
  TimeoffReqSearchSupervisorFilter201,
  TimeoffReqSearchTutorIdFilter201,
  TimeoffReqSearchTutorNameFilter201,
  TimeOffReqUpdateDto,
  TimeoffReqUpdateDto201,
  TimeoffReqUpdateDto401
} from '../dtos';
import {
  GetBusinessUnit201,
  SubordinateTimeOffDto201,
  SubordinateTimeOffDto400,
  TimeOffDetails201,
  TimeOffDto,
  TimeOffDto401,
  TimeOffTutorAvailability201
} from '../dtos/timeoff.dto';
import { TimeoffService } from '../services/timeoff.service';
import { GetUser } from '../../auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from '../../auth/guard';

@UseGuards(JwtGuard)
@Controller('admin/timeoff')
@ApiTags('Admin Time Off Controller Endpoint')
export class TimeoffController {
  constructor(private timeOffReqService: TimeoffService) {}

  // Gest  Time off List - Start _____________________________________
  @Post('/get-list')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get list of timeoff requests',
    type: TimeoffFiltersDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeoffFiltersDto401
  })
  @ApiBody({ type: TimeoffFiltersDto })
  getTimeOffReq(@Body() dto: TimeoffFiltersDto) {
    return this.timeOffReqService.getTimeOffReq(dto);
  }
  // Gest  Time off List - End _____________________________________

  //Export function - Start _____________________________________
  @Post('/export')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get list of timeoff requests and details for export',
    //type: TimeoffFiltersDto201,
    type: TimeoffExportDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeoffFiltersDto401
  })
  @ApiBody({ type: TimeoffFiltersDto })
  getTimeOffForExport(@Body() dto: TimeoffFiltersDto) {
    return this.timeOffReqService.getTimeOffForExport(dto);
  }
  //Export function - End _____________________________________

  //Admin TimeOffDetails - Start _____________________________________
  @Get('/time-off-details/:id')
  @ApiCreatedResponse({
    description: 'Get time off req details',
    type: TimeOffDetails201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeOffDto401
  })
  getTimeOffReqDetails0(@Param('id') id: string) {
    return this.timeOffReqService.getTimeOffReqDetails(+id);
  }
  //Admin TimeOffDetails - End _____________________________________

  //Admin approve all - Start _____________________________________
  @Put('/approve-all/:id')
  @ApiCreatedResponse({
    status: 201,
    description: 'Approve all req details',
    type: TimeoffApproveAllDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeoffApproveAllDto401
  })
  @ApiBody({ type: TimeoffApproveAllDto })
  approveAllTimeOffReq(
    @Param('id') id: string,
    @Body() dto: TimeoffApproveAllDto,
    @GetUser() user: User
  ) {
    return this.timeOffReqService.approveAllTimeOffReq(+id, dto, user);
  }
  //Admin approve all - End _____________________________________

  //Time Off Reject All - Start _____________________________________
  @Put('/reject-all/:id')
  @ApiCreatedResponse({
    status: 201,
    description: 'Reject all req details',
    type: TimeoffRejectAllDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeoffRejectAllDto401
  })
  @ApiBody({ type: TimeoffRejectAllDto })
  rejectAllTimeOffReq(
    @Param('id') id: string,
    @Body() dto: TimeoffRejectAllDto
  ) {
    return this.timeOffReqService.rejectllTimeOffReq(+id, dto);
  }
  //Time Off Reject All - End _____________________________________

  //Admin Time OFF request Update - Start _____________________________________
  @Put('/req-update/:id')
  @ApiCreatedResponse({
    status: 201,
    description: 'Update all req details',
    type: TimeoffReqUpdateDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeoffReqUpdateDto401
  })
  timeOffReqUpdate(
    @Param('id') id: string,
    @Body() dto: TimeOffReqUpdateDto,
    @GetUser() user: User
  ) {
    return this.timeOffReqService.timeOffReqUpdate(+id, dto, user);
  }
  //Admin Time OFF request Update - End _____________________________________

  //Bulk Action - Start _____________________________________
  @Put('/bulk-action/:state')
  @ApiCreatedResponse({
    status: 201,
    description: 'Bulk Action Status',
    type: TimeoffBulkActionDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeoffBulkActionDto401
  })
  timeOffReqBulkAction(
    @Param('state') state: string,
    @Body() dto: BulkActionDto,
    @GetUser() user: User
  ) {
    return this.timeOffReqService.timeOffReqBulkAction(+state, dto, user);
  }
  //Bulk Action - End _____________________________________

  //Get Tutor Availability - Start _____________________________________
  @Get('tutor-availability/')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TimeOffTutorAvailability201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TimeOffDto401
  })
  getTutorAvailability(@Query('id') id: number, @Query('date') date: any) {
    return this.timeOffReqService.getTutorAvailability(id, date);
  }
  //Get Tutor Availability - End _____________________________________

  //Approver Subordinate Time Off - Start _____________________________________
  @Post('/approver-subordinate-time-off')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get Subordinate request list',
    type: SubordinateTimeOffDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 400,
    description: 'Invalid Request',
    type: SubordinateTimeOffDto400
  })
  @ApiBody({ type: TimeOffDto })
  approverSubordinate(@Body() details: TimeOffDto, @GetUser() user: User) {
    return this.timeOffReqService.approverSubordinate(details, user);
  }
  //Approver Subordinate Time Off - End _____________________________________

  // Filters  Get Business Unit - Start _____________________________________
  @Get('/get-business-unit')
  @ApiCreatedResponse({
    status: 201,
    description: 'get-business-unit',
    type: GetBusinessUnit201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeOffDto401
  })
  getBusinessUnit() {
    return this.timeOffReqService.getBusinessUnit();
  }
  // Filters  Get Business Unit - End _____________________________________

  // Filters  Get Tsl Contract ids - Start _____________________________________
  @Get('/get-tsl-contract-ids/:value')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get Subordinate request list',
    type: SubordinateTimeOffDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: TimeOffDto401
  })
  getTslContracts(@Param('value') value: string) {
    return this.timeOffReqService.getTslContracts(value);
  }
  // Filters  Get Tsl Contract ids - End _____________________________________

  // Search Tutor Name  - Start _____________________________________
  @Get('search-tutor-name/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfullyi',
    type: TimeoffReqSearchTutorNameFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TimeoffReqFiltersDto401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  tutorNameStatus(@Param('filter') filter: string) {
    return this.timeOffReqService.getTutorName(filter);
  }
  // Search Tutor Name  - End _____________________________________

  // Search Tutor ID - Start _____________________________________
  @Get('search-tutor-id/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TimeoffReqSearchTutorIdFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TimeoffReqFiltersDto401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  tutorIdStatus(@Param('filter') filter: number) {
    return this.timeOffReqService.getTutorID(filter);
  }
  // Search Tutor ID - End _____________________________________

  //Search Supervisor - Start _____________________________________
  @Get('search-supervisor/:filter')
  @Get('search-tutor-id/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TimeoffReqSearchSupervisorFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TimeoffReqFiltersDto401
  })
  supervisor(@Param('filter') filter: string) {
    return this.timeOffReqService.getSupervisor(filter);
  }
  //Search Supervisor - End _____________________________________
}
