import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, MailService]
})
export class DashboardModule {}
