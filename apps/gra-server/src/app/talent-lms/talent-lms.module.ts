import { Module } from '@nestjs/common';
import { TalentLmsController } from './talent-lms.controller';
import { TalentLmsService } from './talent-lms.service';

@Module({
  controllers: [TalentLmsController],
  providers: [TalentLmsService]
})
export class TalentLmsModule {}
