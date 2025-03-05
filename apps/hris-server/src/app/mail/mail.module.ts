import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [
    SendGridModule.forRoot({
      apiKey: process.env.NX_SENDGRID_KEY
    })
  ],
  exports: [MailService]
})
export class MailModule {}
