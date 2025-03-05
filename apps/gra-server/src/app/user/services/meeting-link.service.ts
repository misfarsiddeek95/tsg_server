import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { MailService } from '../../mail/mail.service';
import { GetMeetingLinkRequestDto } from '../dtos/meeting-link.dto';

@Injectable()
export class MeetingLinkService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async getMeetingLink(details: GetMeetingLinkRequestDto) {
    try {
      const meetingLink = await this.prisma.vpMeetingLink.findUnique({
        where: {
          user_id: details.interviewerId ?? 0
        },
        select: {
          url: true
        }
      });
      return {
        success: true,
        data: meetingLink
      };
      // const response = await fetch('https://llhabhobrl.execute-api.us-east-1.amazonaws.com/dev/create-meeting', {
      //     method: 'POST',
      //     body: JSON.stringify({
      //       mDate: '2022-09-30',
      //       mTime: '13:30',
      //       mDuration: 15,
      //       moderator: 'Aakil',
      //       attendee: 'Dinesh'
      //     }),
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   });

      //   await response.json().then(async (result) => {
      //     const meetingLink = result.mUrl;
      //     return {
      //         success: true,
      //         data: meetingLink
      //     };
      //   });
    } catch (error) {
      return { success: false, error };
    }
  }
}
