import { Test, TestingModule } from '@nestjs/testing';
import { ChangereqController } from './changereq.controller';

describe('ChangereqController', () => {
  let controller: ChangereqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangereqController],
    }).compile();

    controller = module.get<ChangereqController>(ChangereqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
