import { HttpException, Injectable } from '@nestjs/common';
import {
  JobRequisitionDto,
  CreateJobRequisitionDto,
  UpdateAdminApprovalStatusJobReqDto,
  AssignAuditorDto
} from './job-requisition.dto';
import * as moment from 'moment';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class JobRequisitionService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async fetchTableJobRequisition({
    skip,
    take,
    export2Csv = '',
    auditStatus,
    jobReqApproval,
    profileStatus,
    jobReqUpdatedDate,
    country,
    tspId,
    name,
    auditor,
    email
  }: JobRequisitionDto) {
    const isWhere =
      auditStatus ||
      jobReqApproval ||
      jobReqUpdatedDate ||
      country ||
      tspId ||
      name ||
      auditor ||
      profileStatus ||
      email;

    try {
      const tspIds =
        tspId &&
        tspId
          .replace(/[^\d,]/g, '')
          .split(',')
          .map(Number)
          .filter(Boolean);

      let ApprovedJobRequisition: any = {};
      if (jobReqUpdatedDate || jobReqApproval) {
        ApprovedJobRequisition = {
          approvalStatus: jobReqApproval ? { equals: jobReqApproval } : {},
          approvedAt: jobReqUpdatedDate
            ? {
                gt: moment(jobReqUpdatedDate).startOf('date').toISOString(),
                lte: moment(jobReqUpdatedDate).endOf('date').toISOString()
              }
            : {}
        };
      }

      let user_hris_progress: any = {
        tutorStatus: {
          not: null
        }
      };
      if (auditStatus || auditor || profileStatus) {
        user_hris_progress = {
          tutorStatus: auditStatus ? { equals: auditStatus } : { not: null },
          profileStatus: profileStatus ? { equals: profileStatus } : {},
          auditorId: auditor
            ? auditor != '-1'
              ? { equals: +auditor }
              : null
            : {}
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
            tsp_id: tspId ? { in: tspIds } : {},
            approved_personal_data,
            approved_contact_data,
            user_hris_progress,
            ApprovedJobRequisition
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

      const [candidates, rowCount] = await Promise.all([
        this.prisma.user.findMany({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter,
          select: {
            tsp_id: true,
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
            },
            approved_contract_data: true,
            ApprovedJobRequisition: {
              select: {
                batch: true,
                supervisorName: true,
                employmentType: true,
                division: true,
                department: true,
                jobTitle: true,
                tutorLine: true,
                center: true,
                approvalStatus: true,
                comment: true,
                approvedAt: true,
                updatedAt: true,
                updatedBy: true,
                approvedBy: true
              }
            }
          },
          ...(!export2Csv ? { take: +take, skip: +skip } : {})
        }),
        this.prisma.user.count({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter
        })
      ]);

      const dataToReturn = candidates
        ? candidates.map((row) => {
            return {
              id: row.tsp_id,
              tspId: row.tsp_id,
              shortName: row.approved_personal_data?.shortName ?? '',
              residingCountry: row.approved_contact_data?.residingCountry ?? '',
              workEmail: row.approved_contact_data?.workEmail ?? '',
              mobileNumber: row.approved_contact_data?.mobileNumber ?? '',
              tutorStatus: row.user_hris_progress?.tutorStatus ?? '',
              profileStatus: row?.user_hris_progress?.profileStatus ?? '',
              supervisorName: row?.tm_approved_status?.supervisorName ?? '',
              employeeStatus: row?.tm_approved_status?.employeeStatus ?? '',
              movementType: row?.tm_approved_status?.movementType ?? '',
              auditorEmail: row.user_hris_progress?.auditor?.username ?? '',

              auditorTspId: row.user_hris_progress?.auditorId ?? '',
              auditorName:
                row.user_hris_progress?.auditor?.approved_personal_data
                  ?.shortName ?? '',

              batch: row?.ApprovedJobRequisition?.batch ?? null,
              supervisor: row?.ApprovedJobRequisition?.supervisorName ?? null,
              employment: row?.ApprovedJobRequisition?.employmentType ?? null,
              division: row?.ApprovedJobRequisition?.division ?? null,
              department: row?.ApprovedJobRequisition?.department ?? null,
              jobTitle: row?.ApprovedJobRequisition?.jobTitle ?? null,
              tutorLine: row?.ApprovedJobRequisition?.tutorLine ?? null,
              center: row?.ApprovedJobRequisition?.center ?? null,
              adminApproval:
                row?.ApprovedJobRequisition?.approvalStatus ?? null,
              comment: row?.ApprovedJobRequisition?.comment ?? null,
              approvedAt: row?.ApprovedJobRequisition?.approvedAt ?? null,

              updated_by: row.ApprovedJobRequisition?.updatedBy ?? '',
              updated_at: row.ApprovedJobRequisition?.updatedAt ?? '',
              approved_by: row.ApprovedJobRequisition?.approvedBy ?? '',
              approved_at: row.ApprovedJobRequisition?.approvedAt ?? ''
            };
          })
        : {};

      if (candidates) {
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

  async createOrUpdateJobReq(
    data: CreateJobRequisitionDto,
    createdBy: any
  ): Promise<any> {
    try {
      const { tspIds, ...rest } = data;
      const batchSize = 10; // Batch size of 10
      if (tspIds.length <= 0) {
        throw new Error('Please select candiates.');
      } else if (rest.batch === '') {
        throw new Error('Please enter batch.');
      } else if (rest.center === '') {
        throw new Error('Please select center.');
      } else if (rest.supervisorTspId === 0) {
        throw new Error('Please select Relationship Manager.');
      } else if (rest.tutorLine === '') {
        throw new Error('Please select Tutor Line.');
      }

      // all candidates should be initial audit passed

      const hasHrAdminAccess = await this.prisma.hrisAccess.count({
        where: {
          tsp_id: createdBy,
          module: 'HR_ADMIN',
          access: 1
        }
      });
      const approvalStatus =
        hasHrAdminAccess && hasHrAdminAccess > 0 ? 'approved' : 'pending';

      await this.prisma.$transaction(async (prisma) => {
        for (let i = 0; i < tspIds.length; i += batchSize) {
          const batch = tspIds.slice(i, i + batchSize);
          const upsertPromises = batch.map((tspId) =>
            prisma.approvedJobRequisition.upsert({
              where: { tspId },
              update: {
                batch: rest.batch,
                center: rest.center,
                department: null,
                division: null,
                comment: rest.comment,
                jobTitle: rest.jobTitle,
                employmentType: rest.employmentType,
                tutorLine: rest.tutorLine,
                supervisorTspId: rest.supervisorTspId,
                supervisorName: rest.supervisorName,
                approvalStatus: approvalStatus,
                updatedBy: createdBy
              },
              create: {
                batch: rest.batch,
                center: rest.center,
                department: null,
                division: null,
                comment: rest.comment,
                jobTitle: rest.jobTitle,
                employmentType: rest.employmentType,
                tutorLine: rest.tutorLine,
                supervisorTspId: rest.supervisorTspId,
                supervisorName: rest.supervisorName,
                updatedBy: createdBy,
                approvalStatus: approvalStatus,
                tspId
              }
            })
          );
          //update tms data on job req update (for omts)
          const updateTmsPromises =
            hasHrAdminAccess && hasHrAdminAccess > 0
              ? batch.map((tspId) =>
                  prisma.tmApprovedStatus.updateMany({
                    where: { tutorTspId: tspId },
                    data: {
                      batch: rest.batch,
                      center: rest.center,
                      jobTitle: rest.jobTitle,
                      employmentType: rest.employmentType,
                      tutorLine: rest.tutorLine,
                      supervisorTspId: rest.supervisorTspId,
                      supervisorName: rest.supervisorName,
                      updatedBy: createdBy,
                      updatedAt: new Date().toISOString()
                    }
                  })
                )
              : [];
          await Promise.all([...upsertPromises, ...updateTmsPromises]);
        }
      });

      const newRecords = tspIds.map((tspId) => ({ ...rest, tspId }));

      const affectedCount = await this.prisma.hrisJobRequisition.createMany({
        data: newRecords
      });

      let response = { success: false, data: [] };
      if (affectedCount.count > 0) {
        const updatedData = await this.prisma.approvedJobRequisition.findMany({
          where: {
            tspId: {
              in: tspIds
            }
          },
          select: {
            tspId: true,
            batch: true,
            center: true,
            department: true,
            division: true,
            comment: true,
            jobTitle: true,
            employmentType: true,
            tutorLine: true,
            supervisorTspId: true,
            approvalStatus: true,
            supervisorName: true
          }
        });
        response = { success: true, data: updatedData };

        //for email content fecth tutor names
        const tableData = await this.prisma.approvedPersonalData.findMany({
          where: {
            tspId: {
              in: tspIds
            }
          },
          select: {
            tspId: true,
            shortName: true
          }
        });

        // send job reqisition approval request to hr admin when triggered by hr user
        if (approvalStatus == 'pending') {
          await this.mailService.sendHRJobDetails(
            'HR Admin',
            affectedCount.count + '',
            rest.batch,
            'hr@thirdspaceglobal.com',
            tableData
          );
        }
      }

      return response;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async assignAuditor(data: AssignAuditorDto, createdBy: any): Promise<any> {
    // Function to generate table tr string
    function generateTrString(obj) {
      return `<tr><td>${obj.tspId ?? ''}</td><td>${
        obj.user?.approved_personal_data?.shortName ?? ''
      }</td></tr>`;
    }

    try {
      const { tspIds, ...rest } = data;
      if (tspIds.length <= 0) {
        throw new Error('Please select candiates.');
      }
      if (rest.auditorId == 0 || rest.auditorId == undefined) {
        throw new Error('Please select the auditor.');
      }

      const batchSize = 10; // Batch size of 10

      await this.prisma.$transaction(async (prisma) => {
        for (let i = 0; i < tspIds.length; i += batchSize) {
          const batch = tspIds.slice(i, i + batchSize);
          const upsertPromises = batch.map((tspId) =>
            prisma.hrisProgress.upsert({
              where: {
                tspId: tspId
              },
              update: {
                auditorId: rest.auditorId,
                auditorAssignedAt: new Date().toISOString()
              },
              create: {
                tspId,
                auditorId: rest.auditorId,
                auditorAssignedAt: new Date().toISOString()
              }
            })
          );
          await Promise.all(upsertPromises);
        }
      });

      const newRecords = tspIds.map((tspId) => ({
        ...rest,
        tspId,
        createdBy: createdBy
      }));
      const affectedCount = await this.prisma.hrisAssignedAuditor.createMany({
        data: newRecords
      });

      let response = { success: false, data: [] };
      if (affectedCount.count > 0) {
        const updatedData = await this.prisma.hrisProgress.findMany({
          where: {
            tspId: {
              in: tspIds
            }
          },
          select: {
            tspId: true,
            user: {
              select: {
                approved_personal_data: {
                  select: {
                    shortName: true
                  }
                }
              }
            },
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
        });
        response = { success: true, data: updatedData };

        const auditorData = await this.prisma.user.findUnique({
          where: {
            tsp_id: +rest.auditorId
          },
          select: {
            username: true,
            approved_personal_data: {
              select: {
                firstName: true
              }
            }
            // approved_contact_data: {
            //   select: {
            //     workEmail: true
            //   }
            // }
          }
        });

        const tableTagGenerated = updatedData.map(generateTrString).join('');

        //generate & trigger auditor notify bulk assigns email
        await this.mailService.sendNotifyAuditorAssignedBulk(
          auditorData.username ?? '',
          auditorData.approved_personal_data?.firstName
            ? auditorData.approved_personal_data?.firstName
            : auditorData.username ?? '',
          `${tspIds.length}`,
          tableTagGenerated
        );
      }

      return response;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async updateAdminApprovalStatus(
    { tspIds, status }: UpdateAdminApprovalStatusJobReqDto,
    approverId: number
  ) {
    try {
      const now = new Date().toISOString();
      const allCandidates = await this.prisma.user.findMany({
        where: {
          tsp_id: {
            in: tspIds
          }
        },
        include: {
          HrisJobRequisition: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });

      //TODO: capture reject reason.
      const previousHrisJobRequisitionWithUpdatedStatus = allCandidates.map(
        (candidate) => {
          if (status == 'rejected') {
            // send job reqisition reject email notification
            this.mailService.sendJobRequisitionReject(
              'HR User',
              candidate.HrisJobRequisition[0].batch ?? '',
              'hr@thirdspaceglobal.com',
              candidate.HrisJobRequisition[0].tspId
                ? candidate.HrisJobRequisition[0].tspId + ''
                : '',
              'reason'
            );
          }

          const { id, ...rest } = candidate.HrisJobRequisition[0];
          return { ...rest, approvalStatus: status };
        }
      );

      const allHrisContractPendingCandidateIds = allCandidates
        .filter((candidate) => candidate.HrisJobRequisition)
        .map((candidate) => candidate.tsp_id);

      await this.prisma.hrisJobRequisition.createMany({
        data: previousHrisJobRequisitionWithUpdatedStatus
      });

      await this.prisma.approvedJobRequisition.updateMany({
        where: {
          tspId: {
            in: allHrisContractPendingCandidateIds
          }
          // hr_admin_approval: 'pending'
        },
        data: {
          approvalStatus: status,
          approvedAt: now,
          approvedBy: approverId
        }
      });

      return {
        success: true,
        data: {
          ids: allHrisContractPendingCandidateIds
        }
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  // fetch: list of all active relationship managers
  async fetchActiveRms() {
    const customRmInclude = [236];
    try {
      const rms = await this.prisma.nonTutorDirectory.findMany({
        distinct: ['hr_tsp_id', 'short_name'],
        select: {
          hr_tsp_id: true,
          short_name: true
        },
        where: {
          OR: [
            {
              job_title: {
                in: [
                  'Executive - Relationship Management',
                  'Senior Executive - Relationship Management',
                  'Team Lead'
                ]
              }
            },
            {
              hr_tsp_id: { in: customRmInclude }
            }
          ],
          user: {
            level: 3
          }
        },
        orderBy: {
          short_name: 'asc'
        }
      });
      return {
        success: true,
        data: rms.map((row) => {
          return {
            tspId: row.hr_tsp_id,
            name: row.short_name
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async fetchAvailableAuditors() {
    try {
      const otherNonTutors = await this.prisma.hrisAccess.findMany({
        where: {
          access: 1,
          OR: [
            {
              module: 'HR_ADMIN'
            },
            {
              module: 'HR_USER'
            }
          ]
        },
        select: {
          tsp_id: true
        }
      });

      const otherNonTutorsTspIds = otherNonTutors.map((user) => {
        return user.tsp_id;
      });

      const auditors = await this.prisma.hrisAccess.findMany({
        where: {
          module: 'AUDITOR',
          access: 1,
          tsp_id: {
            notIn: otherNonTutorsTspIds
          }
        },
        select: {
          user: {
            select: {
              tsp_id: true,
              username: true,
              approved_personal_data: {
                select: {
                  shortName: true
                }
              },
              auditor_hris_progress: {
                select: {
                  tutorStatus: true
                }
              }
            }
          }
        }
      });

      // console.log('auditorsu', auditors);
      return {
        success: true,
        data: auditors.map((row) => {
          const totalProfileAssigned =
            row?.user?.auditor_hris_progress?.length ?? 0;

          // Filter out "audit in progress" and "audit pending" statuses
          const filteredTutors =
            row?.user?.auditor_hris_progress?.filter(
              (progress) =>
                progress.tutorStatus !== 'audit in progress' &&
                progress.tutorStatus !== 'audit pending'
            ) ?? [];

          // Get the count of total profiles completed
          const totalProfileCompleted = filteredTutors.length ?? 0;
          const totalProfileRemaining =
            totalProfileAssigned - totalProfileCompleted;

          return {
            labels: ['Completed', 'Pending'],
            datasets: [
              {
                label: row?.user?.approved_personal_data?.shortName ?? '',
                data: [totalProfileCompleted, totalProfileRemaining],
                backgroundColor: ['#2779F5', '#B1D0FF']
              }
            ],
            total: totalProfileAssigned
          };
        })
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
