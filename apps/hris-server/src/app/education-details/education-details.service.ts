import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  AuditorEducationSubmitDetailsDto,
  SubmitEducationDetailsDto
} from './education-details.dto';

@Injectable()
export class EducationDetailsService {
  constructor(private prisma: PrismaService) {}

  //Tutor: Fetch Education Details
  async fetchDetails(tspId: string) {
    try {
      const approvedDetails =
        await this.prisma.approvedEducationData.findUnique({
          where: {
            tspId: +tspId
          },
          select: {
            olState: true,
            olSyllabus: true,
            olYear: true,
            olMaths: true,
            olEnglish: true,
            olCertificateUrl: true,
            alSyllabus: true,
            alYear: true,
            alStream: true,
            alCertificateUrl: true,
            alSubject1: true,
            alSubject1Result: true,
            alSubject2: true,
            alSubject2Result: true,
            alSubject3: true,
            alSubject3Result: true,
            alSubject4: true,
            alSubject4Result: true,
            alSubject5: true,
            alSubject5Result: true,
            alCheck: true,
            other: true
          }
        });

      const details = await this.prisma.hrisEducationData.findFirst({
        where: {
          tspId: +tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          olState: true,
          olSyllabus: true,
          olSyllabusStatus: true,
          olSyllabusRejectReason: true,
          olYear: true,
          olYearStatus: true,
          olYearRejectReason: true,
          olMaths: true,
          olMathsStatus: true,
          olMathsRejectReason: true,
          olEnglish: true,
          olEnglishStatus: true,
          olEnglishRejectReason: true,
          olCertificateUrl: true,
          olCertificateUrlStatus: true,
          olCertificateUrlRejectReason: true,
          alCheck: true,
          alSyllabus: true,
          alSyllabusStatus: true,
          alSyllabusRejectReason: true,
          alYear: true,
          alYearStatus: true,
          alYearRejectReason: true,
          alStream: true,
          alStreamStatus: true,
          alStreamRejectReason: true,
          alCertificateUrl: true,
          alCertificateUrlStatus: true,
          alCertificateUrlRejectReason: true,
          alSubject1: true,
          alSubject1Status: true,
          alSubject1RejectReason: true,
          alSubject1Result: true,
          alSubject2: true,
          alSubject2Status: true,
          alSubject2RejectReason: true,
          alSubject2Result: true,
          alSubject3: true,
          alSubject3Status: true,
          alSubject3RejectReason: true,
          alSubject3Result: true,
          alSubject4: true,
          alSubject4Status: true,
          alSubject4RejectReason: true,
          alSubject4Result: true,
          alSubject5: true,
          alSubject5Status: true,
          alSubject5RejectReason: true,
          alSubject5Result: true
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

  //Tutor: Submit Education Details
  async submitDetails(tspId: number, data: SubmitEducationDetailsDto) 
  {
    const { id, type, country, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    const lastData = await this.prisma.hrisEducationData.findFirst({
      where: {
        tspId
      },
      orderBy: {
        id: 'desc'
      }
    });

    let lastDataReasons = {};
    let updatedStatus = {};

    if (lastData) {
      lastDataReasons = Object.entries(lastData)
        .filter(
          ([key, value]) => value !== null && key.includes('RejectReason')
        )
        .reduce((prev, [key, value]) => {
          prev[key] = value;
          return prev;
        }, {});

      updatedStatus = Object.entries(lastData)
        .filter(([key]) => key.includes('Status'))
        .map(([key, value]) => {
          const field = key.replace('Status', '');
          const newStatus = lastData[field] !== data[field] ? 'pending' : value;
          return [key, newStatus];
        })
        .reduce((prev, [key, value]) => {
          prev[key as string] = value;
          return prev;
        }, {});
    }

    return this.prisma.$transaction(async (tx) => {
      const educationData = await tx.hrisEducationData.create({
        data: {
          tspId,
          ...rest,
          olYear: +rest.olYear,
          alYear: +rest.alYear,
          ...lastDataReasons,
          ...updatedStatus,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: null,
          auditedBy: null
        }
      });

      await tx.approvedEducationData.upsert({
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
        'olSyllabus',
        'olYear',
        'olMaths',
        'olEnglish',
        'alCheck',
        'olCertificateUrl'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return (
          prev + (educationData[curr] && educationData[curr] !== '' ? 1 : 0)
        );
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          educationDataEmp: filledMandatoryFieldCount,
          educationalDataCount: `${filledMandatoryFieldCount}/6`
        },
        create: {
          tspId,
          educationDataEmp: filledMandatoryFieldCount,
          educationalDataCount: `${filledMandatoryFieldCount}/6`
        }
      });

      const details = await tx.hrisEducationData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          olState: true,
          olSyllabus: true,
          olSyllabusStatus: true,
          olSyllabusRejectReason: true,
          olYear: true,
          olYearStatus: true,
          olYearRejectReason: true,
          olMaths: true,
          olMathsStatus: true,
          olMathsRejectReason: true,
          olEnglish: true,
          olEnglishStatus: true,
          olEnglishRejectReason: true,
          olCertificateUrl: true,
          olCertificateUrlStatus: true,
          olCertificateUrlRejectReason: true,
          alCheck: true,
          alSyllabus: true,
          alSyllabusStatus: true,
          alSyllabusRejectReason: true,
          alYear: true,
          alYearStatus: true,
          alYearRejectReason: true,
          alStream: true,
          alStreamStatus: true,
          alStreamRejectReason: true,
          alCertificateUrl: true,
          alCertificateUrlStatus: true,
          alCertificateUrlRejectReason: true,
          alSubject1: true,
          alSubject1Status: true,
          alSubject1RejectReason: true,
          alSubject1Result: true,
          alSubject2: true,
          alSubject2Status: true,
          alSubject2RejectReason: true,
          alSubject2Result: true,
          alSubject3: true,
          alSubject3Status: true,
          alSubject3RejectReason: true,
          alSubject3Result: true,
          alSubject4: true,
          alSubject4Status: true,
          alSubject4RejectReason: true,
          alSubject4Result: true,
          alSubject5: true,
          alSubject5Status: true,
          alSubject5RejectReason: true,
          alSubject5Result: true
        }
      });

      return details;
    });
  }

  //Auditor: Submit Education Details
  async auditorSubmitDetails(
    tspId: number,
    data: AuditorEducationSubmitDetailsDto
  ) {
    const { id, type, country, candidateId, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    let lastData = await this.prisma.hrisEducationData.findFirst({
      where: {
        tspId: candidateId
      },
      orderBy: {
        id: 'desc'
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisEducationData.create({
        data: {
          tspId: candidateId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const educationData = await tx.hrisEducationData.create({
        data: {
          tspId: candidateId,
          ...rest,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
        },
        select: {
          olState: true,
          olSyllabus: true,
          olSyllabusStatus: true,
          olSyllabusRejectReason: true,
          olYear: true,
          olYearStatus: true,
          olYearRejectReason: true,
          olMaths: true,
          olMathsStatus: true,
          olMathsRejectReason: true,
          olEnglish: true,
          olEnglishStatus: true,
          olEnglishRejectReason: true,
          olCertificateUrl: true,
          olCertificateUrlStatus: true,
          olCertificateUrlRejectReason: true,
          alCheck: true,
          alSyllabus: true,
          alSyllabusStatus: true,
          alSyllabusRejectReason: true,
          alYear: true,
          alYearStatus: true,
          alYearRejectReason: true,
          alStream: true,
          alStreamStatus: true,
          alStreamRejectReason: true,
          alCertificateUrl: true,
          alCertificateUrlStatus: true,
          alCertificateUrlRejectReason: true,
          alSubject1: true,
          alSubject1Status: true,
          alSubject1RejectReason: true,
          alSubject1Result: true,
          alSubject2: true,
          alSubject2Status: true,
          alSubject2RejectReason: true,
          alSubject2Result: true,
          alSubject3: true,
          alSubject3Status: true,
          alSubject3RejectReason: true,
          alSubject3Result: true,
          alSubject4: true,
          alSubject4Status: true,
          alSubject4RejectReason: true,
          alSubject4Result: true,
          alSubject5: true,
          alSubject5Status: true,
          alSubject5RejectReason: true,
          alSubject5Result: true
        }
      });

      let previousApprovedData = await tx.approvedEducationData.findUnique({
        where: {
          tspId: candidateId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedEducationData.create({
          data: {
            tspId: candidateId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }

      let fieldsAudited = [
        'olSyllabusStatus',
        'olYearStatus',
        'olMathsStatus',
        'olEnglishStatus',
        'olCertificateUrlStatus'
      ];

      if (data.country !== 'India') {
        fieldsAudited = [
          ...fieldsAudited,
          'alSyllabusStatus',
          'alYearStatus',
          'alStreamStatus',
          'alCertificateUrlStatus',
          'alSubject1Status',
          'alSubject2Status',
          'alSubject3Status',
          'alSubject4Status',
          'alSubject5Status'
        ];
      }

      let notAuditingFields = {};
      let auditingFields = {};
      const bulkFields = [];

      /**
       * custom logic to approve al subject + result
       */
      [1, 2, 3, 4, 5].forEach((i) => {
        if (data[`alSubject${i}Status`] !== 'approved') {
          bulkFields.push(`alSubject${i}Result`);
        }
      });

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
            } else if (!fieldsAudited.includes(key + 'Status')) {
              prev[key as string] = data[key];
            } else {
              prev[key as string] = value;
            }
            return prev;
          }, {} as any);
      }

      await tx.approvedEducationData.update({
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
        'olSyllabus',
        'olYear',
        'olMaths',
        'olEnglish',
        'alCheck',
        'olCertificateUrl'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return (
          prev + (educationData[curr] && educationData[curr] !== '' ? 1 : 0)
        );
      }, 0);

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (educationData[curr] &&
          ['approved', 'rejected'].includes(educationData[curr])
            ? 1
            : 0)
        );
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId: candidateId
        },
        update: {
          educationDataEmp: filledMandatoryFieldCount,
          educationDataAuditor: auditedFieldCount,
          educationalDataCount: `${filledMandatoryFieldCount}/6`
        },
        create: {
          tspId,
          educationDataEmp: filledMandatoryFieldCount,
          educationDataAuditor: auditedFieldCount,
          educationalDataCount: `${filledMandatoryFieldCount}/6`
        }
      });

      const details = await tx.hrisEducationData.findFirst({
        where: {
          tspId: candidateId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          olState: true,
          olSyllabus: true,
          olSyllabusStatus: true,
          olSyllabusRejectReason: true,
          olYear: true,
          olYearStatus: true,
          olYearRejectReason: true,
          olMaths: true,
          olMathsStatus: true,
          olMathsRejectReason: true,
          olEnglish: true,
          olEnglishStatus: true,
          olEnglishRejectReason: true,
          olCertificateUrl: true,
          olCertificateUrlStatus: true,
          olCertificateUrlRejectReason: true,
          alCheck: true,
          alSyllabus: true,
          alSyllabusStatus: true,
          alSyllabusRejectReason: true,
          alYear: true,
          alYearStatus: true,
          alYearRejectReason: true,
          alStream: true,
          alStreamStatus: true,
          alStreamRejectReason: true,
          alCertificateUrl: true,
          alCertificateUrlStatus: true,
          alCertificateUrlRejectReason: true,
          alSubject1: true,
          alSubject1Status: true,
          alSubject1RejectReason: true,
          alSubject1Result: true,
          alSubject2: true,
          alSubject2Status: true,
          alSubject2RejectReason: true,
          alSubject2Result: true,
          alSubject3: true,
          alSubject3Status: true,
          alSubject3RejectReason: true,
          alSubject3Result: true,
          alSubject4: true,
          alSubject4Status: true,
          alSubject4RejectReason: true,
          alSubject4Result: true,
          alSubject5: true,
          alSubject5Status: true,
          alSubject5RejectReason: true,
          alSubject5Result: true
        }
      });

      const approvedDetails = await tx.approvedEducationData.findUnique({
        where: {
          tspId: candidateId
        },
        select: {
          olState: true,
          olSyllabus: true,
          olYear: true,
          olMaths: true,
          olEnglish: true,
          olCertificateUrl: true,
          alSyllabus: true,
          alYear: true,
          alStream: true,
          alCertificateUrl: true,
          alSubject1: true,
          alSubject1Result: true,
          alSubject2: true,
          alSubject2Result: true,
          alSubject3: true,
          alSubject3Result: true,
          alSubject4: true,
          alSubject4Result: true,
          alSubject5: true,
          alSubject5Result: true,
          alCheck: true,
          other: true
        }
      });

      return { details, approvedDetails };
    });
  }
}
