import { Module } from '@nestjs/common';
import { HealthDeclarationService } from './health-declaration.service';
import { HealthDeclarationController } from './health-declaration.controller';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [HealthDeclarationService, MailService],
  controllers: [HealthDeclarationController]
})
export class HealthDeclarationModule {}
