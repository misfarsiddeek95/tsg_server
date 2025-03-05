import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtGuard } from '../../auth/guard';
import {
  ChangeReqFiltersDto,
  ChangeReqFiltersDto401,
  ChangeReqGetListDto201,
  ChangeReqSearchSupervisorFilter201,
  ChangeRequestSearchTutorIdFilter201,
  ChangeRequestSearchTutorNameFilter201
} from '../dtos/changereqfilters.dto';

import {
  ChangeReqDetails201,
  ChangeReqDto,
  ChangeReqDto201,
  ChangeReqDto403
} from '../dtos/changereq.dto';

import { ChangereqService } from '../services/changereq.service';
import { GetUser } from '../../auth/decorator';
import { User } from '@prisma/client';
@ApiTags('Admin Change Request endpoint')
@UseGuards(JwtGuard)
@Controller('changereq')
export class ChangereqController {
  constructor(private changeReqService: ChangereqService) {}


  //Get Change Request List - Start __________________________________
  @Post('/get-list')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get change request list',
    //type: ChangeReqFiltersDto201,
    type: ChangeReqGetListDto201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
    type: ChangeReqFiltersDto401
  })
  @ApiBody({ type: ChangeReqFiltersDto })
  getChangeReq(@Body() dto: ChangeReqFiltersDto) {
    return this.changeReqService.getChangeReq(dto);
  }
  //Get Change Request List - End __________________________________


  //Update Change Request List - Start __________________________________
  @Post('/update-changeReq')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get change request list',
    type: ChangeReqDto201
  })
  @ApiUnauthorizedResponse({
    status: 403,
    description: 'Invalid request',
    type: ChangeReqDto403
  })
  @ApiBody({ type: ChangeReqDto })
  UpdateChangeReq(@Body() dto: ChangeReqDto, @GetUser() user: User) {
    return this.changeReqService.updateChangeReq(dto, user);
  }
  //Update Change Request List - End __________________________________


  //Get Change Request Details - Start __________________________________
  @Get('change-req-details/:id')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: ChangeReqDetails201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: ChangeReqFiltersDto401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  getChangeReqDetailsByReqId(@Param('id') id: string) {
    return this.changeReqService.getChangeReqDetailsByReqId(+id);
  }
  //Get Change Request Details - End __________________________________


  // Search Tutor Name - Start __________________________________
  @Get('search-tutor-name/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfullyi',
    type: ChangeRequestSearchTutorNameFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: ChangeReqFiltersDto401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  tutorNameStatus(@Param('filter') filter: string) {
    return this.changeReqService.getTutorName(filter);
  }
  // Search Tutor Name - End __________________________________


  // Search Tutor ID - Start __________________________________
  @Get('search-tutor-id/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: ChangeRequestSearchTutorIdFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: ChangeReqFiltersDto401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  tutorIdStatus(@Param('filter') filter: number) {
    return this.changeReqService.getTutorID(filter);
  }
  // Search Tutor ID - End __________________________________


  //Search Supervisor - Start __________________________________
  @Get('search-supervisor/:filter')
  @Get('search-tutor-id/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: ChangeReqSearchSupervisorFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: ChangeReqFiltersDto401
  })
  supervisor(@Param('filter') filter: string) {
    return this.changeReqService.getSupervisor(filter);
  }
  //Search Supervisor - End __________________________________
}
