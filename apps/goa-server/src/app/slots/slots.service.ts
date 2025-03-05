import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../prisma/prisma.service';
import { getTheExactDate } from '../util';
import { SaveUkBookedSessions } from '../admin/dtos';

@Injectable()
export class SlotsService {
  constructor(private prisma: PrismaService) {}

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

  async getActiveTimeRangesForEffectiveDate(effectiveDate: string) {
    const fridayDate = moment(getTheExactDate(effectiveDate, 'Friday'))
      .utc(true)
      .toISOString();

    const activeSlots = await this.getActiveSlotsForEffectiveDate(fridayDate);

    const timeRanges = await this.getTimeSlotsFromGoaSlots(activeSlots);

    const slottype = timeRanges.map((slot) => ({
      key: slot.id,
      name: `Slot ${slot.id}`
    }));

    return slottype;
  }

  async getActiveSlotsForDay(effectiveDate: string, dayOfTheWeek: string) {
    const slotsForDay = await this.prisma.gOASlot.findMany({
      where: {
        date: {
          date: dayOfTheWeek
        }
      }
    });

    const activeSlots = await this.prisma.gOASlotMovement.findMany({
      where: {
        effectiveDate: {
          lte: effectiveDate
        },
        slotId: { in: slotsForDay.map((item) => item.id) }
      },
      select: {
        id: true,
        slotId: true,
        movementType: true
      },
      distinct: ['slotId'],
      orderBy: {
        id: 'desc'
      }
    });

    return activeSlots
      .filter((item) => item.movementType.code !== 'DEACTIVATED')
      .map((item) => ({ slotId: item.slotId }));
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

  async getSlotsFromTimeSlot(timeSlotId: number) {
    const slots = await this.prisma.gOASlot.findMany({
      where: {
        time_range_id: timeSlotId
      },
      select: {
        id: true,
        date: true,
        time_range_id: true
      }
    });

    return slots;
  }

  async timeRangeFromSlotId(slotId: number) {
    const timeRange = await this.prisma.gOATimeRange.findFirst({
      where: {
        slot: {
          some: {
            id: slotId
          }
        }
      }
    });

    return timeRange;
  }

  async slotDetailsById(slotId: number) {
    const slot = await this.prisma.gOASlot.findUnique({
      where: {
        id: slotId
      },
      select: {
        id: true,
        date: true,
        time_range: true
      }
    });

    return slot;
  }

  async getSlotId(slotStatus: string[]) {
    const slotIds = await this.prisma.gOASlotStatus.findMany({
      where: {
        code: {
          in: slotStatus
        }
      },
      select: {
        id: true
      },
      distinct: ['code']
    });

    return slotIds.map((slot) => slot.id);
  }

  // get the selected slot detail from the filter
  async getActiveSelectedSlotsForEffectiveDate(
    effectiveDate: string,
    slotNumbers: number[]
  ) {
    const activeSelectedSlots = await this.prisma.gOASlotMovement.findMany({
      where: {
        effectiveDate: {
          lte: effectiveDate
        },
        goaSlot: {
          time_range_id: {
            in: slotNumbers
          }
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

    return activeSelectedSlots
      .filter((item) => item.movementType.code !== 'DEACTIVATED')
      .map((item) => ({ slotId: item.slotId, details: item.goaSlot }));
  }
}
