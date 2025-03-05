import { Module } from '@nestjs/common';
import { FtAssessmentController } from './ft-assessment.controller';
import { FtAssessmentService } from './ft-assessment.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [FtAssessmentService],
  controllers: [FtAssessmentController],
  exports: [FtAssessmentService]
})
export class FtAssessmentModule {}
