import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AuditorSubmitRightToWorkDetailsDto,
  RightToWorkDataDto
} from './right-to-work.dto';
import { CommonService } from '../../../common/common.service';

@Injectable()
export class RightToWorkService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService
  ) {}

  async fetchRightToWorkDetails(tspId: number) {
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

  async saveRightToWorkDetails(tspId: number, data: RightToWorkDataDto) {
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

  async auditorSubmitRightToWorkDetails(
    tspId: number,
    data: AuditorSubmitRightToWorkDetailsDto
  ) {
    const now = new Date().toISOString();
    const { id, type, country, nonTutorId, profileStatus, ...rest } = data;

    let lastData = await this.prisma.hrisRight2workData.findFirst({
      where: {
        tspId: nonTutorId
      },
      orderBy: {
        id: 'desc'
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisRight2workData.create({
        data: {
          tspId: nonTutorId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const rightToWorkData = await tx.hrisRight2workData.create({
        data: {
          tspId: nonTutorId,
          ...rest,
          pccExpireDate: rest.pccExpireDate !== '' ? rest.pccExpireDate : null,
          pccIssuedDate: rest.pccIssuedDate !== '' ? rest.pccIssuedDate : null,
          gsIssuedDate: rest.gsIssuedDate !== '' ? rest.gsIssuedDate : null,
          pccUploadedAt:
            ![null, ''].includes(rest.pccUrl) &&
            (!lastData || rest.pccUrl != lastData?.pccUrl)
              ? now
              : lastData?.pccUploadedAt ?? null,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
        },
        select: {
          contractUrl: true,
          contractUrlStatus: true,
          contractUrlRejectReason: true,
          gsIssuedDate: true,
          gsIssuedDateStatus: true,
          gsIssuedDateRejectReason: true,
          gsUrl: true,
          gsUrlStatus: true,
          gsUrlRejectReason: true,
          pccIssuedDate: true,
          pccIssuedDateStatus: true,
          pccIssuedDateRejectReason: true,
          pccReferenceNo: true,
          pccReferenceNoStatus: true,
          pccReferenceNoRejectReason: true,
          pccUrl: true,
          pccUrlStatus: true,
          pccUrlRejectReason: true,
          pccExpireDate: true,
          pccUploadedAt: true,
          pccState: true,
          recordApproved: true
        }
      });

      let previousApprovedData = await tx.approvedRight2workData.findUnique({
        where: {
          tspId: nonTutorId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedRight2workData.create({
          data: {
            tspId: nonTutorId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }
      let fieldsAudited = ['gsUrlStatus', 'pccUrlStatus'];
      if (data.country === 'India') {
        fieldsAudited = [
          ...fieldsAudited,
          'gsIssuedDateStatus',
          'pccIssuedDateStatus',
          'pccReferenceNoStatus'
        ];
      }

      let notAuditingFields = {};
      let auditingFields = {};
      let customAuditingFields = {};
      if (previousApprovedData && lastData) {
        notAuditingFields = Object.entries(previousApprovedData)
          .filter(([key]) => !Object.keys(lastData).includes(key + 'Status'))
          .reduce((prev, [key, value]) => {
            prev[key as string] = data[key];
            return prev;
          }, {} as any);

        auditingFields = Object.entries(previousApprovedData)
          .filter(([key]) => Object.keys(lastData).includes(key + 'Status'))
          .reduce((prev, [key, value]) => {
            if (data[key + 'Status'] === 'approved') {
              prev[key as string] = data[key];
            } else if (!fieldsAudited.includes(key + 'Status')) {
              prev[key as string] = data[key];
            } else {
              prev[key as string] = value;
            }
            return prev;
          }, {} as any);

        customAuditingFields =
          rest.gsUrlStatus === 'approved'
            ? {
                ...customAuditingFields,
                gsIssuedDate: rest.gsIssuedDate
              }
            : {
                ...customAuditingFields,
                gsIssuedDate: previousApprovedData.gsIssuedDate
              };
        // based on pccUrlStatus, approve related fields
        customAuditingFields =
          rest.pccUrlStatus === 'approved'
            ? {
                ...customAuditingFields,
                pccIssuedDate: rest.pccIssuedDate,
                pccReferenceNo: rest.pccReferenceNo,
                pccExpireDate: rest.pccExpireDate,
                pccUploadedAt:
                  ![null, ''].includes(rest.pccUrl) &&
                  (!lastData || rest.pccUrl != lastData?.pccUrl)
                    ? now
                    : lastData?.pccUploadedAt ?? null,
                pccState: rest.pccState
              }
            : {
                ...customAuditingFields,
                pccIssuedDate: previousApprovedData.pccIssuedDate,
                pccReferenceNo: previousApprovedData.pccReferenceNo,
                pccExpireDate: previousApprovedData.pccExpireDate,
                pccUploadedAt:
                  ![null, ''].includes(rest.pccUrl) &&
                  (!lastData || rest.pccUrl != lastData?.pccUrl)
                    ? now
                    : lastData?.pccUploadedAt ?? null,
                pccState: previousApprovedData.pccState
              };
      }
      await tx.approvedRight2workData.update({
        where: { tspId: nonTutorId },
        data: {
          ...notAuditingFields,
          ...auditingFields,
          ...customAuditingFields,
          approvedAt: now,
          approvedBy: tspId
        }
      });

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (rightToWorkData[curr] &&
          ['approved', 'rejected'].includes(rightToWorkData[curr])
            ? 1
            : 0)
        );
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          right2workInfoAuditor: auditedFieldCount
        },
        create: {
          tspId,
          right2workInfoAuditor: auditedFieldCount
        }
      });

      const details = await tx.hrisRight2workData.findFirst({
        where: {
          tspId: nonTutorId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          contractUrl: true,
          contractUrlStatus: true,
          contractUrlRejectReason: true,
          gsIssuedDate: true,
          gsIssuedDateStatus: true,
          gsIssuedDateRejectReason: true,
          gsUrl: true,
          gsUrlStatus: true,
          gsUrlRejectReason: true,
          pccIssuedDate: true,
          pccIssuedDateStatus: true,
          pccIssuedDateRejectReason: true,
          pccReferenceNo: true,
          pccReferenceNoStatus: true,
          pccReferenceNoRejectReason: true,
          pccUrl: true,
          pccUrlStatus: true,
          pccUrlRejectReason: true,
          pccExpireDate: true,
          pccUploadedAt: true,
          pccState: true,
          recordApproved: true
        }
      });

      const approvedDetails = await tx.approvedRight2workData.findUnique({
        where: {
          tspId: nonTutorId
        },
        select: {
          contractUrl: true,
          gsIssuedDate: true,
          gsUrl: true,
          pccIssuedDate: true,
          pccReferenceNo: true,
          pccUrl: true,
          pccExpireDate: true,
          pccState: true
        }
      });

      return { details, approvedDetails };
    });
  }

  async getTempData(tspId: number) {
    try {
      return await this.prisma.hrisRight2workData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          contractStartDate: true,
          contractStartDateRejectReason: true,
          contractStartDateStatus: true,
          contractEndDate: true,
          contractEndDateRejectReason: true,
          contractEndDateStatus: true,
          contractType: true,
          contractTypeRejectReason: true,
          contractTypeStatus: true,
          contractUrl: true,
          contractUrlRejectReason: true,
          contractUrlStatus: true,
          requireBackgroundCheck: true,
          gsIssuedDate: true,
          gsIssuedDateRejectReason: true,
          gsIssuedDateStatus: true,
          gsUrl: true,
          gsUrlRejectReason: true,
          gsUrlStatus: true,
          pccState: true,
          pccReferenceNo: true,
          pccIssuedDate: true,
          pccExpireDate: true,
          pccUrl: true,
          pccUrlRejectReason: true,
          pccUrlStatus: true
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getApprovedData(tspId: number) {
    try {
      return await this.prisma.approvedRight2workData.findMany({
        where: {
          tspId: tspId
        },
        select: {
          contractStartDate: true,
          contractEndDate: true,
          contractType: true,
          contractUrl: true,
          requireBackgroundCheck: true,
          gsIssuedDate: true,
          gsUrl: true,
          pccState: true,
          pccReferenceNo: true,
          pccIssuedDate: true,
          pccExpireDate: true,
          pccUrl: true
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveTempData(
    tspId: number,
    tempData: RightToWorkDataDto,
    auditorId?: number
  ) {
    try {
      const now = new Date().toISOString();
      await this.prisma.hrisRight2workData.create({
        data: {
          tspId,
          ...tempData,
          contractStartDate:
            tempData.contractStartDate !== ''
              ? new Date(tempData.contractStartDate)
              : null,
          contractEndDate:
            tempData.contractEndDate !== ''
              ? new Date(tempData.contractEndDate)
              : null,
          gsIssuedDate:
            tempData.gsIssuedDate !== ''
              ? new Date(tempData.gsIssuedDate)
              : null,
          pccIssuedDate:
            tempData.pccIssuedDate !== ''
              ? new Date(tempData.pccIssuedDate)
              : null,
          pccExpireDate:
            tempData.pccExpireDate !== ''
              ? new Date(tempData.pccExpireDate)
              : null,
          pccUploadedAt: ![null, ''].includes(tempData.pccUrl) ? now : null,
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
          r2wSectionFilled: true,
          lastFilledSection: 'r2w'
        },
        create: {
          tspId: tspId,
          r2wSectionFilled: true,
          lastFilledSection: 'r2w'
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveApprovedData(auditorId: number, data) {
    try {
      const now = new Date().toISOString();
      return await this.prisma.approvedRight2workData.upsert({
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
