import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CronModule } from './cron/cron.module';
import { LmsCronModule } from './talent-lms/lms-cron.module';
import { HookModule } from './hook/hook.module';
import { FlexiquizModule } from './flexiquiz/flexiquiz.module';
import { InterviewerModule } from './interviewer/interviewer.module';
import { UserDetailsController } from './user-details/user-details.controller';
import { UserDetailsModule } from './user-details/user-details.module';
import { SettingsModule } from './settings/settings.module';
import { TeachingInterviewModule } from './teaching-interview/teaching-interview.module';
import { LmsModule } from './interviewer/fas-lms/fas-lms.module';
import { PrismaModule } from './prisma.module';
import { BullModule } from '@nestjs/bull';
import { TalentLmsModule } from './talent-lms/talent-lms.module';
import { GraApplicationModule } from './gra-application/gra-application.module';
import { InitialAssessmentModule } from './initial-assessment/initial-assessment.module';
import { FtAssessmentModule } from './ft-assessment/ft-assessment.module';
import { RecruitmentMasterModule } from './recruitment-master/recruitment-master.module';

const redisTlsRule = !process.env.REDIS_TLS_URL.includes('localhost')
  ? {
      tls: {
        rejectUnauthorized: false
      }
    }
  : {};

@Module({
  imports: [
    MailModule,
    SmsModule,
    AuthModule,
    UserModule,
    CronModule,
    LmsCronModule,
    HookModule,
    FlexiquizModule,
    InterviewerModule,
    UserDetailsModule,
    SettingsModule,
    LmsModule,
    TeachingInterviewModule,
    InitialAssessmentModule,
    FtAssessmentModule,
    RecruitmentMasterModule,
    PrismaModule,
    GraApplicationModule,
    TalentLmsModule,
    BullModule.forRoot({
      redis: {
        password: process.env.REDIS_TLS_URL.split('@')[0].split('://:')[1],
        host: process.env.REDIS_TLS_URL.split('@')[1].split(':')[0],
        port: +process.env.REDIS_TLS_URL.split('@')[1].split(':')[1],
        ...redisTlsRule
      }
    })
  ],
  controllers: [AppController, UserDetailsController],
  providers: [AppService]
})
export class AppModule {}
