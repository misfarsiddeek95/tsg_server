import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalQualificationsController } from './professional-qualifications.controller';

describe('ProfessionalQualificationsController', () => {
  let controller: ProfessionalQualificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalQualificationsController],
    }).compile();

    controller = module.get<ProfessionalQualificationsController>(ProfessionalQualificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
