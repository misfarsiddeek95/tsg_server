import { Test, TestingModule } from '@nestjs/testing';
import { HrisFiltersController } from './hris-filters.controller';

describe('HrisFiltersController', () => {
  let controller: HrisFiltersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HrisFiltersController],
    }).compile();

    controller = module.get<HrisFiltersController>(HrisFiltersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
