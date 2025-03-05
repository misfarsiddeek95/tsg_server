import { Test, TestingModule } from '@nestjs/testing';
import { SessionTrackerService } from './session-tracker.service';

describe('SessionTrackerService', () => {
  let service: SessionTrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionTrackerService],
    }).compile();

    service = module.get<SessionTrackerService>(SessionTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
