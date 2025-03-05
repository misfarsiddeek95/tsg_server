import { Module } from '@nestjs/common';
import { SimsMasterTableService } from './sims-master-table.service';
import { SimsMasterTableController } from './sims-master-table.controller';
import { PrismaService } from '../../prisma.service';
import { SimsEmailModule } from '../sims-email/sims-email.module';

@Module({
  controllers: [SimsMasterTableController],
  providers: [SimsMasterTableService, PrismaService],
  imports: [SimsEmailModule]
})
export class SimsMasterTableModule {}
