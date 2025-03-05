import { Module } from '@nestjs/common';
import { ITMasterController } from './it-master.controller';
import { ITMasterService } from './it-master.service';

@Module({
  controllers: [ITMasterController],
  providers: [ITMasterService]
})
export class ITMasterModule {}
