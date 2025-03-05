import { Controller, Get } from '@nestjs/common';
import { LmsCron } from './lms-cron.cron';

@Controller('talent-lms-cron')
export class LmsCronController {
  constructor(private cron: LmsCron) {}

  @Get('trigger-cron')
  async lmsCron() {
    return this.cron.lmsCron();
  }

  @Get('trigger-gsheet')
  async lmsGsheet() {
    return this.cron.lmsGsheet();
  }
}
