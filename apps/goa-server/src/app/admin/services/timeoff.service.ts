import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import moment from 'moment';
import { EmailService } from '../../email/email.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/service/user.service';
import {
  BulkActionDto,
  TimeoffApproveAllDto,
  TimeoffFiltersDto,
  TimeoffRejectAllDto,
  TimeOffReqUpdateDto
} from '../dtos';
import { TimeOffDto } from '../dtos/timeoff.dto';
import {
  CONTRY_ABBERVIATIONS,
  getHourStatusCode,
  getTutorWorkingCountry
} from '../../util';
import { SlotsService } from '../../slots/slots.service';

@Injectable()
export class TimeoffService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
    private userService: UserService,
    private slotsService: SlotsService
  ) {}

  // Gest  Time off List - Start _____________________________________
  async getTimeOffReq(dto: TimeoffFiltersDto) {
    const {
      date,
      take,
      skip,
      tutor_id,
      tutor_name,
      supervisor,
      businessUnit,
      hourType,
      approvalStatus,
      country
    } = dto;

    const dateFrom = moment(date[0].datefrom).utc(true).toISOString();
    const dateTo = moment(date[0].dateto).utc(true).toISOString();

    try {
      const tutor_tsp_id = await this.prisma.tmApprovedStatus
        .findMany({
          where: {
            OR: [
              { tutorLine: businessUnit ? { in: businessUnit } : {} },
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
          country && country.length > 0
            ? {
                user: {
                  tm_approved_status: {
                    center: { in: CONTRY_ABBERVIATIONS[country] }
                  }
                }
              }
            : undefined,

          approvalStatus.length > 0
            ? { status: { in: approvalStatus } }
            : undefined,

          businessUnit.length > 0 ? { tsp_id: { in: tutor_tsp_id } } : undefined
        ].filter(Boolean)
      };

      const count = await this.prisma.gOATimeOff.count({
        where: whereClause
      });

      const timeOffReq = await this.prisma.gOATimeOff.findMany({
        take,
        skip,
        where: whereClause,
        select: {
          id: true,
          status: true,
          tsp_id: true,
          reason: true,
          comment: true,
          type_of_leave: true,
          effective_date: true,
          penalty: true,
          created_at: true,
          timeoff_details: {
            select: {
              id: true,
              slot_status: true,
              req_status: true
            }
          },
          user: {
            select: {
              GOATutorHourState: {
                select: {
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: date[0].dateto
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
              tm_approved_status: {
                select: {
                  supervisorName: true,
                  batch: true,
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

      const laravelData = await this.prisma.tslUser.findMany({
        where: {
          tsp_id: {
            in: timeOffReq.map((e) => {
              return e.tsp_id;
            })
          }
        },
        select: {
          tsp_id: true,
          tsl_id: true,
          tsl_full_name: true
        }
      });

      const tmApprovedStatus = await this.prisma.tmApprovedStatus.findMany({
        where: {
          tutorTspId: {
            in: timeOffReq.map((key) => {
              return key.tsp_id;
            })
          }
        },
        select: {
          tutorLine: true,
          tutorTspId: true,
          supervisorName: true,
          batch: true
        }
      });

      const data = [];

      for (const timeOff of timeOffReq) {
        const country = timeOff.user.tm_approved_status
          ? getTutorWorkingCountry(timeOff.user.tm_approved_status.center)
          : '';

        const laravel = laravelData.find(
          (laravel) => Number(laravel.tsp_id) === timeOff.tsp_id
        );

        const approved = tmApprovedStatus.find(
          (approved) => Number(approved.tutorTspId) === timeOff.tsp_id
        );

        const hourStatus =
          timeOff.user.GOATutorHourState[0] &&
          timeOff.user.GOATutorHourState[0].GOATutorHourStateDetails[0]
            ? timeOff.user.GOATutorHourState[0].GOATutorHourStateDetails[0]
                .hour_state.name
            : '...';

        data.push({
          id: timeOff.id,
          tutorId: Number(laravel.tsl_id),
          tutorName: laravel.tsl_full_name,
          supervisor: approved.supervisorName,
          appliedDate: timeOff.created_at,
          timeOffDate: timeOff.effective_date,
          slotsCount: timeOff.timeoff_details.length,
          hourState: hourStatus,
          reason: {
            reason: timeOff.reason,
            comment: timeOff.comment
          },
          penalty: timeOff.penalty,
          approvalStatus: timeOff.status,
          country: country
        });
      }

      return { data, count };
    } catch (error) {
      return error;
    }
  }
  // Gest  Time off List - End _____________________________________

  //Export function - Start _____________________________________
  async getTimeOffForExport(dto: TimeoffFiltersDto) {
    const {
      date,
      take,
      skip,
      tutor_id,
      tutor_name,
      supervisor,
      businessUnit,
      hourType,
      approvalStatus,
      country
    } = dto;

    try {
      return await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const tutor_tsp_id = await tx.tmApprovedStatus
            .findMany({
              where: {
                OR: [
                  { tutorLine: businessUnit ? { in: businessUnit } : {} },
                  { supervisorTspId: { in: supervisor } }
                ]
              },
              select: {
                tutorTspId: true
              }
            })
            .then((results) => results.map((r) => r.tutorTspId));

          const whereClause = {
            AND: [
              {
                effective_date: {
                  gte: date[0].datefrom,
                  lte: date[0].dateto
                },
                OR: [
                  tutor_name.length > 0 ||
                  tutor_id.length > 0 ||
                  supervisor.length > 0
                    ? {
                        tsp_id: {
                          in: [...tutor_name, ...tutor_id, ...tutor_tsp_id]
                        }
                      }
                    : undefined,
                  hourType && hourType.length > 0
                    ? { hour_state: { in: hourType } }
                    : undefined,

                  approvalStatus.length > 0
                    ? { status: { in: approvalStatus } }
                    : undefined,

                  businessUnit.length > 0
                    ? { tsp_id: { in: tutor_tsp_id } }
                    : undefined
                ].filter(Boolean)
              }
            ]
          };

          const timeOffReq = await tx.gOATimeOff.findMany({
            take,
            skip,
            where: whereClause,
            select: {
              id: true,
              status: true,
              tsp_id: true,
              reason: true,
              comment: true,
              type_of_leave: true,
              effective_date: true,
              hour_state: true,
              penalty: true,
              created_at: true,
              timeoff_details: {
                select: {
                  id: true,
                  slot: {
                    select: {
                      time_range_id: true,
                      date: {
                        select: {
                          date: true
                        }
                      }
                    }
                  },
                  effective_date: true,
                  slot_status: true,
                  req_status: true
                }
              }
            },
            orderBy: {
              created_at: 'desc'
            }
          });

          const laravelData = await tx.tslUser.findMany({
            where: {
              tsp_id: {
                in: timeOffReq.map((e) => {
                  return e.tsp_id;
                })
              }
            },
            select: {
              tsp_id: true,
              tsl_id: true,
              tsl_full_name: true
            }
          });

          const tmApprovedStatus = await tx.tmApprovedStatus.findMany({
            where: {
              tutorTspId: {
                in: timeOffReq.map((key) => {
                  return key.tsp_id;
                })
              }
            },
            select: {
              tutorLine: true,
              tutorTspId: true,
              supervisorName: true,
              batch: true
            }
          });

          const countries = await tx.approvedContactData.findMany({
            where: {
              tspId: {
                in: timeOffReq.map((e) => {
                  return e.tsp_id;
                })
              }
            },
            select: {
              tspId: true,
              residingCountry: true
            }
          });

          const data = await Promise.all(
            timeOffReq.map(
              async ({
                tsp_id: tspId,
                timeoff_details,
                reason,
                comment,
                ...timeOff
              }) => {
                const laravel = laravelData.find(
                  ({ tsp_id }) => Number(tsp_id) === tspId
                );
                const approve = tmApprovedStatus.find(
                  ({ tutorTspId }) => Number(tutorTspId) === tspId
                );
                const { tsl_full_name } = laravel;
                const { supervisorName } = approve;
                const { residingCountry: country } = countries.find(
                  ({ tspId }) => tspId === tspId
                );

                return timeoff_details.flatMap(
                  ({
                    slot: { date, time_range_id },
                    req_status,
                    ...timeOffDetail
                  }) => ({
                    tspId,
                    tutorId: Number(laravel.tsl_id),
                    tsl_full_name,
                    supervisorName,
                    appliedDate: moment(timeOff.created_at + '').format(
                      'DD.MM.YYYY'
                    ),
                    timeOffDate: moment(timeOff.effective_date + '').format(
                      'DD.MM.YYYY'
                    ),
                    hourState: timeOff.hour_state,
                    reason: reason,
                    comment: comment,
                    penalty: timeOff.penalty,
                    approvalStatus: timeOff.status,
                    country,
                    day: date.date,
                    slot: time_range_id,
                    status: this.getTimeOffDetailStatus(req_status)
                  })
                );
              }
            )
          );

          const d = data.flat();
          return { data: d };
        }
      );
    } catch (error) {
      return error;
    }
  }
  //Export function - End _____________________________________

  //Admin TimeOffDetails Status - Start _____________________________________
  getTimeOffDetailStatus(id: number) {
    const statuses = [
      'Pending',
      'Rejected',
      'Approved',
      'Cancelled',
      'Actioned By CM',
      'Adhoc Pending',
      'Adhoc Approved',
      'Adhoc Rejected'
    ];
    return statuses[id];
  }
  //Admin TimeOffDetails Status - End _____________________________________

  //Admin TimeOffDetails - Start _____________________________________
  async getTimeOffReqDetails(id: number) {
    try {
      const timeOffReq = await this.prisma.gOATimeOff.findUnique({
        where: {
          id
        },
        select: {
          tsp_id: true,
          effective_date: true,
          timeoff_details: {
            where: {
              req_status: {
                notIn: [3, 7]
              }
            },
            select: {
              id: true,
              time_off_id: true,
              slot_id: true,
              slot_status_id: true,
              hour_status: true,
              effective_date: true,
              req_status: true,
              created_at: true,
              updated_at: true,
              penalty: true,
              reason: true,
              slot: {
                select: {
                  date: true
                }
              }
            }
          }
        }
      });

      const startOfWeek = moment(timeOffReq.effective_date)
        .clone()
        .startOf('week');
      const friday = startOfWeek.clone().add(5, 'days').utc(true).format();

      const dayOfTheWeek = timeOffReq.timeoff_details[0].slot.date.date;

      const slotsAvailableForTimePeriod =
        await this.slotsService.getActiveSlotsForDay(friday, dayOfTheWeek);

      const availability = await this.prisma.gOATutorsSlots.findFirst({
        where: {
          tsp_id: {
            equals: timeOffReq.tsp_id
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
            // orderBy: [
            //   {
            //     // effective_date: 'asc' ***** keep *******
            //     // id: 'asc'
            //     effective_date: 'desc'
            //   }
            // ],
            orderBy: [
              {
                effective_date: 'desc'
                // id: 'desc'
              },
              {
                id: 'desc'
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

      const result = await Promise.all(
        slotsAvailableForTimePeriod.map(async (slot) => {
          const timeSlot = await this.slotsService.timeRangeFromSlotId(
            slot.slotId
          );
          const time = await this.userService.getExactSlotTimeRangeForHourState(
            timeSlot,
            availability.user.GOATutorHourState[0],
            friday
          );

          const availabilityForSlot = availability.GOATutorSlotsDetails.find(
            (a) => a.slot_id === slot.slotId
          );

          const timeOffForSlot = timeOffReq.timeoff_details.find(
            (timeOff) => timeOff.slot_id == slot.slotId
          );

          const slotCode = availabilityForSlot
            ? availabilityForSlot.slot_status.code
            : 'N';

          return {
            id: slot.slotId,
            slot: timeSlot.id,
            time: time,
            availability: {
              changed: timeOffForSlot ? true : false,
              value: timeOffForSlot
                ? timeOffForSlot.req_status !== 3
                  ? 'TO'
                  : slotCode
                : slotCode,
              status: timeOffForSlot ? timeOffForSlot.req_status : null,
              timeOffId: timeOffForSlot ? timeOffForSlot.id : null
            }
          };
        })
      );

      return result.sort((a, b) => a.slot - b.slot);
    } catch (error) {
      return error;
    }
  }
  //Admin TimeOffDetails - End _____________________________________

  // Get Tutors HourStatus - Start _________________________________
  async getTutorsHourStatus(effectiveDate, tsp_id) {
    try {
      return await this.prisma.gOATutorHourState.findFirst({
        where: {
          tsp_id: tsp_id
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
  // Get Tutors HourStatus - End _________________________________

  //Admin approve all - Start _____________________________________
  async approveAllTimeOffReq(id: number, dto: TimeoffApproveAllDto, user: any) {
    try {
      const { timeOff, timeOffDetails } = await this.prisma.$transaction(
        async (tx) => {
          await tx.gOATimeOffDetails.updateMany({
            where: {
              time_off_id: id,
              req_status: dto.type === 0 ? 0 : 5
            },
            data: {
              penalty: dto.penalty,
              req_status: dto.type === 0 ? 2 : 6,
              updated_at: new Date().toISOString()
            }
          });

          await tx.gOATimeOff.updateMany({
            where: {
              id: id,
              status: dto.type === 0 ? 0 : 5
            },
            data: {
              penalty: dto.penalty,
              status: dto.type === 0 ? 2 : 6,
              updated_at: new Date().toISOString()
            }
          });

          const timeOffDetails = await tx.gOATimeOffDetails.findMany({
            where: {
              time_off_id: id,
              req_status: dto.type === 0 ? 2 : 6
            },
            select: {
              slot: {
                select: {
                  time_range: {
                    select: {
                      id: true,
                      hh_time: true,
                      oh_time: true
                    }
                  },
                  date: {
                    select: {
                      date: true
                    }
                  }
                }
              },
              slot_id: true,
              effective_date: true,
              slot_status_id: true,
              hour_status: true
            }
          });

          const timeOff = await tx.gOATimeOff.findUnique({
            where: {
              id: id
            }
          });

          return { timeOff, timeOffDetails };
        }
      );

      // array for emails
      const requests: any = [];

      // Update the time slots
      await Promise.all(
        timeOffDetails.map(async (timeOffDetail) => {
          const existingTimeSlot =
            await this.prisma.gOATutorSlotsDetails.findFirst({
              where: {
                slot_id: timeOffDetail.slot_id,
                tutor_time_slots: {
                  tsp_id: timeOff.tsp_id
                },
                effective_date: {
                  lte: timeOff.effective_date
                }
              },
              orderBy: {
                id: 'desc'
              }
            });

          const tutorTimeSlotsData: Prisma.GOATutorSlotsDetailsCreateManyInput[] =
            [
              {
                tutor_slot_id: existingTimeSlot.tutor_slot_id,
                slot_id: existingTimeSlot.slot_id,
                effective_date: moment
                  .utc(timeOffDetail.effective_date.toString())
                  .local()
                  .format(),
                slot_status_id: timeOffDetail.slot_status_id,
                hour_status: existingTimeSlot.hour_status,
                created_at: new Date(),
                created_by: user.user.tsp_id
              },
              {
                tutor_slot_id: existingTimeSlot.tutor_slot_id,
                slot_id: existingTimeSlot.slot_id,
                effective_date: moment
                  .utc(
                    this.getWeekDate(
                      timeOffDetail.slot.date.date.replace(/\d+/g, ''),
                      timeOffDetail.effective_date
                    )
                  )
                  .local()
                  .add(7, 'd')
                  .format(),
                slot_status_id: existingTimeSlot.slot_status_id,
                hour_status: existingTimeSlot.hour_status,
                created_at: new Date(),
                created_by: user.user.tsp_id
              }
            ];

          await this.prisma.gOATutorSlotsDetails.createMany({
            data: tutorTimeSlotsData
          });

          const initialTime =
            timeOffDetail.hour_status === 'HH'
              ? timeOffDetail.slot.time_range.hh_time
              : timeOffDetail.slot.time_range.oh_time;

          const time = await this.userService.getDaylightSavingTimeUdpate(
            initialTime,
            timeOffDetail.effective_date
          );

          requests.push({
            sessionTime: time,
            timeOffReason: timeOff.reason,
            status: 'Approved',
            isApproved: true
          });
        })
      );

      const userDetails = await this.prisma.user.findUnique({
        where: {
          tsp_id: timeOff.tsp_id
        },
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
      });
      const supevisoremail = await this.emailService.getSupervisorEmail(
        timeOff.tsp_id
      );

      if (dto.type === 0) {
        const adminEmail = process.env.ADMIN_EMAIL;
        await this.emailService.TutorTimeOffActionedService({
          subject: 'Test subject',
          email:
            userDetails.approved_contact_data.workEmail === null || ''
              ? adminEmail
              : userDetails.approved_contact_data.workEmail, // Add this email address for main deployement - capacitymanagement@thirdspaceglobal.com
          supervisorBcc: [supevisoremail],
          first_name: userDetails.TslUser[0].tsl_full_name,
          date: moment('' + timeOff.effective_date)
            .utc(true)
            .format('DD.MM.YYYY'),
          reason: {
            isReason: false,
            reasonDesc: ''
          },
          requests: requests
        });
      }

      return { success: true, timeOffDetails };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }
  //Admin approve all - End _____________________________________

  //Time Off Reject All - Start _____________________________________
  async rejectllTimeOffReq(id: number, dto: TimeoffRejectAllDto) {
    try {
      const { timeOff, timeOffDetails } = await this.prisma.$transaction(
        async (tx) => {
          await tx.gOATimeOffDetails.updateMany({
            where: {
              time_off_id: id,
              req_status: dto.type === 0 ? 0 : 5
            },
            data: {
              penalty: dto.rejectReason + ' : ' + dto.comment,
              req_status: dto.type === 0 ? 1 : 7,
              updated_at: new Date().toISOString()
            }
          });

          await tx.gOATimeOff.updateMany({
            where: {
              id: id,
              status: dto.type === 0 ? 0 : 5
            },
            data: {
              penalty:
                dto.comment === ''
                  ? dto.rejectReason
                  : dto.rejectReason + ' : ' + dto.comment,
              status: dto.type === 0 ? 1 : 7,
              updated_at: new Date().toISOString()
            }
          });

          const timeOffDetails = await tx.gOATimeOffDetails.findMany({
            where: {
              time_off_id: id
            },
            select: {
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
              slot_id: true,
              effective_date: true,
              slot_status: true,
              hour_status: true,
              penalty: true
            }
          });

          const timeOff = await tx.gOATimeOff.findUnique({
            where: {
              id: id
            }
          });

          return { timeOff, timeOffDetails };
        }
      );

      // array for emails
      const requests: any = [];
      await Promise.all(
        timeOffDetails.map(async (timeOffDetail) => {
          const initialTime =
            timeOffDetail.hour_status === 'HH'
              ? timeOffDetail.slot.time_range.hh_time
              : timeOffDetail.slot.time_range.oh_time;

          const time = await this.userService.getDaylightSavingTimeUdpate(
            initialTime,
            timeOffDetail.effective_date
          );

          requests.push({
            sessionTime: time,
            timeOffReason: timeOffDetail.penalty,
            status: 'Rejected',
            isApproved: false
          });
        })
      );

      const userDetails = await this.prisma.user.findUnique({
        where: {
          tsp_id: timeOff.tsp_id
        },
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
      });

      const supevisoremail = await this.emailService.getSupervisorEmail(
        timeOff.tsp_id
      );

      if (dto.type === 0) {
        const adminEmail = process.env.ADMIN_EMAIL;
        await this.emailService.TutorTimeOffActionedService({
          subject: 'Test subject',
          email:
            userDetails.approved_contact_data.workEmail === null || ''
              ? adminEmail
              : userDetails.approved_contact_data.workEmail,
          supervisorBcc: [supevisoremail],
          first_name: userDetails.TslUser[0].tsl_full_name,
          date: moment(timeOff.effective_date).utc(true).format('DD.MM.YYYY'),
          reason: {
            isReason: false,
            reasonDesc: ''
          },
          requests: requests
        });
      }
      return { success: true, timeOffDetails };
    } catch (error) {
      return { success: false, error };
    }
  }
  //Time Off Reject All - End _____________________________________

  //Admin Time OFF request Update - Start _____________________________________
  async timeOffReqUpdate(id: number, dto: TimeOffReqUpdateDto, user: any) {
    try {
      for (const detail of dto.details) {
        await this.prisma.gOATimeOffDetails.update({
          where: {
            id: detail.detailId
          },
          data: {
            req_status: detail.status,
            penalty:
              detail.status === 1 || detail.status === 7
                ? dto.penOrRej + ' : ' + dto.comment
                : dto.penOrRej,
            updated_at: new Date().toISOString()
          }
        });
      }

      await this.prisma.gOATimeOff.update({
        where: {
          id: id
        },
        data: {
          status: dto.type === 0 ? 2 : 6,
          penalty: dto.penOrRej,
          updated_at: new Date().toISOString()
        }
      });

      const timeOffDetails = await this.prisma.gOATimeOffDetails.findMany({
        where: {
          time_off_id: id
        },
        select: {
          req_status: true,
          penalty: true,
          updated_at: true,
          slot: {
            select: {
              time_range: {
                select: {
                  id: true,
                  hh_time: true,
                  oh_time: true
                }
              },
              date: {
                select: {
                  date: true
                }
              }
            }
          },
          slot_id: true,
          effective_date: true,
          slot_status_id: true,
          hour_status: true
        }
      });

      const timeOff = await this.prisma.gOATimeOff.findUnique({
        where: {
          id: id
        }
      });

      // array for emails
      const requests: any = [];

      // Update the time slots
      await Promise.all(
        timeOffDetails.map(async (timeOffDetail) => {
          if (timeOffDetail.req_status === 2) {
            const existingTimeSlot =
              await this.prisma.gOATutorSlotsDetails.findFirst({
                where: {
                  slot_id: timeOffDetail.slot_id,
                  tutor_time_slots: {
                    tsp_id: timeOff.tsp_id
                  },
                  effective_date: {
                    lte: timeOff.effective_date
                  }
                },
                // orderBy: {
                //   effective_date: 'desc'
                // }
                orderBy: [
                  {
                    effective_date: 'desc'
                    // id: 'desc'
                  },
                  {
                    id: 'desc'
                  }
                ]
              });

            const tutorTimeSlotsData: Prisma.GOATutorSlotsDetailsCreateManyInput[] =
              [
                {
                  // time off
                  tutor_slot_id: existingTimeSlot.tutor_slot_id,
                  slot_id: existingTimeSlot.slot_id,
                  effective_date: moment
                    .utc(timeOffDetail.effective_date.toString())
                    .local()
                    .format(),
                  slot_status_id: timeOffDetail.slot_status_id,
                  hour_status: existingTimeSlot.hour_status,
                  created_at: new Date(),
                  created_by: user.user.tsp_id
                },
                {
                  // existed slot status
                  tutor_slot_id: existingTimeSlot.tutor_slot_id,
                  slot_id: Number(existingTimeSlot.slot_id),
                  effective_date: moment
                    .utc(
                      this.getWeekDate(
                        timeOffDetail.slot.date.date.replace(/\d+/g, ''),
                        timeOffDetail.effective_date
                      )
                    )
                    .local()
                    .add(7, 'd')
                    .format(),
                  slot_status_id: existingTimeSlot.slot_status_id,
                  hour_status: existingTimeSlot.hour_status,
                  created_at: new Date(),
                  created_by: user.user.tsp_id
                }
              ];

            await this.prisma.gOATutorSlotsDetails.createMany({
              data: tutorTimeSlotsData
            });
          }

          const initialTime =
            timeOffDetail.hour_status === 'HH'
              ? timeOffDetail.slot.time_range.hh_time
              : timeOffDetail.slot.time_range.oh_time;

          const time = await this.userService.getDaylightSavingTimeUdpate(
            initialTime,
            timeOffDetail.effective_date
          );

          //
          requests.push({
            sessionTime: time,
            timeOffReason:
              timeOffDetail.req_status === 2
                ? timeOff.reason
                : timeOffDetail.penalty,
            status: timeOffDetail.req_status === 2 ? 'Approved' : 'Rejected',
            isApproved: timeOffDetail.req_status === 2 ? true : false
          });
        })
      );

      if (dto.type === 0) {
        const userDetails = await this.prisma.user.findUnique({
          where: {
            tsp_id: timeOff.tsp_id
          },
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
        });

        const supevisoremail = await this.emailService.getSupervisorEmail(
          timeOff.tsp_id
        );

        const adminEmail = process.env.ADMIN_EMAIL;
        await this.emailService.TutorTimeOffActionedService({
          subject: 'Test subject',
          email:
            userDetails.approved_contact_data.workEmail === null || ''
              ? adminEmail
              : userDetails.approved_contact_data.workEmail,
          supervisorBcc: [supevisoremail],
          first_name: userDetails.TslUser[0].tsl_full_name,
          date: moment(timeOff.effective_date).utc(true).format('DD.MM.YYYY'),
          reason: {
            isReason: false,
            reasonDesc: ''
          },
          requests: requests
        });
      }

      return { success: true, timeOffDetails };
    } catch (error) {
      console.log(error);

      return { success: false, error };
    }
  }
  //Admin Time OFF request Update - End _____________________________________

  //Bulk Action - Start _____________________________________
  async timeOffReqBulkAction(state: number, dto: BulkActionDto, user: any) {
    try {
      await Promise.all(
        dto.timeOffs.map(async (timeOff) => {
          if (state === 1) {
            // reject
            await this.rejectllTimeOffReq(timeOff.id, {
              rejectReason: dto.penOrRej,
              comment: dto.comment,
              type: timeOff.type
            });
          } else if (state === 2) {
            //approved
            await this.approveAllTimeOffReq(
              timeOff.id,
              {
                penalty: dto.penOrRej,
                type: timeOff.type
              },
              user
            );
          }
        })
      );
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
  //Bulk Action - End _____________________________________

  //Get Tutor Availability - Start _____________________________________
  async getTutorAvailability(userId: number, date: any) {
    try {
      const begin = moment(date).isoWeekday(1).startOf('week');
      const fromDate = begin.add(1, 'd').format(); // Monday
      const toDate = begin.add(5, 'd').format(); // Saturday or friday

      const slotsAvailableForTimePeriod =
        await this.slotsService.getActiveSlotsForEffectiveDate(toDate);

      const timeRanges = await this.slotsService.getTimeSlotsFromGoaSlots(
        slotsAvailableForTimePeriod
      );

      const currentAvailability = await this.prisma.gOATutorsSlots.findMany({
        where: {
          AND: {
            tsp_id: +userId,
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
            // orderBy: [
            //   {
            //     effective_date: 'desc'
            //     // id: 'desc'
            //   }
            // ],
            orderBy: [
              {
                effective_date: 'desc'
                // id: 'desc'
              },
              {
                id: 'desc'
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

      const timeOffDetails = await this.prisma.gOATimeOff.findMany({
        where: {
          AND: {
            tsp_id: {
              equals: +userId
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

      const hourStatusCode = getHourStatusCode(
        currentAvailability[0].user.GOATutorHourState
      );

      // get the booked session of the tutor from goa_tsl_booked_details table.
      const bookedSessions = await this.prisma.goaTslBookedDetails.findMany({
        where: {
          tspId: {
            equals: +userId
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

      const slots = await Promise.all(
        timeRanges.map(async (timeSlot) => {
          const time = await this.userService.getExactSlotTimeRangeForHourState(
            timeSlot,
            currentAvailability[0].user.GOATutorHourState[0],
            begin
          );

          let result = {};

          const filteredTimeOffDetails = timeOffDetails.flatMap(
            (obj) => obj.timeoff_details
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

            const availabilityForSlot =
              currentAvailability[0].GOATutorSlotsDetails.find(
                (d) => d.slot_id === id
              );

            // tutor's booked UK sessions from capaut table.
            /* const bookedSessions =
              currentAvailability[0]?.user?.GoaSessionsFuture ?? []; */

            // get the exact matching slot's booked record.
            const booked = bookedSessions?.find(
              (booked) => booked.goaSlotId === id && booked?.goaSlotId // checking goa slot ids are equal.
            );

            /* 
              if tutorPhase is 4 ---> PRIMARY session
              if tutorPhase is 5 ---> SECONDARY session
            */
            let bookedVal = '';
            if (booked?.tutorPhase === 4) {
              bookedVal = 'P';
            } else if (booked?.tutorPhase === 5) {
              bookedVal = 'S';
            }

            const slotCode = availabilityForSlot
              ? availabilityForSlot.slot_status.code
              : 'N';

            // finalize the status of the slots.
            const finalSlotCode =
              slotCode === 'TO'
                ? 'TO'
                : bookedVal !== ''
                ? bookedVal
                : slotCode;

            result = {
              ...result,
              [dayOfWeek.toLowerCase()]: {
                tutorTimeSlotDataId: currentAvailability[0].id,
                tutor_time_slots_id: currentAvailability[0].id,
                slotId: id,
                slotStatusId:
                  timeOffsForSlot.length > 0
                    ? 7
                    : availabilityForSlot
                    ? availabilityForSlot.slot_status_id
                    : 5,
                slotData: timeOffsForSlot.length > 0 ? 'TO' : finalSlotCode,
                hour_status: hourStatusCode,
                request: timeOffsForSlot.length > 0,
                hasBookedSessions:
                  bookedVal !== '' || slotCode === 'P' || slotCode === 'S' // this line checks bookedVal first, if it's empty then check the slotCode's value for another ensuring purpose.
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
  //Get Tutor Availability - End _____________________________________

  //Approver Subordinate Time Off - Start _____________________________________
  async approverSubordinate(details: TimeOffDto, user: any) {
    const {
      time_off_request_details,
      tutor_id,
      tutor_name,
      reason,
      comment,
      effective_date
    } = details;
    const timeOffs = [];
    const tutorSlotDetails = [];
    const emailedDetails = [];
    try {
      const today = new Date().toISOString();
      const friday = this.getWeekDate('friday', effective_date);
      const days = await this.prisma.gOADaysOFWeek.findMany();
      const tutorSlots = await this.prisma.gOATutorsSlots.findFirst({
        where: {
          tsp_id: tutor_id
        },
        select: {
          id: true,
          GOATutorSlotsDetails: {
            where: {
              slot_id: { in: time_off_request_details.map((d) => d.slotId) },
              effective_date: {
                lte: new Date(friday).toISOString()
              }
            },
            distinct: ['slot_id'],
            select: {
              slot_status_id: true,
              slot_id: true,
              slot: {
                select: {
                  date: {
                    select: {
                      date: true,
                      id: true
                    }
                  }
                }
              }
            },
            // orderBy: {
            //   // id: 'desc' // get the latest record
            //   effective_date: 'desc'
            // }
            orderBy: [
              {
                effective_date: 'desc'
                // id: 'desc'
              },
              {
                id: 'desc'
              }
            ]
          }
        }
      });

      for (const day of days) {
        const slotsForDay = await this.prisma.gOASlot.findMany({
          where: {
            date_id: day.id
          }
        });
        const slotIds = slotsForDay.map((slot) => slot.id);

        const timeOffsForDay = time_off_request_details.filter((d) =>
          slotIds.includes(d.slotId)
        );

        if (timeOffsForDay.length > 0) {
          const effectiveDateForDay = moment
            .utc(this.getWeekDate(day.date.toLowerCase(), effective_date))
            .local()
            .format();

          const timeOff = {
            tsp_id: tutor_id,
            reason: reason,
            comment: comment,
            effective_date: effectiveDateForDay,
            status: 4,
            leave_type_id: 1,
            email_status: true,
            hour_state: '',
            penalty: 'N/A',
            created_at: today,
            details: []
          };

          for (const detail of timeOffsForDay) {
            const slotDetails = tutorSlots.GOATutorSlotsDetails.find(
              (s) => s.slot_id === detail.slotId
            );

            const timeOffDetail = {
              slot_id: detail.slotId,
              slot_status_id: detail.slotStatusId,
              hour_status: '',
              effective_date: effectiveDateForDay,
              req_status: 4,
              reason: reason,
              comment: comment,
              created_at: today,
              updated_at: today
            };

            // Time off details adding to slots
            const approvedSlotDetails = {
              tutor_slot_id: tutorSlots.id,
              slot_id: detail.slotId,
              effective_date: effectiveDateForDay,
              slot_status_id: detail.slotStatusId,
              hour_status: '',
              created_at: today,
              created_by: user.user.tsp_id
            };

            const previousSlotDetails = {
              tutor_slot_id: tutorSlots.id,
              slot_id: detail.slotId,
              effective_date: moment
                .utc(effectiveDateForDay)
                .local()
                .add(7, 'd')
                .format(),
              slot_status_id: slotDetails.slot_status_id,
              hour_status: '',
              created_at: today,
              created_by: user.user.tsp_id
            };
            timeOff.details.push(timeOffDetail);
            tutorSlotDetails.push(approvedSlotDetails);
            tutorSlotDetails.push(previousSlotDetails);
          }

          timeOffs.push(timeOff);
          emailedDetails.push({
            date: moment(effectiveDateForDay)
              .utc(true)
              .format('DD.MM.YYYY dddd'),
            slots: slotIds.map((s, index) => {
              return {
                slotData: index + 1,
                isActive: timeOff.details.find((d) => d.slot_id === s)
                  ? true
                  : false
              };
            })
          });
        }
      }

      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        for (const timeoff of timeOffs) {
          await tx.gOATimeOff.create({
            data: {
              tsp_id: timeoff.tsp_id,
              reason: timeoff.reason,
              comment: timeoff.comment,
              effective_date: timeoff.effective_date,
              status: timeoff.status,
              leave_type_id: timeoff.leave_type_id,
              email_status: timeoff.email_status,
              hour_state: timeoff.hour_state,
              penalty: timeoff.penalty,
              created_at: timeoff.created_at,
              timeoff_details: {
                create: timeoff.details.map((detail) => ({
                  slot_id: detail.slot_id,
                  slot_status_id: detail.slot_status_id,
                  hour_status: detail.hour_status,
                  effective_date: detail.effective_date,
                  req_status: detail.req_status,
                  reason: detail.reason,
                  comment: detail.comment,
                  created_at: detail.created_at,
                  updated_at: detail.updated_at
                }))
              }
            }
          });
        }

        await tx.gOATutorSlotsDetails.createMany({
          data: tutorSlotDetails
        });
      });

      const userDetails = await this.prisma.user.findUnique({
        where: {
          tsp_id: tutor_id
        },
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
      });

      const supevisoremail = await this.emailService.getSupervisorEmail(
        tutor_id
      );

      const adminEmail = process.env.ADMIN_EMAIL;
      await this.emailService.TutorSubordinateTimeOffService({
        subject: 'Time-off Request Confirmation',
        email:
          userDetails.approved_contact_data.workEmail === null || ''
            ? adminEmail
            : userDetails.approved_contact_data.workEmail, // Add this email address for main deployement - capacitymanagement@thirdspaceglobal.com
        supervisorBcc: [supevisoremail],
        tutorName: userDetails.TslUser[0].tsl_full_name,
        requests: emailedDetails
      });

      return { success: true, message: 'Success Applied !!!' };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  //Approver Subordinate Time Off - End _____________________________________

  //  Get Tutor Name for filter suggestion - Start ___________________________________
  async getTutorName(params: string) {
    const filter = params;

    const timeOff = await this.prisma.gOATimeOff.findMany({
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
              timeOff.length > 0
                ? {
                    in: timeOff.map((e) => e.tsp_id)
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
  //  Get Tutor Name for filter suggestion - End ___________________________________

  //  Get Tutor ID for filter suggestion - Start __________________________________________
  async getTutorID(filter: number) {
    try {
      const result = await this.prisma.$queryRaw`SELECT DISTINCT tsp_id, tsl_id 
        FROM  tsl_user 
        WHERE tsp_id IN (
          SELECT tsp_id FROM goa_time_off
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
  //  Get Tutor ID for filter suggestion - End ___________________________________

  //  Get Supervisor  for filter suggestion - Start ____________________________________
  async getSupervisor(params: string) {
    const filter = params;

    const timeOff = await this.prisma.gOATimeOff.findMany({
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
              timeOff.length > 0
                ? {
                    in: timeOff.map((e) => e.tsp_id)
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
  //  Get Supervisor  for filter suggestion - End ____________________________________

  //  Get Business Unit  for filter suggestion - Start ____________________________________
  async getBusinessUnit() {
    const data = await this.prisma.tmApprovedStatus.findMany({
      distinct: ['tutorLine'],
      select: {
        tutorLine: true
      }
    });
    return data.map((d) => {
      return d.tutorLine;
    });
  }
  //  Get Business Unit  for filter suggestion - End ____________________________________

  //  Get Tsl Contracts  for filter suggestion - Start ____________________________________
  async getTslContracts(value: string) {
    // ************* keep this Code ********************
    // const data = await this.prisma
    //   .$queryRaw`SELECT hr_tsp_id,contact_no FROM laravel_master_directory_v2 WHERE contract_type = 'Tutor' AND  contact_no LIKE ${
    //   value + '%'
    // }`;

    return value;
  }
  //  Get Tsl Contracts  for filter suggestion - End ____________________________________

  //  Get getWeekDate - Start ____________________________________
  getWeekDate(field: string, date: any) {
    const begin = moment(date).isoWeekday(1).startOf('week');
    switch (field) {
      case 'monday':
        return begin.add(1, 'd').format('YYYY-MM-DD');
      case 'tuesday':
        return begin.add(2, 'd').format('YYYY-MM-DD');
      case 'wednesday':
        return begin.add(3, 'd').format('YYYY-MM-DD');
      case 'thursday':
        return begin.add(4, 'd').format('YYYY-MM-DD');
      case 'friday':
        return begin.add(5, 'd').format('YYYY-MM-DD');
      default:
        return date;
    }
  }
  //  Get getWeekDate - End ____________________________________
}
