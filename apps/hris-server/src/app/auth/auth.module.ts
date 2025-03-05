import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.stategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stategy';
import { PrismaService } from './../prisma.service';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'tsg@devs',
      signOptions: { expiresIn: '60000s' }
    })
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  controllers: []
})
export class AuthModule {}
