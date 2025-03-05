import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ChangeReqFiltersDto } from '../../dtos';
import { CHANGE_REQUEST_STATUS } from '../../../util';
import { SlotsService } from '../../../slots/slots.service';
import moment = require('moment');
import { UserService } from '../../../user/service/user.service';

@Injectable()
export class ChangerequestService {
  constructor(
    private prisma: PrismaService,
    private slotsService: SlotsService,
    private userService: UserService
  ) {}

  async getChangeRequestList(dto: ChangeReqFiltersDto, user: any) {
    const {
      take,
      skip,
      date,
      tutor_name,
      tutor_id,
      businessUnit,
      approvalStatus,
      hourType
    } = dto;
    try {
      // console.log('tutor_name.length ', tutor_name.length);
      // START - Data fetching to the function
      // const whereClause = {
      //   AND: [
      //     {
      //       user: {
      //         tm_approved_status: {
      //           supervisorTspId: Number(user.user.tsp_id),
      //           tutorLine: businessUnit.length > 0 ? { in: businessUnit } : {}
      //         },
      //         TslUser: {
      //           some: {
      //             tsl_id: tutor_id.length > 0 ? { in: tutor_id } : {},
      //             tsl_full_name: tutor_name.length > 0 ? { in: tutor_name } : {}
      //           }
      //         },
      //         GOATutorHourState:
      //           hourType.length > 0
      //             ? {
      //                 some: {
      //                   GOATutorHourStateDetails: {
      //                     some: {
      //                       effective_date: {
      //                         lte: date[0].datefrom
      //                       },
      //                       hour_state: {
      //                         name: { in: hourType }
      //                       }
      //                     }
      //                   }
      //                 }
      //               }
      //             : {}
      //       },
      //       effective_date: {
      //         gte: date[0].datefrom,
      //         lte: date[0].dateto
      //       },
      //       checked_status:
      //         approvalStatus.length > 0
      //           ? {
      //               in: approvalStatus.map((a) => CHANGE_REQUEST_STATUS[a])
      //             }
      //           : {}
      //     }
      //   ]
      // };

      const whereClause = {
        AND: [
          {
            user: {
              tm_approved_status: {
                supervisorTspId: Number(user.user.tsp_id),
                tutorLine: businessUnit.length > 0 ? { in: businessUnit } : {}
              },
              TslUser: {
                some: {
                  AND: [
                    { tsl_id: tutor_id.length > 0 ? { in: tutor_id } : {} },
                    {
                      tsl_full_name:
                        tutor_name.length > 0 ? { in: tutor_name } : {}
                    }
                  ]
                }
              },
              GOATutorHourState: {
                some: {
                  GOATutorHourStateDetails: {
                    some: {
                      AND: [
                        { effective_date: { lte: date[0].datefrom } },
                        { hour_state: { name: { in: hourType } } }
                      ]
                    }
                  }
                }
              }
            },
            effective_date: {
              gte: date[0].datefrom,
              lte: date[0].dateto
            },
            checked_status:
              approvalStatus.length > 0
                ? { in: approvalStatus.map((a) => CHANGE_REQUEST_STATUS[a]) }
                : {}
          }
        ]
      };

      const count = await this.prisma.gOAChangeRequests.count({
        where: whereClause
      });

      const changeRequests = await this.prisma.gOAChangeRequests.findMany({
        take,
        skip,
        where: whereClause,
        select: {
          id: true,
          tsp_id: true,
          reason: true,
          comment: true,
          checked_status: true,
          created_at: true,
          tsl_platform_update: true,
          effective_date: true,
          change_request_details: {
            select: {
              id: true,
              slot_status_id: true
            }
          },
          user: {
            select: {
              GOATutorHourState: {
                select: {
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: date[0].datefrom
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
              },
              TslUser: {
                select: {
                  tsl_full_name: true,
                  tsl_id: true
                }
              },
              tm_approved_status: {
                select: {
                  tutorLine: true,
                  supervisorName: true,
                  batch: true,
                  movementType: true,
                  center: true
                }
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });
      // END - Data fetching to the function

      const data = changeRequests.map((r) => {
        const hourStatus = r.user.GOATutorHourState[0]
          ? r.user.GOATutorHourState[0].GOATutorHourStateDetails[0].hour_state
              .name
          : '...';

        const tutorType =
          r.user.tm_approved_status && r.user.tm_approved_status.tutorLine
            ? r.user.tm_approved_status.tutorLine === 'Primary'
              ? 'Primary'
              : 'Common'
            : 'Trainee';

        const country =
          r.user.tm_approved_status &&
          r.user.tm_approved_status.center === 'TSG'
            ? 'Srilanka'
            : 'India' || '';

        const { incr, decr } = r.change_request_details.reduce(
          (count, details) => {
            if (details.slot_status_id === 6) {
              count.incr++;
            } else {
              count.decr++;
            }
            return count;
          },
          { incr: 0, decr: 0 }
        );

        return {
          id: r.id,
          tutorID: r.tsp_id,
          tutorName: r.user.TslUser[0].tsl_full_name
            ? r.user.TslUser[0].tsl_full_name
            : '...',
          supervisor: r.user.tm_approved_status.supervisorName,
          businessUnit: tutorType,
          country: country,
          hourstatus: hourStatus,
          requestedDate: r.created_at,
          effectiveDate: r.effective_date,
          changes: {
            incr,
            decr
          },
          reason: {
            reason: r.reason,
            comment: r.comment
          },
          impact: 'yes',
          tslContract: r.tsl_platform_update,
          approvalStatus: r.checked_status
        };
      });

      return { data, count };
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  async getChangeReqDetailsByReqId(id: number) {
    try {
      const changeReq = await this.prisma.gOAChangeRequests.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          effective_date: true,
          tsp_id: true,
          change_request_details: {
            where: {
              change_request_id: id,
              NOT: {
                request_status: 3 // remove canceled request (client cancelled)
              }
            }
          }
        }
      });

      const startOfWeek = moment(changeReq.effective_date)
        .clone()
        .startOf('week');
      const friday = startOfWeek.clone().add(5, 'days').utc(true).format();

      const slotsAvailableForTimePeriod =
        await this.slotsService.getActiveSlotsForEffectiveDate(friday);

      const timeRanges = await this.slotsService.getTimeSlotsFromGoaSlots(
        slotsAvailableForTimePeriod
      );

      const currentAvailability = await this.prisma.gOATutorsSlots.findFirst({
        where: {
          tsp_id: {
            equals: changeReq.tsp_id
          },
          effective_date: {
            lte: friday
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
                        lte: friday
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
              }
            }
          },
          GOATutorSlotsDetails: {
            where: {
              slot_id: {
                in: slotsAvailableForTimePeriod.map((slot) => slot.slotId)
              },
              effective_date: {
                lte: friday
              }
            },
            orderBy: [
              {
                // effective_date: 'asc' ***** keep *******
                // id: 'asc'
                effective_date: 'desc'
              }
            ],
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

      const slots = await Promise.all(
        timeRanges.map(async (timeSlot) => {
          const time = await this.userService.getExactSlotTimeRangeForHourState(
            timeSlot,
            currentAvailability.user.GOATutorHourState[0],
            friday
          );

          const slotsForTimeRange =
            await this.slotsService.getSlotsFromTimeSlot(timeSlot.id);

          let result = {};

          for (const slot of slotsForTimeRange) {
            const {
              id,
              date: { date: dayOfWeek }
            } = slot;

            const availabilityForSlot =
              currentAvailability.GOATutorSlotsDetails.find(
                (d) => d.slot_id === id
              );

            const req = changeReq.change_request_details.find(
              (e) => e.slot_id === id
            );
            const status = { 5: 'N', 6: 'Y' };

            result = {
              ...result,
              [dayOfWeek.toLowerCase()]: {
                id: req ? req.id : 0,
                changeReqID: req ? req.change_request_id : 0,
                tutorTimeSlotDataId: availabilityForSlot
                  ? availabilityForSlot.id
                  : 0,
                tutor_time_slots_id: currentAvailability.id,
                idslot: id,
                value: req
                  ? status[req.slot_status_id]
                  : availabilityForSlot
                  ? availabilityForSlot.slot_status.code
                  : 'N',
                slotDataId: req
                  ? req.slot_status_id
                  : availabilityForSlot
                  ? availabilityForSlot.slot_status.id
                  : 5,
                effective_date: req ? req.effective_date : '',
                changed: req ? true : false,
                request_status: req ? req.request_status : undefined
              }
            };
          }

          return { id: timeSlot.id, time, ...result };
        })
      );

      return { slots };
    } catch (error) {
      return error;
    }
  }

  async getTutorName(params: string, user: any) {
    const filter = params;

    try {
      const users = await this.prisma.tslUser.findMany({
        where: {
          AND: {
            tsl_full_name: {
              contains: filter
            },
            user: {
              tm_approved_status: {
                supervisorTspId: Number(user.user.tsp_id)
              }
            }
          }
        },
        distinct: ['tsl_full_name'],
        select: {
          tsp_id: true,
          tsl_full_name: true
        }
      });

      const data = users.map((key) => {
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

  async getTutorID(filter: number, userID: number) {
    try {
      const result = await this.prisma.tslUser.findMany({
        where: {
          AND: {
            user: {
              tm_approved_status: {
                supervisorTspId: { in: userID }
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
          name: Number(key.tsl_id) + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
