import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    ConfigModule.forRoot(),
    SendGridModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get('NX_SENDGRID_KEY')
      })
    })
  ],
  exports: [EmailService]
})
export class EmailModule {}
