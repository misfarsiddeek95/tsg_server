import { Module } from '@nestjs/common';
import { RecruitmentMasterController } from './recruitment-master.controller';
import { RecruitmentMasterService } from './recruitment-master.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [RecruitmentMasterService],
  controllers: [RecruitmentMasterController],
  exports: [RecruitmentMasterService]
})
export class RecruitmentMasterModule {}
