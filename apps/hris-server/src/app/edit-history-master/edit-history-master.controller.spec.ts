import { Test, TestingModule } from '@nestjs/testing';
import { EditHistoryMasterController } from './edit-history-master.controller';

describe('EditHistoryMasterController', () => {
  let controller: EditHistoryMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditHistoryMasterController],
    }).compile();

    controller = module.get<EditHistoryMasterController>(EditHistoryMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
