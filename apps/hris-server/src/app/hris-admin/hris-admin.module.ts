import { Module } from '@nestjs/common';
import { HrisAdminService } from './hris-admin.service';
import { HrisAdminController } from './hris-admin.controller';
import { AdminSidebarModule } from './admin-sidebar/admin-sidebar.module';
import { RouterModule } from '@nestjs/core';

@Module({
  controllers: [HrisAdminController],
  providers: [HrisAdminService],
  imports: [
    AdminSidebarModule,
    RouterModule.register([{ path: 'admin', module: AdminSidebarModule }])
  ]
})
export class HrisAdminModule {}
