import { Test, TestingModule } from '@nestjs/testing';
import { ITMasterController } from './it-master.controller';

describe('PccMasterController', () => {
  let controller: ITMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ITMasterController]
    }).compile();

    controller = module.get<ITMasterController>(ITMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
