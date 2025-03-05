import { HttpException, Injectable } from '@nestjs/common';
import {
  ContractDetailsDto,
  HrisCreateContractDto,
  UpdateAdminApprovalStatusContractDto,
  UpdateActivationStatusDto
} from './contract-details.dto';
import moment = require('moment');
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContractDetailsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async fetchTableContractDetails({
    skip,
    take,
    export2Csv = '',
    hr_admin_approval,
    contract_url_uploaded,
    contract_url_status,
    auditStatus,
    contract_start_d,
    email,
    name,
    country,
    contractNo,
    auditor,
    tspId,
    profileStatus,
    activatedDateFrom,
    activatedDateTo
  }: ContractDetailsDto) {
    const isWhere =
      hr_admin_approval ||
      contract_url_uploaded ||
      contract_url_status ||
      auditStatus ||
      contract_start_d ||
      email ||
      name ||
      auditor ||
      country ||
      contractNo ||
      tspId ||
      profileStatus ||
      activatedDateFrom ||
      activatedDateTo;

    const tspIds =
      tspId &&
      tspId
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    let approved_contract_data: any = {};
    if (contractNo && contractNo == '-1') {
      approved_contract_data = { is: null };
    } else if (
      contract_start_d ||
      hr_admin_approval ||
      contract_url_uploaded ||
      contract_url_status ||
      contractNo
    ) {
      approved_contract_data = {
        contract_start_d: contract_start_d
          ? {
              gt: moment(contract_start_d).startOf('date').toISOString(),
              lte: moment(contract_start_d).endOf('date').toISOString()
            }
          : {},
        hr_admin_approval: hr_admin_approval
          ? { equals: hr_admin_approval }
          : {},
        contract_url:
          contract_url_uploaded === 'Signed'
            ? {
                not: {
                  equals: null
                }
              }
            : contract_url_uploaded === 'Pending'
            ? { equals: null }
            : {},
        contract_url_status: contract_url_status
          ? { equals: contract_url_status }
          : {},
        contract_no: contractNo ? { equals: +contractNo } : {}
      };
    }
    let approved_personal_data: any = {};
    if (name) {
      approved_personal_data = {
        shortName: name ? { contains: name } : {}
      };
    }

    let approved_contact_data: any = {};
    if (email || country) {
      approved_contact_data = {
        workEmail: email ? { contains: email } : {},
        residingCountry:
          country && ['Sri Lanka', 'India'].includes(country)
            ? { equals: country }
            : country && country === 'Other'
            ? { notIn: ['Sri Lanka', 'India'] }
            : {}
      };
    }

    let user_hris_progress: any = {
      tutorStatus: {
        not: null
      }
    };
    if (
      auditStatus ||
      auditor ||
      profileStatus ||
      activatedDateFrom ||
      activatedDateTo
    ) {
      user_hris_progress = {
        auditorId: auditor ? { equals: +auditor } : {},
        tutorStatus: auditStatus ? { equals: auditStatus } : { not: null },
        profileStatus: profileStatus ? { equals: profileStatus } : {},
        tspActivatedAt:
          // dateto && datefrom
          activatedDateFrom && activatedDateTo
            ? {
                // gte: new Date(expireDateFrom).toISOString(),
                // lte: new Date(expireDateTo).toISOString()
                gte: moment(activatedDateFrom).startOf('date').toISOString(),
                lte: moment(activatedDateTo).endOf('date').toISOString()
              }
            : {}
      };
    }

    const defaultFilter = {
      level: {
        in: [1, 2]
      },
      user_hris_progress: {
        tutorStatus: {
          not: null
        }
      }
    };

    const filterWhereClause = isWhere
      ? {
          level: {
            in: [1, 2]
          },
          approved_personal_data,
          approved_contact_data,
          tsp_id: tspId ? { in: tspIds } : {},
          approved_contract_data,
          user_hris_progress
        }
      : {
          level: {
            in: [1, 2]
          }
        };

    try {
      const [count, rows] = await Promise.all([
        this.prisma.user.count({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter
        }),
        this.prisma.user.findMany({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter,
          include: {
            approved_personal_data: {
              select: {
                fullName: true,
                typeOfId: true,
                nic: true,
                shortName: true
              }
            },
            approved_contact_data: {
              select: {
                residingAddressL1: true,
                residingAddressL2: true,
                residingCity: true,
                residingDistrict: true,
                residingProvince: true,
                residingPin: true,
                residingCountry: true,
                mobileNumber: true,
                workEmail: true
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
                tutorStatus: true,
                profileStatus: true,
                auditorId: true,
                tspActivatedAt: true,
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
            TslUser: {
              take: 1
            }
          },
          ...(!export2Csv ? { take: +take, skip: +skip } : {})
        })
      ]);

      // const idTypeMap = {
      //   Passport: 'Passport No.',
      //   NIC: 'National Identity Card No.',
      //   Aadhar: 'Aadhar Card No.',
      //   'Driving License': 'Driving License No.'
      // };

      const dataToReturn = rows
        ? rows.map((row) => {
          // const typeOfId = row.approved_personal_data?.typeOfId ?? '';
          const residingCountry =
            row.approved_contact_data?.residingCountry ?? '';

          //generate comma separate address dynamically
          let addressX = '';
          if (row.approved_contact_data) {
            addressX =
              addressX +
              (row.approved_contact_data?.residingAddressL1 &&
              row.approved_contact_data?.residingAddressL1 != ''
                ? row.approved_contact_data?.residingAddressL1 + ', '
                : '');
            addressX =
              addressX +
              (row.approved_contact_data?.residingAddressL2 &&
              row.approved_contact_data?.residingAddressL2 != ''
                ? row.approved_contact_data?.residingAddressL2 + ', '
                : '');
            addressX =
              addressX +
              (row.approved_contact_data?.residingCity &&
              row.approved_contact_data?.residingCity != ''
                ? row.approved_contact_data?.residingCity + ', '
                : '');
            if (residingCountry === 'India') {
              addressX =
                addressX +
                (row.approved_contact_data?.residingDistrict &&
                row.approved_contact_data?.residingDistrict != ''
                  ? row.approved_contact_data?.residingDistrict + ', '
                  : '');
            }
            addressX =
              addressX +
              (row.approved_contact_data?.residingPin &&
              row.approved_contact_data?.residingPin != ''
                ? row.approved_contact_data?.residingPin + ', '
                : '');
            // addressX = addressX + residingCountry;
          }

          return {
            id: row.tsp_id,
            tspId: row.tsp_id,
            shortName: row.approved_personal_data?.shortName ?? '',
            residingCountry: residingCountry,
            workEmail: row.approved_contact_data?.workEmail ?? '',
            mobileNumber: row.approved_contact_data?.mobileNumber ?? '',
            tutorStatus: row.user_hris_progress?.tutorStatus ?? '',
            profileStatus: row?.user_hris_progress?.profileStatus ?? '',
            tspActivatedAt: row?.user_hris_progress?.tspActivatedAt ?? '',
            supervisorName: row?.tm_approved_status?.supervisorName ?? '',
            employeeStatus: row?.tm_approved_status?.employeeStatus ?? '',
            movementType: row?.tm_approved_status?.movementType ?? '',
            auditorEmail: row.user_hris_progress?.auditor?.username ?? '',
            tslTutorId: row.TslUser[0]?.tsl_id ?? '',
            tslTutorName: row.TslUser[0]?.tsl_full_name ?? '',
            tslTutorEmail: row.TslUser[0]?.tsl_email ?? '',
            // typeOfIdx: idTypeMap[typeOfId]
            //   ? idTypeMap[typeOfId]
            //   : residingCountry == 'India'
            //   ? 'Aadhaar Card / Passport No.'
            //   : 'NIC / Passport No.',
            typeOfIdx:
              residingCountry == 'Sri Lanka'
                ? 'National Identity Card No.'
                : residingCountry == 'India'
                ? 'Aadhar Card No.'
                : 'NIC/Aadhaar Card No.',
            nic: row.approved_personal_data?.nic ?? '',
            fullName:
              row.approved_personal_data?.fullName &&
              row.approved_personal_data?.fullName != ''
                ? row.approved_personal_data?.fullName
                : row.approved_personal_data?.shortName ?? '',
            address: addressX,

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
              row.approved_contract_data?.contract_url_reject_reason ?? ''
          };
        })
        : {};

      if (rows) {
        if (export2Csv === 'export2Csv') {
          return dataToReturn;
        } else {
          return {
            success: true,
            data: {
              details: dataToReturn,
              count: count
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

  changeDateFormat = (date: any) => {
    return moment(date).utc().format('YYYY-MM-DD');
  };

  async createContracts(
    HrisCreateContractDto: HrisCreateContractDto,
    userId: string
  ): Promise<any> {
    try {
      const { tspIds, ...rest } = HrisCreateContractDto;

      //check if hr admin
      const adminAccess = await this.prisma.hrisAccess.findMany({
        where: {
          tsp_id: +userId,
          access: 1,
          module: 'HR_ADMIN'
        },
        select: { module: true }
      });
      const isHrAdmin = adminAccess && adminAccess.length > 0;

      const hr_admin_approval = isHrAdmin && isHrAdmin ? 'approved' : 'pending';
      const approved_by = isHrAdmin ? userId : null;
      const approved_at = isHrAdmin ? moment().toISOString() : null;

      // const contractNumber = maxContract?.contract_no || 0;

      if (!tspIds || tspIds.length == 0) {
        // return { success: false, error: 'No users selected' };
        throw new Error(`Please select candiates/ tutors.`);
      } else if (!rest.contractType) {
        throw new Error(`Please select contract type.`);
      } else if (!rest.startDate) {
        throw new Error(`Please select contract start date.`);
      }

      const newRecords = [];
      for (const tspId of tspIds) {
        // get the last contract number
        const maxContract = await this.prisma.hrisContractData.findFirst({
          where: { tsp_id: tspId },
          orderBy: { id: 'desc' },
          select: { contract_no: true }
        });

        //new contract number
        const contractNumber =
          maxContract && maxContract?.contract_no
            ? maxContract?.contract_no + 1
            : 1;

        const newRecord = {
          tsp_id: tspId,
          contract_url: null,
          contract_no: contractNumber,
          contract_type: rest.contractType,
          contract_start_d: new Date(rest.startDate).toISOString(),
          contract_end_d: rest.endDate
            ? new Date(rest.endDate).toISOString()
            : null,
          hr_comment: rest.reasonValue ?? '',
          hr_admin_approval: hr_admin_approval,
          updated_by: +userId,
          updated_at: moment().toISOString(),
          approved_by: approved_by,
          approved_at: approved_at,
          contract_assigned_at: approved_at,
          contract_uploaded_at: null,
          contract_audited_at: null,
          contract_audited_by: null,
          contract_url_status: null,
          contract_url_reject_reason: null
        };

        newRecords.push(newRecord);
      }

      //keep copy of all changed records as backup
      await this.prisma.hrisContractDataBackup.createMany({
        data: newRecords
      });

      const affectedCount = await this.prisma.$transaction(
        newRecords.map((record) =>
          this.prisma.approvedContractData.upsert({
            where: { tsp_id: record.tsp_id },
            create: record,
            update: record
          })
        )
      );

      let data = { success: false, data: [] };
      if (affectedCount.length > 0) {
        const updatedData = await this.prisma.approvedContractData.findMany({
          where: {
            tsp_id: {
              in: tspIds
            }
          }
        });
        data = { success: true, data: updatedData };

        //send email notification to candidate/tutor on contract being assgined
        if (isHrAdmin) {
          const candidateData = await this.prisma.user.findMany({
            where: {
              tsp_id: {
                in: tspIds
              }
            },
            select: {
              tsp_id: true,
              approved_personal_data: {
                select: {
                  firstName: true
                }
              },
              approved_contact_data: {
                select: {
                  workEmail: true,
                  residingCountry: true
                }
              }
            }
          });

          const deadline = moment().add(1, 'days').format('YYYY-MM-DD');
          const frontendURL = process.env.FRONT_URL ?? 'http://localhost:4200/';

          candidateData.map((candidate) => {
            const omt_sdhedule =
              candidate.approved_contact_data?.residingCountry &&
              candidate.approved_contact_data?.residingCountry == 'India'
                ? 'https://drive.google.com/file/d/16ZmBGujLcpdj-05BN---0SROLCaHZS59/view?usp=sharing'
                : 'https://drive.google.com/file/d/1DhiNsYJh9nbMO-0SwHj_NJLY0gt3pgrn/view?usp=sharing';
            const subject =
              candidate.approved_contact_data?.residingCountry &&
              candidate.approved_contact_data?.residingCountry == 'India'
                ? 'TSG Service Provider Contract - IMPORTANT (IND)'
                : 'TSG Service Provider Contract - IMPORTANT (SL)';

            //TODO: EMAIL disabled tempararily 2024-08-29
            /*
            this.mailService.sendContractAssigned(
              candidate.approved_personal_data?.firstName ?? '',
              candidate.tsp_id ?? 0,
              deadline,
              omt_sdhedule,
              subject,
              frontendURL,
              candidate.approved_contact_data?.workEmail ?? ''
            );
            */
          });
        } else {
          //send email notification to hr admin to approve contract details when triggered by hr user
          const candidateData = await this.prisma.approvedPersonalData.findMany(
            {
              where: {
                tspId: {
                  in: tspIds
                }
              },
              select: {
                tspId: true,
                shortName: true
              }
            }
          );

          // send to hr admin notification to approve contract data (triggered by hr user
          await this.mailService.sendHRContractDetails(
            'HR Admin',
            candidateData.length + '',
            moment().format('YYYY-MM-DD'),
            userId,
            rest.contractType,
            new Date(rest.startDate).toISOString(),
            candidateData,
            'hr@thirdspaceglobal.com'
          );
        }
      }
      return data;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async updateActivationStatus(
    { tspIds, status }: UpdateActivationStatusDto,
    userId: string
  ) {
    try {
      const now = new Date().toISOString();

      const updatedIds = await this.prisma.hrisProgress.updateMany({
        where: {
          tspId: {
            in: tspIds
          }
        },
        data:
          status === 'active'
            ? { profileStatus: status, tspActivatedAt: now }
            : { profileStatus: status }
      });

      const users = await this.prisma.user.findMany({
        where: {
          tsp_id: {
            in: tspIds
          }
        },
        select: {
          tsp_id: true,
          approved_personal_data: {
            select: {
              firstName: true
            }
          },
          approved_contact_data: {
            select: {
              workEmail: true,
              residingCountry: true
            }
          },
          tm_approved_status: true,
          GOATutorTier: {
            select: {
              tier_id: true
            },
            orderBy: { id: 'desc' },
            take: 1
          },
          ApprovedJobRequisition: true,
          approved_right2work_data: {
            select: {
              pccUrl: true,
              pccExpireDate: true
            }
          }
        }
      });

      //Profile activation email
      if (status === 'active') {
        // change candidate level 2 to omt 1 giving access to tutor systems - activate account candidate to omt
        await this.prisma.user.updateMany({
          where: {
            tsp_id: {
              in: tspIds
            },
            level: 2
          },
          data: { level: 1 }
        });

        users.map(async (user) => {
          let supervisorTspId = null;
          if (
            user.tm_approved_status &&
            user.tm_approved_status.employeeStatus === 'Active'
          ) {
            supervisorTspId = user?.tm_approved_status?.supervisorTspId
              ? user?.tm_approved_status?.supervisorTspId
              : user?.ApprovedJobRequisition?.supervisorTspId
              ? user?.ApprovedJobRequisition?.supervisorTspId
              : null;

            console.log(
              'WARNING: updateActivationStatus:',
              user.tsp_id,
              'already active'
            );
          } else {
            //trigger: TMS community (was on-hold) movement
            await this.prisma.tmMasterTb.create({
              data: {
                tutorTspId: user.tsp_id,
                movementType: 'community',
                effectiveDate: now,
                returnDate: null,
                description: 'Conditions not met',
                document: null,
                comment:
                  'Automated Movement - triggered via HRIS - Admin Contract Details - Profile Activation - by HR Admin',
                createdAt: now,
                createdBy: +userId,
                m1Approval: 'Skipped',
                l1Approval: 'Skipped',
                l2Approval: 'Skipped',
                m1At: now,
                m1By: +userId,
                l1At: now,
                l1By: +userId,
                l2At: now,
                l2By: +userId,
                movementStatus: 'Approved'
              }
            });
            const residingCountry =
              user?.approved_contact_data?.residingCountry ?? '';

            const department =
              user?.ApprovedJobRequisition?.department &&
              user?.ApprovedJobRequisition?.department != ''
                ? user?.ApprovedJobRequisition?.department
                : 'Tutor Operations';
            const tutorLine =
              user?.ApprovedJobRequisition?.tutorLine &&
              user?.ApprovedJobRequisition?.tutorLine != ''
                ? user?.ApprovedJobRequisition?.tutorLine
                : 'primary';
            const division =
              user?.ApprovedJobRequisition?.division &&
              user?.ApprovedJobRequisition?.division != ''
                ? user?.ApprovedJobRequisition?.division
                : 'Production & Operations';

            //trigger: TMS sub-department movement
            await this.prisma.tmMasterTb.create({
              data: {
                tutorTspId: user.tsp_id,
                movementType: 'sub-department',
                department: department,
                tutorLine: tutorLine,
                division: division,
                effectiveDate: now,
                document: null,
                comment:
                  'Automated Movement - triggered via HRIS - Admin Contract Details - Profile Activation - by HR Admin',
                createdAt: now,
                createdBy: +userId,
                m1Approval: 'Skipped',
                l1Approval: 'Skipped',
                l2Approval: 'Skipped',
                m1At: now,
                m1By: +userId,
                l1At: now,
                l1By: +userId,
                l2At: now,
                l2By: +userId,
                movementStatus: 'Approved'
              }
            });

            supervisorTspId =
              user?.ApprovedJobRequisition?.supervisorTspId ?? null;
            const supervisorName =
              user?.ApprovedJobRequisition?.supervisorName ?? '';

            //trigger: TMS supervisor movement
            supervisorTspId != null &&
              supervisorName != '' &&
              (await this.prisma.tmMasterTb.create({
                data: {
                  tutorTspId: user.tsp_id,
                  movementType: 'supervisor',
                  effectiveDate: now,
                  supervisorTspId: +supervisorTspId,
                  supervisorName: supervisorName,
                  document: null,
                  comment:
                    'Automated Movement - triggered via HRIS - Admin Contract Details - Profile Activation - by HR Admin',
                  createdAt: now,
                  createdBy: +userId,
                  m1Approval: 'Skipped',
                  l1Approval: 'Skipped',
                  l2Approval: 'Skipped',
                  m1At: now,
                  m1By: +userId,
                  l1At: now,
                  l1By: +userId,
                  l2At: now,
                  l2By: +userId,
                  movementStatus: 'Approved'
                }
              }));

            const center =
              user?.ApprovedJobRequisition?.center &&
              user?.ApprovedJobRequisition?.center != ''
                ? user?.ApprovedJobRequisition?.center
                : residingCountry == 'India'
                ? 'TSG-IND'
                : 'TSG';
            const batch = user?.ApprovedJobRequisition?.batch ?? '';
            const employmentType =
              user?.ApprovedJobRequisition?.employmentType &&
              user?.ApprovedJobRequisition?.employmentType != ''
                ? user?.ApprovedJobRequisition?.employmentType
                : 'Tutor';
            const jobTitle =
              user?.ApprovedJobRequisition?.jobTitle &&
              user?.ApprovedJobRequisition?.jobTitle != ''
                ? user?.ApprovedJobRequisition?.jobTitle
                : 'Online Mathematics Tutor';

            // tm approved table update
            await this.prisma.tmApprovedStatus.upsert({
              where: {
                tutorTspId: user.tsp_id
              },
              update: {
                employeeStatus: 'Active',
                movementType: 'Community',
                subStatus: '',
                statusDescription: 'Conditions not met',
                updatedBy: +userId,
                updatedAt: now,
                department: department,
                tutorLine: tutorLine,
                division: division,
                supervisorTspId: +supervisorTspId,
                supervisorName: supervisorName,
                batch: batch,
                employmentType: employmentType,
                jobTitle: jobTitle,
                center: center
              },
              create: {
                tutorTspId: user.tsp_id,
                employeeStatus: 'Active',
                movementType: 'Community',
                subStatus: '',
                statusDescription: 'Conditions not met',
                updatedBy: +userId,
                updatedAt: now,
                department: department,
                tutorLine: tutorLine,
                division: division,
                supervisorTspId: +supervisorTspId,
                supervisorName: supervisorName,
                batch: batch,
                employmentType: employmentType,
                jobTitle: jobTitle,
                center: center
              }
            });
          }

          //enter initial default tutor-tier record if no previous entry found
          if (!(user.GOATutorTier && user.GOATutorTier.length > 0)) {
            //trigger: TMS sub-department movement
            await this.prisma.tmMasterTb.create({
              data: {
                tutorTspId: user.tsp_id,
                movementType: 'tutor-tier',
                tutorTierId: 1,
                tutorTierDescription: 'Tier 1',
                effectiveDate: now.split('T')[0] + 'T00:00:00.000Z',
                document: null,
                comment:
                  'Automated Movement - triggered via HRIS - Admin Contract Details - Profile Activation - by HR Admin',
                createdAt: now,
                createdBy: +userId,
                m1Approval: 'Skipped',
                l1Approval: 'Skipped',
                l2Approval: 'Skipped',
                m1At: now,
                m1By: +userId,
                l1At: now,
                l1By: +userId,
                l2At: now,
                l2By: +userId,
                movementStatus: 'Approved'
              }
            });

            await this.prisma.gOATutorTier.create({
              data: {
                tsp_id: user.tsp_id,
                tier_id: 1,
                effective_date: now.split('T')[0] + 'T00:00:00.000Z',
                createdBy: +userId
              }
            });
          }

          // send tutor activation email to tutor
          await this.mailService.sendTutorActivationMail(
            user.approved_personal_data?.firstName ?? '',
            user.approved_contact_data?.workEmail ?? ''
          );

          /**
           * PCC CRON job related task -----
           * 1. Upon activation of the profile, the employment status would be Active - On Hold - Currently in Initial Tutor Training
           * 2. Email notification to the tutor - Informing the tutor on the PCC Requirement
           */
          const pccExpireDate =
            user?.approved_right2work_data?.pccExpireDate ?? null;
          const pccUrl = user?.approved_right2work_data?.pccUrl ?? null;
          let flagSendPccEmail = pccExpireDate == null || pccUrl == null;
          if (!flagSendPccEmail) {
            /**
             * send email: PCC Requirement
             * only if there is no approved PCC or
             * one that is approved is expiring in less than 5 months
             */
            const fiveMonthsPr = moment(pccExpireDate)
              .subtract(5, 'months')
              .toDate();
            flagSendPccEmail = moment().isAfter(fiveMonthsPr);
          }

          const ccEmails = [];
          if (supervisorTspId != '' && supervisorTspId != null) {
            //find email of supervisor & add to email cc list
            const supervisorData =
              await this.prisma.nonTutorDirectory.findFirst({
                where: {
                  hr_tsp_id: +supervisorTspId
                },
                select: {
                  short_name: true,
                  work_email: true
                }
              });
            supervisorData?.work_email &&
              supervisorData?.work_email != '' &&
              ccEmails.push([
                supervisorData?.work_email,
                supervisorData?.short_name
              ]);
          }

          const threeWeekAf = moment().add(3, 'weeks').format('YYYY-MM-DD');
          const content = `You are required to submit a Police Clearance Certificate to complete your HR Profile. In the event you already have a Police report that has been issued to you within a time period of one year, this too will be accepted.  <br><br> Please submit by ${threeWeekAf}, to complete your onboarding.  <br><br> Once the document is available, you may upload directly to the “Right to work information” section of your HR profile. <br>`;
          const tspIdText = `Tutor TSP ID: ${user.tsp_id}<br>`;

          flagSendPccEmail &&
            (await this.mailService.sendPccCronNoticeEmail(
              tspIdText,
              user.approved_contact_data?.workEmail ?? '',
              user.approved_personal_data?.firstName ?? '',
              'PCC Requirement',
              ccEmails,
              content
            ));
        });
      }

      return { success: true, data: updatedIds };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async updateAdminApprovalStatus(
    { tspIds, status }: UpdateAdminApprovalStatusContractDto,
    approverId: number
  ) {
    if (!tspIds || tspIds.length == 0) {
      // return { success: false, error: 'No users selected' };
      throw new Error(`No users selected`);
    }

    try {
      //check if hr admin
      const adminAccess = await this.prisma.hrisAccess.findMany({
        where: {
          tsp_id: +approverId,
          access: 1,
          module: 'HR_ADMIN'
        },
        select: { module: true }
      });
      const isHrAdmin = adminAccess && adminAccess.length > 0;
      if (!isHrAdmin) {
        throw new Error(`No permission to action`);
      }

      const now = new Date().toISOString();
      const returnLog = [];

      for (const tspId of tspIds) {
        const getContractRecord =
          await this.prisma.approvedContractData.findUnique({
            where: { tsp_id: tspId }
          });

        if (!getContractRecord) {
          returnLog.push({
            tspId,
            success: false,
            msg: 'Record not found'
          });
        } else if (
          getContractRecord.contract_url &&
          getContractRecord.contract_url != '' &&
          getContractRecord.contract_url_status == 'approved'
        ) {
          returnLog.push({
            tspId,
            success: false,
            msg: 'Contract already signed & audited'
          });
        } else {
          const prevApprovalStatus =
            getContractRecord.hr_admin_approval ?? null;

          if (prevApprovalStatus == status) {
            //no change in status
            returnLog.push({
              tspId,
              success: false,
              msg: 'Status already ' + status
            });
          } else {
            switch (status) {
              case 'approved': {
                await this.prisma.approvedContractData.update({
                  where: {
                    tsp_id: tspId
                  },
                  data: {
                    contract_assigned_at: now,
                    hr_admin_approval: status,
                    approved_at: now,
                    approved_by: approverId
                  }
                });
                returnLog.push({
                  tspId,
                  success: true,
                  msg: 'Status updated: ' + status
                });

                //TODO: send email to tutor about contract
                const candidateData = await this.prisma.user.findUnique({
                  where: {
                    tsp_id: tspId
                  },
                  select: {
                    tsp_id: true,
                    approved_personal_data: {
                      select: {
                        firstName: true
                      }
                    },
                    approved_contact_data: {
                      select: {
                        workEmail: true,
                        residingCountry: true
                      }
                    }
                  }
                });

                const deadline = moment().add(1, 'days').format('YYYY-MM-DD');
                const frontendURL =
                  process.env.FRONT_URL ?? 'http://localhost:4200/';

                if (candidateData) {
                  const omt_sdhedule =
                    candidateData.approved_contact_data?.residingCountry &&
                    candidateData.approved_contact_data?.residingCountry ==
                      'India'
                      ? 'https://drive.google.com/file/d/16ZmBGujLcpdj-05BN---0SROLCaHZS59/view?usp=sharing'
                      : 'https://drive.google.com/file/d/1DhiNsYJh9nbMO-0SwHj_NJLY0gt3pgrn/view?usp=sharing';
                  const subject =
                    candidateData.approved_contact_data?.residingCountry &&
                    candidateData.approved_contact_data?.residingCountry ==
                      'India'
                      ? 'TSG Service Provider Contract - IMPORTANT (IND)'
                      : 'TSG Service Provider Contract - IMPORTANT (SL)';

                  //TODO: EMAIL disabled tempararily 2024-08-29
                  /*
                  await this.mailService.sendContractAssigned(
                    candidateData.approved_personal_data?.firstName ?? '',
                    candidateData.tsp_id ?? 0,
                    deadline,
                    omt_sdhedule,
                    subject,
                    frontendURL,
                    candidateData.approved_contact_data?.workEmail ?? ''
                  );
                  */
                }

                break;
              }
              case 'rejected': {
                await this.prisma.approvedContractData.update({
                  where: {
                    tsp_id: tspId
                  },
                  data: {
                    hr_admin_approval: status,
                    approved_at: now,
                    approved_by: approverId,
                    contract_url: null,
                    contract_assigned_at: null,
                    contract_uploaded_at: null,
                    contract_audited_at: null,
                    contract_audited_by: null,
                    contract_url_status: null,
                    contract_url_reject_reason: null
                  }
                });
                returnLog.push({
                  tspId,
                  success: true,
                  msg: 'Status updated: ' + status
                });
                //TODO: send email to hr user about contract
                break;
              }
              case 'pending': {
                await this.prisma.approvedContractData.update({
                  where: {
                    tsp_id: tspId
                  },
                  data: {
                    hr_admin_approval: status,
                    approved_at: now,
                    approved_by: approverId
                  }
                });
                returnLog.push({
                  tspId,
                  success: true,
                  msg: 'Status updated: ' + status
                });
                break;
              }
              default: {
                returnLog.push({
                  tspId,
                  success: false,
                  msg: 'Approval status not identified'
                });
                break;
              }
            }
          }
        }
      }
      /*
      //logic updated on 2023-10-22 BK
      const allCandidates = await this.prisma.user.findMany({
        where: {
          tsp_id: {
            in: tspIds
          }
        },
        include: {
          HrisContractData: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });
      const preHrisContractwithUpdatedStatus = allCandidates.map(
        (candidate) => {
          const { id, ...rest } = candidate.HrisContractData[0];
          return { ...rest, hr_admin_approval: status };
        }
      );

      const allHrisContractPendingCandidateIds = allCandidates
        .filter((candidate) => candidate.HrisContractData)
        .map((candidate) => candidate.tsp_id);

      await this.prisma.hrisContractData.createMany({
        data: preHrisContractwithUpdatedStatus
      });

      await this.prisma.approvedContractData.updateMany({
        where: {
          tsp_id: {
            in: allHrisContractPendingCandidateIds
          }
        },
        data: {
          hr_admin_approval: status,
          approved_at: now,
          approved_by: approverId
        }
      });
      */
      return {
        success: true,
        data: {
          returnLog: returnLog
        }
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async getContractNumbers() {
    try {
      const contractNumbers = await this.prisma.approvedContractData.groupBy({
        by: ['contract_no']
      });

      return {
        success: true,
        data: contractNumbers.map((number) => {
          return {
            contractNo: number?.contract_no
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
