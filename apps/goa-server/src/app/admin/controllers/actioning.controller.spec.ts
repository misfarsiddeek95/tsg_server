import { Test, TestingModule } from '@nestjs/testing';
import { ActioningController } from './actioning.controller';

describe('ActioningController', () => {
  let controller: ActioningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActioningController]
    }).compile();

    controller = module.get<ActioningController>(ActioningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
