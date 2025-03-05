import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserModule } from '../../user/user.module';
import { LmsController } from './fas-lms.controller';
import { LmsService } from './fas-lms.service';

@Module({
  imports: [UserModule],
  providers: [LmsService],
  controllers: [LmsController],
  exports: [LmsService]
})
export class LmsModule {}
