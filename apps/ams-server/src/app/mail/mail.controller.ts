import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';

@ApiTags('GRA Mail Controller')
@Controller('mail')
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

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: {
          type: 'number',
          example: 24568,
          description: 'OTP'
        }
      }
    }
  })
  async sendOtp(@Body() { otp }: { otp: string }) {
    console.log('otp --> ', otp);
    return {
      success: true
    };
  }

}
