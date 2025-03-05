import { async } from 'rxjs';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import {
  AuditorSubmitEducationalQualificationsDto,
  AuditorSubmitWorkExperienceDto,
  SubmitEducationalQualificationsDto,
  SubmitWorkExperienceDto
} from './professional-qualifications.dto';

// MISSING fields here!!
@Injectable()
export class ProfessionalQualificationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  // Tutor: Fetch Educational Qualifications details
  async fetchEducationalQualifications(tspId: number) {
    try {
      const approvedQualificationDetails =
        await this.prisma.hrisQualificationsData.findFirst({
          where: {
            tspId: tspId
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
                isHighestQualification: true,
                approvedXotherQualiData: true
              }
            }
          }
        });

      const details = await this.prisma.hrisQualificationsData.findFirst({
        where: {
          tspId: tspId,
          xother_quali_data: {
            some: {}
          }
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
              isHighestQualification: true
            }
          }
        }
      });
      return {
        success: true,
        data: {
          details,
          approvedQualificationDetails
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Tutor: Submit Educational Qualifications details
  async submitEducationalQualifications(
    tspId: number,
    data: SubmitEducationalQualificationsDto
  ) {
    const now = new Date().toISOString();
    const {
      id,
      type,
      country,
      confirm,
      xother_quali_data,
      profileStatus,
      ...rest
    } = data;

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
            updatedAt: now,
            auditedAt: null,
            auditedBy: null
          },
          select: {
            id: true
          }
        });

      await tx.approvedQualificationsData.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
        }
      });

      await tx.xotherQualiData.createMany({
        data: xother_quali_data.map(({ id, ...xother }) => {
          return {
            ...xother,
            qId: educationalQualificationsData.id,
            tspId: tspId,
            localId: xother.localId !== null ? xother.localId : id,
            startYear:
              xother.startYear && xother.startYear != ''
                ? xother.startYear
                : null,
            completionYear:
              xother.completionYear && xother.completionYear != ''
                ? xother.completionYear
                : null,
            // isHighestQualification: true,
            hasMathStat: false // TODO: add logic to check if math suject
          };
        })
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

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          qualificationsDataEmp: filledMandatoryFieldCount,
          qualificationDataCount: `${filledMandatoryFieldCount}/8`,
          updatedAt: now
        },
        create: {
          tspId,
          qualificationsDataEmp: filledMandatoryFieldCount,
          qualificationDataCount: `${filledMandatoryFieldCount}/8`,
          updatedAt: now
        }
      });

      const hrisProgressFetched = await tx.user.findUnique({
        where: {
          tsp_id: tspId
        },
        include: {
          user_hris_progress: {
            select: {
              profileStatus: true
            }
          },
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          approved_contact_data: {
            select: {
              workEmail: true
            }
          }
        }
      });
      if (
        hrisProgressFetched &&
        hrisProgressFetched.user_hris_progress &&
        hrisProgressFetched.user_hris_progress.profileStatus &&
        hrisProgressFetched.user_hris_progress.profileStatus === 'active' &&
        gotPendingFields
      ) {
        // notify hris@ticketsthirdspaceportal.com on tutor updating key profile data
        await this.mailService.sendNotification2Ticketsthirdspaceportal(
          tspId + '',
          hrisProgressFetched?.approved_personal_data?.shortName ?? '',
          hrisProgressFetched?.approved_contact_data?.workEmail ?? '',
          'Qualifications'
        );
      }

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
      });
    });
  }

  //Auditor: Submit Educational Qualifications details
  async auditorSubmitEducationalQualifications(
    tspId: number,
    data: AuditorSubmitEducationalQualificationsDto
  ) {
    const now = new Date().toISOString();

    const {
      id,
      type,
      country,
      confirm,
      xother_quali_data,
      profileStatus,
      candidateId,
      ...rest
    } = data;

    const lastData = await this.prisma.hrisQualificationsData.findFirst({
      where: {
        tspId: candidateId
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
          tspId: candidateId
        }
      });

    if (!previousApprovedData) {
      previousApprovedData =
        await this.prisma.approvedQualificationsData.create({
          data: {
            tspId: candidateId,
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
      where: { tspId: candidateId },
      data: {
        updatedFlag: 3,
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
            tspId: candidateId,
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
        xother_quali_data.map(({ id, ...xother }) => {
          delete xother['approvedXotherQualiData'];
          return tx.xotherQualiData.create({
            data: {
              ...xother,
              qId: educationalQualificationsData.id,
              tspId: candidateId,
              localId: xother.localId ? xother.localId : id,
              startYear:
                xother.startYear && xother.startYear != ''
                  ? xother.startYear
                  : null,
              completionYear:
                xother.completionYear && xother.completionYear != ''
                  ? xother.completionYear
                  : null,
              hasMathStat: false, // TODO: add logic to check if math suject
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
            tspId: candidateId
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
        tspId: candidateId
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
            tspId: candidateId
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
            tspId: candidateId
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

  // Tutor: Fetch Work Experience details
  async fetchWorkExperience(tspId: number) {
    try {
      const details = await this.prisma.hrisWorkExpData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          id: true,
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
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
  async submitWorkExperience(tspId: number, data: SubmitWorkExperienceDto) {
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
          auditedAt: null,
          auditedBy: null
        },
        select: {
          id: true,
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
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
      });

      await tx.approvedWorkExpData.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
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
                ? xother.startDate
                : null,
            endDate:
              xother.endDate && xother.endDate != '' ? xother.endDate : null
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
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          id: true,
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
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
      });
    });
  }

  //Auditor: Submit work experience details
  async auditorSubmitWorkExperience(
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
      candidateId,
      profileStatus,
      ...rest
    } = data;

    let lastData = await this.prisma.hrisWorkExpData.findFirst({
      where: {
        tspId: candidateId
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
      await this.prisma.hrisWorkExpData.create({
        data: {
          tspId: candidateId
        }
      });
      lastData = await this.prisma.hrisWorkExpData.findFirst({
        where: {
          tspId: candidateId
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
          tspId: candidateId
        }
      }
    );

    if (!previousApprovedData) {
      previousApprovedData = await this.prisma.approvedWorkExpData.create({
        data: {
          tspId: candidateId,
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
      where: { tspId: candidateId },
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
        updatedFlag: 3,
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
          tspId: candidateId,
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
            tspId: candidateId
          }
        });
      }

      const fieldsMandatory = ['havePreTsg', 'isCurrentlyEmployed'];

      // if (data.country !== 'India') {
      //   fieldsMandatory = [...fieldsMandatory, 'currentEmpName'];
      // }

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

      const workDataCount = `${filledMandatoryFieldCount}/${fieldsMandatory.length}`;

      await this.prisma.hrisProgress.upsert({
        where: {
          tspId: candidateId
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
        tspId: candidateId
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
        tspId: candidateId
      },
      select: {
        tspId: true,
        havePreTsg: true,
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
          tspId: candidateId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          id: true,
          havePreTsg: true,
          havePreTsgStatus: true,
          havePreTsgRejectReason: true,
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
