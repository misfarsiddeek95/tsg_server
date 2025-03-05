import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ITMasterDto } from './it-master.dto';
import moment = require('moment');

@Injectable()
export class ITMasterService {
  constructor(private prisma: PrismaService) {}

  async fetchTableItMasterTb({
    tspId,
    shortName,
    email,
    take,
    skip,
    profileStatus,
    auditor,
    export2Csv = '',
    tutorStatus,
    submitDateFrom,
    submitDateTo,
    itAuditState,
    itCompletion,
    automatedState
  }: ITMasterDto) {
    const tspIdArr = tspId
      ? tspId
          .replace(/[^\d,]/g, '')
          .split(',')
          .map(Number)
          .filter(Boolean)
      : [];

    const isWhere =
      tspId ||
      shortName ||
      email ||
      tutorStatus ||
      profileStatus ||
      submitDateFrom ||
      submitDateTo ||
      submitDateTo ||
      itAuditState ||
      itCompletion ||
      auditor;
    const filterWhereClause = {
      tsp_id: tspId
        ? {
            in: tspIdArr
          }
        : {},
      ...(email
        ? {
            approved_contact_data: {
              workEmail: email
                ? {
                    contains: email
                  }
                : {}
            }
          }
        : {}),
      ...(shortName
        ? {
            approved_personal_data: {
              shortName: shortName
                ? {
                    equals: shortName
                  }
                : {}
            }
          }
        : {}),
      ...(itAuditState
        ? {
            approved_it_data: {
              updatedFlag: ['1', '3'].includes(itAuditState)
                ? {
                    equals: +itAuditState
                  }
                : { not: { in: [1, 3] } }
            }
          }
        : {}),
      ...(tutorStatus ||
      profileStatus ||
      auditor ||
      submitDateFrom ||
      submitDateTo ||
      itCompletion
        ? {
            user_hris_progress: {
              tutorStatus: tutorStatus
                ? {
                    equals: tutorStatus
                  }
                : { not: null },
              profileStatus: profileStatus
                ? {
                    equals: profileStatus
                  }
                : {},
              submitedAt:
                submitDateFrom && submitDateTo
                  ? {
                      gt: moment(submitDateFrom).startOf('date').toISOString(),
                      lte: moment(submitDateTo).endOf('date').toISOString()
                    }
                  : {},
              itDataEmp: !itCompletion
                ? {}
                : +itCompletion == 100
                ? { gt: 8 }
                : +itCompletion == 50
                ? { gte: 4, lt: 8 }
                : { lt: 4 },
              auditorId: auditor ? { equals: +auditor } : {}
            }
          }
        : {})
    };

    const defaultFilter = {
      level: {
        in: [1, 2]
      },
      OR: [
        {
          user_hris_progress: {
            tutorStatus: {
              not: null
            }
          },
          hris_it_data: {
            some: {}
          }
        },
        {
          user_hris_progress: {
            tutorStatus: {
              not: null
            },
            initialAuditPassDate: {
              not: null
            }
          }
        }
      ]
    };

    try {
      const [count, details] = await this.prisma.$transaction([
        this.prisma.user.count({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter
        }),
        this.prisma.user.findMany({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter,
          select: {
            tsp_id: true,
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
                tutorStatus: true,
                profileStatus: true,
                itDataCount: true,
                itDataEmp: true,
                itDataAuditor: true,
                auditorId: true,
                auditor: {
                  select: {
                    username: true,
                    approved_personal_data: {
                      select: {
                        shortName: true
                      }
                    }
                  }
                }
              }
            },
            approved_it_data: {
              select: {
                pcType: true,
                pcOs: true,
                laptopBatteryAge: true,
                desktopUps: true,
                desktopUpsRuntime: true,
                haveHeadset: true,
                primaryConnectionType: true,
                primaryIsp: true,
                primaryDownloadSpeed: true,
                primaryUploadSpeed: true,
                primaryPing: true,
                haveSecondaryConnection: true,
                secondaryConnectionType: true,
                secondaryIsp: true,
                secondaryDownloadSpeed: true,
                secondaryUploadSpeed: true,
                secondaryPing: true,
                updatedFlag: true,
                approvedBy: true,
                approvedAt: true
              }
            },
            hris_it_data: {
              orderBy: {
                id: 'desc'
              },
              take: 1
            }
          }
          // ...(!export2Csv ? { take: +take, skip: +skip } : {})
        })
      ]);

      const statusFilter = (row, statusId) => {
        switch (statusId) {
          case 80:
            return row?.hris_it_data[0]?.statusId === 80;
          case 79:
            return row?.hris_it_data[0]?.statusId === 79;
          case 81:
            return row?.hris_it_data[0]?.statusId === 81;
          case 82:
            return row?.hris_it_data[0]?.statusId === 82;
          default:
            return row?.hris_it_data[0]; // No filter, include all data
        }
      };
      const dataToReturn = details
        .filter((row) => statusFilter(row, Number(automatedState)))
        .map((row, index) => {
          return {
            id: index + 1,
            tspId: row.tsp_id,
            shortName: row.approved_personal_data?.shortName ?? '',
            residingCountry: row.approved_contact_data?.residingCountry ?? '',
            workEmail: row.approved_contact_data?.workEmail ?? '',
            mobileNumber: row.approved_contact_data?.mobileNumber ?? '',
            profileStatus: row?.user_hris_progress?.profileStatus ?? '',
            tutorStatus: row?.user_hris_progress?.tutorStatus ?? '',
            supervisorName: row?.tm_approved_status?.supervisorName ?? '',
            movementType: row?.tm_approved_status?.movementType ?? '',
            auditorEmail: row?.user_hris_progress?.auditor?.username ?? '',
            auditorTspId: row.user_hris_progress?.auditorId ?? '',
            auditorName:
              row.user_hris_progress?.auditor?.approved_personal_data
                ?.shortName ?? '',
            itDataCount: row?.user_hris_progress?.itDataCount ?? '',
            itDataEmp: row?.user_hris_progress?.itDataEmp ?? '',
            itDataAuditor: row?.user_hris_progress?.itDataAuditor ?? '',
            hrisItDataId: row?.hris_it_data[0]?.id ?? '',
            pcType: row?.hris_it_data[0]?.pcType ?? '',
            pcTypeStatus: row?.hris_it_data[0]?.pcTypeStatus ?? '',
            pcOs: row?.hris_it_data[0]?.pcOs ?? '',
            pcOsStatus: row?.hris_it_data[0]?.pcOsStatus ?? '',
            pcBrand: row?.hris_it_data[0]?.pcBrand ?? '',
            pcBrandStatus: row?.hris_it_data[0]?.pcBrandStatus ?? '',
            haveHeadset: row?.hris_it_data[0]?.haveHeadset ?? '',
            haveHeadsetStatus: row?.hris_it_data[0]?.haveHeadsetStatus ?? '',
            headsetUsb: row?.hris_it_data[0]?.headsetUsb ?? '',
            headsetUsbStatus: row?.hris_it_data[0]?.headsetUsbStatus ?? '',
            headsetConnectivityType:
              row?.hris_it_data[0]?.headsetConnectivityType ?? '',
            laptopBatteryAge: row?.hris_it_data[0]?.laptopBatteryAge ?? '',
            laptopBatteryRuntime:
              row?.hris_it_data[0]?.laptopBatteryRuntime ?? '',
            desktopUps: row?.hris_it_data[0]?.desktopUps ?? '',
            desktopUpsRuntime: row?.hris_it_data[0]?.desktopUpsRuntime ?? '',
            primaryConnectionType:
              row?.hris_it_data[0]?.primaryConnectionType ?? '',
            primaryConnectionTypeStatus:
              row?.hris_it_data[0]?.primaryConnectionTypeStatus ?? '',
            primaryIsp: row?.hris_it_data[0]?.primaryIsp ?? '',
            primaryDownloadSpeed:
              row?.hris_it_data[0]?.primaryDownloadSpeed ?? '',
            primaryUploadSpeed: row?.hris_it_data[0]?.primaryUploadSpeed ?? '',
            primaryPing: row?.hris_it_data[0]?.primaryPing ?? '',
            haveSecondaryConnection:
              row?.hris_it_data[0]?.haveSecondaryConnection ?? '',
            secondaryConnectionType:
              row?.hris_it_data[0]?.secondaryConnectionType ?? '',
            secondaryConnectionTypeStatus:
              row?.hris_it_data[0]?.secondaryConnectionTypeStatus ?? '',
            secondaryIsp: row?.hris_it_data[0]?.secondaryIsp ?? '',
            secondaryDownloadSpeed:
              row?.hris_it_data[0]?.secondaryDownloadSpeed ?? '',
            secondaryUploadSpeed:
              row?.hris_it_data[0]?.secondaryUploadSpeed ?? '',
            secondaryPing: row?.hris_it_data[0]?.secondaryPing ?? '',
            updatedFlag: row.approved_it_data?.updatedFlag ?? 0,
            updatedBy: row?.hris_it_data[0]?.updatedBy ?? '',
            updatedAt: row?.hris_it_data[0]?.updatedAt ?? '',
            statusId: row?.hris_it_data[0]?.statusId
          };
        });

      if (export2Csv === 'export2Csv') {
        return dataToReturn;
      } else {
        const data = dataToReturn.slice(Number(skip), +take + +skip);
        return {
          success: true,
          // count: count,
          count: dataToReturn.length,
          details: data
        };
      }
    } catch (error) {
      throw new HttpException({ success: false, message: error.message }, 400);
    }
  }
}
