import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import {
  BankSubmitDetailsDto,
  AuditorBankSubmitDetails,
  FetchBankBranchesDto
} from './bank-details.dto';

@Injectable()
export class BankDetailsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  //Tutor: Fetch bank details
  async fetchDetails(tspId: number) {
    try {
      const approvedDetails = await this.prisma.approvedBankData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          bankName: true,
          bBranch: true,
          bBranchCode: true,
          bAccountNo: true,
          bAccountName: true,
          bSwift: true,
          bPassbookUrl: true,
          ifscCode: true,
          ibanNumber: true,
          bankStatus: true
        }
      });

      const details = await this.prisma.hrisBankData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        }
      });

      return {
        success: true,
        data: {
          details,
          approvedDetails
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  /**
   *  TODO: Bank
   *  - take last record belongs to candidate - tspId
   *
   *  - for SL: generate branchcode & swift based on bank name & branch name
   *
   *  - copy last reasons to the new row
   *  - change status of related status field to pending if last field value with current data field value
   */

  //Tutor: Submit Bank Details
  async submitDetails(tspId: number, data: BankSubmitDetailsDto) {
    const { id, type, country, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    const lastData = await this.prisma.hrisBankData.findFirst({
      where: {
        tspId
      },
      orderBy: {
        id: 'desc'
      }
    });

    let lastDataReasons = {};
    let updatedStatus = {};
    let gotPendingFields = false; //logic to trigger email notification to hris@ticketsthirdspaceportal.com

    if (lastData) {
      lastDataReasons = Object.entries(lastData)
        .filter(
          ([key, value]) => value !== null && key.includes('RejectReason')
        )
        .reduce((prev, [key, value]) => {
          prev[key] = value;
          return prev;
        }, {});

      updatedStatus = Object.entries(lastData)
        .filter(([key]) => key.includes('Status'))
        .map(([key, value]) => {
          const field = key.replace('Status', '');
          const newStatus = lastData[field] !== data[field] ? 'pending' : value;
          gotPendingFields = newStatus === 'pending' || gotPendingFields;
          return [key, newStatus];
        })
        .reduce((prev, [key, value]) => {
          // console.log(curr)
          prev[key as string] = value;
          return prev;
        }, {});
    }

    return this.prisma.$transaction(async (tx) => {
      const bankData = await tx.hrisBankData.create({
        data: {
          tspId,
          ...rest,
          ...lastDataReasons,
          ...updatedStatus,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: null,
          auditedBy: null
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
          bPassbookUrlRejectReason: true,
          bankStatus: true,
          ifscCode: true,
          ibanNumber: true,
          recordApproved: true
        }
      });

      await tx.approvedBankData.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
        }
      });

      let fieldsMandatory = [
        'bankName',
        'bBranch',
        'bAccountNo',
        'bAccountName',
        'bPassbookUrl'
      ];

      if (data.country === 'India') {
        fieldsMandatory = [
          ...fieldsMandatory,
          'bSwift',
          'bBranchCode',
          'ifscCode'
        ];
      }

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (bankData[curr] && bankData[curr] !== '' ? 1 : 0);
      }, 0);

      let bankDataCount = '';
      if (data.country === 'India') {
        bankDataCount = `${filledMandatoryFieldCount}/8`;
      } else {
        bankDataCount = `${filledMandatoryFieldCount}/5`;
      }

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          bankDataEmp: filledMandatoryFieldCount,
          bankDataCount: bankDataCount
        },
        create: {
          tspId,
          bankDataEmp: filledMandatoryFieldCount,
          bankDataCount: bankDataCount
        }
      });

      const details = await tx.hrisBankData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
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
          bPassbookUrlRejectReason: true,
          bankStatus: true,
          ifscCode: true,
          ibanNumber: true,
          recordApproved: true
        }
      });

      const hrisProgressFetched = await tx.user.findUnique({
        where: {
          tsp_id: tspId
        },
        include: {
          user_hris_progress: {
            select: {
              profileStatus: true
            }
          },
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          approved_contact_data: {
            select: {
              workEmail: true
            }
          }
        }
      });
      if (
        hrisProgressFetched &&
        hrisProgressFetched.user_hris_progress &&
        hrisProgressFetched.user_hris_progress.profileStatus &&
        hrisProgressFetched.user_hris_progress.profileStatus === 'active' &&
        gotPendingFields
      ) {
        // notify hris@ticketsthirdspaceportal.com on tutor updating key profile data
        await this.mailService.sendNotification2Ticketsthirdspaceportal(
          tspId + '',
          hrisProgressFetched?.approved_personal_data?.shortName ?? '',
          hrisProgressFetched?.approved_contact_data?.workEmail ?? '',
          'Bank Details'
        );
      }

      return details;
    });
  }

  //Auditor: Submit bank details
  async auditorSubmitDetails(tspId: number, data: AuditorBankSubmitDetails) {
    const now = new Date().toISOString();
    const { id, type, country, candidateId, profileStatus, ...rest } = data;

    let lastData = await this.prisma.hrisBankData.findFirst({
      where: {
        tspId: candidateId
      },
      orderBy: {
        id: 'desc'
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisBankData.create({
        data: {
          tspId: candidateId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const bankData = await tx.hrisBankData.create({
        data: {
          tspId: candidateId,
          ...rest,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
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
          bPassbookUrlRejectReason: true,
          bankStatus: true,
          ifscCode: true,
          ibanNumber: true,
          recordApproved: true
        }
      });

      let previousApprovedData = await tx.approvedBankData.findUnique({
        where: {
          tspId: candidateId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedBankData.create({
          data: {
            tspId: candidateId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
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
            } else {
              prev[key as string] = value;
            }
            return prev;
          }, {} as any);

        // custom logic to handle fields that depend on other fields for audit approved values
        if (data.country) {
          // based on bBranchStatus, approve related fields
          customAuditingFields =
            rest['bBranchStatus'] && rest['bBranchStatus'] === 'approved'
              ? {
                  ...customAuditingFields,
                  bBranchCode: rest.bBranchCode,
                  bSwift: rest.bSwift,
                  ifscCode: rest.ifscCode,
                  ibanNumber: rest.ibanNumber
                }
              : {
                  ...customAuditingFields,
                  bBranchCode: previousApprovedData.bBranchCode,
                  bSwift: previousApprovedData.bSwift,
                  ifscCode: previousApprovedData.ifscCode,
                  ibanNumber: previousApprovedData.ibanNumber
                };
        }
      }

      // const allApprovedFields = Object.entries(rest)
      //   .filter(
      //     ([key, value]) => key.includes('Status') && value === 'approved'
      //   )
      //   .map(([key]) => {
      //     const field = key.replace('Status', '');
      //     return [field, rest[field]];
      //   })
      //   .reduce((prev, [key, value]) => {
      //     prev[key as string] = value;
      //     return prev;
      //   }, {} as any);

      await tx.approvedBankData.update({
        where: { tspId: candidateId },
        data: {
          ...notAuditingFields,
          ...auditingFields,
          ...customAuditingFields,
          updatedFlag: 3,
          approvedAt: now,
          approvedBy: tspId
        }
      });

      let fieldsMandatory = [
        'bankName',
        'bBranch',
        'bAccountNo',
        'bAccountName',
        'bPassbookUrl'
      ];

      if (data.country === 'India') {
        fieldsMandatory = [
          ...fieldsMandatory,
          'bSwift',
          'bBranchCode',
          'ifscCode'
        ];
      }

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (bankData[curr] && bankData[curr] !== '' ? 1 : 0);
      }, 0);

      const fieldsAudited = [
        'bankNameStatus',
        'bBranchStatus',
        'bAccountNoStatus',
        'bAccountNameStatus',
        'bPassbookUrlStatus'
      ];

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (bankData[curr] && ['approved', 'rejected'].includes(bankData[curr])
            ? 1
            : 0)
        );
      }, 0);

      let bankDataCount = '';
      if (data.country === 'India') {
        bankDataCount = `${filledMandatoryFieldCount}/8`;
      } else {
        bankDataCount = `${filledMandatoryFieldCount}/5`;
      }
      await tx.hrisProgress.upsert({
        where: {
          tspId: candidateId
        },
        update: {
          bankDataEmp: filledMandatoryFieldCount,
          bankDataAuditor: auditedFieldCount,
          bankDataCount: bankDataCount
        },
        create: {
          tspId,
          bankDataEmp: filledMandatoryFieldCount,
          bankDataAuditor: auditedFieldCount,
          bankDataCount: bankDataCount
        }
      });

      const details = await tx.hrisBankData.findFirst({
        where: {
          tspId: candidateId
        },
        orderBy: {
          id: 'desc'
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
          bPassbookUrlRejectReason: true,
          bankStatus: true,
          ifscCode: true,
          ibanNumber: true,
          recordApproved: true
        }
      });

      const approvedDetails = await tx.approvedBankData.findUnique({
        where: {
          tspId: candidateId
        },
        select: {
          bankName: true,
          bBranch: true,
          bBranchCode: true,
          bAccountNo: true,
          bAccountName: true,
          bSwift: true,
          bPassbookUrl: true,
          ifscCode: true,
          ibanNumber: true,
          bankStatus: true
        }
      });

      return { details, approvedDetails };
    });
  }

  //Fetch Bank Branch Details
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
}
