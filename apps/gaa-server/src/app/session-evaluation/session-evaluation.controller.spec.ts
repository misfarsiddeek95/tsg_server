import { Test, TestingModule } from '@nestjs/testing';
import { SessionEvaluationController } from './session-evaluation.controller';
import { SessionEvaluationService } from './session-evaluation.service';

describe('SessionEvaluationController', () => {
  let controller: SessionEvaluationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionEvaluationController],
      providers: [SessionEvaluationService],
    }).compile();

    controller = module.get<SessionEvaluationController>(SessionEvaluationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
