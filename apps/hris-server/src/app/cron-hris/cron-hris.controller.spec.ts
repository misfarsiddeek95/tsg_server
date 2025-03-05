import { Test, TestingModule } from '@nestjs/testing';
import { CronHrisController } from './cron-hris.controller';

describe('CronHrisController', () => {
  let controller: CronHrisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronHrisController]
    }).compile();

    controller = module.get<CronHrisController>(CronHrisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
