import { Module } from '@nestjs/common';
import { SimsUserAccessService } from './sims-user-access.service';
import { SimsUserAccessController } from './sims-user-access.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [SimsUserAccessController],
  providers: [SimsUserAccessService, PrismaService]
})
export class SimsUserAccessModule {}
