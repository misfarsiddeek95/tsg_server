import { Module } from '@nestjs/common';
import { GraApplicationService } from './gra-application.service';
import { GraApplicationController } from './gra-application.controller';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [GraApplicationService, MailService],
  controllers: [GraApplicationController]
})
export class GraApplicationModule {}
