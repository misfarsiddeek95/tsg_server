import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  BankDataAuditDto,
  FetchBankBranchesDto,
  BankDataDto
} from './bank.dto';
import { CommonService } from '../../../common/common.service';

@Injectable()
export class BankService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService
  ) {}

  async fetchBankDetails(tspId: number) {
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

  async saveBankDetails(tspId: number, data: BankDataDto) {
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

  async auditorSubmitDetails(auditorId: number, data: BankDataAuditDto) {
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

  async fetchBankBranches({ bankName }: FetchBankBranchesDto) {
    try {
      const bankBranches = await this.prisma.banks.findMany({
        where: {
          bank_name: { contains: bankName }
        }
      });
      return {
        success: true,
        data: bankBranches.map((bank) => {
          return {
            bankName: bankName,
            branchName: bank.bank_name.replace(bankName + ' ', ''),
            bankCode: bank.bank_code,
            swiftCode: bank.bank_swift_code,
            branchCode: bank.branch_code
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getTempData(tspId: number) {
    try {
      return await this.prisma.hrisBankData.findFirst({
        where: {
          tspId
        },
        select: {
          bankName: true,
          bankNameStatus: true,
          bankNameRejectReason: true,
          bBranch: true,
          bBranchStatus: true,
          bBranchRejectReason: true,
          bBranchCode: true,
          bAccountNo: true,
          bAccountNoStatus: true,
          bAccountNoRejectReason: true,
          bAccountName: true,
          bAccountNameStatus: true,
          bAccountNameRejectReason: true,
          bSwift: true,
          bPassbookUrl: true,
          bPassbookUrlStatus: true,
          bPassbookUrlRejectReason: true
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
      return await this.prisma.approvedBankData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          bankName: true,
          bBranch: true,
          bBranchCode: true,
          bAccountNo: true,
          bAccountName: true,
          bSwift: true
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveTempData(tspId: number, tempData: BankDataDto, auditorId?: number) {
    try {
      const now = new Date().toISOString();
      await this.prisma.hrisBankData.create({
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
          bankSectionFilled: true,
          lastFilledSection: 'bank'
        },
        create: {
          tspId: tspId,
          bankSectionFilled: true,
          lastFilledSection: 'bank'
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveApprovedData(auditorId: number, data) {
    try {
      const now = new Date().toISOString();
      return await this.prisma.approvedBankData.upsert({
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
