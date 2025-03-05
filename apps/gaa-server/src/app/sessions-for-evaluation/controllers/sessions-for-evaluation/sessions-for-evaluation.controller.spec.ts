import { Test, TestingModule } from '@nestjs/testing';
import { SessionsForEvaluationController } from './sessions-for-evaluation.controller';

describe('SessionsForEvaluationController', () => {
  let controller: SessionsForEvaluationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsForEvaluationController],
    }).compile();

    controller = module.get<SessionsForEvaluationController>(SessionsForEvaluationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
