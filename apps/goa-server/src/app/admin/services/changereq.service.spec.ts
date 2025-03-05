import { Test, TestingModule } from '@nestjs/testing';
import { ChangereqService } from './changereq.service';

describe('ChangereqService', () => {
  let service: ChangereqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangereqService],
    }).compile();

    service = module.get<ChangereqService>(ChangereqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
