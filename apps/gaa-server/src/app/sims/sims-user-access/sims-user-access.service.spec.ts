import { Test, TestingModule } from '@nestjs/testing';
import { SimsUserAccessService } from './sims-user-access.service';

describe('SimsUserAccessService', () => {
  let service: SimsUserAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimsUserAccessService],
    }).compile();

    service = module.get<SimsUserAccessService>(SimsUserAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
