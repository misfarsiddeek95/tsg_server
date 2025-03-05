import { Module } from '@nestjs/common';

import { EditHistoryMasterController } from './edit-history-master.controller';
import { EditHistoryMasterService } from './edit-history-master.service';

@Module({
  controllers: [EditHistoryMasterController],
  providers: [EditHistoryMasterService]
})
export class EditHistoryMasterModule {}
