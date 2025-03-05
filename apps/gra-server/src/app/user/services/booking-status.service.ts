import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../../prisma.service';
import * as moment from 'moment-timezone';
import { MailService } from './../../mail/mail.service';
import {
  AddBulkEventAvailabilityDto,
  AvailableSlotsInterviewerDto,
  CoverAndRemoveSlotRequestDto,
  CandidateUpdateWithdrawBookingDto,
  ConvertAllSlotsToCoverRequestDto,
  CandidateBookAppointmentRequestDto,
  CreateBookingStatusDto,
  DailyInterviewerCalendarFetchRequestDto,
  FetchAvailableSlotsDto,
  FetchSlotsForSwapRequestDto,
  InterviewerAvailabilitySlotsFetchRequestDto,
  InterviewerContractUpdateDto,
  GetInterviewerContractDetailsDto,
  InterviewerTimeTableFetchDto,
  RemoveAllOpenSlotsDto,
  GetRescheduleCountDto,
  BulkReschedulingTableFetchRequestDto,
  BulkSwapAndRescheduleRequestDto,
  AdminMasterTableRequestDto
} from '../dtos/booking-status.dto';
import {
  InjectQueue,
  OnGlobalQueueCompleted,
  OnQueueCompleted
} from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BookingStatusService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    @InjectQueue('appointment_booking_queue') private readonly myQueue: Queue
  ) {}

  @OnGlobalQueueCompleted()
  async OnGlobalQueueCompleted(jobId: number, result: any) {
    const job = await this.myQueue.getJob(jobId);
    console.log('(Global) on completed: job ', job.id, ' -> result: ', result);
  }

  async addBulkEventAvailability(
    details: AddBulkEventAvailabilityDto,
    actionedBy: number
  ) {
    try {
      if (!details.dateArray || details.dateArray.length === 0) {
        throw new Error('Invalid dates given');
      } else if (
        !details.timeSlotIdArray ||
        details.timeSlotIdArray.length === 0
      ) {
        throw new Error('Invalid avilability slots given');
      }

      //get existing availabilities provided by interviewer within each day
      const existingAvailabilitiesOnAllDays = await Promise.all(
        details.dateArray.map(async (dateString) => {
          const eventDateObject = new Date(dateString); // Convert date string to Date object

          // Retrieve data for each date separately
          const availabilitiesForDay = await this.prisma.bookingStatus.findMany(
            {
              where: {
                interviewer_id: details.interviewerId,
                date: {
                  equals: eventDateObject
                }
              },
              select: {
                date: true,
                bs_all_booking_slot: {
                  select: {
                    start_time: true,
                    end_time: true,
                    id: true
                  }
                }
              }
            }
          );

          return {
            date: dateString,
            availabilities: availabilitiesForDay
          };
        })
      );

      const availabilityDetailsForRequest =
        await this.prisma.allBookingSlot.findMany({
          where: {
            id: {
              in: details.timeSlotIdArray
            }
          },
          select: {
            start_time: true,
            end_time: true,
            id: true
          }
        });

      const slotsToCreateAll = {};
      const overlappingSlotsAll = {};
      let slotsToCreateAllCount = 0;
      let overlappingSlotsAllCount = 0;

      existingAvailabilitiesOnAllDays.map(
        (existingAvailabilitiesWithingDay) => {
          const slotsToCreate = new Set(details.timeSlotIdArray);
          const overlappingSlots = new Set();

          existingAvailabilitiesWithingDay.availabilities.forEach(
            (existingAvailability) => {
              availabilityDetailsForRequest.forEach((requestedSlot) => {
                const overlap =
                  requestedSlot.start_time <
                    existingAvailability.bs_all_booking_slot.end_time &&
                  requestedSlot.end_time >
                    existingAvailability.bs_all_booking_slot.start_time;
                if (overlap) {
                  overlappingSlots.add(requestedSlot.id);
                  slotsToCreate.delete(requestedSlot.id); // Remove overlapping slots from slotsToCreate
                }
              });
            }
          );

          if ([...slotsToCreate].length > 0) {
            slotsToCreateAll[existingAvailabilitiesWithingDay.date] = [
              ...slotsToCreate
            ];
            slotsToCreateAllCount += [...slotsToCreate].length;
          }
          if ([...overlappingSlots].length > 0) {
            overlappingSlotsAll[existingAvailabilitiesWithingDay.date] = [
              ...overlappingSlots
            ];
            overlappingSlotsAllCount += [...overlappingSlots].length;
          }
        }
      );

      /**
       * bullk slot availability feature
       * 06-02-2024 Banu
       * validation rules
       * 12-03-2024 KT
       * bulk day select feature
       * 13-03-2024 Banu
       */
      if (Object.keys(slotsToCreateAll).length === 0) {
        throw new Error('No valid availability slots created');
      } else {
        const createManyData = Object.entries(slotsToCreateAll).flatMap(
          ([date, timeSlotIds]) =>
            (timeSlotIds as number[]).map((timeSlotId) => ({
              created_by: +actionedBy,
              date_slot_inter: `${timeSlotId}_${details.appointmentTypeId}_${date}__${details.interviewerId}`,
              time_slot_id: timeSlotId,
              interviewer_id: details.interviewerId,
              status: details.status,
              date: new Date(date),
              appointment_type_ref_id: details.appointmentTypeId
            }))
        );

        await this.prisma.bookingStatus.createMany({
          data: createManyData
        });
        return {
          success: true,
          details: {
            ...details,
            slotsToCreateAll,
            overlappingSlotsAll,
            slotsToCreateAllCount,
            overlappingSlotsAllCount
          }
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async terminateJob(jobId: string) {
    try {
      const job = this.myQueue.getJob(jobId);

      if (job) {
        if (job['finishedOn'] === null || job['finishedOn'] === undefined) {
          (await job).remove();
        } else {
          return { success: false };
        }

        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async getJobStatus(jobId: number) {
    try {
      const job = await this.myQueue.getJob(jobId);

      if (!job) {
        throw new Error('Job not found');
      } else if (job['finishedOn'] && job['finishedOn'] !== null) {
        const isExistingBooking = await this.prisma.bookingStatus.findFirst({
          where: {
            time_slot_id: job.data.details.slotId,
            candidate_id: job.data.details.candidateId,
            status: 3
          },
          include: {
            bs_all_booking_slot: true,
            candidate: {
              include: {
                CandidateLevel: true
              }
            }
          }
        });

        if (isExistingBooking) {
          console.log(
            'isExistingBooking',
            isExistingBooking.id,
            isExistingBooking.date,
            isExistingBooking.bs_all_booking_slot.slot_time,
            isExistingBooking.time_slot_id,
            isExistingBooking.interviewer_id
          );

          return {
            success: true,
            jobFinishedAt: moment(job['finishedOn']).format(
              'YYYY-MM-DD hh:mm A'
            ),
            details: {
              id: isExistingBooking.id,
              date: isExistingBooking.date,
              slotTime: isExistingBooking.bs_all_booking_slot.slot_time,
              slotStartTime: isExistingBooking.bs_all_booking_slot.start_time,
              slotEndTime: isExistingBooking.bs_all_booking_slot.end_time,
              candidateLevel: isExistingBooking.candidate.CandidateLevel.level,
              slotId: isExistingBooking.time_slot_id,
              lastBookingStatus: isExistingBooking.status,
              interviewerId: isExistingBooking.interviewer_id
            }
          };
        } else {
          throw new Error('Job task failed');
        }
      } else {
        throw new Error('Job not finished');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async bookingStatusUpdate(
    details: CandidateBookAppointmentRequestDto,
    actionedBy: number
  ) {
    try {
      // Add incoming request details to the queue
      const res = await this.myQueue.add('process_job', {
        details,
        actionedBy
      });

      return { success: true, jobId: res.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAppointmentDetails(appointmentTypeId: number) {
    const appointmentDetails = await this.prisma.appointmentTypeRef.findFirst({
      where: {
        id: +appointmentTypeId
      }
    });
    return {
      id: appointmentDetails.id,
      type: appointmentDetails.type,
      event_title: appointmentDetails.event_title,
      event_duration: appointmentDetails.event_duration
    };
  }
  // Keeping copy of old function - bookingStatusUpdate
  /*
  async bookingStatusUpdate(
    details: CreateBookingStatusDto,
    actionedBy: number
  ) {
    try {
      const start = moment
        .tz(details.dateSelected, 'asia/colombo')
        .startOf('d')
        .toDate();
      const end = moment
        .tz(details.dateSelected, 'asia/colombo')
        .endOf('d')
        .toDate();

      const [res, bs] = await this.prisma.$transaction(async (tx) => {
        let bs: any = null;
        let res: any = null;
        if (details.bookingScenario === 'Reschedule') {
          //updated the booked slot in to initial state
          bs = await tx.bookingStatus.findFirst({
            where: {
              status: 1,
              date: {
                gt: start.toISOString(),
                lte: end.toISOString()
              },
              time_slot_id: details.slotId
            },
            distinct: ['time_slot_id']
          });
        } else if (details.bookingScenario === 'Booking') {
          bs = await tx.bookingStatus.findFirst({
            where: {
              id: details.id,
              status: 1,
              date: {
                gt: start.toISOString(),
                lte: end.toISOString()
              },
              time_slot_id: details.slotId
            }
          });
        }
        // await Promise.all(bs);
        if (bs) {
          res = await tx.bookingStatus.update({
            where: {
              id: bs.id
            },
            data: {
              updated_at: new Date().toISOString(),
              updated_by: +actionedBy,
              candidate_id: details.candidateId,
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
        } else {
          throw new Error("Slot doesn't exists");
        }

        // await Promise.all(res);

        if (details.bookingScenario === 'Booking') {
          await tx.bookingHistory.create({
            data: {
              created_by: +actionedBy,
              candidate_id: details.candidateId,
              appointment_type_id: bs.appointment_type_ref_id,
              booking_status_id: 3,
              slot_time_id: bs.time_slot_id,
              date: moment(details.date).toDate().toISOString(),
              withdraw_reason: 'BOOKED',
              booking_id: bs.id,
              interviewer_id: bs.interviewer_id
            }
          });
        }

        return [res, bs];
      });

      if (res.bs_all_booking_slot.appointment_type === 1) {
        await this.mail.bookPhoneInterview(
          res.candidate.approved_personal_data?.firstName ?? '',
          res.candidate.approved_contact_data?.workEmail ?? '',
          moment(res.date).format('DD/MM/YYYY'),
          res.bs_all_booking_slot.slot_time,
          'Online'
        );
      } else if (res.bs_all_booking_slot.appointment_type === 2) {
        await this.mail.bookTeachingInterview(
          res.candidate.approved_personal_data?.firstName ?? '',
          res.candidate.approved_contact_data?.workEmail ?? '',
          moment(res.date).format('DD/MM/YYYY'),
          res.bs_all_booking_slot.slot_time,
          'Online'
        );
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
      return { success: false, error: error.message };
    }
  }
  */

  async CoverAndRemoveSlot(
    details: CoverAndRemoveSlotRequestDto,
    actionedBy: number
  ) {
    if (details.status === 13) {
      // convert to REMOVE slot (was AVAILABLE, COVER)
      try {
        const findSlotToBeDeleted = await this.prisma.bookingStatus.findFirst({
          where: {
            id: details.id,
            status: { in: [1, 8] },
            candidate_id: null
          },
          select: {
            id: true,
            BookingHistory: {
              select: { id: true },
              take: 1
            }
          }
        });

        if (
          findSlotToBeDeleted &&
          findSlotToBeDeleted.BookingHistory.length === 0
        ) {
          //delete slots that do not have foreign key records in bs_booking_history
          const deleteBookingStatusDetailsProcessed =
            await this.prisma.bookingStatus.deleteMany({
              where: {
                id: details.id,
                status: { in: [1, 8] },
                candidate_id: null
              }
            });
          if (
            deleteBookingStatusDetailsProcessed &&
            deleteBookingStatusDetailsProcessed.count > 0
          ) {
            return { success: true, message: 'Slot removed successfully' };
          } else {
            return { success: false, error: 'Slot removal failed' };
          }
        } else if (
          findSlotToBeDeleted &&
          findSlotToBeDeleted.BookingHistory.length > 0
        ) {
          //clear the foreign key of slots that do have foreign key records in bs_booking_history
          const clearBookingIdInBookingHistory =
            await this.prisma.bookingHistory.updateMany({
              where: {
                booking_id: details.id
              },
              data: {
                booking_id: null,
                special_note: `deleted booking_id-${
                  details.id
                } by-${actionedBy} on ${moment
                  .utc()
                  .format('YYYY-MM-DD HH:mm:ss')}`.substring(0, 90)
              }
            });

          if (
            clearBookingIdInBookingHistory &&
            clearBookingIdInBookingHistory.count > 0
          ) {
            //now try to delete record from bs_booking_status
            const deleteBookingStatusDetailsProcessed =
              await this.prisma.bookingStatus.deleteMany({
                where: {
                  id: details.id,
                  status: { in: [1, 8] },
                  candidate_id: null
                }
              });
            if (
              deleteBookingStatusDetailsProcessed &&
              deleteBookingStatusDetailsProcessed.count > 0
            ) {
              return { success: true, message: 'Slot deleted successfully' };
            } else {
              return { success: false, error: 'Slot deletion failed' };
            }
          } else {
            return { success: false, error: 'Slot deletion unsuccessful' };
          }
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else if (details.status === 8) {
      // convert to COVER slot (was AVAILABLE)
      try {
        await this.prisma.bookingStatus.updateMany({
          where: {
            id: details.id,
            status: 1,
            candidate_id: null
          },
          data: {
            updated_at: new Date().toISOString(),
            updated_by: +actionedBy,
            date_slot_inter: 'Available to Cover',
            status: 8
          }
        });
        return {
          success: true,
          message: 'Slot converted to cover successfully'
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else if (details.status === 4) {
      // convert to COMPLETED slot
      try {
        await this.prisma.bookingStatus.update({
          where: {
            id: details.id
          },
          data: {
            updated_at: new Date().toISOString(),
            updated_by: +actionedBy,
            date_slot_inter: 'Check In',
            status: 4
          }
        });
        return {
          success: true,
          message: 'Slot marked as completed successfully'
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else if (details.status === 1) {
      // convert to AVAILABLE slot (was COVER)
      try {
        await this.prisma.bookingStatus.updateMany({
          where: {
            id: details.id,
            status: 8,
            candidate_id: null
          },
          data: {
            updated_at: new Date().toISOString(),
            updated_by: +actionedBy,
            date_slot_inter: 'Cover to Available',
            status: 1
          }
        });
        return {
          success: true,
          message: 'Slot converted to avilable successfully'
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  }

  async getBookingStatusDetails(details: FetchAvailableSlotsDto) {
    try {
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

      const avoidBookingInterviewerIdsArray = !details.candidateId
        ? []
        : avoidBookingInterviewerIdsFetch.map((item) => item.interviewer_id);

      const slotTypeList = { 1: 'morning', 2: 'afternoon', 3: 'evening' };
      const bookingStatusArray = [];
      const countByTimeSlotIdArray = [];

      for (const [slotType, slotTypelabel] of Object.entries(slotTypeList)) {
        // fetch open interview slots for morning_afternoon_evening separately
        const bookingStatus = await this.prisma.bookingStatus.findMany({
          where: {
            status: details.bookingStatusId,
            appointment_type_ref_id: details.appointmentTypeId,
            date: {
              equals: new Date(moment(details.date).format('YYYY-MM-DD'))
            },
            bs_all_booking_slot: {
              slot_type: +slotType
            },
            interviewer_id: { not: { in: avoidBookingInterviewerIdsArray } }
          },
          distinct: ['time_slot_id'],
          select: {
            id: true,
            interviewer_id: true,
            appointment_type_ref_id: true,
            bs_all_booking_slot: true
          },
          orderBy: {
            bs_all_booking_slot: { start_time: 'asc' }
          }
        });
        bookingStatusArray[+slotType] = bookingStatus;

        // fetch & calculate capacity for each time_slot (possible open slot count)
        const countByTimeSlotId = await this.prisma.bookingStatus.groupBy({
          by: ['time_slot_id'],
          where: {
            status: details.bookingStatusId,
            appointment_type_ref_id: details.appointmentTypeId,
            date: {
              equals: new Date(moment(details.date).format('YYYY-MM-DD'))
            },
            bs_all_booking_slot: {
              slot_type: +slotType
            },
            interviewer_id: { not: { in: avoidBookingInterviewerIdsArray } }
          },
          _count: {
            time_slot_id: true
          }
        });
        countByTimeSlotIdArray[+slotType] = countByTimeSlotId.reduce(
          (accumulator, status) => {
            const { time_slot_id, _count } = status;
            accumulator[time_slot_id] = _count.time_slot_id;
            return accumulator;
          },
          {}
        );
      }

      const tempResult = {
        success: true,
        data: {}
      };

      // build the return object dynamically where key is morning_afternoon_evening
      Object.entries(slotTypeList).forEach(([slotType, slotTypelabel]) => {
        tempResult.data[slotTypelabel] =
          bookingStatusArray[+slotType].map((item) => {
            const { bs_all_booking_slot, ...rest } = item;
            return {
              ...rest,
              slot_capacity:
                countByTimeSlotIdArray[+slotType] &&
                countByTimeSlotIdArray[+slotType][bs_all_booking_slot.id]
                  ? countByTimeSlotIdArray[+slotType][bs_all_booking_slot.id]
                  : 0,
              slot_time: bs_all_booking_slot.slot_time,
              slot_start_time: bs_all_booking_slot.start_time,
              slotId: bs_all_booking_slot.id,
              slot_type: bs_all_booking_slot.slot_type
            };
          }) || [];
      });

      return tempResult;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBookingStatusDetailsInterviewer(
    details: AvailableSlotsInterviewerDto
  ) {
    try {
      const slotTypeList = { 1: 'morning', 2: 'afternoon', 3: 'evening' };
      const bookingStatusArray = [];

      for (const [slotType, slotTypelabel] of Object.entries(slotTypeList)) {
        // fetch open interview slots for morning_afternoon_evening separately
        const bookingStatus = await this.prisma.bookingStatus.findMany({
          where: {
            status: details.bookingStatusId,
            appointment_type_ref_id: details.appointmentTypeId,
            date: {
              equals: new Date(moment(details.date).format('YYYY-MM-DD'))
            },
            bs_all_booking_slot: {
              slot_type: +slotType
            },
            interviewer_id: details.interviewerId
          },
          select: {
            id: true,
            date: true,
            bs_all_booking_slot: true
          }
        });
        bookingStatusArray[+slotType] = bookingStatus;
      }

      const tempResult = {
        success: true,
        data: {}
      };

      // build the return object dynamically where key is morning_afternoon_evening
      Object.entries(slotTypeList).forEach(([slotType, slotTypelabel]) => {
        tempResult.data[slotTypelabel] =
          bookingStatusArray[+slotType].map((item) => {
            const { bs_all_booking_slot, ...rest } = item;
            return {
              ...rest,
              slot_time: bs_all_booking_slot.slot_time,
              slotId: bs_all_booking_slot.id,
              slot_type: bs_all_booking_slot.slot_type
            };
          }) || [];
      });

      return tempResult;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async candidateUpdateWithdrawBooking(
    details: CandidateUpdateWithdrawBookingDto,
    actionedBy: number
  ) {
    try {
      const response = await this.prisma.bookingStatus.findUnique({
        where: {
          id: +details.id
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

      if (!response) {
        return {
          success: true,
          message: 'Slot not found'
        };
      } else if (response.status == 4 || response.candidate_id == null) {
        return {
          success: true,
          message: 'Slot provided is invalid.'
        };
      } else {
        const withdrawSuccess = await this.prisma.bookingStatus.update({
          where: {
            id: +details.id
          },
          data: {
            updated_at: new Date().toISOString(),
            updated_by: +actionedBy,
            candidate_id: null,
            date_slot_inter: 'Withdraw xyz',
            status: +details.status
          }
        });

        if (withdrawSuccess) {
          await this.prisma.bookingHistory.create({
            data: {
              created_by: +actionedBy,
              created_at: new Date().toISOString(),
              booking_status_id: 7, // booking_status_ref_id - WITHDRAW
              candidate_id: +response.candidate_id,
              appointment_type_id: +response.appointment_type_ref_id,
              slot_time_id: +response.time_slot_id,
              withdraw_reason: details.withdrawReason ?? 'WITHDRAW',
              date: response.date,
              booking_id: +response.id,
              interviewer_id: +response.interviewer_id
            }
          });

          if (response.appointment_type_ref_id === 5) {
            //email for esa appointment withdrawal success
            await this.mail.sendEsaApssAppointmentWithdrawConfirmation(
              response.candidate.approved_contact_data?.workEmail ?? '',
              response.candidate.approved_personal_data?.firstName ?? ''
            );
          } else if (response.appointment_type_ref_id === 6) {
            //email for fta appointment withdrawal success
            await this.mail.sendFtaL1AndL2ApssAppointmentWithdrawConfirmation(
              response.candidate.approved_contact_data?.workEmail ?? '',
              response.candidate.approved_personal_data?.firstName ?? '',
              1
            );
          } else if (response.appointment_type_ref_id === 7) {
            //email for fta appointment withdrawal success
            await this.mail.sendFtaL1AndL2ApssAppointmentWithdrawConfirmation(
              response.candidate.approved_contact_data?.workEmail ?? '',
              response.candidate.approved_personal_data?.firstName ?? '',
              2
            );
          }
        } else {
          return {
            success: true,
            message: 'Withdraw action failed'
          };
        }

        return {
          success: true,
          message: 'Succesfully Updated'
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async dailyInterviewerCalendarFetchDetails(
    details: DailyInterviewerCalendarFetchRequestDto
  ) {
    try {
      const bookingStatusHistory = await this.prisma.user.findUnique({
        where: {
          tsp_id: details.interviewerId
        },
        select: {
          BookingStatus: {
            where: {
              date: {
                equals: new Date(moment(details.date).format('YYYY-MM-DD'))
              }
            },
            orderBy: [
              {
                bs_all_booking_slot: {
                  slot_time: 'asc'
                }
              }
            ],
            select: {
              id: true,
              appointment_type_ref_id: true,
              bs_booking_status_ref: {
                select: {
                  status: true
                }
              },
              interviewer: {
                select: {
                  username: true
                }
              },
              appointment_type_ref: {
                select: {
                  event_title: true,
                  type: true,
                  id: true
                }
              },
              bs_all_booking_slot: {
                select: {
                  slot_time: true
                }
              },
              BookingHistory: {
                select: {
                  bs_booking_status_ref: {
                    select: {
                      status: true
                    }
                  }
                },
                orderBy: { id: 'desc' },
                take: 1
              },
              candidate: {
                select: {
                  tsp_id: true,
                  username: true,
                  approved_personal_data: {
                    select: {
                      shortName: true
                    }
                  },
                  approved_contact_data: {
                    select: {
                      mobileNumber: true,
                      residingCountry: true,
                      workEmail: true
                    }
                  },
                  candidateBookingHistory: {
                    select: {
                      id: true,
                      appointment_type_id: true,
                      bs_appointment_type_ref: {
                        select: {
                          event_title: true,
                          type: true
                        }
                      },
                      date: true,
                      bs_booking_status_ref: {
                        select: {
                          status: true
                        }
                      },
                      bs_all_booking_slot: {
                        select: {
                          slot_time: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const slots = {
        '08:00 AM': 0,
        '08:05 AM': 0,
        '08:10 AM': 0,
        '08:15 AM': 0,
        '08:20 AM': 0,
        '08:25 AM': 0,
        '08:30 AM': 0,
        '08:35 AM': 0,
        '08:40 AM': 0,
        '08:45 AM': 0,
        '08:50 AM': 0,
        '08:55 AM': 0,
        '09:00 AM': 1,
        '09:05 AM': 1,
        '09:10 AM': 1,
        '09:15 AM': 1,
        '09:20 AM': 1,
        '09:25 AM': 1,
        '09:30 AM': 1,
        '09:35 AM': 1,
        '09:40 AM': 1,
        '09:45 AM': 1,
        '09:50 AM': 1,
        '09:55 AM': 1,
        '10:00 AM': 2,
        '10:05 AM': 2,
        '10:10 AM': 2,
        '10:15 AM': 2,
        '10:20 AM': 2,
        '10:25 AM': 2,
        '10:30 AM': 2,
        '10:35 AM': 2,
        '10:40 AM': 2,
        '10:45 AM': 2,
        '10:50 AM': 2,
        '10:55 AM': 2,
        '11:00 AM': 3,
        '11:05 AM': 3,
        '11:10 AM': 3,
        '11:15 AM': 3,
        '11:20 AM': 3,
        '11:25 AM': 3,
        '11:30 AM': 3,
        '11:35 AM': 3,
        '11:40 AM': 3,
        '11:45 AM': 3,
        '11:50 AM': 3,
        '11:55 AM': 3,
        '12:00 PM': 4,
        '12:05 PM': 4,
        '12:10 PM': 4,
        '12:15 PM': 4,
        '12:20 PM': 4,
        '12:25 PM': 4,
        '12:30 PM': 4,
        '12:35 PM': 4,
        '12:40 PM': 4,
        '12:45 PM': 4,
        '12:50 PM': 4,
        '12:55 PM': 4,
        '01:00 PM': 5,
        '01:05 PM': 5,
        '01:10 PM': 5,
        '01:15 PM': 5,
        '01:20 PM': 5,
        '01:25 PM': 5,
        '01:30 PM': 5,
        '01:35 PM': 5,
        '01:40 PM': 5,
        '01:45 PM': 5,
        '01:50 PM': 5,
        '01:55 PM': 5,
        '02:00 PM': 6,
        '02:05 PM': 6,
        '02:10 PM': 6,
        '02:15 PM': 6,
        '02:20 PM': 6,
        '02:25 PM': 6,
        '02:30 PM': 6,
        '02:35 PM': 6,
        '02:40 PM': 6,
        '02:45 PM': 6,
        '02:50 PM': 6,
        '02:55 PM': 6,
        '03:00 PM': 7,
        '03:10 PM': 7,
        '03:15 PM': 7,
        '03:20 PM': 7,
        '03:25 PM': 7,
        '03:30 PM': 7,
        '03:35 PM': 7,
        '03:40 PM': 7,
        '03:45 PM': 7,
        '03:50 PM': 7,
        '03:55 PM': 7,
        '04:00 PM': 8,
        '04:10 PM': 8,
        '04:15 PM': 8,
        '04:20 PM': 8,
        '04:25 PM': 8,
        '04:30 PM': 8,
        '04:35 PM': 8,
        '04:40 PM': 8,
        '04:45 PM': 8,
        '04:50 PM': 8,
        '04:55 PM': 8,
        '05:00 PM': 9,
        '05:10 PM': 9,
        '05:15 PM': 9,
        '05:20 PM': 9,
        '05:25 PM': 9,
        '05:30 PM': 9,
        '05:35 PM': 9,
        '05:40 PM': 9,
        '05:45 PM': 9,
        '05:50 PM': 9,
        '05:55 PM': 9,
        '06:00 PM': 10,
        '06:10 PM': 10,
        '06:15 PM': 10,
        '06:20 PM': 10,
        '06:25 PM': 10,
        '06:30 PM': 10,
        '06:35 PM': 10,
        '06:40 PM': 10,
        '06:45 PM': 10,
        '06:50 PM': 10,
        '06:55 PM': 10,
        '07:00 PM': 11,
        '07:10 PM': 11,
        '07:15 PM': 11,
        '07:20 PM': 11,
        '07:25 PM': 11,
        '07:30 PM': 11,
        '07:35 PM': 11,
        '07:40 PM': 11,
        '07:45 PM': 11,
        '07:50 PM': 11,
        '07:55 PM': 11,
        '08:00 PM': 12,
        '08:10 PM': 12,
        '08:15 PM': 12,
        '08:20 PM': 12,
        '08:25 PM': 12,
        '08:30 PM': 12,
        '08:35 PM': 12,
        '08:40 PM': 12,
        '08:45 PM': 12,
        '08:50 PM': 12,
        '08:55 PM': 12,
        '09:00 PM': 13,
        '09:10 PM': 13,
        '09:15 PM': 13,
        '09:20 PM': 13,
        '09:25 PM': 13,
        '09:30 PM': 13,
        '09:35 PM': 13,
        '09:40 PM': 13,
        '09:45 PM': 13,
        '09:50 PM': 13,
        '09:55 PM': 13,
        '10:00 PM': 14,
        '10:10 PM': 14,
        '10:15 PM': 14,
        '10:20 PM': 14,
        '10:25 PM': 14,
        '10:30 PM': 14,
        '10:35 PM': 14,
        '10:40 PM': 14,
        '10:45 PM': 14,
        '10:50 PM': 14,
        '10:55 PM': 14
      };

      const reverseSlot = {
        0: '08:00 AM',
        1: '09:00 AM',
        2: '10:00 AM',
        3: '11:00 AM',
        4: '12:00 PM',
        5: '01:00 PM',
        6: '02:00 PM',
        7: '03:00 PM',
        8: '04:00 PM',
        9: '05:00 PM',
        10: '06:00 PM',
        11: '07:00 PM',
        12: '08:00 PM',
        13: '09:00 PM',
        14: '10:00 PM'
      };

      const reducedBookingHistory = bookingStatusHistory.BookingStatus.reduce(
        (prev, curr) => {
          const slotStartTime =
            curr.bs_all_booking_slot.slot_time.split(' - ')[0];
          const slotEndTime = curr.bs_all_booking_slot.slot_time
            .split(' - ')[1]
            .split(' ')[0];
          const slotSession = curr.bs_all_booking_slot.slot_time
            .split(' - ')[1]
            .split(' ')[1];

          const start1 = +slotStartTime.split(':')[0];
          const start = +slotStartTime.split(':')[1];
          const end = +slotEndTime.split(':')[1];
          const duration = end - start <= 0 ? 60 + end - start : end - start;
          const slot = slots[`${slotStartTime} ${slotSession}`];

          if (prev[slot]) {
            prev[slot] = [
              ...prev[slot],
              {
                ...curr,
                start,
                end,
                duration,
                slotEndTime,
                slotStartTime,
                start1,
                slotSession
              }
            ];
          } else {
            prev[slot] = [
              {
                ...curr,
                start,
                end,
                duration,
                slotStartTime,
                slotEndTime,
                start1,
                slotSession
              }
            ];
          }
          return prev;
        },
        {} as any
      );
      const mapped = Object.entries(reducedBookingHistory).map(
        ([key, value]: any) => {
          const meetings = value.map((v) => {
            return {
              // ...v,
              slotSession: v['slotSession'],
              slotStartTime: v['slotStartTime'],
              slotEndTime: v['slotEndTime'],
              start1: v['start1'],
              start: v['start'],
              end: v['end'],
              duration: v['duration'],
              booking_status_id: v['id'],
              event_title: v['appointment_type_ref']['event_title'],
              eventId: v['appointment_type_ref']['id'],
              appointment_type_id: v['appointment_type_ref_id'],
              candiTspId: v['candidate'] ? v['candidate']['tsp_id'] : '',
              candiEmail:
                v['candidate'] && v['candidate']['approved_contact_data']
                  ? v['candidate']['approved_contact_data']['workEmail']
                  : '',
              candiMobile:
                v['candidate'] && v['candidate']['approved_contact_data']
                  ? v['candidate']['approved_contact_data']['mobileNumber']
                  : '',
              candiCountry:
                v['candidate'] && v['candidate']['approved_contact_data']
                  ? v['candidate']['approved_contact_data']['residingCountry']
                  : '',
              name:
                v['candidate'] && v['candidate']['approved_personal_data']
                  ? v['candidate']['approved_personal_data']['shortName']
                  : '',
              slot: v['bs_all_booking_slot']['slot_time'],
              status: v['bs_booking_status_ref']['status'],
              statusHistoryText:
                v['BookingHistory'] && v['BookingHistory'][0]
                  ? v['BookingHistory'][0]['bs_booking_status_ref']['status']
                  : '',
              history: v['candidate']
                ? v.candidate['candidateBookingHistory'].map((h) => {
                    return {
                      // ...h,
                      booking_history_id: h['id'],
                      type: h['bs_appointment_type_ref']['type'],
                      event_title: h['bs_appointment_type_ref']['event_title'],
                      appointment_type_id: h['appointment_type_id'],
                      date: moment(h['date']).format('YYYY-MM-DD'),
                      slot: h['bs_all_booking_slot']
                        ? h['bs_all_booking_slot']['slot_time']
                        : '',
                      status: h['bs_booking_status_ref']['status']
                    };
                  })
                : []
            };
          });

          const updatedMeetings = [];
          let meetingss, time;

          for (let i = 0; i <= meetings.length - 1; i++) {
            meetingss = '';
            time = '';
            const curr = meetings[i];

            const curr2 = meetings[i + 1] ?? '';
            const k = meetings.length;
            const k1 = meetings.length - 1;
            const k3 = k - k1;
            if (i == 0) {
              if (curr.start != '0') {
                //updatedMeetings.push(curr);
                // updatedMeetings.push({
                //   booking_status_id: 0,
                //   type: 'AB',
                //   name: '',
                //   slot: `${curr.start1}:00 - ${curr.slotStartTime} ${curr.slotSession}`,
                //   duration: curr.duration,
                //   status: 'NOT_BOOKED',
                //   history: []
                // });
              }
            }

            if (curr.end != '' && curr2.start != '') {
              if (curr.end != curr2.start) {
                if (curr2.start != null) {
                  updatedMeetings.push(curr);
                  // updatedMeetings.push({
                  //   booking_status_id: 0,
                  //   type: 'AB',
                  //   name: '',
                  //   slot: `${curr.start1}:${curr.end} - ${curr.start1}:${curr2.start} ${curr.slotSession}`,
                  //   duration: curr.duration,
                  //   status: 'NOT_BOOKED',
                  //   history: []
                  // });
                } else {
                  if (time != '12:00 PM') {
                    const int = parseInt(curr.start1) + 1;
                    updatedMeetings.push(curr);
                    // updatedMeetings.push({
                    //   booking_status_id: 0,
                    //   type: 'AB',
                    //   name: '',
                    //   slot: `${curr.start1}:${curr.end} - ${int}:00 ${curr.slotSession}`,
                    //   duration: curr.duration,
                    //   status: 'NOT_BOOKED',
                    //   history: []
                    // });
                  } else {
                    updatedMeetings.push(curr);
                    // updatedMeetings.push({
                    //   booking_status_id: 0,
                    //   type: 'AB',
                    //   name: '',
                    //   slot: `${curr.start1}:${curr.end} - 01:00 ${curr.slotSession}`,
                    //   duration: curr.duration,
                    //   status: 'NOT_BOOKED',
                    //   history: []
                    // });
                  }
                }
              } else {
                updatedMeetings.push(curr);
              }
            } else {
              updatedMeetings.push(curr);
            }
          }

          return {
            time: reverseSlot[key],

            meetings: updatedMeetings
          };
        }
      );
      const finalMeetings = [];
      Object.values(reverseSlot).forEach((time) => {
        const slot = mapped.find((item) => item.time === time);
        if (slot) {
          finalMeetings.push(slot);
        } else {
          if (time == '11:00 AM') {
            const slotStartTime = time.split(':')[0];

            const int = parseInt(slotStartTime) + 1;

            finalMeetings.push({
              time,
              meetings: [
                // {
                //   booking_status_id: 0,
                //   type: 'AB',
                //   name: '',
                //   slot: `${slotStartTime}.00 - 12.00 PM`,
                //   duration: 60,
                //   status: 'NOT_BOOKED',
                //   history: []
                // }
              ]
            });
          } else if (time != '12:00 PM') {
            const slotStartTime = time.split(':')[0];
            const slotSession = time.split(':')[1];

            const int = parseInt(slotStartTime) + 1;

            finalMeetings.push({
              time,
              meetings: [
                // {
                //   booking_status_id: 0,
                //   type: 'AB',
                //   name: '',
                //   slot: `${slotStartTime}.00 - ${int}.${slotSession}`,
                //   duration: 60,
                //   status: 'NOT_BOOKED',
                //   history: []
                // }
              ]
            });
          } else if (time == '12:00 PM') {
            const slotStartTime = time.split(':')[0];
            finalMeetings.push({
              time,

              meetings: [
                // {
                //   booking_status_id: 0,
                //   type: 'AB',
                //   name: '',
                //   slot: `${slotStartTime}.00 - 01.00 PM`,
                //   duration: 60,
                //   status: 'NOT_BOOKED',
                //   history: []
                // }
              ]
            });
          }
        }
      });

      return {
        success: true,
        data: finalMeetings
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  async apssAdminMasterTableFetch(details: AdminMasterTableRequestDto) {
    const isWhere =
      details.appointmentType !== '' ||
      details.filterBookingId !== '' ||
      details.status !== 0 ||
      details.date !== '' ||
      details.interviewerId != 0 ||
      details.candidateId != 0;
    const defaultFilter = {};

    const filterWhereClause = {
      ...(details.appointmentType !== ''
        ? {
            appointment_type_ref_id: +details.appointmentType
          }
        : {}),
      ...(details.filterBookingId !== ''
        ? {
            id: +details.filterBookingId
          }
        : {}),
      ...(details.status !== 0
        ? {
            status: +details.status
          }
        : {}),
      ...(details.interviewerId !== 0
        ? { interviewer_id: +details.interviewerId }
        : {}),
      ...(details.candidateId !== 0
        ? { candidate_id: +details.candidateId }
        : {}),
      ...(details.date !== ''
        ? {
            date: {
              equals: new Date(moment(details.date).format('YYYY-MM-DD'))
            }
          }
        : {})
    };

    try {
      const adminbookingstatus = await this.prisma.bookingStatus.findMany({
        where: isWhere
          ? { ...defaultFilter, ...filterWhereClause }
          : defaultFilter,
        select: {
          id: true,
          date: true,
          status: true,
          bs_booking_status_ref: {
            select: { status: true }
          },
          appointment_type_ref: {
            select: {
              event_title: true,
              type: true,
              id: true
            }
          },
          interviewer: {
            select: {
              tsp_id: true,
              username: true,
              NTProfile: {
                select: { short_name: true }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          bs_all_booking_slot: {
            select: {
              id: true,
              duration: true,
              slot_time: true
            }
          },
          BookingHistory: {
            select: {
              bs_booking_status_ref: {
                select: {
                  status: true
                }
              },
              id: true,
              booking_status_id: true
            },
            orderBy: { id: 'desc' },
            take: 1
          },
          candidate: {
            select: {
              tsp_id: true,
              CandidateLevel: {
                select: {
                  level: true
                }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              },
              candidateBookingHistory: {
                select: {
                  id: true,
                  bs_appointment_type_ref: {
                    select: {
                      type: true,
                      event_title: true
                    }
                  },
                  date: true,
                  bs_booking_status_ref: {
                    select: {
                      status: true
                    }
                  },
                  bs_all_booking_slot: {
                    select: {
                      slot_time: true
                    }
                  },
                  booking_id: true
                }
              }
            }
          }
        },
        orderBy: [
          { date: 'desc' },
          { bs_all_booking_slot: { start_time: 'desc' } },
          { time_slot_id: 'desc' },
          { id: 'desc' }
        ],
        skip: details.page * details.pageSize,
        take: details.pageSize
      });

      const adminbookingstatusCount = await this.prisma.bookingStatus.count({
        where: isWhere
          ? { ...defaultFilter, ...filterWhereClause }
          : defaultFilter
      });

      const mapped = adminbookingstatus.map((stat) => {
        const temp_interviewer_name =
          stat.interviewer.approved_personal_data &&
          stat.interviewer.approved_personal_data?.shortName &&
          stat.interviewer.approved_personal_data?.shortName != ''
            ? stat.interviewer.approved_personal_data?.shortName
            : stat.interviewer.NTProfile &&
              stat.interviewer.NTProfile.short_name &&
              stat.interviewer.NTProfile.short_name != ''
            ? stat.interviewer.NTProfile.short_name
            : stat.interviewer.username;

        return {
          id: stat.id,
          candidateId: stat.candidate ? stat.candidate.tsp_id : null,
          candidateName:
            stat.candidate?.approved_personal_data?.shortName ?? '',
          candidateLevel: stat.candidate?.CandidateLevel?.level,
          status: stat.status,
          statusText: stat.bs_booking_status_ref?.status ?? '',
          statusHistoryText:
            stat.BookingHistory &&
            stat.BookingHistory[0]?.bs_booking_status_ref?.status
              ? stat.BookingHistory[0]?.bs_booking_status_ref?.status
              : '',
          appointmentType: stat.appointment_type_ref
            ? stat.appointment_type_ref.type
            : null,
          appointmentTypeId: stat.appointment_type_ref.id,
          appointmentTypeText: stat.appointment_type_ref?.event_title ?? null,
          date: moment(stat.date).format('YYYY-MM-DD'),
          time: stat.bs_all_booking_slot
            ? stat.bs_all_booking_slot.slot_time
            : null,
          duration: stat.bs_all_booking_slot
            ? stat.bs_all_booking_slot.duration
            : null,
          slotTimeID: stat.bs_all_booking_slot
            ? stat.bs_all_booking_slot.id
            : null,

          interviewerID: stat.interviewer ? stat.interviewer.tsp_id : null,
          interviewerName: temp_interviewer_name,
          history: stat.candidate?.candidateBookingHistory.map((stat2) => {
            return {
              booking_history_id: stat2.id,
              type: stat2.bs_appointment_type_ref
                ? stat2.bs_appointment_type_ref.type
                : null,
              event_title: stat2.bs_appointment_type_ref
                ? stat2.bs_appointment_type_ref.event_title
                : null,
              date: moment(stat2.date).format('YYYY-MM-DD'),
              slot: stat2.bs_all_booking_slot
                ? stat2.bs_all_booking_slot.slot_time
                : null,
              status: stat2.bs_booking_status_ref
                ? stat2.bs_booking_status_ref.status
                : null
            };
          })
        };
      });

      return { success: true, data: mapped, count: adminbookingstatusCount };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async bulkSwapAndRescheduleInterviewers(
    details: BulkSwapAndRescheduleRequestDto,
    actionedBy: number
  ) {
    try {
      let completedSwapCount = 0;
      if (!details.bookings || details.bookings.length === 0) {
        throw new Error('No appointments recieved to swap');
      }

      const filteredBookingData = details.bookings.reduce((acc, current) => {
        // filter occurences where oldBookingStatusId has repeated in recieved data array
        const existingIndex = acc.findIndex(
          (item) => item.oldBookingStatusId === current.oldBookingStatusId
        );
        if (existingIndex !== -1) {
          // Replace the existing item with the current one
          acc[existingIndex] = current;
        } else {
          // Add the current item if no existing item with the same oldBookingStatusId is found
          acc.push(current);
        }
        return acc;
      }, []);

      await Promise.all(
        filteredBookingData.map(async (booking) => {
          // process via transaction to avoid swap mishaps
          await this.prisma.$transaction(async (tx) => {
            const oldSlot = await tx.bookingStatus.findFirst({
              where: {
                id: +booking.oldBookingStatusId,
                candidate_id: +booking.candidateId
              },
              select: { id: true, appointment_type_ref_id: true }
            });
            const newSlot = await tx.bookingStatus.findFirst({
              where: {
                id: +booking.newBookingStatusId,
                appointment_type_ref_id:
                  oldSlot && oldSlot.appointment_type_ref_id
                    ? oldSlot.appointment_type_ref_id
                    : 0,
                candidate_id: null
              },
              select: { id: true }
            });

            if (!oldSlot || !newSlot) {
              console.log(
                `skip bulk-swap of slot id: ${booking.oldBookingStatusId}`
              );
              // throw new Error("Error occurred while swapping slot id: " + booking.oldBookingStatusId);
            } else {
              // convert old slot to cover
              const oldSlotProcessed = await tx.bookingStatus.updateMany({
                where: {
                  id: +booking.oldBookingStatusId,
                  appointment_type_ref_id: +oldSlot.appointment_type_ref_id,
                  candidate_id: +booking.candidateId
                },
                data: {
                  updated_at: new Date().toISOString(),
                  updated_by: +actionedBy,
                  candidate_id: null,
                  date_slot_inter: 'Bulk Swap Cover',
                  status: 8
                }
              });
              // and mark new slot as booked
              const newSlotProcessed = await tx.bookingStatus.updateMany({
                where: {
                  id: +booking.newBookingStatusId,
                  appointment_type_ref_id: +oldSlot.appointment_type_ref_id
                },
                data: {
                  updated_at: new Date().toISOString(),
                  updated_by: +actionedBy,
                  candidate_id: +booking.candidateId,
                  date_slot_inter: 'Bulk Swap Booked',
                  status: 3
                }
              });

              if (oldSlotProcessed && newSlotProcessed) {
                completedSwapCount++;
              }
            }
          });
        })
      );

      if (completedSwapCount === 0) {
        throw new Error('No appointments got swapped');
      } else if (completedSwapCount < filteredBookingData.length) {
        throw new Error('Some appointments did not get swapped');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async apssFetchSlotsForSwap(details: FetchSlotsForSwapRequestDto) {
    try {
      const swapInterviewer = await this.prisma.bookingStatus.findMany({
        where: {
          time_slot_id: details.timeSlotId,
          appointment_type_ref_id: details.appointmentTypeId,
          status: { in: [1, 8] }, // return available or cover slots
          date: {
            equals: new Date(moment(details.date).format('YYYY-MM-DD'))
          }
        },
        select: {
          id: true,
          interviewer: {
            include: {
              NTProfile: true,
              approved_personal_data: true
            }
          },
          status: true,
          interviewer_id: true
        }
      });

      const uniqueArray = Array.from(
        new Set(
          swapInterviewer.map((interviewer) => interviewer.interviewer_id)
        )
      );

      const leaveApplications =
        await this.prisma.nTHRISLeaveApplications.findMany({
          where: {
            tspId: {
              in: uniqueArray
            },
            status: 2,
            fromDate: { lte: moment(details.date).toISOString() },
            toDate: { gte: moment(details.date).toISOString() }
          },
          select: {
            tspId: true
          }
        });

      const leaveIds = leaveApplications.map(
        (application) => application.tspId
      );

      return {
        success: true,

        data: swapInterviewer.map((item2) => {
          const { interviewer, ...rest } = item2;
          const temp_interviewer_name =
            interviewer.approved_personal_data &&
            interviewer.approved_personal_data?.shortName &&
            interviewer.approved_personal_data?.shortName != ''
              ? interviewer.approved_personal_data?.shortName
              : interviewer.NTProfile &&
                interviewer.NTProfile.short_name &&
                interviewer.NTProfile.short_name != ''
              ? interviewer.NTProfile.short_name
              : interviewer.username;

          const isOnLeave = leaveIds.includes(item2.interviewer_id) ? 1 : 0;

          return {
            ...rest,
            name: temp_interviewer_name,
            isOnLeave
          };
        })
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getDataReschedule(details: BulkReschedulingTableFetchRequestDto) {
    const isWhere =
      details.candidateId != 0 ||
      details.interviewerId != 0 ||
      details.appointment != '';

    const defaultFilter = {
      status:
        details.status2 && !isNaN(+details.status2) ? +details.status2 : 0,
      date: {
        equals: new Date(moment(details.date).format('YYYY-MM-DD'))
      }
    };

    const filterWhereClause = {
      status:
        details.status2 && !isNaN(+details.status2) ? +details.status2 : 0,
      date: {
        equals: new Date(moment(details.date).format('YYYY-MM-DD'))
      },
      ...(details.candidateId != 0
        ? {
            candidate: {
              tsp_id: +details.candidateId
            }
          }
        : {}),
      ...(details.interviewerId != 0
        ? {
            interviewer: {
              tsp_id: +details.interviewerId
            }
          }
        : {}),
      ...(details.appointment != ''
        ? { appointment_type_ref_id: +details.appointment }
        : {})
    };

    try {
      const dataReschedule = await this.prisma.bookingStatus.findMany({
        where: isWhere
          ? { ...defaultFilter, ...filterWhereClause }
          : defaultFilter,
        select: {
          id: true,
          bs_all_booking_slot: true,
          interviewer: {
            include: {
              NTProfile: {
                select: { short_name: true }
              },
              approved_personal_data: true
            }
          },
          candidate: {
            include: {
              approved_personal_data: true
            }
          },
          date: true,
          appointment_type_ref_id: true,
          appointment_type_ref: true
        },
        orderBy: [
          { date: 'desc' },
          { bs_all_booking_slot: { start_time: 'desc' } },
          { time_slot_id: 'desc' },
          { id: 'desc' }
        ]
      });

      const newArr = [];

      for (let index = 0; index < dataReschedule.length; index++) {
        const item = dataReschedule[index];

        const {
          id,
          candidate,
          appointment_type_ref_id,
          appointment_type_ref,
          interviewer,
          bs_all_booking_slot,
          date,
          ...rest
        } = item;

        //Fetch available slots
        const availableSlots = await this.prisma.bookingStatus.findMany({
          where: {
            interviewer: {
              tsp_id: interviewer.tsp_id
            },
            status: 1,
            appointment_type_ref_id: appointment_type_ref.id,
            date: {
              equals: new Date(moment(date).format('YYYY-MM-DD'))
            }
          },
          select: {
            id: true,
            time_slot_id: true,
            bs_all_booking_slot: {
              select: { slot_time: true }
            }
          }
        });

        const temp_interviewer_name =
          interviewer.approved_personal_data &&
          interviewer.approved_personal_data?.shortName &&
          interviewer.approved_personal_data?.shortName != ''
            ? interviewer.approved_personal_data?.shortName
            : interviewer.NTProfile &&
              interviewer.NTProfile.short_name &&
              interviewer.NTProfile.short_name != ''
            ? interviewer.NTProfile.short_name
            : interviewer.username;

        newArr.push({
          ...rest,
          id: id,
          slot_id: bs_all_booking_slot.id,
          slot_time: bs_all_booking_slot.slot_time,
          interviewer_id: interviewer.tsp_id,
          date: moment(date).format('YYYY-MM-DD'),
          interviewer_name: temp_interviewer_name,
          candidate_id: candidate.tsp_id,
          candidate_name: candidate.approved_personal_data?.shortName ?? '',
          appointment_type_id: appointment_type_ref_id,
          appointment_type: appointment_type_ref.type,
          time_slot_list: [
            {
              id: id,
              slot_id: bs_all_booking_slot.id,
              slot_time: bs_all_booking_slot.slot_time
            },
            ...availableSlots.map((slot) => {
              return {
                id: slot.id,
                slot_id: slot.time_slot_id,
                slot_time: slot.bs_all_booking_slot.slot_time
              };
            })
          ]
        });
      }

      return {
        success: true,
        data: newArr
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getInterviewerCandidateSwapInterview(details: CreateBookingStatusDto) {
    const isWhere =
      details.candidateId != 0 ||
      details.interviewerId != 0 ||
      details.appointment != '';

    const defaultFilter = {
      status:
        details.status2 && !isNaN(+details.status2) ? +details.status2 : 0,
      date: {
        equals: new Date(moment(details.date).format('YYYY-MM-DD'))
      }
    };

    const filterWhereClause = {
      status:
        details.status2 && !isNaN(+details.status2) ? +details.status2 : 0,
      date: {
        equals: new Date(moment(details.date).format('YYYY-MM-DD'))
      },
      ...(details.candidateId != 0
        ? {
            candidate: {
              tsp_id: +details.candidateId
            }
          }
        : {}),
      ...(details.interviewerId != 0
        ? {
            interviewer: {
              tsp_id: +details.interviewerId
            }
          }
        : {}),
      ...(details.appointment != ''
        ? { appointment_type_ref_id: +details.appointment }
        : {})
    };

    try {
      const interviewerCandidateSwapInterview =
        await this.prisma.bookingStatus.findMany({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter,
          select: {
            id: true,
            bs_all_booking_slot: true,
            candidate: {
              select: { tsp_id: true, approved_personal_data: true }
            },
            interviewer: {
              select: {
                tsp_id: true,
                username: true,
                NTProfile: {
                  select: { short_name: true }
                },
                approved_personal_data: true
              }
            },
            interviewer_id: true,
            date: true,
            appointment_type_ref: true,
            appointment_type_ref_id: true,
            time_slot_id: true
          },
          orderBy: [
            { date: 'desc' },
            { bs_all_booking_slot: { start_time: 'desc' } },
            { time_slot_id: 'desc' },
            { id: 'desc' }
          ]
        });

      const tids = [];
      let tid;
      const iCSI = interviewerCandidateSwapInterview.map((item) => {
        const {
          id,
          candidate,
          interviewer,
          appointment_type_ref,
          appointment_type_ref_id,
          bs_all_booking_slot,
          time_slot_id,
          ...rest
        } = item;
        tids.push(bs_all_booking_slot.id);
        tid = time_slot_id;

        const temp_interviewer_name =
          interviewer.approved_personal_data &&
          interviewer.approved_personal_data?.shortName &&
          interviewer.approved_personal_data?.shortName != ''
            ? interviewer.approved_personal_data?.shortName
            : interviewer.NTProfile &&
              interviewer.NTProfile.short_name &&
              interviewer.NTProfile.short_name != ''
            ? interviewer.NTProfile.short_name
            : interviewer.username;

        return {
          id,
          ...rest,
          time_slot_id: bs_all_booking_slot.id,
          time_slot: bs_all_booking_slot.slot_time,
          candidate_id: candidate.tsp_id,
          candidate_name: candidate.approved_personal_data?.shortName ?? '',
          interviewer_name: temp_interviewer_name,
          appointment_type: appointment_type_ref.type,
          appointment_type_id: appointment_type_ref_id,
          interviewer_names: {
            id: id,
            interviewer_id: interviewer.tsp_id,
            interviewer_name: temp_interviewer_name
          }
        };
      });

      const arr2 = [];
      let some;
      for (let i = 0; i <= iCSI.length - 1; i++) {
        const interviewer = await this.prisma.bookingStatus.findMany({
          where: {
            id: iCSI[i].id
          },
          select: {
            id: true,
            status: true,
            interviewer: {
              select: {
                tsp_id: true,
                username: true,
                NTProfile: {
                  select: { short_name: true }
                },
                approved_personal_data: true
              }
            }
          }
        });
        const interviewer_names = interviewer.map((item) => {
          const { interviewer, ...rest } = item;
          const temp_interviewer_name =
            interviewer.approved_personal_data &&
            interviewer.approved_personal_data?.shortName &&
            interviewer.approved_personal_data?.shortName != ''
              ? interviewer.approved_personal_data?.shortName
              : interviewer.NTProfile &&
                interviewer.NTProfile.short_name &&
                interviewer.NTProfile.short_name != ''
              ? interviewer.NTProfile.short_name
              : interviewer.username;

          return {
            ...rest,
            interviewer_id: interviewer.tsp_id,
            interviewer_name: temp_interviewer_name
          };
        });
        const cover_interviewer = await this.prisma.bookingStatus.findMany({
          where: {
            status: {
              in: [1, 8]
            },
            date: {
              equals: new Date(moment(details.date).format('YYYY-MM-DD'))
            },
            time_slot_id: iCSI[i].time_slot_id
          },
          select: {
            id: true,
            status: true,
            interviewer: {
              select: {
                tsp_id: true,
                username: true,
                NTProfile: {
                  select: { short_name: true }
                },
                approved_personal_data: true
              }
            }
          }
        });
        const cover_interviewer_names = cover_interviewer.map((item) => {
          const { interviewer, ...rest } = item;
          const temp_interviewer_name =
            interviewer.approved_personal_data &&
            interviewer.approved_personal_data?.shortName &&
            interviewer.approved_personal_data?.shortName != ''
              ? interviewer.approved_personal_data?.shortName
              : interviewer.NTProfile &&
                interviewer.NTProfile.short_name &&
                interviewer.NTProfile.short_name != ''
              ? interviewer.NTProfile.short_name
              : interviewer.username;

          return {
            ...rest,
            interviewer_id: interviewer.tsp_id,
            interviewer_name: temp_interviewer_name
          };
        });

        for (let i = 0; i <= cover_interviewer_names.length - 1; i++) {
          interviewer_names.push(cover_interviewer_names[i]);
        }
        const arr = [];
        arr.push(iCSI[i].interviewer_names, cover_interviewer_names);
        some = {
          id: iCSI[i].id,
          date: iCSI[i].date,
          time_slot_id: iCSI[i].time_slot_id,
          time_slot: iCSI[i].time_slot,
          interviewer_id: iCSI[i].interviewer_id,
          interviewer_name: iCSI[i].interviewer_name,
          candidate_id: iCSI[i].candidate_id,
          candidate_name: iCSI[i].candidate_name,
          appointment_type: iCSI[i].appointment_type,
          appointment_type_id: iCSI[i].appointment_type_id,
          interviewer_names: interviewer_names
        };

        arr2.push(some);
      }

      return {
        success: true,
        data: arr2
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateInterviewerContractDetails(
    data: InterviewerContractUpdateDto[],
    userId: number
  ) {
    try {
      const contractTypesRefs = await this.prisma.appointmentTypeRef.findMany({
        where: {
          enabled: 1
        },
        select: {
          id: true,
          type: true
        }
      });

      const results = await Promise.all(
        data.map(async (item) => {
          const existingRecords = await Promise.all(
            Object.entries(item)
              .filter(
                ([key]) => key !== 'id' && key !== 'name' && key !== 'mail'
              )
              .map(async ([key, value]) => {
                const contractTypeRef = contractTypesRefs.find(
                  (ref) => ref.type === key
                );
                if (contractTypeRef) {
                  return this.prisma.interviewerAppointmentTypeRef.upsert({
                    where: {
                      user_id_appointment_type: {
                        user_id: item.id,
                        appointment_type: contractTypeRef.id
                      }
                    },
                    create: {
                      user_id: item.id,
                      appointment_type: contractTypeRef.id,
                      status: +value,
                      updated_at: new Date(),
                      created_at: new Date(),
                      created_by: userId,
                      updated_by: userId
                    },
                    update: {
                      status: +value,
                      updated_at: new Date(),
                      updated_by: userId
                    }
                  });
                }
              })
          );
          return existingRecords;
        })
      );

      return { success: true, data: results };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async getInterviewerContractDetails({
    interviewerIds
  }: GetInterviewerContractDetailsDto) {
    try {
      const contractTypes = await this.prisma.appointmentTypeRef.findMany({
        where: {
          enabled: 1
        },
        select: {
          id: true,
          type: true,
          event_title: true,
          event_duration: true
        }
      });

      const contracts = await this.prisma.user.findMany({
        where: {
          OR: interviewerIds.map((id) => {
            return { tsp_id: id };
          }),
          level: 3
        },
        select: {
          tsp_id: true,
          username: true,
          NTProfile: {
            select: {
              short_name: true
            }
          },
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          VpMeetingLink: {
            select: {
              url: true
            }
          },
          InterviewerAppointmentTypeRef: {
            select: {
              appointment_type: true,
              status: true,
              bs_appointment_type_ref: {
                select: {
                  enabled: true,
                  event_duration: true,
                  event_title: true,
                  type: true
                }
              }
            }
          }
        }
      });

      const eventTitles = {};
      contractTypes.forEach((code) => {
        eventTitles[code.type] = 0;
      });

      const result = contracts.map((interviewer) => {
        const temp_interviewer_name =
          interviewer.approved_personal_data &&
          interviewer.approved_personal_data?.shortName &&
          interviewer.approved_personal_data?.shortName != ''
            ? interviewer.approved_personal_data?.shortName
            : interviewer.NTProfile &&
              interviewer.NTProfile.short_name &&
              interviewer.NTProfile.short_name != ''
            ? interviewer.NTProfile.short_name
            : interviewer.username;

        const appointmentCounts = {
          id: interviewer.tsp_id,
          name: temp_interviewer_name,
          mail: interviewer.username,
          meetingLink: interviewer.VpMeetingLink?.url ?? null,
          ...eventTitles
        };

        interviewer.InterviewerAppointmentTypeRef.forEach((appointmentRef) => {
          const { bs_appointment_type_ref, status } = appointmentRef;
          const { type } = bs_appointment_type_ref;
          appointmentCounts[type] = status;
        });

        return appointmentCounts;
      });

      return { success: true, data: result };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async apssAdminBookAppointmentTableFetch({
    candidateId,
    candidateEmail,
    appointmentTypeId,
    bookingDate,
    bookingStatusId,
    skip,
    take
  }: {
    candidateId: string;
    candidateEmail: string;
    appointmentTypeId: string;
    bookingDate: string;
    bookingStatusId: string;
    skip: number;
    take: number;
  }) {
    try {
      let filteredCandidateIds: number[] = [];
      if (
        appointmentTypeId !== '' ||
        bookingStatusId !== '' ||
        bookingDate !== ''
      ) {
        let query = `
        WITH rm AS(
          SELECT  m.*
            FROM bs_booking_status m
          WHERE m.date = (
              SELECT MAX(m2.date) FROM bs_booking_status m2 WHERE m2.candidate_id = m.candidate_id
          )
          )
          SELECT rm.candidate_id FROM rm WHERE 1=1
          `;

        if (appointmentTypeId !== '') {
          query += ` AND rm.appointment_type_ref_id ='${appointmentTypeId}'`;
        }
        if (bookingStatusId !== '') {
          query += ` AND rm.status ='${bookingStatusId}'`;
        }
        if (bookingDate !== '') {
          query += ` AND rm.date ='${bookingDate}'`;
        }
        query += ' ORDER BY rm.candidate_id';

        const data: { candidate_id: number }[] =
          await this.prisma.$queryRawUnsafe(query);

        filteredCandidateIds = data.map((d) => d.candidate_id);
      }

      const isWhere =
        candidateId !== '' ||
        candidateEmail !== '' ||
        appointmentTypeId !== '' ||
        bookingStatusId !== '' ||
        bookingDate !== '';
      const defaultFilter = { level: 2 };

      const filterWhereClause = {
        ...(candidateId === '' &&
        (appointmentTypeId !== '' ||
          bookingStatusId !== '' ||
          bookingDate !== '')
          ? {
              tsp_id: { in: filteredCandidateIds }
            }
          : candidateId !== ''
          ? {
              tsp_id: { in: [+candidateId, ...filteredCandidateIds] }
            }
          : {}),
        ...(candidateEmail !== ''
          ? {
              approved_contact_data: {
                workEmail: {
                  contains: candidateEmail
                }
              }
            }
          : {})
      };

      const candidates = await this.prisma.user.findMany({
        where: isWhere
          ? { ...defaultFilter, ...filterWhereClause }
          : defaultFilter,
        select: {
          tsp_id: true,
          username: true,
          CandidateLevel: {
            select: {
              level: true
            }
          },
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          approved_contact_data: {
            select: {
              workEmail: true
            }
          },
          BookingStatus2: {
            select: {
              id: true,
              appointment_type_ref: {
                select: {
                  id: true,
                  type: true,
                  event_title: true
                }
              },
              date: true,
              bs_booking_status_ref: {
                select: {
                  id: true,
                  status: true
                }
              },
              bs_all_booking_slot: {
                select: {
                  id: true,
                  slot_time: true
                }
              },
              interviewer: {
                select: {
                  tsp_id: true,
                  username: true,
                  approved_personal_data: {
                    select: {
                      shortName: true
                    }
                  }
                }
              }
            },
            orderBy: {
              date: 'desc'
            },
            take: 1
          }
        },
        skip: skip,
        take: take
      });

      const candidatesCount = await this.prisma.user.count({
        where: isWhere
          ? { ...defaultFilter, ...filterWhereClause }
          : defaultFilter
      });

      return {
        success: true,
        count: candidatesCount,
        data: candidates.map((candidate) => {
          return {
            id: candidate.tsp_id,
            candidateId: candidate.tsp_id,
            candidateLevel: candidate.CandidateLevel.level,
            candidateEmail: candidate?.approved_contact_data?.workEmail ?? null,
            candidateName: candidate?.approved_personal_data?.shortName ?? null,
            bookingId:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].id
                : null,
            bookingStatusId:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].bs_booking_status_ref.id
                : null,
            bookingStatus:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].bs_booking_status_ref.status
                : null,
            appointmentTypeId:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].appointment_type_ref.id
                : null,
            appointmentTypeCode:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].appointment_type_ref.type
                : null,
            appointmentType:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].appointment_type_ref.event_title
                : null,
            bookingDate:
              candidate.BookingStatus2.length > 0
                ? moment
                    .utc(candidate.BookingStatus2[0].date)
                    .format('YYYY-MM-DD')
                : null,
            slotId:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].bs_all_booking_slot.id
                : null,
            slotTime:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].bs_all_booking_slot.slot_time
                : null,
            interviewerId:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].interviewer.tsp_id
                : null,
            interviewerEmail:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].interviewer.tsp_id
                : null,
            interviewerName:
              candidate.BookingStatus2.length > 0
                ? candidate.BookingStatus2[0].interviewer
                    ?.approved_personal_data?.shortName
                : null
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async getCanidate(details: CreateBookingStatusDto) {
    try {
      const candidateGetBookingSlot = await this.prisma.$queryRaw(
        Prisma.sql`SELECT bs_booking_status.id AS id, bs_booking_status.candidate_id As candidate_id,bs_booking_status.appointment_type_ref_id As appointment_type_id, bs_booking_status.status As status, bs_booking_status.interviewer_id AS interviewer_id, bs_booking_status.date As date,bs_booking_status.time_slot_id as time_slot_id FROM bs_booking_status where bs_booking_status.id=${details.id} ;`
      );

      return {
        success: true,
        data: candidateGetBookingSlot[0]
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  async apssInterviewerAddAvilabilitySlotsFetch(
    details: InterviewerAvailabilitySlotsFetchRequestDto
  ) {
    try {
      const appointment_number = details.appointmentTypeId;

      //Get the duration group assigned to requested event type
      const appointmentTypeData =
        await this.prisma.appointmentTypeRef.findUnique({
          where: {
            id: appointment_number
          },
          select: {
            event_duration: true
          }
        });
      const event_duration = appointmentTypeData.event_duration;

      //Get All Slots for requested duration group
      const allBookingSlot = await this.prisma.allBookingSlot.findMany({
        where: {
          status: 1,
          duration: event_duration
        },
        select: {
          id: true,
          slot_time: true,
          slot_type: true,
          start_time: true,
          end_time: true,
          duration: true,
          appointment_type: true
        }
      });

      //Get list of all active event types
      const allEventTypes = await this.prisma.appointmentTypeRef.findMany({
        where: {
          enabled: 1
        },
        select: {
          id: true
        }
      });
      const allEventTypeIds = allEventTypes.map((obj) => obj.id);

      const getInterviewerSlots = async (details, appointmentTypeRefIds) => {
        const promises = appointmentTypeRefIds.map(
          async (appointmentTypeRefId) => {
            const slots = await this.prisma.bookingStatus.findMany({
              where: {
                interviewer_id: details.interviewerId,
                date: {
                  equals: new Date(moment(details.date).format('YYYY-MM-DD'))
                },
                appointment_type_ref_id: appointmentTypeRefId
              },
              select: {
                time_slot_id: true,
                bs_all_booking_slot: true
              }
            });

            return { [appointmentTypeRefId]: slots };
          }
        );

        const results = await Promise.all(promises);

        // Merge the array of objects into a single object
        return results.reduce((acc, curr) => Object.assign(acc, curr), {});
      };

      const allInterviewerSlotsIds = await getInterviewerSlots(
        details,
        allEventTypeIds
      );

      const foundExisitingSlotsOnTheDate = Object.values(
        allInterviewerSlotsIds
      ).some((array: Array<any>) => array.length > 0);

      const slotTypeList = { 1: 'morning', 2: 'afternoon', 3: 'evening' };
      const bookingStatusObject = { 1: [], 2: [], 3: [] }; // Initialize as an object of arrays

      const array = [];

      for (let j = 0; j <= allBookingSlot.length - 1; j++) {
        if (!array.includes(allBookingSlot[j].id)) {
          const slotType = slotTypeList[allBookingSlot[j].slot_type];
          if (slotType) {
            const value = {
              id: allBookingSlot[j].id,
              slot_time: allBookingSlot[j].slot_time,
              start_time: allBookingSlot[j].start_time,
              end_time: allBookingSlot[j].end_time,
              duration: allBookingSlot[j].duration,
              type: allBookingSlot[j].appointment_type,
              alreadySelected: false
            };
            array.push(allBookingSlot[j].id);
            bookingStatusObject[allBookingSlot[j].slot_type].push(value);
          }
        }
      }

      if (foundExisitingSlotsOnTheDate) {
        const timeSlots = {
          morning: bookingStatusObject[1] ?? [],
          afternoon: bookingStatusObject[2] ?? [],
          evening: bookingStatusObject[3] ?? []
        };

        const checkSlotsRecursively = (
          allInterviewerSlotsIds,
          filteredSlotsInitial,
          appointment_number,
          check2
        ) => {
          for (const key in allInterviewerSlotsIds) {
            if (
              appointment_number != key &&
              Object.prototype.hasOwnProperty.call(allInterviewerSlotsIds, key)
            ) {
              filteredSlotsInitial = check2(
                allInterviewerSlotsIds[key],
                filteredSlotsInitial,
                ''
              );
            }
          }
          return filteredSlotsInitial;
        };

        const filteredSlotsInitial = this.check(
          allInterviewerSlotsIds[appointment_number],
          timeSlots
        );

        const filteredSlotsSecond = checkSlotsRecursively(
          allInterviewerSlotsIds,
          filteredSlotsInitial,
          appointment_number,
          this.check2
        );

        return {
          success: true,
          data: filteredSlotsSecond
        };
      } else {
        return {
          success: true,
          data: {
            morning: bookingStatusObject[1] ?? [],
            afternoon: bookingStatusObject[2] ?? [],
            evening: bookingStatusObject[3] ?? []
          }
        };
      }
    } catch (error) {
      return { success: false, error };
    }
  }

  check = (interviewerSlotsId: any, allBookingSlots: any) => {
    const morningArr = allBookingSlots.morning;
    const afternoonArr = allBookingSlots.afternoon;
    const eveningArr = allBookingSlots.evening;

    interviewerSlotsId.forEach((element: any) => {
      let val = {};
      let count = 0;

      val = morningArr.find((slot: any) => {
        if (slot.id === element.time_slot_id) {
          morningArr[count] = {
            id: slot.id,
            start_time: slot.start_time,
            end_time: slot.end_time,
            duration: slot.duration,
            slot_time: slot.slot_time,
            type: slot.type,
            alreadySelected: true
          };
        }
        count++;
        return slot.id === element.time_slot_id;
      });

      if (val === undefined) {
        count = 0;
        val = afternoonArr.find((slot: any) => {
          if (slot.id === element.time_slot_id) {
            afternoonArr[count] = {
              id: slot.id,
              slot_time: slot.slot_time,
              type: slot.type,
              alreadySelected: true
            };
          }
          count++;
          return slot.id === element.time_slot_id;
        });

        if (val === undefined) {
          count = 0;
          val = eveningArr.find((slot: any) => {
            if (slot.id === element.time_slot_id) {
              eveningArr[count] = {
                id: slot.id,
                slot_time: slot.slot_time,
                type: slot.type,
                alreadySelected: true
              };
            }
            count++;
            return slot.id === element.time_slot_id;
          });
        }
      }
    });

    return {
      morning: morningArr,
      afternoon: afternoonArr,
      evening: eveningArr
    };
  };

  check2(interviewerSlotsId: any, allBookingSlots: any, type: any) {
    const morningArr = allBookingSlots.morning;
    const afternoonArr = allBookingSlots.afternoon;
    const eveningArr = allBookingSlots.evening;

    interviewerSlotsId.forEach((element: any) => {
      let val = {};
      let count = 0;

      val = morningArr.find((slot: any) => {
        if (
          moment(slot.start_time) <
            moment(element.bs_all_booking_slot.end_time) &&
          moment(slot.end_time) > moment(element.bs_all_booking_slot.start_time)
        ) {
          morningArr[count] = {
            id: slot.id,
            slot_time: slot.slot_time,
            type: slot.type,
            alreadySelected: true
          };
        }
        count++;
        return slot.id === element.time_slot_id;
      });

      count = 0;
      val = afternoonArr.find((slot: any) => {
        if (
          moment(slot.start_time) <
            moment(element.bs_all_booking_slot.end_time) &&
          moment(slot.end_time) > moment(element.bs_all_booking_slot.start_time)
        ) {
          afternoonArr[count] = {
            id: slot.id,
            slot_time: slot.slot_time,
            type: slot.type,
            alreadySelected: true
          };
        }
        count++;
        return slot.id === element.time_slot_id;
      });

      count = 0;
      val = eveningArr.find((slot: any) => {
        if (
          moment(slot.start_time) <
            moment(element.bs_all_booking_slot.end_time) &&
          moment(slot.end_time) > moment(element.bs_all_booking_slot.start_time)
        ) {
          eveningArr[count] = {
            id: slot.id,
            slot_time: slot.slot_time,
            type: slot.type,
            alreadySelected: true
          };
        }
        count++;
        return slot.id === element.time_slot_id;
      });
    });
    return {
      morning: morningArr,
      afternoon: afternoonArr,
      evening: eveningArr
    };
  }

  async checkBookingStatus(candidateId: number) {
    try {
      const bookingHistory = await this.prisma.bookingHistory.findFirst({
        where: {
          candidate_id: candidateId
        },
        orderBy: {
          id: 'desc'
        }
      });

      if (bookingHistory && bookingHistory.booking_status_id === 3) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async convertAllSlotsToCover(
    postData: ConvertAllSlotsToCoverRequestDto,
    actionedBy: number
  ) {
    try {
      const allAvilableBookingSlots =
        await this.prisma.bookingStatus.updateMany({
          where: {
            interviewer_id: postData.interviewerId,
            date: { equals: new Date(postData.date) },
            status: 1,
            candidate_id: null
          },
          data: {
            date_slot_inter: 'All to Cover',
            status: 8,
            updated_at: new Date(),
            updated_by: actionedBy
          }
        });

      if (!allAvilableBookingSlots || allAvilableBookingSlots?.count === 0) {
        throw new Error('No avilable slots found to convert to cover');
      }
      return {
        success: true,
        message:
          allAvilableBookingSlots?.count > 1
            ? `Succesfully converted ${allAvilableBookingSlots?.count} slots to cover`
            : `Succesfully converted one slot to cover`
      };
    } catch (error) {
      console.log('convertAllSlotsToCover-error', error);
      return { success: false, error: error.message };
    }
  }

  async removeAllOpenSlots(
    postData: RemoveAllOpenSlotsDto,
    actionedBy: number
  ) {
    try {
      const allAvailableBookingSlots = await this.prisma.bookingStatus.findMany(
        {
          where: {
            interviewer_id: +postData.interviewerId,
            date: { equals: new Date(postData.date) },
            status: { in: [1, 8] },
            candidate_id: null
          },
          select: {
            id: true,
            BookingHistory: {
              select: { id: true },
              take: 1
            }
          }
        }
      );

      const slotsToDelete = allAvailableBookingSlots.filter((slot) => {
        return slot.BookingHistory.length === 0; //skip if slot has foreign key record
      });

      if (allAvailableBookingSlots.length === 0) {
        return { success: false, error: 'No available slots found to remove' };
      } else if (
        allAvailableBookingSlots.length > 0 &&
        slotsToDelete.length === 0
      ) {
        return {
          success: false,
          error:
            allAvailableBookingSlots.length === 1
              ? `The bulk removal option is unable to remove the remaining open slot. <br />Please proceed by removing the slot individually as required.`
              : `The bulk removal option is unable to remove remaining ${allAvailableBookingSlots.length} open slots. <br />Please proceed by removing the slots individually as required.`
        };
      }

      //only proceed to delete if there exisit some records that can be deleted
      for (const slot of slotsToDelete) {
        await this.prisma.bookingStatus.delete({
          where: {
            id: slot.id
          }
        });
      }

      return {
        success: true,
        message:
          slotsToDelete?.length > 1
            ? `Succesfully removed ${slotsToDelete?.length} / ${allAvailableBookingSlots?.length} slots`
            : `Succesfully removed one slot`
      };
    } catch (error) {
      console.log('removeAllOpenSlots-error', error);
      return { success: false, error: error.message };
    }
  }

  async apssAdminMetaData() {
    try {
      // get list of already found booking_status values in bs_booking_status
      const usedBookingStatuses = await this.prisma.bookingStatus.groupBy({
        by: ['status']
      });
      const bookingStatusRefIds = await this.prisma.bookingStatusRef.findMany({
        select: {
          id: true,
          status: true
        },
        where: {
          id: { in: usedBookingStatuses.map((item) => item.status) }
        }
      });

      // get list of already found event_type values in bs_booking_status
      const usedEventTypesIds = await this.prisma.bookingStatus.groupBy({
        by: ['appointment_type_ref_id']
      });

      const eventTypes = await this.prisma.appointmentTypeRef.findMany({
        select: {
          id: true,
          type: true,
          event_title: true,
          enabled: true
        }
      });

      const usedEventTypes = await this.prisma.appointmentTypeRef.findMany({
        select: {
          id: true,
          type: true,
          event_title: true,
          enabled: true
        },
        where: {
          id: {
            in: usedEventTypesIds.map((item) => item.appointment_type_ref_id)
          }
        }
      });

      const eventDurations = await this.prisma.allBookingSlot.groupBy({
        by: ['duration'],
        where: {
          status: 1
        }
      });

      return {
        success: true,
        bookingStatusOptions: bookingStatusRefIds.map((item) => ({
          id: item.id,
          status: item.status
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
        })),
        eventTypeOptions: eventTypes,
        usedEventTypeOptions: usedEventTypes,
        eventDurationOptions: eventDurations
          .map((item) => item.duration)
          .sort((a, b) => a - b)
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getRescheduleCount(details: GetRescheduleCountDto) {
    try {
      const userFetch = await this.prisma.user.findUnique({
        where: { tsp_id: details.tspId },
        select: {
          CandidateLevel: { select: { level: true } }
        }
      });

      let appointment_type_id = 0;
      if (userFetch.CandidateLevel.level === 3) {
        appointment_type_id = 5;
      } else if (userFetch.CandidateLevel.level === 4) {
        appointment_type_id = 6;
      } else if (userFetch.CandidateLevel.level === 5) {
        appointment_type_id = 7;
      }

      //old count logic
      // const count = await this.prisma.bookingHistory.count({
      //   where: {
      //     candidate_id: +details.tspId,
      //     appointment_type_id: +appointment_type_id,
      //     booking_status_id: 7
      //   }
      // });

      const count = await this.prisma.bookingHistory.groupBy({
        by: ['booking_id'],
        where: {
          candidate_id: +details.tspId,
          appointment_type_id: +appointment_type_id,
          booking_status_id: {
            in: [7, 11] // WITHDRAW & MISSED
          }
        },
        _count: true
      });

      return { success: true, count: count.length };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async getInterviewerTimeTableData({
    date,
    skip,
    take,
    interviewerId,
    status,
    eventType
  }: InterviewerTimeTableFetchDto) {
    try {
      const interviewersWithinDay = await this.prisma.bookingStatus.findMany({
        where: {
          status:
            status.length > 0
              ? {
                  in: status
                }
              : {},
          appointment_type_ref_id:
            eventType.length > 0
              ? {
                  in: eventType
                }
              : {},
          date: {
            gte: moment.utc(date, 'YYYY-MM-DD').startOf('day').toDate(),
            lte: moment.utc(date, 'YYYY-MM-DD').endOf('day').toDate()
          }
        },
        select: {
          interviewer_id: true
        },
        distinct: ['interviewer_id']
      });

      const interviewers = await this.prisma.user.findMany({
        where: {
          tsp_id:
            interviewerId != 0
              ? { equals: interviewerId }
              : {
                  in: interviewersWithinDay.map((id) => id.interviewer_id)
                }
        },
        select: {
          tsp_id: true,
          username: true,
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          BookingStatus: {
            where: {
              date: {
                gte: moment.utc(date, 'YYYY-MM-DD').startOf('day').toDate(),
                lte: moment.utc(date, 'YYYY-MM-DD').endOf('day').toDate()
              },
              status:
                status.length > 0
                  ? {
                      in: status
                    }
                  : {},
              appointment_type_ref_id:
                eventType.length > 0
                  ? {
                      in: eventType
                    }
                  : {}
            },
            select: {
              candidate: {
                select: {
                  tsp_id: true,
                  approved_personal_data: {
                    select: {
                      shortName: true
                    }
                  },
                  approved_contact_data: {
                    select: {
                      workEmail: true
                    }
                  }
                }
              },
              id: true,
              appointment_type_ref: {
                select: {
                  id: true,
                  type: true,
                  event_title: true
                }
              },
              bs_all_booking_slot: {
                select: {
                  slot_time: true,
                  start_time: true,
                  end_time: true,
                  duration: true
                }
              },
              bs_booking_status_ref: {
                select: {
                  status: true
                }
              },
              BookingHistory: {
                select: {
                  bs_booking_status_ref: {
                    select: {
                      status: true
                    }
                  }
                },
                orderBy: { id: 'desc' },
                take: 1
              },
              date: true
            }
          },
          NTProfile: {
            select: {
              short_name: true,
              leaveApplications: {
                where: {
                  status: 2,
                  fromDate: {
                    lte: moment.utc(date).toDate()
                  },
                  toDate: {
                    gte: moment.utc(date).toDate()
                  }
                },
                select: {
                  tspId: true,
                  fromDate: true,
                  toDate: true,
                  numOfDays: true
                }
              }
            }
          }
        },
        skip: skip,
        take: take
      });

      const interviewersCount = await this.prisma.user.findMany({
        where: {
          tsp_id:
            interviewerId != 0
              ? { equals: interviewerId }
              : {
                  in: interviewersWithinDay.map((id) => id.interviewer_id)
                }
        },
        select: {
          BookingStatus: {
            where: {
              date: {
                gte: moment.utc(date, 'YYYY-MM-DD').startOf('day').toDate(),
                lte: moment.utc(date, 'YYYY-MM-DD').endOf('day').toDate()
              },
              status:
                status.length > 0
                  ? {
                      in: status
                    }
                  : {},
              appointment_type_ref_id:
                eventType.length > 0
                  ? {
                      in: eventType
                    }
                  : {}
            }
          },
          NTProfile: {
            select: {
              leaveApplications: {
                where: {
                  status: 2,
                  fromDate: {
                    lte: moment.utc(date).toDate()
                  },
                  toDate: {
                    gte: moment.utc(date).toDate()
                  }
                }
              }
            }
          }
        }
      });

      const response = interviewers.map((interviewer) => {
        const temp_interviewer_name =
          interviewer.approved_personal_data &&
          interviewer.approved_personal_data?.shortName &&
          interviewer.approved_personal_data?.shortName != ''
            ? interviewer.approved_personal_data?.shortName
            : interviewer.NTProfile &&
              interviewer.NTProfile.short_name &&
              interviewer.NTProfile.short_name != ''
            ? interviewer.NTProfile.short_name
            : interviewer.username;

        return {
          id: interviewer.tsp_id,
          interviewerName: temp_interviewer_name,
          interviewerEmail: interviewer.username,
          isOnLeave:
            interviewer?.NTProfile?.leaveApplications.length > 0 ? true : false,
          leaveApplications: interviewer?.NTProfile?.leaveApplications ?? [],
          ...interviewer.BookingStatus.reduce(
            (prev, curr) => {
              const start = moment
                .utc(curr.bs_all_booking_slot.start_time)
                .startOf('h')
                .format('HH:mm');

              const end = moment
                .utc(curr.bs_all_booking_slot.start_time)
                .endOf('h')
                .add(1, 'minute')
                .format('HH:mm');

              if (prev[`${start} - ${end}`]) {
                prev[`${start} - ${end}`].push({
                  candidateId: curr?.candidate?.tsp_id ?? null,
                  candidateName:
                    curr.candidate?.approved_personal_data?.shortName ?? null,
                  candidateEmail:
                    curr.candidate?.approved_contact_data?.workEmail ?? null,
                  appointmentTypeId: curr.appointment_type_ref?.id ?? null,
                  appointmentType: curr.appointment_type_ref?.type ?? null,
                  appointmentTypeTitle:
                    curr.appointment_type_ref?.event_title ?? null,
                  bookingId: curr.id ?? null,
                  bookingDate: curr.date ?? null,
                  slot: curr.bs_all_booking_slot?.slot_time ?? null,
                  slotStartTime:
                    moment(curr.bs_all_booking_slot?.start_time) ?? null,
                  slotEndTime:
                    moment(curr.bs_all_booking_slot?.end_time) ?? null,
                  start:
                    moment
                      .utc(curr.bs_all_booking_slot?.start_time)
                      .minutes() ?? 0,
                  end:
                    moment.utc(curr.bs_all_booking_slot?.end_time).minutes() ??
                    0,
                  duration: curr?.bs_all_booking_slot?.duration ?? 0,
                  status: curr.bs_booking_status_ref?.status ?? null,
                  statusHistoryText:
                    curr.BookingHistory &&
                    curr.BookingHistory[0]?.bs_booking_status_ref?.status
                      ? curr.BookingHistory[0]?.bs_booking_status_ref?.status
                      : ''
                });
              }
              return prev;
            },
            {
              '08:00 - 09:00': [],
              '09:00 - 10:00': [],
              '10:00 - 11:00': [],
              '11:00 - 12:00': [],
              '12:00 - 13:00': [],
              '13:00 - 14:00': [],
              '14:00 - 15:00': [],
              '15:00 - 16:00': [],
              '16:00 - 17:00': [],
              '17:00 - 18:00': [],
              '18:00 - 19:00': [],
              '19:00 - 20:00': [],
              '20:00 - 21:00': [],
              '21:00 - 22:00': [],
              '22:00 - 23:00': []
            }
          )
        };
      });

      return { success: true, data: response, count: interviewersCount.length };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async getInterviewerTimeTableExport({
    date,
    interviewerId,
    status,
    eventType
  }: InterviewerTimeTableFetchDto) {
    try {
      const interviewers = await this.prisma.bookingStatus.findMany({
        where: {
          interviewer_id: interviewerId != 0 ? { equals: interviewerId } : {},
          date: {
            gte: moment.utc(date, 'YYYY-MM-DD').startOf('day').toDate(),
            lte: moment.utc(date, 'YYYY-MM-DD').endOf('day').toDate()
          },
          status:
            status.length > 0
              ? {
                  in: status
                }
              : {},
          appointment_type_ref_id:
            eventType.length > 0
              ? {
                  in: eventType
                }
              : {}
        },
        select: {
          interviewer: {
            select: {
              tsp_id: true,
              username: true,
              NTProfile: {
                select: { short_name: true }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          candidate: {
            select: {
              tsp_id: true,
              approved_personal_data: {
                select: {
                  shortName: true
                }
              },
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              }
            }
          },
          appointment_type_ref: {
            select: {
              id: true,
              type: true,
              event_title: true
            }
          },
          bs_all_booking_slot: {
            select: {
              slot_time: true,
              start_time: true,
              end_time: true,
              duration: true
            }
          },
          bs_booking_status_ref: {
            select: {
              status: true
            }
          },
          date: true,
          id: true
        }
      });

      return {
        success: true,
        data: interviewers.map((interviewer) => {
          const temp_interviewer_name =
            interviewer.interviewer.approved_personal_data &&
            interviewer.interviewer.approved_personal_data?.shortName &&
            interviewer.interviewer.approved_personal_data?.shortName != ''
              ? interviewer.interviewer.approved_personal_data?.shortName
              : interviewer.interviewer.NTProfile &&
                interviewer.interviewer.NTProfile.short_name &&
                interviewer.interviewer.NTProfile.short_name != ''
              ? interviewer.interviewer.NTProfile.short_name
              : interviewer.interviewer.username;

          return {
            bookingId: interviewer?.id,
            interviewerId: interviewer?.interviewer?.tsp_id,
            interviewerName: temp_interviewer_name,
            interviewerEmail: interviewer?.interviewer?.username,
            appointmentTypeId: interviewer?.appointment_type_ref?.id,
            appointmentTypeCode: interviewer?.appointment_type_ref?.type,
            appointmentTypeTitle:
              interviewer?.appointment_type_ref?.event_title,
            slotTime: interviewer?.bs_all_booking_slot?.slot_time,
            slotStartTime: interviewer?.bs_all_booking_slot?.start_time,
            slotEndTime: interviewer?.bs_all_booking_slot?.end_time,
            slotDuration: interviewer?.bs_all_booking_slot?.duration,
            bookingStatus: interviewer?.bs_booking_status_ref?.status,
            candidateTspId: interviewer?.candidate?.tsp_id,
            candidateName:
              interviewer?.candidate?.approved_personal_data?.shortName,
            candidateEmail:
              interviewer?.candidate?.approved_contact_data?.workEmail
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async getInterviewerTimeTableWeeklyViewTableData({
    date,
    skip,
    take,
    interviewerId,
    status,
    eventType
  }: InterviewerTimeTableFetchDto) {
    try {
      const interviewersWithinWeek = await this.prisma.bookingStatus.findMany({
        where: {
          status: status.length > 0 ? { in: status } : {},
          appointment_type_ref_id:
            eventType.length > 0 ? { in: eventType } : {},
          date: {
            gte: moment.utc(date, 'YYYY-MM-DD').startOf('isoWeek').toDate(),
            lte: moment.utc(date, 'YYYY-MM-DD').endOf('isoWeek').toDate()
          }
        },
        select: {
          interviewer_id: true
        },
        distinct: ['interviewer_id']
      });

      const interviewers = await this.prisma.user.findMany({
        where: {
          tsp_id:
            interviewerId != 0
              ? { equals: interviewerId }
              : {
                  in: interviewersWithinWeek.map(
                    (interviewer) => interviewer.interviewer_id
                  )
                }
        },
        select: {
          tsp_id: true,
          username: true,
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          BookingStatus: {
            where: {
              date: {
                gte: moment.utc(date, 'YYYY-MM-DD').startOf('isoWeek').toDate(),
                lte: moment.utc(date, 'YYYY-MM-DD').endOf('isoWeek').toDate()
              },
              status: status.length > 0 ? { in: status } : {},
              appointment_type_ref_id:
                eventType.length > 0 ? { in: eventType } : {}
            },
            select: {
              appointment_type_ref_id: true,
              status: true,
              date: true
            }
          },
          NTProfile: {
            select: {
              short_name: true,
              leaveApplications: {
                where: {
                  status: 2,
                  fromDate: {
                    lte: moment
                      .utc(date, 'YYYY-MM-DD')
                      .endOf('isoWeek')
                      .toDate()
                  },
                  toDate: {
                    gte: moment
                      .utc(date, 'YYYY-MM-DD')
                      .startOf('isoWeek')
                      .toDate()
                  }
                },
                select: {
                  tspId: true,
                  fromDate: true,
                  toDate: true,
                  numOfDays: true
                }
              }
            }
          }
        },
        skip: skip,
        take: take
      });

      const interviewersCount = await this.prisma.user.findMany({
        where: {
          tsp_id:
            interviewerId != 0
              ? { equals: interviewerId }
              : {
                  in: interviewersWithinWeek.map(
                    (interviewer) => interviewer.interviewer_id
                  )
                }
        },
        select: {
          BookingStatus: {
            where: {
              date: {
                gte: moment.utc(date, 'YYYY-MM-DD').startOf('isoWeek').toDate(),
                lte: moment.utc(date, 'YYYY-MM-DD').endOf('isoWeek').toDate()
              },
              status: status.length > 0 ? { in: status } : {},
              appointment_type_ref_id:
                eventType.length > 0 ? { in: eventType } : {}
            }
          },
          NTProfile: {
            select: {
              short_name: true,
              leaveApplications: {
                where: {
                  status: 2,
                  fromDate: {
                    lte: moment
                      .utc(date, 'YYYY-MM-DD')
                      .endOf('isoWeek')
                      .toDate()
                  },
                  toDate: {
                    gte: moment
                      .utc(date, 'YYYY-MM-DD')
                      .startOf('isoWeek')
                      .toDate()
                  }
                }
              }
            }
          }
        }
      });

      const response = interviewers.map((interviewer) => {
        const temp_interviewer_name =
          interviewer.approved_personal_data &&
          interviewer.approved_personal_data?.shortName &&
          interviewer.approved_personal_data?.shortName != ''
            ? interviewer.approved_personal_data?.shortName
            : interviewer.NTProfile &&
              interviewer.NTProfile.short_name &&
              interviewer.NTProfile.short_name != ''
            ? interviewer.NTProfile.short_name
            : interviewer.username;

        return {
          id: interviewer.tsp_id,
          interviewerName: temp_interviewer_name,
          interviewerEmail: interviewer.username,
          isOnLeave:
            interviewer?.NTProfile?.leaveApplications?.length > 0
              ? true
              : false,
          leaveApplications: interviewer?.NTProfile?.leaveApplications ?? [],
          ...interviewer.BookingStatus.reduce(
            (prev, curr) => {
              const day = moment.utc(curr.date).format('dddd');

              if (prev[day]) {
                prev[day] = {
                  totalCount: prev[day].totalCount + 1,
                  available:
                    curr.status === 1
                      ? prev[day].available + 1
                      : prev[day].available + 0,
                  cover:
                    curr.status === 8
                      ? prev[day].cover + 1
                      : prev[day].cover + 0,
                  booked:
                    curr.status === 3
                      ? prev[day].booked + 1
                      : prev[day].booked + 0,
                  completed:
                    curr.status === 4
                      ? prev[day].completed + 1
                      : prev[day].completed + 0
                };
                prev['Week'] = {
                  totalCount: prev['Week'].totalCount + 1,
                  available:
                    curr.status === 1
                      ? prev['Week'].available + 1
                      : prev['Week'].available + 0,
                  cover:
                    curr.status === 8
                      ? prev['Week'].cover + 1
                      : prev['Week'].cover + 0,
                  booked:
                    curr.status === 3
                      ? prev['Week'].booked + 1
                      : prev['Week'].booked + 0,
                  completed:
                    curr.status === 4
                      ? prev['Week'].completed + 1
                      : prev['Week'].completed + 0
                };
              }

              return prev;
            },
            {
              Monday: {
                totalCount: 0,
                available: 0,
                cover: 0,
                booked: 0,
                completed: 0
              },
              Tuesday: {
                totalCount: 0,
                available: 0,
                cover: 0,
                booked: 0,
                completed: 0
              },
              Wednesday: {
                totalCount: 0,
                available: 0,
                cover: 0,
                booked: 0,
                completed: 0
              },
              Thursday: {
                totalCount: 0,
                available: 0,
                cover: 0,
                booked: 0,
                completed: 0
              },
              Friday: {
                totalCount: 0,
                available: 0,
                cover: 0,
                booked: 0,
                completed: 0
              },
              Saturday: {
                totalCount: 0,
                available: 0,
                cover: 0,
                booked: 0,
                completed: 0
              },
              Sunday: {
                totalCount: 0,
                available: 0,
                cover: 0,
                booked: 0,
                completed: 0
              },
              Week: {
                totalCount: 0,
                available: 0,
                cover: 0,
                booked: 0,
                completed: 0
              }
            }
          )
        };
      });

      return { success: true, data: response, count: interviewersCount.length };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async getInterviewerTimeTableWeeklyViewExport({
    interviewerId,
    status,
    eventType,
    date
  }: InterviewerTimeTableFetchDto) {
    try {
      const interviewerWithinWeek = await this.prisma.bookingStatus.findMany({
        where: {
          status: status.length > 0 ? { in: status } : {},
          appointment_type_ref_id:
            eventType.length > 0 ? { in: eventType } : {},
          date: {
            gte: moment.utc(date, 'YYYY-MM-DD').startOf('isoWeek').toDate(),
            lte: moment.utc(date, 'YYYY-MM-DD').endOf('isoWeek').toDate()
          }
        },
        select: {
          interviewer_id: true
        },
        distinct: ['interviewer_id']
      });

      const interviewers = await this.prisma.user.findMany({
        where: {
          tsp_id:
            interviewerId != 0
              ? { equals: interviewerId }
              : {
                  in: interviewerWithinWeek.map(
                    (interviewer) => interviewer.interviewer_id
                  )
                }
        },
        select: {
          tsp_id: true,
          username: true,
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          BookingStatus: {
            where: {
              date: {
                gte: moment.utc(date, 'YYYY-MM-DD').startOf('isoWeek').toDate(),
                lte: moment.utc(date, 'YYYY-MM-DD').endOf('isoWeek').toDate()
              },
              status: status.length > 0 ? { in: status } : {},
              appointment_type_ref_id:
                eventType.length > 0 ? { in: eventType } : {}
            },
            select: {
              appointment_type_ref_id: true,
              status: true,
              date: true
            }
          }
        }
      });

      const response = interviewers.map((interviewer) => {
        return {
          id: interviewer.tsp_id,
          interviewerName: interviewer.approved_personal_data?.shortName ?? '',
          interviewerEmail: interviewer.username,
          ...interviewer.BookingStatus.reduce(
            (prev, curr) => {
              prev.totalCount = prev.totalCount + 1;
              prev.available =
                curr.status === 1 ? prev.available + 1 : prev.available + 0;
              prev.cover = curr.status === 8 ? prev.cover + 1 : prev.cover + 0;
              prev.booked =
                curr.status === 3 ? prev.booked + 1 : prev.booked + 0;
              prev.completed =
                curr.status === 4 ? prev.completed + 1 : prev.completed + 0;

              return prev;
            },
            {
              totalCount: 0,
              cover: 0,
              booked: 0,
              completed: 0,
              available: 0
            }
          )
        };
      });

      return { success: true, data: response };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }
}
