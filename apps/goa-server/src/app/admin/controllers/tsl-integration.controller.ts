import { Body, Controller, Get, Post } from '@nestjs/common';
import { TslIntegrationService } from '../services/tsl-integration.service';
import {
  BookedDummySessions,
  NewBookedSessionDto,
  NewLaunchedSessionsDto
} from '../dtos';

@Controller('tsl-integration')
export class TslIntegrationController {
  constructor(private tslIntegrationService: TslIntegrationService) {}

  @Post('session-booking')
  async sessionBooking(@Body() newBookedSessionDto: NewBookedSessionDto) {
    return await this.tslIntegrationService.saveNewBookedSession(
      newBookedSessionDto
    );
  }

  // dummy data for launched sessions
  @Post('dummy-launch-session')
  async addLaunchedSessionsDummy(
    @Body() requestedData: NewLaunchedSessionsDto
  ) {
    return await this.tslIntegrationService.addLaunchedSessionsDummy(
      requestedData
    );
  }

  // dummy data for booked sessions
  @Post('dummy-booked-session')
  async addBookedSessionsDummy(@Body() requestedData: BookedDummySessions) {
    return await this.tslIntegrationService.addBookedSessionsDummy(
      requestedData
    );
  }
}
