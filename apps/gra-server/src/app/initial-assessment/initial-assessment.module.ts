import { Module } from '@nestjs/common';
import { InitialAssessmentController } from './initial-assessment.controller';
import { InitialAssessmentService } from './initial-assessment.service';
import { MailModule } from './../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [InitialAssessmentService],
  controllers: [InitialAssessmentController],
  exports: [InitialAssessmentService]
})
export class InitialAssessmentModule {}
