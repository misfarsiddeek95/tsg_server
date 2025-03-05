import { Module } from '@nestjs/common';
import { ExportHubController } from './export-hub.controller';
import { ExportHubService } from './export-hub.service';

@Module({
  controllers: [ExportHubController],
  providers: [ExportHubService]
})
export class ExportHubModule {}
