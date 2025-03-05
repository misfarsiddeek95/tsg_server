import { Module } from '@nestjs/common';
import { AvailabilityController } from './controllers/availability.controller';
import { AvailabilityService } from './services/availability.service';
import { ChangereqController } from './controllers/changereq.controller';
import { ChangereqService } from './services/changereq.service';
import { TimeoffController } from './controllers/timeoff.controller';
import { TimeoffService } from './services/timeoff.service';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/service/user.service';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { ActioningController } from './controllers/actioning.controller';
import { ActioningService } from './services/actioning.service';
import { SlotsService } from '../slots/slots.service';
import { TslIntegrationController } from './controllers/tsl-integration.controller';
import { TslIntegrationService } from './services/tsl-integration.service';
import { CommonService } from '../util/common.service';

@Module({
  controllers: [
    AvailabilityController,
    ChangereqController,
    TimeoffController,
    InvoiceController,
    ActioningController,
    TslIntegrationController
  ],
  providers: [
    AvailabilityService,
    ChangereqService,
    TimeoffService,
    EmailService,
    UserService,
    InvoiceService,
    ActioningService,
    SlotsService,
    TslIntegrationService,
    CommonService
  ]
  // imports: [EmailModule],
})
export class AdminModule {}
