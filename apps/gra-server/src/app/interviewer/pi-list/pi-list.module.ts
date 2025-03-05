import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserModule } from '../../user/user.module';
import { PiListController } from './pi-list.controller';
import { PiListService } from './pi-list.service';

@Module({
  imports: [UserModule],
  providers: [PiListService],
  controllers: [PiListController],
  exports: [PiListService]
})
export class PiListModule {}
