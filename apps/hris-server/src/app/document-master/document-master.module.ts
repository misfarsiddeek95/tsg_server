import { Module } from '@nestjs/common';
import { DocumentMasterController } from './document-master.controller';
import { DocumentMasterService } from './document-master.service';

@Module({
  controllers: [DocumentMasterController],
  providers: [DocumentMasterService]
})
export class DocumentMasterModule {}
