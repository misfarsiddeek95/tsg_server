import { Test, TestingModule } from '@nestjs/testing';
import { TalentLmsController } from './talent-lms.controller';

describe('TalentLmsController', () => {
  let controller: TalentLmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalentLmsController],
    }).compile();

    controller = module.get<TalentLmsController>(TalentLmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
