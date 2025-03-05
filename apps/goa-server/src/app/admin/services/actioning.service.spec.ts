import { Test, TestingModule } from '@nestjs/testing';
import { ActioningService } from './actioning.service';

describe('ActioningService', () => {
  let service: ActioningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActioningService]
    }).compile();

    service = module.get<ActioningService>(ActioningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
