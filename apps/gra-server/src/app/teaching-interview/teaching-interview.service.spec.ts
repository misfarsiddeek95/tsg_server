import { Test, TestingModule } from '@nestjs/testing';
import { TeachingInterviewService } from './teaching-interview.service';

describe('TeachingInterviewService', () => {
  let service: TeachingInterviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachingInterviewService],
    }).compile();

    service = module.get<TeachingInterviewService>(TeachingInterviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
