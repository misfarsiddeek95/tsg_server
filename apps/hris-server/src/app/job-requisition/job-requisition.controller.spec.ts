import { Test, TestingModule } from '@nestjs/testing';
import { JobRequisitionController } from './job-requisition.controller';

describe('JobRequisitionController', () => {
  let controller: JobRequisitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobRequisitionController],
    }).compile();

    controller = module.get<JobRequisitionController>(JobRequisitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
