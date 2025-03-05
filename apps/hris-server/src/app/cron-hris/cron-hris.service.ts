import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment = require('moment');
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import fs = require('fs');

@Injectable()
export class CronHrisService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService
  ) {}

  //sample cron stamps
  // @Cron('0/40 * * * * *') //every 40 seconds
  // @Cron('0/2 * * * *') //every 2 minutes
  // @Cron('0 */6 * * *') // every 6 hours
  //end of samples

  // @Cron('0/40 * * * * *') //every 40 seconds
  async triggerCronHrisTest() {
    // await this.prisma.hrisIncidentLogTable.create({
    //   data: {
    //     createdAt: new Date().toISOString(),
    //     system: 'hris',
    //     cron: 'triggerCronHrisTest',
    //     comment: 'test cron ran @ ' + process.env.FRONT_URL
    //   }
    // });
    console.log('tested', moment().format('YYYY-MM-DD HH:mm:ss'));
    // await this.mailService.sendPccCronNoticeEmail('tsp id: 1232', 'banuka+cron@thirdspaceglobal.com', "banuuu", 'PCC Expiring Tester', [], 'test content here');
  }

  // start: PCC Cron related functions
  @Cron('0 */6 * * *') //every 6 hours
  async handleCronPcc() {
    const frontendURL = process.env.FRONT_URL ?? 'http://localhost:4200/';
    if (!frontendURL.includes('beta.thirdspaceglobal')) {
      console.log(
        'SKIPPED: Cron handleCronApssCoverConversion @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      return; //if not on production, skip cron
    }
    /**
     * PCC CRON: handleCronPcc
     * Banuka
     * 25/05/2023
     */
    await this.prisma.hrisIncidentLogTable.create({
      data: {
        createdAt: new Date().toISOString(),
        system: 'hris',
        cron: 'handleCronPcc',
        comment: 'PCC cron ran @ ' + process.env.FRONT_URL
      }
    });
    try {
      console.log(
        'Cron handleCronPcc @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );

      const data = await this.prisma.user.findMany({
        where: {
          // tsp_id: 21, //for testing only
          level: {
            in: [1, 2]
          },
          OR: [
            {
              user_hris_progress: {
                profileStatus: {
                  not: { in: ['resigned', 'deactivated', 'audit reject'] }
                }
              }
            },
            {
              user_hris_progress: { profileStatus: null }
            }
          ]
          // approved_contact_data: {
          //   workEmail: {
          //     not: {
          //       in: ['', null]
          //     }
          //   }
          // }
        },
        select: {
          tsp_id: true,
          approved_right2work_data: {
            select: {
              pccExpireDate: true
            }
          },
          user_hris_progress: {
            select: {
              tutorStatus: true,
              profileStatus: true,
              tspActivatedAt: true
            }
          },
          approved_contact_data: {
            select: {
              workEmail: true
            }
          },
          approved_personal_data: {
            select: {
              firstName: true
            }
          },
          tm_approved_status: {
            select: {
              supervisorTspId: true,
              supervisorName: true
            }
          },
          hrisPccCron: {
            select: {
              createdAt: true
            },
            orderBy: {
              id: 'desc'
            },
            take: 1
          },
          approved_contract_data: {
            select: {
              contract_start_d: true,
              hr_admin_approval: true
            }
          },
          DemoAssessment: {
            select: {
              finalOutcome: true,
              updatedAt: true
            },
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });

      let iterateCount = 0;
      let mailCount = 0;
      let skipCount = 0;

      const now = moment().format();
      const today = moment().format('YYYY-MM-DD');

      console.log('handleCronPcc.data.length', data.length);
      // console.log('handleCronPcc.data', data);

      outerLoop: for (let i = 0; i < data.length; i++) {
        const cronSrc = data[i];

        const timeStamps = {
          oneWeekPr: 'NA',
          fourWeekPr: 'NA',
          fourWeekAf: 'NA',
          fiveMonthsPr: 'NA',
          threeMonthsPr: 'NA',
          oneHalfMonthsPr: 'NA',
          oneMonthPr: 'NA',
          oneDayPr: 'NA',
          oneMonthAf: 'NA',
          oneHalfMonthsAf: 'NA',
          twoWeekContractualStartDateAf: 'NA',
          oneHalfMonthContractualStartDateAf: 'NA',

          twoWeeksAfTodayFormated: 'NA',

          oneWeekPrFormated: 'NA',
          fourWeekPrFormated: 'NA',
          fourWeekAfFormated: 'NA',
          fiveMonthsPrFormated: 'NA',
          threeMonthsPrFormated: 'NA',
          oneHalfMonthsPrFormated: 'NA',
          oneMonthPrFormated: 'NA',
          oneDayPrFormated: 'NA',
          oneMonthAfFormated: 'NA',
          oneHalfMonthsAfFormated: 'NA',
          twoWeekContractualStartDateAfFormated: 'NA',
          oneHalfMonthContractualStartDateAfFormated: 'NA'
        };

        const tspId = cronSrc ? cronSrc.tsp_id : 0;
        const workEmail =
          cronSrc && cronSrc.approved_contact_data
            ? cronSrc.approved_contact_data.workEmail
            : '';
        if (workEmail === '' || workEmail === null) {
          continue;
        }

        const lastCronDate =
          cronSrc &&
          cronSrc.hrisPccCron &&
          cronSrc.hrisPccCron[0] &&
          cronSrc.hrisPccCron[0].createdAt
            ? moment(cronSrc.hrisPccCron[0].createdAt).format('YYYY-MM-DD')
            : null;
        if (lastCronDate === today) {
          //skip since tutor has had a pcc email triggered on same date already
          console.log('skip cos already done:', tspId);
          skipCount++;
          if (skipCount > 100) {
            break outerLoop;
          }
          continue;
        }

        const tutorFirstName =
          cronSrc && cronSrc.approved_personal_data
            ? cronSrc.approved_personal_data.firstName
            : '';
        const pccExpireDate =
          cronSrc && cronSrc.approved_right2work_data
            ? cronSrc.approved_right2work_data.pccExpireDate
            : null;
        const pccExpireDateFormated =
          cronSrc &&
          cronSrc.approved_right2work_data &&
          cronSrc.approved_right2work_data.pccExpireDate
            ? moment(cronSrc.approved_right2work_data.pccExpireDate).format(
                'Do MMMM YYYY'
              )
            : null;

        const profileIsActive =
          cronSrc &&
          cronSrc.user_hris_progress &&
          cronSrc.user_hris_progress.profileStatus === 'active';
        const contractualStartDate =
          cronSrc &&
          cronSrc.approved_contract_data &&
          cronSrc.approved_contract_data.contract_start_d &&
          cronSrc.approved_contract_data.hr_admin_approval === 'approved'
            ? cronSrc.approved_contract_data.contract_start_d
            : null;
        const tutorFASMarkedAsPassDate =
          cronSrc &&
          cronSrc.DemoAssessment &&
          cronSrc.DemoAssessment[0] &&
          cronSrc.DemoAssessment[0].updatedAt &&
          cronSrc.DemoAssessment[0].finalOutcome === 'pass'
            ? moment(cronSrc.DemoAssessment[0].updatedAt).format('YYYY-MM-DD')
            : null;

        const supervisorTspId =
          cronSrc &&
          cronSrc.tm_approved_status &&
          cronSrc.tm_approved_status.supervisorTspId
            ? cronSrc.tm_approved_status.supervisorTspId
            : 0;
        // const supervisorName =
        //   cronSrc &&
        //   cronSrc.tm_approved_status &&
        //   cronSrc.tm_approved_status.supervisorName
        //     ? cronSrc.tm_approved_status.supervisorName
        //     : '';

        const supervisorData = await this.prisma.nonTutorDirectory.findUnique({
          where: {
            hr_tsp_id: supervisorTspId
          },
          select: {
            tsg_email: true,
            short_name: true
          }
        });

        const supervisorEmail =
          supervisorData && supervisorData.tsg_email
            ? supervisorData.tsg_email
            : '';
        const supervisorName =
          supervisorData && supervisorData.short_name
            ? supervisorData.short_name
            : '';

        // supervisorEmail = 'banuka+rm@thirdspaceglobal.com';
        const ccEmails = [];

        // console.log('cronSrc:', cronSrc);
        iterateCount++;

        if (pccExpireDate) {
          timeStamps.oneWeekPr = moment(pccExpireDate)
            .subtract(1, 'weeks')
            .format('YYYY-MM-DD');
          timeStamps.fourWeekPr = moment(pccExpireDate)
            .subtract(4, 'weeks')
            .format('YYYY-MM-DD');
          timeStamps.fourWeekAf = moment(pccExpireDate)
            .add(4, 'weeks')
            .format('YYYY-MM-DD');
          timeStamps.fiveMonthsPr = moment(pccExpireDate)
            .subtract(5, 'months')
            .format('YYYY-MM-DD');
          timeStamps.threeMonthsPr = moment(pccExpireDate)
            .subtract(3, 'months')
            .format('YYYY-MM-DD');
          timeStamps.oneHalfMonthsPr = moment(pccExpireDate)
            .subtract(1, 'month')
            .subtract(14, 'days')
            .format('YYYY-MM-DD');
          timeStamps.oneMonthPr = moment(pccExpireDate)
            .subtract(1, 'months')
            .format('YYYY-MM-DD');
          timeStamps.oneDayPr = moment(pccExpireDate)
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
          timeStamps.oneMonthAf = moment(pccExpireDate)
            .add(1, 'months')
            .format('YYYY-MM-DD');
          timeStamps.oneHalfMonthsAf = moment(pccExpireDate)
            .add(1, 'months')
            .add(2, 'weeks')
            .format('YYYY-MM-DD');

          timeStamps.twoWeeksAfTodayFormated = moment()
            .add(2, 'weeks')
            .format('Do MMMM YYYY');

          timeStamps.oneWeekPrFormated = moment(pccExpireDate)
            .subtract(1, 'weeks')
            .format('Do MMMM YYYY');
          timeStamps.fourWeekPrFormated = moment(pccExpireDate)
            .subtract(4, 'weeks')
            .format('Do MMMM YYYY');
          timeStamps.fourWeekAfFormated = moment(pccExpireDate)
            .add(4, 'weeks')
            .format('Do MMMM YYYY');
          timeStamps.fiveMonthsPrFormated = moment(pccExpireDate)
            .subtract(5, 'months')
            .format('Do MMMM YYYY');
          timeStamps.threeMonthsPrFormated = moment(pccExpireDate)
            .subtract(3, 'months')
            .format('Do MMMM YYYY');
          timeStamps.oneHalfMonthsPrFormated = moment(pccExpireDate)
            .subtract(1, 'month')
            .subtract(14, 'days')
            .format('Do MMMM YYYY');
          timeStamps.oneMonthPrFormated = moment(pccExpireDate)
            .subtract(1, 'months')
            .format('Do MMMM YYYY');
          timeStamps.oneDayPrFormated = moment(pccExpireDate)
            .subtract(1, 'days')
            .format('Do MMMM YYYY');
          timeStamps.oneMonthAfFormated = moment(pccExpireDate)
            .add(1, 'months')
            .format('Do MMMM YYYY');
          timeStamps.oneHalfMonthsAfFormated = moment(pccExpireDate)
            .add(1, 'months')
            .add(2, 'weeks')
            .format('Do MMMM YYYY');
        }

        if (contractualStartDate) {
          timeStamps.twoWeekContractualStartDateAf = moment(
            contractualStartDate
          )
            .add(14, 'days')
            .format('YYYY-MM-DD');
          timeStamps.oneHalfMonthContractualStartDateAf = moment(
            contractualStartDate
          )
            .add(1, 'months')
            .add(2, 'weeks')
            .format('YYYY-MM-DD');
        }

        // console.log('timeStamps', timeStamps);
        // console.log('count', iterateCount);

        // if (iterateCount >= 3) { break; }
        // Perform the desired operations with cronSrc data

        if (profileIsActive && today == timeStamps.fiveMonthsPr) {
          /**
           * //5 Months prior
           * 1. Email Notification to the Tutor
           * 2. PCC status in the employee profile should change from Valid to “Valid - In Progress”
           */
          const content = `Your existing PCC with TSG will expire on ${pccExpireDateFormated}. In order to ensure that you have a continuation of this document you are required to obtain a new PCC for submission by <b>${timeStamps.fourWeekPrFormated}</b>.<br><br>
          Once the document is available, you may upload directly to the “Right to work information” section of your HR profile.<br>`;
          const tspIdText = `Tutor TSP ID: ${tspId}<br>`;

          await this.mailService.sendPccCronNoticeEmail(
            tspIdText,
            workEmail,
            tutorFirstName,
            'PCC Expiring Notice',
            ccEmails,
            content
          );
          this.logHrisPccCron(
            tspId,
            workEmail,
            tutorFirstName,
            'PCC Expiring Notice',
            ccEmails,
            pccExpireDate,
            now,
            mailCount + 1
          );

          await this.updatePccState(tspId, 'Valid - In Progress');
          mailCount++;
        } else if (profileIsActive && today == timeStamps.threeMonthsPr) {
          /**
           * //3 Months prior
           * 1. Email Notification to the tutor
           * 2. Email notification to the Supervisor (On Copy)
           */
          const content = `This is a gentle reminder to submit your PCC by the <b>${timeStamps.fourWeekPrFormated}</b> to ensure continuity of work assigned to you. <br><br>
          Once the document is available, you may upload directly to the “Right to work information” section of your HR profile. <br> `;
          const tspIdText = `Tutor TSP ID: ${tspId}<br>`;

          if (supervisorEmail) {
            //Supervisor Email details
            ccEmails.push([supervisorEmail, supervisorName]);
          }
          //Capacity Team Email details
          ccEmails.push(['capacityteam@thirdspaceglobal.com', 'Capacity Team']);
          ccEmails.length = 0; //TODO: remove this on deployment of HRIS

          await this.mailService.sendPccCronNoticeEmail(
            tspIdText,
            workEmail,
            tutorFirstName,
            'PCC First Reminder',
            ccEmails,
            content
          );
          this.logHrisPccCron(
            tspId,
            workEmail,
            tutorFirstName,
            'PCC First Reminder',
            ccEmails,
            pccExpireDate,
            now,
            mailCount + 1
          );
          mailCount++;
        } else if (profileIsActive && today == timeStamps.oneHalfMonthsPr) {
          /**
           * //1.5 Months prior
           * 1. Email Notification to the tutor
           * 2. Email notification to the Supervisor (On Copy)
           */
          const content = `This is a final reminder that you have two weeks to submit your updated PCC due on the <b>${timeStamps.twoWeeksAfTodayFormated}</b>. Please keep your Supervisor and HR Operations team informed of any difficulties to submit within the given deadline. <br><br>
          Once the document is available, you may upload directly to the “Right to work information” section of your HR profile.  <br> `;
          const tspIdText = `Tutor TSP ID: ${tspId}<br>`;

          if (supervisorEmail) {
            //Supervisor Email details
            ccEmails.push([supervisorEmail, supervisorName]);
          }
          //Capacity Team Email details
          ccEmails.push(['capacityteam@thirdspaceglobal.com', 'Capacity Team']);
          ccEmails.length = 0; //TODO: remove this on deployment of HRIS

          await this.mailService.sendPccCronNoticeEmail(
            tspIdText,
            workEmail,
            tutorFirstName,
            'PCC Final Reminder',
            ccEmails,
            content
          );
          this.logHrisPccCron(
            tspId,
            workEmail,
            tutorFirstName,
            'PCC Final Reminder',
            ccEmails,
            pccExpireDate,
            now,
            mailCount + 1
          );
          mailCount++;
        } else if (profileIsActive && today == timeStamps.oneMonthPr) {
          /**
           * //1 Months prior
           * 1. Email Notification to the tutor
           * 2. Email notification to the Supervisor (On Copy)
           * 3. Email Notification to the Assistant Manager (Ops) - (On Copy)
           * 4. Email Notification to the Capacity Management Team (capacity@thirdspaceglobal. com)
           */

          const content = `You have missed to submit and update your PCC due on today. This is to notify that we are providing you a FINAL EXTENSION and the new date of your PCC for submission is on or before <b>${timeStamps.oneWeekPrFormated}</b>. <br><br>
          Once the document is available, you may upload directly to the “Right to work information” section of your HR profile.   <br><br>
            In the event you are unable to submit the document, we will be compelled to take the necessary actions to remove all sessions and place your contract on a temporary hold. <br> `;
          const tspIdText = `Tutor TSP ID: ${tspId}<br>`;

          if (supervisorEmail) {
            //Supervisor Email details
            ccEmails.push([supervisorEmail, supervisorName]);
          }
          //Capacity Team Email details
          ccEmails.push(['capacityteam@thirdspaceglobal.com', 'Capacity Team']);
          //Assistant Manager
          ccEmails.push(['rishini@thirdspaceglobal.com', 'Rishini']);
          ccEmails.push(['acshwin@thirdspaceglobal.com', 'Acshwin']);
          ccEmails.length = 0; //TODO: remove this on deployment of HRIS

          await this.mailService.sendPccCronNoticeEmail(
            tspIdText,
            workEmail,
            tutorFirstName,
            'PCC First Extension',
            ccEmails,
            content
          );
          this.logHrisPccCron(
            tspId,
            workEmail,
            tutorFirstName,
            'PCC First Extension',
            ccEmails,
            pccExpireDate,
            now,
            mailCount + 1
          );
          mailCount++;
        } else if (profileIsActive && today == timeStamps.oneDayPr) {
          /**
           * //1 Day prior
           * 1. PCC Status should change from “Valid - In Progress” to “Expired”
           * 2. Employment Status will be changed via a movement (upon approvals) from Active - Active - On Sessions to Active - On Hold - No PCC
           * 3. Email notification to the Tutor
           * 4. Email notification to the Supervisor (On Copy)
           * 5. Email Notification to the Assistant Manager (Ops) - (On Copy)
           * 6. Email Notification to the Invoicing Team to hold the Payments (razeen@thirdspaceglobal. com)
           */

          const content = `This is to keep you informed that you have failed to submit your Police Clearance Certificate, Your PCC is now <b>"Expired"</b> as per our database and as you are aware this document is mandatory in your role. <br><br>
          As you had a considerable amount of time to submit the same given the advance notice provide to you, we are left with no choice but to Place your contract on hold until further notice. <br><br>
            To avoid termination of your contract we are providing you a 4 weeks extension to submit same due on or before <b>${timeStamps.fourWeekAfFormated}</b><br> <br>
              Once the document is available, you may upload directly to the “Right to work information” section of your HR profile. <br> `;
          let tspIdText = `Tutor TSP ID: ${tspId}<br>`;

          if (supervisorEmail) {
            //Supervisor Email details
            ccEmails.push([supervisorEmail, supervisorName]);
          }
          //Capacity Team Email details
          ccEmails.push(['capacityteam@thirdspaceglobal.com', 'Capacity Team']);
          //Assistant Manager
          ccEmails.push(['rishini@thirdspaceglobal.com', 'Rishini']);
          ccEmails.push(['acshwin@thirdspaceglobal.com', 'Acshwin']);
          //Invoicing Team Email details
          ccEmails.push(['razeen@thirdspaceglobal.com', 'Invoicing Team']);
          //----Needs to add to the array ----------------
          ccEmails.length = 0; //TODO: remove this on deployment of HRIS

          // * Initiate Movement : Active - On Hold - No PCC
          // onHoldPccTM($connect, 0, date("Y-m-d H:i:s"), $user_id); //replaced
          const lastCaseId = await this.initiateTutorMovementPcc(
            tspId,
            'community',
            today,
            'No PCC'
          );
          tspIdText += ` ( Movement Case ID: M-${lastCaseId?.id} ) `;

          await this.mailService.sendPccCronNoticeEmail(
            tspIdText,
            workEmail,
            tutorFirstName,
            'PCC Deadline Over',
            ccEmails,
            content
          );
          this.logHrisPccCron(
            tspId,
            workEmail,
            tutorFirstName,
            'PCC Deadline Over',
            ccEmails,
            pccExpireDate,
            now,
            mailCount + 1
          );

          await this.updatePccState(tspId, 'Expired');
          mailCount++;
        } else if (profileIsActive && today == timeStamps.oneHalfMonthsAf) {
          /**
           * //1.5 Month After
           * 1. Employment Status will be changed (upon approvals) from Active- On Hold - No PCC to Inactive - Termination - Non Compliance of Contract
           * 2. Email notification to the Tutor
           * 3. Email notification to the Supervisor (On Copy)
           * 4. Email Notification to the Assistant Manager (Ops) - (On Copy)
           * 5. Email notification for HR Ops
           */
          const content = `Your PCC is expired and you have failed to submit an updated PCC within communicated deadlines. <br><br>
          In accordance with your service provider agreement, we’ll be terminating your contract with immediate effect. <br> `;
          let tspIdText = `Tutor TSP ID: ${tspId}<br>`;

          if (supervisorEmail) {
            //Supervisor Email details
            ccEmails.push([supervisorEmail, supervisorName]);
          }
          //Capacity Team Email details
          ccEmails.push(['capacityteam@thirdspaceglobal.com', 'Capacity Team']);
          //Assistant Manager
          ccEmails.push(['rishini@thirdspaceglobal.com', 'Rishini']);
          ccEmails.push(['acshwin@thirdspaceglobal.com', 'Acshwin']);
          //Invoicing Team Email details
          ccEmails.push(['razeen@thirdspaceglobal.com', 'Invoicing Team']);
          // HR Ops
          ccEmails.push(['chathuranga@thirdspaceglobal.com', 'Chathuranga']);
          ccEmails.length = 0; //TODO: remove this on deployment of HRIS

          // * Initiate Movement : Inactive - Termination - Non Compliance of Contract
          const lastCaseId = await this.initiateTutorMovementPcc(
            tspId,
            'termination',
            today,
            'Non Compliance of Contract',
            today
          );
          tspIdText += ` ( Movement Case ID: M-${lastCaseId?.id} ) `;
          // console.log('tspIdText', tspIdText);

          await this.mailService.sendPccCronNoticeEmail(
            tspIdText,
            workEmail,
            tutorFirstName,
            'Termination due to non submission of PCC',
            ccEmails,
            content
          );
          this.logHrisPccCron(
            tspId,
            workEmail,
            tutorFirstName,
            'Termination due to non submission of PCC',
            ccEmails,
            pccExpireDate,
            now,
            mailCount + 1
          );
          mailCount++;
        }
      }
      return { message: 'Triggerd PCC emails- ' + mailCount };
    } catch (error) {
      console.log(error);
    }
  }

  //creates a log entry in hris_pcc_cron table
  async logHrisPccCron(
    tspId: number,
    workEmail: string,
    firstName: string,
    emailSubject: string,
    ccEmails: any[],
    pccExpireDate: Date,
    createdAt: any,
    mailCount: number
  ) {
    await this.prisma.hrisPccCron.create({
      data: {
        tspId,
        workEmail,
        firstName,
        pccExpireDate: pccExpireDate
          ? moment(pccExpireDate).format('YYYY-MM-DD')
          : null,
        emailSubject,
        emailBcc: JSON.stringify(ccEmails),
        createdAt,
        countMail: mailCount
      }
    });
  }

  //updates pcc_state in approved_right2work_data table
  async updatePccState(tspId: number, newPccState: string) {
    await this.prisma.approvedRight2workData.update({
      where: {
        tspId: +tspId
      },
      data: {
        pccState: newPccState
      }
    });
  }

  //initiate a tutor movement for pcc issues
  async initiateTutorMovementPcc(
    tutorTspId: number,
    movementType: string,
    effectiveDate,
    description: string,
    resignationGivenDate = null,
    comment = 'Automated Movement - triggered via CRON JOB',
    createdBy = 0
  ) {
    const now = moment().format();

    const lastCaseId = await this.prisma.tmMasterTb.create({
      data: {
        tutorTspId,
        movementType,
        effectiveDate: new Date(effectiveDate),
        description,
        comment,
        createdAt: now,
        createdBy,
        m1Approval: 'Pending',
        l1Approval: 'Pending',
        l2Approval: 'Pending',
        movementStatus: 'Pending',
        resignationGivenDate: resignationGivenDate
          ? new Date(resignationGivenDate)
          : null
      }
    });

    return lastCaseId;
  }
  // end: PCC Cron related functions

  // start: Referee Cron related functions
  @Cron('0 */6 * * *') //every 6 hours
  async handleCronReferee() {
    const frontendURL = process.env.FRONT_URL ?? 'http://localhost:4200/';
    if (!frontendURL.includes('beta.thirdspaceglobal')) {
      console.log(
        'SKIPPED: Cron handleCronApssCoverConversion @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      return; //if not on production, skip cron
    }
    /**
     * Referee CRON: handleCronReferee
     * Banuka
     * 07/06/2023
     * LOGIC:
     * submissionFlagX hs possible values 0, 1, -1 on which 1 is the expected success flag
     * 0 means reference response is pending.
     * emailFlagX 1 referes to email sent,
     * emailFlagX 3 referes to a 3 day reminder email sent.
     * based on these 2 conditions, referee cron emails are sent & flags updated.
     */
    await this.prisma.hrisIncidentLogTable.create({
      data: {
        createdAt: new Date().toISOString(),
        system: 'hris',
        cron: 'handleCronReferee',
        comment: 'referee cron ran @ ' + process.env.FRONT_URL
      }
    });
    try {
      console.log(
        'Cron handleCronReferee @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );

      const now = moment().format();
      const todayMinus3 = moment().subtract(2, 'days').format('YYYY-MM-DD');
      const todayMinus5 = moment().subtract(4, 'days').format('YYYY-MM-DD');

      const dueDateNew2Days = moment().add(2, 'days').format('DD/MM/YYYY');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const tsgLink =
        process.env.NX_TSG_URL ?? 'https://www.thirdspaceglobal.com';

      // console.log('todayMinus3', todayMinus3);
      // console.log('todayMinus5', todayMinus5);

      const dataMinus5Ref = [];
      const dataMinus3Ref = [];
      /**
       * the approvedRefereeData table
       * has fields in form of emailFlag1 & emailFlag2
       * to compact code, have used looping with variable i to make: emailFlagX
       */

      //fetching data using 4 separate prisma queries
      for (const i of [1, 2]) {
        const emailFlagX = `emailFlag${i}`;
        const submissionFlagX = `submissionFlag${i}`;
        // const refereeXStatus = `referee${i}Status`;
        // const refereeXRejectReason = `referee${i}RejectReason`;
        const emailedFormAtX = `emailedFormAt${i}`;

        //pending forms that exceeded 5 day limit referee 1 & 2
        dataMinus5Ref[i] = await this.prisma.approvedRefereeData.findMany({
          where: {
            [submissionFlagX]: { in: [0] },
            user: {
              user_hris_progress: {
                profileStatus: {
                  not: { in: ['resigned', 'deactivated', 'audit reject'] }
                }
              }
            },
            [emailFlagX]: { in: [1, 3] },
            [emailedFormAtX]: { lt: new Date(todayMinus5) }
          },
          include: {
            user: {
              include: {
                approved_personal_data: { select: { shortName: true } },
                approved_contact_data: { select: { workEmail: true } }
              }
            }
          }
        });

        //pending forms that been 3-4 days since requested referee 1 & 2
        dataMinus3Ref[i] = await this.prisma.approvedRefereeData.findMany({
          where: {
            [submissionFlagX]: { in: [0] },
            user: {
              user_hris_progress: {
                profileStatus: {
                  not: { in: ['resigned', 'deactivated', 'audit reject'] }
                }
              }
            },
            [emailFlagX]: { in: [1] },
            [emailedFormAtX]: {
              gte: new Date(todayMinus5),
              lt: new Date(todayMinus3)
            }
          },
          include: {
            user: {
              include: {
                approved_personal_data: { select: { shortName: true } },
                approved_contact_data: { select: { workEmail: true } }
              }
            }
          }
        });
      } //end: for loop fetching data

      // console.log('dataMinus5Ref', dataMinus5Ref);
      // console.log('dataMinus3Ref', dataMinus3Ref);

      //processing the 4 different data sets generated & triggering relevent emails
      for (const i of [1, 2]) {
        const emailFlagX = `emailFlag${i}`;
        const submissionFlagX = `submissionFlag${i}`;
        const refereeXStatus = `referee${i}Status`;
        const refereeXRejectReason = `referee${i}RejectReason`;
        const refereeTitleX = `refereeTitle${i}`;
        const refereeFirstNameX = `refereeFirstName${i}`;
        const refereeLastNameX = `refereeLastName${i}`;
        const refereeEmailX = `refereeEmail${i}`;
        const refereeCount = i;

        //process 3 day reminder ------------------------------
        dataMinus3Ref[i].map(async (cronSrc) => {
          const candidateId = cronSrc.tspId;
          const refereeTitleName =
            cronSrc[refereeTitleX] +
            '. ' +
            cronSrc[refereeFirstNameX] +
            ' ' +
            cronSrc[refereeLastNameX];
          const candidateName =
            cronSrc.user?.approved_personal_data?.shortName ?? '';
          const candidateEmail =
            cronSrc.user?.approved_contact_data?.workEmail ?? '';
          const refereeEmail = cronSrc[refereeEmailX];

          if (emailRegex.test(refereeEmail)) {
            const token = this.jwtService.sign({
              tspId: candidateId,
              refereeCount,
              refereeEmail
            });

            const formLink = tsgLink + '/reference-check-form?token=' + token;
            // let refereeEmail = 'banuka+ref@thirdspaceglobal.com'; //for testing

            await this.mailService.sendRefereeReferenceRequestOrReminder(
              refereeTitleName,
              candidateName,
              dueDateNew2Days,
              formLink,
              refereeEmail,
              true
            ); // isReminder

            await this.mailService.sendCandidate3DayReferenceReminder(
              refereeTitleName,
              candidateName,
              dueDateNew2Days,
              candidateEmail
            );
          }

          await this.prisma.approvedRefereeData.update({
            where: {
              tspId: candidateId
            },
            data: {
              [emailFlagX]: 3 //email sent flag
            }
          });
        });

        //process 5 day overdue ------------------------------
        dataMinus5Ref[i].map(async (cronSrc) => {
          const candidateId = cronSrc.tspId;
          const refereeTitleName =
            cronSrc[refereeTitleX] +
            '. ' +
            cronSrc[refereeFirstNameX] +
            ' ' +
            cronSrc[refereeLastNameX];
          const candidateName =
            cronSrc.user?.approved_personal_data?.shortName ?? '';
          const candidateEmail =
            cronSrc.user?.approved_contact_data?.workEmail ?? '';

          if (emailRegex.test(candidateEmail)) {
            await this.mailService.sendCandidate5DayReferenceOverdue(
              refereeTitleName,
              candidateName,
              candidateEmail
            );
          }

          await this.prisma.approvedRefereeData.update({
            where: {
              tspId: candidateId
            },
            data: {
              [emailFlagX]: -5, //email sent flag
              [submissionFlagX]: -1
            }
          });

          //reset relevent audit status to rejected
          const lastRecord = await this.prisma.hrisRefereeData.findFirst({
            where: {
              tspId: candidateId
            },
            orderBy: { id: 'desc' }
          });
          if (lastRecord) {
            await this.prisma.hrisRefereeData.update({
              where: {
                id: lastRecord.id
              },
              data: {
                [refereeXStatus]: 'rejected',
                [refereeXRejectReason]: 'Reset due to deadline overdue',
                updatedAt: now,
                auditedAt: now
              }
            });
          }
        });
      } //end: for loop processing data

      return {
        message: 'Triggerd Referee emails- ',
        dataMinus5Ref,
        dataMinus3Ref
      };
    } catch (error) {
      console.log(error);
    }
  } // end: handleCronReferee

  @Cron('0 1 * * *') // once a day
  async handleCronCleanupExpiredPcc() {
    const frontendURL = process.env.FRONT_URL ?? 'http://localhost:4200/';
    if (!frontendURL.includes('beta.thirdspaceglobal')) {
      console.log(
        'SKIPPED: Cron handleCronApssCoverConversion @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      return; //if not on production, skip cron
    }
    /**
     * PCC CRON: handleCronCleanupExpiredPcc
     * Banuka
     * 13/11/2023
     * this cronjob will update status of any pcc is
     * left 'Valid', 'Valid - In Progress' when it should be 'Expired'
     * in: approvedRight2workData & hrisRight2workData
     */
    const now = moment().format();

    try {
      console.log(
        'Cron handleCronCleanupExpiredPcc @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      const updatedRecordCount1 =
        await this.prisma.approvedRight2workData.updateMany({
          where: {
            pccExpireDate: { lte: now },
            pccState: { in: ['Valid', 'Valid - In Progress'] }
          },
          data: {
            pccState: 'Expired'
          }
        });

      updatedRecordCount1 &&
        updatedRecordCount1.count > 0 &&
        (await this.prisma.hrisIncidentLogTable.create({
          data: {
            createdAt: new Date().toISOString(),
            system: 'hris',
            cron: 'handleCronCleanupExpiredPcc',
            comment:
              updatedRecordCount1.count +
              ' - CleanupExpiredPcc approvedRight2workData @ ' +
              process.env.FRONT_URL,
            dataSet:
              updatedRecordCount1.count + ' :updated - approvedRight2workData'
          }
        }));

      const updatedRecordCount2 =
        await this.prisma.hrisRight2workData.updateMany({
          where: {
            pccExpireDate: { lte: now },
            pccState: { in: ['Valid', 'Valid - In Progress'] }
          },
          data: {
            pccState: 'Expired'
          }
        });

      updatedRecordCount2 &&
        updatedRecordCount2.count > 0 &&
        (await this.prisma.hrisIncidentLogTable.create({
          data: {
            createdAt: new Date().toISOString(),
            system: 'hris',
            cron: 'handleCronCleanupExpiredPcc',
            comment:
              updatedRecordCount2.count +
              ' - CleanupExpiredPcc hrisRight2workData @ ' +
              process.env.FRONT_URL,
            dataSet:
              updatedRecordCount2.count + ' :updated - hrisRight2workData'
          }
        }));
    } catch (error) {
      console.log(error);
    }
  }

  // this function is defined to download bulk list of files off s3 bucket
  // IMPTORTANT: can only be used locally. do not use on server.
  async triggerBulkS3Downloader() {
    return 'disabled function';
    // const filesToDownload = [
    //   '/128091/personal_details/1698064079299_____pro_pic.png',
    //   '/128399/personal_details/1697177228087_____pro_pic.png'
    // ];
    const filesToDownload = [];
    const credentials = {
      accessKeyId: process.env.NX_ERP_BUCKET_KEY,
      secretAccessKey: process.env.NX_ERP_BUCKET_SECRET
    };

    const bucket = process.env.NX_ERP_BUCKET_NAME;
    const region = process.env.NX_ERP_BUCKET_REGION;

    const s3Client = new S3Client({
      region: region, // Replace with your region
      credentials: credentials // Replace with your profile name or provide your AWS credentials directly
    });

    async function downloadAndSaveFiles() {
      for (const file of filesToDownload) {
        const path =
          file && file.charAt(0) === '/' ? `${file}`.slice(1) : file ?? 'NA';
        const tspId = path.split('/').shift();
        const fileExtension = path.split('.').pop();

        const getObjectParams = {
          Bucket: bucket, // Replace with your bucket name
          Key: path
        };

        const getObjectCommand = new GetObjectCommand(getObjectParams);

        try {
          const response = await s3Client.send(getObjectCommand);

          if (response.Body instanceof Readable) {
            const fileStream = Readable.from(response.Body);

            const writeStream = fs.createWriteStream(
              tspId + '.' + fileExtension
            );

            fileStream.pipe(writeStream);

            await new Promise((resolve, reject) => {
              writeStream.on('finish', resolve);
              writeStream.on('error', reject);
            });

            console.log(`Downloaded and saved: ${tspId}`);
          }
        } catch (error) {
          // Handle the error here, you can log it or take any other action you need.
          console.error('Error downloading file:', tspId, path);
        }
      }
    }

    downloadAndSaveFiles()
      .then(() => {
        console.log('All files downloaded and saved successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    console.log(
      'triggerBulkS3Downloader',
      moment().format('YYYY-MM-DD HH:mm:ss')
    );
  }

  @Cron('*/10 * * * *') //At every 10th minute.
  async reEnableDisabledAccounts() {
    const frontendURL = process.env.FRONT_URL ?? 'http://localhost:4200/';
    if (!frontendURL.includes('beta.thirdspaceglobal')) {
      console.log(
        'SKIPPED: Cron handleCronApssCoverConversion @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      return; //if not on production, skip cron
    }
    /**
     * reEnable accounts that's been disabled due to a bug CRON: reEnableDisabledAccounts
     * Banuka / Dilki
     * 30/01/2024
     */
    try {
      console.log(
        'Cron reEnableDisabledAccounts @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );

      const allDisabledUsers = await this.prisma.user.findMany({
        where: {
          isTemporaryDisabled: true
        },
        select: {
          tsp_id: true,
          username: true
        }
      });

      const usersInTemporaryDisable =
        await this.prisma.userTemporaryDisable.findMany({
          where: {
            email: {
              in: allDisabledUsers.map((user) => user.username)
            },
            attempts: 10
          },
          select: {
            email: true
          }
        });

      const accountsReEnable = allDisabledUsers
        .filter(
          (user) =>
            !usersInTemporaryDisable.find(
              (disabledUser) => disabledUser.email === user.username
            )
        )
        .map((user) => user.tsp_id);

      if (accountsReEnable.length > 0) {
        await this.prisma.user.updateMany({
          where: {
            tsp_id: {
              in: accountsReEnable
            }
          },
          data: {
            isTemporaryDisabled: false
          }
        });

        await this.prisma.hrisIncidentLogTable.create({
          data: {
            createdAt: new Date().toISOString(),
            system: 'ams',
            cron: 'reEnableDisabledAccounts',
            comment:
              accountsReEnable.length +
              ' : records updated @ ' +
              process.env.FRONT_URL,
            dataSet: accountsReEnable.toString().substring(0, 9999)
          }
        });
      }
    } catch (error) {
      console.log(error);

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'ams',
          cron: 'ERROR_reEnableDisabledAccounts',
          comment: 'ERROR @ ' + process.env.FRONT_URL
        }
      });
    }
  }
}
