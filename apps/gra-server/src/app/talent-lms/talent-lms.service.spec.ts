import { Test, TestingModule } from '@nestjs/testing';
import { TalentLmsService } from './talent-lms.service';

describe('TalentLmsService', () => {
  let service: TalentLmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalentLmsService],
    }).compile();

    service = module.get<TalentLmsService>(TalentLmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
