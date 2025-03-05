import { Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { SlotsService } from '../slots/slots.service';
import { UserService } from '../user/service/user.service';
import { DistributionController } from './distribution.controller';
import { DistributionService } from './distribution.service';

@Module({
  controllers: [DistributionController],
  providers: [DistributionService, SlotsService, UserService, EmailService],
  exports: [DistributionService]
})
export class DistributionModule {}
