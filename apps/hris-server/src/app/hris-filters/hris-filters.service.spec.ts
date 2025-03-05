import { Test, TestingModule } from '@nestjs/testing';
import { HrisFiltersService } from './hris-filters.service';

describe('HrisFiltersService', () => {
  let service: HrisFiltersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HrisFiltersService],
    }).compile();

    service = module.get<HrisFiltersService>(HrisFiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
