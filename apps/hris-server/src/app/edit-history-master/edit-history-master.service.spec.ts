import { Test, TestingModule } from '@nestjs/testing';
import { EditHistoryMasterService } from './edit-history-master.service';

describe('EditHistoryMasterService', () => {
  let service: EditHistoryMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditHistoryMasterService],
    }).compile();

    service = module.get<EditHistoryMasterService>(EditHistoryMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
