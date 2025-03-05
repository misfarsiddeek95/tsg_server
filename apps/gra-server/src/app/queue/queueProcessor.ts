// queue.processor.ts

import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import moment = require('moment');
import { Job } from 'bull';
import { MailService } from '../mail/mail.service';

@Processor('appointment_booking_queue')
export class QueueProcessor {
  constructor(private prisma: PrismaService, private mail: MailService) {}
  private readonly logger = new Logger(QueueProcessor.name);

  // wait(ms) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       console.log('Done waiting');
  //       resolve(ms);
  //     }, ms);
  //   });
  // }

  @Process('process_job')
  async handleProcessJob(job: Job) {
    this.logger.debug(`Processing job ${job.id}`);
    try {
      // await this.wait(1000);
      const res = await this.processJobBookAppointment(job.data);

      // return res;
    } catch (error) {
      this.logger.error(`Error processing job ${job.id}: ${error.message}`);
      throw error;
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
    job.discard();
  }

  /**
   * distributeInterviewers - function
   * 2024-03-28
   * Dilki / Gishan / Banu
   * Function to find the interviewer with lowest workload within recent time period
   * is returned to be used for slot assigning (for better workload distribution)
   * concidering: completed apointments since current week began
   * & any booking confirmed upcoming interviews
   */
  async distributeInterviewers(interviewerIds) {
    const interviewerLoad = interviewerIds.reduce((acc, curr) => {
      acc[curr] = 0;
      return acc;
    }, {});

    const begin = moment().isoWeekday(1).startOf('week');

    const currentDate = new Date(
      moment().tz('Asia/Kolkata').format('YYYY-MM-DD')
    );

    const startOfWeek = begin.add(1, 'd').format();

    const bookingConfirmedSlots = await this.prisma.bookingStatus.findMany({
      where: {
        interviewer_id: {
          in: interviewerIds
        },
        date: {
          gte: currentDate
        },
        status: 3
      }
    });

    const bookingCompleted = await this.prisma.bookingStatus.findMany({
      where: {
        interviewer_id: {
          in: interviewerIds
        },
        date: {
          gte: startOfWeek
        },
        status: 8
      }
    });

    // Count bookings for each interviewer
    bookingCompleted.forEach((booking) => {
      interviewerLoad[booking.interviewer_id] = !interviewerLoad[
        booking.interviewer_id
      ]
        ? 1
        : interviewerLoad[booking.interviewer_id] + 1;
    });

    bookingConfirmedSlots.forEach((booking) => {
      interviewerLoad[booking.interviewer_id] = !interviewerLoad[
        booking.interviewer_id
      ]
        ? 1
        : interviewerLoad[booking.interviewer_id] + 1;
    });

    const lowestCountInterviewerId = Object.entries(interviewerLoad).sort(
      (a: any, b: any) => a[1] - b[1]
    )[0][0];

    console.log('lowestCountInterviewerId', lowestCountInterviewerId);
    return +lowestCountInterviewerId;
  }

  async processJobBookAppointment(job) {
    try {
      const { details, actionedBy } = job;

      const [res, bs] = await this.prisma.$transaction(async (tx) => {
        let bs: any = null;
        let wd: any = null;
        let res: any = null;
        let selectedInterviewerId = 0;

        // console.log('processJobBookAppointment-details', details);

        if (details.bookingScenario === 'Reschedule') {
          console.log('processJob-Reschedule');

          if (!details.withdrawBookingId) {
            throw new Error('Withdrawal slot info missing');
          }

          // find list of interviewers to avoid
          const avoidBookingInterviewerIdsFetch =
            await this.prisma.bookingHistory.findMany({
              where: {
                booking_status_id: { in: [9, 10, 12] },
                interviewer_id: { not: null },
                candidate_id: details.candidateId
              },
              distinct: ['interviewer_id'],
              select: {
                interviewer_id: true
              }
            });
          const avoidBookingInterviewerIdsArray =
            avoidBookingInterviewerIdsFetch.map((item) => item.interviewer_id);

          // find all interviewers that given avilable slots for given date & timeslot
          const bsMany = await this.prisma.bookingStatus.findMany({
            where: {
              status: 1,
              date: {
                equals: new Date(
                  moment
                    .tz(details.dateSelected, 'asia/colombo')
                    .format('YYYY-MM-DD')
                )
              },
              candidate_id: null,
              appointment_type_ref_id: details.appointmentTypeId,
              time_slot_id: details.slotId,
              interviewer_id: { not: { in: avoidBookingInterviewerIdsArray } }
            },
            select: {
              interviewer_id: true
            }
          });

          if (!(bsMany && bsMany.length > 0)) {
            console.log('processJob-Reschedule-error');
            throw new Error("Slots doesn't exist");
          } else {
            //found avilable interviewers
            if (bsMany.length > 1) {
              //found more than one interviewer
              const interviewerIds = bsMany.map((item) => item.interviewer_id);
              selectedInterviewerId = await this.distributeInterviewers(
                interviewerIds
              );
            }
          }

          bs = await tx.bookingStatus.findFirst({
            where: {
              status: 1,
              date: {
                equals: new Date(
                  moment
                    .tz(details.dateSelected, 'asia/colombo')
                    .format('YYYY-MM-DD')
                )
              },
              candidate_id: null,
              appointment_type_ref_id: details.appointmentTypeId,
              time_slot_id: details.slotId,
              interviewer_id:
                selectedInterviewerId !== 0
                  ? +selectedInterviewerId
                  : { not: { in: avoidBookingInterviewerIdsArray } }
            }
          });

          if (!bs) {
            throw new Error("Slot doesn't exists for reschedule");
          }

          wd = await tx.bookingStatus.findUnique({
            where: { id: details.withdrawBookingId }
          });

          // must be one of: BOOKED, MISSED
          if (
            !(
              wd &&
              [3, 11].includes(wd.status) &&
              wd.candidate_id == details.candidateId
            )
          ) {
            throw new Error('Withdrawal slot not valid');
          } else {
            if ([3].includes(wd.status)) {
              // only if BOOKED - clear candidate info
              await tx.bookingStatus.update({
                where: {
                  id: details.withdrawBookingId
                },
                data: {
                  date_slot_inter: 'Available after Reschedule',
                  status: 1,
                  candidate_id: null,
                  updated_at: new Date().toISOString(),
                  updated_by: +actionedBy
                }
              });
              // add history record as reschedule
              await tx.bookingHistory.create({
                data: {
                  created_by: +actionedBy,
                  candidate_id: details.candidateId,
                  appointment_type_id: wd.appointment_type_ref_id,
                  booking_status_id: 7, // WITHDRAW
                  slot_time_id: wd.time_slot_id,
                  date: wd.date,
                  withdraw_reason: 'RESCHEDULE',
                  booking_id: wd.id,
                  interviewer_id: wd.interviewer_id
                }
              });
            } else {
              // if MISSED - mark the old slot as completed to avoid duplicate reschedules
              await tx.bookingStatus.update({
                where: {
                  id: details.withdrawBookingId
                },
                data: {
                  date_slot_inter: 'Completed after Missed Reschedule',
                  status: 4, // COMPLETED
                  updated_at: new Date().toISOString(),
                  updated_by: +actionedBy
                }
              });
            }

            res = await tx.bookingStatus.update({
              where: {
                id: bs.id
              },
              data: {
                updated_at: new Date().toISOString(),
                updated_by: +actionedBy,
                candidate_id: details.candidateId,
                date_slot_inter: 'Booked after Reschedule',
                status: details.status
              },
              select: {
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
                },
                bs_all_booking_slot: true,
                date: true
              }
            });

            if (res) {
              await tx.bookingHistory.create({
                data: {
                  created_by: +actionedBy,
                  candidate_id: details.candidateId,
                  appointment_type_id: bs.appointment_type_ref_id,
                  booking_status_id: 3,
                  slot_time_id: bs.time_slot_id,
                  date: bs.date,
                  withdraw_reason: 'BOOKED',
                  booking_id: bs.id,
                  interviewer_id: bs.interviewer_id
                }
              });
            } else {
              console.log('processJob-Reschedule-error');
              throw new Error('Reshedule slot action failed');
            }
          }
        } else if (details.bookingScenario === 'Booking') {
          console.log('processJob-Booking');

          // find list of interviewers to avoid
          const avoidBookingInterviewerIdsFetch =
            await this.prisma.bookingHistory.findMany({
              where: {
                booking_status_id: { in: [9, 10, 12] },
                interviewer_id: { not: null },
                candidate_id: details.candidateId
              },
              distinct: ['interviewer_id'],
              select: {
                interviewer_id: true
              }
            });
          const avoidBookingInterviewerIdsArray =
            avoidBookingInterviewerIdsFetch.map((item) => item.interviewer_id);

          // find all interviewers that given avilable slots for given date & timeslot
          const bsMany = await this.prisma.bookingStatus.findMany({
            where: {
              status: 1,
              date: {
                equals: new Date(
                  moment
                    .tz(details.dateSelected, 'asia/colombo')
                    .format('YYYY-MM-DD')
                )
              },
              candidate_id: null,
              appointment_type_ref_id: details.appointmentTypeId,
              time_slot_id: details.slotId,
              interviewer_id: { not: { in: avoidBookingInterviewerIdsArray } }
            },
            select: {
              interviewer_id: true
            }
          });

          // check for exisiting booked appointment assigned to candidate
          const bsBookedAppointmentFound =
            await this.prisma.bookingStatus.count({
              where: {
                status: 3,
                candidate_id: details.candidateId,
                appointment_type_ref_id: details.appointmentTypeId
              }
            });

          if (!(bsMany && bsMany.length > 0)) {
            console.log("processJob-Booking-error: Slots doesn't exist");
            throw new Error("Slots doesn't exist");
          } else if (bsBookedAppointmentFound > 0) {
            console.log('processJob-Booking-error: Exisiting booking found');
            throw new Error('Exisiting booking found');
          } else {
            //found avilable interviewers
            if (bsMany.length > 1) {
              //found more than one interviewer
              const interviewerIds = bsMany.map((item) => item.interviewer_id);
              selectedInterviewerId = await this.distributeInterviewers(
                interviewerIds
              );
            }

            bs = await tx.bookingStatus.findFirst({
              where: {
                status: 1,
                date: {
                  equals: new Date(
                    moment
                      .tz(details.dateSelected, 'asia/colombo')
                      .format('YYYY-MM-DD')
                  )
                },
                candidate_id: null,
                appointment_type_ref_id: details.appointmentTypeId,
                time_slot_id: details.slotId,
                interviewer_id:
                  selectedInterviewerId !== 0
                    ? +selectedInterviewerId
                    : { not: { in: avoidBookingInterviewerIdsArray } }
              }
            });

            if (!bs) {
              throw new Error('Slot not found');
            }

            res = await tx.bookingStatus.update({
              where: {
                id: bs.id
              },
              data: {
                updated_at: new Date().toISOString(),
                updated_by: +actionedBy,
                candidate_id: details.candidateId,
                date_slot_inter: 'Booked after Reschedule',
                status: details.status
              },
              select: {
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
                },
                bs_all_booking_slot: true,
                date: true
              }
            });

            if (res) {
              await tx.bookingHistory.create({
                data: {
                  created_by: +actionedBy,
                  candidate_id: details.candidateId,
                  appointment_type_id: bs.appointment_type_ref_id,
                  booking_status_id: 3,
                  slot_time_id: bs.time_slot_id,
                  date: bs.date,
                  withdraw_reason: 'BOOKED',
                  booking_id: bs.id,
                  interviewer_id: bs.interviewer_id
                }
              });
            }
          }
        } else {
          throw new Error('bookingScenario not found');
        }
        console.log(
          'processJob-response:' + JSON.stringify(bs).substring(0, 100) + 'EOL'
        );

        return [res, bs];
      });

      if (details.appointmentTypeId === 1) {
        await this.mail.bookPhoneInterview(
          res.candidate.approved_personal_data?.firstName ?? '',
          res.candidate.approved_contact_data?.workEmail ?? '',
          moment(res.date).format('DD/MM/YYYY'),
          res.bs_all_booking_slot.slot_time,
          'Online'
        );
      } else if (details.appointmentTypeId === 2) {
        await this.mail.bookTeachingInterview(
          res.candidate.approved_personal_data?.firstName ?? '',
          res.candidate.approved_contact_data?.workEmail ?? '',
          moment(res.date).format('DD/MM/YYYY'),
          res.bs_all_booking_slot.slot_time,
          'Online'
        );
      } else if (details.appointmentTypeId === 5) {
        if (['Booking', 'Reschedule'].includes(details.bookingScenario)) {
          await this.mail.sendEsaApssBookingAndRescheduleConfirmation(
            res.candidate.approved_contact_data?.workEmail ?? '',
            res.candidate.approved_personal_data?.firstName ?? '',
            moment(res.date).format('DD/MM/YYYY'),
            res.bs_all_booking_slot.slot_time,
            details.bookingScenario
          );
        }
      } else if (details.appointmentTypeId === 6) {
        if (['Booking', 'Reschedule'].includes(details.bookingScenario)) {
          await this.mail.sendFtaL1AndL2ApssBookingAndRescheduleConfirmation(
            res.candidate.approved_contact_data?.workEmail ?? '',
            res.candidate.approved_personal_data?.firstName ?? '',
            moment(res.date).format('DD/MM/YYYY'),
            res.bs_all_booking_slot.slot_time,
            details.bookingScenario === 'Reschedule',
            1
          );
        }
      } else if (details.appointmentTypeId === 7) {
        if (['Booking', 'Reschedule'].includes(details.bookingScenario)) {
          await this.mail.sendFtaL1AndL2ApssBookingAndRescheduleConfirmation(
            res.candidate.approved_contact_data?.workEmail ?? '',
            res.candidate.approved_personal_data?.firstName ?? '',
            moment(res.date).format('DD/MM/YYYY'),
            res.bs_all_booking_slot.slot_time,
            details.bookingScenario === 'Reschedule',
            2
          );
        }
      }

      return {
        success: true,
        details: {
          candidateId: details.candidateId,
          id: bs.id,
          status: details.status
        }
      };
    } catch (error) {
      // Job failed
      console.log('processJob_error:', error.message);
      return { success: false, error: error.message };
    }
  }
}
