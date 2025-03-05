import { Module } from '@nestjs/common';
import { SimsEmailService } from './sims-email.service';
import { SimsEmailController } from './sims-email.controller';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [SimsEmailController],
  providers: [SimsEmailService, PrismaService],
  imports: [
    SendGridModule.forRoot({
      apiKey: process.env['NX_SENDGRID_KEY']
    })
  ],
  exports: [SimsEmailService]
})
export class SimsEmailModule {}
