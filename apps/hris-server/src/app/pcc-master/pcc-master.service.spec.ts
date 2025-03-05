import { Test, TestingModule } from '@nestjs/testing';
import { PccMasterService } from './pcc-master.service';

describe('PccMasterService', () => {
  let service: PccMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PccMasterService],
    }).compile();

    service = module.get<PccMasterService>(PccMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
