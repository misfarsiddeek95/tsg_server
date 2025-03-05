import { Test, TestingModule } from '@nestjs/testing';
import { SimsMetaDataService } from './sims-meta-data.service';

describe('SimsMetaDataService', () => {
  let service: SimsMetaDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimsMetaDataService],
    }).compile();

    service = module.get<SimsMetaDataService>(SimsMetaDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
