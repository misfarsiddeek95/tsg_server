import { Test, TestingModule } from '@nestjs/testing';
import { InfoDiscrepanciesService } from './info-discrepancies.service';

describe('InfoDiscrepanciesService', () => {
  let service: InfoDiscrepanciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfoDiscrepanciesService],
    }).compile();

    service = module.get<InfoDiscrepanciesService>(InfoDiscrepanciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
