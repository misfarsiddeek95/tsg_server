import { Module } from '@nestjs/common';
import { AdditionalDocumentsTbController } from './additional-documents-tb.controller';
import { AdditionalDocumentsTbService } from './additional-documents-tb.service';

@Module({
  controllers: [AdditionalDocumentsTbController],
  providers: [AdditionalDocumentsTbService]
})
export class AdditionalDocumentsTbModule {}
