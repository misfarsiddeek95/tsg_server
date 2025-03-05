import { Module } from '@nestjs/common';
import { HardwareInternetService } from './hardware-internet.service';
import { HardwareInternetController } from './hardware-internet.controller';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [HardwareInternetController],
  providers: [HardwareInternetService, MailService]
})
export class HardwareInternetModule {}
