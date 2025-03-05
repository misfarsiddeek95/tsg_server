import { Test, TestingModule } from '@nestjs/testing';
import { ITMasterService } from './it-master.service';

describe('ITMasterService', () => {
  let service: ITMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ITMasterService]
    }).compile();

    service = module.get<ITMasterService>(ITMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
