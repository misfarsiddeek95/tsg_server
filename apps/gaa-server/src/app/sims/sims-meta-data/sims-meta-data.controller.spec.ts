import { Test, TestingModule } from '@nestjs/testing';
import { SimsMetaDataController } from './sims-meta-data.controller';
import { SimsMetaDataService } from './sims-meta-data.service';

describe('SimsMetaDataController', () => {
  let controller: SimsMetaDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimsMetaDataController],
      providers: [SimsMetaDataService],
    }).compile();

    controller = module.get<SimsMetaDataController>(SimsMetaDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
