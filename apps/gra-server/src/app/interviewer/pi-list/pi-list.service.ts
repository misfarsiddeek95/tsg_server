import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import moment = require('moment');

@Injectable()
export class PiListService {
  constructor(private prisma: PrismaService) {}

  async getPiList(
    take,
    skip,
    export2Csv = '',
    tspid,
    candiName,
    candiEmail,
    finalOutcome,
    mobileNo,
    startDate,
    endDate
  ) {
    const isWhere =
      tspid ||
      candiName ||
      candiEmail ||
      finalOutcome ||
      mobileNo ||
      startDate ||
      endDate;

    const tspIds =
      tspid &&
      tspid
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    try {
      const filterWhereClause = isWhere
        ? {
            tspId: tspid ? { in: tspIds } : {},
            user: {
              ...(mobileNo || candiEmail
                ? {
                    approved_contact_data: {
                      mobileNumber: mobileNo ? { contains: mobileNo } : {},
                      workEmail: candiEmail
                        ? {
                            contains: candiEmail
                          }
                        : {}
                    }
                  }
                : {}),
              ...(candiName
                ? {
                    approved_personal_data: {
                      shortName: candiName
                        ? {
                            contains: candiName
                          }
                        : {}
                    }
                  }
                : {})
            },
            piCallLogs: {
              ...(startDate && endDate
                ? {
                    some: {
                      date: {
                        gte: moment(startDate).startOf('date').toISOString(),
                        lte: moment(endDate).endOf('date').toISOString()
                      }
                    }
                  }
                : {})
            },

            ...(finalOutcome
              ? {
                  piDatas:
                    finalOutcome !== ''
                      ? {
                          [finalOutcome === 'other' ? 'every' : 'some']: {
                            finalOutcome: {
                              equals:
                                finalOutcome === 'other' ? '' : finalOutcome
                            }
                          }
                        }
                      : {}
                }
              : {})
          }
        : {};

      const [count, details] = await this.prisma.$transaction([
        this.prisma.piRef.count({
          where: filterWhereClause
        }),
        this.prisma.piRef.findMany({
          ...(!export2Csv ? { take: +take, skip: +skip } : {}),
          where: filterWhereClause,
          select: {
            tspId: true,
            bookingStatusId: true,
            user: {
              select: {
                approved_personal_data: {
                  select: {
                    tspId: true,
                    shortName: true
                  }
                },
                approved_contact_data: {
                  select: {
                    workEmail: true,
                    mobileNumber: true
                  }
                }
              }
            },
            piCallLogs: {
              select: {
                id: true,
                date: true,
                callAttempt: true,
                piStatus: true
              }
            },
            piDatas: {
              select: {
                id: true,
                finalOutcome: true,
                educationQualification: true
              }
            }
          },
          orderBy: {
            tspId: 'asc'
          }
        })
      ]);

      const data = details.flatMap((detail, index) => {
        const mappedCallLogs = detail.piCallLogs.flatMap((piCallLog) => {
          let piStatusX = '';
          switch (piCallLog.piStatus) {
            case 1:
              piStatusX = 'Attended';
              break;
            case 2:
              piStatusX = 'No Answer';
              break;
            case 3:
              piStatusX = 'Invalid Number';
              break;
            case 4:
              piStatusX = 'Wrong Number';
              break;
            case 5:
              piStatusX = 'Call Back';
              break;
            case 6:
              piStatusX = 'Incomplete';
              break;
            case 7:
              piStatusX = 'Investigate';
              break;
          }
          return {
            piDate: moment(piCallLog.date).format('DD/MM/YYYY'),
            piTime: moment(piCallLog.date).format('HH:mm:ss'),
            callAttempt: piCallLog.callAttempt,
            piAttendance: piStatusX
          };
        });

        const lastCallLog = mappedCallLogs[mappedCallLogs.length - 1];

        const status = {
          pass: 'Pass',
          fail: 'Fail',
          dropout: 'Dropout',
          investigate: 'Investigate'
        };

        const mappedPiData = detail.piDatas.flatMap((piD) => ({
          id: piD.id,
          finalOutcome: piD.finalOutcome,
          piEducation: piD.educationQualification,
          piOutcome: piD.finalOutcome ? status[piD.finalOutcome] : ''
        }));

        const lastPiData = mappedPiData[mappedPiData.length - 1];

        if (lastCallLog && lastCallLog.piAttendance === 'Attended') {
          return {
            id: index,
            name: detail.user.approved_personal_data?.shortName ?? '',
            tspId: detail.tspId,
            email: detail.user.approved_contact_data?.workEmail ?? '',
            mobileNo: detail.user.approved_contact_data?.mobileNumber ?? '',
            piDataId: mappedPiData,
            bookingStatusId: detail.bookingStatusId,
            ...lastPiData,
            ...lastCallLog,
            mappedCallLogs,
            investigateData: mappedPiData.length > 1 ? mappedPiData[0] : null
          };
        } else {
          return {
            id: index,
            name: detail.user.approved_personal_data?.shortName ?? '',
            tspId: detail.tspId,
            email: detail.user.approved_contact_data?.workEmail ?? '',
            mobileNo: detail.user.approved_contact_data?.mobileNumber ?? '',
            piEducation: '',
            piOutcome: '',
            piDataId: mappedPiData,
            bookingStatusId: detail.bookingStatusId,
            ...lastCallLog,
            mappedCallLogs
          };
        }
      });

      if (export2Csv === 'export2Csv') {
        return data;
      } else {
        return { success: true, data, count };
      }
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }
}
