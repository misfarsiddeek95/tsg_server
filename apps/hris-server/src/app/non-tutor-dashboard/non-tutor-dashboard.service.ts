import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import moment = require('moment');

@Injectable()
export class NonTutorDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardChartData() {
    const today = moment().toISOString();

    try {
      const assignedProfileCount = await this.prisma.hrisProgress.count({
        where: {
          auditorId: {
            not: null
          }
        }
      });

      const assignedAuditors = await this.prisma.hrisProgress.groupBy({
        by: ['auditorId'],
        where: {
          auditorId: {
            not: null
          }
        },
        _count: {
          tspId: true
        }
      });

      const auditCompetedCount = await this.prisma.hrisProgress.count({
        where: {
          tutorStatus: { equals: 'final audit pass' }
        }
      });

      const auditCompletedAuditors = await this.prisma.hrisProgress.groupBy({
        by: ['auditorId'],
        where: {
          tutorStatus: { equals: 'final audit pass' }
        },
        _count: {
          tspId: true
        }
      });

      const submittedAndNotAssignedToday = await this.prisma.hrisProgress.count(
        {
          where: {
            tutorStatus: 'audit pending',
            auditorId: null
          }
        }
      );

      const submittedAndNotAssignedToAuditors =
        await this.prisma.hrisProgress.groupBy({
          by: ['auditorId'],
          where: {
            tutorStatus: 'audit pending',
            auditorId: null
          },
          _count: {
            tspId: true
          }
        });

      const submittedAndAssignedToday = await this.prisma.hrisProgress.count({
        where: {
          tutorStatus: {
            not: 'audit pending'
          },
          auditorId: {
            not: null
          },
          auditorAssignedAt: {
            gt: moment(today).startOf('date').toISOString(),
            lte: moment(today).endOf('date').toISOString()
          }
        }
      });

      const submittedAndAssignedToAuditorsToday =
        await this.prisma.hrisProgress.groupBy({
          by: ['auditorId'],
          where: {
            tutorStatus: {
              not: 'audit pending'
            },
            auditorId: {
              not: null
            },
            auditorAssignedAt: {
              gt: moment(today).startOf('date').toISOString(),
              lte: moment(today).endOf('date').toISOString()
            }
          },
          _count: {
            tspId: true
          }
        });

      const initialAudit = await this.prisma.hrisProgress.groupBy({
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
        },
        orderBy: {
          tutorStatus: 'asc'
        }
      });

      const contractAudit = await this.prisma.hrisProgress.groupBy({
        by: ['tutorStatus'],
        where: {
          OR: [
            {
              tutorStatus: 'contract audit pass'
            },
            {
              tutorStatus: 'contract audit fail'
            }
          ]
        },
        _count: {
          tspId: true
        },
        orderBy: {
          tutorStatus: 'asc'
        }
      });

      const finalAudit = await this.prisma.hrisProgress.groupBy({
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
        },
        orderBy: {
          tutorStatus: 'asc'
        }
      });

      const activeTutorProfilesCount = await this.prisma.hrisProgress.count({
        where: {
          profileStatus: 'active'
        }
      });

      const rejectedTutorProfilesCount = await this.prisma.hrisProgress.count({
        where: {
          tutorStatus: 'initial audit reject'
        }
      });

      const pendingTutorProfilesCount = await this.prisma.hrisProgress.count({
        where: {
          tutorStatus: {
            in: ['inactive', 'onboarding ready']
          }
        }
      });

      const initialAuditPending = initialAudit.find(
        (group) => group.tutorStatus === 'audit pending'
      );

      const initialAuditPass = initialAudit.find(
        (group) => group.tutorStatus === 'initial audit pass'
      );

      const initialAuditFail = initialAudit.find(
        (group) => group.tutorStatus === 'initial audit fail'
      );

      const initialAuditRejected = initialAudit.find(
        (group) => group.tutorStatus === 'initial audit reject'
      );

      const contractAuditPass = contractAudit.find(
        (group) => group.tutorStatus === 'contract audit pass'
      );

      const contractAuditFail = contractAudit.find(
        (group) => group.tutorStatus === 'contract audit fail'
      );

      const finalAuditPass = finalAudit.find(
        (group) => group.tutorStatus === 'final audit pass'
      );

      const finalAuditFail = finalAudit.find(
        (group) => group.tutorStatus === 'final audit fail'
      );

      const profilesPerAuditor = [];

      assignedAuditors.map((auditor) => {
        profilesPerAuditor.push(auditor._count.tspId);
      });

      const profileCompletedByAuditor = [];

      auditCompletedAuditors.map((auditor) => {
        profileCompletedByAuditor.push(auditor._count.tspId);
      });

      const assignedAndRemainingByAuditors = [];

      submittedAndNotAssignedToAuditors.map((auditor) => {
        assignedAndRemainingByAuditors.push(auditor._count.tspId);
      });

      const submittedAndAssignedByAuditors = [];

      submittedAndAssignedToAuditorsToday.map((auditor) => {
        submittedAndAssignedByAuditors.push(auditor._count.tspId);
      });

      return {
        success: true,
        data: {
          assignedProfileCount,
          auditCompetedCount,
          submittedAndNotAssignedToday,
          submittedAndAssignedToday,
          initialAuditPendingCount: initialAuditPending?._count?.tspId ?? 0,
          initialAuditPassCount: initialAuditPass?._count?.tspId ?? 0,
          initialAuditFailCount: initialAuditFail?._count?.tspId ?? 0,
          initialAuditRejectedCount: initialAuditRejected?._count?.tspId ?? 0,
          contractAuditPassCount: contractAuditPass?._count?.tspId ?? 0,
          contractAuditFailCount: contractAuditFail?._count?.tspId ?? 0,
          finalAuditPassCount: finalAuditPass?._count?.tspId ?? 0,
          finalAuditFailCount: finalAuditFail?._count?.tspId ?? 0,
          activeTutorProfilesCount,
          rejectedTutorProfilesCount,
          pendingTutorProfilesCount,
          profilesPerAuditor,
          profileCompletedByAuditor,
          submittedAndNotAssignedToAuditors,
          submittedAndAssignedToAuditorsToday,
          assignedAndRemainingByAuditors,
          submittedAndAssignedByAuditors
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
