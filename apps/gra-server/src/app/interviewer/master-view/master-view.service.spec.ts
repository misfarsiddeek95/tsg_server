import { Test, TestingModule } from '@nestjs/testing';
import { MasterViewService } from './master-view.service';

describe('MasterViewService', () => {
  let service: MasterViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterViewService],
    }).compile();

    service = module.get<MasterViewService>(MasterViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
