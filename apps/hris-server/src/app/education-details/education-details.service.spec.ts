import { Test, TestingModule } from '@nestjs/testing';
import { EducationDetailsService } from './education-details.service';

describe('EducationDetailsService', () => {
  let service: EducationDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationDetailsService],
    }).compile();

    service = module.get<EducationDetailsService>(EducationDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
