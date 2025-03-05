import { Test, TestingModule } from '@nestjs/testing';
import { PiListController } from './pi-list.controller';

describe('PiListController', () => {
  let controller: PiListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PiListController],
    }).compile();

    controller = module.get<PiListController>(PiListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
