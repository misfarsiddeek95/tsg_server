import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { LmsCronController } from './lms-cron.controller';
import { LmsCron } from './lms-cron.cron';
import { TalentLmsModule } from './talent-lms.module'; // Importing TalentLmsModule
import { TalentLmsService } from './talent-lms.service';

@Module({
  imports: [ScheduleModule.forRoot(), TalentLmsModule],
  controllers: [LmsCronController],
  providers: [LmsCron, TalentLmsService]
})
export class LmsCronModule {}
