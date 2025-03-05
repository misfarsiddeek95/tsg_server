import { Module } from '@nestjs/common';
import { PccHistoryService } from './pcc-history.service';
import { PccHistoryController } from './pcc-history.controller';

@Module({
  controllers: [PccHistoryController],
  providers: [PccHistoryService]
})
export class PccHistoryModule {}
