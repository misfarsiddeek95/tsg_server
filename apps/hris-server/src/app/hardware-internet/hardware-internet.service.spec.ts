import { Test, TestingModule } from '@nestjs/testing';
import { HardwareInternetService } from './hardware-internet.service';

describe('HardwareInternetService', () => {
  let service: HardwareInternetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HardwareInternetService],
    }).compile();

    service = module.get<HardwareInternetService>(HardwareInternetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
