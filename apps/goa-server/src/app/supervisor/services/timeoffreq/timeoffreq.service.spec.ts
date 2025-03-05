import { Test, TestingModule } from '@nestjs/testing';
import { TimeoffreqService } from './timeoffreq.service';

describe('TimeoffreqService', () => {
  let service: TimeoffreqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeoffreqService],
    }).compile();

    service = module.get<TimeoffreqService>(TimeoffreqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
