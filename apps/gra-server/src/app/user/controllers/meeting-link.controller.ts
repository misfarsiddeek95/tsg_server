import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { MeetingLinkService } from '../services/meeting-link.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  GetMeetingLinkRequestDto,
  GetMeetingLinkResponseDto
} from '../dtos/meeting-link.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { BadRequest400Dto, Unauthorized401Dto } from '../dtos/bad-request.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('APSS Meeting Link Controller')
@Controller('user')
export class CreateMeetingLinkController {
  constructor(private meetingLinkService: MeetingLinkService) {}

  @Post('/apss-meeting-link')
  @ApiOperation({ summary: 'APSS: all: Get Interviewer Meeting Link' })
  @ApiResponse({
    status: 201,
    description: 'Success: Get Interviewer Meeting Link',
    type: GetMeetingLinkResponseDto
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
  getMeetingLink(
    @Body() meetingLinkDetails: GetMeetingLinkRequestDto,
    @Request() req: any
  ) {
    return this.meetingLinkService.getMeetingLink(meetingLinkDetails);
  }
}
