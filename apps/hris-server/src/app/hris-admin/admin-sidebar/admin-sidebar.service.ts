import { HttpException, Injectable } from '@nestjs/common';
import moment = require('moment');
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AdminSidebarService {
  constructor(private prisma: PrismaService) {}

  async getCountByTutorStatus() {
    try {
      const [groups, count] = await Promise.all([
        this.prisma.hrisProgress.groupBy({
          by: ['tutorStatus'],
          where: {
            profileStatus: 'inactive'
          },
          _count: {
            tspId: true
          }
        }),
        this.prisma.hrisProgress.count({
          where: {
            profileStatus: 'inactive'
          }
        })
      ]);

      return {
        success: true,
        data: {
          groups: groups.map((status) => {
            return {
              count: status._count.tspId,
              group: status.tutorStatus
            };
          }),
          count
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async activateProfilesByTutorStatus(tutorStatus: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.hrisProgress.updateMany({
          where: {
            profileStatus: 'inactive',
            tutorStatus
          },
          data: {
            profileStatus: 'active'
          }
        });
      });
      return { success: true };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //! Grouping condition is not clear wanna get clear that requirement is to group with the date range within the satisfied data
  async getCountByContractDetailsEntry() {
    try {
      // * * Check weather a record is exist in the approved contract details table
      const contractDetailsExist =
        await this.prisma.approvedContractData.findMany({
          select: {
            tsp_id: true
          }
        });

      const existingTspIds = contractDetailsExist.map((data) => {
        return data.tsp_id;
      });

      const [contractDetailsEntryData, contractDetailsEntryCount] =
        await Promise.all([
          this.prisma.hrisProgress.groupBy({
            by: ['updatedAt'],
            where: {
              profileStatus: 'active',
              tspId: {
                notIn: existingTspIds
              },
              user: {
                ApprovedJobRequisition: {
                  approvalStatus: 'approved'
                }
              }
            },
            _count: {
              tspId: true
            }
          }),
          this.prisma.hrisProgress.count({
            where: {
              profileStatus: 'active',
              tspId: {
                notIn: existingTspIds
              },
              user: {
                ApprovedJobRequisition: {
                  approvalStatus: 'approved'
                }
              }
            }
          })
        ]);

      return {
        success: true,
        contractDetailsEntryData: contractDetailsEntryData.map((data) => {
          return {
            groupName: data.updatedAt,
            count: data._count.tspId
          };
        }),
        contractDetailsEntryCount
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getCountByEntryJobRequisition() {
    try {
      const [groups, count] = await Promise.all([
        this.prisma.hrisProgress.groupBy({
          by: ['initialAuditPassDate'],
          where: {
            tutorStatus: 'initial audit pass'
          },
          _count: {
            tspId: true
          }
        }),
        this.prisma.hrisProgress.count({
          where: {
            tutorStatus: 'initial audit pass'
          }
        })
      ]);

      return {
        success: true,
        data: groups.map((group) => {
          return {
            count: group._count.tspId,
            groupName:
              group.initialAuditPassDate ?? moment().format('YYYY-MM-DD')
          };
        }),
        count
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getEntryJobRequisitionUserGroupData(groupName: string) {
    try {
      const userGroup = await this.prisma.hrisProgress.findMany({
        where: {
          tutorStatus: 'initial audit pass',

          initialAuditPassDate: {
            gt: moment(groupName).startOf('date').toISOString(),
            lte: moment(groupName).endOf('date').toISOString()
          }
        },
        select: {
          tspId: true,
          user: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          auditor: {
            select: {
              tsp_id: true,
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });

      return {
        success: true,
        userGroup: userGroup.map((user) => {
          return {
            tspId: user.tspId ?? '',
            name: user.user?.approved_personal_data?.shortName ?? '',
            auditorName: user.auditor?.approved_personal_data?.shortName ?? '',
            auditorId: user.auditor?.tsp_id ?? ''
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getTutorProfileStatus(startDate: string, endDate: string) {
    try {
      const [
        profileStatusGroups,
        profileStatusCount,
        initialAuditData,
        initialAuditCount,
        finalAuditData,
        finalAuditCount,
        assignedCount,
        pendingCount,
        remainingCount,
        auditors
      ] = await Promise.all([
        await this.prisma.hrisProgress.groupBy({
          by: ['profileStatus'],
          where: {
            OR: [
              {
                profileStatus: 'active'
              },
              {
                profileStatus: 'inactive'
              },
              {
                profileStatus: 'rejected'
              }
            ]
          },
          _count: {
            tspId: true
          }
        }),
        await this.prisma.hrisProgress.count({
          where: {
            OR: [
              {
                profileStatus: 'active'
              },
              {
                profileStatus: 'inactive'
              },
              {
                profileStatus: 'rejected'
              }
            ]
          }
        }),
        await this.prisma.hrisProgress.groupBy({
          by: ['tutorStatus'],
          where: {
            OR: [
              {
                tutorStatus: 'audit pending'
              },
              {
                tutorStatus: 'initial audit pass'
              },
              {
                tutorStatus: 'initial audit fail'
              },
              {
                tutorStatus: 'initial audit reject'
              }
            ]
          },
          _count: {
            tspId: true
          }
        }),
        await this.prisma.hrisProgress.count({
          where: {
            OR: [
              {
                tutorStatus: 'audit pending'
              },
              {
                tutorStatus: 'initial audit pass'
              },
              {
                tutorStatus: 'initial audit fail'
              },
              {
                tutorStatus: 'initial audit reject'
              }
            ]
          }
        }),
        await this.prisma.hrisProgress.groupBy({
          by: ['tutorStatus'],
          where: {
            OR: [
              {
                tutorStatus: 'final audit pass'
              },
              {
                tutorStatus: 'final audit fail'
              }
            ]
          },
          _count: {
            tspId: true
          }
        }),
        await this.prisma.hrisProgress.count({
          where: {
            OR: [
              {
                tutorStatus: 'final audit pass'
              },
              {
                tutorStatus: 'final audit fail'
              }
            ]
          }
        }),
        await this.prisma.hrisProgress.groupBy({
          //assigned
          by: ['auditorId'],
          where: {
            auditorId: {
              not: null
            }
          },
          _count: {
            tspId: true
          }
        }),
        await this.prisma.hrisProgress.groupBy({
          //completed
          by: ['auditorId'],
          where: {
            auditorId: {
              not: null
            },
            tutorStatus: {
              notIn: ['audit pending']
            }
          },
          _count: {
            tspId: true
          }
        }),
        await this.prisma.hrisProgress.groupBy({
          //remaining
          by: ['auditorId'],
          where: {
            auditorId: {
              not: null
            },
            tutorStatus: {
              in: ['audit pending']
            }
          },
          _count: {
            tspId: true
          }
        }),
        await this.prisma.hrisAccess.findMany({
          where: {
            access: 1,
            module: 'AUDITOR'
          },
          select: {
            tsp_id: true,
            user: {
              select: {
                approved_personal_data: {
                  select: {
                    shortName: true
                  }
                }
              }
            }
          }
        })
      ]);

       const auditorsAuditData = auditors.map((user) => {
        return {
          tspId: user.tsp_id,
          name: user.user?.approved_personal_data?.shortName ?? ''
        };
      });

      const assignedCountObj = assignedCount.reduce((prev, curr) => {
        prev[curr.auditorId] = curr._count.tspId;
        return prev;
      }, {});

      const pendingCountObj = pendingCount.reduce((prev, curr) => {
        prev[curr.auditorId] = curr._count.tspId;
        return prev;
      }, {});

      const remainingCountObj = remainingCount.reduce((prev, curr) => {
        prev[curr.auditorId] = curr._count.tspId;
        return prev;
      }, {});

      const auditorProfileStatsChartData = auditorsAuditData.map((auditor) => {
        return {
          ...auditor,
          assignedCount: assignedCountObj[auditor.tspId] ?? 0,
          pendingCount: pendingCountObj[auditor.tspId] ?? 0,
          remainingCount: remainingCountObj[auditor.tspId] ?? 0
        };
      });

      return {
        success: true,
        profileStatusCount,
        profileStatusData: profileStatusGroups.map((group) => {
          return {
            count: group._count.tspId,
            groupName: group.profileStatus
          };
        }),
        initialAuditCount,
        initialAuditData: initialAuditData.map((data) => {
          return {
            count: data._count.tspId,
            groupName: data.tutorStatus
          };
        }),
        finalAuditCount,
        finalAuditData: finalAuditData.map((data) => {
          return {
            count: data._count.tspId,
            groupName: data.tutorStatus
          };
        }),
        auditorProfileStatsChartData
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getPendingApprovalsCountByHrUser() {
    try {
      const hrUsers = await this.prisma.hrisAccess.findMany({
        where: {
          access: 1,
          module: { contains: 'HR_USER' }
        },
        select: {
          tsp_id: true,
          user: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });

      const hrUserIds = hrUsers.map((user) => {
        return user.tsp_id;
      });

      const hrUserIdsContractData = hrUsers.map((user) => {
        return user.tsp_id;
      });

      const [
        pendingApprovalsJobRequisition,
        pendingApprovalsJobRequisitionCount,
        pendingApprovalsContractDetails,
        pendingApprovalsContractDetailsCount
      ] = await Promise.all([
        await this.prisma.approvedJobRequisition.groupBy({
          by: ['updatedBy'],
          where: {
            updatedBy: {
              in: hrUserIds
            },
            approvalStatus: 'pending'
          },
          _count: {
            tspId: true
          }
        }),
        await this.prisma.approvedJobRequisition.count({
          where: {
            updatedBy: {
              in: hrUserIds
            },
            approvalStatus: 'pending'
          }
        }),
        await this.prisma.approvedContractData.groupBy({
          by: ['updated_by'],
          where: {
            updated_by: {
              in: hrUserIdsContractData
            },
            hr_admin_approval: 'pending'
          },
          _count: {
            tsp_id: true
          }
        }),
        await this.prisma.approvedContractData.count({
          where: {
            updated_by: {
              in: hrUserIdsContractData
            },
            hr_admin_approval: 'pending'
          }
        })
      ]);

      const pendingApprovalsJobRequisitionByTspId =
        pendingApprovalsJobRequisition.reduce((prev, curr, index) => {
          prev[curr.updatedBy] = curr._count.tspId;
          return prev;
        }, {});

      const jobRequisitionIds = Object.keys(
        pendingApprovalsJobRequisitionByTspId
      );

      const pendingApprovalsContractDetailsByTspId =
        pendingApprovalsContractDetails.reduce((prev, curr, index) => {
          prev[curr.updated_by] = curr._count.tsp_id;
          return prev;
        }, {});

      const contractDetailsIds = Object.keys(
        pendingApprovalsContractDetailsByTspId
      );

      const pendingApprovalsData = hrUsers
        .filter(
          (user) =>
            jobRequisitionIds.includes(`${user.tsp_id}`) ||
            contractDetailsIds.includes(`${user.tsp_id}`)
        )
        .map((user) => {
          const jrCount =
            pendingApprovalsJobRequisitionByTspId[user.tsp_id] ?? 0;

          const cdCount =
            pendingApprovalsContractDetailsByTspId[user.tsp_id] ?? 0;

          return {
            hrUserId: user.tsp_id,
            hrUserName: user.user?.approved_personal_data?.shortName ?? '',
            pendingCount: jrCount + cdCount
          };
        });

      return {
        success: true,
        pendingApprovals: pendingApprovalsData,
        pendingApprovalsCount:
          pendingApprovalsJobRequisitionCount +
          pendingApprovalsContractDetailsCount
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getPendingApprovalCandidateData(hrUserId: string) {
    try {
      const [jobRequisitionData, contractDetailsData] = await Promise.all([
        await this.prisma.approvedJobRequisition.findMany({
          where: {
            updatedBy: +hrUserId,
            approvalStatus: 'pending'
          },
          select: {
            tspId: true,
            batch: true,
            department: true,
            division: true,
            center: true,
            jobTitle: true,
            tutorLine: true
          }
        }),
        await this.prisma.approvedContractData.findMany({
          where: {
            updated_by: +hrUserId,
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

      const candidateDetails = await this.prisma.hrisProgress.findMany({
        where: {
          tspId: {
            in: pendingApprovalCandidates
          }
        },
        select: {
          tspId: true,
          user: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
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
      });

      const candidatesList = candidateDetails.map((data) => {
        const jrData = jobRequisitionData.find(
          (user) => user.tspId === data.tspId
        );

        const cdData = contractDetailsData.find(
          (user) => user.tsp_id === data.tspId
        );

        return {
          tspId: data.tspId,
          candidateName: data.user?.approved_personal_data?.shortName ?? '',
          auditor: data.auditor?.approved_personal_data?.shortName ?? '',
          jobRequisitionData: jrData ?? null,
          contractDetailsData: cdData ?? null
        };
      });

      return { success: true, data: candidatesList };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async pendingApprovalByHrUsers(updatedBy: string, tspId: string) {
    try {
      await this.prisma.approvedJobRequisition.updateMany({
        where: {
          updatedBy: +updatedBy,
          approvalStatus: 'pending'
        },
        data: {
          approvalStatus: 'approved',
          approvedBy: +tspId,
          approvedAt: moment().toISOString()
        }
      });

      return { success: true };
    } catch (error) {
      throw new HttpException({ success: true, error }, 400);
    }
  }

  async pendingApprovalUserList() {
    try {
      return;
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getContractDetailsEntryCandidateList(groupName: string) {
    try {
      const candidates = await this.prisma.hrisProgress.findMany({
        where: {
          updatedAt: groupName
        },
        select: {
          tspId: true,
          user: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
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
      });

      return {
        success: true,
        data: candidates.map((candidate) => {
          return {
            tspId: candidate.tspId,
            name: candidate?.user?.approved_personal_data?.shortName ?? '',
            auditorName:
              candidate?.auditor?.approved_personal_data?.shortName ?? ''
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
