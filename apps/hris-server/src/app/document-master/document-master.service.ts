import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DocumentMasterDto } from './documentMaster.dto';

@Injectable()
export class DocumentMasterService {
  constructor(private prisma: PrismaService) {}
  async fetchTableDocumentMaster({
    tspId,
    email,
    name,
    country,
    auditor,
    export2Csv = '',
    auditStatus,
    profileStatus,
    skip,
    take
  }: DocumentMasterDto) {
    const isWhere =
      name ||
      auditStatus ||
      profileStatus ||
      email ||
      country ||
      tspId ||
      auditor;

    const tspIds =
      tspId &&
      tspId
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    try {
      const where = isWhere
        ? {
            level: {
              in: [1, 2]
            },
            tsp_id: tspId ? { in: tspIds } : {},
            ...(name
              ? {
                  approved_personal_data: {
                    shortName: name ? { contains: name } : {}
                  }
                }
              : {}),
            ...(auditor || profileStatus || auditStatus
              ? {
                  user_hris_progress: {
                    auditorId: auditor ? { equals: +auditor } : {},
                    profileStatus: profileStatus
                      ? { equals: profileStatus }
                      : {},
                    tutorStatus: auditStatus
                      ? { equals: auditStatus }
                      : { not: null }
                  }
                }
              : {
                  user_hris_progress: {
                    tutorStatus: {
                      not: null
                    }
                  }
                }),
            ...(email || country
              ? {
                  approved_contact_data: {
                    workEmail: email
                      ? {
                          contains: email
                        }
                      : {},
                    residingCountry:
                      country && ['Sri Lanka', 'India'].includes(country)
                        ? { equals: country }
                        : country && country === 'Other'
                        ? { notIn: ['Sri Lanka', 'India'] }
                        : {}
                  }
                }
              : {})
          }
        : {
            level: {
              in: [1, 2]
            },
            user_hris_progress: {
              tutorStatus: {
                not: null
              }
            }
          };

      const [getDocument, rowCount] = await Promise.all([
        this.prisma.user.findMany({
          where: where,
          select: {
            tsp_id: true,
            approved_personal_data: {
              select: {
                shortName: true,
                birthCertificateUrl: true,
                nicUrl: true,
                ppUrl: true
              }
            },
            approved_contact_data: {
              select: {
                residingCountry: true,
                mobileNumber: true,
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
                profileStatus: true,
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
                },
                tutorStatus: true
              }
            },
            approved_right2work_data: {
              select: {
                contractUrl: true,
                gsUrl: true,
                pccUrl: true
              }
            },
            approved_education_data: {
              select: {
                olCertificateUrl: true,
                alCertificateUrl: true
              }
            },
            approved_work_exp_data: {
              select: {
                currentEmpDocUrl: true
              }
            },
            approved_it_data: {
              select: {
                pcUrl: true,
                headsetUrl: true,
                primarySpeedUrl: true,
                secondarySpeedUrl: true
              }
            },
            approved_bank_data: {
              select: {
                bPassbookUrl: true
              }
            }
          },
          ...(!export2Csv ? { take: +take, skip: +skip } : {})
        }),
        this.prisma.user.count({
          where: where
        })
      ]);

      const dataToReturn = getDocument
        ? getDocument.map((doc) => {
            return {
              id: doc.tsp_id,
              tspId: doc.tsp_id,
              shortName: doc.approved_personal_data?.shortName ?? '',
              residingCountry: doc.approved_contact_data?.residingCountry ?? '',
              workEmail: doc.approved_contact_data?.workEmail ?? '',
              mobileNumber: doc.approved_contact_data?.mobileNumber ?? '',
              tutorStatus: doc.user_hris_progress?.tutorStatus ?? '',
              profileStatus: doc?.user_hris_progress?.profileStatus ?? '',
              supervisorName: doc?.tm_approved_status?.supervisorName ?? '',
              employeeStatus: doc?.tm_approved_status?.employeeStatus ?? '',
              movementType: doc?.tm_approved_status?.movementType ?? '',
              auditorEmail: doc.user_hris_progress?.auditor?.username ?? '',

              auditorTspId: doc.user_hris_progress?.auditorId ?? '',
              auditorName:
                doc.user_hris_progress?.auditor?.approved_personal_data
                  ?.shortName ?? '',

              // auditor: doc.user_hris_progress?.auditorId ?? null,
              auditor: doc.user_hris_progress?.auditor?.username ?? '',
              workStatus: doc.user_hris_progress?.profileStatus ?? null,
              birthCertificate:
                doc.approved_personal_data?.birthCertificateUrl ?? null,
              nic: doc.approved_personal_data?.nicUrl ?? null,
              profilePicture: doc.approved_personal_data?.ppUrl ?? null,
              gsCertificate: doc.approved_right2work_data?.gsUrl ?? null,
              policeCertificate: doc.approved_right2work_data?.pccUrl ?? null,
              olCertificate:
                doc.approved_education_data?.olCertificateUrl ?? null,
              alCertificate:
                doc.approved_education_data?.alCertificateUrl ?? null,
              workExperience:
                doc.approved_work_exp_data?.currentEmpDocUrl ?? null,
              imageOfPC: doc.approved_it_data?.pcUrl ?? null,
              imageOfHeadset: doc.approved_it_data?.headsetUrl ?? null,
              speedTest: doc.approved_it_data?.primarySpeedUrl ?? null,
              bankPassbook: doc.approved_bank_data?.bPassbookUrl ?? null
            };
          })
        : {};

      if (getDocument) {
        if (export2Csv === 'export2Csv') {
          return dataToReturn;
        } else {
          return {
            success: true,
            details: {
              rowCount,
              data: dataToReturn
            }
          };
        }
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
