import { Test, TestingModule } from '@nestjs/testing';
import { SessionInvestigationService } from './session-investigation.service';

describe('SessionInvestigationService', () => {
  let service: SessionInvestigationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionInvestigationService],
    }).compile();

    service = module.get<SessionInvestigationService>(SessionInvestigationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
