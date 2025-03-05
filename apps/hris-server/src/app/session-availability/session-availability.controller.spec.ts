import { Test, TestingModule } from '@nestjs/testing';
import { SessionAvailabilityController } from './session-availability.controller';

describe('SessionAvailabilityController', () => {
  let controller: SessionAvailabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionAvailabilityController],
    }).compile();

    controller = module.get<SessionAvailabilityController>(SessionAvailabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
