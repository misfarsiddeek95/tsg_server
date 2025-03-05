import { HttpException, Injectable } from '@nestjs/common';
import moment = require('moment');
import { PrismaService } from '../prisma.service';
import { CandidateMasterDto } from './candidateMaster.dto';

@Injectable()
export class CandidateMasterService {
  constructor(private prisma: PrismaService) {}

  async getHrisCandidateMasterData({
    name,
    email,
    skip,
    take,
    export2Csv = '',
    auditStatus,
    profileStatus,
    tspId,
    auditorId
  }: CandidateMasterDto) {
    const isWhere =
      name || email || auditStatus || profileStatus || tspId || auditorId;

    const tspIds =
      tspId &&
      tspId
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    try {
      const where = isWhere
        ? {
            level: {
              in: [1, 2]
            },
            tsp_id: tspId ? { in: tspIds } : {},
            ...(name
              ? {
                  approved_personal_data: {
                    shortName: name ? { contains: name } : {}
                  }
                }
              : {}),
            ...(email
              ? {
                  approved_contact_data: {
                    workEmail: email ? { contains: email } : {}
                  }
                }
              : {}),
            ...(auditStatus || profileStatus || auditorId
              ? {
                  user_hris_progress: {
                    tutorStatus: auditStatus ? { equals: auditStatus } : {},
                    profileStatus: profileStatus
                      ? { equals: profileStatus }
                      : {},
                    auditorId: auditorId ? { equals: +auditorId } : {}
                  }
                }
              : {})
          }
        : {
            level: {
              in: [1, 2]
            }
          };

      const [getCandidate, rowCount] = await Promise.all([
        this.prisma.user.findMany({
          where: where,
          select: {
            tsp_id: true,
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
                profileStatus: true,
                tutorStatus: true,
                auditorId: true,
                auditor: {
                  select: {
                    username: true
                    // approved_personal_data: {
                    //   select: {
                    //     shortName: true
                    //   }
                    // }
                  }
                }
              }
            }
          },
          ...(!export2Csv ? { take: +take, skip: +skip } : {})
        }),
        this.prisma.user.count({
          where: where
        })
      ]);

      const dataToReturn = getCandidate
        ? getCandidate.map((data) => {
            return {
              id: data.tsp_id,
              tspId: data.tsp_id,
              shortName: data?.approved_personal_data?.shortName ?? '',
              workEmail: data?.approved_contact_data?.workEmail ?? '',
              profileStatus: data?.user_hris_progress?.profileStatus ?? '',
              tutorStatus: data?.user_hris_progress?.tutorStatus ?? '',
              auditorId: data?.user_hris_progress?.auditorId ?? '',
              // auditorName:
              //   data?.user_hris_progress?.auditor?.approved_personal_data
              //     .shortName ?? ''
              auditorName: data?.user_hris_progress?.auditor?.username ?? ''
            };
          })
        : {};

      if (getCandidate) {
        if (export2Csv === 'export2Csv') {
          return dataToReturn;
        } else {
          return {
            success: true,
            details: {
              count: rowCount,
              data: dataToReturn
            }
          };
        }
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      throw new HttpException({ success: false, message: error.message }, 400);
    }
  }

  /*
  async exportCandidate({
    name,
    email,
    auditStatus,
    auditorId
  }: Omit<CandidateMasterDto, 'take' | 'skip'>) {
    const isWhere = name || email || auditStatus || auditorId;

    try {
      const where = isWhere
        ? {
            level: 2,
            approved_personal_data: {
              shortName: name ? { contains: name } : {}
            },
            approved_contact_data: {
              workEmail: email ? { equals: email } : {}
            },
            user_hris_progress: {
              tutorStatus: auditStatus ? { equals: auditStatus } : {},
              auditorId: auditorId ? { equals: +auditorId } : {}
            }
          }
        : {
            level: 2
          };

      const [getCandidate] = await Promise.all([
        this.prisma.user.findMany({
          where: where,
          select: {
            tsp_id: true,
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
                profileStatus: true,
                tutorStatus: true,
                auditorId: true,
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
            }
          }
        })
      ]);

      return getCandidate.map((data) => {
        return {
          id: data.tsp_id,
          tspId: data.tsp_id,
          shortName: data?.approved_personal_data?.shortName ?? '',
          workEmail: data?.approved_contact_data?.workEmail ?? '',
          profileStatus: data?.user_hris_progress?.profileStatus ?? '',
          tutorStatus: data?.user_hris_progress?.tutorStatus ?? '',
          auditorId:
            data?.user_hris_progress?.auditor?.approved_personal_data
              .shortName ?? ''
        };
      });

      return { success: false, message: 'No Records Available' };
    } catch (error) {
      throw new HttpException({ success: false, message: error.message }, 400);
    }
  }
  */
}
