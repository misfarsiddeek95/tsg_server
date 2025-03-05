import { Test, TestingModule } from '@nestjs/testing';
import { LmsController } from './fas-lms.controller';

describe('LmasController', () => {
  let controller: LmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LmsController]
    }).compile();

    controller = module.get<LmsController>(LmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
