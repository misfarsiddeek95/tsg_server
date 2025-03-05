import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalQualificationsService } from './professional-qualifications.service';

describe('ProfessionalQualificationsService', () => {
  let service: ProfessionalQualificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionalQualificationsService],
    }).compile();

    service = module.get<ProfessionalQualificationsService>(ProfessionalQualificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
