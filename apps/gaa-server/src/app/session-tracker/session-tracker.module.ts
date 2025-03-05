import { Module } from '@nestjs/common';
import { SessionTrackerController } from './session-tracker.controller';
import { SessionTrackerService } from './session-tracker.service';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SessionTrackerController],
  providers: [SessionTrackerService]
})
export class SessionTrackerModule {}
