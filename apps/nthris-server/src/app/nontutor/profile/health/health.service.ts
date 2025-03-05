import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditorSubmitDetailsDto, HealthDataDto } from './health.dto';
import moment = require('moment');
import { CommonService } from '../../../common/common.service';

@Injectable()
export class HealthService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService
  ) {}

  async fetchHealthDetails(tspId: number) {
    const approvedDetails = await this.getApprovedData(tspId);
    const details = await this.getTempData(tspId);
    return {
      success: true,
      data: {
        details,
        approvedDetails
      }
    };
  }

  async saveHealthDetails(tspId: number, data: HealthDataDto) {
    const lastData = await this.getTempData(tspId);
    const { lastDataReasons, updatedStatus } =
      await this.commonService.collectReasons(lastData, data);
    const tempData = {
      ...data,
      ...lastDataReasons,
      ...updatedStatus
    };
    return await this.saveTempData(tspId, tempData);
  }

  async auditorSubmitDetails(auditorId: number, data: AuditorSubmitDetailsDto) {
    const { nonTutorId, ...rest } = data;
    const lastData = await this.getTempData(nonTutorId);
    await this.saveTempData(nonTutorId, rest, auditorId);
    let previousApprovedData = await this.getApprovedData(nonTutorId);
    if (!previousApprovedData) {
      previousApprovedData = await this.saveApprovedData(auditorId, {
        tspId: nonTutorId
      });
    }
    const { notAuditingFields, auditingFields } =
      await this.commonService.collectAuditingFields(
        previousApprovedData,
        lastData,
        rest
      );
    const saveData = {
      ...notAuditingFields,
      ...auditingFields,
      tspId: nonTutorId
    };
    await this.saveApprovedData(auditorId, saveData);
    await this.commonService.updateNonTutorDirectory(
      nonTutorId,
      auditorId,
      saveData
    );
    const details = await this.getTempData(nonTutorId);
    const approvedDetails = await this.getApprovedData(nonTutorId);
    return { details, approvedDetails };
  }

  async getTempData(tspId: number) {
    try {
      return await this.prisma.hrisHealthData.findFirst({
        where: {
          tspId
        },
        select: {
          hd1Heart: true,
          hd2Neck: true,
          hd3High: true,
          hd4Arthritis: true,
          hd5Terminally: true,
          hd6Unusual: true,
          hd7Asthma: true,
          hd8Fainting: true,
          hd9Depression: true,
          hd10Throat: true,
          hd12Vision: true,
          hd11Other: true,
          hd11OtherExplain: true,
          healthUrl_1: true
        },
        orderBy: {
          id: 'desc'
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getApprovedData(tspId: number) {
    try {
      return await this.prisma.approvedHealthData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          hd1Heart: true,
          hd2Neck: true,
          hd3High: true,
          hd4Arthritis: true,
          hd5Terminally: true,
          hd6Unusual: true,
          hd7Asthma: true,
          hd8Fainting: true,
          hd9Depression: true,
          hd10Throat: true,
          hd12Vision: true,
          hd11Other: true,
          hd11OtherExplain: true,
          healthUrl_1: true
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveTempData(
    tspId: number,
    tempData: HealthDataDto,
    auditorId?: number
  ) {
    try {
      const now = new Date().toISOString();
      await this.prisma.hrisHealthData.create({
        data: {
          tspId,
          ...tempData,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: auditorId ? now : null,
          auditedBy: auditorId ? auditorId : null
        }
      });
      await this.prisma.nTHRISProfileProgress.upsert({
        where: {
          tspId: tspId
        },
        update: {
          healthSectionFilled: true,
          lastFilledSection: 'health'
        },
        create: {
          tspId: tspId,
          healthSectionFilled: true,
          lastFilledSection: 'health'
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveApprovedData(auditorId: number, data) {
    try {
      const now = new Date().toISOString();
      return await this.prisma.approvedHealthData.upsert({
        where: {
          tspId: data.tspId
        },
        update: {
          ...data,
          approvedAt: now,
          approvedBy: auditorId
        },
        create: {
          ...data,
          approvedAt: now,
          approvedBy: auditorId
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
