import { Module } from '@nestjs/common';
import { InterviewerController } from './interviewer.controller';
import { InterviewerService } from './interviewer.service';
import { PiListService } from './pi-list/pi-list.service';
import { PiListController } from './pi-list/pi-list.controller';
import { PiListModule } from './pi-list/pi-list.module';
import { RouterModule } from '@nestjs/core';
import { MailService } from '@sendgrid/mail';
import { MailModule } from '../mail/mail.module';
import { FasController } from './fas/fas.controller';
import { FasService } from './fas/fas.service';
import { FasModule } from './fas/fas.module';
import { MasterViewModule } from './master-view/master-view.module';

@Module({
  controllers: [InterviewerController, PiListController, FasController],
  providers: [InterviewerService, PiListService, MailService, FasService],
  imports: [
    MailModule,
    PiListModule,
    RouterModule.register([{ path: 'interviewer', module: PiListModule }]),
    MasterViewModule
  ]
})
export class InterviewerModule {}
