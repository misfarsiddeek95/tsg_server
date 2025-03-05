import { Module } from '@nestjs/common';
import { InfoDiscrepanciesService } from './info-discrepancies.service';
import { InfoDiscrepanciesController } from './info-discrepancies.controller';

@Module({
  providers: [InfoDiscrepanciesService],
  controllers: [InfoDiscrepanciesController]
})
export class InfoDiscrepanciesModule {}
