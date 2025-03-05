import { Module } from '@nestjs/common';
import { MailModule } from '../../mail/mail.module';
import { PrismaService } from '../../prisma.service';
import { ExamService } from '../exam/exam.service';
import { UserModule } from '../user/user.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [UserModule, MailModule],
  controllers: [WebhookController],
  providers: [WebhookService, ExamService]
})
export class WebhookModule {}
