import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AuditorSubmitWorkExperienceDto,
  ExperienceDataDto
} from './experience.dto';
import moment = require('moment');

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  async fetchExperienceDetails(tspId: number) {
    try {
      const details = await this.prisma.hrisWorkExpData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
          preWorkExp: true,
          preWorkExpStatus: true,
          preWorkExpRejectReason: true,
          preTsgType: true,
          xother_work_exp_data: {
            select: {
              localId: true,
              employerName: true,
              employmentType: true,
              jobTitle: true,
              currentlyEmployed: true,
              startDate: true,
              endDate: true,
              docUrl: true,
              docUrlStatus: true,
              docUrlRejectReason: true
            }
          }
        }
      });

      const approvedWorkExperienceDetails =
        await this.prisma.hrisWorkExpData.findFirst({
          where: {
            tspId: tspId
          },
          orderBy: {
            id: 'desc'
          },
          include: {
            xother_work_exp_data: {
              select: {
                id: true,
                localId: true,
                employerName: true,
                employmentType: true,
                jobTitle: true,
                currentlyEmployed: true,
                startDate: true,
                endDate: true,
                teachingExp: true,
                docUrl: true,
                docUrlStatus: true,
                docUrlRejectReason: true,
                ApprovedXotherWorkExpData: true
              }
            }
          }
        });

      return {
        success: true,
        data: {
          details,
          approvedWorkExperienceDetails
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Tutor: Submit Work Experience
  async saveExperienceDetails(tspId: number, data: ExperienceDataDto) {
    const now = new Date().toISOString();
    const {
      id,
      type,
      country,
      confirm,
      xother_work_exp_data,
      profileStatus,
      ...rest
    } = data;

    const lastData = await this.prisma.hrisWorkExpData.findFirst({
      where: {
        tspId: tspId
      },
      orderBy: {
        id: 'desc'
      }
    });

    let lastDataReasons = {};
    let updatedStatus = {};

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
              return [key, newStatus];
            })
            .reduce((prev, [key, value]) => {
              prev[key as string] = value;
              return prev;
            }, {})
        : {};
    }

    return this.prisma.$transaction(async (tx) => {
      const workExperienceData = await tx.hrisWorkExpData.create({
        data: {
          tspId: tspId,
          ...rest,
          // ...lastDataReasons,
          // ...updatedStatus,
          preTsgStart:
            rest.preTsgStart && rest.preTsgStart != ''
              ? new Date(rest.preTsgStart)
              : null,
          preTsgEnd:
            rest.preTsgEnd && rest.preTsgEnd != ''
              ? new Date(rest.preTsgEnd)
              : null,
          currentEmpStart:
            rest.currentEmpStart && rest.currentEmpStart != ''
              ? new Date(rest.currentEmpStart)
              : null,
          updatedBy: tspId,
          updatedAt: now
        },
        select: {
          id: true,
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
          preWorkExp: true,
          preWorkExpStatus: true,
          preWorkExpRejectReason: true,
          preTsgType: true,
          xother_work_exp_data: {
            select: {
              localId: true,
              employerName: true,
              employmentType: true,
              jobTitle: true,
              currentlyEmployed: true,
              startDate: true,
              endDate: true,
              docUrl: true,
              docUrlStatus: true,
              docUrlRejectReason: true
            }
          }
        }
      });

      await tx.xotherWorkExpData.createMany({
        data: xother_work_exp_data.map(({ id, ...xother }) => {
          return {
            ...xother,
            weId: workExperienceData.id,
            // tspId: tspId,
            localId: xother.localId !== null ? xother.localId : id,
            startDate:
              xother.startDate && xother.startDate != ''
                ? new Date(xother.startDate)
                : null,
            endDate:
              xother.endDate && xother.endDate != ''
                ? new Date(xother.endDate)
                : null
          };
        })
      });

      const fieldsMandatory = ['havePreTsg', 'isCurrentlyEmployed'];

      // if (workExperienceData?.havePreTsg === 'Yes') {
      //   fieldsMandatory = [...fieldsMandatory, 'preTsgStart', 'preTsgEnd'];
      // }

      // if (
      //   data.country !== 'India' &&
      //   workExperienceData?.isCurrentlyEmployed === 'Yes'
      // ) {
      //   fieldsMandatory = [...fieldsMandatory, 'currentEmpName'];
      // }

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return (
          prev +
          (workExperienceData[curr] && workExperienceData[curr] !== '' ? 1 : 0)
        );
      }, 0);

      const workDataCount = `${filledMandatoryFieldCount}/${fieldsMandatory.length}`;

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          workExpEmp: filledMandatoryFieldCount,
          workExperienceDataCount: workDataCount,
          updatedAt: now
        },
        create: {
          tspId,
          workExpEmp: filledMandatoryFieldCount,
          workExperienceDataCount: workDataCount,
          updatedAt: now
        }
      });

      return tx.hrisWorkExpData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
          preWorkExp: true,
          preWorkExpStatus: true,
          preWorkExpRejectReason: true,
          preTsgType: true,
          xother_work_exp_data: {
            select: {
              localId: true,
              employerName: true,
              employmentType: true,
              jobTitle: true,
              currentlyEmployed: true,
              startDate: true,
              endDate: true,
              docUrl: true,
              docUrlStatus: true,
              docUrlRejectReason: true
            }
          }
        }
      });
    });
  }

  async auditorSubmitExperienceDetails(
    tspId: number,
    data: AuditorSubmitWorkExperienceDto
  ) {
    const now = new Date().toISOString();
    const {
      id,
      type,
      country,
      confirm,
      xother_work_exp_data,
      nonTutorId,
      profileStatus,
      ...rest
    } = data;

    let lastData = await this.prisma.hrisWorkExpData.findFirst({
      where: {
        tspId: nonTutorId
      },
      orderBy: {
        id: 'desc'
      },
      select: {
        xother_work_exp_data: {
          orderBy: { id: 'asc' }
        }
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      const lastData2 = await this.prisma.hrisWorkExpData.create({
        data: {
          tspId: nonTutorId
        }
      });
      lastData = await this.prisma.hrisWorkExpData.findFirst({
        where: {
          tspId: nonTutorId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          xother_work_exp_data: {
            orderBy: { id: 'asc' }
          }
        }
      });
    }

    let previousApprovedData = await this.prisma.approvedWorkExpData.findUnique(
      {
        where: {
          tspId: nonTutorId
        }
      }
    );

    if (!previousApprovedData) {
      previousApprovedData = await this.prisma.approvedWorkExpData.create({
        data: {
          tspId: nonTutorId,
          approvedBy: tspId,
          approvedAt: now
        }
      });
    }

    let notAuditingFields: any = {};
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

    await this.prisma.approvedWorkExpData.update({
      where: { tspId: nonTutorId },
      data: {
        ...notAuditingFields,
        preTsgStart:
          notAuditingFields.preTsgStart && notAuditingFields.preTsgStart != ''
            ? notAuditingFields.preTsgStart
            : null,
        preTsgEnd:
          notAuditingFields.preTsgEnd && notAuditingFields.preTsgEnd != ''
            ? notAuditingFields.preTsgEnd
            : null,
        currentEmpStart:
          notAuditingFields.currentEmpStart &&
          notAuditingFields.currentEmpStart != ''
            ? notAuditingFields.currentEmpStart
            : null,
        ...auditingFields,
        approvedBy: tspId,
        approvedAt: now
      }
    });

    let lastXotherDataObj = {};

    if (lastData) {
      lastXotherDataObj = lastData.xother_work_exp_data.reduce((prev, curr) => {
        if (curr.localId) {
          prev[curr.localId] = curr;
        } else {
          prev[curr.id] = curr;
        }
        return prev;
      }, {} as any);
    }
    await this.prisma.$transaction(async (tx) => {
      const workExperienceData = await tx.hrisWorkExpData.create({
        data: {
          tspId: nonTutorId,
          ...rest,
          preTsgStart:
            rest.preTsgStart && rest.preTsgStart != ''
              ? rest.preTsgStart
              : null,
          preTsgEnd:
            rest.preTsgEnd && rest.preTsgEnd != '' ? rest.preTsgEnd : null,
          currentEmpStart:
            rest.currentEmpStart && rest.currentEmpStart != ''
              ? rest.currentEmpStart
              : null,
          updatedBy: tspId,
          updatedAt: now,
          auditedBy: tspId,
          auditedAt: now
        },
        select: {
          id: true,
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
          preWorkExp: true,
          preWorkExpStatus: true,
          preWorkExpRejectReason: true,
          preTsgType: true,
          preTsgStart: true,
          preTsgEnd: true,
          isCurrentlyEmployed: true,
          isCurrentlyEmployedStatus: true,
          isCurrentlyEmployedRejectReason: true,
          currentEmpName: true,
          currentEmpType: true,
          currentEmpTitle: true,
          currentEmpStart: true,
          currentEmpTeaching: true,
          currentEmpDocUrl: true,
          currentEmpDocUrlStatus: true,
          currentEmpDocUrlRejectReason: true,
          xother_work_exp_data: {
            select: {
              employerName: true,
              employmentType: true,
              jobTitle: true,
              currentlyEmployed: true,
              startDate: true,
              endDate: true,
              teachingExp: true,
              docUrl: true,
              docUrlStatus: true,
              docUrlRejectReason: true,
              ApprovedXotherWorkExpData: true
            }
          }
        }
      });

      const addedXotherWorkData = await Promise.all(
        xother_work_exp_data.map(({ id, ...xother }) => {
          delete xother['ApprovedXotherWorkExpData'];
          return tx.xotherWorkExpData.create({
            data: {
              ...xother,
              weId: workExperienceData.id,
              localId: xother.localId ? xother.localId : id,
              startDate:
                xother.startDate && xother.startDate != ''
                  ? xother.startDate
                  : null,
              endDate:
                xother.endDate && xother.endDate != '' ? xother.endDate : null,
              updatedBy: tspId,
              updatedAt: now
            }
          });
        })
      );

      lastXotherDataObj = addedXotherWorkData.reduce((prev, curr) => {
        if (curr.localId) {
          prev[curr.localId] = curr;
        } else {
          prev[curr.id] = curr;
        }
        return prev;
      }, {} as any);

      for (let index = 0; index < addedXotherWorkData.length; index++) {
        const xother = addedXotherWorkData[index];
        delete xother['ApprovedXotherWorkExpData'];
        const localId = xother.localId ?? xother.id;

        let previousApprovedData =
          await tx.approvedXotherWorkExpData.findUnique({
            where: {
              localId
            }
          });

        if (!previousApprovedData) {
          previousApprovedData = await tx.approvedXotherWorkExpData.create({
            data: {
              localId
            }
          });
        }

        let notAuditingFields = {};
        let auditingFields = {};

        if (previousApprovedData && lastData) {
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

        await tx.approvedXotherWorkExpData.update({
          where: { localId },
          data: {
            ...notAuditingFields,
            ...auditingFields,
            otherWorkExpId: xother.id,
            tspId: nonTutorId
          }
        });
      }

      let fieldsMandatory = [
        'havePreTsg',
        'preTsgStart',
        'preTsgEnd',
        'isCurrentlyEmployed'
      ];

      if (data.country !== 'India') {
        fieldsMandatory = [...fieldsMandatory, 'currentEmpName'];
      }

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return (
          prev +
          (workExperienceData[curr] && workExperienceData[curr] !== '' ? 1 : 0)
        );
      }, 0);

      const fieldsAudited = ['havePreTsgStatus', 'isCurrentlyEmployedStatus'];

      (workExperienceData as any)['isCurrentlyEmployed'] === 'Yes' &&
        fieldsAudited.push('currentEmpDocUrlStatus');

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (workExperienceData[curr] &&
          ['approved', 'rejected'].includes(workExperienceData[curr])
            ? 1
            : 0)
        );
      }, 0);

      let workDataCount = '';
      if (data.country === 'India') {
        workDataCount = `${filledMandatoryFieldCount}/4`;
      } else {
        workDataCount = `${filledMandatoryFieldCount}/5`;
      }

      await this.prisma.hrisProgress.upsert({
        where: {
          tspId: nonTutorId
        },
        update: {
          workExpEmp: filledMandatoryFieldCount,
          workExpAuditor: auditedFieldCount,
          workExperienceDataCount: workDataCount,
          updatedAt: now
        },
        create: {
          tspId,
          workExpEmp: filledMandatoryFieldCount,
          workExpAuditor: auditedFieldCount,
          workExperienceDataCount: workDataCount,
          updatedAt: now
        }
      });
    });

    const approvedXotherWork = await this.prisma.hrisWorkExpData.findFirst({
      where: {
        tspId: nonTutorId
      },
      orderBy: {
        id: 'desc'
      },
      include: {
        xother_work_exp_data: {
          select: {
            id: true,
            localId: true,
            employerName: true,
            employmentType: true,
            jobTitle: true,
            currentlyEmployed: true,
            startDate: true,
            endDate: true,
            teachingExp: true,
            docUrl: true,
            docUrlStatus: true,
            docUrlRejectReason: true,
            ApprovedXotherWorkExpData: true
          }
        }
      }
    });

    const approvedWork = await this.prisma.approvedWorkExpData.findFirst({
      where: {
        tspId: nonTutorId
      },
      select: {
        tspId: true,
        havePreTsg: true,
        preWorkExp: true,
        preTsgType: true,
        preTsgStart: true,
        preTsgEnd: true,
        isCurrentlyEmployed: true,
        currentEmpName: true,
        currentEmpType: true,
        currentEmpTitle: true,
        currentEmpStart: true
      }
    });

    const approvedWorkExperienceDetails = [] as any;
    approvedWorkExperienceDetails.push(approvedXotherWork ?? null);
    approvedWorkExperienceDetails.push(approvedWork ?? null);

    const [details] = await this.prisma.$transaction([
      this.prisma.hrisWorkExpData.findFirst({
        where: {
          tspId: nonTutorId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          id: true,
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
          preWorkExp: true,
          preWorkExpStatus: true,
          preWorkExpRejectReason: true,
          preTsgType: true,
          preTsgStart: true,
          preTsgEnd: true,
          isCurrentlyEmployed: true,
          isCurrentlyEmployedStatus: true,
          isCurrentlyEmployedRejectReason: true,
          currentEmpName: true,
          currentEmpType: true,
          currentEmpTitle: true,
          currentEmpStart: true,
          currentEmpTeaching: true,
          currentEmpDocUrl: true,
          currentEmpDocUrlStatus: true,
          currentEmpDocUrlRejectReason: true,
          xother_work_exp_data: {
            select: {
              id: true,
              localId: true,
              employerName: true,
              employmentType: true,
              jobTitle: true,
              currentlyEmployed: true,
              startDate: true,
              endDate: true,
              teachingExp: true,
              docUrl: true,
              docUrlStatus: true,
              docUrlRejectReason: true
            }
          }
        }
      })
    ]);

    return { details, approvedWorkExperienceDetails };
  }
}
