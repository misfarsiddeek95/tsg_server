import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { MailService } from '../../mail/mail.service';
import { JwtStrategy } from '../../auth/jwt.stategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [LeaveController],
  providers: [LeaveService, MailService, JwtStrategy]
})
export class LeaveModule {}
