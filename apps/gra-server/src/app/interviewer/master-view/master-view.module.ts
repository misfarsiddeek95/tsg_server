import { Module } from '@nestjs/common';
import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../prisma.service';
import { MasterViewController } from './master-view.controller';
import { MasterViewService } from './master-view.service';

@Module({
  controllers: [MasterViewController],
  providers: [MasterViewService, MailService]
})
export class MasterViewModule {}
