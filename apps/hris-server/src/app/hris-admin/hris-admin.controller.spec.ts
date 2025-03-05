import { Test, TestingModule } from '@nestjs/testing';
import { HrisAdminController } from './hris-admin.controller';
import { HrisAdminService } from './hris-admin.service';

describe('HrisAdminController', () => {
  let controller: HrisAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HrisAdminController],
      providers: [HrisAdminService]
    }).compile();

    controller = module.get<HrisAdminController>(HrisAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
