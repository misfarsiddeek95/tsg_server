import { Test, TestingModule } from '@nestjs/testing';
import { PccHistoryService } from './pcc-history.service';

describe('PccHistoryService', () => {
  let service: PccHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PccHistoryService],
    }).compile();

    service = module.get<PccHistoryService>(PccHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
