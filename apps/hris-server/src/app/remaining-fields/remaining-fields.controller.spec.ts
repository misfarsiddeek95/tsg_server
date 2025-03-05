import { Test, TestingModule } from '@nestjs/testing';
import { RemainingFieldsController } from './remaining-fields.controller';

describe('RemainingFieldsController', () => {
  let controller: RemainingFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemainingFieldsController],
    }).compile();

    controller = module.get<RemainingFieldsController>(RemainingFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
