import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import * as moment from 'moment';
import { MailService } from '../../mail/mail.service';
import { GetHrisAccessDto } from '../dtos/hris-access.dto';

@Injectable()
export class FetchHrisAccessLevel {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async getHrisAccess(details: GetHrisAccessDto) {
    /// let appointment_number;

    try {
      const accessLevel = await this.prisma.hrisAccess.findMany({
        where: {
          access: 1,
          tsp_id: details.tsp_id
        },
        select: {
          access: true
        }
      });

      return {
        success: true,
        data: accessLevel
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
