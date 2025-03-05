import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import * as moment from 'moment';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class WorkEducationService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async workEducationDetails({ userId }: { userId: number }, details: any) {
    try {
      //TODO: setup table to accept this education industry experience section
      // await this.prisma.xotherQualiData.create({
      //   data: {
      //     user_id: userId,
      //     q_id: 0,
      //     course_type: details.courseType,
      //     main_inst: details.mainInst,
      //     field_study: details.fieldStudy,
      //     start_year: details.startDate,
      //     completion_year: details.completionDate,
      //   }
      // });
      return { success: true, details };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getWorkEducationDetails({
    userId
  }: {
    username: string;
    userId: number;
  }) {
    try {
      // const work = await this.prisma.xotherQualiData.findMany({
      //   where: {
      //     user_id: userId
      //   }
      // });
      // return { success: true, data: work };
    } catch (error) {
      return { success: false, error };
    }
  }
}
