import { Test, TestingModule } from '@nestjs/testing';
import { CandidateMasterService } from './candidate-master.service';

describe('CandidateMasterService', () => {
  let service: CandidateMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidateMasterService]
    }).compile();

    service = module.get<CandidateMasterService>(CandidateMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
