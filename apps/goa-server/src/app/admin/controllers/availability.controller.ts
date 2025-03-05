import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';
import { JwtGuard } from '../../auth/guard';
import {
  SearchBatchFilter201,
  SearchTutorIdFilter201,
  TimeSlot201,
  UpdateHourStatus201,
  UpdateHourStatusReport201,
  UpdateHourStatusReport401,
  UpdateSlotStatus201,
  list201,
  list401,
  AdminAvailabilityGetStatus201,
  AvailabilitySearchTutorNameFilter201,
  UpdateDemandDto,
  AvailabilityBulkActionDto,
  UpdateHourStatus,
  Common201Dto,
  Common401Dto,
  ResignedTutor,
  SaveUkBookedSessions,
  TutorNameOrIdSuccessResponse,
  TutorNameOrIdErrorResponse
} from '../dtos';

import { AvailabilityService } from '../services/availability.service';
import { GetUser } from '../../auth/decorator';
import { User } from '@prisma/client';
import { SlotsService } from '../../slots/slots.service';

@ApiTags('Admin Availability Controller Endpoint')
@Controller('availability')
@ApiBearerAuth() // Swagger decorater to identify this module is protected with bearer token
export class AvailabilityController {
  constructor(
    private availabilityService: AvailabilityService,
    private slotService: SlotsService
  ) {}

  //Get Availability List - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('/list')
  @ApiCreatedResponse({
    description: 'The List was returned successfully',
    type: list201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: list401
  })
  @ApiQuery({
    name: 'skip',
    description: 'Number of items to skip',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'searchFilter',
    required: false,
    type: String
  })
  async availability(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('searchFilter') searchFilter: any
  ) {
    return await this.availabilityService.getAvailability({
      skip: Number(skip),
      take: Number(take),
      filter: searchFilter
    });
  }
  //Get Availability List - End __________________________________

  //Update Slot Status - Start __________________________________
  @UseGuards(JwtGuard)
  @Post('/update-slot-status')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: UpdateSlotStatus201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UpdateHourStatusReport401
  })
  @ApiQuery({
    name: 'TutorId',
    type: Number
  })
  @ApiQuery({
    name: 'SlotId',
    type: Number
  })
  @ApiQuery({
    name: 'id',
    type: Number
  })
  @ApiQuery({
    name: 'value',
    type: String
  })
  async updateSlots(@Body() details, @GetUser() user: User) {
    return this.availabilityService.updateSlotsStatus({ details, user: user });
  }
  //Update Slot Status - End __________________________________

  //Update Slot Status Bulk Actioning - Start __________________________________
  @UseGuards(JwtGuard)
  @Post('/bulk-actioning')
  @ApiCreatedResponse({
    description: 'Success',
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized ',
    type: Common401Dto
  })
  async availabilityBulkActioning(
    @Body() details: AvailabilityBulkActionDto,
    @GetUser() user: User
  ) {
    return this.availabilityService.availabilityBulkActioning(details, user);
  }
  //Update Slot Status Bulk Actioning - End __________________________________

  //Update Hour Status - Start __________________________________
  @UseGuards(JwtGuard)
  @Post('/update-hour-status')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: UpdateHourStatus201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UpdateHourStatusReport401
  })
  async updateHourStatus(@Body() details: UpdateHourStatus) {
    return this.availabilityService.updateHourStatus(details);
  }
  //Update Hour Status - End __________________________________

  //Get Time Slots - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('/time-slot')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TimeSlot201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UpdateHourStatusReport401
  })
  async timeSlot() {
    return this.availabilityService.getTimeSlot();
  }
  //Get Time Slots - End __________________________________

  //Search Batch Number - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('search-batch/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: SearchBatchFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UpdateHourStatusReport401
  })
  batchStatus(@Param('filter') filter: string) {
    return this.availabilityService.getBatch(filter);
  }
  //Search Batch Number - End __________________________________

  //Get Status - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('/get-status')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully6',
    type: AdminAvailabilityGetStatus201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UpdateHourStatusReport401
  })
  getStatus() {
    return this.availabilityService.getStatus();
  }
  //Get Status - End __________________________________

  //Search Tutor ID - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('search-tutor-id/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: SearchTutorIdFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UpdateHourStatusReport401
  })
  tutorIdStatus(@Param('filter') filter: number) {
    return this.availabilityService.getTutorID(filter);
  }
  //Search Tutor ID - End __________________________________

  // Search Tutor Name - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('search-tutor-name/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: AvailabilitySearchTutorNameFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UpdateHourStatusReport401
  })
  tutorNameStatus(@Param('filter') filter: string) {
    return this.availabilityService.getTutorName(filter);
  }
  // Search Tutor Name - End __________________________________

  // Get tutor time slots - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('tutor-time-slots/:tutorid')
  @ApiCreatedResponse({
    description: 'Success',
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized ',
    type: Common401Dto
  })
  tutorTimeSlots(@Param('tutorid') filter: number) {
    return this.availabilityService.getTutorTimeSlots(filter);
  }
  // Get tutor time slots - End __________________________________

  // Get Slots Report Data - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('/hour-status-report')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: UpdateHourStatusReport201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UpdateHourStatusReport401
  })
  async HourReport(@Query('date') date: any, @Query('slot') slot: number) {
    return this.availabilityService.getHourReport({
      date: date,
      slot: Number(slot)
    });
  }
  // Get Slots Report Data - End __________________________________

  // Get Demand Summary Data - Start __________________________________
  @UseGuards(JwtGuard)
  @Get('/demand-summary')
  @ApiCreatedResponse({
    description: 'Success',
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized ',
    type: Common401Dto
  })
  async demandSumerization(
    @Query('startDate') startDate: string,
    @Query('businessunit') businessUnit: string
  ) {
    return await this.availabilityService.demandSumerization(
      startDate,
      businessUnit
    );
  }
  // Get Demand Summary Data - End __________________________________

  // Update Demand Summary  - Start __________________________________
  @UseGuards(JwtGuard)
  @Post('/update-demand')
  @ApiCreatedResponse({
    description: 'Success',
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized ',
    type: Common401Dto
  })
  async updateDemand(@Body() data: UpdateDemandDto, @GetUser() user: User) {
    return await this.availabilityService.updateDemand(data, user);
  }
  // Update Demand Summary  - End __________________________________

  //Update availability of resigning tutor - Start __________________________________
  @Post('/tutor-resign')
  async availabilityUpdateOfResignedTutor(@Body() data: ResignedTutor) {
    return await this.availabilityService.availabilityUpdateOfResignedTutor(
      data
    );
  }
  //Update availability of resigning tutor - End __________________________________

  //Time ranges for effective date- Start __________________________________
  @Get('/time-ranges-for-effective-date')
  async timeRangesForEffectiveDate(
    @Query('effectiveDate') effectiveDate: string
  ) {
    return await this.slotService.getActiveTimeRangesForEffectiveDate(
      effectiveDate
    );
  }
  //Time ranges for effective date- End __________________________________

  // Get tutors with tutor id searching by name or tutor id
  @UseGuards(JwtGuard)
  @Get('get-tutor-name-or-id')
  @ApiOperation({
    summary: 'Get tutor name / tutor id by searching',
    description:
      'Retrive the tutor name / tutor id by searching the name or id and the method of searching.'
  })
  @ApiQuery({
    name: 'searchItem',
    type: String,
    description: 'Search term: Tutor name or Tutor Id',
    example: 'Misfar Siddeek'
  })
  @ApiQuery({
    name: 'searchType',
    type: String,
    description: 'Search type: byname or byid',
    example: 'byname'
  })
  @ApiResponse({
    status: 200,
    description: 'Sucessfully fetched tutor name or tutor id',
    type: TutorNameOrIdSuccessResponse
  })
  @ApiResponse({
    status: 200,
    description: 'No data to fetch for passed values',
    type: TutorNameOrIdErrorResponse
  })
  getTutorNameOrId(
    @Query('searchItem') searchItem: string,
    @Query('searchType') searchType: string
  ) {
    return this.availabilityService.getTutorNameOrId(searchItem, searchType);
  }

  @Get('get-session-date-by-slot')
  getSessionDateBySlotId(
    @Query('startDate') startDate: string,
    @Query('slotId') slotId: string,
    @Query('tutorId') tutorId: string
  ) {
    return this.availabilityService.getSessionDateBySlotId(
      startDate,
      +slotId,
      +tutorId
    );
  }

  @Get('get-slot-number-by-time')
  getSlotNumberByTime(@Query('time') time: string) {
    return this.availabilityService.getSlotNumberByTime(time);
  }

  // @Get('/sample')
  // async sampleAPi(@Query('effectiveDate') effectiveDate: string) {
  //   return await this.slotService.getActiveSlotsForEffectiveDate(effectiveDate);
  // }
}
