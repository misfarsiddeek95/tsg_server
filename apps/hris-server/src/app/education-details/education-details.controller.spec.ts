import { Test, TestingModule } from '@nestjs/testing';
import { EducationDetailsController } from './education-details.controller';

describe('EducationDetailsController', () => {
  let controller: EducationDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationDetailsController],
    }).compile();

    controller = module.get<EducationDetailsController>(EducationDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
