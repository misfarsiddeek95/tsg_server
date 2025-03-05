import { Test, TestingModule } from '@nestjs/testing';
import { HealthDeclarationService } from './health-declaration.service';

describe('HealthDeclarationService', () => {
  let service: HealthDeclarationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthDeclarationService],
    }).compile();

    service = module.get<HealthDeclarationService>(HealthDeclarationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
