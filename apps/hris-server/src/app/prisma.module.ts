import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // this will available in all the modules access
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
