import { HttpException, Injectable } from '@nestjs/common';
import moment = require('moment');
import { PrismaService } from '../prisma.service';
import { EditHistoryMasterDto } from './EditHistoryMaster.dto';

@Injectable()
export class EditHistoryMasterService {
  constructor(private prisma: PrismaService) {}

  async fetchTableEditHitoryMaster({
    tspId,
    email,
    name,
    auditor,
    export2Csv = '',
    auditStatus,
    profileStatus,
    skip,
    take,
    country
  }: // component
  EditHistoryMasterDto) {
    const today = moment().startOf('d').format('YYYY-MM-DD');
    const monthBack = moment()
      .subtract(1, 'month')
      .startOf('day')
      .format('YYYY-MM-DD');

    const isWhere =
      name ||
      auditStatus ||
      profileStatus ||
      email ||
      tspId ||
      auditor ||
      country;

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
                    tutorStatus: auditStatus ? { equals: auditStatus } : {}
                  }
                }
              : {}),
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
            }
          };

      const [getDocument, rowCount] = await Promise.all([
        this.prisma.user.findMany({
          where: where,
          select: {
            tsp_id: true,
            hris_personal_data: {},
            hris_contact_data: {},
            hris_education_data: {},
            hris_bank_data: {},
            hris_health_data: {},
            hris_it_data: {},
            hris_work_exp_data: {
              orderBy: {
                id: 'desc'
              },
              include: {
                xother_work_exp_data: true
              }
            },
            HrisRefereeData: {},
            hris_right2work_data: {},
            hris_support_documents: {},
            hris_qualifications_data: {
              orderBy: {
                id: 'desc'
              },
              include: {
                xother_quali_data: true
              },
              take: 1
            },

            approved_personal_data: {
              select: {
                shortName: true
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
              personalIconEnable:
                Object.keys(doc.hris_personal_data).length > 0,
              contactIconEnable: Object.keys(doc.hris_contact_data).length > 0,
              educationIconEnable:
                Object.keys(doc.hris_education_data).length > 0,
              bankIconEnable: Object.keys(doc.hris_bank_data).length > 0,
              healthIconEnable: Object.keys(doc.hris_health_data).length > 0,
              itIconEnable: Object.keys(doc.hris_it_data).length > 0,
              workIconEnable: Object.keys(doc.hris_work_exp_data).length > 0,
              refereeIconEnable: Object.keys(doc.HrisRefereeData).length > 0,
              rightToWorkIconEnable:
                Object.keys(doc.hris_right2work_data).length > 0,
              supportIconEnable:
                Object.keys(doc.hris_support_documents).length > 0,
              qualificationIconEnable:
                Object.keys(doc.hris_qualifications_data).length > 0 &&
                Object.keys(doc.hris_qualifications_data[0].xother_quali_data)
                  .length > 0,
              xotherWorkIconEnable:
                Object.keys(doc.hris_work_exp_data).length > 0 &&
                Object.keys(doc.hris_work_exp_data[0].xother_work_exp_data)
                  .length > 0
            };
          })
        : {};

      if (getDocument) {
        return {
          success: true,
          details: {
            rowCount,
            data: dataToReturn
          }
        };
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }

    // try {

    //   const data = await this.prisma.$queryRaw`
    //       (SELECT 'p-' AS data_com_sig, pdV4.id AS data_id, pdV4.tsp_id AS tsp_id, apd.short_name AS name, 'Personal Details' AS component, pdV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_personal_data pdV4
    //       LEFT JOIN approved_personal_data apd ON pdV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on pdV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on pdV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       UNION
    //       (SELECT 'c-' AS data_com_sig, cdV4.id AS data_id, cdV4.tsp_id AS tsp_id, apd.short_name AS name, 'Contact Details' AS component, cdV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_contact_data cdV4
    //       LEFT JOIN approved_personal_data apd ON cdV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on cdV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on cdV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       UNION
    //       (SELECT 'e-' AS data_com_sig, edV4.id AS data_id, edV4.tsp_id AS tsp_id, apd.short_name AS name, 'Educational Details' AS component, edV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_education_data edV4
    //       LEFT JOIN approved_personal_data apd ON edV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on edV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on edV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       UNION
    //       (SELECT 'h-' AS data_com_sig, hdV4.id AS data_id, hdV4.tsp_id AS tsp_id, apd.short_name AS name, 'Health Details' AS component, hdV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_health_data hdV4
    //       LEFT JOIN approved_personal_data apd ON hdV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on hdV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on hdV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       UNION
    //       (SELECT 'it-' AS data_com_sig, itdV4.id AS data_id, itdV4.tsp_id AS tsp_id, apd.short_name AS name, 'IT Details' AS component, itdV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_it_data itdV4
    //       LEFT JOIN approved_personal_data apd ON itdV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on itdV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on itdV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       UNION
    //       (SELECT 'rtw-' AS data_com_sig, r2wdV4.id AS data_id, r2wdV4.tsp_id AS tsp_id, apd.short_name AS name, 'Right To Work Details' AS component, r2wdV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_right2work_data r2wdV4
    //       LEFT JOIN approved_personal_data apd ON r2wdV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on r2wdV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on r2wdV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       UNION
    //       (SELECT 'q-' AS data_com_sig, qdV4.id AS data_id, qdV4.tsp_id AS tsp_id, apd.short_name AS name, 'Qualifications Details' AS component, qdV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_qualifications_data qdV4
    //       LEFT JOIN approved_personal_data apd ON qdV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on qdV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on qdV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       UNION
    //       (SELECT 'we-' AS data_com_sig, wedV4.id AS data_id, wedV4.tsp_id AS tsp_id, apd.short_name AS name, 'Work Experence Details' AS component, wedV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_work_exp_data wedV4
    //       LEFT JOIN approved_personal_data apd ON wedV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on wedV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on wedV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       UNION
    //       (SELECT 'b-' AS data_com_sig, bdV4.id AS data_id, bdV4.tsp_id AS tsp_id, apd.short_name AS name, 'Bank Details' AS component, bdV4.updated_at AS updated_at,
    //       hp.tutor_status AS tutor_status, hp.profile_status AS profile_status, hp.auditor_id AS auditor_id, ua.username AS auditor_name
    //       FROM hris_bank_data bdV4
    //       LEFT JOIN approved_personal_data apd ON bdV4.tsp_id = apd.tsp_id
    //       LEFT JOIN user u on bdV4.tsp_id = u.tsp_id
    //       LEFT JOIN hris_progress hp on bdV4.tsp_id = hp.tsp_id
    //       LEFT JOIN user ua ON hp.auditor_id = ua.tsp_id
    //       WHERE u.level = 2 AND hp.tutor_status IS NOT NULL)
    //       ORDER BY updated_at DESC
    //       `;

    //   return {
    //     success: true,
    //     data: (data as any).map((d) => {
    //       return {
    //         id: d.data_com_sig + d.data_id,
    //         ...d
    //       };
    //     })
    //   };
    // } catch (error) {
    //   throw new HttpException({ success: false, error }, 400);
    // }
  }

  async fetchCandidateSectionHistory(
    tspId: number,
    section = 'hrisPersonalData'
  ) {
    try {
      section = [
        'hrisPersonalData',
        'hrisContactData',
        'hrisEducationData',
        'hrisBankData',
        'hrisHealthData',
        'hrisItData',
        'hrisWorkExpData',
        'hrisRefereeData',
        'HrisRight2workData',
        'HrisSupportDocuments',
        'XotherWorkExpData',
        'XotherQualiData'
      ].includes(section)
        ? section
        : 'hrisPersonalData';

      let sectionHistory = [];
      if (section === 'XotherQualiData') {
        const hrisQualificationsData =
          await this.prisma.hrisQualificationsData.findFirst({
            where: {
              tspId
            },
            orderBy: {
              id: 'desc'
            }
          });
        sectionHistory = await this.prisma.xotherQualiData.findMany({
          where: {
            qId: hrisQualificationsData.id
          },
          orderBy: {
            id: 'desc'
          }
        });
      } else if (section === 'XotherWorkExpData') {
        const XotherWorkExpData = await this.prisma.hrisWorkExpData.findFirst({
          where: {
            tspId
          },
          orderBy: {
            id: 'desc'
          }
        });
        sectionHistory = await this.prisma.xotherWorkExpData.findMany({
          where: {
            weId: XotherWorkExpData.id
          },
          orderBy: {
            id: 'desc'
          }
        });
      } else {
        sectionHistory = await this.prisma[section].findMany({
          where: {
            tspId
          },
          orderBy: {
            id: 'desc'
          }
        });
      }

      // if (section === 'HrisQualificationsData') {
      //   const hrisQualificationsData =
      //     await this.prisma.hrisQualificationsData.findFirst({
      //       where: {
      //         tspId
      //       },
      //       orderBy: {
      //         id: 'desc'
      //       }
      //     });
      //   const concatenatedOtherQualiData =
      //     await this.prisma.xotherQualiData.findMany({
      //       where: {
      //         qId: hrisQualificationsData.id
      //       },
      //       orderBy: {
      //         id: 'desc'
      //       }
      //     });

      //   sectionHistory = concatenatedOtherQualiData;
      // }
      return {
        success: true,
        data: {
          sectionHistory
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
