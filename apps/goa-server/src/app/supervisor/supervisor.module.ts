import { Module } from '@nestjs/common';
import { AvailabilityController } from './controllers/availability/availability.controller';
import { AvailabilityService } from './services/availability/availability.service';
import { TimeoffreqController } from './controllers/timeoffreq/timeoffreq.controller';
import { TimeoffreqService } from './services/timeoffreq/timeoffreq.service';
import { ChangerequestController } from './controllers/changerequest/changerequest.controller';
import { ChangerequestService } from './services/changerequest/changerequest.service';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/service/user.service';
import { SlotsService } from '../slots/slots.service';

@Module({
  controllers: [
    AvailabilityController,
    TimeoffreqController,
    ChangerequestController
  ],
  providers: [
    AvailabilityService,
    TimeoffreqService,
    ChangerequestService,
    UserService,
    EmailService,
    SlotsService
  ]
})
export class SupervisorModule {}
