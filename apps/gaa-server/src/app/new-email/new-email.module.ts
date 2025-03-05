import { Module } from '@nestjs/common';
import { NewEmailService } from './new-email.service';
import { NewEmailController } from './new-email.controller';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  controllers: [NewEmailController],
  providers: [NewEmailService],
  imports: [
    SendGridModule.forRoot({
      apiKey: process.env['NX_SENDGRID_KEY']
    })
  ],
  exports: [NewEmailService]
})
export class NewEmailModule {}
