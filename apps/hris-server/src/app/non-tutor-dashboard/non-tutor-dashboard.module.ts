import { Module } from '@nestjs/common';
import { NonTutorDashboardController } from './non-tutor-dashboard.controller';
import { NonTutorDashboardService } from './non-tutor-dashboard.service';

@Module({
  controllers: [NonTutorDashboardController],
  providers: [NonTutorDashboardService]
})
export class NonTutorDashboardModule {}
