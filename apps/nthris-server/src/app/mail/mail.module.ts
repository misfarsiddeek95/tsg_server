import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  providers: [MailService],
  imports: [
    SendGridModule.forRoot({
      apiKey: process.env.NX_SENDGRID_KEY
    })
  ],
  exports: [MailService]
})
export class MailModule {}
