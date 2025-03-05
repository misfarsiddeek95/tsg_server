import { Test, TestingModule } from '@nestjs/testing';
import { ChangerequestService } from './changerequest.service';

describe('ChangerequestService', () => {
  let service: ChangerequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangerequestService],
    }).compile();

    service = module.get<ChangerequestService>(ChangerequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
