import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AdditionalDocumentsService } from './additional-documents.service';
import { AdditionalDocumentsController } from './additional-documents.controller';
import { MailService } from '../mail/mail.service';
@Module({
  imports: [
    JwtModule.register({
      secret: 'tsg@devs',
      signOptions: { expiresIn: '604800s' }
    })
  ],
  controllers: [AdditionalDocumentsController],
  providers: [AdditionalDocumentsService, MailService]
})
export class AdditionalDocumentsModule {}
