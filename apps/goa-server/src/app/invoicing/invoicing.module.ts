import { Module } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
import { InvoicingController } from './invoicing.controller';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/service/user.service';
import { SlotsService } from '../slots/slots.service';

@Module({
  providers: [InvoicingService, EmailService, UserService, SlotsService],
  controllers: [InvoicingController]
})
export class InvoicingModule {}
