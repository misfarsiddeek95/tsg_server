import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as moment from 'moment';

@Injectable()
export class SessionAvailabilityService {
  constructor(private prisma: PrismaService) {}

  //Create Default Session Availabilities
  // async addDefaultSlots(userId: number) {
  //   try {
  //     const today = moment().toISOString();
  //     const slotIds = Array.from({ length: 35 }, (_, i) => i + 1);

  //     await this.prisma.$transaction(async (tx) => {
  //       //was tutorTimeSlots
  //       const tutorTimeSlot = await tx.gOATutorsSlots.create({
  //         data: {
  //           tsp_id: userId,
  //           effective_date: today,
  //           hour_status: '',
  //           created_at: today,
  //           updated_at: today
  //         }
  //       });
  //       //was tutorTimeSlotsData
  //       await tx.gOATutorSlotsDetails.createMany({
  //         data: slotIds.map((id) => {
  //           return {
  //             slot_id: id,
  //             slot_status_id: 5,
  //             effective_date: today,
  //             tutor_slot_id: tutorTimeSlot.id,
  //             hour_status: '',
  //             created_at: today,
  //             created_by: 0
  //           };
  //         })
  //       });
  //       return true;
  //     });
  //   } catch (error) {
  //     throw new HttpException({ success: false, error }, 400);
  //   }
  // }

  //Get Session Availability
  async getDefaultSlots(userId: number) {
    //createIfNotExists will create default slots if request is made by a candidate & no slots are found
    try {
      const today = new Date();
      let count = 0;

      const begin = moment(today).isoWeekday(1).startOf('week');
      const fromDate = begin.add(1, 'd').format(); // Monday
      const toDate = begin.add(5, 'd').format(); // Saturday or friday

      const slotsAvailableForTimePeriod =
        await this.getActiveSlotsForEffectiveDate(toDate);

      const timeRanges = await this.getTimeSlotsFromGoaSlots(
        slotsAvailableForTimePeriod
      );

      // Get availability of tutor
      const currentAvailability = await this.prisma.gOATutorsSlots.findFirst({
        where: {
          AND: {
            tsp_id: {
              equals: +userId
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

      const newRecord: any =
        !currentAvailability &&
        (await this.createNewRecordInTutorSlot(
          +userId,
          fromDate,
          today.toISOString()
        ));

      const slots = await Promise.all(
        timeRanges.map(async (timeSlot) => {
          const result = {};

          const slotsForTimeRange = await this.getSlotsFromTimeSlot(
            timeSlot.id
          );

          for (const slot of slotsForTimeRange) {
            const {
              id,
              date: { date: dayOfWeek }
            } = slot;

            const availabilityForSlot: any = !currentAvailability
              ? undefined
              : currentAvailability.GOATutorSlotsDetails.find(
                  (d) => d.slot_id === id
                );

            result[dayOfWeek.toLowerCase()] = {
              recordId: availabilityForSlot ? availabilityForSlot.id : 0,
              tutor_slot_id: availabilityForSlot
                ? currentAvailability.id
                : newRecord.id,
              slotId: id,
              slotStatusId: availabilityForSlot
                ? availabilityForSlot.slot_status_id
                : 5,
              effective_date: availabilityForSlot
                ? availabilityForSlot.effective_date
                : newRecord.effective_date,
              hour_status: '',
              created_at: availabilityForSlot
                ? availabilityForSlot.created_at
                : newRecord.created_at,
              created_by: userId
            };
          }

          return { id: timeSlot.id, ...result };
        })
      );

      if (currentAvailability) {
        count = await this.prisma.gOATutorSlotsDetails.count({
          where: {
            tutor_slot_id: currentAvailability.id,
            slot_status_id: 6
          }
        });
      }

      return {
        success: true,
        data: slots,
        count
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async createNewRecordInTutorSlot(
    userId: number,
    fromDate: string,
    today: string
  ) {
    return await this.prisma.gOATutorsSlots.create({
      data: {
        tsp_id: +userId,
        effective_date: fromDate,
        hour_status: '',
        created_at: today,
        updated_at: today
      }
    });
  }

  async getSlotsFromTimeSlot(timeSlotId: number) {
    const slots = await this.prisma.gOASlot.findMany({
      where: {
        time_range_id: timeSlotId
      },
      select: {
        id: true,
        date: true
      }
    });

    return slots;
  }

  async getActiveSlotsForEffectiveDate(effectiveDate: string) {
    const activeSlots = await this.prisma.gOASlotMovement.findMany({
      where: {
        effectiveDate: {
          lte: effectiveDate
        }
      },
      select: {
        id: true,
        slotId: true,
        movementType: true,
        goaSlot: {
          select: {
            id: true,
            date: true,
            time_range: true
          }
        }
      },
      distinct: ['slotId'],
      orderBy: {
        id: 'desc'
      }
    });

    return activeSlots
      .filter((item) => item.movementType.code !== 'DEACTIVATED')
      .map((item) => ({ slotId: item.slotId, details: item.goaSlot }));
  }

  async getTimeSlotsFromGoaSlots(goaSlots: { slotId: number }[]) {
    const timeRanges = await this.prisma.gOATimeRange.findMany({
      where: {
        slot: {
          every: {
            id: {
              in: goaSlots.map((item) => item.slotId)
            }
          }
        }
      },

      distinct: ['id']
    });

    return timeRanges;
  }

  //Get Default Session Availabilities
  // async getDefaultAvailability() {
  //   try {
  //     return this.prisma.$transaction(async (tx) => {
  //       const timeSlots = await tx.gOATimeRange.findMany();
  //       const defaultSlots = await tx.gOASlot.findMany({
  //         select: {
  //           id: true,
  //           date_id: true,
  //           date: {
  //             select: {
  //               date: true
  //             }
  //           },
  //           time_range: true
  //         }
  //       });
  //       let result = {};

  //       const slots = await timeSlots.map((value) => {
  //         defaultSlots.map((d) => {
  //           result = {
  //             ...result,
  //             [d.date.date.toLowerCase()]: {
  //               idSlot: d.id,
  //               slotId: d.time_range.id
  //             }
  //           };
  //         });
  //         return { id: value.id, ...result };
  //       });
  //       return { slots };
  //     });
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  //Create Session Availabilities
  async submitSessionAvailability(
    data: {
      id: number;
      field: string;
      slotId: number;
      slotStatusId: number;
      recordId: number;
    }[],
    userId: number
  ) {
    try {
      const allSchedules = [];

      const today = new Date().toISOString();
      const begin = moment().isoWeekday(1).utc(true).format();

      Object.keys(data).forEach((key) => {
        const schedulesForKey = Object.values(data[key]);
        allSchedules.push(...schedulesForKey);
      });

      // I cheng this line As GOA code requerment but this is not best option

      // await this.prisma.$transaction(async (tx) => {
      //   const updatedSlots = allSchedules.map(async (record) => {
      //     await tx.gOATutorSlotsDetails.update({
      //       where: {
      //         id: +record.recordId
      //       },
      //       data: {
      //         slot_status_id: record.slotStatusId === 5 ? 5 : 6,
      //         effective_date: moment().toISOString()
      //       }
      //     });
      //   });

      const availability = await this.prisma.gOATutorsSlots.findFirst({
        where: {
          tsp_id: userId
        }
      });

      await this.prisma.$transaction(async (tx) => {
        const updatedSlots = allSchedules.map(async (record) => {
          await tx.gOATutorSlotsDetails.createMany({
            data: {
              tutor_slot_id: availability.id,
              slot_id: record.slotId,
              slot_status_id: record.slotStatusId === 5 ? 5 : 6,
              effective_date: begin,
              hour_status: '',
              created_at: today,
              created_by: userId
            }
          });
        });

        await Promise.all(updatedSlots);

        // await tx.gOATutorsSlots.updateMany({
        //   where: {
        //     tsp_id: userId
        //   },
        //   data: {
        //     effective_date: moment().toISOString(),
        //     updated_at: moment().toISOString()
        //   }
        // });

        await tx.hrisProgress.upsert({
          where: {
            tspId: userId
          },
          update: {
            availabilityDataEmp: 35,
            availabilityDataCount: `35/35`
          },
          create: {
            tspId: userId,
            availabilityDataEmp: 35,
            availabilityDataCount: `35/35`
          }
        });
      });
      return { success: true };
    } catch (error) {
      console.log(error);
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
