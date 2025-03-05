import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../../auth/decorator';
import { JwtGuard } from '../../auth/guard';
import { AvailabilityService } from '../services/availability.service';
import {
  ChangeAvailabilityDto,
  ChangeAvailabilityDto201,
  FlagDto,
  GetCalendarDto201,
  HistorylistDto201,
  UserDetailsAvailabilityDto201,
  TutoringCountry200Dto
} from '../dtos/availability.dto';
import { TimeOffDto, TimeOffDto201, TimeOffDto403 } from '../dtos/timeOff.dto';
import { CancelDto, CancelDto201 } from '../dtos/cancel.dto';

@UseGuards(JwtGuard)
@ApiTags('Tutor Controller Endpoint')
@Controller('tutor/availability')
@ApiBearerAuth() // Swagger decorater to identify this module is protected with bearer token
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Post('/update-availability')
  @ApiCreatedResponse({
    description: 'insert change request',
    type: ChangeAvailabilityDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 401,
    description: 'Invalid ',
    type: TimeOffDto403
  })
  @ApiBody({ type: ChangeAvailabilityDto })
  async updateAvailability(
    @Body() details: ChangeAvailabilityDto,
    @GetUser() user: User
  ) {
    return this.availabilityService.updateAvailability(details, user);
  }

  //Time Off
  @Post('/time-off')
  @ApiCreatedResponse({
    description: 'insert change request',
    type: TimeOffDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  @ApiBody({ type: TimeOffDto })
  async timeOff(@Body() details: TimeOffDto, @GetUser() user: User) {
    return this.availabilityService.timeOff(details, user);
  }

  //Flag Slot
  @Post('/flag-slot')
  @ApiCreatedResponse({
    description: 'insert Flag Slot',
    type: TimeOffDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  @ApiBody({ type: FlagDto })
  async flagSlot(@Body() details: FlagDto, @GetUser() user: User) {
    return this.availabilityService.flagSlot(details, user);
  }

  // get History list for tutor
  @Get('/history-list')
  @ApiCreatedResponse({
    status: 200,
    description: 'User Details',
    // type: HistorylistDto,
    type: HistorylistDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  async history(
    // @Query('effectiveDate') effectiveDate: any,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('searchFilter') searchFilter: any,
    @GetUser() user: User
  ) {
    return this.availabilityService.getHistory({
      skip: skip,
      take: take,
      user: user,
      filter: searchFilter
    });
  }

  @Get('/get-availability')
  @ApiCreatedResponse({
    status: 200,
    description: 'User Details',
    //type: UserDetailsAvailabilityDto,
    type: UserDetailsAvailabilityDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  async getTutorAvailability(
    @Query('effectiveDate') effectiveDate: any,
    @GetUser() user: User
  ) {
    return this.availabilityService.getTutorAvailability({
      filter: effectiveDate,
      user: user
    });
  }

  @Get('/get-daily-session')
  @ApiCreatedResponse({
    status: 200,
    description: 'User Details',
    //type: UserDetailsAvailabilityDto,
    type: UserDetailsAvailabilityDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  async getDailySession(
    @Query('effectiveDate') effectiveDate: any,
    @GetUser() user: User
  ) {
    return this.availabilityService.getDailySession({
      filter: effectiveDate,
      user: user
    });
  }

  @Post('/cancel-req')
  @ApiCreatedResponse({ description: 'cancel request', type: CancelDto201 })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  @ApiBody({ type: CancelDto })
  async CancelByReqId(@Body() details: CancelDto, @GetUser() user: User) {
    return this.availabilityService.CancelRequest(details, user);
  }

  @Get('/get-Calendar')
  @ApiCreatedResponse({
    description: 'Calendar Holidays',
    type: GetCalendarDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  async getCalendar(
    @Query('effectiveDate') effectiveDate: any,
    @GetUser() user: User
  ) {
    return this.availabilityService.getCalendar({
      filter: effectiveDate,
      user: user
    });
  }

  @Get('/check-access')
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  @ApiCreatedResponse({ description: 'Calendar Holidays' })
  async getAccessForFunctions() {
    return this.availabilityService.getAccessForFunctions();
  }

  @Get('/get-academic-calender')
  @ApiCreatedResponse({
    description: 'Calendar Holidays',
    type: GetCalendarDto201
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  async getAcademicCalendar(
    @Query('effectiveDate') effectiveDate: any,
    @GetUser() user: User
  ) {
    return this.availabilityService.getAcademicCalendar({
      filter: effectiveDate,
      user: user
    });
  }

  @Get('/get-tutoring-country')
  @ApiCreatedResponse({
    description: 'Tutoring Country',
    type: TutoringCountry200Dto
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: TimeOffDto403
  })
  async getTutoringCountry(@GetUser() user: User) {
    return this.availabilityService.getTutoringCountry({
      user
    });
  }
}
