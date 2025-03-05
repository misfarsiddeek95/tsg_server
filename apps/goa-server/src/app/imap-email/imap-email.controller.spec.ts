import { Test, TestingModule } from '@nestjs/testing';
import { ImapEmailController } from './imap-email.controller';

describe('ImapEmailController', () => {
  let controller: ImapEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImapEmailController],
    }).compile();

    controller = module.get<ImapEmailController>(ImapEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
