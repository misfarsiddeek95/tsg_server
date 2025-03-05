import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AuditorSubmitQualificationsDto,
  QualificationDataDto
} from './qualification.dto';
import moment = require('moment');

@Injectable()
export class QualificationService {
  constructor(private prisma: PrismaService) {}

  async fetchQualificationDetails(tspId: number) {
    const approvedDetails = await this.getApprovedData(tspId);
    const details = await this.getTempData(tspId);
    return {
      success: true,
      data: {
        details,
        approvedDetails
      }
    };
  }

  async saveQualificationDetails(tspId: number, data: QualificationDataDto) {
    const now = new Date().toISOString();
    const { xother_quali_data } = data;

    const lastData = await this.prisma.hrisQualificationsData.findFirst({
      where: {
        tspId: tspId
      },
      orderBy: {
        id: 'desc'
      }
    });

    let lastDataReasons = {};
    let updatedStatus = {};
    let gotPendingFields = false; //logic to trigger email notification to hris@ticketsthirdspaceportal.com

    if (lastData) {
      lastDataReasons = lastData
        ? Object.entries(lastData)
            .filter(
              ([key, value]) => value !== null && key.includes('RejectReason')
            )
            .reduce((prev, [key, value]) => {
              prev[key] = value;
              return prev;
            }, {})
        : {};

      updatedStatus = lastData
        ? Object.entries(lastData)
            .filter(([key]) => key.includes('Status'))
            .map(([key, value]) => {
              const field = key.replace('Status', '');
              const newStatus =
                lastData[field] !== data[field] ? 'pending' : value;
              gotPendingFields = newStatus === 'pending' || gotPendingFields;
              return [key, newStatus];
            })
            .reduce((prev, [key, value]) => {
              prev[key as string] = value;
              return prev;
            }, {})
        : {};
    }

    return this.prisma.$transaction(async (tx) => {
      const educationalQualificationsData =
        await tx.hrisQualificationsData.create({
          data: {
            tspId: tspId,
            updatedBy: tspId,
            updatedAt: now
          },
          select: {
            id: true
          }
        });

      await tx.xotherQualiData.createMany({
        data: xother_quali_data.map((xother) => {
          return {
            ...xother,
            qId: educationalQualificationsData.id,
            tspId: tspId,
            startYear:
              xother.startYear && xother.startYear != ''
                ? new Date(xother.startYear)
                : null,
            completionYear:
              xother.completionYear && xother.completionYear != ''
                ? new Date(xother.completionYear)
                : null
          };
        })
      });

      // const fieldsMandatory = [
      //   'courseType',
      //   'fieldStudy',
      //   'hasCompleted',
      //   'startYear',
      //   'completionYear',
      //   'isLocal',
      //   'mainInst',
      //   'docUrl'
      // ];

      // const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
      //   return (
      //     prev +
      //     (xother_quali_data[0][curr] && xother_quali_data[0][curr] !== ''
      //       ? 1
      //       : 0)
      //   );
      // }, 0);

      // await tx.hrisProgress.upsert({
      //   where: {
      //     tspId
      //   },
      //   update: {
      //     qualificationsDataEmp: filledMandatoryFieldCount,
      //     qualificationDataCount: `${filledMandatoryFieldCount}/8`,
      //     updatedAt: now
      //   },
      //   create: {
      //     tspId,
      //     qualificationsDataEmp: filledMandatoryFieldCount,
      //     qualificationDataCount: `${filledMandatoryFieldCount}/8`,
      //     updatedAt: now
      //   }
      // });

      // const hrisProgressFetched = await tx.user.findUnique({
      //   where: {
      //     tsp_id: tspId
      //   },
      //   include: {
      //     user_hris_progress: {
      //       select: {
      //         profileStatus: true
      //       }
      //     },
      //     approved_personal_data: {
      //       select: {
      //         shortName: true
      //       }
      //     },
      //     approved_contact_data: {
      //       select: {
      //         workEmail: true
      //       }
      //     }
      //   }
      // });
      // hrisProgressFetched &&
      //   hrisProgressFetched.user_hris_progress &&
      //   hrisProgressFetched.user_hris_progress.profileStatus &&
      //   hrisProgressFetched.user_hris_progress.profileStatus === 'active' &&
      //   gotPendingFields;
      // {
      //   // notify hris@ticketsthirdspaceportal.com on tutor updating key profile data
      //   // await this.mailService.sendNotification2Ticketsthirdspaceportal(
      //   //   tspId + '',
      //   //   hrisProgressFetched?.approved_personal_data?.shortName ?? '',
      //   //   hrisProgressFetched?.approved_contact_data?.workEmail ?? '',
      //   //   'Qualifications'
      //   // );
      // }

      return tx.hrisQualificationsData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          xother_quali_data: {
            select: {
              courseType: true,
              courseTypeRejectReason: true,
              courseTypeStatus: true,
              fieldStudy: true,
              fieldStudyRejectReason: true,
              fieldStudyStatus: true,
              hasCompleted: true,
              hasCompletedRejectReason: true,
              hasCompletedStatus: true,
              startYear: true,
              startYearRejectReason: true,
              startYearStatus: true,
              completionYear: true,
              completionYearRejectReason: true,
              completionYearStatus: true,
              isLocal: true,
              isLocalRejectReason: true,
              isLocalStatus: true,
              mainInst: true,
              mainInstRejectReason: true,
              mainInstStatus: true,
              affiInst: true,
              affiInstRejectReason: true,
              affiInstStatus: true,
              areaOfStudy: true,
              areaOfStudyRejectReason: true,
              areaOfStudyStatus: true,
              docUrl: true,
              docUrlRejectReason: true,
              docUrlStatus: true
            }
          }
        }
      });
    });
  }

  async auditorSubmitQualificationDetails(
    tspId: number,
    data: AuditorSubmitQualificationsDto
  ) {
    const now = new Date().toISOString();

    const { xother_quali_data, nonTutorId } = data;

    const lastData = await this.prisma.hrisQualificationsData.findFirst({
      where: {
        tspId: nonTutorId
      },
      orderBy: {
        id: 'desc'
      },
      select: {
        xother_quali_data: {
          orderBy: { id: 'asc' }
        }
      }
    });

    let previousApprovedData =
      await this.prisma.approvedQualificationsData.findUnique({
        where: {
          tspId: nonTutorId
        }
      });

    if (!previousApprovedData) {
      previousApprovedData =
        await this.prisma.approvedQualificationsData.create({
          data: {
            tspId: nonTutorId,
            approvedBy: tspId,
            approvedAt: now
          }
        });
    }

    // This part of code is redundant.
    // has been commented for now.

    /*
    let notAuditingFields = {};
    let auditingFields = {};
   
    if (previousApprovedData && lastData) {
      notAuditingFields = Object.entries(previousApprovedData)
        .filter(([key]) => !Object.keys(lastData).includes(key + 'Status'))
        .reduce((prev, [key, value]) => {
          prev[key as string] = data[key];
          return prev;
        }, {} as any);

      auditingFields = Object.entries(previousApprovedData)
        .filter(([key]) => Object.keys(lastData).includes(key + 'Status'))
        .reduce((prev, [key, value]) => {
          if (data[key + 'Status'] === 'approved') {
            prev[key as string] = data[key];
          } else {
            prev[key as string] = value;
          }
          return prev;
        }, {} as any);
    }

    */

    await this.prisma.approvedQualificationsData.update({
      where: { tspId: nonTutorId },
      data: {
        approvedBy: tspId,
        approvedAt: now
      }
    });

    let lastXotherDataObj = {};

    if (lastData) {
      lastXotherDataObj = lastData.xother_quali_data.reduce((prev, curr) => {
        if (curr.localId) {
          prev[curr.localId] = curr;
        } else {
          prev[curr.id] = curr;
        }
        return prev;
      }, {} as any);
    }

    await this.prisma.$transaction(async (tx) => {
      const educationalQualificationsData =
        await tx.hrisQualificationsData.create({
          data: {
            tspId: nonTutorId,
            updatedBy: tspId,
            updatedAt: now,
            auditedBy: tspId,
            auditedAt: now
          },
          select: {
            id: true
          }
        });

      const addedXotherQualiData = await Promise.all(
        xother_quali_data.map((xother) => {
          delete xother['approvedXotherQualiData'];
          return tx.xotherQualiData.create({
            data: {
              ...xother,
              qId: educationalQualificationsData.id,
              tspId: nonTutorId,
              startYear:
                xother.startYear && xother.startYear != ''
                  ? xother.startYear
                  : null,
              completionYear:
                xother.completionYear && xother.completionYear != ''
                  ? xother.completionYear
                  : null,
              updatedBy: tspId,
              updatedAt: now
            }
          });
        })
      );

      lastXotherDataObj = addedXotherQualiData.reduce((prev, curr) => {
        if (curr.localId) {
          prev[curr.localId] = curr;
        } else {
          prev[curr.id] = curr;
        }
        return prev;
      }, {} as any);

      for (let index = 0; index < addedXotherQualiData.length; index++) {
        const xother = addedXotherQualiData[index];
        delete xother['approvedXotherQualiData'];
        const localId = xother.localId ?? xother.id;
        const recordId = xother.id;

        let previousApprovedData = await tx.approvedXotherQualiData.findUnique({
          where: {
            localId
          }
        });

        if (!previousApprovedData) {
          previousApprovedData = await tx.approvedXotherQualiData.create({
            data: {
              localId
            }
          });
        }

        let notAuditingFields = {};
        let auditingFields = {};

        if (previousApprovedData) {
          if (lastXotherDataObj[localId]) {
            notAuditingFields = Object.entries(previousApprovedData)
              .filter(([key]) => !Object.keys(xother).includes(key + 'Status'))
              .reduce((prev, [key, value]) => {
                prev[key as string] = lastXotherDataObj[localId][key];
                return prev;
              }, {} as any);
          }

          auditingFields = Object.entries(previousApprovedData)
            .filter(([key]) => Object.keys(xother).includes(key + 'Status'))
            .reduce((prev, [key, value]) => {
              if (xother[key + 'Status'] === 'approved') {
                prev[key as string] = xother[key];
              } else {
                prev[key as string] = value;
              }
              return prev;
            }, {} as any);
        }

        delete notAuditingFields['localId'];
        delete auditingFields['localId'];

        await tx.approvedXotherQualiData.update({
          where: { localId },
          data: {
            ...auditingFields,
            ...notAuditingFields,
            otherQualifactionId: recordId,
            tspId: nonTutorId
          }
        });
      }
    });

    const fieldsMandatory = [
      'courseType',
      'fieldStudy',
      'hasCompleted',
      'startYear',
      'completionYear',
      'isLocal',
      'mainInst',
      'docUrl'
    ];

    const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
      return (
        prev +
        (xother_quali_data[0][curr] && xother_quali_data[0][curr] !== ''
          ? 1
          : 0)
      );
    }, 0);

    const fieldsAudited = [
      'courseTypeStatus',
      'fieldStudyStatus',
      'hasCompletedStatus',
      'startYearStatus',
      'completionYearStatus',
      'isLocalStatus',
      'mainInstStatus',
      'affiInstStatus',
      'docUrlStatus'
    ];

    const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
      return (
        prev +
        (xother_quali_data[0][curr] &&
        ['approved', 'rejected'].includes(xother_quali_data[0][curr])
          ? 1
          : 0)
      );
    }, 0);

    await this.prisma.hrisProgress.upsert({
      where: {
        tspId: nonTutorId
      },
      update: {
        qualificationsDataEmp: filledMandatoryFieldCount,
        qualificationsDataAuditor: auditedFieldCount,
        qualificationDataCount: `${filledMandatoryFieldCount}/8`,
        updatedAt: now
      },
      create: {
        tspId,
        qualificationsDataEmp: filledMandatoryFieldCount,
        qualificationsDataAuditor: auditedFieldCount,
        qualificationDataCount: `${filledMandatoryFieldCount}/8`,
        updatedAt: now
      }
    });

    const [details, approvedQualificationDetails] =
      await this.prisma.$transaction([
        this.prisma.hrisQualificationsData.findFirst({
          where: {
            tspId: nonTutorId
          },
          orderBy: {
            id: 'desc'
          },
          select: {
            xother_quali_data: {
              select: {
                id: true,
                localId: true,
                courseType: true,
                courseTypeStatus: true,
                courseTypeRejectReason: true,
                fieldStudy: true,
                fieldStudyStatus: true,
                fieldStudyRejectReason: true,
                hasMathStat: true,
                hasMathStatStatus: true,
                hasMathStatRejectReason: true,
                hasCompleted: true,
                hasCompletedStatus: true,
                hasCompletedRejectReason: true,
                startYear: true,
                startYearStatus: true,
                startYearRejectReason: true,
                completionYear: true,
                completionYearStatus: true,
                completionYearRejectReason: true,
                isLocal: true,
                isLocalStatus: true,
                isLocalRejectReason: true,
                mainInst: true,
                mainInstStatus: true,
                mainInstRejectReason: true,
                affiInst: true,
                affiInstStatus: true,
                affiInstRejectReason: true,
                docUrl: true,
                docUrlStatus: true,
                docUrlRejectReason: true,
                isHighestQualification: true
              }
            }
          }
        }),
        this.prisma.hrisQualificationsData.findFirst({
          where: {
            tspId: nonTutorId
          },
          orderBy: {
            id: 'desc'
          },
          include: {
            xother_quali_data: {
              select: {
                id: true,
                localId: true,
                courseType: true,
                courseTypeStatus: true,
                courseTypeRejectReason: true,
                fieldStudy: true,
                fieldStudyStatus: true,
                fieldStudyRejectReason: true,
                hasMathStat: true,
                hasCompleted: true,
                hasCompletedStatus: true,
                hasCompletedRejectReason: true,
                startYear: true,
                startYearStatus: true,
                startYearRejectReason: true,
                completionYear: true,
                completionYearStatus: true,
                completionYearRejectReason: true,
                isLocal: true,
                isLocalStatus: true,
                isLocalRejectReason: true,
                mainInst: true,
                mainInstStatus: true,
                mainInstRejectReason: true,
                affiInst: true,
                affiInstStatus: true,
                affiInstRejectReason: true,
                docUrl: true,
                docUrlStatus: true,
                docUrlRejectReason: true,
                approvedXotherQualiData: true,
                isHighestQualification: true
              }
            }
          }
        })
      ]);

    return { details, approvedQualificationDetails };
  }

  async getTempData(tspId: number) {
    try {
      return await this.prisma.hrisQualificationsData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          xother_quali_data: {
            select: {
              courseType: true,
              courseTypeRejectReason: true,
              courseTypeStatus: true,
              fieldStudy: true,
              fieldStudyRejectReason: true,
              fieldStudyStatus: true,
              hasCompleted: true,
              hasCompletedRejectReason: true,
              hasCompletedStatus: true,
              startYear: true,
              startYearRejectReason: true,
              startYearStatus: true,
              completionYear: true,
              completionYearRejectReason: true,
              completionYearStatus: true,
              isLocal: true,
              isLocalRejectReason: true,
              isLocalStatus: true,
              mainInst: true,
              mainInstRejectReason: true,
              mainInstStatus: true,
              affiInst: true,
              affiInstRejectReason: true,
              affiInstStatus: true,
              areaOfStudy: true,
              areaOfStudyRejectReason: true,
              areaOfStudyStatus: true,
              docUrl: true,
              docUrlRejectReason: true,
              docUrlStatus: true
            }
          }
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getApprovedData(tspId: number) {
    try {
      const data = await this.prisma.hrisQualificationsData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        include: {
          xother_quali_data: {
            select: {
              localId: true,
              courseType: true,
              courseTypeStatus: true,
              courseTypeRejectReason: true,
              fieldStudy: true,
              fieldStudyStatus: true,
              fieldStudyRejectReason: true,
              hasMathStat: true,
              hasCompleted: true,
              hasCompletedStatus: true,
              hasCompletedRejectReason: true,
              startYear: true,
              startYearStatus: true,
              startYearRejectReason: true,
              completionYear: true,
              completionYearStatus: true,
              completionYearRejectReason: true,
              isLocal: true,
              isLocalStatus: true,
              isLocalRejectReason: true,
              mainInst: true,
              mainInstStatus: true,
              mainInstRejectReason: true,
              affiInst: true,
              affiInstStatus: true,
              affiInstRejectReason: true,
              docUrl: true,
              docUrlStatus: true,
              docUrlRejectReason: true,
              approvedXotherQualiData: true
            }
          }
        }
      });
      return data;
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveTempData(
    tspId: number,
    tempData,
    xother_education_data,
    auditorId?: number
  ) {
    try {
      const now = new Date().toISOString();
      const educationData = await this.prisma.hrisEducationData.create({
        data: {
          tspId,
          ...tempData,
          olYear: tempData.olYear ? +tempData.olYear : null,
          alYear: tempData.alYear ? +tempData.alYear : null,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: auditorId ? now : null,
          auditedBy: auditorId ? auditorId : null
        }
      });
      await this.prisma.xotherEducationData.createMany({
        data: xother_education_data.map(({ ...xother }) => {
          return {
            ...xother,
            eId: educationData.id
          };
        })
      });
      await this.prisma.nTHRISProfileProgress.upsert({
        where: {
          tspId: tspId
        },
        update: {
          educationSectionFilled: true,
          lastFilledSection: 'education'
        },
        create: {
          tspId: tspId,
          educationSectionFilled: true,
          lastFilledSection: 'education'
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveApprovedData(auditorId: number, data) {
    console.log(data);
    try {
      const now = new Date().toISOString();
      return await this.prisma.approvedEducationData.upsert({
        where: {
          tspId: data.tspId
        },
        update: {
          ...data,
          olYear: data.olYear ? +data.olYear : null,
          alYear: data.alYear ? +data.alYear : null,
          approvedAt: now,
          approvedBy: auditorId
        },
        create: {
          ...data,
          olYear: data.olYear ? +data.olYear : null,
          alYear: data.alYear ? +data.alYear : null,
          approvedAt: now,
          approvedBy: auditorId
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
