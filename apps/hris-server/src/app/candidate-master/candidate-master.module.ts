import { Module } from '@nestjs/common';
import { CandidateMasterController } from './candidate-master.controller';
import { CandidateMasterService } from './candidate-master.service';

@Module({
  controllers: [CandidateMasterController],
  providers: [CandidateMasterService]
})
export class CandidateMasterModule {}
