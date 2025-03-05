import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { JwtStrategy } from './../auth/jwt.stategy';
import { MailModule } from './../mail/mail.module';
import { EducationController } from './controllers/education.controller';
import { EducationService } from './services/education.service';
import { TertiaryEducationController } from './controllers/tertiary-education.controller';
import { TertiaryEducationService } from './services/tertiary-education.service';
import { BookingStatusService } from './services/booking-status.service';
import { BookingStatusController } from './controllers/booking-status.controller';
import { BookingHistoryController } from './controllers/booking-history.controller';
import { BookingHistoryService } from './services/booking-history.service';
import { CandidateLevel } from './services/candidate-level.service';
import { CandidateLevelController } from './controllers/candidate-level.controller';
import { WorkEducationService } from './services/workeducation.service';
import { FetchHrisAccessLevel } from './services/hris-access.service';
import { FetchAccessLevel } from './controllers/hris-access-controller';
import { MeetingLinkService } from './services/meeting-link.service';
import { CreateMeetingLinkController } from './controllers/meeting-link.controller';
import { ValidationService } from './services/validation.service';
import { ValidationController } from './controllers/validation.controller';
import { UserService as FlexiQuizUserService } from '../flexiquiz/user/user.service';
import { ExamService } from '../flexiquiz/exam/exam.service';
import { FlexiquizModule } from '../flexiquiz/flexiquiz.module';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { QueueProcessor } from '../queue/queueProcessor';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';

@Module({
  imports: [
    MailModule,
    FlexiquizModule,
    JwtModule.register({
      secret: 'tsg@devs',
      signOptions: { expiresIn: '60000s' }
    }),
    BullModule.registerQueue({
      name: 'appointment_booking_queue'
    })
  ],
  providers: [
    UserService,
    EducationService,
    JwtStrategy,
    TertiaryEducationService,
    BookingStatusService,
    BookingHistoryService,
    CandidateLevel,
    WorkEducationService,
    FetchHrisAccessLevel,
    MeetingLinkService,
    ValidationService,
    FlexiQuizUserService,
    ExamService,
    QueueProcessor,
    EventService
  ],
  controllers: [
    UserController,
    EducationController,
    TertiaryEducationController,
    BookingStatusController,
    BookingHistoryController,
    CandidateLevelController,
    FetchAccessLevel,
    CreateMeetingLinkController,
    ValidationController,
    EventController
  ],
  exports: [
    UserService,
    EducationService,
    WorkEducationService,
    TertiaryEducationService
  ]
})
export class UserModule {}
