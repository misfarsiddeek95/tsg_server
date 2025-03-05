import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async getAuditorActivities(userId: number) {
    try {
      const [pendingAudits, pendingAuditCount] = await Promise.all([
        this.prisma.hrisProgress.findMany({
          where: {
            auditorId: userId,
            tutorStatus: 'audit pending'
          },
          select: {
            user: {
              select: {
                approved_personal_data: {
                  select: {
                    shortName: true
                  }
                },
                tsp_id: true
              }
            }
          }
        }),
        this.prisma.hrisProgress.count({
          where: {
            auditorId: userId,
            tutorStatus: 'audit pending'
          }
        })
      ]);

      const [auditFail, auditFailCount] = await Promise.all([
        this.prisma.hrisProgress.findMany({
          where: {
            auditorId: userId,
            tutorStatus: {
              contains: 'audit fail'
            },
            user: {
              level: {
                in: [1, 2]
              }
            }
          },
          select: {
            user: {
              select: {
                approved_personal_data: {
                  select: {
                    shortName: true
                  }
                },
                tsp_id: true,
                approved_contact_data: {
                  select: {
                    mobileNumber: true
                  }
                }
              }
            }
          }
        }),
        this.prisma.hrisProgress.count({
          where: {
            auditorId: userId,
            tutorStatus: {
              contains: 'audit fail'
            }
          }
        })
      ]);

      return {
        success: true,
        data: {
          pendingAuditCount,
          pendingAudits: pendingAudits.map((user) => {
            return {
              name: user.user?.approved_personal_data?.shortName ?? '',
              tspId: user.user?.tsp_id ?? ''
            };
          }),
          auditFailCount,
          failedAudits: auditFail.map((user) => {
            return {
              name: user.user?.approved_personal_data?.shortName ?? '',
              tspId: user.user?.tsp_id ?? '',
              contactNumber:
                user.user?.approved_contact_data?.mobileNumber ?? ''
            };
          })
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getAuditorChartData(tspId: number) {
    try {
      const [initialAudit, finalAudit] = await Promise.all([
        await this.prisma.hrisProgress.groupBy({
          by: ['tutorStatus'],
          where: {
            auditorId: tspId,
            tutorStatus: {
              in: [
                'audit pending',
                'initial audit pass',
                'initial audit fail',
                'initial audit reject'
              ]
            }
          },
          _count: {
            tspId: true
          }
        }),
        await this.prisma.hrisProgress.groupBy({
          by: ['tutorStatus'],
          where: {
            auditorId: tspId,
            tutorStatus: {
              in: ['final audit pass', 'final audit fail']
            }
          },
          _count: {
            tspId: true
          }
        })
      ]);

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

      const finalAuditPass = finalAudit.find(
        (group) => group.tutorStatus === 'final audit pass'
      );

      const finalAuditFail = finalAudit.find(
        (group) => group.tutorStatus === 'final audit fail'
      );

      return {
        success: true,
        data: {
          initialAuditPending: initialAuditPending?._count?.tspId ?? 0,
          initialAuditPass: initialAuditPass?._count?.tspId ?? 0,
          initialAuditFail: initialAuditFail?._count?.tspId ?? 0,
          initialAuditRejected: initialAuditRejected?._count?.tspId ?? 0,
          finalAuditPass: finalAuditPass?._count?.tspId ?? 0,
          finalAuditFail: finalAuditFail?._count?.tspId ?? 0
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
