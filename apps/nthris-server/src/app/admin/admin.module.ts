import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { JwtStrategy } from '../auth/jwt.stategy';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [JwtModule.register({}), ProfileModule],
  controllers: [],
  providers: [MailService, JwtStrategy]
})
export class AdminModule {}
