import { Test, TestingModule } from '@nestjs/testing';
import { PiListService } from './pi-list.service';

describe('PiListService', () => {
  let service: PiListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiListService],
    }).compile();

    service = module.get<PiListService>(PiListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
