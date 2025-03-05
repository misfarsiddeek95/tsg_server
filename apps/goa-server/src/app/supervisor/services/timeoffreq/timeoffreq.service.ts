import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from '../../../email/email.service';
import { SlackService } from '../../../slack/slack/slack.service';
import { TimeOffDto, TimeofffiltersDto } from '../../dtos';

@Injectable()
export class TimeoffreqService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly slackService: SlackService
  ) {}

  async getTimeOffRequests(dto: TimeofffiltersDto, user: any) {
    const {
      date,
      take,
      skip,
      tutor_id,
      tutor_name,
      businessUnit,
      approvalStatus,
      hourType
    } = dto;

    try {
      // START - Data fetching to the function
      const whereClause = {
        AND: [
          {
            user: {
              tm_approved_status: {
                supervisorTspId: Number(user.user.tsp_id),
                tutorLine:
                  businessUnit.length > 0 ? { in: businessUnit } : undefined
              },
              TslUser: {
                some: {
                  tsp_id:
                    tutor_name.length > 0 || tutor_id.length > 0
                      ? { in: [...new Set([...tutor_name, ...tutor_id])] }
                      : undefined
                }
              },
              GOATutorHourState:
                hourType.length > 0
                  ? {
                      some: {
                        GOATutorHourStateDetails: {
                          some: {
                            // effective_date: {
                            //   lte: date[0].datefrom
                            // },
                            hour_state: {
                              name: { in: [...hourType] }
                            }
                          }
                        }
                      }
                    }
                  : undefined
            },
            effective_date: {
              gte: date[0].datefrom,
              lte: date[0].dateto
            }
          },
          approvalStatus.length > 0
            ? { status: { in: approvalStatus } }
            : undefined
        ].filter(Boolean)
      };

      const count = await this.prisma.gOATimeOff.count({
        where: whereClause
      });

      const timeOffRequests = await this.prisma.gOATimeOff.findMany({
        take,
        skip,
        where: whereClause,
        select: {
          id: true,
          status: true,
          tsp_id: true,
          reason: true,
          comment: true,
          leave_type_id: true,
          effective_date: true,
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
          },
          penalty: true,
          created_at: true,
          timeoff_details: {
            select: {
              id: true,
              slot_status: true,
              req_status: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });
      // END - Data fetching to the function

      const data = timeOffRequests.map((r) => {
        const hourStatus =
          r.user.GOATutorHourState[0] &&
          r.user.GOATutorHourState[0].GOATutorHourStateDetails[0]
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

        return {
          id: r.id,
          tutorID: r.user.TslUser[0].tsl_id,
          tutorName: r.user.TslUser[0].tsl_full_name
            ? r.user.TslUser[0].tsl_full_name
            : '...',
          supervisor: r.user.tm_approved_status.supervisorName,
          businessUnit: tutorType,
          appliedDate: r.created_at,
          timeOffDate: r.effective_date,
          slotsCount: r.timeoff_details.length,
          hourState: hourStatus,
          reason: {
            reason: r.reason,
            comment: r.comment
          },
          penalty: r.penalty,
          approvalStatus: r.status,
          country: country
        };
      });
      return { data, count };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getTutorID(filter: number, userID: number) {
    try {
      const result = await this.prisma.$queryRaw`SELECT DISTINCT tsp_id, tsl_id 
      FROM tsl_user 
      WHERE tsp_id IN (
        SELECT tutor_tsp_id 
        FROM tm_approved_status 
         WHERE supervisor_tsp_id = ${userID}
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

  async applyAdhoctimeoff(details: TimeOffDto, user: any) {
    const {
      time_off_request_details,
      tutor_id,
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
            orderBy: {
              // id: 'desc' // get the latest record
              effective_date: 'desc'
            }
          }
        }
      });

      // START - structuring the data needed to be inserted
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
            status: 6,
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
              req_status: 6,
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
      // END - structuring the data needed to be inserted

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

      // START -  Slack Integration
      for (const v of emailedDetails) {
        const activeSlots = v.slots.filter((slot) => slot.isActive === true);

        const slotsSections = activeSlots.map((activeSlot) => ({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Slot number - ${activeSlot.slotData}`
          }
        }));

        await this.slackService.sendNotification(
          [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `@here ${moment(v.date, 'DD.MM.YYYY dddd').format(
                  'DD/MM/YYYY dddd'
                )}`
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `${userDetails.TslUser[0].tsl_full_name}`
              }
            },

            ...slotsSections,
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `${reason}`
              }
            },
            comment !== '' && reason === 'Other'
              ? {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `${comment}`
                  }
                }
              : undefined
          ].filter(Boolean)
        );
      }
      // END -  Slack Integration

      // START -  Email Integration
      const supevisoremail = await this.emailService.getSupervisorEmail(
        tutor_id
      );

      const adminEmail = process.env.ADMIN_EMAIL;
      await this.emailService.TutorSubordinateTimeOffService({
        subject: 'Time-off Request Confirmation',
        // email: 'praveen@thirdspaceglobal.com',
        email:
          userDetails.approved_contact_data.workEmail === null || ''
            ? adminEmail
            : userDetails.approved_contact_data.workEmail, // Add this email address for main deployement - capacitymanagement@thirdspaceglobal.com
        supervisorBcc: [supevisoremail],
        tutorName: userDetails.TslUser[0].tsl_full_name,
        requests: emailedDetails
      });
      // END -  Email Integration

      return { success: true, message: 'Success Applied !!!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

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
}
