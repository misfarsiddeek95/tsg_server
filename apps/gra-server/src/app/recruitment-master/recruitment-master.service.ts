import { HttpException, Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import moment = require('moment');
import {
  AssignToBatchDto,
  CreateNewBatchDto,
  RecruitmentMasterDto,
  UpdateCandidateTrainingStatusDto
} from './recruitment-master.dto';

@Injectable()
export class RecruitmentMasterService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async fetchRecruitmentMaster(
    take,
    skip,
    tspId,
    candiName,
    startDate,
    endDate
  ) {
    try {
      const tspIds =
        tspId &&
        tspId
          .replace(/[^\d,]/g, '')
          .split(',')
          .map(Number)
          .filter(Boolean);
      const tspIdsFilter =
        tspIds && tspIds.length > 0
          ? ' AND u.tsp_id in (' + tspIds.join(',') + ') '
          : '';
      const candiNameFilter =
        candiName && candiName.length > 0
          ? ` AND apd.short_name LIKE '%${candiName.replace(
              /[^\da-zA-Z ]/g,
              ''
            )}%' `
          : '';
      const registrationDateFilter =
        startDate && endDate
          ? ` AND u.created_at BETWEEN '${moment(startDate)
              .startOf('day')
              .toISOString()}' AND '${moment(endDate)
              .endOf('day')
              .toISOString()}' `
          : '';

      const countResult = await this.prisma.$queryRawUnsafe<{ count: number }>(
        `SELECT COUNT(*) AS count FROM 
        user u 
        LEFT JOIN approved_personal_data apd ON (u.tsp_id = apd.tsp_id)
        ${tspIdsFilter} 
        ${candiNameFilter}  
        ${registrationDateFilter} 
        WHERE u.level = 2`
      );
      const count = Number(countResult[0].count);

      const details: any = await this.prisma.$queryRawUnsafe(`
        SELECT u.tsp_id id, u.tsp_id tspId, u.username, DATE_FORMAT(u.created_at, '%d.%m.%Y') signUpDate, u.last_login_at, u.level u_level, u.is_deactivated isDeactivated,
        apd.short_name shortName, acd.work_email workEmail, acd.mobile_number mobileNumber,acd.residing_country residingCountry,
        ajr.batch,
        hp.tutor_status tutorStatus,hp.profile_status profileStatus,
        cl.level cl_level, cl.step1, cl.step2, cl.step3, cl.step4, cl.step5, cl.step6, cl.step7, cl.step8, 
        cl.failed_state, cl.failed_level, 
        cl.ft_lvl1_enabled, cl.ft_lvl2_enabled, cl.ft_lvl1_completed, cl.ft_lvl2_completed, cl.training_status, 
        bs.id bs_id, bs.appointment_type_ref_id bs_type, DATE_FORMAT(bs.date, '%d.%m.%Y') bs_date, bs.status bs_status, bs.interviewer_id bs_interviewer_id,
        COALESCE(NULLIF(u_apd.short_name, ''), u_bs.username) AS bs_interviwer_name,
        '_'
        FROM user u
        LEFT JOIN approved_personal_data apd ON (u.tsp_id = apd.tsp_id)
        LEFT JOIN approved_contact_data acd ON (u.tsp_id = acd.tsp_id)
        LEFT JOIN approved_job_requisition ajr ON (u.tsp_id = ajr.tsp_id)
        LEFT JOIN hris_progress hp ON (u.tsp_id = hp.tsp_id)
        -- bs candidate
        LEFT JOIN bs_candidate_level cl ON (u.tsp_id = cl.candidate_id)
        -- booking system
        LEFT JOIN
        (SELECT m1.*
        FROM bs_booking_status m1 LEFT JOIN bs_booking_status m2
        ON (
          m1.candidate_id = m2.candidate_id 
            AND (
              m1.updated_at < m2.updated_at
              OR (m1.updated_at = m2.updated_at AND m1.id < m2.id)
            )
          )
        WHERE m2.id IS NULL 
        AND m1.candidate_id IS NOT NULL) bs
        ON (u.tsp_id = bs.candidate_id)
        LEFT JOIN user u_bs ON (bs.interviewer_id = u_bs.tsp_id)
        LEFT JOIN approved_personal_data u_apd ON (u_apd.tsp_id = u_bs.tsp_id)

        WHERE u.level = 2
        ${tspIdsFilter}
        ${candiNameFilter}
        ${registrationDateFilter}
        LIMIT ${take} OFFSET ${skip}
        `);

      // console.log('data', details);

      return { success: true, data: details, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  } //end: fetchRecruitmentMaster

  async fetchBatchList() {
    try {
      const result = await this.prisma.tutorBatchList.findMany({
        select: {
          id: true,
          batchName: true,
          batchActive: true,
          teamLeadTspId: true,
          teamLeadName: true,
          trainingBrief1Date: true,
          trainingBrief1Time: true,
          trainingBrief1Link: true,
          level1StandupCallDate: true,
          level2StandupCallDate: true
        }
      });
      if (result) {
        return {
          success: true,
          data: result
        };
      } else {
        return {
          success: false,
          data: null
        };
      }
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async assignToBatch(data: AssignToBatchDto, createdBy: any): Promise<any> {
    try {
      console.log('assignToBatch_data', data);
      const { tspIds, batchName } = data;
      const batchSize = 10; // Batch size of 10
      if (tspIds.length <= 0) {
        throw new Error('Please select candiates.');
      } else if (batchName === '') {
        throw new Error('Please enter batch.');
      }

      const validTspIdsResult = await this.prisma.user.findMany({
        where: {
          tsp_id: {
            in: tspIds
          },
          level: 2,
          isDeactivated: false,
          CandidateLevel: {
            level: { gte: 4 }
          }
        },
        select: {
          tsp_id: true,
          approved_personal_data: { select: { shortName: true } },
          approved_contact_data: { select: { workEmail: true } }
        }
      });
      console.log('validTspIdsResult', validTspIdsResult);

      if (validTspIdsResult.length === 0) {
        throw new Error('No eligible candidates found.');
      }
      const validTspIds = validTspIdsResult.map((item) => item.tsp_id);

      await this.prisma.$transaction(async (prisma) => {
        for (let i = 0; i < validTspIds.length; i += batchSize) {
          const batch = validTspIds.slice(i, i + batchSize);
          const upsertApprovedJobRequisition = batch.map((tspId) => {
            return prisma.approvedJobRequisition.upsert({
              where: { tspId: tspId },
              update: {
                batch: batchName,
                updatedBy: createdBy
              },
              create: {
                batch: batchName,
                updatedBy: createdBy,
                tspId: tspId
              }
            });
          });
          const upsertCandidateLevel = batch.map((tspId) => {
            return prisma.candidateLevel.upsert({
              where: { candidate_id: tspId },
              update: {
                trainingStatus: 'Active',
                updatedAt: new Date().toISOString()
              },
              create: {
                trainingStatus: 'Active',
                updatedAt: new Date().toISOString(),
                candidate_id: tspId
              }
            });
          });
          await Promise.all([
            ...upsertApprovedJobRequisition,
            ...upsertCandidateLevel
          ]);
        } //end: for loop
      });

      const newRecords = validTspIds.map((tspId) => ({
        tspId,
        batch: batchName,
        updatedBy: createdBy
      }));

      const affectedCount = await this.prisma.hrisJobRequisition.createMany({
        data: newRecords
      });
      console.log('affectedCount', affectedCount);

      let response = { success: false, data: [] };

      const batchData = await this.prisma.tutorBatchList.findFirst({
        where: { batchName: batchName }
      });
      if (affectedCount.count > 0) {
        const updatedData = await this.prisma.user.findMany({
          where: {
            tsp_id: {
              in: validTspIds
            }
          },
          select: {
            tsp_id: true,
            approved_personal_data: {
              select: { firstName: true, shortName: true }
            },
            approved_contact_data: { select: { workEmail: true } },
            ApprovedJobRequisition: {
              select: {
                tspId: true,
                batch: true
              }
            },
            CandidateLevel: {
              select: {
                trainingStatus: true
              }
            }
          }
        });
        const updatedDataFlat = updatedData.map((item) => ({
          tspId: item.ApprovedJobRequisition.tspId,
          training_status: item.CandidateLevel.trainingStatus,
          batch: item.ApprovedJobRequisition.batch
        }));
        response = { success: true, data: updatedDataFlat };

        //TODO: review this email trigger code: Kasun
        // gra training welcome email trigger
        updatedData.map((candidate) => {
          if (candidate && candidate.approved_contact_data.workEmail) {
            // send job reqisition reject email notification
            this.mail.sendGraTrainingWelcomeEmail(
              candidate.approved_contact_data.workEmail,
              candidate.approved_personal_data.firstName,
              batchData.teamLeadName,
              batchData.trainingBrief1Date
                ? moment(batchData.trainingBrief1Date).format('Do MMMM YYYY')
                : '',
              batchData.trainingBrief1Time + '',
              batchData.trainingBrief1Link + '',
              batchData.level1StandupCallDate
                ? moment(batchData.level1StandupCallDate).format('Do MMMM YYYY')
                : 'TBD',
              batchData.level2StandupCallDate
                ? moment(batchData.level2StandupCallDate).format('Do MMMM YYYY')
                : 'TBD'
            );
          }

          // const { id, ...rest } = candidate.HrisJobRequisition[0];
          // return { ...rest, approvalStatus: status };
        });
      }

      return response;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async createNewBatch(data: CreateNewBatchDto, createdBy: any) {
    try {
      const {
        batchName,
        batchActive,
        teamLeadTspId,
        teamLeadName,
        trainingBrief1Date,
        trainingBrief1Time,
        trainingBrief1Link,
        level1StandupCallDate,
        level2StandupCallDate
      } = data;

      if (!batchName.trim() || !teamLeadName) {
        throw new Error('Incomplete batch information.');
      }

      const batchExisit = await this.prisma.tutorBatchList.findUnique({
        where: {
          batchName: batchName.trim()
        }
      });

      const batchCreated = !batchExisit
        ? await this.prisma.tutorBatchList.create({
            data: {
              created_by: createdBy,
              created_at: new Date().toISOString(),
              updated_by: createdBy,
              updated_at: new Date().toISOString(),
              batchName: batchName.trim(),
              batchActive: +batchActive,
              teamLeadTspId: +teamLeadTspId,
              teamLeadName: teamLeadName,
              trainingBrief1Date: trainingBrief1Date
                ? new Date(trainingBrief1Date)
                : null,
              trainingBrief1Time: trainingBrief1Time,
              trainingBrief1Link: trainingBrief1Link,
              level1StandupCallDate: level1StandupCallDate
                ? new Date(level1StandupCallDate)
                : null,
              level2StandupCallDate: level2StandupCallDate
                ? new Date(level2StandupCallDate)
                : null
            }
          })
        : await this.prisma.tutorBatchList.update({
            where: {
              batchName: batchName.trim()
            },
            data: {
              updated_by: createdBy,
              updated_at: new Date().toISOString(),
              batchName: batchName.trim(),
              batchActive: +batchActive,
              teamLeadTspId: +teamLeadTspId,
              teamLeadName: teamLeadName,
              trainingBrief1Date: trainingBrief1Date
                ? new Date(trainingBrief1Date)
                : null,
              trainingBrief1Time: trainingBrief1Time,
              trainingBrief1Link: trainingBrief1Link,
              level1StandupCallDate: level1StandupCallDate
                ? new Date(level1StandupCallDate)
                : null,
              level2StandupCallDate: level2StandupCallDate
                ? new Date(level2StandupCallDate)
                : null
            }
          });
      if (batchCreated) {
        const batchList = await this.fetchBatchList();
        return batchList;
      } else {
        throw new Error('Batch creation failed.');
      }
    } catch (error) {
      console.log('This is error', error);
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async updateCandidateTrainingStatus(
    data: UpdateCandidateTrainingStatusDto,
    createdBy: any
  ) {
    try {
      const { tspId, trainingStatus } = data;
      console.log('xx', tspId, trainingStatus);

      if (!tspId) {
        throw new Error('Invalid TSP ID found.');
      } else if (
        !['Active', 'On Hold', 'Drop Out', 'Removed from training'].includes(
          trainingStatus
        )
      ) {
        throw new Error('Invalid Training Status found');
      }

      const fetchCandidateRecord = await this.prisma.user.findUnique({
        where: { tsp_id: tspId },
        select: {
          tsp_id: true,
          isDeactivated: true,
          level: true,
          CandidateLevel: {
            select: { level: true, trainingStatus: true }
          }
        }
      });

      if (
        !(
          fetchCandidateRecord &&
          fetchCandidateRecord.level === 2 &&
          !fetchCandidateRecord.isDeactivated
        )
      ) {
        throw new Error('Candidate account status invalid');
      } else {
        let updateTrainingStatus = undefined;
        // 'Active', 'On Hold', 'Drop Out', 'Removed from training'
        switch (trainingStatus) {
          case 'Active':
            if (
              ['On Hold', 'Removed from training'].includes(
                fetchCandidateRecord.CandidateLevel.trainingStatus
              )
            ) {
              updateTrainingStatus = await this.prisma.candidateLevel.update({
                where: { candidate_id: tspId },
                data: { trainingStatus: trainingStatus }
              });
              await this.prisma.bsTutorJourneyTracker.create({
                data: {
                  tspId: tspId,
                  system: 'recruitment-master',
                  journeyLevel: 'trainingStatus',
                  journeyOutcome: trainingStatus
                    ? trainingStatus.substring(0, 19)
                    : null,
                  createdAt: new Date().toISOString(),
                  createdBy: createdBy
                }
              });
            } else {
              throw new Error('Candidate training status not changed.');
            }
            break;
          case 'On Hold':
            if (
              ['Active', 'Removed from training'].includes(
                fetchCandidateRecord.CandidateLevel.trainingStatus
              )
            ) {
              updateTrainingStatus = await this.prisma.candidateLevel.update({
                where: { candidate_id: tspId },
                data: { trainingStatus: trainingStatus }
              });
              await this.prisma.bsTutorJourneyTracker.create({
                data: {
                  tspId: tspId,
                  system: 'recruitment-master',
                  journeyLevel: 'trainingStatus',
                  journeyOutcome: trainingStatus,
                  createdAt: new Date().toISOString(),
                  createdBy: createdBy
                }
              });
            } else {
              throw new Error('Candidate training status not changed.');
            }
            break;
          case 'Drop Out':
            if (
              ['Active', 'On Hold', 'Removed from training'].includes(
                fetchCandidateRecord.CandidateLevel.trainingStatus
              )
            ) {
              updateTrainingStatus = await this.prisma.candidateLevel.update({
                where: { candidate_id: tspId },
                data: { trainingStatus: trainingStatus }
              });
              //deactivate account
              await this.prisma.user.update({
                where: { tsp_id: tspId },
                data: {
                  isDeactivated: true,
                  updated_at: new Date().toDateString()
                }
              });
              await this.prisma.bsTutorJourneyTracker.create({
                data: {
                  tspId: tspId,
                  system: 'recruitment-master',
                  journeyLevel: 'trainingStatus',
                  journeyOutcome: trainingStatus,
                  createdAt: new Date().toISOString(),
                  createdBy: createdBy
                }
              });
            } else {
              throw new Error('Candidate training status not changed.');
            }
            break;
          case 'Removed from training':
            if (
              ['Active', 'On Hold'].includes(
                fetchCandidateRecord.CandidateLevel.trainingStatus
              )
            ) {
              updateTrainingStatus = await this.prisma.candidateLevel.update({
                where: { candidate_id: tspId },
                data: { trainingStatus: trainingStatus }
              });
              await this.prisma.bsTutorJourneyTracker.create({
                data: {
                  tspId: tspId,
                  system: 'recruitment-master',
                  journeyLevel: 'trainingStatus',
                  journeyOutcome: trainingStatus,
                  createdAt: new Date().toISOString(),
                  createdBy: createdBy
                }
              });
            } else {
              throw new Error('Candidate training status not changed.');
            }
            break;
          default:
            break;
        }
        if (updateTrainingStatus) {
          return {
            success: true,
            data: { tspId: tspId, trainingStatus: trainingStatus }
          };
        } else {
          return { success: false, error: 'Training status not updated' };
        }
      }
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async exportRecruitmentMaster({
    tspId,
    candiName,
    startDate,
    endDate
  }: Omit<RecruitmentMasterDto, 'take' | 'skip'>) {
    try {
      const count = 0;
      const data = {};

      return { success: true, data, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  } //end: exportRecruitmentMaster

  async test() {
    const count = 1;
    /*
WITH esa AS
          SELECT m.*
            FROM initial_assessment m
          WHERE m.id = (
              SELECT MAX(m2.id) FROM initial_assessment m2 WHERE m2.tsp_id = m.tsp_id
          )
          )
          */
    const details: any = await this.prisma.$queryRaw`
      
      SELECT u.tsp_id, u.username, u.created_at registration_date, u.last_login_at, u.level u_level, u.is_deactivated,
        apd.short_name, acd.work_email,
        cl.level cl_level, cl.step1, cl.step2, cl.step3, cl.step4, cl.step5, cl.step6, cl.step7, cl.step8, 
        cl.failed_state, cl.failed_level, 
        cl.ft_lvl1_enabled, cl.ft_lvl2_enabled, cl.ft_lvl1_completed, cl.ft_lvl2_completed, 
        bs.id bs_id, bs.appointment_type_ref_id bs_type, bs.date bs_date, bs.status bs_status, bs.interviewer_id bs_interviewer_id,
        u_bs.username bs_interviwer_name,
        
        '_'
        FROM user u
        LEFT JOIN approved_personal_data apd ON (u.tsp_id = apd.tsp_id)
        LEFT JOIN approved_contact_data acd ON (u.tsp_id = acd.tsp_id)
        LEFT JOIN bs_candidate_level cl ON (u.tsp_id = cl.candidate_id)
        -- booking system
        LEFT JOIN
        (SELECT m1.*
        FROM bs_booking_status m1 LEFT JOIN bs_booking_status m2
        ON (
          m1.candidate_id = m2.candidate_id 
            AND (
              m1.updated_at < m2.updated_at
              OR (m1.updated_at = m2.updated_at AND m1.id < m2.id)
            )
          )
        WHERE m2.id IS NULL 
        AND m1.candidate_id IS NOT NULL) bs
        ON (u.tsp_id = bs.candidate_id)
        LEFT JOIN user u_bs ON (bs.interviewer_id = u_bs.tsp_id)
        
        
        WHERE u.level = 2
        `;

    /*
const details: any = await this.prisma.$queryRaw`
      
      SELECT u.tsp_id, u.username, u.created_at registration_date, u.last_login_at, u.level u_level, u.is_deactivated,
        apd.short_name, acd.work_email,
        bs.level bs_level, bs.step1, bs.step2, bs.step3, bs.step4, bs.step5, bs.step6, bs.step7, bs.step8, 
        bs.failed_state, bs.failed_level, 
        bs.ft_lvl1_enabled, bs.ft_lvl2_enabled, bs.ft_lvl1_completed, bs.ft_lvl2_completed, 
        esa.bs_booking_id esa_booking_id, esa.date esa_date, esa.attendance esa_attendance, 
        esa.final_outcome esa_final_outcome, esa.final_reason esa_final_reason, 
        u_esa.username esa_interviwer,
        fta1.bs_booking_id fta1_booking_id, fta1.demo_date fta1_date, fta1.attendance fta1_attendance, fta1.demo_attempt fta1_attempt, 
        fta1.final_outcome fta1_final_outcome, fta1.fail_reason fta1_final_reason, fta1.email_sent fta1_email_sent, 
        u_fta1.username fta1_interviwer,
        fta2.bs_booking_id fta2_booking_id, fta2.demo_date fta2_date, fta2.attendance fta2_attendance, fta2.demo_attempt fta2_attempt, 
        fta2.final_outcome fta2_final_outcome, fta2.fail_reason fta2_final_reason, fta2.email_sent fta2_email_sent, 
        u_fta2.username fta2_interviwer,
        bs_esa.id bs_esa_id, bs_esa.date bs_esa_date, bs_esa.status bs_esa_status,
        bs_fta1.id bs_fta1_id, bs_fta1.date bs_fta1_date, bs_fta1.status bs_fta1_status,
        bs_fta2.id bs_fta2_id, bs_fta2.date bs_fta2_date, bs_fta2.status bs_fta2_status,
        '_'
        FROM user u
        LEFT JOIN approved_personal_data apd ON (u.tsp_id = apd.tsp_id)
        LEFT JOIN approved_contact_data acd ON (u.tsp_id = acd.tsp_id)
        LEFT JOIN bs_candidate_level bs ON (u.tsp_id = bs.candidate_id)
        -- essential skills assessment
        LEFT JOIN
        (SELECT * FROM initial_assessment AS aa1
        WHERE id = (SELECT MAX(id)
        FROM initial_assessment AS aaa1
        WHERE aa1.tsp_id = aaa1.tsp_id)) esa
        ON (u.tsp_id = esa.tsp_id)
        LEFT JOIN user u_esa ON (esa.created_by = u_esa.tsp_id)
        -- foundation training level 1
        LEFT JOIN
        (SELECT * FROM ft_assessment AS aa1
        WHERE id = (SELECT MAX(id)
        FROM ft_assessment AS aaa1
        WHERE aa1.tsp_id = aaa1.tsp_id AND aa1.foundation_training_level=1 AND aaa1.foundation_training_level=1)) fta1
        ON (u.tsp_id = fta1.tsp_id)
        LEFT JOIN user u_fta1 ON (fta1.created_by = u_fta1.tsp_id)
        -- foundation training level 2
        LEFT JOIN
        (SELECT * FROM ft_assessment AS aa1
        WHERE id = (SELECT MAX(id)
        FROM ft_assessment AS aaa1
        WHERE aa1.tsp_id = aaa1.tsp_id AND aa1.foundation_training_level=1 AND aaa1.foundation_training_level=2)) fta2
        ON (u.tsp_id = fta2.tsp_id)
        LEFT JOIN user u_fta2 ON (fta2.created_by = u_fta2.tsp_id)
        -- booking ESA
        LEFT JOIN
        (SELECT m1.*
        FROM bs_booking_status m1 LEFT JOIN bs_booking_status m2
        ON (
          m1.candidate_id = m2.candidate_id 
          AND m1.updated_at < m2.updated_at 
            AND (
              m1.updated_at < m2.updated_at
              OR (m1.updated_at = m2.updated_at AND m1.id < m2.id)
            )
          )
        WHERE m2.id IS NULL AND m1.appointment_type_ref_id = 5) bs_esa
        ON (u.tsp_id = bs_esa.candidate_id)
        -- booking FTA1
        LEFT JOIN
        (SELECT m1.*
        FROM bs_booking_status m1 LEFT JOIN bs_booking_status m2
        ON (
          m1.candidate_id = m2.candidate_id 
          AND m1.updated_at < m2.updated_at 
            AND (
              m1.updated_at < m2.updated_at
              OR (m1.updated_at = m2.updated_at AND m1.id < m2.id)
            )
          )
        WHERE m2.id IS NULL AND m1.appointment_type_ref_id = 6) bs_fta1
        ON (u.tsp_id = bs_fta1.candidate_id)
        -- booking FTA2
        LEFT JOIN
        (SELECT m1.*
        FROM bs_booking_status m1 LEFT JOIN bs_booking_status m2
        ON (
          m1.candidate_id = m2.candidate_id 
          AND m1.updated_at < m2.updated_at 
            AND (
              m1.updated_at < m2.updated_at
              OR (m1.updated_at = m2.updated_at AND m1.id < m2.id)
            )
          )
        WHERE m2.id IS NULL AND m1.appointment_type_ref_id = 7) bs_fta2
        ON (u.tsp_id = bs_fta2.candidate_id)
        

        WHERE u.level = 2
        `;
        */
    const data = details;

    console.log('data', JSON.stringify(data).substring(0, 1000));

    return { success: true, data, count };
  }
}
