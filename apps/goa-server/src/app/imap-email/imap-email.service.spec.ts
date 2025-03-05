import { Test, TestingModule } from '@nestjs/testing';
import { ImapEmailService } from './imap-email.service';

describe('ImapEmailService', () => {
  let service: ImapEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImapEmailService],
    }).compile();

    service = module.get<ImapEmailService>(ImapEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
