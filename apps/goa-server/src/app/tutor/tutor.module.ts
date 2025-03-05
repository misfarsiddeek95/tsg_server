import { Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/service/user.service';
import { AvailabilityController } from './controllers/availability.controller';
import { AvailabilityService } from './services/availability.service';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { SlotsService } from '../slots/slots.service';
import { CommonService } from '../util/common.service';

@Module({
  controllers: [AvailabilityController, InvoiceController],
  providers: [
    AvailabilityService,
    EmailService,
    UserService,
    InvoiceService,
    SlotsService,
    CommonService
  ]
})
export class TutorModule {}
