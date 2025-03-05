import { Module } from '@nestjs/common';
import { ContractDetailsController } from './contract-details.controller';
import { ContractDetailsService } from './contract-details.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [ContractDetailsController],
  providers: [ContractDetailsService, MailService]
})
export class ContractDetailsModule {}
