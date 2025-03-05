import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

import { CronHrisController } from './cron-hris.controller';
import { CronHrisService } from './cron-hris.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailModule,
    JwtModule.register({
      secret: 'tsg@devs',
      signOptions: { expiresIn: '604800s' }
    })
  ],
  controllers: [CronHrisController],
  providers: [CronHrisService]
})
export class CronHrisModule {}
