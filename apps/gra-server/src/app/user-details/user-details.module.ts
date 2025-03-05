import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import { EducationService } from '../user/services/education.service';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { UserDetailsController } from './user-details.controller';
import { UserDetailsService } from './user-details.service';

@Module({
  imports: [UserModule],
  providers: [UserDetailsService, MailService],
  controllers: [UserDetailsController],
  exports: [UserDetailsService]
})
export class UserDetailsModule {}
