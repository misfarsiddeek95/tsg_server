import { Controller, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';

@Controller('hris-mail')
export class MailController {
    constructor(private mail: MailService) {}

  @Get()
  @ApiOperation({ summary: 'Get All mail Details' })
  async sendMail() {
    try {
      await this.mail.sendEmail();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
