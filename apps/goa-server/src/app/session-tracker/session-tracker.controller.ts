import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common';
import { SessionTrackerService } from './session-tracker.service';

@Controller('session-tracker')
export class SessionTrackerController {
  constructor(private readonly sessionTrackerService: SessionTrackerService) {}

  @Post('/authentication')
  async authentication(@Body() data: any) {
    // console.log('auth' + data.key);
    return this.sessionTrackerService.authentication(data);
  }
}
