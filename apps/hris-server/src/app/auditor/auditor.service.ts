import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ConfirmAllDto,
  AuditorMasterViewDto,
  SetTutorStatusDto,
  SetTutorEligibilityDto
} from './auditor.dto';
import moment = require('moment');
import { ProfessionalQualificationsService } from '../professional-qualifications/professional-qualifications.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuditorService {
  constructor(
    private prisma: PrismaService,
    private professionalQualificationsService: ProfessionalQualificationsService,
    private mailService: MailService
  ) {}

  async confirmAll(data: ConfirmAllDto, auditorId: number) {
    const contactDetails = await this.prisma.approvedContactData.findUnique({
      where: {
        tspId: data.candidateId
      }
    });
    const country = contactDetails.residingCountry;
    const now = new Date().toISOString();

    try {
      let details: any = null;
      if (
        !['workExperienceData', 'qualificationData'].includes(data.formType)
      ) {
        details = await this.prisma.$transaction(async (tx) => {
          const tables = {
            bankData: [tx.hrisBankData, tx.approvedBankData],
            educationData: [tx.hrisEducationData, tx.approvedEducationData],
            personalData: [tx.hrisPersonalData, tx.approvedPersonalData],
            contactData: [tx.hrisContactData, tx.approvedContactData],
            rightToWorkData: [tx.hrisRight2workData, tx.approvedRight2workData],
            referenceData: [tx.hrisRefereeData, tx.approvedRefereeData],
            ItData: [tx.hrisItData, tx.approvedItData],
            healthData: [tx.hrisHealthData, tx.approvedHealthData]
          };

          const excludeIndian = {
            personalData: ['birthCertificateUrlStatus'],
            contactData: [
              'residingAddressL2Status',
              'residingCityStatus',
              'residingProvinceStatus',
              'permanentAddressL2Status',
              'permanentCityStatus',
              'permanentProvinceStatus'
            ],
            educationData: [
              'alSyllabusStatus',
              'alYearStatus',
              'alStreamStatus',
              'alCertificateUrlStatus',
              'alSubject1Status',
              'alSubject2Status',
              'alSubject3Status',
              'alSubject4Status',
              'alSubject5Status'
            ],
            bankData: [],
            rightToWorkData: [],
            referenceData: [],
            ItData: [],
            healthData: []
          };

          const excludeSriLanka = {
            personalData: ['birthCertificateUrlStatus'],
            contactData: [
              'residingAddressL2Status',
              'permanentAddressL2Status'
            ],
            educationData: [],
            bankData: [],
            rightToWorkData: [
              'gsIssuedDateStatus',
              'pccIssuedDateStatus',
              'pccReferenceNoStatus'
            ],
            referenceData: [],
            ItData: [],
            healthData: []
          };

          const exclude =
            country === 'India'
              ? excludeIndian[data.formType]
              : excludeSriLanka[data.formType];

          const latestDetails = await (
            tables[data.formType][0] as any
          ).findFirst({
            where: {
              tspId: data.candidateId
            },
            orderBy: {
              id: 'desc'
            }
          });

          const updatedLatestDetails = Object.entries(latestDetails)
            .filter(([key]) => !['id', 'createdAt', ...exclude].includes(key))
            .reduce((prev, [key, value]) => {
              if (key.includes('Status') && ![].includes(key)) {
                prev[key] = 'approved';
              } else {
                prev[key] = value;
              }
              return prev;
            }, {} as any);

          const updatedData = await (tables[data.formType][0] as any).create({
            data: {
              ...updatedLatestDetails,
              auditedBy: auditorId,
              auditedAt: now,
              updatedBy: auditorId,
              updatedAt: now
            }
          });

          const updatedLatestApprovedDetails = Object.entries(
            updatedLatestDetails
          )
            .filter(
              ([key, value]) =>
                !(key.includes('RejectReason') || key.includes('Status'))
            )
            .filter(
              ([key]) =>
                ![
                  'recordApproved',
                  'updatedBy',
                  'updatedAt',
                  'auditedBy',
                  'auditedAt'
                ].includes(key)
            )
            .reduce((prev, [key, value]) => {
              prev[key] = value;
              return prev;
            }, {} as any);

          await (tables[data.formType][1] as any).upsert({
            where: {
              tspId: data.candidateId
            },
            create: {
              tspId: data.candidateId,
              ...updatedLatestApprovedDetails,
              approvedBy: auditorId,
              approvedAt: new Date()
            },
            update: {
              ...updatedLatestApprovedDetails,
              approvedBy: auditorId,
              approvedAt: new Date()
            }
          });
          return updatedData;
        });
      }

      if (data.formType === 'workExperienceData') {
        const candidateId = data.candidateId;

        const workExpData = await this.prisma.hrisWorkExpData.findFirst({
          where: {
            tspId: +candidateId
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
                docUrlRejectReason: true
              }
            }
          }
        });

        const { xother_work_exp_data, ...rest } = workExpData;

        const updatedRest = Object.entries(rest).reduce(
          (prev, [key, value]) => {
            if (key.includes('Status')) {
              prev[key as string] = 'approved';
            } else if (key.includes('RejectReason')) {
              prev[key as string] = '';
            } else {
              prev[key as string] = value;
            }

            return prev;
          },
          {} as any
        );

        const updatedxother_work_exp_data = xother_work_exp_data.map((data) => {
          return Object.entries(data).reduce((prev, [key, value]) => {
            if (key.includes('Status')) {
              prev[key as string] = 'approved';
            } else if (key.includes('RejectReason')) {
              prev[key as string] = '';
            } else {
              prev[key as string] = value;
            }
            return prev;
          }, {} as any);
        });

        const updated = {
          ...updatedRest,
          candidateId,
          xother_work_exp_data: updatedxother_work_exp_data
        };

        details =
          await this.professionalQualificationsService.auditorSubmitWorkExperience(
            candidateId,
            updated
          );
      }

      if (data.formType === 'qualificationData') {
        const candidateId = data.candidateId;

        const qualificationData =
          await this.prisma.hrisQualificationsData.findFirst({
            where: {
              tspId: +candidateId
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

        const { xother_quali_data, ...rest } = qualificationData;

        const updatedRest = Object.entries(rest).reduce(
          (prev, [key, value]) => {
            if (key.includes('Status')) {
              prev[key as string] = 'approved';
            } else if (key.includes('RejectReason')) {
              prev[key as string] = '';
            } else {
              prev[key as string] = value;
            }

            return prev;
          },
          {} as any
        );

        const updatedxother_quali_data = xother_quali_data.map((data) => {
          return Object.entries(data).reduce((prev, [key, value]) => {
            if (key.includes('Status')) {
              prev[key as string] = 'approved';
            } else if (key.includes('RejectReason')) {
              prev[key as string] = '';
            } else {
              prev[key as string] = value;
            }
            return prev;
          }, {} as any);
        });

        const updated = {
          ...updatedRest,
          candidateId,
          xother_quali_data: updatedxother_quali_data
        };

        details =
          await this.professionalQualificationsService.auditorSubmitEducationalQualifications(
            candidateId,
            updated
          );
      }

      return {
        success: true,
        data: details
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async fetchTableAuditMasterView(
    {
      take,
      skip,
      tspId,
      shortName,
      email,
      tutorStatus,
      profileStatus,
      filterAuditHistoryStatus,
      country,
      filterQualificationRating,
      filterContractAuditApproval,
      filterSectionName,
      filterSectionState,
      filterPccStateApproved,
      filterPccExpFrom,
      filterPccExpTo,
      export2Csv = '',
      submissionDateFrom,
      submissionDateTo,
      auditor,
      filterPccStatus
    }: AuditorMasterViewDto,
    auditorId: number,
    accesses: string[]
  ) {
    let tspIdsPcc = [];
    if (filterPccStatus) {
      let query = `
    WITH rm AS(
      SELECT  m.*
        FROM hris_right2work_data m
      WHERE m.id = (
          SELECT MAX(m2.id) FROM hris_right2work_data m2 WHERE m2.tsp_id = m.tsp_id
      )
      )
      SELECT rm.tsp_id FROM rm WHERE 1=1
      `;

      if (['rejected', 'approved'].includes(filterPccStatus)) {
        query += `AND rm.pcc_url_status ='${filterPccStatus}'`;
      } else {
        query += `AND rm.pcc_url IS NOT NULL AND rm.pcc_url != '' AND rm.pcc_url_status NOT IN ('rejected', 'approved')`;
      }

      const data: any[] = await this.prisma.$queryRawUnsafe(query);
      tspIdsPcc = data.map((item: any) => item.tsp_id);
    }

    //convert string of comma separated numbers to a sanitized array of numbers
    let tspIdArr = tspId
      ? tspId
          .replace(/[^\d,]/g, '')
          .split(',')
          .map(Number)
          .filter(Boolean)
      : [];

    //combine tspIdsPcc with original tspIds flter options
    tspIdArr = Array.from(new Set(tspIdArr.concat(tspIdsPcc)));

    const isAdminUser =
      accesses.includes('HR_ADMIN') || accesses.includes('HR_USER');

    const isWhere =
      tspId ||
      filterPccStatus ||
      shortName ||
      email ||
      tutorStatus ||
      profileStatus ||
      filterAuditHistoryStatus ||
      country ||
      filterQualificationRating ||
      filterContractAuditApproval ||
      (filterSectionName && filterSectionState) ||
      filterPccStateApproved ||
      filterPccExpFrom ||
      filterPccExpTo ||
      submissionDateFrom ||
      submissionDateTo ||
      auditor;
    const filterWhereClause = {
      level: {
        in: [1, 2]
      },
      tsp_id:
        tspId || filterPccStatus
          ? {
              in: tspIdArr
            }
          : {},
      ...(email ||
      country ||
      (filterSectionName &&
        filterSectionState &&
        filterSectionName == 'approved_contact_data')
        ? {
            approved_contact_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_contact_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {},
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
        : {}),
      ...(shortName ||
      (filterSectionName &&
        filterSectionState &&
        filterSectionName == 'approved_personal_data')
        ? {
            approved_personal_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_personal_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {},
              shortName: shortName
                ? {
                    equals: shortName
                  }
                : {}
            }
          }
        : {}),

      ...(filterSectionName &&
      filterSectionState &&
      filterSectionName == 'approved_education_data'
        ? {
            approved_education_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_education_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),
      ...(filterSectionName &&
      filterSectionState &&
      filterSectionName == 'approved_qualifications_data'
        ? {
            approved_qualifications_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_qualifications_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),
      ...(filterSectionName &&
      filterSectionState &&
      filterSectionName == 'approved_work_exp_data'
        ? {
            approved_work_exp_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_work_exp_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),
      ...(filterSectionName &&
      filterSectionState &&
      filterSectionName == 'approved_it_data'
        ? {
            approved_it_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_it_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),
      ...(filterSectionName &&
      filterSectionState &&
      filterSectionName == 'approved_bank_data'
        ? {
            approved_bank_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_bank_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),
      ...(filterSectionName &&
      filterSectionState &&
      filterSectionName == 'approved_referee_data'
        ? {
            approved_referee_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_referee_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),
      ...(filterSectionName &&
      filterSectionState &&
      filterSectionName == 'approved_support_documents'
        ? {
            approved_support_documents: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_support_documents'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),
      ...(filterSectionName &&
      filterSectionState &&
      filterSectionName == 'approved_health_data'
        ? {
            approved_health_data: {
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_health_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),
      ...(filterPccStateApproved ||
      filterPccExpFrom ||
      filterPccExpTo ||
      (filterSectionName &&
        filterSectionState &&
        filterSectionName == 'approved_right2work_data')
        ? {
            approved_right2work_data: {
              pccState: filterPccStateApproved
                ? filterPccStateApproved != '-1'
                  ? { equals: filterPccStateApproved }
                  : { equals: null }
                : {},
              pccExpireDate:
                filterPccExpFrom && filterPccExpTo
                  ? {
                      gt: moment(filterPccExpFrom)
                        .startOf('date')
                        .toISOString(),
                      lte: moment(filterPccExpTo).endOf('date').toISOString()
                    }
                  : {},
              updatedFlag:
                filterSectionName &&
                filterSectionState &&
                filterSectionName == 'approved_right2work_data'
                  ? ['1', '3'].includes(filterSectionState)
                    ? {
                        equals: +filterSectionState
                      }
                    : { not: { in: [1, 3] } }
                  : {}
            }
          }
        : {}),

      ...(filterContractAuditApproval
        ? {
            approved_contract_data: {
              contract_url_status: filterContractAuditApproval
                ? { equals: filterContractAuditApproval }
                : {}
            }
          }
        : {}),

      ...(filterAuditHistoryStatus || submissionDateFrom || submissionDateTo
        ? {
            hris_audited_data: {
              some: {
                tutorStatus: filterAuditHistoryStatus
                  ? { contains: filterAuditHistoryStatus }
                  : {},
                createdAt:
                  submissionDateFrom && submissionDateTo
                    ? {
                        gt:
                          moment(submissionDateFrom)
                            .startOf('date')
                            .format('YYYY-MM-DDTHH:mm:ss') + '.999Z',
                        lte:
                          moment(submissionDateTo)
                            .endOf('date')
                            .format('YYYY-MM-DDTHH:mm:ss') + '.999Z'
                      }
                    : {}
              }
            }
          }
        : {}),

      ...(tutorStatus || profileStatus || auditor || filterQualificationRating
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
              eligibilityStatus: filterQualificationRating
                ? {
                    equals: filterQualificationRating
                  }
                : {},
              // submitedAt:
              //   submissionDateFrom && submissionDateTo
              //     ? {
              //         gt: moment(submissionDateFrom)
              //           .startOf('date')
              //           .toISOString(),
              //         lte: moment(submissionDateTo).endOf('date').toISOString()
              //       }
              //     : {},
              auditorId: auditor
                ? auditor != '-1'
                  ? { equals: +auditor }
                  : null
                : isAdminUser
                ? {}
                : auditorId
            }
          }
        : {})
    };

    const defaultFilter = {
      level: {
        in: [1, 2]
      },
      user_hris_progress: {
        auditorId: isAdminUser ? {} : auditorId,
        tutorStatus: {
          not: null
        }
      }
    };
    // console.log('filterWhereClause', {
    //   ...defaultFilter,
    //   ...filterWhereClause
    // });

    // if (accesses.includes('HR_ADMIN') || accesses.includes('HR_USER')) {
    //   delete defaultFilter['user_hris_progress']['auditorId'];
    // }

    const [count, details] = await this.prisma.$transaction([
      this.prisma.user.count({
        where: isWhere
          ? { ...defaultFilter, ...filterWhereClause }
          : defaultFilter
      }),
      this.prisma.user.findMany({
        // take: +take,
        // skip: +skip,
        where: isWhere
          ? { ...defaultFilter, ...filterWhereClause }
          : defaultFilter,
        select: {
          tsp_id: true,
          approved_personal_data: {
            select: {
              updatedFlag: true,
              shortName: true
            }
          },
          approved_contact_data: {
            select: {
              updatedFlag: true,
              residingCountry: true,
              mobileNumber: true,
              workEmail: true
            }
          },
          approved_education_data: {
            select: {
              updatedFlag: true
            }
          },
          approved_qualifications_data: {
            select: {
              updatedFlag: true
            }
          },
          approved_work_exp_data: {
            select: {
              updatedFlag: true
            }
          },
          approved_it_data: {
            select: {
              updatedFlag: true
            }
          },
          approved_bank_data: {
            select: {
              updatedFlag: true
            }
          },
          approved_right2work_data: {
            select: {
              updatedFlag: true,
              gsUrl: true,
              gsUploadedAt: true,
              gsIssuedDate: true,
              pccUrl: true,
              pccUploadedAt: true,
              pccIssuedDate: true,
              pccExpireDate: true,
              pccState: true
            }
          },
          approved_referee_data: {
            select: {
              updatedFlag: true
            }
          },
          approved_support_documents: {
            select: {
              updatedFlag: true
            }
          },
          approved_health_data: {
            select: {
              updatedFlag: true
            }
          },

          approved_contract_data: true,
          tm_approved_status: {
            select: {
              employeeStatus: true,
              movementType: true,
              supervisorName: true
            }
          },
          user_hris_progress: {
            select: {
              submitedAt: true,
              tutorStatus: true,
              profileStatus: true,
              eligibilityStatus: true,
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
              right2workDataCount: true,
              personalDataCount: true,
              contactDataCount: true,
              educationalDataCount: true,
              qualificationDataCount: true,
              workExperienceDataCount: true,
              availabilityDataCount: true,
              itDataCount: true,
              bankDataCount: true,
              refereeDataCount: true,
              supportDataCount: true,
              healthDataCount: true
            }
          },
          TslUser: {
            take: 1
          },
          hris_audited_data: {
            select: {
              id: true,
              tutorStatus: true,
              createdAt: true
            },
            orderBy: {
              id: 'desc'
            }
            // take: 1
          },
          hris_right2work_data: {
            select: {
              gsUrl: true,
              gsUploadedAt: true,
              gsIssuedDate: true,
              gsUrlStatus: true,
              gsUrlRejectReason: true,
              pccUrl: true,
              pccUploadedAt: true,
              pccIssuedDate: true,
              pccExpireDate: true,
              pccState: true,
              pccUrlStatus: true,
              pccUrlRejectReason: true
            },
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
          // hris_dbs_data: {
          //   select: { isPhysicalDbsChecked: true }
          // }
        },
        ...(!export2Csv ? { take: +take, skip: +skip } : {})
      })
    ]);

    const dataToReturn = details
      ? details.map((row, index) => {
          return {
            id: row.tsp_id,
            tspId: row.tsp_id,
            shortName: row.approved_personal_data?.shortName ?? '',
            residingCountry: row.approved_contact_data?.residingCountry ?? '',
            workEmail: row.approved_contact_data?.workEmail ?? '',
            mobileNumber: row.approved_contact_data?.mobileNumber ?? '',
            tutorStatus: row.user_hris_progress?.tutorStatus ?? '',
            profileStatus: row.user_hris_progress?.profileStatus ?? '',
            supervisorName: row?.tm_approved_status?.supervisorName ?? '',
            employeeStatus: row?.tm_approved_status?.employeeStatus ?? '',
            movementType: row?.tm_approved_status?.movementType ?? '',
            auditorEmail: row.user_hris_progress?.auditor?.username ?? '',
            tslTutorId: row.TslUser[0]?.tsl_id ?? '',
            tslTutorName: row.TslUser[0]?.tsl_full_name ?? '',
            tslTutorEmail: row.TslUser[0]?.tsl_email ?? '',
            submitedAt: row.user_hris_progress?.submitedAt ?? '',
            eligibilityStatus: row.user_hris_progress?.eligibilityStatus ?? '',

            auditorTspId: row.user_hris_progress?.auditorId ?? '',
            auditorName:
              row.user_hris_progress?.auditor?.approved_personal_data
                ?.shortName ?? '',

            contract_url: row.approved_contract_data?.contract_url ?? '',
            contractNo: row.approved_contract_data?.contract_no ?? '',
            contractType: row.approved_contract_data?.contract_type ?? '',
            contractStartDate:
              row.approved_contract_data &&
              row.approved_contract_data.contract_start_d
                ? this.changeDateFormat(
                    row.approved_contract_data.contract_start_d
                  )
                : '',
            contractEndDate:
              row.approved_contract_data &&
              row.approved_contract_data.contract_end_d
                ? this.changeDateFormat(
                    row.approved_contract_data.contract_end_d
                  )
                : '',
            hr_admin_approval:
              row.approved_contract_data?.hr_admin_approval ?? '',
            updated_by: row.approved_contract_data?.updated_by ?? '',
            updated_at: row.approved_contract_data?.updated_at ?? '',
            approved_by: row.approved_contract_data?.approved_by ?? '',
            approved_at: row.approved_contract_data?.approved_at ?? '',
            hr_comment: row.approved_contract_data?.hr_comment ?? '',

            contract_uploaded_at:
              row.approved_contract_data?.contract_uploaded_at ?? '',

            contract_audited_at:
              row.approved_contract_data?.contract_audited_at ?? '',
            contract_url_status:
              row.approved_contract_data?.contract_url_status ?? '',
            contract_url_reject_reason:
              row.approved_contract_data?.contract_url_reject_reason ?? '',

            gsUrl: row.hris_right2work_data[0]?.gsUrl ?? '',
            gsUploadedAt: row.hris_right2work_data[0]?.gsUploadedAt ?? '',
            gsIssuedDate: row.hris_right2work_data[0]?.gsIssuedDate ?? '',
            gsUrlStatus: row.hris_right2work_data[0]?.gsUrlStatus ?? '',
            gsUrlRejectReason:
              row.hris_right2work_data[0]?.gsUrlRejectReason ?? '',

            pccUrl: row.hris_right2work_data[0]?.pccUrl ?? '',
            pccUploadedAt: row.hris_right2work_data[0]?.pccUploadedAt ?? '',
            pccIssuedDate: row.hris_right2work_data[0]?.pccIssuedDate ?? '',
            pccExpireDate: row.hris_right2work_data[0]?.pccExpireDate ?? '',
            pccState: row.hris_right2work_data[0]?.pccState ?? '',
            pccUrlStatus: row.hris_right2work_data[0]?.pccUrlStatus ?? '',
            pccUrlRejectReason:
              row.hris_right2work_data[0]?.pccUrlRejectReason ?? '',

            pccUrlApproved: row.approved_right2work_data?.pccUrl ?? '',
            pccExpireDateApproved:
              row.approved_right2work_data?.pccExpireDate ?? '',
            pccStateApproved: row.approved_right2work_data?.pccState ?? '',

            right2workUpdatedFlag:
              row.approved_right2work_data?.updatedFlag ?? 0,
            personalUpdatedFlag: row.approved_personal_data?.updatedFlag ?? 0,
            contactUpdatedFlag: row.approved_contact_data?.updatedFlag ?? 0,
            educationalUpdatedFlag:
              row.approved_education_data?.updatedFlag ?? 0,
            qualificationUpdatedFlag:
              row.approved_qualifications_data?.updatedFlag ?? 0,
            workExperienceUpdatedFlag:
              row.approved_work_exp_data?.updatedFlag ?? 0,
            itUpdatedFlag: row.approved_it_data?.updatedFlag ?? 0,
            bankUpdatedFlag: row.approved_bank_data?.updatedFlag ?? 0,
            refereeUpdatedFlag: row.approved_referee_data?.updatedFlag ?? 0,
            supportDocUpdatedFlag:
              row.approved_support_documents?.updatedFlag ?? 0,
            healthUpdatedFlag: row.approved_health_data?.updatedFlag ?? 0,

            right2workDataCount:
              row.user_hris_progress?.right2workDataCount ?? '',
            personalDataCount: row.user_hris_progress?.personalDataCount ?? '',
            contactDataCount: row.user_hris_progress?.contactDataCount ?? '',
            educationalDataCount:
              row.user_hris_progress?.educationalDataCount ?? '',
            qualificationDataCount:
              row.user_hris_progress?.qualificationDataCount ?? '',
            workExperienceDataCount:
              row.user_hris_progress?.workExperienceDataCount ?? '',
            itDataCount: row.user_hris_progress?.itDataCount ?? '',
            bankDataCount: row.user_hris_progress?.bankDataCount ?? '',
            refereeDataCount: row.user_hris_progress?.refereeDataCount ?? '',
            supportDocDataCount: row.user_hris_progress?.supportDataCount ?? 0,
            healthDataCount: row.user_hris_progress?.healthDataCount ?? '',

            availabilityDataCount:
              row.user_hris_progress?.availabilityDataCount ?? '',
            auditStatusHistoryx:
              export2Csv === 'export2Csv'
                ? undefined
                : row.hris_audited_data
                ? row.hris_audited_data
                : []
          };
        })
      : {};
    // return {
    //   success: true,
    //   details: dataToReturn,
    //   count
    // };

    if (details) {
      if (export2Csv === 'export2Csv') {
        return dataToReturn;
      } else {
        return {
          success: true,
          count: count,
          details: dataToReturn
        };
      }
    } else {
      return { success: false, message: 'No Records Available' };
    }
  }

  changeDateFormat = (date: any) => {
    return moment(date).utc().format('YYYY-MM-DD');
  };

  //check nic already exists or blacklisted
  async checkRehireStatus(nic: string, tspId: string) {
    let foundNICDetails, foundBacklistedDetails;

    try {
      const checkHasApprovedNic =
        await this.prisma.approvedPersonalData.findFirst({
          where: {
            nic: nic,
            NOT: {
              tspId: +tspId
            }
          },
          select: {
            tspId: true,
            shortName: true
          }
        });

      if (checkHasApprovedNic) {
        foundNICDetails = {
          ...checkHasApprovedNic,
          tooltip: 'NIC/Aadhaar Card Number is found in another account.'
        };
      }

      const checkHasBacklistedNic = await this.prisma.tsgRehireStatus.findFirst(
        {
          where: {
            nic: nic
          },
          select: {
            name: true,
            primaryEmail: true
          }
        }
      );

      if (checkHasBacklistedNic) {
        foundBacklistedDetails = {
          ...checkHasBacklistedNic,
          tooltip: 'NIC/Aadhaar Card Number is found to be blacklisted.'
        };
      }
      // foundBacklistedDetails = {
      //   name: 'jsjj',
      //   primaryEmail: 'abc@gmail.com',
      //   tooltip: 'NIC/Passport number is found to be blacklisted.'
      // };
      return {
        data: {
          foundNICDetails,
          foundBacklistedDetails
        }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async candidateDetails(candidateId: number) {
    //TODO: bk add user data to contract details set
    return this.prisma.user.findUnique({
      where: {
        tsp_id: +candidateId
      },
      select: {
        hris_contact_data: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        },
        approved_contact_data: {
          select: {
            personalEmail: true,
            workEmail: true,
            mobileNumber: true,
            landlineNumber: true,
            residingAddressL1: true,
            residingAddressL2: true,
            residingCity: true,
            residingDistrict: true,
            residingProvince: true,
            residingCountry: true,
            sameResidingPermanent: true,
            permanentAddressL1: true,
            permanentAddressL2: true,
            permanentCity: true,
            permanentDistrict: true,
            permanentProvince: true,
            permanentCountry: true,
            emgContactName: true,
            emgRelationship: true,
            emgContactNum: true,
            residingPin: true,
            permanentPin: true
          }
        },
        hris_personal_data: {
          orderBy: {
            id: 'desc'
          },
          select: {
            fullName: true,
            fullNameStatus: true,
            fullNameRejectReason: true,
            nameWithInitials: true,
            nameWithInitialsStatus: true,
            nameWithInitialsRejectReason: true,
            firstName: true,
            firstNameStatus: true,
            firstNameRejectReason: true,
            surname: true,
            surnameStatus: true,
            surnameRejectReason: true,
            gender: true,
            dob: true,
            dobStatus: true,
            dobRejectReason: true,
            birthCertificateUrl: true,
            birthCertificateUrlStatus: true,
            birthCertificateUrlRejectReason: true,
            religion: true,
            maritalState: true,
            spouseName: true,
            haveChildren: true,
            nic: true,
            nicStatus: true,
            nicRejectReason: true,
            nicUrl: true,
            nicUrlStatus: true,
            nicUrlRejectReason: true,
            haveAffiliations: true,
            shortName: true,
            age: true,
            ppUrl: true,
            ppUrlStatus: true,
            ppUrlRejectReason: true,
            nationality: true,
            typeOfId: true,
            typeOfIdStatus: true,
            typeOfIdRejectReason: true,
            passportCountry: true,
            passportCountryStatus: true,
            passportCountryRejectReason: true,
            passportExpirationDate: true,
            passportExpirationDateStatus: true,
            passportExpirationDateRejectReason: true,
            haveRtwDocument: true,
            haveRtwDocumentStatus: true,
            haveRtwDocumentRejectReason: true,
            rtwDocumentUrl: true,
            rtwDocumentUrlStatus: true,
            rtwDocumentUrlRejectReason: true,
            haveRtwExpirationDate: true,
            haveRtwExpirationDateStatus: true,
            haveRtwExpirationDateRejectReason: true,
            rtwExpirationDate: true,
            rtwExpirationDateStatus: true,
            rtwExpirationDateRejectReason: true,
            idLanguage: true,
            idLanguageStatus: true,
            idLanguageRejectReason: true,
            xfamily_affiliations: {
              select: {
                affiliateName: true,
                affiliateRelationship: true,
                affiliateJob: true
              }
            }
          },
          take: 1
        },
        approved_personal_data: {
          select: {
            fullName: true,
            nameWithInitials: true,
            firstName: true,
            surname: true,
            gender: true,
            dob: true,
            birthCertificateUrl: true,
            religion: true,
            maritalState: true,
            spouseName: true,
            haveChildren: true,
            nic: true,
            nicUrl: true,
            haveAffiliations: true,
            shortName: true,
            age: true,
            ppUrl: true,
            nationality: true,
            typeOfId: true,
            passportCountry: true,
            passportExpirationDate: true,
            haveRtwDocument: true,
            rtwDocumentUrl: true,
            haveRtwExpirationDate: true,
            rtwExpirationDate: true,
            idLanguage: true
          }
        },
        hris_bank_data: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        },
        approved_bank_data: {
          select: {
            bankName: true,
            bBranch: true,
            bBranchCode: true,
            bAccountNo: true,
            bAccountName: true,
            bSwift: true,
            bPassbookUrl: true,
            ifscCode: true,
            ibanNumber: true,
            bankStatus: true
          }
        },
        hris_education_data: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        },
        approved_education_data: {
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
        },
        hris_it_data: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        },
        approved_it_data: {
          select: {
            havePc: true,
            pcType: true,
            pcOwnership: true,
            pcBrand: true,
            pcBrandOther: true,
            pcModel: true,
            pcBitVersion: true,
            laptopSerial: true,
            laptopBatteryAge: true,
            laptopBatteryRuntime: true,
            pcOs: true,
            pcOsOther: true,
            pcProcessor: true,
            pcProcessorOther: true,
            pcRam: true,
            hdType: true,
            hdCapacity: true,
            pcBrowsers: true,
            pcAntivirus: true,
            pcAntivirusOther: true,
            lastServiceDate: true,
            pcIPAddress: true,
            ramUrl: true,
            pcUrl: true,
            desktopUps: true,
            desktopUpsUrl: true,
            desktopUpsRuntime: true,
            haveHeadset: true,
            headsetUsb: true,
            headsetConnectivityType: true,
            headsetMuteBtn: true,
            headsetNoiseCancel: true,
            headsetSpecs: true,
            headsetUrl: true,
            primaryConnectionType: true,
            primaryIsp: true,
            primaryIspOther: true,
            primaryConnectedCount: true,
            primaryDownloadSpeed: true,
            primaryUploadSpeed: true,
            primaryPing: true,
            haveSecondaryConnection: true,
            secondaryConnectionType: true,
            secondaryIsp: true,
            secondaryIspOther: true,
            secondaryDownloadSpeed: true,
            secondaryUploadSpeed: true,
            secondaryPing: true,
            primarySpeedUrl: true,
            secondarySpeedUrl: true,
            responsibleItCheck: true
          }
        },
        hris_health_data: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        },
        approved_health_data: {
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
        },
        hris_right2work_data: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        },
        approved_right2work_data: {
          select: {
            contractUrl: true,
            gsIssuedDate: true,
            gsUrl: true,
            pccIssuedDate: true,
            pccReferenceNo: true,
            pccUrl: true,
            pccExpireDate: true,
            pccState: true
          }
        },
        approved_contract_data: {
          select: {
            contract_url: true,
            contract_no: true,
            contract_type: true,
            contract_start_d: true,
            contract_end_d: true,
            hr_admin_approval: true,
            hr_comment: true,
            updated_by: true,
            updated_at: true,
            approved_by: true,
            approved_at: true,
            contract_assigned_at: true,
            contract_uploaded_at: true,
            contract_audited_at: true,
            contract_audited_by: true,
            contract_url_status: true,
            contract_url_reject_reason: true
          }
        },
        HrisRefereeData: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        },
        approved_referee_data: {
          select: {
            refereeTitle1: true,
            refereeFirstName1: true,
            refereeLastName1: true,
            refereeRelationship1: true,
            refereeEmail1: true,
            refereeTelephoneNumber1: true,
            refereeConfirmation1: true,
            refereeTitle2: true,
            refereeFirstName2: true,
            refereeLastName2: true,
            refereeRelationship2: true,
            refereeEmail2: true,
            refereeTelephoneNumber2: true,
            refereeConfirmation2: true,
            acknowledgement1: true,
            acknowledgement2: true,
            emailFlag1: true,
            emailFlag2: true,
            submissionFlag1: true,
            submissionFlag2: true
          }
        },
        user_hris_progress: {
          select: {
            tutorStatus: true,
            eligibilityStatus: true,
            profileStatus: true
          }
        },
        hris_work_exp_data: {
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
                ApprovedXotherWorkExpData: {
                  select: {
                    localId: true,
                    otherWorkExpId: true,
                    employerName: true,
                    employmentType: true,
                    jobTitle: true,
                    currentlyEmployed: true,
                    startDate: true,
                    endDate: true,
                    teachingExp: true,
                    docUrl: true,
                    otherWorkExpData: true
                  }
                }
              }
            }
          },
          take: 1
        },

        approved_work_exp_data: {
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
        },

        hris_qualifications_data: {
          where: {
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
                isHighestQualification: true,
                approvedXotherQualiData: true
              }
            }
          },
          take: 1
        },
        hris_support_documents: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        },
        ApprovedXotherAdminDocs: {
          where: {
            documentEnable: 1
          }
        },
        approved_support_documents: {
          select: {
            document01Type: true,
            document01Comment: true,
            document01Url: true,
            document02Type: true,
            document02Comment: true,
            document02Url: true,
            document03Type: true,
            document03Comment: true,
            document03Url: true,
            document04Type: true,
            document04Comment: true,
            document04Url: true,
            document05Type: true,
            document05Comment: true,
            document05Url: true,
            document06Type: true,
            document06Comment: true,
            document06Url: true,
            document07Type: true,
            document07Comment: true,
            document07Url: true,
            document08Type: true,
            document08Comment: true,
            document08Url: true,
            document09Type: true,
            document09Comment: true,
            document09Url: true,
            document10Type: true,
            document10Comment: true,
            document10Url: true,
            document11Type: true,
            document11Comment: true,
            document11Url: true,
            document12Type: true,
            document12Comment: true,
            document12Url: true,
            document13Type: true,
            document13Comment: true,
            document13Url: true,
            document14Type: true,
            document14Comment: true,
            document14Url: true,
            document15Type: true,
            document15Comment: true,
            document15Url: true,
            document16Type: true,
            document16Comment: true,
            document16Url: true,
            document17Type: true,
            document17Comment: true,
            document17Url: true,
            document18Type: true,
            document18Comment: true,
            document18Url: true,
            document19Type: true,
            document19Comment: true,
            document19Url: true,
            document20Type: true,
            document20Comment: true,
            document20Url: true
          }
        }
      }
    });
  }

  async setTutorStatus(
    {
      tutorStatus,
      candidateId: tutorId,
      discrepancyComment
    }: SetTutorStatusDto,
    updatedBy: number
  ) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.hrisProgress.upsert({
          where: {
            tspId: tutorId
          },
          update: {
            tutorStatus,
            discrepancyComment,
            updatedAt: new Date().toISOString(),
            submitedAt: new Date().toISOString()
          },
          create: {
            tspId: tutorId,
            tutorStatus,
            discrepancyComment,
            updatedAt: new Date().toISOString(),
            submitedAt: new Date().toISOString()
          }
        });

        await tx.hrisAuditedData.create({
          data: {
            tspId: tutorId,
            tutorStatus,
            createdBy: updatedBy
          }
        });

        const candidateData = await this.prisma.user.findUnique({
          where: {
            tsp_id: tutorId
          },
          select: {
            user_hris_progress: {
              select: {
                initialAuditPassDate: true,
                contractAuditPassDate: true,
                finalAuditPassDate: true,
                dbsAuditPassDate: true,
                profileStatus: true
              }
            },
            approved_personal_data: {
              select: {
                firstName: true
              }
            },
            approved_contact_data: {
              select: {
                workEmail: true
              }
            }
          }
        });

        const profileStatus =
          candidateData?.user_hris_progress?.profileStatus ?? null;
        const initialAuditPassDate =
          candidateData?.user_hris_progress?.initialAuditPassDate ?? null;
        const contractAuditPassDate =
          candidateData?.user_hris_progress?.contractAuditPassDate ?? null;
        const finalAuditPassDate =
          candidateData?.user_hris_progress?.finalAuditPassDate ?? null;

        let tableTagGenerated: string;
        let contractAuditFailData: {
          auditedBy: number;
          contractUrlRejectReason: string;
        };
        let auditorData: { approved_personal_data: { shortName: string } };

        //Email triggering when auditor change status
        switch (tutorStatus) {
          case 'audit pending':
            break;
          case 'initial audit pass':
          case 'initial audit pass discrepancy':
            await tx.hrisProgress.upsert({
              where: {
                tspId: tutorId
              },
              update: {
                initialAuditPassDate: new Date().toISOString()
              },
              create: {
                tspId: tutorId,
                initialAuditPassDate: new Date().toISOString()
              }
            });

            await this.mailService.sendInitialAuditPass(
              candidateData.approved_personal_data?.firstName ?? '',
              candidateData.approved_contact_data?.workEmail ?? ''
            );
            break;
          case 'initial audit fail':
            tableTagGenerated = await rejectedFieldFetchFunc(
              tutorId,
              this.prisma
            );
            await this.mailService.sendInitialAuditFail(
              candidateData.approved_personal_data?.firstName ?? '',
              tableTagGenerated,
              candidateData.approved_contact_data?.workEmail ?? '',
              'HRIS Auditor'
            );
            break;
          case 'initial audit reject':
            await this.mailService.sendInitialAuditReject(
              candidateData.approved_personal_data?.firstName ?? '',
              candidateData.approved_contact_data?.workEmail ?? ''
            );
            break;
          case 'contract audit pass':
          case 'contract audit pass discrepancy':
            await tx.hrisProgress.upsert({
              where: {
                tspId: tutorId
              },
              update: {
                contractAuditPassDate: new Date().toISOString()
              },
              create: {
                tspId: tutorId,
                contractAuditPassDate: new Date().toISOString()
              }
            });
            break;
          case 'contract audit fail':
            contractAuditFailData =
              await this.prisma.hrisRight2workData.findFirst({
                where: {
                  tspId: tutorId,
                  contractUrlStatus: 'rejected'
                },
                orderBy: {
                  id: 'desc'
                },
                select: {
                  contractUrlRejectReason: true,
                  auditedBy: true
                }
              });

            auditorData = await this.prisma.user.findUnique({
              where: {
                tsp_id: contractAuditFailData.auditedBy
              },
              select: {
                approved_personal_data: {
                  select: {
                    shortName: true
                  }
                }
              }
            });

            await this.mailService.sendContractFail(
              candidateData.approved_personal_data?.firstName ?? '',
              candidateData.approved_contact_data?.workEmail ?? '',
              contractAuditFailData.contractUrlRejectReason ?? '',
              auditorData.approved_personal_data?.shortName ?? ''
            );
            break;
          case 'final audit pass':
          case 'final audit pass discrepancy':
            await tx.hrisProgress.upsert({
              where: {
                tspId: tutorId
              },
              update: {
                finalAuditPassDate: new Date().toISOString()
              },
              create: {
                tspId: tutorId,
                finalAuditPassDate: new Date().toISOString()
              }
            });
            profileStatus !== 'active' &&
              // TODO: Wanna add notify email to hr admin to activate account
              console.log('pass');

            break;
          case 'final audit fail':
            await this.mailService.sendFinalFail(
              candidateData.approved_personal_data?.firstName ?? '',
              candidateData.approved_contact_data?.workEmail ?? ''
            );
            break;
          case 'audit in progress':
            break;
        }

        return true;
      });

      return { success: true, data: { tutorStatus } };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  // fetch: list of all eligibility / qualification ratings
  async fetchEligibilities() {
    try {
      const distinctValues = await this.prisma.hrisProgress.findMany({
        select: {
          eligibilityStatus: true
        },
        where: {
          AND: [
            { eligibilityStatus: { not: null } },
            { eligibilityStatus: { not: '' } }
          ]
        },
        distinct: ['eligibilityStatus']
      });

      return {
        success: true,
        data: distinctValues ?? []
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async setEligibility({
    eligibility: eligibilityStatus,
    candidateId: tutorId
  }: SetTutorEligibilityDto) {
    try {
      await this.prisma.hrisProgress.upsert({
        where: {
          tspId: tutorId
        },
        update: {
          eligibilityStatus
        },
        create: {
          tspId: tutorId,
          eligibilityStatus
        }
      });
      return { success: true, data: { eligibilityStatus } };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  // async getRejectedFieldListAuditor(tutorId: number) {
  //   return rejectedFieldFetchFunc(tutorId, this.prisma);
  // }
}

export const rejectedFieldFetchFunc = async (
  tutorId: number,
  prisma: PrismaService
) => {
  /**
   * function written separately to be re-used by both auditor & tutor apis
   */
  const fetchedCanidateRecords = await prisma.user.findUnique({
    where: {
      tsp_id: +tutorId
    },
    select: {
      hris_personal_data: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      },
      hris_contact_data: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      },
      hris_education_data: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      },
      hris_it_data: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      },
      hris_bank_data: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      },
      hris_health_data: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      },
      hris_right2work_data: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      },
      HrisRefereeData: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      },
      hris_work_exp_data: {
        orderBy: {
          id: 'desc'
        },
        include: {
          xother_work_exp_data: true
        },
        take: 1
      },
      hris_qualifications_data: {
        orderBy: {
          id: 'desc'
        },
        select: {
          xother_quali_data: true
        },
        take: 1
      }
    }
  });

  //generate generic 1-2-1 table reject reason list
  const returnList = {};
  for (const tableName in fetchedCanidateRecords) {
    returnList[tableName] = !(
      fetchedCanidateRecords[tableName] && fetchedCanidateRecords[tableName][0]
    )
      ? {}
      : Object.entries(fetchedCanidateRecords[tableName][0])
          .filter(
            ([key, value]) => key.includes('Status') && value === 'rejected'
          )
          .map(([key, value]) => {
            const field = key.replace('Status', '');
            const fieldRR = key.replace('Status', 'RejectReason');
            const rejectReason = fetchedCanidateRecords[tableName][0][fieldRR];
            return [field, rejectReason];
          })
          .reduce((prev, [key, value]) => {
            prev[key as string] = value;
            return prev;
          }, {});
  }

  //generate x_other_work reject reason list
  const temp_xother_work_exp_data = {};
  if (
    fetchedCanidateRecords['hris_work_exp_data'] &&
    fetchedCanidateRecords['hris_work_exp_data'][0] &&
    fetchedCanidateRecords['hris_work_exp_data'][0]['xother_work_exp_data']
  ) {
    fetchedCanidateRecords['hris_work_exp_data'][0][
      'xother_work_exp_data'
    ].forEach((val, key) => {
      temp_xother_work_exp_data[key] = Object.entries(val)
        .filter(
          ([key, value]) => key.includes('Status') && value === 'rejected'
        )
        .map(([key, value]) => {
          const field = key.replace('Status', '');
          const fieldRR = key.replace('Status', 'RejectReason');
          const rejectReason = val[fieldRR];
          return [field, rejectReason];
        })
        .reduce((prev, [key, value]) => {
          prev[key as string] = value;
          return prev;
        }, {});
    });
  }

  //flatten object & keep only 1st reject reason for each field type to simplify logics
  const xother_work_exp_data = Object.entries(temp_xother_work_exp_data).reduce(
    (acc, [key, value]) => {
      if (Object.keys(value).length !== 0) {
        Object.entries(value).forEach(([innerKey, innerValue]) => {
          if (!(innerKey in acc)) {
            acc[innerKey] = innerValue;
          }
        });
      }
      return acc;
    },
    {}
  );

  //generate x_other_qualifications reject reason list
  const temp_xother_quali_data = {};
  if (
    fetchedCanidateRecords['hris_qualifications_data'] &&
    fetchedCanidateRecords['hris_qualifications_data'][0] &&
    fetchedCanidateRecords['hris_qualifications_data'][0]['xother_quali_data']
  ) {
    fetchedCanidateRecords['hris_qualifications_data'][0][
      'xother_quali_data'
    ].forEach((val, key) => {
      temp_xother_quali_data[key] = Object.entries(val)
        .filter(
          ([key, value]) => key.includes('Status') && value === 'rejected'
        )
        .map(([key, value]) => {
          const field = key.replace('Status', '');
          const fieldRR = key.replace('Status', 'RejectReason');
          const rejectReason = val[fieldRR];
          return [field, rejectReason];
        })
        .reduce((prev, [key, value]) => {
          prev[key as string] = value;
          return prev;
        }, {});
    });
  }

  //flatten object & keep only 1st reject reason for each field type to simplify logics
  const xother_quali_data = Object.entries(temp_xother_quali_data).reduce(
    (acc, [key, value]) => {
      if (Object.keys(value).length !== 0) {
        Object.entries(value).forEach(([innerKey, innerValue]) => {
          if (!(innerKey in acc)) {
            acc[innerKey] = innerValue;
          }
        });
      }
      return acc;
    },
    {}
  );

  const tempCombinedObject = {
    ...returnList,
    xother_work_exp_data,
    xother_quali_data
  };
  //remove any tables with no reject reasons found
  const filteredReturnList = Object.entries(tempCombinedObject).reduce(
    (acc, [key, value]) => {
      if (Object.keys(value).length !== 0) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  // return fetchedCanidateRecords;
  // return { returnList, xother_work_exp_data, xother_quali_data };
  // return { ...returnList, xother_work_exp_data, xother_quali_data };
  // return filteredReturnList;

  //return an empty string if no rejected fields are found at all
  if (!filteredReturnList || Object.keys(filteredReturnList).length === 0)
    return '';

  //following will only come to be if any reject reason is found
  const tableMapper = {
    hris_personal_data: 'General Info - Personal Details',
    hris_contact_data: 'General Info - Contact Details',
    hris_education_data: 'Education Details',
    hris_it_data: 'Hardware & Internet',
    hris_bank_data: 'Bank Details',
    hris_health_data: 'Health Declaration',
    hris_right2work_data: 'Aditional Documents - Right to Work Details',
    HrisRefereeData: 'Aditional Documents - References',
    hris_work_exp_data: 'Professional Qualifications - Work Experience',
    hris_qualifications_data:
      'Professional Qualifications - Educational Qualifications',
    xother_work_exp_data: 'Professional Qualifications - Work Experience+',
    xother_quali_data:
      'Professional Qualifications - Educational Qualifications+'
  };
  const fieldMapper = {
    affiInst: 'Affiliated Institute',
    alCertificateUrl: 'A/L Certificate Attachment',
    alStream: 'A/L Stream',
    alSubject1: 'A/L Subject1',
    alSubject2: 'A/L Subject2',
    alSubject3: 'A/L Subject3',
    alSubject4: 'A/L Subject4',
    alSubject5: 'A/L Subject5',
    alSyllabus: 'A/L Syllabus',
    alYear: 'A/L Year',
    bAccountName: 'Name on Bank Account ',
    bAccountNo: 'Bank Account No',
    bankName: 'Bank Name',
    bBranch: 'Bank Branch',
    birthCertificateUrl: 'Birth Certificate Attachment',
    bPassbookUrl: 'Bank Passbook Attachment',
    completionYear: 'Completion Year',
    contractUrl: 'Contract Attachment',
    courseType: 'Course Type',
    currentEmpDocUrl: 'Current Employee Attachment',
    dob: 'Date of Birth',
    docUrl: 'Document Attachment',
    emgContactNum: 'Emg Contact Num',
    fieldStudy: 'Field Study',
    firstName: 'First Name',
    fullName: 'Full Name',
    gsIssuedDate: 'Gs Issued Date',
    gsUrl: 'Gs Attachment',
    hasCompleted: 'Has Completed',
    hasMathStat: 'Has Math Stat',
    havePreTsg: 'Have Pre Tsg',
    hdPage: 'Hd Page',
    healthUrl_1: 'Health Attachment 1',
    healthUrl_2: 'Health Attachment 2',
    healthUrl_3: 'Health Attachment 3',
    healthUrl_4: 'Health Attachment 4',
    healthUrl_5: 'Health Attachment 5',
    hqAffiInst: 'Highest Qualification Affiliated Inst',
    hqCompletionYear: 'Highest Qualification Completion Year',
    hqCourseType: 'Highest Qualification Course Type',
    hqDocUrl: 'Highest Qualification Document Attachment',
    hqFieldStudy: 'Highest Qualification Field Study',
    hqHasCompleted: 'Highest Qualification Has Completed',
    hqIsLocal: 'Highest Qualification Is Local',
    hqMainInst: 'Highest Qualification Main Inst',
    hqStartYear: 'Highest Qualification Start Year',
    isCurrentlyEmployed: 'Is Currently Employed',
    isLocal: 'Is Local',
    itPage: 'It Page',
    landlineNumber: 'Landline Number',
    mainInst: 'Main Inst',
    mobileNumber: 'Mobile Number',
    nameWithInitials: 'Name With Initials',
    nic: 'Nic/ Adhar Card/ Passport',
    nicUrl: 'Nic/ Adhar Card/ Passport Attachment',
    olCertificateUrl: 'O/L Certificate Attachment',
    olEnglish: 'O/L English',
    olMaths: 'O/L Maths',
    olSyllabus: 'O/L Syllabus',
    olYear: 'O/L Year',
    pccIssuedDate: 'PCC Issued Date',
    pccReferenceNo: 'PCC Reference No',
    pccUrl: 'PCC Attachment',
    pcReportUrl: 'PC Report Attachment',
    permanentAddressL1: 'Permanent Address L1',
    permanentAddressL2: 'Permanent Address L2',
    permanentCity: 'Permanent City',
    permanentCountry: 'Permanent Country',
    permanentDistrict: 'Permanent District',
    permanentPin: 'Permanent Pin',
    permanentProvince: 'Permanent Province',
    ppUrl: 'PP Attachment',
    referee1: 'Referee 1',
    referee2: 'Referee 2',
    residingAddressL1: 'Residing Address L1',
    residingAddressL2: 'Residing Address L2',
    residingCity: 'Residing City',
    residingCountry: 'Residing Country',
    residingDistrict: 'Residing District',
    residingPin: 'Residing Pin',
    residingProvince: 'Residing Province',
    startYear: 'Start Year',
    surname: 'Surname',
    workEmail: 'Work Email'
  };

  let tableTag =
    "<table class='styled-table' style='color: inherit; margin: -7px 0; margin-left: 5px; font-size: 0.9em; min-width: 400px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-family: sans-serif,Helvetica, Arial; flex-wrap: wrap;'><tr><th>Field Name</th><th>Comment</th></tr>";
  for (const tableName in filteredReturnList) {
    tableTag +=
      "<tr><th colspan='2'>" +
      (tableMapper[tableName] ?? tableName) +
      '</th></tr>';

    Object.entries(filteredReturnList[tableName]).map(([key, value]) => {
      tableTag += '<tr><td>' + (fieldMapper[key] ?? key);
      tableTag += '</td><td>' + value + '</td></tr>';
    });
  }
  tableTag += '</table>';

  return tableTag;
};
