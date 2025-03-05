import { Test, TestingModule } from '@nestjs/testing';
import { DocumentMasterService } from './document-master.service';

describe('DocumentMasterService', () => {
  let service: DocumentMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentMasterService]
    }).compile();

    service = module.get<DocumentMasterService>(DocumentMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
