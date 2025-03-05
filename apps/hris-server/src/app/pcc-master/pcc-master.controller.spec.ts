import { Test, TestingModule } from '@nestjs/testing';
import { PccMasterController } from './pcc-master.controller';

describe('PccMasterController', () => {
  let controller: PccMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PccMasterController],
    }).compile();

    controller = module.get<PccMasterController>(PccMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
