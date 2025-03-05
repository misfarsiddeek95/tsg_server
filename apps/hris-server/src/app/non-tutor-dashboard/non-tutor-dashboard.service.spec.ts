import { Test, TestingModule } from '@nestjs/testing';
import { NonTutorDashboardService } from './non-tutor-dashboard.service';

describe('NonTutorDashboardService', () => {
  let service: NonTutorDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NonTutorDashboardService],
    }).compile();

    service = module.get<NonTutorDashboardService>(NonTutorDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
