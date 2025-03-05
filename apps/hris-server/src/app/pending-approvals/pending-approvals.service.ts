import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  FilterValuesDto,
  UpdatePendingApprovalsDto
} from './pending-approvals.dto';
import moment = require('moment');

@Injectable()
export class PendingApprovalsService {
  constructor(private prisma: PrismaService) {}

  async getJobRequisitionPendingCandidates(updaterId: number) {
    try {
      const [jobRequisitionData, contractDetailsData] = await Promise.all([
        await this.prisma.approvedJobRequisition.findMany({
          where: {
            updatedBy: +updaterId,
            approvalStatus: 'pending'
          },
          select: {
            tspId: true,
            batch: true,
            department: true,
            division: true,
            center: true,
            jobTitle: true,
            tutorLine: true,
            updatedAt: true,
            approvalStatus: true
          }
        }),
        await this.prisma.approvedContractData.findMany({
          where: {
            updated_by: +updaterId,
            hr_admin_approval: 'pending'
          },
          select: {
            tsp_id: true,
            contract_no: true,
            contract_type: true,
            contract_start_d: true,
            contract_end_d: true
          }
        })
      ]);

      const jobRequisitionTspIds = jobRequisitionData.map((data) => data.tspId);

      const contractDetailsTspIds = contractDetailsData.map(
        (data) => +data.tsp_id
      );

      const tspIds = jobRequisitionTspIds.concat(contractDetailsTspIds);

      const pendingApprovalCandidates = [...new Set(tspIds)];

      const candidateAuditors = await this.prisma.hrisProgress.findMany({
        where: {
          tspId: { in: pendingApprovalCandidates }
        },
        select: {
          tspId: true,
          user: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              },
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              user_hris_progress: {
                select: {
                  tutorStatus: true
                }
              }
            }
          },
          auditor: {
            select: {
              tsp_id: true,
              approved_personal_data: {
                select: {
                  tspId: true,
                  shortName: true
                }
              }
            }
          }
        }
      });

      const candidateList = [];
      candidateAuditors.map((el) => {
        const jrData = jobRequisitionData.find(
          (user) => user.tspId === el.tspId
        );

        const cdData = contractDetailsData.find(
          (user) => user.tsp_id === el.tspId
        );
        const pending = {
          tspId: el.tspId,
          candidateName: el.user?.approved_personal_data?.shortName ?? '',
          auditor: el.auditor?.approved_personal_data?.shortName ?? '',
          auditorId: el.auditor?.tsp_id ?? '',
          jobRequisitionData: jrData ?? null,
          contractDetailsData: cdData ?? null,
          date: jrData ? jrData.updatedAt : null,
          approvalStatus: jrData ? jrData.approvalStatus : null,
          email: el.user?.approved_contact_data?.workEmail ?? '',
          auditStatus: el.user?.user_hris_progress?.tutorStatus
            ? el.user?.user_hris_progress?.tutorStatus
            : null
        };
        candidateList.push(pending);
      });

      return candidateList;
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async updateJobReqStatus(
    approvalStatus: UpdatePendingApprovalsDto,
    user: any
  ): Promise<any> {
    try {
      const { tspIds, ...rest } = approvalStatus;
      if (tspIds.length <= 0) {
        throw new Error('Please select candiates.');
      }
      if (rest.approvalStatus == '' || rest.approvalStatus == undefined) {
        throw new Error('Your approval status is wrong.');
      }
      const updateStatus = await this.prisma.approvedJobRequisition.updateMany({
        where: {
          tspId: { in: tspIds }
        },
        data: {
          approvalStatus: approvalStatus.approvalStatus,
          approvedBy: user.userId,
          approvedAt: new Date().toISOString()
        }
      });
      const findUpdaterId = await this.prisma.approvedJobRequisition.findUnique(
        {
          where: {
            tspId: tspIds[0]
          },
          select: {
            updatedBy: true
          }
        }
      );
      const data = {
        success: true,
        data: { updatedCount: updateStatus, updaterId: findUpdaterId.updatedBy }
      };
      return data;
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async filterPendingApprovals({
    updaterId,
    auditStatus,
    approvalStatus,
    date,
    tspId,
    name,
    auditor,
    assignedStatus,
    email
  }: FilterValuesDto) {
    try {
      const isWhere =
        auditStatus ||
        approvalStatus ||
        date ||
        tspId ||
        name ||
        auditor ||
        assignedStatus ||
        email;

      const where = isWhere
        ? {
            AND: [
              {
                OR: [
                  {
                    ApprovedJobRequisition: {
                      updatedBy: +updaterId
                    }
                  },
                  {
                    approved_contract_data: {
                      updated_by: +updaterId
                    }
                  }
                ]
              }
            ],
            OR: [
              {
                tsp_id: tspId ? { equals: +tspId } : {},
                approved_personal_data: {
                  shortName: name ? { contains: name } : {}
                },
                approved_contact_data: {
                  workEmail: email ? { contains: email } : {}
                },
                user_hris_progress: {
                  tutorStatus: auditStatus ? { equals: auditStatus } : {},
                  auditorId: auditor ? { equals: +auditor } : {}
                }
                /* ApprovedJobRequisition: {
                  OR: [
                    {
                      approvalStatus: approvalStatus
                        ? { equals: approvalStatus }
                        : {},
                      updatedAt: date
                        ? {
                            gte: moment(date).startOf('date').toISOString(),
                            lt: moment(date).endOf('date').toISOString()
                          }
                        : {}
                    }
                  ]
                } */
                /* approved_contract_data: {
                  OR: [
                    {
                      hr_admin_approval: approvalStatus
                        ? { equals: approvalStatus }
                        : {},
                      updated_at: date
                        ? {
                            gte: moment(date).startOf('date').toISOString(),
                            lt: moment(date).endOf('date').toISOString()
                          }
                        : {}
                    }
                  ]
                } */
              }
            ]
          }
        : {};

      const candidates = await this.prisma.user.findMany({
        where,
        select: {
          tsp_id: true,
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          user_hris_progress: {
            select: {
              auditor: {
                select: {
                  approved_personal_data: {
                    select: {
                      shortName: true
                    }
                  }
                }
              }
            }
          },
          ApprovedJobRequisition: {
            select: {
              tspId: true,
              batch: true,
              department: true,
              division: true,
              center: true,
              jobTitle: true,
              tutorLine: true
            }
          },
          approved_contract_data: {
            select: {
              tsp_id: true,
              contract_no: true,
              contract_type: true,
              contract_start_d: true,
              contract_end_d: true
            }
          }
        }
      });
      const candidateList = [];
      candidates.map((el) => {
        const pending = {
          tspId: el.tsp_id,
          candidateName: el.approved_personal_data?.shortName ?? '',
          auditor:
            el.user_hris_progress.auditor?.approved_personal_data?.shortName ??
            '',
          jobRequisitionData: el.ApprovedJobRequisition ?? null,
          contractDetailsData: el.approved_contract_data ?? null
        };
        candidateList.push(pending);
      });

      return candidateList;
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }
}
