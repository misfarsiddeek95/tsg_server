import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { GetUser } from '../../../auth/decorator';
import { JwtGuard } from '../../../auth/guard';
import {
  SearchTutorNameFilter201,
  TimeOffDto,
  TimeOffDto201,
  TimeOffDto400,
  TimeofffiltersDto,
  TimeofffiltersDto201,
  TimeofffiltersDto401,
  TimeoffReqFiltersDto401,
  TimeoffReqSearchTutorIdFilter201,
  Unauthorized401
} from '../../dtos';
import { TimeoffreqService } from '../../services/timeoffreq/timeoffreq.service';

@UseGuards(JwtGuard)
@ApiTags('Supervisor Timeoff Controller Endpoint')
@Controller('super/timeoff')
export class TimeoffreqController {
  constructor(private timeOffreqService: TimeoffreqService) {}

  @Post('/get-list')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get list of timeoff requests',
    type: TimeofffiltersDto201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid ',
    type: TimeofffiltersDto401
  })
  @ApiBody({ type: TimeofffiltersDto })
  getTimeOffRequests(@Body() dto: TimeofffiltersDto, @GetUser() user: any) {
    return this.timeOffreqService.getTimeOffRequests(dto, user);
  }

  @Get('search-tutor-name/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: SearchTutorNameFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: Unauthorized401
  })
  tutorNameStatus(@Param('filter') filter: string, @GetUser() user: any) {
    return this.timeOffreqService.getTutorName(filter, user);
  }

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
  tutorIdStatus(@Param('filter') filter: number, @GetUser() user: any) {
    return this.timeOffreqService.getTutorID(filter, user.user.tsp_id);
  }

  @Post('/approver-Adhoc-time-off')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get Subordinate request list',
    type: TimeOffDto201
  })
  @ApiUnauthorizedResponse({
    status: 400,
    description: 'Invalid Request',
    type: TimeOffDto400
  })
  @ApiBody({ type: TimeOffDto })
  approverSubordinate(@Body() details: TimeOffDto, @GetUser() user: any) {
    return this.timeOffreqService.applyAdhoctimeoff(details, user);
  }
}
