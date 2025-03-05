import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { FlexiquizController } from './flexiquiz.controller';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';
import { ExamController } from './exam/exam.controller';
import { ExamService } from './exam/exam.service';
import { ExamModule } from './exam/exam.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    WebhookModule,
    UserModule,
    ExamModule,
    RouterModule.register([
      { path: 'flexiquiz', module: WebhookModule },
      { path: 'flexiquiz', module: UserModule },
      { path: 'flexiquiz', module: ExamModule }
    ])
  ],
  controllers: [FlexiquizController, ExamController],
  exports: [UserModule],
  providers: [ExamService]
})
export class FlexiquizModule {}
