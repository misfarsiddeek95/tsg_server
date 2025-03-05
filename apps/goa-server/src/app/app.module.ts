import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { TutorModule } from './tutor/tutor.module';
import { EmailModule } from './email/email.module';
import { InvoicingModule } from './invoicing/invoicing.module';
import { SlackModule } from './slack/slack/slack.module';
import { SessionTrackerModule } from './session-tracker/session-tracker.module';
import { SlotsModule } from './slots/slots.module';
import { ImapEmailModule } from './imap-email/imap-email.module';
import { CommonModule } from './util/common.module';
import { DistributionModule } from './distribution/distribution.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    UserModule,
    PrismaModule,
    SupervisorModule,
    TutorModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    EmailModule,
    InvoicingModule,
    SlackModule,
    SessionTrackerModule,
    SlotsModule,
    ImapEmailModule,
    CommonModule,
    DistributionModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
