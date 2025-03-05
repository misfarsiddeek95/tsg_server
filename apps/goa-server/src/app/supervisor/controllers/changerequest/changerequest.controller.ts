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
  ChangeReqFiltersDto,
  ChangeReqFiltersDto201,
  ChangeReqFiltersDto401,
  ChangeReqSearchTutorIdFilter201,
  ChangeReqSearchTutorNameFilter201
} from '../../dtos';
import {
  ChangeRequestDeatils201,
  ChangeRequestDeatils401
} from '../../dtos/changereqdetails.dto';
import { ChangerequestService } from '../../services/changerequest/changerequest.service';

@UseGuards(JwtGuard)
@ApiTags('Supervisor ChangeRequest Controller Endpoint')
@Controller('supervisor/changerequest')
export class ChangerequestController {
  constructor(private changerequestservice: ChangerequestService) {}

  @Post('/get-list')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get list of change requests',
    type: ChangeReqFiltersDto201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid ',
    type: ChangeReqFiltersDto401
  })
  @ApiBody({ type: ChangeReqFiltersDto })
  getChangeRequestList(@Body() dto: ChangeReqFiltersDto, @GetUser() user: any) {
    return this.changerequestservice.getChangeRequestList(dto, user);
  }

  @Get('change-req-details/:id')
  @ApiCreatedResponse({
    status: 200,
    description: 'Change Request Details',
    type: ChangeRequestDeatils201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: ChangeRequestDeatils401
  })
  getChangeReqDetailsByReqId(@Param('id') id: string) {
    return this.changerequestservice.getChangeReqDetailsByReqId(+id);
  }

  @Get('search-tutor-name/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: ChangeReqSearchTutorNameFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: ChangeReqFiltersDto401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  tutorNameStatus(@Param('filter') filter: string, @GetUser() user: any) {
    return this.changerequestservice.getTutorName(filter, user);
  }

  @Get('search-tutor-id/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: ChangeReqSearchTutorIdFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: ChangeReqFiltersDto401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  tutorIdStatus(@Param('filter') filter: number, @GetUser() user: any) {
    return this.changerequestservice.getTutorID(filter, user.user.tsp_id);
  }
}
