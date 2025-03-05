import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DirectoryController } from './directory.controller';
import { DirectoryService } from './directory.service';
import { MailService } from '../../mail/mail.service';
import { JwtStrategy } from '../../auth/jwt.stategy';
import { SettingsService } from '../../settings/settings.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [DirectoryController],
  providers: [DirectoryService, MailService, JwtStrategy, SettingsService]
})
export class DirectoryModule {}
