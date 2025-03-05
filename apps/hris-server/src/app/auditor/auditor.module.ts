import { Module } from '@nestjs/common';
import { AuditorService } from './auditor.service';
import { AuditorController } from './auditor.controller';
import { NotesModule } from './notes/notes.module';
import { RouterModule } from '@nestjs/core';
import { ActivityModule } from './activity/activity.module';
import { ProfessionalQualificationsModule } from '../professional-qualifications/professional-qualifications.module';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [AuditorService, MailService],
  controllers: [AuditorController],
  imports: [
    NotesModule,
    RouterModule.register([
      { path: 'auditor', module: NotesModule },
      { path: 'auditor', module: ActivityModule }
    ]),
    ActivityModule,
    ProfessionalQualificationsModule
  ]
})
export class AuditorModule {}
