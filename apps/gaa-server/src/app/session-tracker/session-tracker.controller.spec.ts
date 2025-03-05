import { Test, TestingModule } from '@nestjs/testing';
import { SessionTrackerController } from './session-tracker.controller';

describe('SessionTrackerController', () => {
  let controller: SessionTrackerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionTrackerController],
    }).compile();

    controller = module.get<SessionTrackerController>(SessionTrackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
