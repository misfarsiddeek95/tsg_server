import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.stategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stategy';
import { MailModule } from './../mail/mail.module';
import { FlexiquizModule } from '../flexiquiz/flexiquiz.module';
import { UserService } from '../flexiquiz/user/user.service';
import { UserModule } from '../flexiquiz/user/user.module';
import { ExamService } from '../flexiquiz/exam/exam.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'tsg@devs',
      signOptions: { expiresIn: '60000s' }
    }),
    MailModule,
    FlexiquizModule,
    UserModule
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserService,
    ExamService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
