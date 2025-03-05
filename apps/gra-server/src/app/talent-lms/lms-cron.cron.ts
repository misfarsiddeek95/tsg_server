import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { TalentLmsService } from './talent-lms.service';
import moment = require('moment');

@Injectable()
export class LmsCron implements OnModuleInit {
  private cronJobNamesToStopOnProduction: string[] = ['lmsCron', 'lmsGsheet'];

  constructor(
    private talentLmsService: TalentLmsService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  onModuleInit() {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';

    setTimeout(() => {
      // Check if the cron job exists and if the condition to run the cron is met
      if (!frontendUrl.includes('beta.thirdspaceglobal')) {
        // Loop through the cron job names and stop each one that matches the condition
        this.cronJobNamesToStopOnProduction.forEach((cronJobName) => {
          try {
            const job = this.schedulerRegistry.getCronJob(cronJobName);
            job.stop();
            console.log(
              `STOPPED Cron ${cronJobName} @:`,
              moment().format('YYYY-MM-DD HH:mm:ss')
            );
          } catch (error) {
            console.log(`No Cron Job found with the name "${cronJobName}".`);
          }
        });
      }
    }, 3000); // delay by 3 seconds to ensure cron job registration
  }

  // @Cron('0 */15 * * * *', { name: 'lmsCron' }) // every 15 minutes
  @Cron('0 */30 * * * *', {
    name: 'lmsCron'
  }) // every 30 minutes
  async lmsCron() {
    /*
    API Count Hit for LMS server-------------
    User:           1z
    Category:       3
    Course:         24
    Unit Progress:  251
    Total APIs:     279
    */
    console.time('lms-timer');
    console.log('User data Loading..');
    await this.talentLmsService.processUser();
    // console.log(
    //   'User data loaded: ' + JSON.stringify(userResponse).substring(0, 1000)
    // );

    console.timeLog('lms-timer');
    console.log('Category data Loading....');
    // const categoryIds = [105, 18, 20];
    await this.talentLmsService.processCategory();
    // console.log('Category data loaded: ' + categoryResponse);

    console.timeLog('lms-timer');
    console.log('processCourseAndUnits....');
    await this.talentLmsService.processCourseAndUnits();

    console.timeLog('lms-timer');
    console.log('addDummyRecordForNotStartedUsers....');
    await this.talentLmsService.addDummyRecordForNotStartedUsers();

    // console.timeLog('lms-timer');
    // console.log('processGSheetCourses....');
    // await this.talentLmsService.processGSheetCourses();

    console.timeEnd('lms-timer');
    console.log('lmsCron COMPLETED');

    return true;
  }

  // @Cron('0 */15 * * * *', { name: 'lmsCron' }) // every 15 minutes
  @Cron('0 */30 * * * *', {
    name: 'lmsGsheet'
  }) // every 30 minutes
  async lmsGsheet() {
    await new Promise((resolve) => setTimeout(resolve, 120000)); //delay 2 minutes
    console.log('G sheet started:', moment().format('YYYY-MM-DD HH:mm:ss'));
    await this.talentLmsService.processGSheetCourses();
    console.log('G sheet finished:', moment().format('YYYY-MM-DD HH:mm:ss'));
  }
}
