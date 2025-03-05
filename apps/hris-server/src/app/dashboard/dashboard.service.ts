import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import moment = require('moment');
import { DashboardAssignedCandidatesDto } from './dashboard.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  // mandatory counts has to be 100%

  async submitProfile(tspId: number) {
    const now = new Date().toISOString();
    try {
      await this.prisma.$transaction(async (tx) => {
        const fetchTutor = await tx.hrisProgress.findUnique({
          where: {
            tspId: tspId
          },
          select: {
            tutorStatus: true,
            profileStatus: true,
            auditorId: true,
            auditor: {
              select: {
                username: true,
                approved_personal_data: {
                  select: {
                    firstName: true
                  }
                },
                approved_contact_data: {
                  select: {
                    workEmail: true
                  }
                }
              }
            },
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

        if (!fetchTutor) {
          console.log('Error: tutor data not found.');
          throw new Error('Tutor data not found.');
        } else if (fetchTutor.tutorStatus === 'audit pending') {
          throw new Error('Profile has already been submitted.');
        } else if (fetchTutor.auditorId === null) {
          /**
           * If auditor not already assigned:
           * find auditor with least tutors assigned & assign
           * by: KT
           * update:
           * auto assign of profiles to auditor would only happen
           * if hris_access -> access_type value is = 'all'
           */

          const auditors = await tx.hrisAccess.findMany({
            where: {
              user: {
                level: { equals: 3 }
              },
              access: 1,
              access_type: 'all',
              module: { contains: 'AUDITOR' }
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
          if (!auditors || auditors.length === 0) {
            throw new Error(
              'No Auditors found on system. Submission failed. Please contact Support.'
            );
          }

          // const otherHrUsers = await tx.hrisAccess.findMany({
          //   where: {
          //     OR: [
          //       {
          //         module: { contains: 'HR_ADMIN' }
          //       },
          //       {
          //         module: { contains: 'HR_USER' }
          //       }
          //     ]
          //   },
          //   select: {
          //     tsp_id: true
          //   }
          // });

          const auditorIds = auditors.map((user) => {
            return user.tsp_id;
          });

          // const otherHrUserIds = otherHrUsers.map((user) => {
          //   return user.tsp_id;
          // });

          const auditorCounts = auditorIds.reduce((prev, curr) => {
            prev[curr] = 0;
            return prev;
          }, {});

          //todo : wanna exclude other non tutors from this but when use notIn profile not getting submitted
          const auditorsAssignedCount = await tx.hrisProgress.groupBy({
            by: ['auditorId'],
            where: {
              auditorId: {
                in: auditorIds
              }
            },
            _count: {
              tspId: true
            }
          });

          const d = auditorsAssignedCount.reduce((prev, curr) => {
            prev[curr.auditorId] = curr._count.tspId;
            return prev;
          }, {});

          const selectedAuditor = Object.entries({
            ...auditorCounts,
            ...d
          }).sort((a, b) => (a[1] as number) - (b[1] as number))[0][0];

          const auditorData = await this.prisma.user.findUnique({
            where: {
              tsp_id: +selectedAuditor
            },
            select: {
              username: true,
              approved_personal_data: {
                select: {
                  firstName: true
                }
              },
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              }
            }
          });

          const noOfProfiles = auditorsAssignedCount.find(
            (auditor) => auditor.auditorId === +selectedAuditor
          );

          await tx.hrisProgress.update({
            where: {
              tspId
            },
            data: {
              auditorId: +selectedAuditor,
              auditorAssignedAt: now,
              tutorStatus: 'audit pending',
              submitedAt: now
            }
          });

          //Notify auditor when the candidate assigned
          auditorData &&
            (await this.mail.sendNotifyAuditorAssigned(
              auditorData.username ?? '',
              auditorData.approved_personal_data?.firstName
                ? auditorData.approved_personal_data?.firstName
                : auditorData.username ?? '',
              noOfProfiles ? `${noOfProfiles._count.tspId}` : '1',
              fetchTutor.user?.approved_personal_data?.shortName ?? '',
              `${tspId}`
            ));
        } else {
          //auditor alredy assigned. update status
          await tx.hrisProgress.update({
            where: {
              tspId
            },
            data: {
              tutorStatus: 'audit pending',
              submitedAt: now
            }
          });

          //TODO : 3rd param may be an array not sure wanna check and change accordingly
          if (fetchTutor && fetchTutor.profileStatus === 'active') {
            await this.mail.sendNotifyAuditorResubmission(
              fetchTutor.auditor?.approved_personal_data?.firstName ??
                fetchTutor.auditor?.username,
              fetchTutor.user.approved_personal_data?.shortName ?? '',
              '',
              fetchTutor.auditor?.username ?? '',
              `${tspId}`
            );
          }
        }

        await tx.hrisAuditedData.create({
          data: {
            tspId,
            tutorStatus: 'audit pending',
            createdBy: tspId,
            createdAt: now
          }
        });

        return true;
      });

      return { success: true, data: { tutorStatus: 'audit pending' } };
    } catch (error) {
      throw new HttpException(error.message, 400);
      // throw new HttpException({ success: false, error }, 400);
    }
  }

  async getHrUsers(startDate: string, endDate: string) {
    try {
      const [pendinApprvalHrUsers, tobeReassignedAuditors, candidateList] =
        await Promise.all([
          // get pending approval HR Users set.
          this.prisma.hrisAccess.findMany({
            where: {
              module: 'HR_USER',
              access: 1,
              user: {
                ApprovedJobRequisitionUpdaters: {
                  some: {
                    updatedAt: {
                      gte: moment(startDate).startOf('date').toISOString(),
                      lte: moment(endDate).endOf('date').toISOString()
                    },
                    approvalStatus: 'pending'
                  }
                }
              }
            },
            select: {
              user: {
                select: {
                  tsp_id: true,
                  approved_personal_data: {
                    select: {
                      shortName: true
                    }
                  },
                  _count: {
                    select: {
                      ApprovedJobRequisitionUpdaters: true
                    }
                  }
                }
              }
            }
          }),
          // get to be reassigned auditors set.
          this.prisma.hrisProgress.groupBy({
            by: ['auditorId'],
            where: {
              auditorId: {
                not: null
              },
              auditorAssignedAt: {
                gte: moment(startDate).startOf('date').toISOString(),
                lte: moment(endDate).endOf('date').toISOString()
              }
            },
            _count: {
              tspId: true
            }
          }),

          this.prisma.user.findMany({
            where: {
              level: {
                in: [1, 2]
              }
            },
            select: {
              tsp_id: true,
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          })
        ]);

      const auditorIds = tobeReassignedAuditors.map((el: any) => {
        return el.auditorId;
      });

      const auditorsNameList = await this.prisma.user.findMany({
        where: {
          tsp_id: {
            in: auditorIds
          }
        },
        select: {
          username: true,
          approved_personal_data: {
            select: {
              shortName: true
            }
          }
        }
      });

      const reAssignedAuditorList = tobeReassignedAuditors.map(
        (obj, index) => ({
          ...obj,
          auditorName:
            auditorsNameList[index]?.approved_personal_data?.shortName ??
            auditorsNameList[index]?.username
        })
      );

      const response = {
        pendingAprrovals: pendinApprvalHrUsers,
        tobeReassignedAuditors: reAssignedAuditorList,
        allCandidates: candidateList
      };

      return response;
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getProfileSubmitStatus(userId: number) {
    try {
      const submitStatus = await this.prisma.hrisProgress.findFirst({
        where: {
          tspId: userId,
          initialAuditPassDate: {
            not: null
          }
        }
      });

      if (submitStatus !== null) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getProfileStatus(userId: number) {
    try {
      const submitStatus = await this.prisma.hrisProgress.findUnique({
        where: {
          tspId: userId
        },
        select: {
          tutorStatus: true
        }
      });

      return {
        success: true,
        profileStatus: submitStatus.tutorStatus ?? ''
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getAssignedCandidateListByAuditor({
    auditorId,
    startDate,
    endDate
  }: DashboardAssignedCandidatesDto) {
    return this.prisma.hrisProgress.findMany({
      where: {
        auditorId: auditorId,
        auditorAssignedAt: {
          gte: moment(startDate).startOf('date').toISOString(),
          lte: moment(endDate).endOf('date').toISOString()
        }
      },
      select: {
        tspId: true
      }
    });
  }
}
