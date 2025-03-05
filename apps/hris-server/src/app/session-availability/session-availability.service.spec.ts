import { Test, TestingModule } from '@nestjs/testing';
import { SessionAvailabilityService } from './session-availability.service';

describe('SessionAvailabilityService', () => {
  let service: SessionAvailabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionAvailabilityService],
    }).compile();

    service = module.get<SessionAvailabilityService>(SessionAvailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
