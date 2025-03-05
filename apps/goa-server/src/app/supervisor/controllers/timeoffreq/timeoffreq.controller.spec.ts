import { Test, TestingModule } from '@nestjs/testing';
import { TimeoffreqController } from './timeoffreq.controller';

describe('TimeoffreqController', () => {
  let controller: TimeoffreqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeoffreqController],
    }).compile();

    controller = module.get<TimeoffreqController>(TimeoffreqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
