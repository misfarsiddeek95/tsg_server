import { Test, TestingModule } from '@nestjs/testing';
import { GraApplicationService } from './gra-application.service';

describe('GraApplicationService', () => {
  let service: GraApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraApplicationService]
    }).compile();

    service = module.get<GraApplicationService>(GraApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
