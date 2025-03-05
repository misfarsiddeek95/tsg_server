import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../../user/service/user.service';
import {
  CONTRY_ABBERVIATIONS,
  LEAVE_MOVEMENTS,
  adjustTime,
  allArraysHaveValues,
  getNextDayOfWeekFromDate,
  getTheExactDate,
  getTutorWorkingCountry
} from '../../../util';
import { SlotsService } from '../../../slots/slots.service';

@Injectable()
export class AvailabilityService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private slotsService: SlotsService
  ) {}

  async getAvailability(params: {
    skip?: number;
    take?: number;
    filter: any;
    user: any;
  }) {
    try {
      const { skip, take, filter, user } = params;

      const {
        date,
        batch,
        tutor_id,
        tutor_name,
        hour_status,
        status,
        tutorType,
        country
      } = JSON.parse(filter);

      //Mondays date
      const mondayDate = new Date(
        getTheExactDate(date, 'Monday')
      ).toISOString();
      //Fridays date
      const fridayDate = new Date(
        getTheExactDate(date, 'Friday')
      ).toISOString();

      let tutorIdsForResult = [];
      const tutorIDFilter = [];
      const tutorNameFilter = [];
      const tutorStatusFilter = [];
      const tutorHourStateFilter = [];

      const tutorContriesFilter =
        country.length > 0
          ? country.map((c) => CONTRY_ABBERVIATIONS[country])
          : [];

      //If there is nothing for filters get the active tutors
      if (
        batch.length === 0 &&
        tutor_id.length === 0 &&
        tutor_name.length === 0 &&
        hour_status.length === 0 &&
        status.length === 0
      ) {
        const ids = await this.userService.getActiveTutorsForEffectiveDate(
          fridayDate
        );

        tutorIdsForResult.push(...ids);
      }

      //If tutor id is provided
      if (tutor_id.length > 0) {
        const tutorIdDetails = await this.prisma.tslUser.findMany({
          where: {
            tsl_id: {
              in: tutor_id.map(Number)
            }
          },
          select: {
            tsp_id: true
          }
        });

        const ids = tutorIdDetails.map((id) => id.tsp_id);

        tutorIDFilter.push(...ids);
      }

      // If tutor name is available
      if (tutor_name.length > 0) tutorNameFilter.push(...tutor_name);

      // If hour status is available
      if (hour_status.length > 0) {
        const ids = await this.userService.getTutorsForGivenHourStatus(
          fridayDate,
          hour_status
        );
        tutorHourStateFilter.push(...ids);
      }

      //If status is available
      if (status.length > 0) {
        const ids = await this.userService.getTutorsForGivenMultipleStatus(
          mondayDate,
          status
        );

        tutorStatusFilter.push(...ids);
      }

      // Find common values among all arrays
      const commonValues = tutorIDFilter.filter(
        (id) =>
          allArraysHaveValues(
            tutorNameFilter,
            tutorStatusFilter,
            tutorHourStateFilter
          ) &&
          tutorNameFilter.includes(id) &&
          tutorStatusFilter.includes(id) &&
          tutorHourStateFilter.includes(id)
      );

      // If there are common values, push them to tutorIdsForResult
      if (commonValues.length > 0) {
        tutorIdsForResult.push(...commonValues);
      } else {
        // If no common values, find the arrays with values and push their whole data
        if (tutorIDFilter.length > 0) {
          tutorIdsForResult.push(...tutorIDFilter);
        }
        if (tutorNameFilter.length > 0) {
          tutorIdsForResult.push(...tutorNameFilter);
        }
        if (tutorStatusFilter.length > 0) {
          tutorIdsForResult.push(...tutorStatusFilter);
        }
        if (tutorHourStateFilter.length > 0) {
          tutorIdsForResult.push(...tutorHourStateFilter);
        }
      }

      if (tutorType.length > 0) {
        const data = await this.userService.getTutorsReleventBusinessLine(
          tutorIdsForResult,
          tutorType,
          fridayDate
        );
        tutorIdsForResult = data.map((id) => id.tspId);
      }

      // START - Data fetching to the function
      const whereClause = {
        AND: [
          {
            user: {
              tm_approved_status: {
                supervisorTspId: Number(user.user.tsp_id),
                batch: batch.length > 0 ? { in: batch } : {},
                center:
                  tutorContriesFilter.length > 0
                    ? { in: tutorContriesFilter }
                    : {}
              }
            },
            effective_date: {
              lte: mondayDate
            },
            tsp_id: { in: tutorIdsForResult }
          }
        ]
      };

      const slotsAvailableForTimePeriod =
        await this.slotsService.getActiveSlotsForEffectiveDate(fridayDate);
      const timeRanges = await this.slotsService.getTimeSlotsFromGoaSlots(
        slotsAvailableForTimePeriod
      );

      const count = await this.prisma.gOATutorsSlots.count({
        where: whereClause
      });

      const tutorAvailability = await this.prisma.gOATutorsSlots.findMany({
        skip,
        take,
        where: whereClause,
        select: {
          id: true,
          tsp_id: true,
          GOATutorSlotsDetails: {
            where: {
              slot_id: {
                in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
              },
              effective_date: {
                lte: fridayDate
              }
            },
            orderBy: [
              {
                effective_date: 'desc'
                // id: 'desc'
              }
            ],
            distinct: ['slot_id'],
            select: {
              id: true,
              effective_date: true,
              slot: {
                select: {
                  id: true,
                  time_range_id: true,
                  date: {
                    select: {
                      date: true
                    }
                  }
                }
              },
              slot_status: {
                select: {
                  id: true,
                  code: true,
                  description: true
                }
              }
            }
          },
          user: {
            select: {
              TslUser: {
                select: {
                  tsl_full_name: true,
                  tsl_id: true,
                  tsl_contract: {
                    where: {
                      start_date: {
                        lte: fridayDate
                      },
                      end_date: {
                        gte: fridayDate
                      },
                      contract_status: 1
                    },
                    select: {
                      contract_id: true
                    },
                    take: 1
                  }
                }
              },
              tm_approved_status: {
                select: {
                  supervisorName: true,
                  batch: true,
                  center: true
                }
              },
              GOATutorHourState: {
                select: {
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: fridayDate
                      }
                    },
                    orderBy: {
                      id: 'desc'
                    },
                    take: 1,
                    select: {
                      hour_state: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
                }
              },
              /* 
                fetch the booked UK sessions from goa_sessions_future table.
                pass the start date and the end date of the effective date's week.
              */
              GoaSessionsFuture: {
                where: {
                  date: {
                    gte: moment(mondayDate).format('YYYY-MM-DD'),
                    lte: moment(fridayDate).format('YYYY-MM-DD')
                  },
                  statusId: 1
                },
                select: {
                  sessionType: true,
                  sessionId: true,
                  date: true,
                  slot: true,
                  tspId: true,
                  goaSlotId: true,
                  // This join will return the statuses: BOOKED or CANCELLED.
                  capautSessionStatus: {
                    select: {
                      code: true,
                      id: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      // booked US session fetch
      const usBookedSessionsOfTutors =
        await this.getUSBookedSessionsForSelectedTutorsWithTimeRange(
          tutorAvailability.map((ta) => ta.tsp_id),
          mondayDate,
          fridayDate
        );

      const calendar = await this.prisma.calendar.findMany({
        where: {
          holidays_type_id: 2,
          effective_date: {
            gte: mondayDate,
            lte: fridayDate
          }
        },
        select: {
          id: true,
          effective_date: true
        }
      });
      // END - Data fetching to the function

      const data = [];

      for (const r of tutorAvailability) {
        const hourStatus =
          r.user.GOATutorHourState[0] &&
          r.user.GOATutorHourState[0].GOATutorHourStateDetails[0]
            ? r.user.GOATutorHourState[0].GOATutorHourStateDetails[0].hour_state
                .name
            : '...';

        const tutorType = await this.userService.getTutorReleventBusinessLine(
          r.tsp_id,
          fridayDate
        );

        const tutorStatus =
          await this.userService.getTutorStatusForSpecificDate(
            r.tsp_id,
            fridayDate
          );

        const country = r.user.tm_approved_status
          ? getTutorWorkingCountry(r.user.tm_approved_status.center)
          : '';

        const contractId =
          r.user.TslUser[0] && r.user.TslUser[0].tsl_contract[0]
            ? r.user.TslUser[0].tsl_contract[0].contract_id
            : 'Pending';

        const movementsForTutor =
          await this.userService.getTutorsMovementForDateRange(
            mondayDate,
            fridayDate,
            r.tsp_id
          );

        const restructuredObject = {
          id: r.id,
          user_id: r.tsp_id,
          tutor_id: r.user.TslUser[0] ? r.user.TslUser[0].tsl_id : '....',
          tutor_name: r.user.TslUser[0]
            ? r.user.TslUser[0].tsl_full_name
            : '...',
          supervisorName: r.user.tm_approved_status.supervisorName,
          hour_status: hourStatus,
          ppUrl: '',
          tutor_status: tutorStatus,
          tutor_slot: r.GOATutorSlotsDetails.length,
          tutor_type: tutorType,
          contract_id: contractId,
          country: country,
          batch: r.user.tm_approved_status.batch
            ? r.user.tm_approved_status.batch
            : 'N/A'
        };

        // for (const timeRange of timeRanges) {
        //   const slotForTheTimeRange =
        //     await this.slotsService.getSlotsFromTimeSlot(timeRange.id);

        //   for (const slot of slotForTheTimeRange) {
        //     const filteredTutorSlotsDetails = r.GOATutorSlotsDetails.find(
        //       (i) => i.slot.time_range_id === timeRange.id
        //     );

        //     const day = slot.date.date;
        //     const index = timeRange.id;
        //     const value = filteredTutorSlotsDetails?.slot_status.code ?? 'N';

        //     const movementForDay = movementsForTutor.filter(
        //       (move) =>
        //         new Date(move.effectiveDate) <=
        //         new Date(getTheExactDate(mondayDate, day))
        //     );

        //     const move =
        //       movementForDay.length === 0 ||
        //       !LEAVE_MOVEMENTS.includes(movementForDay[0].movementType)
        //         ? false
        //         : true;

        //     const isClose = calendar.some(
        //       (c) =>
        //         moment(c.effective_date).format('YYYY-MM-DD') ===
        //         this.getWeekDate(day, date)
        //     );

        //     restructuredObject[`${day}${index}`] = {
        //       idtutor_time_slots_data: timeRange.id,
        //       idslot: slot.id,
        //       value: isClose ? '' : value,
        //       isClose: isClose,
        //       movement:
        //         filteredTutorSlotsDetails?.slot_status.id === 5 ? false : move,
        //       movementType: move ? movementForDay[0].movementType : 'active',
        //       effective_date: move
        //         ? moment(movementForDay[0].effectiveDate).format('YYYY-MM-DD')
        //         : '',
        //       return_date: move
        //         ? moment(movementForDay[0].returnDate).format('YYYY-MM-DD')
        //         : ''
        //     };
        //   }
        // }

        // tutor's booked UK sessions from capaut table.
        const bookedSessions = r?.user?.GoaSessionsFuture ?? [];

        // US Booked sessions from capaut table
        const overlappedDetails = await this.checkOverlap(
          slotsAvailableForTimePeriod,
          usBookedSessionsOfTutors.filter((us) => us.tspId === r.tsp_id),
          hourStatus === 'OH' ? 'oh_time' : 'hh_time',
          mondayDate
        );

        for (const slot of slotsAvailableForTimePeriod) {
          const availabilitForSlot = r.GOATutorSlotsDetails.find(
            (availability) => availability.slot.id === slot.slotId
          );

          const isClose = calendar.some(
            (c) =>
              moment(c.effective_date).format('YYYY-MM-DD') ===
              this.getWeekDate(slot.details.date.date, date)
          );

          /* 
            Checking with the slot id from the fetched array to get exact booked slot.
              - In future, booked?.capautSessionStatus?.code === 'BOOKED' this checking also can be added if it required.
                - because there are two statuses are coming with that code. 1. BOOKED, and 2. CANCELED.
          */
          const booked = bookedSessions?.find(
            (booked) => booked.goaSlotId === slot.slotId // checking goa slot ids are equal.
          );

          /* 
            checking the booked session is Primary or Secondary.
              - if Primary it will be denoted by P,
              - if Secondary it will be denoted by S
          */
          let bookedVal = '';
          if (booked?.sessionType.toUpperCase() === 'PRIMARY') {
            bookedVal = 'P';
          } else if (booked?.sessionType.toUpperCase() === 'SECONDARY') {
            bookedVal = 'S';
          }

          const usBookingOverlap = overlappedDetails.find(
            (ov) => ov.slotId === slot.slotId
          );

          /* 
            Here I've checked status is Time off, if yes return the TO, if not check US session available or not, if yes return the US value, after that check the bookedVal is not empty value will be denoted by the value of bookedVal.
            if not it will return the value of other statuses such as PA, PC, SA, SC, H, and N.

              –> Below order is followed.
                Approved Time off (TO)
                Session bookings (P/S/US)
                Accepted Availability (PA,SA,PC,SC)
                On hold (H)
                Availability given or not (Y, -)
          */

          const value =
            availabilitForSlot?.slot_status.code === 'TO'
              ? 'TO'
              : usBookingOverlap.overlapped
              ? 'US'
              : bookedVal !== ''
              ? bookedVal
              : availabilitForSlot?.slot_status.code ?? 'N';

          const movementForDay = movementsForTutor.filter(
            (move) =>
              new Date(move.effectiveDate) <=
              new Date(getTheExactDate(mondayDate, slot.details.date.date))
          );
          const move =
            movementForDay.length === 0 ||
            !LEAVE_MOVEMENTS.includes(movementForDay[0].movementType)
              ? false
              : true;

          const outputKey = `${slot.details.date.date}${slot.details.time_range.id}`;
          restructuredObject[outputKey] = {
            idtutor_time_slots_data: slot.details.time_range.id,
            idslot: slot.slotId,
            value: isClose ? '' : value,
            isClose: isClose,
            movement: availabilitForSlot?.slot_status.id === 5 ? false : move,
            movementType: move ? movementForDay[0].movementType : 'active',
            effective_date: move
              ? moment(movementForDay[0].effectiveDate).format('YYYY-MM-DD')
              : '',
            return_date: move
              ? moment(movementForDay[0].returnDate).format('YYYY-MM-DD')
              : ''
          };
        }

        data.push(restructuredObject);
      }

      return { success: true, date: fridayDate, count, data };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }

  getWeekDate(field: string, date: any) {
    const begin = moment(date).isoWeekday(1).startOf('week');
    switch (field) {
      case 'Monday':
        return begin.add(1, 'd').format('YYYY-MM-DD');
      case 'Tuesday':
        return begin.add(2, 'd').format('YYYY-MM-DD');
      case 'Wednesday':
        return begin.add(3, 'd').format('YYYY-MM-DD');
      case 'Thursday':
        return begin.add(4, 'd').format('YYYY-MM-DD');
      case 'Friday':
        return begin.add(5, 'd').format('YYYY-MM-DD');
      default:
        return date;
    }
  }

  async updateHourStatus(details) {
    // TODO: Need to apply transaction for the update part
    try {
      const { id, hour_status } = details;

      await this.prisma.gOATutorsSlots.update({
        where: {
          id: id
        },
        data: {
          hour_status: hour_status
        }
      });

      await this.prisma.gOATutorSlotsDetails.updateMany({
        where: {
          tutor_slot_id: id
        },
        data: {
          hour_status: hour_status
        }
      });

      return { success: true, data: details };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBatch(params: { filter: string; user: any }) {
    const { filter, user } = params;

    try {
      const result = await this.prisma.tmApprovedStatus.findMany({
        where: {
          batch: {
            contains: filter
          },
          supervisorTspId: user.user.tsp_id
        },
        distinct: ['batch'],
        select: {
          batch: true
        }
      });

      const data = result.map((key) => {
        return {
          tspId: Number(key.batch),
          name: key.batch
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTutorName(params: { filter: string; user: any }) {
    const { filter, user } = params;
    try {
      const result = await this.prisma.tslUser.findMany({
        where: {
          AND: {
            user: {
              tm_approved_status: {
                supervisorTspId: { in: user.user.tsp_id }
              }
            },
            tsl_full_name: { contains: filter }
          }
        },
        distinct: ['tsl_full_name'],
        select: {
          tsl_full_name: true,
          tsp_id: true
        }
      });

      const data = result.map((key) => {
        return {
          tspId: Number(key.tsp_id),
          name: key.tsl_full_name
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTutorID(params: { filter: number; user: any }) {
    try {
      const { filter, user } = params;
      const result = await this.prisma.tslUser.findMany({
        where: {
          AND: {
            user: {
              tm_approved_status: {
                supervisorTspId: { in: user.user.tsp_id }
              }
            },
            tsl_id: { in: filter }
          }
        },
        distinct: ['tsl_id'],
        select: {
          tsl_id: true,
          tsp_id: true
        }
      });

      const data = result.map((key) => {
        return {
          tspId: Number(key.tsp_id),
          name: key.tsl_id + ''
        };
      });
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getStatus() {
    try {
      const result = await this.prisma.hrisProgress.findMany({
        distinct: ['profileStatus'],
        select: {
          profileStatus: true
        }
      });

      return {
        success: true,
        data: result.map((e) => {
          return e.profileStatus;
        })
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUSBookedSessionsForSelectedTutorsWithTimeRange(
    tspIds: number[],
    mondayDate: string,
    fridayDate: string
  ): Promise<any> {
    const usBookedSessions = await this.prisma.gOAUsBookedSession.findMany({
      where: {
        tspId: {
          in: tspIds
        },
        sessionScheduledDate: {
          gte: mondayDate,
          lte: fridayDate
        },
        status: {
          in: ['CONFIRMED']
        }
      },
      orderBy: [
        { sessionScheduledDate: 'asc' },
        { sessionScheduledTime: 'asc' }
      ]
    });

    return usBookedSessions;
  }

  async checkOverlap(slots, usSessions, hourStatus, monday) {
    const output = [];

    // Preprocess usSessions into a hashmap grouped by session date
    const sessionsByDate = usSessions.reduce((acc, session) => {
      const sessionDate = new Date(session.sessionScheduledDate)
        .toISOString()
        .split('T')[0];
      if (!acc[sessionDate]) {
        acc[sessionDate] = [];
      }
      acc[sessionDate].push(session);
      return acc;
    }, {});

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];

      const effectiveDate = new Date(
        getNextDayOfWeekFromDate(monday, slot.details.date.date)
      );

      // Convert effectiveDate to YYYY-MM-DD format
      const targetDateString = effectiveDate.toISOString().split('T')[0];

      // Get relevant sessions for this date in O(1) time
      const usSessionForDate = sessionsByDate[targetDateString] || [];

      if (usSessionForDate.length === 0) {
        output.push({ slotId: slot.slotId, overlapped: false });
        continue;
      }

      const time = await this.userService.getDaylightSavingTimeUdpate(
        slot.details.time_range[hourStatus],
        new Date(monday)
      );

      // Reduce 5 min from start time for keeping time ready for the UK session
      const slotStartTime = adjustTime(time, -5)['24-hour'];

      // Add 60 min to slot start time (US SESSION DURATION === 60 MIN)
      const slotEndTime = adjustTime(slotStartTime, 60)['24-hour'];

      const startTime = moment(slotStartTime, 'HH:mm');
      const endTime = moment(slotEndTime, 'HH:mm');

      const overlapped = usSessionForDate.some((session) => {
        const sessionStartTime = moment(
          session.sessionScheduledTime,
          'hh:mm A'
        );
        const sessionEndTime = moment(
          session.sessionScheduledTime,
          'hh:mm A'
        ).add(session.length, 'minutes');

        // Check if the session start time is within the slot
        const startOverlaps =
          sessionStartTime.isSameOrAfter(startTime) &&
          sessionStartTime.isBefore(endTime);

        // Check if the session end time is within the slot
        const endOverlaps =
          sessionEndTime.isAfter(startTime) &&
          sessionEndTime.isSameOrBefore(endTime);

        return startOverlaps || endOverlaps;
      });

      output.push({ slotId: slot.slotId, overlapped });
    }

    return output;
  }
}
