import { Module } from '@nestjs/common';
import { ImapEmailService } from './imap-email.service';
import { ImapEmailController } from './imap-email.controller';

@Module({
  providers: [ImapEmailService],
  controllers: [ImapEmailController]
})
export class ImapEmailModule {}
