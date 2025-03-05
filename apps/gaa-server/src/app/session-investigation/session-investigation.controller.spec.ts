import { Test, TestingModule } from '@nestjs/testing';
import { SessionInvestigationController } from './session-investigation.controller';
import { SessionInvestigationService } from './session-investigation.service';

describe('SessionInvestigationController', () => {
  let controller: SessionInvestigationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionInvestigationController],
      providers: [SessionInvestigationService],
    }).compile();

    controller = module.get<SessionInvestigationController>(SessionInvestigationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
