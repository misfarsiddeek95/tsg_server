import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { NontutorModule } from './nontutor/nontutor.module';
import { TutorModule } from './tutor/tutor.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    MailModule,
    NontutorModule,
    TutorModule,
    AdminModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
