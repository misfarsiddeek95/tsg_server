import { Test, TestingModule } from '@nestjs/testing';
import { GeneralInformationController } from './general-information.controller';

describe('GeneralInformationController', () => {
  let controller: GeneralInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralInformationController],
    }).compile();

    controller = module.get<GeneralInformationController>(GeneralInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
