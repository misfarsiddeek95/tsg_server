import { Module } from '@nestjs/common';
import { SessionTrackerService } from './session-tracker.service';
import { SessionTrackerController } from './session-tracker.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SessionTrackerController],
  providers: [SessionTrackerService],
  imports: [PrismaModule]
})
export class SessionTrackerModule {}
