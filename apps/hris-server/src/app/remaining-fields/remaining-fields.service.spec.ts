import { Test, TestingModule } from '@nestjs/testing';
import { RemainingFieldsService } from './remaining-fields.service';

describe('RemainingFieldsService', () => {
  let service: RemainingFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemainingFieldsService],
    }).compile();

    service = module.get<RemainingFieldsService>(RemainingFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
