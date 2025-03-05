import { Test, TestingModule } from '@nestjs/testing';
import { SimsMasterTableService } from './sims-master-table.service';

describe('SimsMasterTableService', () => {
  let service: SimsMasterTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimsMasterTableService],
    }).compile();

    service = module.get<SimsMasterTableService>(SimsMasterTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
