import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { ChangeAvailabilityDto, FlagDto } from '../dtos/availability.dto';
import { TimeOffDto } from '../dtos/timeOff.dto';
import { EmailService } from '../../email/email.service';
import { CancelDto } from '../dtos/cancel.dto';
import { UserService } from '../../user/service/user.service';
import {
  compareDateIsDateBefor,
  EFFECTIVE_DAY_APPLICABLE_MOVEMENTS,
  getCountries,
  getHourStatusCode,
  getTheExactDate,
  getTutorWorkingCountry,
  getWeekDate,
  LAST_WORKING_DAY_APPLICABLE_MOVEMENTS
} from '../../util';
import { SlotsService } from '../../slots/slots.service';
import { CommonService } from '../../util/common.service';

interface TimeSlot {
  id: number;
  changed: boolean;
  comment: string;
  effective_date: string;
  field: string;
  hour_status: string;
  reason: string;
  rowId: number;
  slotId: number;
  slotStatusId: number;
  time: string;
  tutorTimeSlotDataId: number;
}

@Injectable()
export class AvailabilityService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
    private userService: UserService,
    private slotsService: SlotsService,
    private commonService: CommonService
  ) {}
  // update the availabilty changes (availability change request )
  async updateAvailability(dto: ChangeAvailabilityDto, user: any) {
    const { reason, comment, effective_date, change_request_details } = dto;

    const begin = moment(effective_date).locale('en-gb').startOf('week');

    const slotSummery = Object.values(change_request_details).reduce(
      (prev, curr) => {
        prev[curr['slotStatusId']] = prev[curr['slotStatusId']] + 1;
        return prev;
      },
      {
        5: 0,
        6: 0
      }
    );
    const today: any = new Date();

    try {
      const changeRequests = await this.prisma.gOAChangeRequests.create({
        data: {
          tsp_id: user.user.tsp_id,
          reason: reason,
          comment: comment,
          checked_status: 0,
          created_at: today,
          tsl_platform_update: false,
          hour_state: change_request_details[0].hour_status,
          effective_date: moment.utc(effective_date).local().format()
        },
        select: {
          id: true
        }
      });

      change_request_details.map(async (e: any) => {
        await this.prisma.gOAChangeRequestDetails.createMany({
          data: {
            change_request_id: changeRequests.id,
            slot_id: e.slotId,
            slot_status_id: e.slotStatusId,
            hour_status: e.hour_status,
            effective_date: moment(e.effective_date).utc(true).format(),
            request_status: 0,
            created_at: today
          }
        });
      });
      const userDetails = await this.prisma.tslUser.findFirst({
        where: {
          tsp_id: user.user.tsp_id
        }
      });

      const supevisoremail = await this.emailService.getSupervisorEmail(
        user.user.tsp_id
      );

      const adminEmail = process.env.ADMIN_EMAIL;
      const ccTutorManager = process.env.TUTOR_MANAGER_EMAIL;
      await this.emailService.AdminAvailabilityChangeRequestService({
        subject: 'Test subject',
        email: adminEmail,
        supervisorBcc: [supevisoremail], // Add this email address for main deployement - capacitymanagement@thirdspaceglobal.com
        ccEmails: [
          ccTutorManager !== 'NO_EMAIL' ? ccTutorManager : undefined
        ].filter(Boolean),
        tutorName: userDetails.tsl_full_name,
        tutorId: userDetails.tsl_id.toString(),
        currentAvailability: 35,
        effectiveDate: moment(begin).format('DD.MM.YYYY'),
        reasonForChange: reason,
        increasedSlots: slotSummery['6'].toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        }),
        decreasedSlots: slotSummery['5'].toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })
      });
      return { success: true, message: 'Applied' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //  add timeOff request
  async timeOff(dto: TimeOffDto, user: any) {
    const { time_off_details } = dto;
    const today = new Date().toISOString();
    const emailDetails = [];
    try {
      const groupedData = this.groupByField(time_off_details);
      const currentTime = moment();
      const elevenAM = moment().set({
        hour: 11,
        minute: 0,
        second: 0,
        millisecond: 0
      });

      if (currentTime.isSameOrAfter(elevenAM)) {
        time_off_details.map((details) => {
          if (today.split('T')[0] === details.effective_date) {
            throw new ForbiddenException('Deadline has exceded');
          }
        });
      }

      await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          for (const timeOff of groupedData) {
            const effectiveDate = new Date(
              timeOff[0].effective_date
            ).toISOString();

            const reason = timeOff[0].reason;

            const record = await tx.gOATimeOff.findFirst({
              where: {
                tsp_id: user.user.tsp_id,
                effective_date: effectiveDate,
                status: {
                  notIn: [1, 3]
                },
                timeoff_details: {
                  some: {
                    slot_id: { in: timeOff.map((t) => t.slotId) }
                  }
                }
              }
            });

            if (record) {
              throw new Error('Error existing time off found');
            }

            const hourState: any = await this.getHourStatusForEffectiveDate(
              effectiveDate,
              user.user.tsp_id
            );

            const leaveType = await tx.gOATypeOfLeave.findFirst({
              where: {
                type_of_leave: reason
              }
            });

            const timeOffDetails = [];
            for (const record of timeOff) {
              const detail = {
                slot_id: record.slotId,
                slot_status_id: record.slotStatusId,
                hour_status: hourState ? hourState.name : 'N/A',
                reason: record.reason,
                comment: record.comment,
                effective_date: effectiveDate,
                req_status: 0,
                created_at: today
              };
              timeOffDetails.push(detail);
            }

            const savedDetails = await tx.gOATimeOff.create({
              data: {
                tsp_id: user.user.tsp_id,
                reason: timeOff[0].reason,
                comment: timeOff[0].comment,
                effective_date: effectiveDate,
                status: 0,
                email_status: false,
                hour_state: hourState ? hourState.name : 'N/A',
                penalty: 'N/A',
                leave_type_id: leaveType.id,
                created_at: today,
                timeoff_details: {
                  createMany: {
                    data: timeOffDetails
                  }
                }
              },
              select: {
                timeoff_details: {
                  select: {
                    slot: {
                      select: {
                        time_range_id: true
                      }
                    }
                  }
                }
              }
            });

            emailDetails.push({ effectiveDate, ...savedDetails });
          }
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 60000 // default: 5000
        }
      );

      // Email Sending
      const timeSlotCount = await this.prisma.gOATimeRange.count();
      const supevisoremail = await this.emailService.getSupervisorEmail(
        user.user.tsp_id
      );
      const processed = emailDetails.map((details) => {
        const slotDetails = [];
        for (let i = 1; i <= timeSlotCount; i++) {
          slotDetails.push({
            slotData: i,
            isActive: details.timeoff_details.some(
              (td) => td.slot.time_range_id === i
            )
          });
        }
        return {
          date: moment(details.effectiveDate)
            .utc(true)
            .format('DD.MM.YYYY dddd'),
          slots: slotDetails
        };
      });

      //Get user Details
      const userDetails = await this.prisma.tslUser.findFirst({
        where: {
          tsp_id: user.user.tsp_id
        }
      });

      const adminEmail = process.env.ADMIN_EMAIL;
      await this.emailService.AdminTimeOffRequestService({
        subject: 'Test subject',
        email: adminEmail, // Add this email address for main deployement - capacitymanagement@thirdspaceglobal.com
        supervisorBcc: [supevisoremail],
        tutorName: userDetails.tsl_full_name,
        tutorId: userDetails.tsl_id.toString(),
        requests: processed
      });
      return { success: true, message: 'Applied' };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  // group data by the field
  groupByField(data: TimeSlot[]): TimeSlot[][] {
    const groupedData: { [key: string]: TimeSlot[] } = {};

    for (const slot of data) {
      const field = slot.effective_date;
      if (!groupedData[field]) {
        groupedData[field] = [];
      }
      groupedData[field].push(slot);
    }

    return Object.values(groupedData);
  }

  // get the hour status
  async getHourStatusForEffectiveDate(effectiveDate, tsp_id) {
    const hourStatus = await this.prisma.gOATutorHourState.findFirst({
      where: {
        tsp_id: tsp_id,
        GOATutorHourStateDetails: {
          some: {
            effective_date: {
              lte: effectiveDate
            }
          }
        }
      },
      select: {
        GOATutorHourStateDetails: {
          select: {
            hour_state: {
              select: {
                name: true,
                id: true
              }
            }
          },
          orderBy: {
            effective_date: 'desc'
          },
          take: 1
        }
      }
    });

    return hourStatus
      ? hourStatus.GOATutorHourStateDetails[0].hour_state
      : hourStatus;
  }

  // Availability with filter and pagination
  async getTutorAvailability(params: { filter: any; user: any }) {
    try {
      const { filter, user } = params;
      const today = new Date(filter);

      const begin = moment(today).isoWeekday(1).startOf('week');
      const fromDate = begin.add(1, 'd').format(); // Monday
      const toDate = begin.add(5, 'd').format(); // Saturday or friday

      const slotsAvailableForTimePeriod =
        await this.slotsService.getActiveSlotsForEffectiveDate(toDate);

      const timeRanges = await this.slotsService.getTimeSlotsFromGoaSlots(
        slotsAvailableForTimePeriod
      );

      // Get availability of tutor
      const currentAvailability = await this.prisma.gOATutorsSlots.findMany({
        where: {
          AND: {
            tsp_id: {
              equals: +user.user.tsp_id
            },
            effective_date: {
              lte: toDate
            }
          }
        },
        orderBy: [
          {
            effective_date: 'desc'
          }
        ],
        take: 1,
        select: {
          id: true,
          user: {
            select: {
              GOATutorHourState: {
                select: {
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: toDate
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
              GoaSessionsFuture: {
                where: {
                  date: {
                    gte: moment(fromDate).format('YYYY-MM-DD'),
                    lte: toDate
                  }
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
          },
          GOATutorSlotsDetails: {
            where: {
              slot_id: {
                in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
              },
              effective_date: {
                lte: toDate
              }
            },
            orderBy: [
              { effective_date: 'desc' },
              {
                id: 'desc'
              }
            ],
            distinct: ['slot_id'],
            select: {
              id: true,
              tutor_slot_id: true,
              slot_id: true,
              slot_status_id: true,
              slot: {
                select: {
                  id: true,
                  time_range_id: true,
                  date_id: true,
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
          }
        }
      });

      // get the booked session of the tutor from goa_tsl_booked_details table.
      const bookedSessions = await this.prisma.goaTslBookedDetails.findMany({
        where: {
          tspId: {
            equals: Number(user.user.tsp_id)
          },
          sessionDate: {
            gte: fromDate,
            lte: toDate
          },
          status: 6
        },
        select: {
          tspId: true,
          sessionDate: true,
          goaSlotId: true,
          tutorPhase: true
        }
      });

      // Get time off of tutor
      const timeOffDetails = await this.prisma.gOATimeOff.findMany({
        where: {
          AND: {
            tsp_id: {
              equals: Number(user.user.tsp_id)
            },
            status: 0
          }
        },
        select: {
          timeoff_details: {
            where: {
              slot_id: {
                in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
              },
              effective_date: {
                gte: fromDate,
                lte: toDate
              },
              req_status: 0
            },
            orderBy: [
              {
                effective_date: 'asc'
              }
            ],
            select: {
              slot_id: true,
              req_status: true
            }
          }
        }
      });

      // get pending change request details
      const changeRequestDetails = await this.prisma.gOAChangeRequests.findMany(
        {
          where: {
            AND: {
              tsp_id: {
                equals: Number(user.user.tsp_id)
              },
              checked_status: 0
            }
          },
          select: {
            change_request_details: {
              where: {
                slot_id: {
                  in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
                },
                effective_date: {
                  gte: fromDate,
                  lte: toDate
                },
                request_status: 0
              },
              orderBy: [
                {
                  effective_date: 'asc'
                }
              ],
              select: {
                slot_id: true,
                request_status: true
              }
            }
          }
        }
      );

      const hourStatusCode = getHourStatusCode(
        currentAvailability[0].user.GOATutorHourState
      );

      const slots = await Promise.all(
        timeRanges.map(async (timeSlot) => {
          const time = await this.userService.getExactSlotTimeRangeForHourState(
            timeSlot,
            currentAvailability[0].user.GOATutorHourState[0],
            begin
          );

          const result = {};

          const filteredTimeOffDetails = timeOffDetails.flatMap(
            (obj) => obj.timeoff_details
          );

          const filteredchangeRequestDetails = changeRequestDetails.flatMap(
            (obj) => obj.change_request_details
          );

          const slotsForTimeRange =
            await this.slotsService.getSlotsFromTimeSlot(timeSlot.id);

          for (const slot of slotsForTimeRange) {
            const {
              id,
              date: { date: dayOfWeek }
            } = slot;

            const timeOffsForSlot = filteredTimeOffDetails.filter(
              (innerObj) => innerObj.slot_id === id
            );

            const changeRequestsForSlot = filteredchangeRequestDetails.filter(
              (innerObj) => innerObj.slot_id === id
            );

            const availabilityForSlot =
              currentAvailability[0].GOATutorSlotsDetails.find(
                (d) => d.slot_id === id
              );

            // get the exact matching slot's booked record.
            const booked = bookedSessions?.find(
              (booked) => booked.goaSlotId === id && booked?.goaSlotId // checking goa slot ids are equal.
            );

            const slotStatusCode =
              timeOffsForSlot.length > 0
                ? 7
                : availabilityForSlot
                ? availabilityForSlot.slot_status_id
                : 5;

            result[dayOfWeek.toLowerCase()] = {
              tutorTimeSlotDataId: currentAvailability[0].id,
              slotId: id,
              slotStatusId: slotStatusCode,
              hour_status: hourStatusCode,
              changed: false,
              disabled:
                timeOffsForSlot.length > 0 || availabilityForSlot
                  ? availabilityForSlot.slot_status_id === 7
                  : false,
              request: timeOffsForSlot.length > 0,
              change_request: changeRequestsForSlot.length > 0,
              hasBookedSessions:
                booked !== undefined ||
                slotStatusCode === 11 ||
                slotStatusCode === 12
            };
          }

          return { id: timeSlot.id, time, ...result };
        })
      );
      return { slots };
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  // Daily Session Tracker
  async getDailySession(params: { filter: any; user: any }) {
    try {
      const { filter, user } = params;

      const today = new Date(filter);

      const begin = moment(today).isoWeekday(1).startOf('week');
      const fromDate = begin.add(1, 'd').format(); // Monday
      const toDate = begin.add(5, 'd').format(); // Saturday or friday

      const counties = { TSG: 'SL', 'TSG-IND': 'IND' };
      const RateCode = {
        0: 'AVL',
        1: 'SES_DE',
        2: 'SES_AD_SEC',
        3: 'STAT_ALW'
      };

      const slotsAvailableForTimePeriod =
        await this.slotsService.getActiveSlotsForEffectiveDate(toDate);

      const timeRange = await this.slotsService.getTimeSlotsFromGoaSlots(
        slotsAvailableForTimePeriod
      );

      // get current availability
      const currentAvailability = await this.prisma.gOATutorsSlots.findMany({
        where: {
          AND: {
            tsp_id: {
              equals: Number(user.user.tsp_id)
            },

            effective_date: {
              lte: toDate
            }
          }
        },
        orderBy: [
          {
            effective_date: 'desc'
          }
        ],
        take: 1,
        select: {
          id: true,
          user: {
            select: {
              GOATutorHourState: {
                select: {
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: toDate
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
              tm_master_tb: {
                // get all approved movements for the current tutor which before and qual to today date.
                where: {
                  movementStatus: 'Approved',
                  effectiveDate: {
                    lte: toDate
                  }
                },
                orderBy: [
                  {
                    effectiveDate: 'desc'
                  },
                  {
                    id: 'desc'
                  }
                ],
                select: {
                  id: true,
                  tutorTspId: true,
                  movementType: true,
                  effectiveDate: true,
                  returnDate: true
                }
              }
            }
          },
          GOATutorSlotsDetails: {
            where: {
              slot_id: {
                in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
              },
              effective_date: {
                lte: toDate
              }
            },
            orderBy: [
              { effective_date: 'desc' },
              {
                id: 'desc'
              }
            ],
            distinct: ['slot_id'],
            select: {
              id: true,
              tutor_slot_id: true,
              slot_id: true,
              slot_status_id: true,
              slot: {
                select: {
                  id: true,
                  time_range_id: true,
                  date_id: true,
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
          }
        }
      });

      const tutorLastMovement = currentAvailability[0]?.user?.tm_master_tb; // get the tutor movement list separately.
      const onlyFirstTwoMovments =
        tutorLastMovement.length >= 1 && tutorLastMovement.slice(0, 2); // get last 2 movements of the tutor.

      let currentMovementDate, previousMovementDate; // initialize the current and previous movement dates.

      const currentMovementType = [
        ...LAST_WORKING_DAY_APPLICABLE_MOVEMENTS,
        ...EFFECTIVE_DAY_APPLICABLE_MOVEMENTS
      ].includes(onlyFirstTwoMovments[0].movementType); // check current element's movement type included in the array of movement list

      const previousMovementType = [
        ...LAST_WORKING_DAY_APPLICABLE_MOVEMENTS,
        ...EFFECTIVE_DAY_APPLICABLE_MOVEMENTS
      ].includes(onlyFirstTwoMovments[1].movementType); // check previous element's movement type included in the array of movement list

      let movementDate; // exact movement date. If it's last working date, then this will be increased by 1. If not, just the same effective date will be assigned.

      // if current movement type is included in the list of movements, then return the exact effective date after checking the movements lists. ---> Last working or Effective date.
      // if previous movement type is includd in the list of movements, then return the exact effective date after checking the movements lists. ---> Last working or Effective date.
      if (currentMovementType) {
        movementDate = this.returnMovementDate(
          onlyFirstTwoMovments[0].movementType,
          onlyFirstTwoMovments[0].effectiveDate
        );
        currentMovementDate = movementDate;
      } else if (previousMovementType) {
        movementDate = this.returnMovementDate(
          onlyFirstTwoMovments[1].movementType,
          onlyFirstTwoMovments[1].effectiveDate
        );
        currentMovementDate = moment(
          onlyFirstTwoMovments[0].effectiveDate
        ).format('YYYY-MM-DD');
        previousMovementDate = movementDate;
      }

      // get timeOff details (pending and adhock)
      const timeOffDetails = await this.prisma.gOATimeOff.findMany({
        where: {
          AND: {
            tsp_id: {
              equals: +user.user.tsp_id
            },
            status: {
              in: [0, 6]
            }
          }
        },
        select: {
          timeoff_details: {
            where: {
              slot_id: {
                in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
              },
              effective_date: {
                gte: fromDate,
                lte: toDate
              },
              req_status: {
                in: [0, 6]
              }
            },
            orderBy: [
              {
                effective_date: 'asc'
              }
            ],
            select: {
              slot_id: true,
              req_status: true
            }
          }
        }
      });

      // Get Flag details for user
      const flagDetails = await this.prisma.gOASessionFlags.findMany({
        where: {
          AND: {
            slot_id: {
              in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
            },
            tsp_id: {
              equals: Number(user.user.tsp_id)
            },
            date: {
              gte: fromDate,
              lte: toDate
            },
            status: { in: [0, 5] }
          }
        },
        orderBy: [
          {
            date: 'asc'
          }
        ],
        select: {
          id: true,
          slot_id: true,
          status: true,
          concern: true,
          description: true
        }
      });

      // get launched sessions
      // const launchedSessions = await this.prisma.gOALaunchedSessions.findMany({
      //   where: {
      //     slot_id: {
      //       in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
      //     },
      //     effective_date: {
      //       gte: fromDate,
      //       lte: toDate
      //     },
      //     tsp_id: {
      //       equals: Number(user.user.tsp_id)
      //     }
      //   },
      //   orderBy: [
      //     {
      //       effective_date: 'asc'
      //     }
      //   ],
      //   select: {
      //     slot_id: true,
      //     slot_status_id: true,
      //     effective_date: true
      //   }
      // });
      // get launched sessions
      const launchedSessions = await this.prisma.goaTslLaunchedDetails.findMany(
        {
          where: {
            goaSlotId: {
              in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
            },
            sessionDate: {
              gte: new Date(fromDate),
              lte: new Date(toDate)
            },
            tspId: {
              equals: Number(user.user.tsp_id)
            }
          },
          orderBy: [
            {
              sessionDate: 'asc'
            }
          ],
          select: {
            goaSlotId: true,
            tutorPhase: true, // 4 - Primary, 5 -Secondary
            sessionDate: true
          }
        }
      );

      // get tmApproved Status
      const tmApprovedStatus = await this.prisma.tmApprovedStatus.findUnique({
        where: {
          tutorTspId: user.user.tsp_id
        },
        select: {
          center: true
        }
      });

      // Academic calender details
      const AcademicCalendar = await this.prisma.calendar.findMany({
        where: {
          effective_date: {
            gte: fromDate,
            lte: toDate
          },
          holidays_type_id: {
            notIn: [5, 7]
          },
          country: {
            equals: getCountries(
              tmApprovedStatus ? tmApprovedStatus.center : 'TSG'
            )
          }
        },
        select: {
          id: true,
          holidays_type_id: true,
          effective_date: true,
          description: true
        }
      });

      const hourStatusCode = getHourStatusCode(
        currentAvailability[0].user.GOATutorHourState
      );

      // // booked sessions
      // const bookedSessions = await this.prisma.goaSessionsFuture.findMany({
      //   where: {
      //     date: {
      //       gte: moment(fromDate).format('YYYY-MM-DD'),
      //       lte: toDate
      //     },
      //     tspId: {
      //       equals: Number(user.user.tsp_id)
      //     },
      //     statusId: 1
      //   },
      //   select: {
      //     sessionId: true,
      //     sessionType: true,
      //     goaSlotId: true,
      //     tspId: true
      //   }
      // });
      // booked sessions
      const bookedSessions = await this.prisma.goaTslBookedDetails.findMany({
        where: {
          sessionDate: {
            gte: new Date(fromDate),
            lte: new Date(toDate)
          },
          tspId: {
            equals: Number(user.user.tsp_id)
          },
          status: {
            equals: 6
          }
        },
        select: {
          sessionId: true,
          tutorPhaseGoaMetaData: {
            select: {
              value: true // Primary, Secondary
            }
          },
          goaSlotId: true,
          tspId: true
        }
      });
      // get tutot slots
      const slots = await Promise.all(
        timeRange.map(async (timeSlot) => {
          const time = await this.userService.getExactSlotTimeRangeForHourState(
            timeSlot,
            currentAvailability[0].user.GOATutorHourState[0],
            begin
          );

          const result = {};

          const filteredTimeOffDetails = timeOffDetails.flatMap(
            (obj) => obj.timeoff_details
          );

          const slotsForTimeRange =
            await this.slotsService.getSlotsFromTimeSlot(timeSlot.id);

          // console.log('slotsForTimeRange:' + JSON.stringify(slotsForTimeRange));

          for (const slot of slotsForTimeRange) {
            const {
              id,
              date: { date: dayOfWeek },
              time_range_id
            } = slot;

            const availabilityForSlot =
              currentAvailability[0].GOATutorSlotsDetails.find(
                (d) => d.slot_id === id
              );

            const timeOffsForSlot = filteredTimeOffDetails.filter(
              (innerObj) => innerObj.slot_id === id && innerObj.req_status == 0
            );

            const adhocTimeOffsForSlot = filteredTimeOffDetails.filter(
              (innerObj) => innerObj.slot_id === id && innerObj.req_status == 6
            );

            const launchedSessionsForSlot = launchedSessions.filter(
              (innerObj) => innerObj.goaSlotId === id
            );

            const flagsForSlot = flagDetails.filter(
              (innerObj) => innerObj.slot_id === id
            );

            //Change here 1
            const paymentRateForDay = await this.userService.getPaymentRates(
              user.user.tsp_id,
              moment(getWeekDate(dayOfWeek, fromDate)).add(1, 'day').format(),
              counties[tmApprovedStatus.center]
            );

            // console.log(
            //   'paymentRateForDay: ' + JSON.stringify(paymentRateForDay)
            // );
            // get the booked slots according to the correct slot id.
            const bookedSlots = bookedSessions.filter(
              (innerObj) => innerObj.goaSlotId === id
            );

            // slot status id for the booked slots. if it's primary status will be 1, if it's secondary status will be 2 and otherwise empty string.
            const bookedSessionType =
              bookedSlots.length > 0
                ? bookedSlots[0]?.tutorPhaseGoaMetaData.value.toUpperCase() ===
                  'PRIMARY'
                  ? 1
                  : bookedSlots[0]?.tutorPhaseGoaMetaData.value.toUpperCase() ===
                    'SECONDARY'
                  ? 2
                  : [1, 2, 3, 4].includes(availabilityForSlot.slot_status_id) // when booking table doent have the above value, it checks statuses 1,2,3, or 4. If the status value matches the above mentioned values, that will return 0. Because 0 will consider as Available.
                  ? 0
                  : availabilityForSlot.slot_status_id
                : null; // N - No / Reject
            // availabilityForSlot.slot_status_id;
            // console.log('ID:' + id);

            const tutorCenter = counties[tmApprovedStatus.center];

            // console.log(
            //   'paymentRateForDay:' + JSON.stringify(paymentRateForDay)
            // );

            // const Obj: any = {
            //   launchedSessionsForSlot: launchedSessionsForSlot,
            //   tutorCenter: tutorCenter,
            //   paymentRate: paymentRateForDay,
            //   academicCalendar: AcademicCalendar,
            //   fromDate: fromDate,
            //   timeRangeId: time_range_id
            // };

            // const amount2 =
            //   await this.commonService.calculateInvoiceTotalAmount(Obj);

            // console.log('amount2:' + amount2);

            const correctDate = getTheExactDate(fromDate, slot?.date?.date); // get the current session date in the week according to the day.
            const correctSessionDate = moment(correctDate).format('YYYY-MM-DD'); // format the date to YYYY-MM-DD

            result[dayOfWeek.toLowerCase()] = {
              tutorTimeSlotDataId: currentAvailability[0].id,
              slotId: id,
              slotStatusId: AcademicCalendar.some(
                (item) =>
                  moment(item.effective_date).format('YYYY-MM-DD') ===
                    getWeekDate(dayOfWeek, fromDate) &&
                  [2, 8].includes(item.holidays_type_id)
              )
                ? null
                : currentMovementType &&
                  currentMovementDate <= correctSessionDate
                ? null // if its the current movement, checks the current movement date is less than or equal to the current session date. If yes then pass NULL.
                : previousMovementType &&
                  previousMovementDate <= correctSessionDate &&
                  currentMovementDate > correctSessionDate
                ? null // if its the previous movement, checks the previous movement date is less than or equal to the current session date and current movement date is less than current session date. If yes then pass NULL. WHEN NULL PASSED, THAT CHIP WON'T SHOW IN THE TUTOR VIEW.
                : launchedSessionsForSlot.length > 0
                ? launchedSessionsForSlot[0].tutorPhase
                : timeOffsForSlot.length > 0
                ? 7
                : availabilityForSlot &&
                  availabilityForSlot.slot_status_id === 7
                ? availabilityForSlot.slot_status_id
                : bookedSlots.length > 0
                ? bookedSessionType
                : availabilityForSlot &&
                  availabilityForSlot.slot_status_id === 11
                ? 1
                : availabilityForSlot &&
                  availabilityForSlot.slot_status_id === 12
                ? 2
                : availabilityForSlot
                ? availabilityForSlot.slot_status_id
                : null,
              hasBookedSession:
                launchedSessionsForSlot.length <= 0 &&
                (bookedSlots.length > 0 ||
                  (availabilityForSlot &&
                    availabilityForSlot.slot_status_id === 11) ||
                  (availabilityForSlot &&
                    availabilityForSlot.slot_status_id === 12)), // if tutor has booked slots, this will become true, otherwise false.
              amount: await this.commonService.calculateInvoiceTotalAmount({
                launchedSessionsForSlot: launchedSessionsForSlot,
                tutorCenter: tutorCenter,
                paymentRate: paymentRateForDay,
                academicCalendar: AcademicCalendar,
                fromDate: fromDate,
                timeRangeId: time_range_id
              }),
              amount1:
                launchedSessionsForSlot.length > 0
                  ? (counties[tmApprovedStatus.center] === 'SL'
                      ? 'LKR'
                      : 'INR') +
                    ' ' +
                    (paymentRateForDay
                      ? AcademicCalendar.some(
                          // If this is a holiday, not pay
                          (item) =>
                            moment(item.effective_date).format('YYYY-MM-DD') ===
                              moment(
                                launchedSessionsForSlot[0].sessionDate
                              ).format('YYYY-MM-DD') &&
                            [2, 8].includes(item.holidays_type_id)
                        )
                        ? 0
                        : await (async () => {
                            let totalAmount = 0;

                            for (const entry of paymentRateForDay) {
                              // Date preparation and comparison logic
                              const date2 = moment('2024-09-01 00:00:00');
                              const date1 = moment(fromDate);

                              (await compareDateIsDateBefor(date1, date2))
                                ? (() => {
                                    // Primary session status checks
                                    const isStatus1Or3 =
                                      [4].includes(
                                        //1, 3
                                        launchedSessionsForSlot[0].tutorPhase
                                      ) &&
                                      (entry.rate_code === RateCode[0] ||
                                        entry.rate_code === RateCode[1] ||
                                        AcademicCalendar.some(
                                          (item) =>
                                            moment(item.effective_date).format(
                                              'YYYY-MM-DD'
                                            ) ===
                                              moment(
                                                launchedSessionsForSlot[0]
                                                  .sessionDate
                                              ).format('YYYY-MM-DD') &&
                                            entry.rate_code === RateCode[3] &&
                                            [1].includes(item.holidays_type_id)
                                        ));

                                    //Secondary session status checks
                                    const isStatus2Or4 =
                                      [5].includes(
                                        //2, 4
                                        launchedSessionsForSlot[0].tutorPhase
                                      ) &&
                                      (entry.rate_code === RateCode[0] ||
                                        entry.rate_code === RateCode[1] ||
                                        entry.rate_code === RateCode[2] ||
                                        AcademicCalendar.some(
                                          (item) =>
                                            moment(item.effective_date).format(
                                              'YYYY-MM-DD'
                                            ) ===
                                              moment(
                                                launchedSessionsForSlot[0]
                                                  .sessionDate
                                              ).format('YYYY-MM-DD') &&
                                            entry.rate_code === RateCode[3] &&
                                            [1].includes(item.holidays_type_id)
                                        ));

                                    return (totalAmount +=
                                      isStatus1Or3 || isStatus2Or4
                                        ? entry.amount
                                        : 0);
                                  })()
                                : (() => {
                                    // Primary session status checks
                                    const isStatus1Or3 =
                                      [4].includes(
                                        launchedSessionsForSlot[0].tutorPhase
                                      ) &&
                                      (entry.rate_code === 'AVL_AFT' ||
                                        entry.rate_code === 'AVL_EVE' ||
                                        entry.rate_code === RateCode[1] ||
                                        AcademicCalendar.some(
                                          (item) =>
                                            moment(item.effective_date).format(
                                              'YYYY-MM-DD'
                                            ) ===
                                              moment(
                                                launchedSessionsForSlot[0]
                                                  .sessionDate
                                              ).format('YYYY-MM-DD') &&
                                            entry.rate_code === RateCode[3] &&
                                            [1].includes(item.holidays_type_id)
                                        ));

                                    //Secondary session status checks
                                    const isStatus2Or4 =
                                      [5].includes(
                                        launchedSessionsForSlot[0].tutorPhase
                                      ) &&
                                      (entry.rate_code === 'AVL_AFT' ||
                                        entry.rate_code === 'AVL_EVE' ||
                                        entry.rate_code === RateCode[1] ||
                                        entry.rate_code === RateCode[2] ||
                                        AcademicCalendar.some(
                                          (item) =>
                                            moment(item.effective_date).format(
                                              'YYYY-MM-DD'
                                            ) ===
                                              moment(
                                                launchedSessionsForSlot[0]
                                                  .sessionDate
                                              ).format('YYYY-MM-DD') &&
                                            entry.rate_code === RateCode[3] &&
                                            [1].includes(item.holidays_type_id)
                                        ));

                                    // Availability checks for afternoon and evening
                                    const isAvlAft = [1, 2, 3, 4].includes(
                                      time_range_id
                                    ); // Availability Afternoon
                                    const isAvlEve = [5, 6, 7, 8].includes(
                                      time_range_id
                                    ); // Availability Evening

                                    if (isStatus1Or3 || isStatus2Or4) {
                                      if (
                                        entry.rate_code === 'AVL_AFT' &&
                                        isAvlAft
                                      ) {
                                        totalAmount += entry.amount;
                                      } else if (
                                        entry.rate_code == 'AVL_EVE' &&
                                        isAvlEve
                                      ) {
                                        totalAmount += entry.amount;
                                      } else if (
                                        entry.rate_code !== 'AVL_EVE' &&
                                        entry.rate_code !== 'AVL_AFT'
                                      ) {
                                        totalAmount += entry.amount;
                                      }

                                      console.log(
                                        'totalAmount: ' + totalAmount
                                      );
                                    }
                                  })();
                            }

                            return totalAmount;
                          })()
                      : 0)
                  : (counties[tmApprovedStatus.center] === 'SL'
                      ? ' LKR'
                      : ' INR') +
                    ' ' +
                    (paymentRateForDay
                      ? await (async () => {
                          // Date preparation
                          const date2 = moment('2024-09-01 00:00:00');
                          const date1 = moment(fromDate);

                          // Compare the dateFrom with the 2024-09-01 00:00:00 date - this will excecute old logic
                          if (await compareDateIsDateBefor(date1, date2)) {
                            return paymentRateForDay.find(
                              (entry) => entry.rate_code === RateCode[0]
                            ).amount;
                          } else {
                            // for 3 availability -
                            const isAvlAft = [1, 2, 3, 4].includes(
                              time_range_id
                            ); //Availability Afternoon
                            const isAvlEve = [5, 6, 7, 8].includes(
                              time_range_id
                            ); //Availability Evening

                            // console.log('TRUE ' + isAvlAft);
                            if (isAvlAft) {
                              // console.log(
                              //   'TRUE ' +
                              //     isAvlAft +
                              //     paymentRateForDay.find(
                              //       (entry) => entry.rate_code === 'AVL_AFT'
                              //     ).amount
                              // );
                              return paymentRateForDay.find(
                                (entry) => entry.rate_code === 'AVL_AFT'
                              ).amount;
                            } else {
                              return paymentRateForDay.find(
                                (entry) => entry.rate_code === 'AVL_EVE'
                              ).amount;
                            }
                          }
                        })()
                      : 0),
              launchedSessions: launchedSessionsForSlot.length > 0,
              hour_status: hourStatusCode,
              changed: false,
              disabled:
                timeOffsForSlot.length > 0 || availabilityForSlot
                  ? availabilityForSlot.slot_status_id === 7
                  : false,
              request: timeOffsForSlot.length > 0,
              flag: flagsForSlot.length > 0,
              Adhoc: adhocTimeOffsForSlot.length > 0,
              flagStatus: flagsForSlot.length > 0 ? flagsForSlot[0].status : 0,
              flagConcern:
                flagsForSlot.length > 0 ? flagsForSlot[0].concern : '',
              flagDescription:
                flagsForSlot.length > 0 ? flagsForSlot[0].description : ''
            };
          }

          return {
            id: timeSlot.id,
            time,
            ...result
          };
        })
      );

      return {
        slots,
        AcademicCalendar: AcademicCalendar ? AcademicCalendar : []
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // return the calculated exact date according to the movement type.
  returnMovementDate = (movementType, date) => {
    if (LAST_WORKING_DAY_APPLICABLE_MOVEMENTS.includes(movementType)) {
      date = moment(date).add(1, 'day');
    } else if (EFFECTIVE_DAY_APPLICABLE_MOVEMENTS.includes(movementType)) {
      date = moment(date);
    }
    return moment(date).format('YYYY-MM-DD');
  };

  // get calendar
  async getCalendar(params: { filter: any; user: any }) {
    const { filter, user } = params;
    const today: any = new Date();
    const startYear = moment(filter).startOf('year').format();
    const endYear = moment(filter).endOf('year').format();

    try {
      const countries = await this.prisma.approvedContactData.findMany({
        where: {
          tspId: {
            in: Number(user.user.tsp_id)
          }
        },
        select: {
          tspId: true,
          residingCountry: true
        }
      });

      // eslint-disable-next-line no-inner-declarations
      function getCountries(countries: any) {
        switch (countries) {
          case 'indian':
            return 'indian';
          case 'SL':
            return 'srilankan';
          default:
            return 'srilankan';
        }
      }
      // get holidays
      const holidays = await this.prisma.calendar.findMany({
        where: {
          effective_date: {
            gte: startYear,
            lte: endYear
          },
          country: { equals: getCountries(countries[0].residingCountry) }
        },
        select: {
          holidays_type_id: true,
          country: true,
          effective_date: true,
          description: true
        }
      });

      return { success: true, data: holidays };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // get history table details
  async getHistory(params: {
    skip?: number;
    take?: number;
    filter: any;
    user: any;
  }) {
    try {
      const { skip, take, user, filter } = params;
      const { approvalStatus, request_Type, date, slot_number } =
        JSON.parse(filter);

      const startDate = date.startDate
        ? moment(date.startDate).utc(true).toISOString()
        : undefined;
      const endDate = date.endDate
        ? moment(date.endDate).utc(true).toISOString()
        : undefined;

      // add here filter options
      const filterObject = {
        slot: {
          time_range: { id: {} }
        }
      };
      if (slot_number && slot_number.length > 0) {
        filterObject.slot.time_range.id = { in: slot_number };
      }

      const changeRequests = await this.prisma.gOAChangeRequests.findMany({
        where: {
          tsp_id: {
            equals: Number(user.user.tsp_id)
          }
        },
        select: {
          id: true
        }
      });
      const changeRequestsDetails =
        await this.prisma.gOAChangeRequestDetails.findMany({
          where: {
            AND: [
              {
                change_request_id: { in: changeRequests.map((v) => v.id) },
                effective_date: {
                  gte: startDate,
                  lte: endDate
                },
                OR: [
                  approvalStatus.length > 0
                    ? { request_status: { in: approvalStatus } }
                    : undefined
                ].filter(Boolean)
              },
              filterObject
            ]
          },
          orderBy: [
            {
              effective_date: 'desc'
            }
          ],
          select: {
            id: true,
            change_request_id: true,
            effective_date: true,
            created_at: true,
            request_status: true,
            slot_status: true,
            slot_id: true,
            slot: {
              select: {
                time_range: {
                  select: {
                    id: true,
                    hh_time: true,
                    oh_time: true
                  }
                }
              }
            },
            change_request: {
              select: {
                comment: true,
                reason: true
              }
            }
          }
        });

      const availability = [];

      for (const changeReqDetail of changeRequestsDetails) {
        const effDate = new Date(changeReqDetail.effective_date);

        const hourState: any = await this.getTutorsHourStatus(effDate, user);

        const time = await this.userService.getExactSlotTimeRangeForHourState(
          changeReqDetail.slot.time_range,
          hourState,
          effDate
        );

        availability.push({
          id: changeReqDetail.change_request_id,
          rowID: changeReqDetail.id,
          type: 'availability',
          slot_id: changeReqDetail.slot.time_range.id,
          time: time,
          status: changeReqDetail.request_status,
          slot_status: changeReqDetail.slot_status,
          effective_date: changeReqDetail.effective_date,
          reason: changeReqDetail.change_request.reason,
          comment: changeReqDetail.change_request.comment,
          penalty: 'N/A',
          created_at: changeReqDetail.created_at,
          hour_status:
            hourState && hourState.GOATutorHourStateDetails[0]
              ? hourState.GOATutorHourStateDetails[0]
              : '...',
          document_uri: null,
          sessionFlagComments: null
        });
      }

      const timeOff = await this.prisma.gOATimeOff.findMany({
        where: {
          tsp_id: {
            equals: Number(user.user.tsp_id)
          }
        },
        select: {
          id: true
        }
      });
      const timeOffDetails = await this.prisma.gOATimeOffDetails.findMany({
        where: {
          AND: [
            {
              time_off_id: { in: timeOff.map((v) => v.id) },
              effective_date: {
                gte: startDate,
                lte: endDate
              },
              OR: [
                approvalStatus.length > 0
                  ? { req_status: { in: approvalStatus } }
                  : undefined
              ].filter(Boolean)
            },
            filterObject
          ]
        },
        orderBy: [
          {
            effective_date: 'desc'
          }
        ],
        select: {
          id: true,
          time_off_id: true,
          effective_date: true,
          created_at: true,
          req_status: true,
          slot_status: true,
          slot_id: true,
          comment: true,
          reason: true,
          cancel_comment: true,
          cancel_reason: true,
          penalty: true,
          slot: {
            select: {
              time_range: {
                select: {
                  id: true,
                  hh_time: true,
                  oh_time: true
                }
              }
            }
          },
          time_off: {
            select: {
              comment: true,
              reason: true
            }
          }
        }
      });
      const timeoffmap = [];

      for (const timeOffDetail of timeOffDetails) {
        const effDate = new Date(timeOffDetail.effective_date);

        const hourState: any = await this.getTutorsHourStatus(effDate, user);

        const time = await this.userService.getExactSlotTimeRangeForHourState(
          timeOffDetail.slot.time_range,
          hourState,
          effDate
        );

        timeoffmap.push({
          id: timeOffDetail.time_off_id,
          rowID: timeOffDetail.id,
          type: timeOffDetail.req_status === 6 ? 'Adhoc Time Off' : 'Time Off',
          slot_id: timeOffDetail.slot.time_range.id,
          status: timeOffDetail.req_status,
          time: time,
          slot_status: timeOffDetail.slot_status,
          effective_date: timeOffDetail.effective_date,
          reason: timeOffDetail.reason,
          comment: timeOffDetail.comment,
          cancelReason: timeOffDetail.cancel_reason,
          cancelComment: timeOffDetail.cancel_comment,
          penalty: timeOffDetail.penalty,
          created_at: timeOffDetail.created_at,
          hour_status:
            hourState && hourState.GOATutorHourStateDetails[0]
              ? hourState.GOATutorHourStateDetails[0]
              : '...',
          document_uri: null,
          sessionFlagComments: null
        });
      }

      const flags = await this.prisma.gOASessionFlags.findMany({
        where: {
          AND: [
            {
              tsp_id: { equals: Number(user.user.tsp_id) },
              date: {
                gte: startDate,
                lte: endDate
              },
              OR: [
                approvalStatus.length > 0
                  ? { status: { in: approvalStatus } }
                  : undefined
              ].filter(Boolean)
            },
            filterObject
          ]
        },
        orderBy: [
          {
            id: 'desc'
          }
        ],
        select: {
          id: true,
          date: true,
          created_at: true,
          status: true,
          slot_id: true,
          slot: {
            select: {
              time_range: {
                select: {
                  id: true,
                  hh_time: true,
                  oh_time: true
                }
              }
            }
          },
          GOASessionFlagStatus: {
            select: {
              status: true,
              reason: true,
              comment: true,
              created_at: true
            },
            orderBy: [
              { created_at: 'desc' }, // Order by created_at descending order
              { id: 'desc' }
            ],
            take: 1 // get order 1
          },
          slot_status: true,
          concern: true,
          description: true,
          document_uri: true
        }
      });

      const flagsmap = [];

      for (const flag of flags) {
        const effDate = new Date(flag.date);

        const hourState: any = await this.getTutorsHourStatus(effDate, user);

        const time = await this.userService.getExactSlotTimeRangeForHourState(
          flag.slot.time_range,
          hourState,
          effDate
        );

        flagsmap.push({
          id: flag.id,
          rowID: flag.id,
          type: 'Concern',
          slot_id: flag.slot.time_range.id,
          status: flag.status,
          slot_status: flag.slot_status,
          time: time,
          effective_date: flag.date,
          reason: flag.concern,
          comment: flag.description,
          penalty: '-',
          created_at: flag.created_at,
          hour_status:
            hourState && hourState.GOATutorHourStateDetails[0]
              ? hourState.GOATutorHourStateDetails[0]
              : '...',
          document_uri: flag.document_uri,
          sessionFlagComments: flag.GOASessionFlagStatus
        });
      }

      const histories =
        request_Type !== ''
          ? request_Type === 'All'
            ? [...timeoffmap, ...availability, ...flagsmap]
            : request_Type === 'Time Off'
            ? [...timeoffmap]
            : request_Type === 'Availability Change'
            ? [...availability]
            : request_Type === 'Concern'
            ? [...flagsmap]
            : []
          : [...timeoffmap, ...availability, ...flagsmap];

      const result = histories
        .sort((a: any, b: any) => b.created_at - a.created_at)
        .map((value, index) => {
          return {
            id: index + 1,
            tableId: value.id,
            rowID: value.rowID,
            type: value.type,
            slot_id: value.slot_id,
            status: value.status,
            time: value.time,
            slot_status: value.slot_status,
            effective_date: value.effective_date,
            reason: value.reason,
            comment: value.comment,
            cancelReason: value.cancelReason ? value.cancelReason : '',
            cancelComment: value.cancelComment ? value.cancelComment : '',
            penalty: value.penalty,
            guidlineBreach: 'N/A',
            created_at: value.created_at,
            hour_status: value.hour_status,
            document_uri: value.document_uri,
            sessionFlagComments: value.sessionFlagComments
          };
        });

      const data = result.slice(skip, +take + +skip);
      return { success: true, count: result.length, data: data };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  // timeOff cancelation
  async CancelRequest(dto: CancelDto, user: any) {
    const { cancel_request_details, comment, reason } = dto;

    const result = cancel_request_details.reduce((acc, obj) => {
      const key = obj['type'];
      const curGroup = acc[key] ?? [];
      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
    try {
      const today: any = new Date();

      await Promise.all(
        Object.entries(result).map(async ([key, value]: any) => {
          if (key === 'Time Off') {
            const requests: any = [];
            value.map(async (v: any) => {
              requests.push({
                sessionDate: moment(v.effective_date)
                  .utc(true)
                  .format('DD.MM.YYYY'),
                sessionTime: v.time,
                cancellationReason: reason
              });

              await this.prisma.gOATimeOffDetails.update({
                where: {
                  id: v.rowID
                },
                data: {
                  req_status: 3,
                  cancel_reason: reason,
                  cancel_comment: comment
                }
              });

              const timeOffDetails =
                await this.prisma.gOATimeOffDetails.findMany({
                  where: {
                    AND: {
                      time_off_id: v.tableId,
                      req_status: 0
                    }
                  }
                });

              if (timeOffDetails.length === 0) {
                await this.prisma.gOATimeOff.update({
                  where: {
                    id: v.tableId
                  },
                  data: { status: 3 }
                });
              }
            });

            const supevisoremail = await this.emailService.getSupervisorEmail(
              user.user.tsp_id
            );

            const userDetails = await this.prisma.tslUser.findFirst({
              where: {
                tsp_id: user.user.tsp_id
              }
            });

            const adminEmail = process.env.ADMIN_EMAIL;
            await this.emailService.AdminTimeOffCancellationService({
              subject: 'Test subject',
              email: adminEmail, // Add this email address for main deployement - capacitymanagement@thirdspaceglobal.com
              supervisorBcc: [supevisoremail],
              tutorName: userDetails.tsl_full_name,
              tutorId: userDetails.tsl_id.toString(),
              requests: requests
            });
          } else if (key === 'Concern') {
            value.map(async (v: any) => {
              await this.prisma.gOASessionFlags.update({
                where: {
                  id: v.rowID
                },
                data: {
                  status: 3,
                  GOASessionFlagStatus: {
                    create: {
                      status: 3,
                      comment: comment,
                      reason: reason,
                      created_at: new Date().toISOString(),
                      created_by: user.user.tsp_id
                    }
                  }
                }
              });
            });
          } else {
            value.map(async (v: any) => {
              await this.prisma.gOAChangeRequestDetails.update({
                where: {
                  id: v.rowID
                },
                data: { request_status: 3 }
              });

              const changeRequestDetails =
                await this.prisma.gOAChangeRequestDetails.findMany({
                  where: {
                    AND: {
                      change_request_id: v.tableId,
                      request_status: 0
                    }
                  }
                });

              if (changeRequestDetails.length === 0) {
                await this.prisma.gOAChangeRequests.update({
                  where: {
                    id: v.tableId
                  },
                  data: { checked_status: 3 }
                });
              }

              let increased = 0;
              let decreased = 0;

              if (v.slot_status === 6) {
                increased++;
              } else {
                decreased++;
              }

              const supevisoremail = await this.emailService.getSupervisorEmail(
                user.user.tsp_id
              );

              const userDetails = await this.prisma.tslUser.findFirst({
                where: {
                  tsp_id: user.user.tsp_id
                }
              });
              const adminEmail = process.env.ADMIN_EMAIL;
              await this.emailService.TutorAvailabilityChangeRequestCancellationService(
                {
                  subject: 'Cancelled Change Request',
                  email: adminEmail,
                  supervisorBcc: [supevisoremail],
                  tutorName: userDetails.tsl_full_name,
                  tutorId: userDetails.tsl_id.toString(),
                  appliedDate: moment(today).utc(true).format('DD.MM.YYYY'),
                  effectiveDate: moment(v.effective_date)
                    .utc(true)
                    .format('DD.MM.YYYY'),
                  reasonForChange: v.reason,
                  increasedSlots: parseInt(
                    increased.toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                      useGrouping: false
                    }),
                    10
                  ),
                  decreasedSlots: parseInt(
                    decreased.toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                      useGrouping: false
                    }),
                    10
                  ),
                  cancellationReason: reason === 'Other' ? comment : reason
                }
              );
            });
          }
        })
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // get tutor hours status
  async getTutorsHourStatus(effectiveDate, user) {
    try {
      return await this.prisma.gOATutorHourState.findFirst({
        where: {
          tsp_id: user.user.tsp_id
        },
        select: {
          GOATutorHourStateDetails: {
            where: {
              effective_date: {
                lte: effectiveDate
              }
            },
            orderBy: {
              effective_date: 'desc'
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
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // flag slot
  async flagSlot(dto: FlagDto, user: any) {
    const {
      date,
      slot_id,
      slot_status_id,
      hour_status,
      satutary,
      concern,
      description,
      document_url
    } = dto;

    try {
      const hourstatus = await this.prisma.gOAHourState.findFirst({
        where: {
          name: {
            equals: hour_status
          }
        },
        select: {
          id: true
        }
      });

      const result = await this.prisma.gOASessionFlags.create({
        data: {
          tsp_id: user.user.tsp_id,
          date: new Date(date).toISOString(),
          slot_id: slot_id,
          slot_status_id: slot_status_id,
          concern: concern,
          description: description,
          status: 0,
          document_uri: document_url,
          satutary: satutary,
          hour_state_id: hourstatus?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          GOASessionFlagStatus: {
            create: {
              reason: concern,
              comment: description,
              status: 0,
              created_at: new Date().toISOString(),
              created_by: user.user.tsp_id
            }
          }
        },
        select: {
          id: true
        }
      });

      return { success: true, message: 'Applied' };
    } catch (error) {
      console.log(error);

      return { success: false, error: error.message };
    }
  }

  async getAccessForFunctions() {
    return null;
  }
  // get academic calender
  async getAcademicCalendar(params: { filter: any; user: any }) {
    const { filter, user } = params;

    const todayDate = moment(filter);
    const academicStartYear = moment(todayDate)
      .subtract(todayDate.month() < 7 ? 1 : 0, 'year')
      .month(7)
      .date(1)
      .utc(true)
      .toISOString();

    const academicEndYear = moment(todayDate)
      .add(todayDate.month() >= 7 ? 1 : 0, 'year')
      .month(6)
      .date(31)
      .utc(true)
      .toISOString();

    try {
      const countries = await this.prisma.tmApprovedStatus.findFirst({
        where: {
          tutorTspId: Number(user.user.tsp_id)
        },
        select: {
          center: true
        }
      });

      // eslint-disable-next-line no-inner-declarations
      function getCountries(countries: any) {
        switch (countries) {
          case 'TSG-IND':
            return 'indian';
          case 'TSG':
            return 'srilankan';
          default:
            return 'srilankan';
        }
      }

      const [holidaysData, holidayTypes] = await Promise.all([
        this.prisma.calendar.findMany({
          where: {
            effective_date: {
              gte: academicStartYear,
              lte: academicEndYear
            },
            holidays_type_id: {
              notIn: [5, 7]
            },
            country: {
              equals: getCountries(countries ? countries.center : 'TSG')
            }
          },
          select: {
            id: true,
            holidays_type_id: true,
            effective_date: true,
            description: true
          }
        }),
        this.prisma.holidaysType.findMany({
          where: {
            id: {
              notIn: [5, 7]
            }
          }
        })
      ]);

      const typesMap = new Map(
        holidayTypes.map((h) => [
          h.id,
          { id: h.id, name: h.holiday_type, color: h.color_code }
        ])
      );

      const holidays = holidaysData.map((data) => {
        const type = typesMap.get(data.holidays_type_id);
        return {
          id: data.id,
          calendarType: 1,
          type: type ? type.id : null,
          title: data.description,
          description: data.description,
          begin: data.effective_date,
          end: data.effective_date
        };
      });

      return {
        success: true,
        data: { holidays, types: Array.from(typesMap.values()) }
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  // get tutoring country
  async getTutoringCountry(user: any) {
    const tutorId = user.user.user.tsp_id;

    const country = await this.prisma.tmApprovedStatus.findFirst({
      where: {
        tutorTspId: tutorId
      },
      select: {
        center: true
      }
    });

    const contry =
      country.center !== null
        ? getTutorWorkingCountry(country.center)
        : 'Srilanka';

    return { country: contry };
  }
}
