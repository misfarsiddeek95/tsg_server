import { Test, TestingModule } from '@nestjs/testing';
import { TslIntegrationService } from './tsl-integration.service';

describe('TslIntegrationService', () => {
  let service: TslIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TslIntegrationService],
    }).compile();

    service = module.get<TslIntegrationService>(TslIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
