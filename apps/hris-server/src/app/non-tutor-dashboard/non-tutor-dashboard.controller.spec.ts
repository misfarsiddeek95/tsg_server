import { Test, TestingModule } from '@nestjs/testing';
import { NonTutorDashboardController } from './non-tutor-dashboard.controller';

describe('NonTutorDashboardController', () => {
  let controller: NonTutorDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NonTutorDashboardController],
    }).compile();

    controller = module.get<NonTutorDashboardController>(NonTutorDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
