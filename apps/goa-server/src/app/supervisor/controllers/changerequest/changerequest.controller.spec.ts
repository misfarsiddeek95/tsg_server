import { Test, TestingModule } from '@nestjs/testing';
import { ChangerequestController } from './changerequest.controller';

describe('ChangerequestController', () => {
  let controller: ChangerequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangerequestController],
    }).compile();

    controller = module.get<ChangerequestController>(ChangerequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
