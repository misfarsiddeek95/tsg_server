import { Test, TestingModule } from '@nestjs/testing';
import { SessionEvaluationService } from './session-evaluation.service';

describe('SessionEvaluationService', () => {
  let service: SessionEvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionEvaluationService],
    }).compile();

    service = module.get<SessionEvaluationService>(SessionEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
