import { Controller, Get } from '@nestjs/common';
import { TalentLmsService } from './talent-lms.service';
@Controller('talent-lms')
export class TalentLmsController {
  constructor(private cron: TalentLmsService) {}
  @Get('processUser')
  async processUser() {
    return this.cron.processUser();
  }

  @Get('processCategory')
  async processCategory() {
    return this.cron.processCategory();
  }

  @Get('processCourseAndUnits')
  async processCourseAndUnits() {
    return this.cron.processCourseAndUnits();
  }

  @Get('addDummyRecordForNotStartedUsers')
  async addDummyRecordForNotStartedUsers() {
    return this.cron.addDummyRecordForNotStartedUsers();
  }

  @Get('processGSheet')
  async processGSheetCourses() {
    return this.cron.processGSheetCourses();
  }
}
