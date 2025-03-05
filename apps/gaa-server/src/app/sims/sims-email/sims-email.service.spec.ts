import { Test, TestingModule } from '@nestjs/testing';
import { SimsEmailService } from './sims-email.service';

describe('SimsEmailService', () => {
  let service: SimsEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimsEmailService],
    }).compile();

    service = module.get<SimsEmailService>(SimsEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
