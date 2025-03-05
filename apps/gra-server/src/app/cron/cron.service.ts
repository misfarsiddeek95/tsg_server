import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import moment = require('moment');
import { PrismaService } from '../prisma.service';
import { MailService } from './../mail/mail.service';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

@Injectable()
export class CronService implements OnModuleInit {
  private cronJobNamesToStopOnProduction: string[] = [
    'handleCronApssCoverConversion',
    'handleCronApplicationFormConnector',
    'handleCronEsaBookingReminder48h',
    'handleCronLmsCompletionUpdate'
  ];

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
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

  @Cron('0 */1 * * *') // every 1 hour
  async handleCronTestRunQueue() {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';

    try {
      // console.error('addJob-handleCronTestRunQueue');
      // const res = await this.myTestQueue.add('process_test_only_job', {
      //   time: moment().format('YYYY-MM-DD HH:mm:ss')
      // });
    } catch (error) {
      console.error('Error executing handleCronTestRunQueue:', error.message);

      await this.prisma.systemErrorLog.create({
        data: {
          system: 'gra',
          subSystem: 'queue',
          function: 'failedAddJobToQueue',
          location: 'apps/gra-server/src/app/cron/cron.service.ts',
          description:
            `Add Job to Queue failed with: ` +
            error +
            ` at ` +
            moment().format('YYYY-MM-DD HH:mm:ss'),
          createdAt: moment().toISOString(),
          createdBy: 0
        }
      });

      await this.mailService.sendSimpleTestEmail(
        'banuka+queue@thirdspaceglobal.com',
        'Notify Queue Failed on: Add Job to Queue',
        '<b>Add Job to Queue failed at: ' +
          moment().format('YYYY-MM-DD HH:mm:ss') +
          '</b><br>triggered by cronjob - gra-server - apps/gra-server/src/app/cron/cron.service.ts' +
          '<br>on ' +
          frontendUrl
      );
    }
  }

  // @Cron('0 1 * * *') //at 01:00H GMT every day //stopped on 2023-11-02
  async handleCronRegistrationStep1() {
    try {
      console.log('Cron handleCron @:', moment().format('YYYY-MM-DD HH:mm:ss'));
      const data = await this.prisma.graRegistrationData.findMany({
        where: {
          progress: 1,
          updatedAt: {
            gt: moment().subtract(2, 'days').toISOString(),
            lte: moment().subtract(1, 'days').toISOString()
          }
        },
        include: {
          user: {
            include: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  firstName: true
                }
              }
            }
          }
        }
      });

      const mappedData = data.map((regData) => {
        return {
          email: regData.user.approved_contact_data?.workEmail ?? '',
          firstName: regData.user.approved_personal_data?.firstName ?? ''
        };
      });
      await this.mailService.sendReminderRegistrationStep1(mappedData);

      //keep track of when cron emails are sent to the candidates
      const mappedDataTspIds = data.map((regData) => {
        return regData.tspId ?? 0;
      });
      console.log('mappedDataTspIds', mappedDataTspIds);
      await this.prisma.graCronTracker.updateMany({
        where: {
          tspId: {
            in: mappedDataTspIds
          }
        },
        data: {
          updatedAt: new Date().toISOString(),
          handleCronRegistrationStep1: new Date().toISOString()
        }
      });

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'gra',
          cron: 'handleCronRegistrationStep1',
          comment:
            mappedDataTspIds.length +
            ' - RegistrationStep1 @ ' +
            process.env.FRONT_URL,
          dataSet: mappedDataTspIds.toString().substring(0, 9999)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // @Cron('0 1 * * *') //disabled 2023-11-09
  async handleCronQualificationAndProfiling() {
    try {
      console.log(
        'Cron handleCronQualificationAndProfiling @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      const data = await this.prisma.candidateLevel.findMany({
        where: {
          OR: [
            {
              step1: 'Pass',
              step2: null,
              updatedAt: {
                gt: moment().subtract(2, 'days').toISOString(),
                lte: moment().subtract(1, 'days').toISOString()
              }
            },
            {
              step1: 'Pass',
              step2: null,
              updatedAt: {
                gt: moment().subtract(3, 'days').toISOString(),
                lte: moment().subtract(2, 'days').toISOString()
              }
            }
          ]
        },
        include: {
          candidate: {
            include: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  firstName: true
                }
              }
            }
          }
        }
      });

      const mappedData = data.map((regData) => {
        return {
          email: regData.candidate.approved_contact_data?.workEmail ?? '',
          firstName: regData.candidate.approved_personal_data?.firstName ?? ''
        };
      });
      await this.mailService.sendReminderQualificationAndProfilingStage(
        mappedData
      );

      //keep track of when cron emails are sent to the candidates
      const mappedDataTspIds = data.map((regData) => {
        return regData.candidate_id ?? 0;
      });
      await this.prisma.graCronTracker.updateMany({
        where: {
          tspId: {
            in: mappedDataTspIds
          }
        },
        data: {
          updatedAt: new Date().toISOString(),
          handleCronQualificationAndProfiling: new Date().toISOString()
        }
      });

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'gra',
          cron: 'handleCronQualificationAndProfiling',
          comment:
            mappedDataTspIds.length +
            ' - QualificationAndProfiling @ ' +
            process.env.FRONT_URL,
          dataSet: mappedDataTspIds.toString().substring(0, 9999)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // @Cron('0 1 * * *') //disabled 2023-11-09
  async handleCronOnlineAssessmentAfterOneDay() {
    try {
      console.log(
        'Cron handleCronOnlineAssessmentAfterOneDay @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      const data = await this.prisma.candidateLevel.findMany({
        where: {
          step2: 'Pass',
          step3: null,
          updatedAt: {
            gt: moment().subtract(2, 'days').toISOString(),
            lte: moment().subtract(1, 'days').toISOString()
          }
        },
        include: {
          candidate: {
            include: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  firstName: true
                }
              }
            }
          }
        }
      });

      const mappedData = data.map((regData) => {
        return {
          email: regData.candidate.approved_contact_data?.workEmail ?? '',
          firstName: regData.candidate.approved_personal_data?.firstName ?? ''
        };
      });

      await this.mailService.sendReminderOnlineAssessment(mappedData);

      //keep track of when cron emails are sent to the candidates
      const mappedDataTspIds = data.map((regData) => {
        return regData.candidate_id ?? 0;
      });
      await this.prisma.graCronTracker.updateMany({
        where: {
          tspId: {
            in: mappedDataTspIds
          }
        },
        data: {
          updatedAt: new Date().toISOString(),
          handleCronOnlineAssessmentAfterOneDay: new Date().toISOString()
        }
      });

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'gra',
          cron: 'handleCronOnlineAssessmentAfterOneDay',
          comment:
            mappedDataTspIds.length +
            ' - OnlineAssessmentAfterOneDay @ ' +
            process.env.FRONT_URL,
          dataSet: mappedDataTspIds.toString().substring(0, 9999)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // @Cron('0 1 * * *') //disabled 2023-11-09
  async handleCronOnlineAssessmentAfterTwoDays() {
    try {
      console.log(
        'Cron handleCronOnlineAssessmentAfterTwoDays @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      const data = await this.prisma.candidateLevel.findMany({
        where: {
          step2: 'Pass',
          step3: null,
          updatedAt: {
            gt: moment().subtract(3, 'days').toISOString(),
            lte: moment().subtract(2, 'days').toISOString()
          }
        },
        include: {
          candidate: {
            include: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  firstName: true
                }
              }
            }
          }
        }
      });

      const mappedData = data.map((regData) => {
        return {
          email: regData.candidate.approved_contact_data?.workEmail ?? '',
          firstName: regData.candidate.approved_personal_data?.firstName ?? ''
        };
      });

      await this.mailService.sendReminderOnlineAssessmentAfterTwoDays(
        mappedData
      );

      //keep track of when cron emails are sent to the candidates
      const mappedDataTspIds = data.map((regData) => {
        return regData.candidate_id ?? 0;
      });
      await this.prisma.graCronTracker.updateMany({
        where: {
          tspId: {
            in: mappedDataTspIds
          }
        },
        data: {
          updatedAt: new Date().toISOString(),
          handleCronOnlineAssessmentAfterTwoDays: new Date().toISOString()
        }
      });

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'gra',
          cron: 'handleCronOnlineAssessmentAfterTwoDays',
          comment:
            mappedDataTspIds.length +
            ' - OnlineAssessmentAfterTwoDays @ ' +
            process.env.FRONT_URL,
          dataSet: mappedDataTspIds.toString().substring(0, 9999)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //sending reminder emails to candidates to book PI.
  // @Cron('0 1 * * *') //stopped on 2023-11-02
  async handleCronPhoneInterview() {
    try {
      console.log(
        'Cron handleCronPhoneInterview @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      //exclude candidates that already made a booking
      const ids = await this.prisma.bookingStatus.findMany({
        where: {
          appointment_type_ref_id: 1,
          candidate_id: {
            not: {
              equals: null
            }
          }
        },
        select: {
          candidate_id: true
        }
      });
      const candidateIds = ids.map((obj) => obj.candidate_id);

      const data = await this.prisma.candidateLevel.findMany({
        where: {
          step3: 'Pass',
          step4: null,
          updatedAt: {
            gt: moment().subtract(3, 'days').toISOString(),
            lte: moment().subtract(2, 'days').toISOString()
          },
          candidate_id: {
            notIn: candidateIds
          }
        },
        include: {
          candidate: {
            include: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  firstName: true
                }
              }
            }
          }
        }
      });
      const mappedData = data.map((regData) => {
        return {
          email: regData.candidate.approved_contact_data?.workEmail ?? '',
          firstName: regData.candidate.approved_personal_data?.firstName ?? ''
        };
      });

      await this.mailService.sendReminderPhoneInterview(mappedData);

      //keep track of when cron emails are sent to the candidates
      const mappedDataTspIds = data.map((regData) => {
        return regData.candidate_id ?? 0;
      });
      await this.prisma.graCronTracker.updateMany({
        where: {
          tspId: {
            in: mappedDataTspIds
          }
        },
        data: {
          updatedAt: new Date().toISOString(),
          handleCronPhoneInterview: new Date().toISOString()
        }
      });

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'gra',
          cron: 'handleCronPhoneInterview',
          comment:
            mappedDataTspIds.length +
            ' - PhoneInterview @ ' +
            process.env.FRONT_URL,
          dataSet: mappedDataTspIds.toString().substring(0, 9999)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //sending reminder emails to candidates to book TI.
  // @Cron('0 1 * * *') //disabled 2023-11-09
  async handleCronTeachingInterview() {
    try {
      console.log(
        'Cron handleCronTeachingInterview @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      //exclude candidates that already made a booking
      const ids = await this.prisma.bookingStatus.findMany({
        where: {
          appointment_type_ref_id: 2,
          candidate_id: {
            not: {
              equals: null
            }
          }
        },
        select: {
          candidate_id: true
        }
      });
      const candidateIds = ids.map((obj) => obj.candidate_id);

      const data = await this.prisma.candidateLevel.findMany({
        where: {
          step4: 'Pass',
          step5: null,
          updatedAt: {
            gt: moment().subtract(2, 'days').toISOString(),
            lte: moment().subtract(1, 'days').toISOString()
          },
          candidate_id: {
            notIn: candidateIds
          }
        },
        include: {
          candidate: {
            include: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  firstName: true
                }
              }
            }
          }
        }
      });

      const mappedData = data.map((regData) => {
        return {
          email: regData.candidate.approved_contact_data?.workEmail ?? '',
          firstName: regData.candidate.approved_personal_data?.firstName ?? ''
        };
      });

      await this.mailService.sendReminderTeachingInterview(mappedData);

      //keep track of when cron emails are sent to the candidates
      const mappedDataTspIds = data.map((regData) => {
        return regData.candidate_id ?? 0;
      });
      await this.prisma.graCronTracker.updateMany({
        where: {
          tspId: {
            in: mappedDataTspIds
          }
        },
        data: {
          updatedAt: new Date().toISOString(),
          handleCronTeachingInterview: new Date().toISOString()
        }
      });

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'gra',
          cron: 'handleCronTeachingInterview',
          comment:
            mappedDataTspIds.length +
            ' - TeachingInterview 1 @ ' +
            process.env.FRONT_URL,
          dataSet: mappedDataTspIds.toString().substring(0, 9999)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //sending reminder emails to candidates 2 days before TI.
  // @Cron('0 1 * * *') //at 01:00H GMT every day //disabled 2023-11-09
  async handleCronReminderBeforeTeachingInterview() {
    try {
      console.log(
        'Cron handleCronReminderBeforeTeachingInterview @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      const data = await this.prisma.bookingStatus.findMany({
        where: {
          appointment_type_ref_id: 2,
          candidate_id: { not: null },
          status: 3,
          date: {
            gte: moment().add(2, 'days').toISOString(),
            lt: moment().add(3, 'days').toISOString()
          }
        },
        include: {
          candidate: {
            include: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  firstName: true
                }
              }
            }
          }
        }
      });

      const mappedData = data.map((regData) => {
        return {
          email: regData.candidate.approved_contact_data?.workEmail ?? '',
          firstName: regData.candidate.approved_personal_data?.firstName ?? ''
        };
      });

      await this.mailService.sendReminderBeforeTeachingInterview(mappedData);

      //keep track of when cron emails are sent to the candidates
      const mappedDataTspIds = data.map((regData) => {
        return regData.candidate_id ?? 0;
      });
      await this.prisma.graCronTracker.updateMany({
        where: {
          tspId: {
            in: mappedDataTspIds
          }
        },
        data: {
          updatedAt: new Date().toISOString(),
          handleCronReminderBeforeTeachingInterview: new Date().toISOString()
        }
      });

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'gra',
          cron: 'handleCronReminderBeforeTeachingInterview',
          comment:
            mappedDataTspIds.length +
            ' - ReminderBeforeTeachingInterview @ ' +
            process.env.FRONT_URL,
          dataSet: mappedDataTspIds.toString().substring(0, 9999)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // @Cron('0 */12 * * *') //every 12 hours
  async handleCronMathTestStatusUpdate() {
    /**
     * MathTestStatusUpdateManually CRON: handleCronMathTestStatusUpdate
     * Banuka / Poshitha
     * 15/09/2023
     */
    try {
      console.log(
        'Cron handleCronMathTestStatusUpdate @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      const examConflictDetails = await this.prisma.flexiCandidateExam.findMany(
        {
          where: {
            AND: [
              {
                exam_status: {
                  in: [2]
                }
              },
              {
                FlexiCandidateExamDetails: {
                  some: {
                    percentage_score: {
                      not: {
                        equals: undefined
                      }
                    }
                  }
                }
              }
            ]
          },
          select: {
            flexi_candidate_id: true,
            FlexiCandidateExamDetails: {
              where: {
                percentage_score: {
                  lt: 0
                }
              }
            }
          }
        }
      );

      const mappedDataTspIds = examConflictDetails.map(
        (a) => a.flexi_candidate_id
      );

      await this.prisma.flexiCandidateExam.updateMany({
        where: {
          flexi_candidate_id: {
            in: mappedDataTspIds
          }
        },
        data: {
          exam_status: 3
        }
      });

      if (mappedDataTspIds.length > 0) {
        console.log('examConflictResolved count: ', mappedDataTspIds.length);

        await this.prisma.hrisIncidentLogTable.create({
          data: {
            createdAt: new Date().toISOString(),
            system: 'flexiquiz_gra',
            cron: 'handleCronMathTestStatusUpdate',
            comment:
              mappedDataTspIds.length +
              ' : mathTest records updated @ ' +
              process.env.FRONT_URL,
            dataSet: mappedDataTspIds.toString().substring(0, 9999)
          }
        });
      }
    } catch (error) {
      console.log(error);

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'flexiquiz_gra',
          cron: 'ERROR_handleCronMathTestStatusUpdate',
          comment: 'ERROR @ ' + process.env.FRONT_URL
        }
      });
    }
  }

  async triggerCron(type: string, tspId: string) {
    try {
      switch (type) {
        case 'registration': {
          await this.prisma.graRegistrationData.update({
            where: {
              tspId: +tspId
            },
            data: {
              updatedAt: moment().subtract(36, 'hours').toISOString()
            }
          });
          await this.handleCronRegistrationStep1();
          break;
        }
        case 'Q&P': {
          await this.prisma.candidateLevel.update({
            where: {
              candidate_id: +tspId
            },
            data: {
              updatedAt: moment().subtract(36, 'hours').toISOString()
            }
          });
          await this.handleCronQualificationAndProfiling();
          break;
        }
        case 'OA24h': {
          await this.prisma.candidateLevel.update({
            where: {
              candidate_id: +tspId
            },
            data: {
              updatedAt: moment().subtract(36, 'hours').toISOString()
            }
          });
          await this.handleCronOnlineAssessmentAfterOneDay();
          break;
        }
        case 'OA48h': {
          await this.prisma.candidateLevel.update({
            where: {
              candidate_id: +tspId
            },
            data: {
              updatedAt: moment().subtract(56, 'hours').toISOString()
            }
          });
          await this.handleCronOnlineAssessmentAfterTwoDays();
          break;
        }
        case 'PI': {
          await this.prisma.candidateLevel.update({
            where: {
              candidate_id: +tspId
            },
            data: {
              updatedAt: moment().subtract(36, 'hours').toISOString()
            }
          });
          await this.handleCronPhoneInterview();
          break;
        }
        case 'TI': {
          await this.prisma.candidateLevel.update({
            where: {
              candidate_id: +tspId
            },
            data: {
              updatedAt: moment().subtract(36, 'hours').toISOString()
            }
          });
          await this.handleCronTeachingInterview();
          break;
        }
        case 'PIreminder': {
          const PI = await this.prisma.bookingStatus.findFirst({
            where: {
              candidate_id: +tspId
            },
            orderBy: {
              created_at: 'desc'
            }
          });
          await this.prisma.bookingStatus.update({
            where: {
              id: PI.id
            },
            data: {
              date: moment().add(56, 'hours').toISOString()
            }
          });
          await this.handleCronReminderBeforeTeachingInterview();
          break;
        }
        default:
          break;
      }
      return 'Cron Triggered';
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  @Cron('0/30 * * * *', {
    name: 'handleCronApssCoverConversion'
  }) //every 30 minutes //TODO: BK uncomment this to automate the cronjob
  async handleCronApssCoverConversion() {
    /**
     * ApssCoverConversion CRON: handleCronApssCoverConversion
     * Banuka
     * 19/03/2024
     * To convert all the available appointment slots to cover slots,
     * when the set booking cutoff time reaches (5 hours before the appointment start time)
     */
    try {
      console.log(
        'Cron handleCronApssCoverConversion @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );

      const slTimePlusXHours = moment().tz('Asia/Colombo').add(5, 'hours');

      const justTheDate = new Date(
        moment(slTimePlusXHours).format('YYYY-MM-DD')
      );
      const timePartString = slTimePlusXHours.format('HH:mm:ss');
      const justTheTime = new Date(`1970-01-01T${timePartString}.000Z`);

      // get current date time in SL
      // get all slots for today thats avilable, and starting time is less than 5 hours + now time
      // convert all to cover
      const updatedRecordCount = await this.prisma.bookingStatus.updateMany({
        where: {
          status: 1,
          candidate_id: null,
          OR: [
            {
              date: { equals: justTheDate },
              bs_all_booking_slot: {
                start_time: { lte: justTheTime }
              }
            },
            { date: { lt: justTheDate } }
          ]
        },
        data: {
          status: 8,
          updated_by: 0,
          updated_at: new Date()
        }
      });

      updatedRecordCount &&
        updatedRecordCount.count > 0 &&
        (await this.prisma.hrisIncidentLogTable.create({
          data: {
            createdAt: new Date().toISOString(),
            system: 'apss_gra',
            cron: 'handleCronApssCoverConversion',
            comment:
              updatedRecordCount.count +
              ' - records converted from avilable to cover @ ' +
              process.env.FRONT_URL,
            dataSet: updatedRecordCount.count + ' :updated - bs_booking_status'
          }
        })) &&
        console.log('Converted slot count:', updatedRecordCount.count);
    } catch (error) {
      console.log(error);

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'apss_gra',
          cron: 'ERROR_handleCronApssCoverConversion',
          comment: 'ERROR @ ' + process.env.FRONT_URL
        }
      });
    }
  } //end: handleCronApssCoverConversion

  @Cron('0 */6 * * *') // every 6 hours
  async handleCronPhpTmsCronRun() {
    /**
     * handleCronPhpTmsCronRun
     * Banuka
     * 04/04/2024
     * To trigger staging php tms cronjob as it's nto setup on php server
     */
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    if (!frontendUrl.includes('staging.thirdspaceportal')) {
      return;
    }
    try {
      // Make an HTTP GET request to the TMS PHP cron file of sandbox
      const response = await axios.get(
        `https://tms-php-staging-7c66822d354d.herokuapp.com/mail-cron-tm.php`
      );
      console.log('TMS PHP cron file executed:', response.status);
    } catch (error) {
      console.error('Error executing TMS PHP cron file:', error.message);
    }
  } //end: handleCronPhpTmsCronRun

  //sending reminder emails to candidates to book Essential skills assessment
  // @Cron('0 1 * * *', {
  //   name: 'handleCronEsaBookingReminder48h'
  // }) //TODO: enable once ESA is tested full & APSS slots given
  async handleCronEsaBookingReminder48h() {
    try {
      console.log(
        'Cron handleCronEsaBookingReminder48h @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );
      //exclude candidates that already made a booking
      const ids = await this.prisma.bookingStatus.findMany({
        where: {
          appointment_type_ref_id: 5,
          candidate_id: {
            not: {
              equals: null
            }
          }
        },
        select: {
          candidate_id: true
        }
      });
      const candidateIdsWithExisitingBookings = ids.map(
        (obj) => obj.candidate_id
      );

      const data = await this.prisma.candidateLevel.findMany({
        where: {
          level: 3,
          step1: 'Pass',
          step2: 'Pass',
          step3: null,
          step3UpdatedAt: {
            gt: moment().subtract(2, 'days').toISOString(),
            lte: moment().subtract(1, 'days').toISOString()
          },
          createdAt: { gt: new Date('2024-09-25T00:00:00.000Z') },
          candidate_id: {
            notIn: candidateIdsWithExisitingBookings
          }
        },
        include: {
          candidate: {
            include: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  firstName: true
                }
              }
            }
          }
        }
      });

      const mappedData = data.map((regData) => {
        return {
          email: regData.candidate.approved_contact_data?.workEmail ?? '',
          firstName: regData.candidate.approved_personal_data?.firstName ?? ''
        };
      });
      console.log('mappedData', mappedData);

      //trigger email in bulk
      // await this.mailService.sendReminderTeachingInterview(mappedData);

      //keep track of when cron emails are sent to the candidates
      const mappedDataTspIds = data.map((regData) => regData.candidate_id ?? 0);

      await Promise.all(
        mappedDataTspIds.map(async (tspId) => {
          await this.prisma.graCronTracker.upsert({
            where: {
              tspId: tspId
            },
            update: {
              updatedAt: new Date().toISOString(),
              handleCronPhoneInterview: new Date().toISOString()
            },
            create: {
              tspId: tspId,
              updatedAt: new Date().toISOString(),
              handleCronPhoneInterview: new Date().toISOString()
            }
          });
        })
      );

      await this.prisma.hrisIncidentLogTable.create({
        data: {
          createdAt: new Date().toISOString(),
          system: 'gra',
          cron: 'handleCronEsaBookingReminder48h',
          comment:
            mappedDataTspIds.length +
            ' - Essential Skills Assessment 1 @ ' +
            process.env.FRONT_URL,
          dataSet: mappedDataTspIds.toString().substring(0, 9999)
        }
      });
    } catch (error) {
      console.log(error);
    }
  } //end: handleCronEsaBookingReminder48h

  // Function to convert column number to letter
  async columnToLetter(column) {
    let temp;
    let letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = Math.floor((column - temp) / 26);
    }
    return letter;
  }

  @Cron('10 * * * *', {
    name: 'handleCronApplicationFormConnector'
  }) // every 1 hour at minute 10
  async handleCronApplicationFormConnector() {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';

    try {
      console.log(
        'Cron handleCronApplicationFormConnector @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );

      // Create header row
      const headers = [
        'TSP ID',
        'Candidate name',
        'Registered Username',
        'Registration date',
        'Profile level',

        'Gender',
        'Dob',
        'Age',
        'NIC / Aadhar card no',
        'ID Language/ English',
        'Work Email',
        'Mobile number',
        'Residing Country',
        'Residing Province',
        'Residing District',

        'O/L Syllabus',
        'O/L Completed Year',
        'Results for O/L Mathematics',
        'Results for O/L English / IELTS',
        'Qualification Course Type',
        'Field of Study',
        'Currently following or Completed',
        'Name of the University',
        'Name of the Affiliated University',
        'Previously worked at TSG',
        'Availability count',
        'Found TSG via',

        'GRA Avilability',
        'M 12-03 PM',
        'M 03-06 PM',
        'M 06-09 PM',
        'M 09-12 PM',
        'M 12-03 AM',
        'M 03-06 AM',
        'Tue 12-03 PM',
        'Tue 03-06 PM',
        'Tue 06-09 PM',
        'Tue 09-12 PM',
        'Tue 12-03 AM',
        'Tue 03-06 AM',
        'W 12-03 PM',
        'W 03-06 PM',
        'W 06-09 PM',
        'W 09-12 PM',
        'W 12-03 AM',
        'W 03-06 AM',
        'T 12-03 PM',
        'T 03-06 PM',
        'T 06-09 PM',
        'T 09-12 PM',
        'T 12-03 AM',
        'T 03-06 AM',
        'F 12-03 PM',
        'F 03-06 PM',
        'F 06-09 PM',
        'F 09-12 PM',
        'F 12-03 AM',
        'F 03-06 AM',

        'Candidate journey level',
        'Candidate journey state',

        'Sign up state',
        'Sign up updated at',
        'Application state',
        'Application updated at',
        'ESA state',
        'ESA updated at',
        'FTA_L1 state',
        'FTA_L1 updated at',
        'FTA_L2 state',
        'FTA_L2 updated at',

        'ESA booking status',
        'ESA interview outcome',
        'ESA interview updated at',

        'Police Certificate Status',
        'Police Certificate Expiry Date',

        'Contract status',

        'Auditor Name',
        'Audit Status',
        'Profile Status',

        'Tech Audit form Completion status'
        // 'havePc',
        // 'pcType',
        // 'pcOwnership',
        // 'pcBrand',
        // 'pcBrandOther',
        // 'pcModel',
        // 'pcBitVersion',
        // 'laptopSerial',
        // 'laptopBatteryAge',
        // 'laptopBatteryRuntime',
        // 'pcOs',
        // 'pcOsOther',
        // 'pcProcessor',
        // 'pcProcessorOther',
        // 'pcRam',
        // 'hdType',
        // 'hdCapacity',
        // 'pcBrowsers',
        // 'pcAntivirus',
        // 'pcAntivirusOther',
        // 'lastServiceDate',
        // 'pcIPAddress',
        // 'desktopUps',
        // 'desktopUpsRuntime',
        // 'haveHeadset',
        // 'headsetUsb',
        // 'headsetConnectivityType',
        // 'headsetMuteBtn',
        // 'headsetNoiseCancel',
        // 'headsetSpecs',
        // 'primaryConnectionType',
        // 'primaryIsp',
        // 'primaryIspOther',
        // 'primaryConnectedCount',
        // 'primaryDownloadSpeed',
        // 'primaryUploadSpeed',
        // 'primaryPing',
        // 'haveSecondaryConnection',
        // 'secondaryConnectionType',
        // 'secondaryIsp',
        // 'secondaryIspOther',
        // 'secondaryDownloadSpeed',
        // 'secondaryUploadSpeed',
        // 'secondaryPin'
      ];

      const profileLevel = {
        1: 'OMT',
        2: 'Candidate',
        3: 'Non-Tutor'
      };

      const recruitmentLevel = [
        'Sign-up',
        'Application',
        'Essential Skills Assessment',
        'Foundation Training - Level I',
        'Foundation Training - Level II',
        'Document Submission',
        'Contract Acknowledgement',
        'Live one to one teaching session'
      ];

      const jwtClient = new JWT({
        email: process.env['NX_LMS_G_CLIENT_EMAIL'],
        key: process.env['NX_LMS_G_PRIVATE_KEY'].replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      const sheets = google.sheets({ version: 'v4', auth: jwtClient });
      const spreadsheetId = '1OI6WbhMxSo2wOQop5trR-jJdeOwiXtwaWxQUjjQv4W4'; // Replace with your actual spreadsheet ID
      const sheetTabName = frontendUrl.includes('localhost')
        ? 'localhost'
        : frontendUrl.includes('staging')
        ? 'staging'
        : frontendUrl.includes('beta.thirdspaceglobal')
        ? 'production'
        : 'localhost'; // Replace with your actual sheet tab name

      // Insert headers in the second row
      const columnLength = headers.length;
      const columnLetter = await this.columnToLetter(columnLength); // Function to convert column number to letter
      const headerRange = `${sheetTabName}!A2:${columnLetter}2`;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: headerRange,
        valueInputOption: 'RAW', // or 'USER_ENTERED'
        requestBody: {
          values: [headers]
        }
      });

      // Insert "Updating" message in the first row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTabName}!A1:A1`.toString(),
        valueInputOption: 'RAW', // or 'USER_ENTERED'
        requestBody: {
          values: [
            [
              'Updating:' +
                moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss')
            ]
          ]
        }
      });

      // Clear G Sheet
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetTabName}!A3:ZZ` // clear the entire sheet tab except the first two rows
      });

      // Find the total number of users with level 2
      const totalUsers = await this.prisma.user.count({
        where: {
          level: { in: [1, 2] }
        }
      });

      const batchSize = 750;
      let writtenRowCount = 0;

      // Loop through batches using skip and take
      for (let i = 0; i < totalUsers; i += batchSize) {
        const userData = await this.prisma.user.findMany({
          where: {
            level: { in: [1, 2] }
          },
          skip: i, // Skip users processed in previous batches
          take: batchSize, // Limit to batchSize
          select: {
            tsp_id: true,
            username: true,
            level: true,
            created_at: true,
            hris_personal_data: {
              orderBy: {
                id: 'desc'
              },
              take: 1,
              select: {
                id: true,
                shortName: true,
                idLanguage: true,
                gender: true,
                dob: true,
                age: true,
                nic: true
              }
            },
            approved_contract_data: {
              select: {
                contract_url: true,
                contract_url_status: true,
                hr_admin_approval: true
              }
            },

            user_hris_progress: {
              select: {
                auditorId: true,
                tutorStatus: true,
                profileStatus: true,
                itDataCount: true,
                auditor: {
                  select: {
                    approved_personal_data: {
                      select: {
                        shortName: true
                      }
                    }
                  }
                }
              }
            },
            hris_contact_data: {
              orderBy: {
                id: 'desc'
              },
              take: 1,
              select: {
                workEmail: true,
                mobileNumber: true,
                residingCountry: true,
                residingProvince: true,
                residingDistrict: true
              }
            },
            hris_education_data: {
              orderBy: {
                id: 'desc'
              },
              take: 1,
              select: {
                olSyllabus: true,
                olYear: true,
                olMaths: true,
                olEnglish: true
              }
            },
            hris_work_exp_data: {
              orderBy: {
                id: 'desc'
              },
              take: 1,
              select: {
                havePreTsg: true
              }
            },
            graRegistrationData: {
              select: {
                knewAboutUs: true
              }
            },
            CandidateLevel: true,
            hris_qualifications_data: {
              orderBy: {
                id: 'desc'
              },
              take: 1,
              select: {
                haveStartedHq: true,
                xother_quali_data: {
                  select: {
                    id: true,
                    courseType: true,
                    fieldStudy: true,
                    hasCompleted: true,
                    mainInst: true,
                    affiInst: true
                  }
                }
              }
            },

            initialAssessment: {
              orderBy: {
                id: 'desc'
              },
              take: 1,
              select: {
                language: true,
                subjectKnowledge: true,
                mindset: true,
                commitment: true,
                finalOutcome: true,
                finalReason: true,
                createdAt: true
              }
            },
            approved_right2work_data: {
              select: {
                pccState: true,
                pccExpireDate: true
              }
            },
            approved_it_data: true,
            BookingStatus2: {
              orderBy: [
                {
                  date: 'desc'
                },
                {
                  id: 'desc'
                }
              ],
              take: 1,
              where: {
                appointment_type_ref: {
                  is: {
                    id: 5
                  }
                }
              },
              select: {
                date: true,
                status: true,
                bs_booking_status_ref: {
                  select: { status: true }
                }
              }
            },
            GRASlot: true,
            _count: {
              select: {
                GRASlot: true
              }
            }
          }
        });

        const [days, timeRange] = await Promise.all([
          this.prisma.gOADaysOFWeek.findMany(),
          this.prisma.gRATimeRange.findMany()
        ]);

        //------ Data Preparation Application form - G Sheets --------------------------------------
        const values = userData
          .filter(
            (e) => e.hris_personal_data && e.hris_personal_data.length > 0
          )
          .map((user) => {
            const level = user.CandidateLevel?.level;
            const stepStatus =
              user.CandidateLevel?.level &&
              user.CandidateLevel?.[`step${level}`]
                ? user.CandidateLevel?.[`step${level}`]
                : user.CandidateLevel
                ? 'pending'
                : '';

            const graSlotData = days.reduce((acc, day) => {
              timeRange.forEach((time) => {
                // Check if there is a matching entry in graSlot
                const isSelect =
                  user.GRASlot &&
                  user.GRASlot.some(
                    (d) => d.timeRangeId === time.id && d.dateId === day.id
                  )
                    ? 'TRUE'
                    : user.GRASlot.length > 0
                    ? 'FALSE'
                    : '';
                // Push the isSelect value to the accumulator array
                acc.push(isSelect);
              });
              return acc;
            }, []);

            return [
              user.tsp_id,
              user.hris_personal_data[0]?.shortName,
              user.username,
              formatToDate(user.created_at),
              profileLevel[user.level] ? profileLevel[user.level] : user.level,

              user.hris_personal_data[0]?.gender,
              formatToDate(moment(user.hris_personal_data[0]?.dob)),
              user.hris_personal_data[0]?.dob
                ? moment().diff(
                    moment(user.hris_personal_data[0]?.dob),
                    'years'
                  )
                : '',
              user.hris_personal_data[0]?.nic,
              user.hris_personal_data[0]?.idLanguage,
              user.hris_contact_data[0]?.workEmail,
              user.hris_contact_data[0]?.mobileNumber,
              user.hris_contact_data[0]?.residingCountry,
              user.hris_contact_data[0]?.residingProvince,
              user.hris_contact_data[0]?.residingDistrict,

              user.hris_education_data[0]?.olSyllabus,
              user.hris_education_data[0]?.olYear,
              user.hris_education_data[0]?.olMaths,
              user.hris_education_data[0]?.olEnglish,
              user.hris_qualifications_data[0]?.xother_quali_data[0]
                ?.courseType,
              user.hris_qualifications_data[0]?.xother_quali_data[0]
                ?.fieldStudy,
              user.hris_qualifications_data[0]?.xother_quali_data[0]
                ?.hasCompleted,
              user.hris_qualifications_data[0]?.xother_quali_data[0]?.mainInst,
              user.hris_qualifications_data[0]?.xother_quali_data[0]?.affiInst,
              user.hris_work_exp_data[0]?.havePreTsg,
              user._count.GRASlot,
              user.graRegistrationData?.knewAboutUs,

              'GRA Avilability',
              ...graSlotData,

              recruitmentLevel[level - 1],
              `${recruitmentLevel[level - 1]} - ${stepStatus}`,

              user.CandidateLevel?.step1,
              formatToDatetime(user.CandidateLevel?.step1UpdatedAt),
              user.CandidateLevel?.step2,
              formatToDatetime(user.CandidateLevel?.step2UpdatedAt),
              user.CandidateLevel?.step3,
              formatToDatetime(user.CandidateLevel?.step3UpdatedAt),
              user.CandidateLevel?.step4,
              formatToDatetime(user.CandidateLevel?.step4UpdatedAt),
              user.CandidateLevel?.step5,
              formatToDatetime(user.CandidateLevel?.step5UpdatedAt),

              user.BookingStatus2[0]?.bs_booking_status_ref?.status,
              user.initialAssessment[0]?.finalOutcome === 'Fail'
                ? `${user.initialAssessment[0]?.finalOutcome} - ${user.initialAssessment[0]?.finalReason}`
                : user.initialAssessment[0]?.finalOutcome,
              formatToDatetime(user.initialAssessment[0]?.createdAt),

              user.approved_right2work_data?.pccState,
              formatToDate(user.approved_right2work_data?.pccExpireDate),

              user.approved_contract_data?.contract_url_status === 'approved'
                ? 'audit approved'
                : user.approved_contract_data?.contract_url_status ===
                  'rejected'
                ? 'audit rejected'
                : user.approved_contract_data?.contract_url
                ? 'audit pending'
                : user.approved_contract_data?.hr_admin_approval === 'approved'
                ? 'signature pending'
                : user.approved_contract_data?.hr_admin_approval === 'rejected'
                ? 'details rejected'
                : user.user_hris_progress?.profileStatus
                ? 'contract pending'
                : '',

              user.user_hris_progress?.auditor?.approved_personal_data
                ?.shortName,
              user.user_hris_progress?.tutorStatus,
              user.user_hris_progress?.profileStatus,

              user.user_hris_progress?.itDataCount
              // user.approved_it_data?.havePc,
              // user.approved_it_data?.pcType,
              // user.approved_it_data?.pcOwnership,
              // user.approved_it_data?.pcBrand,
              // user.approved_it_data?.pcBrandOther,
              // user.approved_it_data?.pcModel,
              // user.approved_it_data?.pcBitVersion,
              // user.approved_it_data?.laptopSerial,
              // user.approved_it_data?.laptopBatteryAge,
              // user.approved_it_data?.laptopBatteryRuntime,
              // user.approved_it_data?.pcOs,
              // user.approved_it_data?.pcOsOther,
              // user.approved_it_data?.pcProcessor,
              // user.approved_it_data?.pcProcessorOther,
              // user.approved_it_data?.pcRam,
              // user.approved_it_data?.hdType,
              // user.approved_it_data?.hdCapacity,
              // user.approved_it_data?.pcBrowsers,
              // user.approved_it_data?.pcAntivirus,
              // user.approved_it_data?.pcAntivirusOther,
              // user.approved_it_data?.lastServiceDate,
              // user.approved_it_data?.pcIPAddress,
              // user.approved_it_data?.desktopUps,
              // user.approved_it_data?.desktopUpsRuntime,
              // user.approved_it_data?.haveHeadset,
              // user.approved_it_data?.headsetUsb,
              // user.approved_it_data?.headsetConnectivityType,
              // user.approved_it_data?.headsetMuteBtn,
              // user.approved_it_data?.headsetNoiseCancel,
              // user.approved_it_data?.headsetSpecs,
              // user.approved_it_data?.primaryConnectionType,
              // user.approved_it_data?.primaryIsp,
              // user.approved_it_data?.primaryIspOther,
              // user.approved_it_data?.primaryConnectedCount,
              // user.approved_it_data?.primaryDownloadSpeed,
              // user.approved_it_data?.primaryUploadSpeed,
              // user.approved_it_data?.primaryPing,
              // user.approved_it_data?.haveSecondaryConnection,
              // user.approved_it_data?.secondaryConnectionType,
              // user.approved_it_data?.secondaryIsp,
              // user.approved_it_data?.secondaryIspOther,
              // user.approved_it_data?.secondaryDownloadSpeed,
              // user.approved_it_data?.secondaryUploadSpeed,
              // user.approved_it_data?.secondaryPing
            ];
          });

        if (!values.length) {
          continue;
        }

        //-------Prepare Cell Range --------------------------------------------------------
        const rowNumber = values.length + writtenRowCount + 2; // Data starts from row 3
        const dataRange = `${sheetTabName}!A${
          writtenRowCount + 3
        }:${columnLetter}${rowNumber}`;

        writtenRowCount += values.length; // set new row count
        console.log(`dataRange ${values.length}/${totalUsers} ${dataRange}`);
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: dataRange,
          valueInputOption: 'RAW', // or 'USER_ENTERED'
          requestBody: {
            values
          }
        });
      }

      // Final update timestamp
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTabName}!A1:B1`,
        valueInputOption: 'RAW', // or 'USER_ENTERED'
        requestBody: {
          values: [
            [
              sheetTabName,
              'Updated: ' +
                moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss')
            ]
          ]
        }
      });
      console.log(sheetTabName + ': rows updated: ' + writtenRowCount); // Log the result
    } catch (error) {
      console.log(error);
    }
  } //end: handleCronApplicationFormConnector

  @Cron('0 */30 * * * *', {
    name: 'handleCronLmsCompletionUpdate'
  }) // every 30 minutes
  async handleCronLmsCompletionUpdate() {
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:4200/';
    if (frontendUrl.includes('beta.thirdspaceglobal')) {
      await new Promise((resolve) => setTimeout(resolve, 180000)); //delay 3 minutes
    }

    try {
      console.log(
        'Cron handleCronLmsCompletionUpdate @:',
        moment().format('YYYY-MM-DD HH:mm:ss')
      );

      const fetchedLmsData: any = await this.prisma.$queryRaw`
        SELECT u.id lms_id, COALESCE(acd.tsp_id, hp.tsp_id) AS tsp_id,
        c_1182.enrolled_on c_1182_start, c_1182.completed_on c_1182_end, c_1182.completion_percentage c_1182_score,
        c_1184.enrolled_on c_1184_start, c_1184.completed_on c_1184_end, c_1184.completion_percentage c_1184_score,
        bs.ft_lvl1_enabled, bs.ft_lvl1_completed, bs.ft_lvl2_enabled, bs.ft_lvl2_completed, 
        bs.level bs_level,
        hp.lms_email, hp.tsp_id tsp_hp,
        acd.work_email, acd.tsp_id tsp_acd,
        u.email 
        FROM lms_user u 
        LEFT JOIN lms_course_user c_1182 ON (u.id = c_1182.user_id AND c_1182.course_id = 1182) 
        LEFT JOIN lms_course_user c_1184 ON (u.id = c_1184.user_id AND c_1184.course_id = 1184) 
        LEFT JOIN hris_progress hp ON (u.email = hp.lms_email) 
        LEFT JOIN approved_contact_data acd ON (u.email = acd.work_email) 
        LEFT JOIN bs_candidate_level bs ON (COALESCE(acd.tsp_id, hp.tsp_id) = bs.candidate_id)
        WHERE 1 
        AND COALESCE(acd.tsp_id, hp.tsp_id) IS NOT NULL
        AND bs.candidate_id IS NOT NULL 
        AND u.deleted = 0 
        -- AND u.id = 18097
        `;
      // 21056 x3, // 18097 change email
      // console.log(
      //   'fetchedLmsData',
      //   JSON.stringify(fetchedLmsData).substring(0, 1000)
      // );
      console.log('fetchedLmsData_length', fetchedLmsData.length);

      const tempArr = [];
      const batchSize = 20; // Adjust the batch size as needed

      // since promise all cause heavey load on db, do batch process
      for (let i = 0; i < fetchedLmsData.length; i += batchSize) {
        const batch = fetchedLmsData.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (item) => {
            const tempData: {
              ftLvl1Enabled?: number;
              ftLvl1EnabledAt?: string;
              ftLvl1Completed?: number;
              ftLvl1CompletedAt?: string;
              ftLvl2Enabled?: number;
              ftLvl2EnabledAt?: string;
              ftLvl2Completed?: number;
              ftLvl2CompletedAt?: string;
              updatedAt?: string;
            } = {};
            if (
              item.c_1182_start === null ||
              (item.ft_lvl1_completed === 100 && item.ft_lvl2_completed === 100)
            ) {
              return; // Skip this item
            } else {
              // FTA_L1 update completion
              if (item.c_1182_start !== null && item.ft_lvl1_enabled === 0) {
                tempData.ftLvl1Enabled = 1;
                tempData.ftLvl1EnabledAt = new Date().toISOString();
              }
              if (item.ft_lvl1_completed !== 100 && item.c_1182_score != null) {
                if (
                  item.c_1182_score === 100 ||
                  (item.c_1182_score >= 95 && item.c_1182_end !== null)
                ) {
                  tempData.ftLvl1Completed = 100;
                  tempData.ftLvl1CompletedAt = new Date().toISOString();
                } else if (
                  item.c_1182_score > 0 &&
                  item.c_1182_score != item.ft_lvl1_completed
                ) {
                  tempData.ftLvl1Completed = item.c_1182_score;
                }
              }
              // FTA_L2 update completion
              if (item.c_1184_start !== null && item.ft_lvl2_enabled === 0) {
                tempData.ftLvl2Enabled = 1;
                tempData.ftLvl2EnabledAt = new Date().toISOString();
              }
              if (item.ft_lvl2_completed !== 100 && item.c_1184_score != null) {
                if (
                  item.c_1184_score === 100 ||
                  (item.c_1184_score >= 95 && item.c_1184_end !== null)
                ) {
                  tempData.ftLvl2Completed = 100;
                  tempData.ftLvl2CompletedAt = new Date().toISOString();
                } else if (
                  item.c_1184_score > 0 &&
                  item.c_1184_score != item.ft_lvl2_completed
                ) {
                  tempData.ftLvl2Completed = item.c_1184_score;
                }
              }
              if (Object.keys(tempData).length === 0) {
                return;
              } else {
                tempData.updatedAt = new Date().toISOString();
              }
            }

            await this.prisma.candidateLevel.updateMany({
              where: { candidate_id: item.tsp_id },
              data: tempData
            });

            tempArr.push(item.tsp_id);
          })
        );
      } //end: for loop

      tempArr.length > 0 &&
        (await this.prisma.hrisIncidentLogTable.create({
          data: {
            createdAt: new Date().toISOString(),
            system: 'gra_fta_lms',
            cron: 'handleCronApplicationFormConnector',
            comment:
              tempArr.length +
              ' - records updated in bs_candidate_level @ ' +
              process.env.FRONT_URL,
            dataSet: tempArr.toString().substring(0, 9999)
          }
        }));
      console.log(
        tempArr.length,
        ' - records updated by handleCronApplicationFormConnector'
      );

      return null;
    } catch (error) {
      console.log(error);
    }
  } //end: handleCronApplicationFormConnector
}

const formatToDate = (datetime) =>
  datetime && moment(datetime).isValid()
    ? moment(datetime).format('YYYY-MM-DD')
    : '';

const formatToDatetime = (datetime) =>
  datetime && moment(datetime).isValid()
    ? moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    : '';
