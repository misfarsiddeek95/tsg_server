import { Module } from '@nestjs/common';
import { AdminSidebarController } from './admin-sidebar.controller';
import { AdminSidebarService } from './admin-sidebar.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [AdminSidebarController],
  providers: [AdminSidebarService, PrismaService]
})
export class AdminSidebarModule {}
