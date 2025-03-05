import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Request,
  Query
} from '@nestjs/common';
import { SessionAvailabilityService } from './session-availability.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  FetchSessionAvailability200Dto,
  SubmitSessionAvailability200Dto
} from './session-availability.dto';
import { BadRequest400Dto, UnauthorizedDto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Session Availability APIs')
@Controller('session-availability')
export class SessionAvailabilityController {
  constructor(private sessionAvailability: SessionAvailabilityService) {}

  @ApiBearerAuth()
  @Post('/create')
  @ApiOperation({ summary: 'Tutor: Create/ update Session Availabilities' })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Create/ update Session Availabilities',
    type: SubmitSessionAvailability200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  submit(@Body() body: any, @Request() req: any) {
    return this.sessionAvailability.submitSessionAvailability(
      body,
      req.user.userId
    );
  }

  @ApiBearerAuth()
  @Get('/get-default-availability')
  @ApiOperation({ summary: 'Tutor: Get current session availability' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Get current session availability',
    type: FetchSessionAvailability200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  getDefaultAvailabilities(@Request() req: any) {
    return this.sessionAvailability.getDefaultSlots(req.user.userId);
  }

  @ApiBearerAuth()
  @Get('/get-candidate-session-availability')
  @ApiOperation({ summary: 'Auditor: Get current session availability' })
  @ApiResponse({
    status: 200,
    description: 'Success: Auditor: Get current session availability',
    type: FetchSessionAvailability200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  getCandidateSessionAvailability(
    @Query() { candidateTspId }: { candidateTspId: string }
  ) {
    return this.sessionAvailability.getDefaultSlots(+candidateTspId);
  }
}
