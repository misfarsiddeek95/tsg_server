import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { JwtStrategy } from '../auth/jwt.stategy';
import { DirectoryModule } from './directory/directory.module';
import { SettingsService } from '../settings/settings.service';

@Module({
  imports: [JwtModule.register({}), DirectoryModule],
  controllers: [],
  providers: [MailService, JwtStrategy, SettingsService]
})
export class TutorModule {}
