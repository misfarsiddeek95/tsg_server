import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ValidationService {
  constructor(private prisma: PrismaService) {}

  async apssEventValidations() {
    try {
      const validations = await this.prisma.appointmentTypeRef.findMany({
        select: {
          id: true,
          type: true,
          candi_edit_btn_time: true,
          candi_join_btn_time: true,
          candi_reschedule_limit: true,
          candi_slot_booking_btn_time: true,
          int_check_btn_time: true,
          int_slot_available_btn_time: true
        }
      });

      const response = validations.reduce((acc, curr) => {
        acc[curr.id] = {
          eventId: curr.id,
          eventType: curr.type,
          candidateEditBtnTime: curr.candi_edit_btn_time,
          candidateJoinBtnTime: curr.candi_join_btn_time,
          candidateRescheduleLimit: curr.candi_reschedule_limit,
          candidateSlotBookingBtnTime: curr.candi_slot_booking_btn_time,
          interviewerCheckBtnTime: curr.int_check_btn_time,
          interviewerSlotAvailableBtnTime: curr.int_slot_available_btn_time
        };
        return acc;
      }, {});

      return {
        success: true,
        data: response
      };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }
}
