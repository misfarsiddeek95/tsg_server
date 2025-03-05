import { Test, TestingModule } from '@nestjs/testing';
import { InfoDiscrepanciesController } from './info-discrepancies.controller';

describe('InfoDiscrepanciesController', () => {
  let controller: InfoDiscrepanciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfoDiscrepanciesController],
    }).compile();

    controller = module.get<InfoDiscrepanciesController>(InfoDiscrepanciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
