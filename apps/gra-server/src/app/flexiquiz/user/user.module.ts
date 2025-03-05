import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ExamService } from '../exam/exam.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'MVd6WWsxZ1RPTWowU0pOSlRPTnhHallaV2pUMFN2ai5RR0JfTWRFWU5Q',
      signOptions: { expiresIn: '60000s' }
    })
  ],
  controllers: [UserController],
  providers: [UserService, ExamService],
  exports: [UserService]
})
export class UserModule {}
