import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getDayOfWeek, convertSLTimeToUKTime } from '../../util';
// import moment from 'moment';
// import * as moment from 'moment';
const moment = require('moment');
import {
  BookedDummySessions,
  NewBookedSessionDto,
  NewLaunchedSessionsDto
} from '../dtos';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class TslIntegrationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  async selectEligibleTutorsForSessions(movementDetailsForDateRange, tspIds) {
    const movementMap = new Map(
      movementDetailsForDateRange.map((move) => [move.tutorTspId, true])
    );

    const eligibleTutors = tspIds.filter((tspId) => !movementMap.has(tspId));

    return eligibleTutors;
  }
  async saveNewBookedSession(newBookedSessionDto: NewBookedSessionDto) {
    try {
      const dateFormat = 'DD.MM.YYYY';
      const isValid = moment(
        newBookedSessionDto.date,
        dateFormat,
        true
      ).isValid();

      if (!isValid) {
        throw new BadRequestException(
          `Invalid date format. Expected format is ${dateFormat}.`
        );
      }

      const existingBooking = await this.prisma.goaSessionsFuture.findUnique({
        where: {
          sessionId: newBookedSessionDto.session_id
        }
      });

      if (existingBooking)
        throw new BadRequestException('Session already exists');

      const day = getDayOfWeek(newBookedSessionDto.date);

      const dayDetails = await this.prisma.gOADaysOFWeek.findFirst({
        where: {
          date: day
        }
      });

      const goaSlot = await this.prisma.gOASlot.findFirst({
        where: {
          date_id: dayDetails.id,
          time_range_id: newBookedSessionDto.slot
        }
      });

      const tslUser = await this.prisma.tslUser.findFirst({
        where: {
          tsl_id: Number(newBookedSessionDto.tutor_id)
        }
      });

      const bookedStatus = await this.prisma.capautSessionStatus.findUnique({
        where: {
          code: 'BOOKED'
        }
      });

      const newBooking = await this.prisma.goaSessionsFuture.create({
        data: {
          statusId: bookedStatus.id,
          sessionId: newBookedSessionDto.session_id,
          schoolId: newBookedSessionDto.school_id,
          studentId: newBookedSessionDto.student_id,
          sessionType: newBookedSessionDto.session_type,
          hourSlot: newBookedSessionDto.hour_slot,
          slot: newBookedSessionDto.slot,
          date: moment(newBookedSessionDto.date, dateFormat, true).format(
            'YYYY-MM-DD'
          ),
          tutorId: newBookedSessionDto.tutor_id,
          tspId: tslUser.tsp_id,
          goaSlotId: goaSlot.id
        }
      });

      return {
        success: true,
        message: 'Successfully created new booking',
        data: {
          ...newBooking,
          tutorId: Number(newBooking.tutorId)
        }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // dummy data for launched sessions
  async addLaunchedSessionsDummy(requestedData: NewLaunchedSessionsDto) {
    try {
      const dateFormat = 'DD.MM.YYYY';
      const isValid = moment(requestedData.date, dateFormat, true).isValid();

      if (!isValid) {
        throw new BadRequestException(
          `Invalid date format. Expected format is ${dateFormat}.`
        );
      }

      const day = getDayOfWeek(requestedData.date);

      const dayDetails = await this.prisma.gOADaysOFWeek.findFirst({
        where: {
          date: day
        }
      });

      const goaSlot = await this.prisma.gOASlot.findFirst({
        where: {
          date_id: dayDetails.id,
          time_range_id: requestedData.slot
        }
      });

      const tslUser = await this.prisma.tslUser.findFirst({
        where: {
          tsl_id: Number(requestedData.tutor_id)
        }
      });

      const slotStatus = await this.prisma.gOASlotStatus.findUnique({
        where: {
          code: requestedData.slot_status
        },
        select: {
          id: true
        }
      });

      if (!slotStatus) {
        throw new Error('No slot status record found for given slot status.');
      }

      const effectiveDate = moment
        .utc(requestedData.date, dateFormat, true)
        .startOf('day')
        .toDate();

      return await this.prisma.gOALaunchedSessions.upsert({
        where: {
          id: requestedData.id
        },
        update: {
          tsp_id: tslUser.tsp_id,
          slot_id: goaSlot.id,
          effective_date: effectiveDate,
          learning_session_id: requestedData.id,
          slot_status_id: slotStatus.id
        },
        create: {
          id: requestedData.id,
          tsp_id: tslUser.tsp_id,
          slot_id: goaSlot.id,
          effective_date: effectiveDate,
          learning_session_id: requestedData.id,
          slot_status_id: slotStatus.id,
          created_at: new Date()
        }
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // dummy data for booked sessions
  async addBookedSessionsDummy(requestedData: BookedDummySessions) {
    try {
      const dateFormat = 'DD.MM.YYYY';
      const isValid = moment(requestedData.date, dateFormat, true).isValid();

      if (!isValid) {
        throw new BadRequestException(
          `Invalid date format. Expected format is ${dateFormat}.`
        );
      }

      const day = getDayOfWeek(requestedData.date);

      const dayDetails = await this.prisma.gOADaysOFWeek.findFirst({
        where: {
          date: day
        }
      });

      const goaSlot = await this.prisma.gOASlot.findFirst({
        where: {
          date_id: dayDetails.id,
          time_range_id: requestedData.slot
        }
      });

      const tslUser = await this.prisma.tslUser.findFirst({
        where: {
          tsl_id: Number(requestedData.tutor_id)
        }
      });

      const bookedStatus = await this.prisma.capautSessionStatus.findUnique({
        where: {
          code: 'BOOKED'
        }
      });

      const upsertBooking = await this.prisma.goaSessionsFuture.upsert({
        where: {
          sessionId: requestedData.session_id
        },
        update: {
          statusId: bookedStatus.id,
          schoolId: requestedData.school_id,
          studentId: requestedData.student_id,
          sessionType: requestedData.session_type,
          hourSlot: requestedData.hour_slot,
          slot: requestedData.slot,
          date: moment(requestedData.date, dateFormat, true).format(
            'YYYY-MM-DD'
          ),
          tutorId: requestedData.tutor_id,
          tspId: tslUser.tsp_id,
          goaSlotId: goaSlot.id
        },
        create: {
          sessionId: requestedData.session_id,
          statusId: bookedStatus.id,
          schoolId: requestedData.school_id,
          studentId: requestedData.student_id,
          sessionType: requestedData.session_type,
          hourSlot: requestedData.hour_slot,
          slot: requestedData.slot,
          date: moment(requestedData.date, dateFormat, true).format(
            'YYYY-MM-DD'
          ),
          tutorId: requestedData.tutor_id,
          tspId: tslUser.tsp_id,
          goaSlotId: goaSlot.id
        }
      });

      return {
        success: true,
        message: 'Successfully created new booking',
        data: {
          ...upsertBooking,
          tutorId: Number(upsertBooking.tutorId)
        }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
