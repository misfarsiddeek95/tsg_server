import { Test, TestingModule } from '@nestjs/testing';
import { HrisAdminService } from './hris-admin.service';

describe('HrisAdminService', () => {
  let service: HrisAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HrisAdminService]
    }).compile();

    service = module.get<HrisAdminService>(HrisAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
