import { Module } from '@nestjs/common';
import { BankDetailsController } from './bank-details.controller';
import { BankDetailsService } from './bank-details.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [BankDetailsController],
  providers: [BankDetailsService, MailService]
})
export class BankDetailsModule {}
