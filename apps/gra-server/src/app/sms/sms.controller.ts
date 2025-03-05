import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('sms')
export class SmsController {
  constructor(private sms: SmsService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP' })
  async sendSMS(@Body() body: { mobileNumber: string }) {
    const { mobileNumber } = body;

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('sms-otp-code:', code);
    try {
      return await this.sms.sendSMS(mobileNumber, code);
    } catch (error) {
      return { success: false, error };
    }
  }
}
