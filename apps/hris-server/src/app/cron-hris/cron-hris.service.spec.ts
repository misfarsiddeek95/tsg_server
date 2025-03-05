import { Test, TestingModule } from '@nestjs/testing';
import { CronHrisService } from './cron-hris.service';

describe('CronHrisService', () => {
  let service: CronHrisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronHrisService]
    }).compile();

    service = module.get<CronHrisService>(CronHrisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
