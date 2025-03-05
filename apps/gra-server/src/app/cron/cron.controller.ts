import { Controller, Get, Param, Query } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
  constructor(private cron: CronService) {}

  @Get('trigger-cron')
  async getTriggerCron(
    @Query() { type, tspId }: { type: string; tspId: string }
  ) {
    return this.cron.triggerCron(type, tspId);
  }

  @Get('test-cron')
  async testCron() {
    return this.cron.handleCronEsaBookingReminder48h();
  }

  @Get('trigger-cron-apss-cover-conversion')
  async handleCronApssCoverConversion() {
    return this.cron.handleCronApssCoverConversion();
  }

  @Get('trigger-cron-test-run-queue')
  async handleCronTestRunQueue() {
    return this.cron.handleCronTestRunQueue();
  }

  @Get('trigger-cron-application-form-connector')
  async handleCronApplicationFormConnector() {
    return this.cron.handleCronApplicationFormConnector();
  }

  @Get('trigger-cron-lms-completion-update')
  async handleCronLmsCompletionUpdate() {
    return this.cron.handleCronLmsCompletionUpdate();
  }
}
