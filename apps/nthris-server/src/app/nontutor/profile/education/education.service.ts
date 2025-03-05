import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditorSubmitDetailsDto, EducationDataDto } from './education.dto';
import moment = require('moment');
import { CommonService } from '../../../common/common.service';

@Injectable()
export class EducationService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService
  ) {}

  async fetchEducationDetails(tspId: number) {
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

  async saveEducationDetails(tspId: number, data: EducationDataDto) {
    const { xother_education_data, ...rest } = data;
    const lastData = await this.getTempData(tspId);
    const { lastDataReasons, updatedStatus } =
      await this.commonService.collectReasons(lastData, data);
    const tempData = {
      ...rest,
      ...lastDataReasons,
      ...updatedStatus
    };
    return await this.saveTempData(tspId, tempData, xother_education_data);
  }

  async auditorSubmitEducationDetails(
    auditorId: number,
    data: AuditorSubmitDetailsDto
  ) {
    const { xother_education_data, nonTutorId, ...rest } = data;
    const lastData = await this.getTempData(nonTutorId);
    await this.saveTempData(nonTutorId, rest, xother_education_data);
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
    const details = await this.getTempData(nonTutorId);
    const approvedDetails = await this.getApprovedData(nonTutorId);
    return { details, approvedDetails };
  }

  async getTempData(tspId: number) {
    try {
      const data = await this.prisma.hrisEducationData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          olSyllabus: true,
          olYear: true,
          olCertificateUrl: true,
          alCheck: true,
          alSyllabus: true,
          alYear: true,
          alStream: true,
          alCertificateUrl: true,
          olSyllabusRejectReason: true,
          olSyllabusStatus: true,
          olYearRejectReason: true,
          olYearStatus: true,
          olCertificateUrlRejectReason: true,
          olCertificateUrlStatus: true,
          alSyllabusRejectReason: true,
          alSyllabusStatus: true,
          alYearRejectReason: true,
          alYearStatus: true,
          alStreamRejectReason: true,
          alStreamStatus: true,
          alCertificateUrlRejectReason: true,
          alCertificateUrlStatus: true,
          xother_education_data: true
        }
      });
      if (data) {
        return {
          ...data,
          olYear: data.olYear ? data.olYear.toString() : null,
          alYear: data.alYear ? data.alYear.toString() : null
        };
      } else {
        return data;
      }
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getApprovedData(tspId: number) {
    try {
      const data = await this.prisma.approvedEducationData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          olState: true,
          olSyllabus: true,
          olYear: true,
          olMaths: true,
          olEnglish: true,
          olCertificateUrl: true,
          alSyllabus: true,
          alYear: true,
          alStream: true,
          alCertificateUrl: true,
          alSubject1: true,
          alSubject1Result: true,
          alSubject2: true,
          alSubject2Result: true,
          alSubject3: true,
          alSubject3Result: true,
          alSubject4: true,
          alSubject4Result: true,
          alSubject5: true,
          alSubject5Result: true,
          alCheck: true,
          other: true
        }
      });
      return data;
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveTempData(
    tspId: number,
    tempData,
    xother_education_data,
    auditorId?: number
  ) {
    try {
      const now = new Date().toISOString();
      const educationData = await this.prisma.hrisEducationData.create({
        data: {
          tspId,
          ...tempData,
          olYear: tempData.olYear ? +tempData.olYear : null,
          alYear: tempData.alYear ? +tempData.alYear : null,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: auditorId ? now : null,
          auditedBy: auditorId ? auditorId : null
        }
      });
      if (tempData.alCheck != 'no') {
        await this.prisma.xotherEducationData.createMany({
          data: xother_education_data.map(({ ...xother }) => {
            return {
              ...xother,
              eId: educationData.id
            };
          })
        });
      }
      await this.prisma.nTHRISProfileProgress.upsert({
        where: {
          tspId: tspId
        },
        update: {
          educationSectionFilled: true,
          lastFilledSection: 'education'
        },
        create: {
          tspId: tspId,
          educationSectionFilled: true,
          lastFilledSection: 'education'
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveApprovedData(auditorId: number, data) {
    console.log(data);
    try {
      const now = new Date().toISOString();
      return await this.prisma.approvedEducationData.upsert({
        where: {
          tspId: data.tspId
        },
        update: {
          ...data,
          olYear: data.olYear ? +data.olYear : null,
          alYear: data.alYear ? +data.alYear : null,
          approvedAt: now,
          approvedBy: auditorId
        },
        create: {
          ...data,
          olYear: data.olYear ? +data.olYear : null,
          alYear: data.alYear ? +data.alYear : null,
          approvedAt: now,
          approvedBy: auditorId
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
