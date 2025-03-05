import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import {
  SubmitDetailsDto,
  AuditorSubmitDetailsDto
} from './health-declaration.dto';

@Injectable()
export class HealthDeclarationService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  //Tutor: Fetch Health Declaration
  async fetchDetails(tspId: number) {
    try {
      const approvedDetails = await this.prisma.approvedHealthData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          hd1Heart: true,
          hd1HeartState: true,
          hd2Neck: true,
          hd2NeckState: true,
          hd3High: true,
          hd3HighState: true,
          hd4Arthritis: true,
          hd4ArthritisState: true,
          hd5Terminally: true,
          hd5TerminallyState: true,
          hd6Unusual: true,
          hd6UnusualState: true,
          hd7Asthma: true,
          hd7AsthmaState: true,
          hd8Fainting: true,
          hd8FaintingState: true,
          hd9Depression: true,
          hd9DepressionState: true,
          hd10Throat: true,
          hd10ThroatState: true,
          hd12Vision: true,
          hd12VisionState: true,
          hd11Other: true,
          hd11OtherExplain: true,
          healthUrl_1: true,
          healthUrl_2: true,
          healthUrl_3: true,
          healthUrl_4: true,
          healthUrl_5: true,
          healthUrlCount: true
        }
      });

      const details = await this.prisma.hrisHealthData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        }
      });

      return {
        success: true,
        data: {
          details,
          approvedDetails
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Tutor: Submit Health Declaration
  async submitDetails(tspId: number, data: SubmitDetailsDto) {
    const { id, type, country, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    const lastData = await this.prisma.hrisHealthData.findFirst({
      where: {
        tspId
      },
      orderBy: {
        id: 'desc'
      }
    });

    let lastDataReasons = {};
    let updatedStatus = {};
    let hdPageStatus = ''; //manually handle grouped section status
    let gotPendingFields = false; //logic to trigger email notification to hris@ticketsthirdspaceportal.com

    if (lastData) {
      hdPageStatus = lastData.hdPageStatus; //set previous status for groupd section status

      lastDataReasons = Object.entries(lastData)
        .filter(
          ([key, value]) =>
            value !== null &&
            key.includes('RejectReason') &&
            !key.includes('hdPage')
        )
        .reduce((prev, [key, value]) => {
          prev[key] = value;
          return prev;
        }, {});

      updatedStatus = Object.entries(lastData)
        .filter(([key]) => key.includes('Status') && !key.includes('hdPage'))
        .map(([key, value]) => {
          const field = key.replace('Status', '');
          const newStatus = lastData[field] !== data[field] ? 'pending' : value;
          return [key, newStatus];
        })
        .reduce((prev, [key, value]) => {
          prev[key as string] = value;
          return prev;
        }, {});

      //custom logic to handle pending status movement of referee data based on grouped field update
      const healthList2Compare = [
        'hd1Heart',
        'hd2Neck',
        'hd3High',
        'hd4Arthritis',
        'hd5Terminally',
        'hd6Unusual',
        'hd7Asthma',
        'hd8Fainting',
        'hd9Depression',
        'hd10Throat',
        'hd12Vision',
        'hd11Other'
      ];
      //even a single field is updated, change status to pending
      hdPageStatus = healthList2Compare.some(
        (key) => lastData[`${key}1`] !== data[`${key}1`]
      )
        ? 'pending'
        : hdPageStatus;
      gotPendingFields = hdPageStatus === 'pending' || gotPendingFields;
      //end: custom logic
    }

    return this.prisma.$transaction(async (tx) => {
      const healthData = await tx.hrisHealthData.create({
        data: {
          tspId,
          ...rest,
          ...lastDataReasons,
          ...updatedStatus,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: null,
          auditedBy: null
        },
        select: {
          hd1Heart: true,
          hd1HeartState: true,
          hd2Neck: true,
          hd2NeckState: true,
          hd3High: true,
          hd3HighState: true,
          hd4Arthritis: true,
          hd4ArthritisState: true,
          hd5Terminally: true,
          hd5TerminallyState: true,
          hd6Unusual: true,
          hd6UnusualState: true,
          hd7Asthma: true,
          hd7AsthmaState: true,
          hd8Fainting: true,
          hd8FaintingState: true,
          hd9Depression: true,
          hd9DepressionState: true,
          hd10Throat: true,
          hd10ThroatState: true,
          hd12Vision: true,
          hd12VisionState: true,
          hd11Other: true,
          hd11OtherExplain: true,
          hdPageStatus: true,
          hdPageRejectReason: true,
          recordApproved: true,
          healthUrl_1: true,
          healthUrl_1Status: true,
          healthUrl_1RejectReason: true,
          healthUrl_2: true,
          healthUrl_2Status: true,
          healthUrl_2RejectReason: true,
          healthUrl_3: true,
          healthUrl_3Status: true,
          healthUrl_3RejectReason: true,
          healthUrl_4: true,
          healthUrl_4Status: true,
          healthUrl_4RejectReason: true,
          healthUrl_5: true,
          healthUrl_5Status: true,
          healthUrl_5RejectReason: true,
          healthUrlCount: true
        }
      });

      await tx.approvedHealthData.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
        }
      });

      const fieldsMandatory = [
        'hd1Heart',
        'hd2Neck',
        'hd3High',
        'hd4Arthritis',
        'hd5Terminally',
        'hd6Unusual',
        'hd7Asthma',
        'hd8Fainting',
        'hd9Depression',
        'hd10Throat',
        'hd12Vision',
        'hd11Other'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (healthData[curr] && healthData[curr] !== '' ? 1 : 0);
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          healthDataEmp: filledMandatoryFieldCount,
          healthDataCount: `${filledMandatoryFieldCount}/12`
        },
        create: {
          tspId,
          healthDataEmp: filledMandatoryFieldCount,
          healthDataCount: `${filledMandatoryFieldCount}/12`
        }
      });

      const details = await tx.hrisHealthData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          hd1Heart: true,
          hd1HeartState: true,
          hd2Neck: true,
          hd2NeckState: true,
          hd3High: true,
          hd3HighState: true,
          hd4Arthritis: true,
          hd4ArthritisState: true,
          hd5Terminally: true,
          hd5TerminallyState: true,
          hd6Unusual: true,
          hd6UnusualState: true,
          hd7Asthma: true,
          hd7AsthmaState: true,
          hd8Fainting: true,
          hd8FaintingState: true,
          hd9Depression: true,
          hd9DepressionState: true,
          hd10Throat: true,
          hd10ThroatState: true,
          hd12Vision: true,
          hd12VisionState: true,
          hd11Other: true,
          hd11OtherExplain: true,
          hdPageStatus: true,
          hdPageRejectReason: true,
          recordApproved: true,
          healthUrl_1: true,
          healthUrl_1Status: true,
          healthUrl_1RejectReason: true,
          healthUrl_2: true,
          healthUrl_2Status: true,
          healthUrl_2RejectReason: true,
          healthUrl_3: true,
          healthUrl_3Status: true,
          healthUrl_3RejectReason: true,
          healthUrl_4: true,
          healthUrl_4Status: true,
          healthUrl_4RejectReason: true,
          healthUrl_5: true,
          healthUrl_5Status: true,
          healthUrl_5RejectReason: true,
          healthUrlCount: true
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
          'Health Declarations'
        );
      }

      return details;
    });
  }

  //Auditor: Submit Health Declaration
  async auditorSubmitDetails(tspId: number, data: AuditorSubmitDetailsDto) {
    const { id, type, country, candidateId, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    let lastData = await this.prisma.hrisHealthData.findFirst({
      where: {
        tspId: candidateId
      },
      orderBy: {
        id: 'desc'
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisHealthData.create({
        data: {
          tspId: candidateId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const healthData = await tx.hrisHealthData.create({
        data: {
          tspId: candidateId,
          ...rest,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
        },
        select: {
          hd1Heart: true,
          hd1HeartState: true,
          hd2Neck: true,
          hd2NeckState: true,
          hd3High: true,
          hd3HighState: true,
          hd4Arthritis: true,
          hd4ArthritisState: true,
          hd5Terminally: true,
          hd5TerminallyState: true,
          hd6Unusual: true,
          hd6UnusualState: true,
          hd7Asthma: true,
          hd7AsthmaState: true,
          hd8Fainting: true,
          hd8FaintingState: true,
          hd9Depression: true,
          hd9DepressionState: true,
          hd10Throat: true,
          hd10ThroatState: true,
          hd12Vision: true,
          hd12VisionState: true,
          hd11Other: true,
          hd11OtherExplain: true,
          hdPageStatus: true,
          hdPageRejectReason: true,
          recordApproved: true,
          healthUrl_1: true,
          healthUrl_1Status: true,
          healthUrl_1RejectReason: true,
          healthUrl_2: true,
          healthUrl_2Status: true,
          healthUrl_2RejectReason: true,
          healthUrl_3: true,
          healthUrl_3Status: true,
          healthUrl_3RejectReason: true,
          healthUrl_4: true,
          healthUrl_4Status: true,
          healthUrl_4RejectReason: true,
          healthUrl_5: true,
          healthUrl_5Status: true,
          healthUrl_5RejectReason: true,
          healthUrlCount: true
        }
      });

      let previousApprovedData = await tx.approvedHealthData.findUnique({
        where: {
          tspId: candidateId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedHealthData.create({
          data: {
            tspId: candidateId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }

      let notAuditingFields = {};
      let auditingFields = {};
      const bulkFields =
        data.hdPageStatus === 'approved'
          ? []
          : [
              'hd1Heart',
              'hd1HeartState',
              'hd2Neck',
              'hd2NeckState',
              'hd3High',
              'hd3HighState',
              'hd4Arthritis',
              'hd4ArthritisState',
              'hd5Terminally',
              'hd5TerminallyState',
              'hd6Unusual',
              'hd6UnusualState',
              'hd7Asthma',
              'hd7AsthmaState',
              'hd8Fainting',
              'hd8FaintingState',
              'hd9Depression',
              'hd9DepressionState',
              'hd10Throat',
              'hd10ThroatState',
              'hd12Vision',
              'hd12VisionState',
              'hd11Other',
              'hd11OtherExplain'
            ];

      if (previousApprovedData && lastData) {
        notAuditingFields = Object.entries(previousApprovedData)
          .filter(([key]) => !bulkFields.includes(key))
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

      await tx.approvedHealthData.update({
        where: { tspId: candidateId },
        data: {
          ...notAuditingFields,
          ...auditingFields,
          updatedFlag: 3,
          approvedAt: now,
          approvedBy: tspId
        }
      });

      const fieldsMandatory = [
        'hd1Heart',
        'hd2Neck',
        'hd3High',
        'hd4Arthritis',
        'hd5Terminally',
        'hd6Unusual',
        'hd7Asthma',
        'hd8Fainting',
        'hd9Depression',
        'hd10Throat',
        'hd12Vision',
        'hd11Other'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (healthData[curr] && healthData[curr] !== '' ? 1 : 0);
      }, 0);

      const fieldsAudited = ['hdPageStatus'];

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (healthData[curr] &&
          ['approved', 'rejected'].includes(healthData[curr])
            ? 1
            : 0)
        );
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId: candidateId
        },
        update: {
          healthDataEmp: filledMandatoryFieldCount,
          healthDataAuditor: auditedFieldCount,
          healthDataCount: `${filledMandatoryFieldCount}/12`
        },
        create: {
          tspId,
          healthDataEmp: filledMandatoryFieldCount,
          healthDataAuditor: auditedFieldCount,
          healthDataCount: `${filledMandatoryFieldCount}/12`
        }
      });

      const details = await tx.hrisHealthData.findFirst({
        where: {
          tspId: candidateId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          hd1Heart: true,
          hd1HeartState: true,
          hd2Neck: true,
          hd2NeckState: true,
          hd3High: true,
          hd3HighState: true,
          hd4Arthritis: true,
          hd4ArthritisState: true,
          hd5Terminally: true,
          hd5TerminallyState: true,
          hd6Unusual: true,
          hd6UnusualState: true,
          hd7Asthma: true,
          hd7AsthmaState: true,
          hd8Fainting: true,
          hd8FaintingState: true,
          hd9Depression: true,
          hd9DepressionState: true,
          hd10Throat: true,
          hd10ThroatState: true,
          hd12Vision: true,
          hd12VisionState: true,
          hd11Other: true,
          hd11OtherExplain: true,
          hdPageStatus: true,
          hdPageRejectReason: true,
          recordApproved: true,
          healthUrl_1: true,
          healthUrl_1Status: true,
          healthUrl_1RejectReason: true,
          healthUrl_2: true,
          healthUrl_2Status: true,
          healthUrl_2RejectReason: true,
          healthUrl_3: true,
          healthUrl_3Status: true,
          healthUrl_3RejectReason: true,
          healthUrl_4: true,
          healthUrl_4Status: true,
          healthUrl_4RejectReason: true,
          healthUrl_5: true,
          healthUrl_5Status: true,
          healthUrl_5RejectReason: true,
          healthUrlCount: true
        }
      });

      const approvedDetails = await tx.approvedHealthData.findUnique({
        where: {
          tspId: candidateId
        },
        select: {
          hd1Heart: true,
          hd1HeartState: true,
          hd2Neck: true,
          hd2NeckState: true,
          hd3High: true,
          hd3HighState: true,
          hd4Arthritis: true,
          hd4ArthritisState: true,
          hd5Terminally: true,
          hd5TerminallyState: true,
          hd6Unusual: true,
          hd6UnusualState: true,
          hd7Asthma: true,
          hd7AsthmaState: true,
          hd8Fainting: true,
          hd8FaintingState: true,
          hd9Depression: true,
          hd9DepressionState: true,
          hd10Throat: true,
          hd10ThroatState: true,
          hd12Vision: true,
          hd12VisionState: true,
          hd11Other: true,
          hd11OtherExplain: true,
          healthUrl_1: true,
          healthUrl_2: true,
          healthUrl_3: true,
          healthUrl_4: true,
          healthUrl_5: true,
          healthUrlCount: true
        }
      });
      return { details, approvedDetails };
    });
  }
}
