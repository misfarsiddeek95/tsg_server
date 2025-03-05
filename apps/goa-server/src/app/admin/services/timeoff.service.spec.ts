import { Test, TestingModule } from '@nestjs/testing';
import { TimeoffService } from './timeoff.service';

describe('TimeoffService', () => {
  let service: TimeoffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeoffService],
    }).compile();

    service = module.get<TimeoffService>(TimeoffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
