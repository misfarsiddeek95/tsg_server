import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DashboardDataDto } from './dashboard.dto';
import moment = require('moment');

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async fetchDashboardDetails(tspId: number) {
    try {
      const data = await this.prisma.approvedPersonalData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          fullName: true,
          nameWithInitials: true,
          firstName: true,
          surname: true,
          gender: true,
          dob: true,
          birthCertificateUrl: true,
          religion: true,
          maritalState: true,
          spouseName: true,
          haveChildren: true,
          nic: true,
          nicUrl: true,
          haveAffiliations: true,
          shortName: true,
          age: true,
          ppUrl: true,
          nationality: true,
          typeOfId: true,
          passportCountry: true,
          passportExpirationDate: true,
          haveRtwDocument: true,
          rtwDocumentUrl: true,
          haveRtwExpirationDate: true,
          rtwExpirationDate: true,
          idLanguage: true
        }
      });
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async fetchHomeDetails(tspId: number) {
    try {
      const event = await this.prisma.calendar.findMany({
        select: {
          effective_date: true,
          description: true
        },
        where: {
          holidays_type_id: {
            in: [9, 10, 11, 12]
          },
          effective_date: {
            gt: new Date()
          }
        },
        orderBy: {
          effective_date: 'asc'
        },
        take: 1
      });

      const holiday = await this.prisma.calendar.findMany({
        select: {
          effective_date: true,
          description: true
        },
        where: {
          holidays_type_id: {
            in: [1, 2]
          },
          effective_date: {
            gt: new Date()
          }
        },
        orderBy: {
          effective_date: 'asc'
        },
        take: 1
      });
      const data = {
        latest_event: event[0],
        latest_holiday: holiday[0]
      };
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
