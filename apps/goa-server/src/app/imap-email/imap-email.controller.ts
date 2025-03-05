import { Body, Controller, Get, Post } from '@nestjs/common';
import { ImapEmailService } from './imap-email.service';
import { USSessionDto } from './dto';

@Controller('imap-email')
export class ImapEmailController {
  constructor(private readonly imapEmailService: ImapEmailService) {}

  @Get('read')
  async readEmail() {
    await this.imapEmailService.readEmail();
    return 'Email read process started';
  }

  // @Post('save')
  // async saveData(@Body() usSessionDto: USSessionDto[]) {
  //   return await this.imapEmailService.saveData(usSessionDto);
  // }
}
