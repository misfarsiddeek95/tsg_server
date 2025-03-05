import { Test, TestingModule } from '@nestjs/testing';
import { CandidateMasterController } from './candidate-master.controller';

describe('CandidateMasterController', () => {
  let controller: CandidateMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateMasterController],
    }).compile();

    controller = module.get<CandidateMasterController>(CandidateMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
