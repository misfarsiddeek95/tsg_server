import { Module } from '@nestjs/common';
import { EducationDetailsController } from './education-details.controller';
import { EducationDetailsService } from './education-details.service';

@Module({
  controllers: [EducationDetailsController],
  providers: [EducationDetailsService]
})
export class EducationDetailsModule {}
