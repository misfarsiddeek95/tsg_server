import { Module } from '@nestjs/common';
import { SessionAvailabilityService } from './session-availability.service';
import { SessionAvailabilityController } from './session-availability.controller';

@Module({
  providers: [SessionAvailabilityService],
  controllers: [SessionAvailabilityController]
})
export class SessionAvailabilityModule {}
