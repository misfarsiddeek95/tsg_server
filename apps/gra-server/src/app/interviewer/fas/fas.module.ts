import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FasController } from './fas.controller';
import { FasService } from './fas.service';

@Module({
  providers: [FasService],
  controllers: [FasController],
  exports: [FasService]
})
export class FasModule {}
