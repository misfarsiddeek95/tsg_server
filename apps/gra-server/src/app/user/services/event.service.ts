import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  EventTypeCreateDto,
  GetInterviewerEventDataRequestDto,
  SubmitEventAlterationDto
} from '../dtos/event.dto';

interface Appointment {
  appointment_type: number;
  status: number;
  id: number;
  name: string;
  mail: string;
  event_title: string;
  event_duration: number;
  type: string;
}
@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEventType({
    details,
    userId
  }: {
    details: EventTypeCreateDto;
    userId: number;
  }) {
    try {
      const lastIndex = await this.prisma.appointmentTypeRef.findFirst({
        orderBy: {
          id: 'desc'
        }
      });
      const response = await this.prisma.appointmentTypeRef.create({
        data: {
          id: lastIndex.id + 1,
          type: details.type,
          event_title: details.event_title,
          created_by: userId,
          event_duration: details.duration,
          event_description: details.description ?? '',
          enabled: 1
        }
      });

      if (response) {
        return { success: true, data: response };
      } else {
        throw new Error('Error creating event');
      }
    } catch (error) {
      throw new HttpException(
        { success: false, error: error ? error.message : error },
        400
      );
    }
  }

  async getInterviewerEventData(
    details: GetInterviewerEventDataRequestDto
  ): Promise<Appointment[]> {
    try {
      if (!details.interviewerId) {
        throw new Error('Invalid Interviewer Id');
      }
      const appointmentTypes = await this.prisma.appointmentTypeRef.findMany({
        where: {
          enabled: 1
        },
        select: {
          id: true,
          type: true,
          event_title: true,
          event_description: true,
          event_duration: true,
          InterviewerAppointmentTypeRef: {
            select: {
              user: {
                include: {
                  NTProfile: { select: { short_name: true } },
                  approved_personal_data: {
                    select: {
                      shortName: true
                    }
                  }
                }
              },
              appointment_type: true,
              status: true
            }
          }
        }
      });

      const currentUser = await this.prisma.user.findUnique({
        where: {
          tsp_id: details.interviewerId
        },
        select: {
          username: true
        }
      });

      const interviewerEvents = appointmentTypes.map((type) => {
        const status = type.InterviewerAppointmentTypeRef.find(
          (data) => data.user.tsp_id === details.interviewerId
        );
        const temp_interviewer_name =
          status?.user.approved_personal_data &&
          status?.user.approved_personal_data?.shortName &&
          status?.user.approved_personal_data?.shortName != ''
            ? status?.user.approved_personal_data?.shortName
            : status?.user.NTProfile &&
              status?.user.NTProfile.short_name &&
              status?.user.NTProfile.short_name != ''
            ? status?.user.NTProfile.short_name
            : status?.user.username;

        return {
          appointment_type: type.id,
          status: status?.status ?? 0,
          id: status?.user.tsp_id ?? details.interviewerId,
          name: temp_interviewer_name,
          mail: status?.user.username ?? currentUser.username,
          event_title: type.event_title,
          event_duration: type.event_duration,
          type: type.type
        };
      });

      return interviewerEvents;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async fetchEventAlteration() {
    try {
      const intervierTime = await this.prisma.appointmentTypeRef.findMany({
        where: {
          enabled: 1
        },
        select: {
          id: true,
          type: true,
          candi_slot_booking_btn_time: true,
          candi_join_btn_time: true,
          candi_edit_btn_time: true,
          candi_reschedule_limit: true,
          int_check_btn_time: true,
          int_slot_available_btn_time: true,
          event_title: true,
          event_duration: true
        }
      });
      return { success: true, intervierTime };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async submitEventAlteration({
    details,
    userId
  }: {
    details: SubmitEventAlterationDto[];
    userId: number;
  }) {
    try {
      for (const { id, event_duration } of details) {
        await this.prisma.appointmentTypeRef.update({
          where: { id },
          data: {
            event_duration: +event_duration,
            updated_by: +userId,
            updated_at: new Date()
          }
        });
      }

      return { success: true };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }
}
