import { Module } from '@nestjs/common';
import { JobRequisitionController } from './job-requisition.controller';
import { JobRequisitionService } from './job-requisition.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [JobRequisitionController],
  providers: [JobRequisitionService, MailService]
})
export class JobRequisitionModule {}
