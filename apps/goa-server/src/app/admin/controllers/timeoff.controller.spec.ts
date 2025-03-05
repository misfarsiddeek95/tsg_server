import { Test, TestingModule } from '@nestjs/testing';
import { TimeoffController } from './timeoff.controller';

describe('TimeoffController', () => {
  let controller: TimeoffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeoffController],
    }).compile();

    controller = module.get<TimeoffController>(TimeoffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
