import { Test, TestingModule } from '@nestjs/testing';
import { HardwareInternetController } from './hardware-internet.controller';

describe('HardwareInternetController', () => {
  let controller: HardwareInternetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HardwareInternetController],
    }).compile();

    controller = module.get<HardwareInternetController>(HardwareInternetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
