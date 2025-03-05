import { Test, TestingModule } from '@nestjs/testing';
import { NewEmailService } from './new-email.service';

describe('NewEmailService', () => {
  let service: NewEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewEmailService],
    }).compile();

    service = module.get<NewEmailService>(NewEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
