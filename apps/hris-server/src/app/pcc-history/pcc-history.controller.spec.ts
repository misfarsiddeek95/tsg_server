import { Test, TestingModule } from '@nestjs/testing';
import { PccHistoryController } from './pcc-history.controller';

describe('PccHistoryController', () => {
  let controller: PccHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PccHistoryController],
    }).compile();

    controller = module.get<PccHistoryController>(PccHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
