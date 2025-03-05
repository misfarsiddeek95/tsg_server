import { Module } from '@nestjs/common';
import { PccMasterController } from './pcc-master.controller';
import { PccMasterService } from './pcc-master.service';

@Module({
  controllers: [PccMasterController],
  providers: [PccMasterService]
})
export class PccMasterModule {}
