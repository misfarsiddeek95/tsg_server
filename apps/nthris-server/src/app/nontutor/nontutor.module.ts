import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { JwtStrategy } from '../auth/jwt.stategy';
import { LeaveModule } from './leave/leave.module';
import { ProfileModule } from './profile/profile.module';
import { DirectoryModule } from './directory/directory.module';
import { SettingsService } from '../settings/settings.service';
import { CommonService } from '../common/common.service';

@Module({
  imports: [
    JwtModule.register({}),
    LeaveModule,
    ProfileModule,
    DirectoryModule
  ],
  controllers: [],
  providers: [MailService, JwtStrategy, SettingsService, CommonService]
})
export class NontutorModule {}
