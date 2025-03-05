import { Test, TestingModule } from '@nestjs/testing';
import { FasService } from './fas.service';

describe('FasService', () => {
  let service: FasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FasService],
    }).compile();

    service = module.get<FasService>(FasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
