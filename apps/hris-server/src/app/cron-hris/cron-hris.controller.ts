import { Controller, Get, Param, Query } from '@nestjs/common';
import { CronHrisService } from './cron-hris.service';

@Controller('cron-hris')
export class CronHrisController {
  constructor(private cron: CronHrisService) {}

  @Get('trigger-cron-hris-test')
  async getTriggerCronHrisTest() {
    return this.cron.triggerCronHrisTest();
  }

  @Get('trigger-cron-pcc')
  async getHandleCronPcc() {
    return this.cron.handleCronPcc();
  }

  @Get('trigger-cron-referee')
  async getHandleCronReferee() {
    return this.cron.handleCronReferee();
  }

  @Get('trigger-cron-cleanup-pcc')
  async handleCronCleanupExpiredPcc() {
    return this.cron.handleCronCleanupExpiredPcc();
  }

  @Get('trigger-bulk-s3-downloader')
  async getTriggerBulkS3Downloader() {
    return this.cron.triggerBulkS3Downloader();
  }
}
