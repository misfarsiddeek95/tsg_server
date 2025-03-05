import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './../mail/mail.module';
import { UserModule } from './../user/user.module';

import { CronController } from './cron.controller';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), MailModule, UserModule],
  controllers: [CronController],
  providers: [CronService]
})
export class CronModule {}
