import { Module } from '@nestjs/common';
import { HrisFiltersService } from './hris-filters.service';
import { HrisFiltersController } from './hris-filters.controller';

@Module({
  controllers: [HrisFiltersController],
  providers: [HrisFiltersService]
})
export class HrisFiltersModule {}
