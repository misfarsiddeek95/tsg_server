import { Test, TestingModule } from '@nestjs/testing';
import { FlexiquizController } from './flexiquiz.controller';

describe('FlexiquizController', () => {
  let controller: FlexiquizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlexiquizController],
    }).compile();

    controller = module.get<FlexiquizController>(FlexiquizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
