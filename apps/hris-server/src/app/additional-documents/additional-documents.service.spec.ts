import { Test, TestingModule } from '@nestjs/testing';
import { AdditionalDocumentsService } from './additional-documents.service';

describe('AdditionalDocumentsService', () => {
  let service: AdditionalDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdditionalDocumentsService],
    }).compile();

    service = module.get<AdditionalDocumentsService>(AdditionalDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
