import { Module } from '@nestjs/common';
import { SimsMetaDataService } from './sims-meta-data.service';
import { SimsMetaDataController } from './sims-meta-data.controller';

@Module({
  controllers: [SimsMetaDataController],
  providers: [SimsMetaDataService]
})
export class SimsMetaDataModule {}
