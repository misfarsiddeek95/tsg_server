import { Test, TestingModule } from '@nestjs/testing';
import { SessionsForEvaluationService } from './sessions-for-evaluation.service';

describe('SessionsForEvaluationService', () => {
  let service: SessionsForEvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsForEvaluationService],
    }).compile();

    service = module.get<SessionsForEvaluationService>(SessionsForEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
