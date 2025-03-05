import { Module } from '@nestjs/common';
import { ProfessionalQualificationsService } from './professional-qualifications.service';
import { ProfessionalQualificationsController } from './professional-qualifications.controller';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [ProfessionalQualificationsController],
  providers: [ProfessionalQualificationsService, MailService],
  exports: [ProfessionalQualificationsService]
})
export class ProfessionalQualificationsModule {}
