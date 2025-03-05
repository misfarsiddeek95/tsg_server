import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AuditorSubmitReferenceDetailsDto,
  ReferenceDataDto
} from './reference.dto';
import { CommonService } from '../../../common/common.service';

@Injectable()
export class ReferenceService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService
  ) {}

  async fetchReferenceDetails(tspId: number) {
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

  async saveReferenceDetails(tspId: number, data: ReferenceDataDto) {
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

  async auditorSubmitReferenceDetails(
    auditorId: number,
    data: AuditorSubmitReferenceDetailsDto
  ) {
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
      return await this.prisma.hrisRefereeData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          refereeTitle1: true,
          refereeFirstName1: true,
          refereeLastName1: true,
          refereeRelationship1: true,
          refereeEmail1: true,
          refereeTelephoneNumber1: true,
          acknowledgement1: true,
          refereeTitle2: true,
          refereeFirstName2: true,
          refereeLastName2: true,
          refereeRelationship2: true,
          refereeEmail2: true,
          refereeTelephoneNumber2: true,
          acknowledgement2: true,
          confirmation: true
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getApprovedData(tspId: number) {
    try {
      return await this.prisma.approvedRefereeData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          refereeTitle1: true,
          refereeFirstName1: true,
          refereeLastName1: true,
          refereeRelationship1: true,
          refereeEmail1: true,
          refereeTelephoneNumber1: true,
          acknowledgement1: true,
          refereeTitle2: true,
          refereeFirstName2: true,
          refereeLastName2: true,
          refereeRelationship2: true,
          refereeEmail2: true,
          refereeTelephoneNumber2: true,
          acknowledgement2: true,
          confirmation: true
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveTempData(
    tspId: number,
    tempData: ReferenceDataDto,
    auditorId?: number
  ) {
    try {
      const now = new Date().toISOString();
      await this.prisma.hrisRefereeData.create({
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
          referenceSectionFilled: true,
          lastFilledSection: 'reference'
        },
        create: {
          tspId: tspId,
          referenceSectionFilled: true,
          lastFilledSection: 'reference'
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveApprovedData(auditorId: number, data) {
    try {
      const now = new Date().toISOString();
      return await this.prisma.approvedRefereeData.upsert({
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
