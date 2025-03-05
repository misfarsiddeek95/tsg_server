import { Module } from '@nestjs/common';
import { TeachingInterviewController } from './teaching-interview.controller';
import { TeachingInterviewService } from './teaching-interview.service';
import { MailModule } from './../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [TeachingInterviewService],
  controllers: [TeachingInterviewController]
})
export class TeachingInterviewModule {}
