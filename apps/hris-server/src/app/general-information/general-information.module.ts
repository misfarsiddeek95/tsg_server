import { Module } from '@nestjs/common';
import { GeneralInformationService } from './general-information.service';
import { GeneralInformationController } from './general-information.controller';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [GeneralInformationController],
  providers: [GeneralInformationService, MailService]
})
export class GeneralInformationModule {}
