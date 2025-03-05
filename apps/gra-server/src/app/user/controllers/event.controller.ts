import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { EventService } from '../services/event.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  EventTypeCreateDto,
  EventTypeCreateResponseDto,
  FetchEventAlterationResponseDto,
  GetInterviewerEventDataRequestDto,
  GetInterviewerEventDataResponseDto,
  SubmitEventAlterationDto,
  SubmitEventAlterationResponseDto
} from '../dtos/event.dto';
import { AccessGuard, Accesses } from '../../auth/access.guard';
import {
  BadRequest400Dto,
  Forbidden403Dto,
  Unauthorized401Dto
} from '../dtos/bad-request.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('APSS Event Controller')
@Controller('user')
export class EventController {
  constructor(private eventService: EventService) {}

  @Accesses('AP_AD')
  @UseGuards(AccessGuard)
  @Post('/apss-create-event')
  @ApiOperation({
    summary: 'APSS: admin: create event type - FEATURE NOT DEPLOYED'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: create event type',
    type: EventTypeCreateResponseDto
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
  createEvents(@Body() eventDetails: EventTypeCreateDto, @Request() req: any) {
    return this.eventService.createEventType({
      details: eventDetails,
      userId: +req.user.userId
    });
  }

  @Accesses('AP_AD', 'AP_INT')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: 'APSS: admin/interviewer: Fetch interviewer event data'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: Fetch interviewer event data',
    type: GetInterviewerEventDataResponseDto
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
  @Post('/get-interviewer-event-data')
  getInterviewerEvents(@Body() details: GetInterviewerEventDataRequestDto) {
    return this.eventService.getInterviewerEventData(details);
  }

  @Accesses('AP_AD')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: 'APSS: admin: Fetch event alteration table data'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch event alteration table data',
    type: FetchEventAlterationResponseDto
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
  @Get('/fetch-event-alteration')
  fetchEventAlteration() {
    return this.eventService.fetchEventAlteration();
  }

  @Accesses('AP_AD')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: 'APSS: admin: submit event alternation data'
  })
  @ApiResponse({
    status: 200,
    description: 'Success: submit event alternation data',
    type: SubmitEventAlterationResponseDto
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
  @Put('/submit-event-alteration')
  submitEventAlteration(
    @Body() details: SubmitEventAlterationDto[],
    @Request() req: any
  ) {
    return this.eventService.submitEventAlteration({
      details,
      userId: +req.user.userId
    });
  }
}
