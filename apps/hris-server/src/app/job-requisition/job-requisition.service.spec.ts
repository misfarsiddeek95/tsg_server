import { Test, TestingModule } from '@nestjs/testing';
import { JobRequisitionService } from './job-requisition.service';

describe('JobRequisitionService', () => {
  let service: JobRequisitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobRequisitionService],
    }).compile();

    service = module.get<JobRequisitionService>(JobRequisitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
