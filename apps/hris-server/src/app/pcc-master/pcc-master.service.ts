import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PCCMasterDto } from './pcc-master.dto';
import moment = require('moment');

@Injectable()
export class PccMasterService {
  constructor(private prisma: PrismaService) {}

  async fetchTablePccMaster({
    tspId,
    name,
    email,
    country,
    skip,
    take,
    auditStatus,
    export2Csv = '',
    profileStatus,
    auditorId,
    expireDateFrom,
    expireDateTo
  }: PCCMasterDto) {
    const isWhere =
      name ||
      auditStatus ||
      profileStatus ||
      email ||
      country ||
      tspId ||
      auditorId ||
      expireDateFrom ||
      expireDateTo;

    const tspIds =
      tspId &&
      tspId
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    const filterWhereClause = isWhere
      ? {
          tspId: tspId ? { in: tspIds } : {},
          pccExpireDate:
            // dateto && datefrom
            expireDateFrom && expireDateTo
              ? {
                  // gte: new Date(expireDateFrom).toISOString(),
                  // lte: new Date(expireDateTo).toISOString()
                  gte: moment(expireDateFrom).startOf('date').toISOString(),
                  lte: moment(expireDateTo).endOf('date').toISOString()
                }
              : {},
          ...(name ||
          email ||
          country ||
          auditStatus ||
          profileStatus ||
          auditorId
            ? {
                user: {
                  level: {
                    in: [1, 2]
                  },
                  approved_personal_data: {
                    shortName: name ? { equals: name } : {}
                  },
                  approved_contact_data: {
                    workEmail: email ? { contains: email } : {},
                    residingCountry:
                      country && ['Sri Lanka', 'India'].includes(country)
                        ? { equals: country }
                        : country && country === 'Other'
                        ? { notIn: ['Sri Lanka', 'India'] }
                        : {}
                  },
                  user_hris_progress: {
                    tutorStatus: auditStatus ? { equals: auditStatus } : {},
                    profileStatus: profileStatus
                      ? { equals: profileStatus }
                      : {},
                    auditorId: auditorId ? { equals: +auditorId } : {}
                  }
                }
              }
            : {
                user: {
                  level: {
                    in: [1, 2]
                  }
                }
              })
        }
      : {
          user: {
            level: {
              in: [1, 2]
            }
          }
        };
    try {
      const totalcount = await this.prisma.approvedRight2workData.count({
        where: filterWhereClause
      });

      const PccMaster = await this.prisma.approvedRight2workData.findMany({
        where: filterWhereClause,
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
                  mobileNumber: true,
                  residingCountry: true,
                  workEmail: true
                }
              },
              tm_approved_status: {
                select: {
                  employeeStatus: true,
                  movementType: true,
                  supervisorName: true
                }
              },
              user_hris_progress: {
                select: {
                  tspActivatedAt: true,
                  tutorStatus: true,
                  profileStatus: true,
                  auditorId: true,
                  auditor: {
                    select: {
                      username: true
                    }
                  }
                }
              },
              TslUser: {
                take: 1
              }
            }
          },
          pccIssuedDate: true,
          pccExpireDate: true,
          pccUrl: true,
          pccReferenceNo: true,
          pccState: true
        },
        ...(!export2Csv ? { take: +take, skip: +skip } : {})
      });

      const dataToReturn = PccMaster
        ? PccMaster.map((row, index: any) => {
            return {
              id: index + 1,
              tspId: row.tspId,
              shortName: row.user?.approved_personal_data?.shortName ?? '',
              residingCountry: row.user?.approved_contact_data?.residingCountry,
              workEmail: row.user?.approved_contact_data?.workEmail ?? '',
              mobileNumber: row.user?.approved_contact_data?.mobileNumber ?? '',
              tutorStatus: row.user?.user_hris_progress?.tutorStatus ?? '',
              profileStatus: row?.user?.user_hris_progress?.profileStatus ?? '',
              supervisorName:
                row?.user?.tm_approved_status?.supervisorName ?? '',
              employeeStatus:
                row?.user?.tm_approved_status?.employeeStatus ?? '',
              movementType: row?.user?.tm_approved_status?.movementType ?? '',
              auditorEmail:
                row.user?.user_hris_progress?.auditor?.username ?? '',
              tslTutorId: row.user?.TslUser[0]?.tsl_id ?? '',
              tslTutorName: row.user?.TslUser[0]?.tsl_full_name ?? '',
              tslTutorEmail: row.user?.TslUser[0]?.tsl_email ?? '',

              issuedDate: row.pccIssuedDate
                ? moment(row.pccIssuedDate).format('YYYY-MM-DD')
                : '',
              expireDate: row.pccExpireDate
                ? moment(row.pccExpireDate).format('YYYY-MM-DD')
                : '',
              before5month: row.pccExpireDate
                ? moment(row.pccExpireDate)
                    .subtract(5, 'months')
                    .format('YYYY-MM-DD')
                : '',
              before3month: row.pccExpireDate
                ? moment(row.pccExpireDate)
                    .subtract(3, 'months')
                    .format('YYYY-MM-DD')
                : '',
              before1_5month: row.pccExpireDate
                ? moment(row.pccExpireDate)
                    .subtract(1.5, 'months')
                    .format('YYYY-MM-DD')
                : '',
              before1day: row.pccExpireDate
                ? moment(row.pccExpireDate)
                    .subtract(1, 'day')
                    .format('YYYY-MM-DD')
                : '',
              after1_5month: row.pccExpireDate
                ? moment(row.pccExpireDate)
                    .add(1.5, 'months')
                    .format('YYYY-MM-DD')
                : '',
              pccUrl: row.pccUrl ?? '',
              pccReferenceNo: row.pccReferenceNo ?? '',
              pccStatus: row.pccState ?? ''
              // tslTutorID:
              // tslPlatformName:
            };
          })
        : {};
      if (PccMaster) {
        if (export2Csv === 'export2Csv') {
          return dataToReturn;
        } else {
          return {
            success: true,
            count: totalcount,
            data: dataToReturn
          };
        }
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
