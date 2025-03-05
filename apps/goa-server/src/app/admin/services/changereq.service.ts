import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { EmailService } from '../../email/email.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ChangeReqFiltersDto } from '../dtos';
import { ChangeReqDto } from '../dtos/changereq.dto';
import { CHANGE_REQUEST_STATUS, getTutorWorkingCountry } from '../../util';
import { UserService } from '../../user/service/user.service';
import { SlotsService } from '../../slots/slots.service';

@Injectable()
export class ChangereqService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
    private userService: UserService,
    private slotsService: SlotsService
  ) {}

  //Get Change Request List - Start __________________________________
  async getChangeReq(dto: ChangeReqFiltersDto) {
    const {
      take,
      skip,
      date,
      tutor_name,
      tutor_id,
      supervisor,
      hourType,
      approval_state,
      business_unit
    } = dto;

    const dateFrom = moment(date[0].datefrom).utc(true).toISOString();
    const dateTo = moment(date[0].dateto).utc(true).toISOString();

    try {
      const tutor_tsp_id = await this.prisma.tmApprovedStatus
        .findMany({
          where: {
            OR: [
              { tutorLine: business_unit ? { in: business_unit } : {} },
              { supervisorTspId: { in: supervisor } }
            ]
          },
          select: {
            tutorTspId: true
          }
        })
        .then((results) => results.map((r) => r.tutorTspId));

      const hourState = [];

      if (hourType.length > 0) {
        const ids = await this.userService.getTutorsForGivenHourStatus(
          date[0].dateto,
          hourType
        );
        hourState.push(...ids);
      }

      const whereClause = {
        AND: [
          {
            effective_date: {
              gte: dateFrom,
              lte: dateTo
            }
          },
          tutor_name.length > 0 ||
          tutor_id.length > 0 ||
          supervisor.length > 0 ||
          hourState.length > 0
            ? {
                tsp_id: {
                  in: [
                    ...tutor_name,
                    ...tutor_id,
                    ...tutor_tsp_id,
                    ...hourState
                  ]
                }
              }
            : undefined,

          approval_state.length > 0
            ? { checked_status: { in: approval_state } }
            : { checked_status: { notIn: 3 } },

          business_unit.length > 0
            ? { tsp_id: { in: tutor_tsp_id } }
            : undefined
        ].filter(Boolean)
      };

      const count = await this.prisma.gOAChangeRequests.count({
        where: whereClause
      });

      const requests = await this.prisma.gOAChangeRequests.findMany({
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
              slot_status_id: true,
              request_status: true
            }
          },
          user: {
            select: {
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
                  center: true
                }
              },
              GOATutorHourState: {
                select: {
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: dateTo
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
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      const data = requests.map((r) => {
        const hourStatus =
          r.user.GOATutorHourState[0] &&
          r.user.GOATutorHourState[0].GOATutorHourStateDetails[0]
            ? r.user.GOATutorHourState[0].GOATutorHourStateDetails[0].hour_state
                .name
            : '...';

        const country = r.user.tm_approved_status
          ? getTutorWorkingCountry(r.user.tm_approved_status.center)
          : '';

        const tutorType =
          r.user.tm_approved_status && r.user.tm_approved_status.tutorLine
            ? r.user.tm_approved_status.tutorLine === 'Primary'
              ? 'Primary'
              : 'Common'
            : 'Trainee';

        const { incr, decr } = r.change_request_details.reduce(
          (count, details) => {
            if (details.request_status !== 3) {
              if (details.slot_status_id === 6) {
                count.incr++;
              } else {
                count.decr++;
              }
            }
            return count;
          },
          { incr: 0, decr: 0 }
        );

        const startOfWeek = moment(r.effective_date).clone().startOf('week');
        const effectiveDate = startOfWeek
          .clone()
          .add(1, 'days')
          .utc(true)
          .format();

        return {
          id: r.id,
          tutorID: r.user.TslUser[0].tsl_id ? r.user.TslUser[0].tsl_id : '0000',
          tutorName: r.user.TslUser[0].tsl_full_name
            ? r.user.TslUser[0].tsl_full_name
            : '...',
          supervisor: r.user.tm_approved_status.supervisorName,
          businessUnit: tutorType,
          country: country,
          hourstatus: hourStatus,
          requestedDate: r.created_at,
          effectiveDate: effectiveDate,
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
      return error;
    }
  }
  //Get Change Request List - End __________________________________

  //Update Change Request List - Start __________________________________
  async updateChangeReq(dto: ChangeReqDto, user: any) {
    const { change_request_details } = dto;
    const begin = moment(change_request_details[0].effective_date)
      .isoWeekday(1)
      .startOf('week')
      .toISOString();
    const today: any = new Date();
    const changeReqId = change_request_details[0].changeReqID;
    const detailsForEmail = [];
    let isRejected = true;
    const adminEmail = process.env.ADMIN_EMAIL;

    try {
      const changeRequest = await this.prisma.gOAChangeRequests.findUnique({
        where: {
          id: changeReqId
        },
        select: {
          tsp_id: true,
          change_request_details: {
            where: {
              request_status: {
                notIn: [3]
              }
            },
            select: {
              id: true
            }
          },
          user: {
            select: {
              TslUser: {
                select: {
                  tsl_full_name: true
                }
              },
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              }
            }
          }
        }
      });

      if (
        changeRequest.change_request_details.length !==
        change_request_details.length
      )
        throw new Error('Need to action all the requests');

      await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const aprovedValues = [];
          for (const req of change_request_details) {
            await tx.gOAChangeRequestDetails.update({
              where: {
                id: req.rowID
              },
              data: {
                request_status: req.request_status,
                updated_at: today
              }
            });

            if (req.request_status === CHANGE_REQUEST_STATUS.Actioned) {
              aprovedValues.push({
                tutor_slot_id: req.tutor_time_slots_id,
                slot_id: req.slotId,
                slot_status_id: req.slotDataId,
                effective_date: begin,
                hour_status: '',
                created_at: today,
                created_by: user.user.tsp_id
              });
            }

            detailsForEmail.push({
              sessionDay:
                req.field.charAt(0).toUpperCase() + req.field.slice(1),
              sessionTime: req.time,
              sessionChange: req.slotDataId === 5 ? false : true,
              isApproved: req.request_status === 2 ? true : false
            });
          }

          console.log('detailsForEmaildetailsForEmail', detailsForEmail);

          await tx.gOAChangeRequests.update({
            where: {
              id: changeReqId
            },
            data: {
              checked_status:
                aprovedValues.length > 0
                  ? CHANGE_REQUEST_STATUS.Actioned
                  : CHANGE_REQUEST_STATUS.Rejected
            }
          });

          if (aprovedValues.length > 0) {
            isRejected = false;
            await tx.gOATutorSlotsDetails.createMany({
              data: aprovedValues
            });
          }
          // Sort detailsForEmail array by sessionDay
          detailsForEmail.sort((a, b) => {
            // Assuming sessionDay is a string in the format "Monday", "Tuesday", etc.
            const daysOrder = [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday'
            ];
            return (
              daysOrder.indexOf(a.sessionDay) - daysOrder.indexOf(b.sessionDay)
            );
          });
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 60000 // default: 5000
        }
      );

      const supevisoremail = await this.emailService.getSupervisorEmail(
        changeRequest.tsp_id
      );

      await this.emailService.TutorAvailabilityChangeRequestActionedService({
        subject: 'Test subject',
        email:
          changeRequest.user.approved_contact_data.workEmail === null || ''
            ? adminEmail
            : changeRequest.user.approved_contact_data.workEmail,
        supervisorBcc: [supevisoremail],
        tutorName: changeRequest.user.TslUser[0].tsl_full_name,
        date: moment().utc(true).format('DD.MM.YYYY'),
        rejectedReason: {
          isRejected: isRejected,
          reason: 'Test reason'
        },
        requests: detailsForEmail
      });

      return { success: true, message: 'Applied' };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  //Update Change Request List - End __________________________________

  //Get Change Request Details - Start __________________________________
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
                      effective_date: 'desc'
                      // id: 'desc'
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
  //Get Change Request Details - End __________________________________

  //  Get Tutor Name for filter suggestion - Start _______________________________
  async getTutorName(params: string) {
    const filter = params;

    const changerequests = await this.prisma.gOAChangeRequests.findMany({
      select: {
        tsp_id: true
      }
    });

    try {
      const users = await this.prisma.tslUser.findMany({
        where: {
          AND: {
            tsl_full_name: {
              contains: filter
            },
            tsp_id:
              changerequests.length > 0
                ? {
                    in: changerequests.map((e) => e.tsp_id)
                  }
                : {}
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
  //  Get Tutor Name for filter suggestion - End _______________________________

  //  Get Tutor ID for filter suggestion - Start __________________________________
  async getTutorID(filter: number) {
    try {
      const result = await this.prisma.$queryRaw`SELECT DISTINCT tsp_id, tsl_id 
      FROM tsl_user 
      WHERE tsp_id IN (
        SELECT tsp_id FROM goa_change_requests
      ) 
      AND tsl_id LIKE ${filter + '%'};`;

      const data = (result as unknown as any[]).map((key) => {
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
  //  Get Tutor ID for filter suggestion - End __________________________________

  //  Get Supervisor  for filter suggestion - Start ____________________________________
  async getSupervisor(params: string) {
    const filter = params;

    const changerequests = await this.prisma.gOAChangeRequests.findMany({
      select: {
        tsp_id: true
      }
    });

    try {
      const users = await this.prisma.tmApprovedStatus.findMany({
        where: {
          AND: {
            supervisorName: {
              contains: filter
            },
            tutorTspId:
              changerequests.length > 0
                ? {
                    in: changerequests.map((e) => e.tsp_id)
                  }
                : {}
          }
        },
        distinct: ['supervisorName'],
        select: {
          supervisorTspId: true,
          supervisorName: true
        }
      });

      const data = users.map((key) => {
        return {
          tspId: Number(key.supervisorTspId),
          name: key.supervisorName
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //  Get Tutor ID for filter suggestion - End __________________________________
}
