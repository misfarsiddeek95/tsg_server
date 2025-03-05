import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HrisFiltersService {
  constructor(private prisma: PrismaService) {}

  // fetch: search tutor by partial name
  async searchTutorByName(name: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          level: {
            in: [1, 2]
          },
          approved_personal_data: {
            shortName: {
              contains: name
            }
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
      });

      const data = users.map((d) => {
        return {
          tspId: d.tsp_id ?? '',
          name: d.approved_personal_data?.shortName ?? ''
        };
      });

      //get unique values only
      const getUniqueListBy = (arr, key) => {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
      };
      const data2 = getUniqueListBy(data, 'name');

      return { success: true, data: data2 };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  // fetch: list of all non-tutors with auditor access only
  async fetchActiveAuditors() {
    try {
      const otherNonTutors = await this.prisma.hrisAccess.findMany({
        where: {
          access: 1,
          OR: [
            {
              module: 'HR_ADMIN'
            },
            {
              module: 'HR_USER'
            }
          ]
        },
        select: {
          tsp_id: true
        }
      });

      const otherNonTutorsTspIds = otherNonTutors.map((user) => {
        return user.tsp_id;
      });

      const auditors = await this.prisma.hrisAccess.findMany({
        where: {
          module: 'AUDITOR',
          access: 1,
          tsp_id: {
            notIn: otherNonTutorsTspIds
          }
        },
        select: {
          user: {
            select: {
              tsp_id: true,
              username: true,
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
        data: auditors.map((row) => {
          return {
            tspId: row.user.tsp_id,
            // name: row.user.approved_personal_data.shortName
            name: row.user.username
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  // fetch: list of all tutors alraedy assigned to tutors
  async fetchAssignedAuditors() {
    try {
      const auditors = await this.prisma.hrisProgress.findMany({
        where: {
          auditorId: {
            not: null
          }
        },
        select: {
          auditor: {
            select: {
              tsp_id: true,
              username: true,
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        },
        distinct: ['auditorId']
      });

      return {
        success: true,
        data: auditors.map((row) => {
          return {
            tspId: row.auditor.tsp_id,
            // name: row.auditor.approved_personal_data.shortName
            name: row.auditor.username
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  // fetch: all unique audit status AKA tutor status used (isuru)
  async fetchAuditStatusList() {
    try {
      const distinctValues = await this.prisma.hrisProgress.findMany({
        select: {
          tutorStatus: true
        },
        where: { tutorStatus: { not: null || '' } },
        distinct: ['tutorStatus']
      });

      return {
        success: true,
        data: distinctValues ?? []
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  // fetch: all unique profile status AKA employee status used
  async fetchProfileStatusList() {
    try {
      const distinctValues = await this.prisma.hrisProgress.findMany({
        select: {
          profileStatus: true
        },
        where: { profileStatus: { not: null } },
        distinct: ['profileStatus']
      });

      return {
        success: true,
        data: distinctValues ?? []
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
