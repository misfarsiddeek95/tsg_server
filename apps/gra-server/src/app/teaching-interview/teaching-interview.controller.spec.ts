import { Test, TestingModule } from '@nestjs/testing';
import { TeachingInterviewController } from './teaching-interview.controller';

describe('TeachingInterviewController', () => {
  let controller: TeachingInterviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingInterviewController],
    }).compile();

    controller = module.get<TeachingInterviewController>(TeachingInterviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
