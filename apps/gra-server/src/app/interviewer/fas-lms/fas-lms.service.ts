import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import moment = require('moment');
import { id } from 'date-fns/locale';
import {
  TalentlMS200Dto,
  TalentlMS404Dto,
  TalentlMS401Dto,
  TalentLmsDto
} from './fas-lms.dto';

@Injectable()
export class LmsService {
  constructor(private prisma: PrismaService) {}

  checkDate(startDate: string, endDate: string) {
    if (startDate && endDate) {
      return {
        gt: moment(startDate).startOf('date').toDate(),
        lt: moment(endDate).endOf('date').toDate()
      };
    } else if (startDate) {
      return {
        gt: moment(startDate).startOf('date').toDate()
      };
    } else if (endDate) {
      return {
        lt: moment(endDate).endOf('date').toDate()
      };
    } else {
      return {};
    }
  }

  async getlms({ tspId, email, startDate, endDate, skip, take }: TalentLmsDto) {
    const isWhere = tspId || email || startDate || endDate;

    try {
      const tllms = await this.prisma.demoTalentlms.findMany({
        // where: {
        //   tsp_id: tspId ? +tspId : null
        //   // email: email ?? null
        //   // created_at: {
        //   //   gt: startDate ? moment(startDate).toDate() : null,
        //   //   lt: endDate ? moment(endDate).toDate() : null
        //   // }
        // },
        where: isWhere
          ? {
              tsp_id: tspId ? { equals: +tspId } : {},
              email: email ? { equals: email } : {}
              // created_at: this.checkDate(startDate, endDate) //build error unable to reolve. commented for now
            }
          : {},
        select: {
          tsp_id: true,
          email: true,
          course_completion: true,
          course_score_avg: true,
          attendance: true,
          cpd_familiarity: true,
          cpd_sct: true,
          cpd_language: true,
          cpd_sk: true,
          cpd_reflection: true,
          cpd: true,
          copied: true,
          ti_record_id: true,
          created_at: true,
          id: true
        },
        take: +take,
        skip: +skip
      });
      if (tllms) {
        return {
          success: true,
          data: {
            tllms
          }
        };
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async importcsv(tableData: any) {
    try {
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
