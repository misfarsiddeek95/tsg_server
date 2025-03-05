import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PCCHistoryDto } from './pcc-history.dto';
import moment = require('moment');

@Injectable()
export class PccHistoryService {
  constructor(private prisma: PrismaService) {}

  async fetchTablePccHistory({
    tspId,
    name,
    email,
    country,
    skip,
    take,
    auditStatus,
    export2Csv = '',
    profileStatus,
    auditorId
  }: PCCHistoryDto) {
    const isWhere =
      name ||
      auditStatus ||
      profileStatus ||
      email ||
      country ||
      tspId ||
      auditorId;

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
          // firstName: name ? { contains: name } : {},
          // workEmail: email ? { contains: email } : {},

          ...(auditStatus ||
          profileStatus ||
          auditorId ||
          name ||
          email ||
          country
            ? {
                user: {
                  approved_personal_data: {
                    shortName: name ? { contains: name } : {}
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
            : {})
        }
      : {};

    try {
      const totalcount = await this.prisma.hrisPccCron.count({
        where: filterWhereClause
      });

      const PccHistory = await this.prisma.hrisPccCron.findMany({
        // take: take ? +take : 10,
        // skip: skip ? +skip : 0,
        where: filterWhereClause,
        select: {
          id: true,
          tspId: true,
          createdAt: true,
          firstName: true,
          workEmail: true,
          pccExpireDate: true, //old pdd expired date
          emailSubject: true,
          emailBcc: true,
          // emailSentDate: true,
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
              approved_right2work_data: {
                select: {
                  pccIssuedDate: true, //latest pcc issued date
                  pccExpireDate: true, //latest pcc expired date
                  pccUrl: true,
                  pccReferenceNo: true,
                  pccState: true
                }
              },
              user_hris_progress: {
                select: {
                  tutorStatus: true, //tutor status
                  profileStatus: true, //employee/ profile status
                  auditorId: true,
                  auditor: {
                    select: {
                      username: true
                    }
                  }
                }
              },
              tm_approved_status: {
                select: {
                  employeeStatus: true, //TMS Empoloyee statys
                  movementType: true, //TMS movement type
                  supervisorName: true
                }
              },
              TslUser: {
                take: 1
              }
            }
          }
        },
        ...(!export2Csv ? { take: +take, skip: +skip } : {})
      });

      const dataToReturn = PccHistory
        ? PccHistory.map((row, index: any) => {
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

              emailSentDate: row.createdAt
                ? moment(row.createdAt).format('YYYY-DD-MM')
                : '',
              nameTo: row.firstName,
              emailTo: row.workEmail,
              OldPccExpiredDate: row.createdAt
                ? moment(row.pccExpireDate).format('YYYY-DD-MM')
                : '',
              emailSubject: row.emailSubject,
              latestPccIssuedDate: row.user?.approved_right2work_data
                ?.pccIssuedDate
                ? moment(
                    row.user?.approved_right2work_data?.pccIssuedDate
                  ).format('YYYY-DD-MM')
                : '',
              latestPccExpiredDate: row.pccExpireDate
                ? moment(row.pccExpireDate).format('YYYY-DD-MM')
                : '',
              emailBcc: row.emailBcc ? row.emailBcc.replace(/"/g, "'") : '',

              pccReferenceNo:
                row.user?.approved_right2work_data?.pccReferenceNo,
              pccStatus: row.user?.approved_right2work_data?.pccState,
              pccUrl: row.user?.approved_right2work_data?.pccUrl
            };
          })
        : {};
      if (PccHistory) {
        if (export2Csv === 'export2Csv') {
          return dataToReturn;
        } else {
          return {
            success: true,
            count: totalcount,
            data: dataToReturn
            // details: {
            // }
          };
        }
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      // return { success: false, message: error.message };
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
