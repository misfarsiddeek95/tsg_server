import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsController } from './settings.controller';

@Module({
  providers: [SettingsService, PrismaService],
  controllers: [SettingsController],
  exports: [SettingsService]
})
export class SettingsModule {}
