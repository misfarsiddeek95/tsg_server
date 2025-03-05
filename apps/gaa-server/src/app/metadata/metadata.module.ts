import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  controllers: [MetadataController],
  providers: [MetadataService],
  imports: [PrismaModule],
})
export class MetadataModule {}
