import { Module } from '@nestjs/common';
import { PendingApprovalsController } from './pending-approvals.controller';
import { PendingApprovalsService } from './pending-approvals.service';

@Module({
  controllers: [PendingApprovalsController],
  providers: [PendingApprovalsService]
})
export class PendingApprovalsModule {}
