import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SessionsForEvaluationService {
  constructor(private prisma: PrismaService) {}

  // **************** Retrieve all sessions with filters and pagination ****************
  async allSessions(params: { skip?: number; take?: number; where: any }) {
    try {
      const { skip, take, where } = params;

      // Determine whether to skip records or not
      if (isNaN(skip)) {
        const maxTime = await this.prisma.sessions_for_evaluation_v3.aggregate({
          _max: { teaching_span: true }
        });
        const total = await this.prisma.sessions_for_evaluation_v3.count({
          where
        });
        // Retrieve data without skipping records
        const data = await this.prisma.sessions_for_evaluation_v3.findMany({
          take,
          where
        });

        // Format and return the result
        return {
          success: true,
          maxTime: Number(maxTime._max.teaching_span),
          total: total,
          data: data.map((item) => {
            return {
              id: Number(item.session_id),
              session_date: item.session_date,
              session_time: item.session_time,
              pupil_id: Number(item.pupil_id),
              pupil_name: item.pupil_name,
              school_id: Number(item.school_id),
              session_id: Number(item.session_id),
              tutor_name: item.tutor_name,
              tutor_id: Number(item.tutor_id),
              tutor_status: item.tutor_status,
              audio_status: item.audio_status,
              redflag: item.redflag,
              type: item.type,
              programme: item.programme,
              learning_objective: item.learning_objective,
              teaching_span: Number(item.teaching_span),
              lo_suitability: item.lo_suitability,
              session_link: item.session_link,
              tutor_centre: item.tutor_centre,
              audio_connection: item.audio_connection,
              work_space_status: item.work_space_status,
              studend_attended: Number(item.studend_attended),
              student_tutor_attended: Number(item.student_tutor_attended),
              tutor_attended: Number(item.tutor_attended),
              session_evaluation_status: item.session_evaluation_status,
              evaluation_id: item.evaluation_id,
              session_investigation_status: item.session_investigation_status,
              investigation_id: item.investigation_id,
              updated_by: item.updated_by,
              updated_at: item.updated_at,
              sis_created_user_id: item.sis_created_user_id,
              ses_created_user_id: item.ses_created_user_id,
              ses_abandon_reason: item.ses_abandon_reason,
              sis_abandon_reason: item.sis_abandon_reason,
              business_unit: item.business_unit,
              batch: item.batch,
              negative_pupil_comments: item.negative_pupil_comments,
              no_learning_happened: item.no_learning_happened,
              year_group: Number(item.year_group),
              student_engagement: item.student_engagement,
              enjoyability: Number(item.enjoyability),
              understandability: Number(item.understandability),
              usefulness: Number(item.usefulness),
              time_lost: item.time_lost,
              s2s_new_content_learnt: item.s2s_new_content_learnt,
              s2s_needs_more_work: item.s2s_needs_more_work,
              s2s_knowledge_reinforced: item.s2s_knowledge_reinforced,
              s2s_not_taught: item.s2s_not_taught
            };
          })
        };
      } else {
        // Retrieve maximum teaching span and total count with skipping records
        const maxTime = await this.prisma.sessions_for_evaluation_v3.aggregate({
          _max: { teaching_span: true }
        });
        const total = await this.prisma.sessions_for_evaluation_v3.count({
          where
        });
        // Retrieve data with skipping records
        const data = await this.prisma.sessions_for_evaluation_v3.findMany({
          skip,
          take,
          where
        });
        // Format and return the result
        return {
          success: true,
          maxTime: Number(maxTime._max.teaching_span),
          total: total,
          data: data.map((item) => {
            return {
              id: Number(item.session_id),
              session_date: item.session_date,
              session_time: item.session_time,
              pupil_id: Number(item.pupil_id),
              pupil_name: item.pupil_name,
              school_id: Number(item.school_id),
              session_id: Number(item.session_id),
              tutor_name: item.tutor_name,
              tutor_id: Number(item.tutor_id),
              tutor_status: item.tutor_status,
              audio_status: item.audio_status,
              redflag: item.redflag,
              type: item.type,
              programme: item.programme,
              learning_objective: item.learning_objective,
              teaching_span: Number(item.teaching_span),
              lo_suitability: item.lo_suitability,
              session_link: item.session_link,
              tutor_centre: item.tutor_centre,
              audio_connection: item.audio_connection,
              work_space_status: item.work_space_status,
              studend_attended: Number(item.studend_attended),
              student_tutor_attended: Number(item.student_tutor_attended),
              tutor_attended: Number(item.tutor_attended),
              session_evaluation_status: item.session_evaluation_status,
              evaluation_id: item.evaluation_id,
              session_investigation_status: item.session_investigation_status,
              investigation_id: item.investigation_id,
              updated_by: item.updated_by,
              updated_at: item.updated_at,
              sis_created_user_id: item.sis_created_user_id,
              ses_created_user_id: item.ses_created_user_id,
              ses_abandon_reason: item.ses_abandon_reason,
              sis_abandon_reason: item.sis_abandon_reason,
              business_unit: item.business_unit,
              batch: item.batch,
              negative_pupil_comments: item.negative_pupil_comments,
              no_learning_happened: item.no_learning_happened,
              year_group: Number(item.year_group),
              student_engagement: item.student_engagement,
              enjoyability: Number(item.enjoyability),
              understandability: Number(item.understandability),
              usefulness: Number(item.usefulness),
              time_lost: item.time_lost,
              s2s_new_content_learnt: item.s2s_new_content_learnt,
              s2s_needs_more_work: item.s2s_needs_more_work,
              s2s_knowledge_reinforced: item.s2s_knowledge_reinforced,
              s2s_not_taught: item.s2s_not_taught
            };
          })
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for tutor details by name ****************
  async getTuterDetailsBySearchingName(params: string) {
    const filter = params;

    try {
      // Retrieve distinct tutor names and corresponding tutor IDs
      const users = await this.prisma.sessions_for_evaluation_v3.findMany({
        where: {
          tutor_name: {
            contains: filter
          }
        },
        distinct: ['tutor_name'],
        select: {
          tutor_id: true,
          tutor_name: true
        }
      });
      // Map and format the result
      const data = users.map((key) => {
        return {
          tspId: Number(key.tutor_id),
          name: key.tutor_name
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for audio status ****************
  async getAudioStatus(params: string) {
    const filter = params;

    try {
      // Retrieve distinct audio statuses
      const result = await this.prisma.sessions_for_evaluation_v3.findMany({
        where: {
          audio_status: {
            contains: filter
          }
        },
        distinct: ['audio_status'],
        select: {
          audio_status: true
        }
      });
      // Map and format the result
      const data = result.map((key) => {
        return {
          name: key.audio_status
        };
      });
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for red flag ****************
  async getRedflag(params: string) {
    const filter = params;
    try {
      // Retrieve distinct red flags
      const result = await this.prisma.sessions_for_evaluation_v3.findMany({
        where: {
          redflag: {
            contains: filter
          }
        },
        distinct: ['redflag'],
        select: {
          redflag: true
        }
      });
      // Map and format the result
      const data = result.map((key) => {
        return {
          name: key.redflag
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for session type ****************
  async getType(params: string) {
    const filter = params;

    try {
      // Retrieve distinct session types
      const result = await this.prisma.sessions_for_evaluation_v3.findMany({
        where: {
          type: {
            contains: filter
          }
        },
        distinct: ['type'],
        select: {
          type: true
        }
      });
      // Map and format the result
      const data = result.map((key) => {
        return {
          name: key.type
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for programmes ****************
  async getProgrammes(params: string) {
    const filter = params;

    try {
      // Retrieve distinct programmes
      const result = await this.prisma.sessions_for_evaluation_v3.findMany({
        where: {
          programme: {
            contains: filter
          }
        },
        distinct: ['programme'],
        select: {
          programme: true
        }
      });
      // Map and format the result
      const data = result.map((key) => {
        return {
          name: key.programme
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for learning objectives ****************
  async getLearningObjective(params: string) {
    const filter = params;
    try {
      // Retrieve distinct learning objectives
      const result = await this.prisma.sessions_for_evaluation_v3.findMany({
        where: {
          learning_objective: {
            contains: filter
          }
        },
        distinct: ['learning_objective'],
        select: {
          learning_objective: true
        }
      });
      // Map and format the result
      const data = result.map((key) => {
        return {
          name: key.learning_objective
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for Tutor ID ****************
  async getTutorID(filter: number) {
    try {
      // Retrieve distinct tutor IDs using raw SQL query
      const result = await this.prisma
        .$queryRaw`SELECT  DISTINCT tutor_id FROM sessions_for_evaluation_v3 WHERE tutor_id LIKE ${
        filter + '%'
      };`;
      // Map and format the result
      const data = (result as unknown as any[]).map((key) => {
        return {
          tspId: Number(key.tutor_id),
          name: key.tutor_id + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for School ID ****************
  async getSchoolID(filter: number) {
    try {
      // Retrieve distinct school IDs using raw SQL query
      const result = await this.prisma
        .$queryRaw`SELECT  DISTINCT school_id FROM sessions_for_evaluation_v3 WHERE school_id LIKE ${
        filter + '%'
      };`;
      // Map and format the result
      const data = (result as unknown as any[]).map((key) => {
        return {
          tspId: Number(key.school_id),
          name: key.school_id + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for LO Suitability ****************
  async getLOSuitability(filter: number) {
    try {
      // Retrieve distinct LO Suitability values using raw SQL query
      const result = await this.prisma
        .$queryRaw`SELECT  DISTINCT lo_suitability FROM sessions_for_evaluation_v3 WHERE lo_suitability LIKE ${
        filter + '%'
      };`;
      // Map and format the result
      const data = (result as unknown as any[]).map((key) => {
        return {
          tspId: Number(key.lo_suitability),
          name: key.lo_suitability + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for Pupil ID ****************
  async getPupilID(filter: number) {
    try {
      // Retrieve distinct Pupil IDs using raw SQL query
      const result = await this.prisma
        .$queryRaw`SELECT  DISTINCT pupil_id FROM sessions_for_evaluation_v3 WHERE pupil_id LIKE ${
        filter + '%'
      };`;
      // Map and format the result
      const data = (result as unknown as any[]).map((key) => {
        return {
          tspId: Number(key.pupil_id),
          name: key.pupil_id + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Search for Session ID ****************
  async getSessionID(filter: number) {
    try {
      // Retrieve distinct Session IDs using raw SQL query
      const result = await this.prisma
        .$queryRaw`SELECT  DISTINCT session_id FROM sessions_for_evaluation_v3 WHERE session_id LIKE ${
        filter + '%'
      };`;
      // Map and format the result
      const data = (result as unknown as any[]).map((key) => {
        return {
          tspId: Number(key.session_id),
          name: key.session_id + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
