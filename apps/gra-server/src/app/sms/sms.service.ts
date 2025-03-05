import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  // Encrypt the code
  async encrypt(code, key) {
    let encrypted = '';
    for (let i = 0; i < code.length; i++) {
      // XOR each character's char code with the corresponding key char code
      encrypted += String.fromCharCode(
        code.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted); // Convert to Base64 for safe storage/transfer
  }

  async sendSMS(mobileNumber: string, code: string) {
    try {
      const response = await axios.post('https://app.notify.lk/api/v1/send', {
        user_id: '25457',
        api_key: process.env.NX_SMS_KEY,
        sender_id: 'TSG HR',
        to: mobileNumber,
        message: `Your verification code is: ${code}`
      });

      if (response.data.status === 'success') {
        const otp = await this.encrypt(code, process.env.NX_SMS_SECRET);
        return {
          status: true,
          message: 'SMS sent successfully!',
          code: otp
        };
      } else {
        throw new HttpException('Failed to send SMS.', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        `An error occurred while sending SMS: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
