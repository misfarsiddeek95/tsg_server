import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import * as moment from 'moment';
import { MailService } from '../../mail/mail.service';
import { CreateBookingHistoryDto } from '../dtos/booking-history.dto';

@Injectable()
export class BookingHistoryService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async bookingHistoryDetails(details: CreateBookingHistoryDto, tspId: number) {
    try {
      //TODO: need to change the logic here while changing every place that is calling this function.

      let booking_status_number;
      if (details.bookingStatus == 'AVAILABLE') {
        booking_status_number = 1;
      } else if (details.bookingStatus == 'NOT_BOOKED') {
        booking_status_number = 2;
      } else if (details.bookingStatus == 'BOOKED') {
        booking_status_number = 3;
      } else if (details.bookingStatus == 'COMPLETED') {
        booking_status_number = 4;
      } else if (details.bookingStatus == 'NOT_COMPLETED') {
        booking_status_number = 5;
      } else if (details.bookingStatus == 'ACTIVE') {
        booking_status_number = 6;
      } else if (details.bookingStatus == 'WITHDRAW') {
        booking_status_number = 7;
      }

      // add a validation to avoid duplicate records
      const bookingHistoryLastRecord =
        await this.prisma.bookingHistory.findFirst({
          where: {
            created_by: tspId,
            candidate_id: details.candidateId,
            appointment_type_id: +details.appointmentType,
            booking_status_id: booking_status_number,
            slot_time_id: details.slotTimeId,
            date: new Date(moment(details.date).format('YYYY-MM-DD')),
            withdraw_reason: details.withdrawReason.toUpperCase(),
            booking_id: details.bookingId,
            interviewer_id: details.interviewerId
          }
        });

      if (!bookingHistoryLastRecord) {
        await this.prisma.bookingHistory.create({
          data: {
            created_by: tspId,
            candidate_id: details.candidateId,
            appointment_type_id: +details.appointmentType,
            booking_status_id: booking_status_number,
            slot_time_id: details.slotTimeId,
            date: new Date(moment(details.date).format('YYYY-MM-DD')),
            withdraw_reason: details.withdrawReason.toUpperCase(),
            booking_id: details.bookingId,
            interviewer_id: details.interviewerId
          }
        });
      }

      return { success: true, details };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async fetchCandidateBookingStatus(candidateId: string, level: number) {
    try {
      const rows = (await this.prisma.$queryRaw(
        Prisma.sql`SELECT date, booking_status_id AS bookingStatusId FROM bs_booking_history WHERE  id=(SELECT max(id) FROM bs_booking_history WHERE candidate_id=${+candidateId})`
      )) as any;

      if (rows.length === 0) {
        return { success: false };
      }

      const { bookingStatusId } = rows[0];

      if (bookingStatusId === 7) {
        return { success: false };
      }

      //NOTE: here using journely level as condition to ensure apss is accessible
      if (
        ([3, 4, 5, 6].includes(level) &&
          [3, 4, 9, 11, 12, 14].includes(bookingStatusId)) ||
        (level === 7 && bookingStatusId === 10)
      ) {
        if ([3, 11, 12].includes(bookingStatusId)) {
          const booking = (
            await this.getCandidateBookingStatus(candidateId)
          )[0];

          if (!booking) {
            throw new HttpException(
              {
                success: false,
                error: `Valid booking record not found!`
              },
              400
            );
          }

          const interviewerMeetingLink = await this.getInterviewerMeetingLink(
            booking['interviewer_id']
          );

          return {
            success: true,
            data: {
              id: booking['booking_id'],
              date: booking['date'],
              slotTime: booking['slot_time'],
              slotStartTime: booking['start_time'],
              slotEndTime: booking['end_time'],
              candidateLevel: level,
              slotId: booking['id'],
              lastBookingStatus:
                bookingStatusId === 3 && booking['booking_status'] === 4
                  ? 4
                  : bookingStatusId,
              interviewerMeetingLink: interviewerMeetingLink,
              interviewerId: booking['interviewer_id']
            }
          };
        } else if ([4, 9, 10, 14].includes(bookingStatusId)) {
          return {
            success: true,
            data: {
              id: 0,
              date: '',
              slotTime: '',
              candidateLevel: level,
              slotId: 0,
              lastBookingStatus: bookingStatusId,
              interviewerMeetingLink: null,
              interviewerId: ''
            }
          };
        }
      }
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  // '1''AVAILABLE',
  // '2''NOT_BOOKED',
  // '3''BOOKED',
  // '4''COMPLETED',
  // '5''NOT_COMPLETED',
  // '6''ACTIVE',
  // '7''WITHDRAW',
  // '8''COVER',
  // '9''FAILED',
  // '10','PASSED'
  // '11','MISSED'
  // '12','RE_PREPARE'
  // '13','REMOVE'
  // '14','DROPOUT'

  async getCandidateBookingStatus(candidateId: string) {
    const candidateGetBookingSlotMax = await this.prisma.$queryRaw(
      Prisma.sql`
      SELECT 
      bs_booking_status.interviewer_id AS interviewer_id,
      bs_booking_status.id AS booking_id,
      bs_booking_status.status AS booking_status,
      bs_booking_status.date,
      bs_all_booking_slot.*,
      bs_booking_status.time_slot_id
  FROM
      bs_booking_status
          INNER JOIN
      bs_all_booking_slot ON bs_all_booking_slot.id = bs_booking_status.time_slot_id
      LEFT JOIN bs_candidate_level bsl ON bs_booking_status.candidate_id = bsl.candidate_id
      
  WHERE
      bs_booking_status.id = (SELECT 
              bs_booking_history.booking_id
          FROM
              bs_booking_history
          WHERE
              bs_booking_history.candidate_id=${candidateId}
                  AND 
                  CASE
                  WHEN bsl.level = 5 THEN bs_booking_history.appointment_type_id = 7
                  WHEN bsl.level = 4 THEN bs_booking_history.appointment_type_id = 6
                  WHEN bsl.level = 3 THEN bs_booking_history.appointment_type_id = 5
                  ELSE TRUE
                  END 
          ORDER BY bs_booking_history.id DESC
          LIMIT 1
                  ) ; `
    );

    // issue with the old query where, once rescheduled, if candidate booked a slot that was created BEFORE original slot,
    // this would return latest created slot which is not the curretly booked one.

    //   const candidateGetBookingSlotMax = await this.prisma.$queryRaw(
    //     Prisma.sql`
    //     SELECT
    //     bs_booking_status.interviewer_id AS interviewer_id,
    //     bs_booking_status.id AS booking_id,
    //     bs_booking_status.date,
    //     bs_all_booking_slot.*,
    //     bs_booking_status.time_slot_id
    // FROM
    //     bs_booking_status
    //         INNER JOIN
    //     bs_all_booking_slot ON bs_all_booking_slot.id = bs_booking_status.time_slot_id
    //     LEFT JOIN bs_candidate_level bsl ON bs_booking_status.candidate_id = bsl.candidate_id

    // WHERE
    //     bs_booking_status.id = (SELECT
    //             MAX(bs_booking_status.id)
    //         FROM
    //             bs_booking_status
    //         WHERE
    //             bs_booking_status.candidate_id=${candidateId}
    //                 AND
    //                 CASE
    //                 WHEN bsl.level = 5 THEN bs_booking_status.appointment_type_ref_id = 7
    //                 WHEN bsl.level = 4 THEN bs_booking_status.appointment_type_ref_id = 6
    //                 WHEN bsl.level = 3 THEN bs_booking_status.appointment_type_ref_id = 5
    //                 ELSE TRUE
    //                 END
    //                 ) ; `
    //   );

    return candidateGetBookingSlotMax;
  }

  async getInterviewerMeetingLink(interviewerId: string) {
    const meetingLinkFetch = await this.prisma.vpMeetingLink.findUnique({
      where: { user_id: +interviewerId },
      select: {
        url: true
      }
    });
    return meetingLinkFetch ? meetingLinkFetch.url : null;
  }
}
