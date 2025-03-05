import { Test, TestingModule } from '@nestjs/testing';
import { AdditionalDocumentsTbService } from './additional-documents-tb.service';

describe('AdditionalDocumentsTbService', () => {
  let service: AdditionalDocumentsTbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdditionalDocumentsTbService],
    }).compile();

    service = module.get<AdditionalDocumentsTbService>(AdditionalDocumentsTbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
