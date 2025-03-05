import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionEvaluationDto } from './dto/create-session-evaluation.dto';
import { Moment } from 'moment';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
import { CreateReadSessionEvaluationDatumDto } from './dto/create-read-session-evaluation-datum.dto';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';
import { NewEmailService } from '../new-email/new-email.service';
import { v4 as uuidv4 } from 'uuid';
import {
  UpdateSessionEvaluationDto,
  UpdateEditableCountDto
} from './dto/update-session-evaluation.dto';

import { DeleteSessionStatusDto } from './dto/SessionEvaluationTable.dto';

@Injectable()
export class SessionEvaluationService {
  constructor(
    private prisma: PrismaService,
    private newMailService: NewEmailService
  ) {}

  // fetch all the session evaluation data from the db.
  findAll() {
    return this.prisma.sesRevampEvaluation.findMany();
  }

  // Update ticket form fields to the db table.
  async updateSessionEvaluation(updateDto: UpdateSessionEvaluationDto) {
    try {
      const evaluatedSessionList = updateDto.evaluatedSessionList; // seperately getting the evaluated session list data from the DTO.
      const sessionList = [];
      if (evaluatedSessionList) {
        // Prepare the evaluated session list data to for the UPSERT function to store in the db --- START
        evaluatedSessionList.map((list) => {
          const obj = {
            create: {
              session_id: list.sessionId,
              evaluation_session_status: list.evaluationSessionStatus,
              evaluation_session_comment: list.evaluationSessionComment,
              lo_evaluated: list.loEvaluated,
              evaluation_session_rating: list.evaluationSessionRating
                ? list.evaluationSessionRating.join()
                : '',
              pupilsProgress: list.pupilsProgress,
              date_time: list.sessionDate,
              pupil_name: list.pupilName,
              pupil_id: list.pupilId,
              sess_eval_id: list.sessionId + '-' + updateDto.evaluationId,
              created_at: new Date(),
              created_by: updateDto.updatedBy,
              updated_at: new Date(),
              updated_by: updateDto.updatedBy
            },
            update: {
              session_id: list.sessionId,
              evaluation_session_status: list.evaluationSessionStatus,
              evaluation_session_comment: list.evaluationSessionComment,
              lo_evaluated: list.loEvaluated,
              evaluation_session_rating: list.evaluationSessionRating
                ? list.evaluationSessionRating.join()
                : '',
              pupilsProgress: list.pupilsProgress,
              date_time: list.sessionDate,
              pupil_name: list.pupilName,
              pupil_id: list.pupilId,
              sess_eval_id: list.sessionId + '-' + updateDto.evaluationId,
              updated_at: new Date(),
              updated_by: updateDto.updatedBy
            },
            where: {
              sess_eval_id: list.sessionId + '-' + updateDto.evaluationId
            }
          };
          sessionList.push(obj);
        });
        // Prepare the evaluated session list data to for the UPSERT function to store in the db --- END
      }

      const newFocusAreas = updateDto.focusAreasFromThisSession; // seperately getting the new focus area data from the DTO.
      const newFocusList = [];

      // Arrange new focus area data to the UPSERT function ---- START
      if (newFocusAreas) {
        newFocusAreas.map((area) => {
          const obj = {
            create: {
              id: area.id,
              type: 'Targets',
              pillar: area.pillar,
              criteria: area.criteria,
              comment1: area.comment1,
              created_at: new Date(),
              created_by: updateDto.updatedBy,
              updated_at: new Date(),
              updated_by: updateDto.updatedBy
            },
            update: {
              pillar: area.pillar,
              criteria: area.criteria,
              comment1: area.comment1,
              updated_at: new Date(),
              updated_by: updateDto.updatedBy
            },
            where: { id: area.id }
          };
          newFocusList.push(obj);
        });
      }
      // Arrange new focus area data to the UPSERT function ---- END

      const positiveStrengths = updateDto.positiveActions; // seperately getting the positive strength data from the DTO.
      const strengthList = [];

      // arrange the positive strength data to store in the db --- START
      if (positiveStrengths) {
        positiveStrengths.map((str) => {
          const obj = {
            where: { id: str.id },
            create: {
              id: str.id,
              type: 'Strength',
              pillar: str.pillar,
              criteria: str.criteria,
              comment1: str.comment1,
              created_at: new Date(),
              created_by: updateDto.updatedBy,
              updated_at: new Date(),
              updated_by: updateDto.updatedBy
            },
            update: {
              pillar: str.pillar,
              criteria: str.criteria,
              comment1: str.comment1,
              updated_at: new Date(),
              updated_by: updateDto.updatedBy
            }
          };
          strengthList.push(obj);
        });
      }
      // arrange the positive strength data to store in the db --- END

      // main update function for the update evaluation data.
      const updatedData = await this.prisma.sesRevampEvaluation.update({
        where: {
          evaluation_id: updateDto.evaluationId
        },
        data: {
          cumulative_rating: updateDto.cumulativeRating
            ? updateDto.cumulativeRating.join()
            : '',
          overall_evaluation_status: updateDto.overallEvaluationStatus,
          evaluation_status: updateDto.evaluationStatus,
          other_comments: updateDto.otherComment,
          updated_by: updateDto.updatedBy,
          submitted_at: null,
          submitted_by: null,
          updated_at: new Date(),
          sesRevampEvaluationDetail: {
            upsert: {
              create: {
                reason_for_evaluation: updateDto.reasonForEvaluation,
                feedback_attendance: updateDto.feedbackAttendance,
                quality_refl_notes: updateDto.tutorReflection,
                tutor_comm_skill: updateDto.tutorSkill,
                tutor_comm_skill_comm: updateDto.tutorSkillComm,
                tutor_effort: updateDto.tutorEffort,
                tutor_mindset: updateDto.tutorMindset,
                tutor_mindset_comment: updateDto.tutorMindsetComm,
                link_to_feedback_call: updateDto.linkToFeedbackCall,
                feedback_date: updateDto.feedbackDate
                  ? new Date(updateDto.feedbackDate)
                  : null,
                sr_completion: updateDto.sRCompletion,
                comment_reflection: updateDto.commentsOnReflectionOrFeedback,
                created_at: new Date(),
                created_by: updateDto.updatedBy,
                updated_at: new Date(),
                updated_by: updateDto.updatedBy
              },
              update: {
                reason_for_evaluation: updateDto.reasonForEvaluation,
                feedback_attendance: updateDto.feedbackAttendance,
                quality_refl_notes: updateDto.tutorReflection,
                tutor_comm_skill: updateDto.tutorSkill,
                tutor_comm_skill_comm: updateDto.tutorSkillComm,
                tutor_effort: updateDto.tutorEffort,
                tutor_mindset: updateDto.tutorMindset,
                tutor_mindset_comment: updateDto.tutorMindsetComm,
                link_to_feedback_call: updateDto.linkToFeedbackCall,
                feedback_date: updateDto.feedbackDate
                  ? new Date(updateDto.feedbackDate)
                  : null,
                sr_completion: updateDto.sRCompletion,
                comment_reflection: updateDto.commentsOnReflectionOrFeedback,
                updated_at: new Date(),
                updated_by: updateDto.updatedBy
              }
            }
          },
          sesRevampSessionEvaluation: {
            upsert: sessionList
          },
          sesRevampTarget: {
            upsert: [...newFocusList, ...strengthList]
          }
        },
        include: {
          sesRevampEvaluationDetail: true,
          sesRevampTarget: true,
          sesRevampSessionEvaluation: true,
          sesRevampTimespans: true
        }
      });

      // eslint-disable-next-line no-constant-condition
      if (true) {
        // Update previous evaluation focus area details
        const previousFocusAreas = updateDto.previousSEFocusAreas; // seperately getting the previous focus area data from the DTO.

        // arrange the data and store to the db one by one.
        if (previousFocusAreas) {
          previousFocusAreas.map((area) => {
            const idArr = area.id.split('-');
            const obj = {
              status: area.status,
              comment2: area.comment2
            };
            if (idArr[0] === 'TAR') {
              this.updatePreviousTargetOldTable(area.id, obj); // call the function to update previous target in the old table.
            } else {
              this.updatePreviousTarget(area.id, obj); // call the function to update previous target in the table.
            }
          });
        }
        // insert or update the timespans once parent data is upserted.
        evaluatedSessionList.map((list) => {
          const timspanList = list.timeSlider;
          const sessionTimespans = [];
          timspanList.map((ts) => {
            const tsObj = {
              create: {
                id: ts.id,
                evaluation_id: updateDto.evaluationId,
                session_id: list.sessionId,
                from_time: ts.range.toString(),
                to_time: 'ts.to',
                created_at: new Date(),
                created_by: updateDto.updatedBy,
                updated_at: new Date(),
                updated_by: updateDto.updatedBy
              },
              update: {
                evaluation_id: updateDto.evaluationId,
                session_id: list.sessionId,
                from_time: ts.range.toString(),
                to_time: 'ts.to',
                updated_at: new Date(),
                updated_by: updateDto.updatedBy
              },
              where: { id: ts.id }
            };
            sessionTimespans.push(tsObj);
          });

          // call the different function to update these timespans.
          this.updatedOrInsertTimspan(
            list.sessionId + '-' + updateDto.evaluationId,
            sessionTimespans
          );
        });
        return {
          success: true,
          status: 200,
          data: updatedData
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  // update function for the times span seperately defined.
  async updatedOrInsertTimspan(parentId: string, timesArrayList: any) {
    await this.prisma.sesRevampSessionEvaluation.update({
      where: {
        sess_eval_id: parentId
      },
      data: {
        sesRevampTimespans: {
          upsert: timesArrayList
        }
      }
    });
  }

  // define the seperate function to update the previous target to the new table.
  async updatePreviousTarget(id: string, obj: any) {
    await this.prisma.sesRevampTarget.update({
      where: { id: id },
      data: {
        status: obj.status,
        comment2: obj.comment2,
        updated_at: new Date()
      }
    });
  }

  // define the seperate function to update the previous target to the old table.
  async updatePreviousTargetOldTable(id: string, obj: any) {
    await this.prisma.sd_new_targets.update({
      where: { target_id: id },
      data: {
        status: obj.status,
        comment_2: obj.comment2,
        updated_at: new Date()
      }
    });
  }

  // session evaluation status updating function.
  async updateEvaluationStatus(updateSessionStatusUpdate: any) {
    try {
      //------------------------------------------------
      const editable = await this.prisma.sesRevampEvaluation.findUnique({
        where: {
          evaluation_id: updateSessionStatusUpdate.evaluationId
        },
        select: {
          editable_count: true
        }
      });
      let data1 = {};
      const commonData = {
        evaluation_status: updateSessionStatusUpdate.evaluationStatus,
        updated_at: new Date()
      };
      if (updateSessionStatusUpdate.evaluationStatus === 4) {
        data1 = {
          ...commonData,
          submitted_at: new Date(),
          submitted_by: 0
        };
      } else if (updateSessionStatusUpdate.evaluationStatus === 3) {
        data1 = {
          ...commonData,
          ...(editable.editable_count === 0 && { completed_at: new Date() }),
          edited_at: new Date()
        };
      } else {
        data1 = commonData;
      }

      const updatedData = await this.prisma.sesRevampEvaluation.update({
        where: {
          evaluation_id: updateSessionStatusUpdate.evaluationId
        },
        data: data1
      });
      //------------------------------------------------
      let data2 = {};
      if (updateSessionStatusUpdate.evaluationStatus === 5) {
        data2 = {
          session_evaluation_status: updateSessionStatusUpdate.evaluationStatus,
          ses_abandon_reason: updateSessionStatusUpdate.abandonReason
        };
      } else {
        data2 = {
          session_evaluation_status: updateSessionStatusUpdate.evaluationStatus
        };
      }
      // update sessions_for_evaluation_v3 table's session_evaluation_status
      await this.prisma.sessions_for_evaluation_v3.updateMany({
        where: {
          evaluation_id: updateSessionStatusUpdate.evaluationId
        },
        data: data2
      });
      //------------------------------------------------
      //If only Abandon Session - Delete all sessions and it's timespans related to sessions
      //Delete timespnas
      if (updateSessionStatusUpdate.evaluationStatus === 5) {
        const deleteSpans = await this.prisma.sesRevampTimespans.deleteMany({
          where: {
            evaluation_id: updateSessionStatusUpdate.evaluationId
          }
        });
        if (deleteSpans) {
          //Delete session
          const result =
            await this.prisma.sesRevampSessionEvaluation.deleteMany({
              where: {
                evaluation_id: updateSessionStatusUpdate.evaluationId
              }
            });
        }
      }

      //------------------------------------------------
      return {
        success: true,
        data: updatedData
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  // update editable count of the session evaluation
  async updateEditableCount(updateEditableCount: UpdateEditableCountDto) {
    try {
      const existingRecord = await this.prisma.sesRevampEvaluation.findUnique({
        where: {
          evaluation_id: updateEditableCount.evaluationId
        },
        select: {
          editable_count: true
        }
      });
      let editCount = 3;
      if (existingRecord.editable_count < 3) {
        editCount = existingRecord.editable_count + 1;
      }
      const updatedRecord = await this.prisma.sesRevampEvaluation.update({
        where: {
          evaluation_id: updateEditableCount.evaluationId
        },
        data: {
          editable_count: editCount,
          updated_at: new Date()
        }
      });
      return updatedRecord;
    } catch (error) {
      throw new Error(error);
    }
  }

  //---------------------------------------------

  //Get Relevant User by Id Service
  async getSessionEvaluationDataService(
    evaluationData: CreateReadSessionEvaluationDatumDto
  ) {
    try {
      // get the data by passing the evaluation id.
      const data: any = await this.prisma.sesRevampEvaluation.findMany({
        where: {
          evaluation_id: evaluationData.evaluationId
        },
        select: {
          overall_evaluation_status: true,
          evaluation_status: true,
          notify_email_sent_at: true,
          other_comments: true,
          cumulative_rating: true,
          editable_count: true,
          created_by: true,
          sesRevampEvaluationDetail: {
            select: {
              reason_for_evaluation: true,
              link_to_feedback_call: true,
              feedback_attendance: true,
              feedback_date: true,
              sr_completion: true,
              comment_reflection: true,
              quality_refl_notes: true,
              tutor_comm_skill: true,
              tutor_comm_skill_comm: true,
              tutor_effort: true,
              tutor_mindset: true,
              tutor_mindset_comment: true
            }
          },
          sesRevampSessionEvaluation: {
            include: {
              sesRevampTimespans: true
            }
          }
        }
      });

      //Get previous Focus area from New Tables--------------------START-------------------
      const result = await this.prisma.$queryRaw(
        Prisma.sql`SELECT MAX(sd.evaluation_id) AS evaluation_id FROM ses_revamp_session_evaluation sd
       JOIN (SELECT evaluation_id, tutor_id FROM ses_revamp_evaluation WHERE tutor_id = ${evaluationData.tutorId} AND evaluation_status = 4 AND template_id = 1 AND evaluation_id < ${evaluationData.evaluationId}) sre ON sd.evaluation_id = sre.evaluation_id
       JOIN (SELECT session_id, type, tutor_id FROM sessions_for_evaluation_v3 WHERE type = ${evaluationData.type} AND tutor_id = ${evaluationData.tutorId}) se ON sd.session_id = se.session_id;`
      );

      const previousEvaluationId = result[0].evaluation_id;
      let previousFocusAreasData: any = [];
      if (previousEvaluationId) {
        previousFocusAreasData = await this.prisma.sesRevampTarget.findMany({
          where: {
            type: 'Targets',
            evaluation_id: previousEvaluationId
          },
          select: {
            id: true,
            pillar: true,
            criteria: true,
            comment1: true,
            comment2: true,
            status: true
          }
        });
      }
      //--------------------END-------------------

      // Fetch the focus areas from this session data ---- START
      const focusAreasFromThisSessionData =
        await this.prisma.sesRevampEvaluation.findUnique({
          where: {
            evaluation_id: evaluationData.evaluationId
          },
          select: {
            sesRevampTarget: {
              select: {
                id: true,
                pillar: true,
                criteria: true,
                comment1: true,
                comment2: true,
                status: true
              },
              where: {
                type: 'Targets'
              }
            }
          }
        });
      // Fetch the focus areas from this session data ---- END

      // Fetch the positive action data --- START
      const positiveActionsData =
        await this.prisma.sesRevampEvaluation.findUnique({
          where: {
            evaluation_id: evaluationData.evaluationId
          },
          select: {
            sesRevampTarget: {
              where: {
                type: 'strength'
              },
              select: {
                id: true,
                pillar: true,
                criteria: true,
                comment1: true
              }
            }
          }
        });
      // Fetch the positive action data --- END

      // arranging the time slider times ---- START
      const sessionIds = [];
      const sessionsNew = [];
      const sessions = data[0].sesRevampSessionEvaluation;
      for (let i = 0; i < sessions.length; i++) {
        const evaluationSessionRatingNew =
          sessions[i].evaluation_session_rating.split(',');

        const timeSliders = [];
        if (sessions[i].sesRevampTimespans.length !== 0) {
          sessions[i].sesRevampTimespans.map((slider: any) => {
            const sliderNew = {
              id: slider.id,
              range: slider.from_time.split(',')
            };
            timeSliders.push(sliderNew);
          });
        } else {
          timeSliders.push({
            id: '1-' + uuid().slice(0, 8),
            range: ['000', '000']
          });

          timeSliders.push({
            id: '2-' + uuid().slice(0, 8),
            range: ['000', '000']
          });

          timeSliders.push({
            id: '3-' + uuid().slice(0, 8),
            range: ['000', '000']
          });
        }
        // arranging the time slider times ---- END

        const obj = {
          sessionId: sessions[i].session_id,
          loEvaluated: sessions[i].lo_evaluated ? sessions[i].lo_evaluated : '',
          evaluationSessionStatus: sessions[i].evaluation_session_status
            ? sessions[i].evaluation_session_status
            : 0,
          evaluationSessionComment: sessions[i].evaluation_session_comment
            ? sessions[i].evaluation_session_comment
            : '',
          pupilsProgress: sessions[i].pupilsProgress
            ? sessions[i].pupilsProgress
            : '',
          programme: sessions[i].programme ? sessions[i].programme : '',
          pupilName: sessions[i].pupil_name ? sessions[i].pupil_name : '',
          pupilId: sessions[i].pupil_id ? sessions[i].pupil_id : 0,
          sessionDate: sessions[i].date_time ? sessions[i].date_time : '',
          evaluationSessionRating: evaluationSessionRatingNew,
          timeSlider: timeSliders,
          simsRaise: sessions[i].simsRaise
        };
        sessionsNew.push(obj);
        sessionIds.push(sessions[i].session_id);
      }

      const sessionIdsStr = sessionIds.join(',');

      const query: any =
        'SELECT * FROM sessions_for_evaluation_v3 se WHERE se.session_id IN (' +
        sessionIdsStr +
        ') ORDER BY FIELD(se.session_id,' +
        sessionIdsStr +
        ')';

      const responseArray = await this.prisma.$queryRawUnsafe(query);

      // Get the tutor's tsp id by passing their tutor id.
      const tslResponse: any = await this.prisma.tslUser.findFirst({
        where: {
          tsl_id: evaluationData.tutorId
        },
        select: {
          tsp_id: true
        }
      });

      // get the tutor's email address by passing tutor's tsp id.
      let approvedContactDataResponse = null;
      if (tslResponse) {
        approvedContactDataResponse =
          await this.prisma.approvedContactData.findFirst({
            where: {
              tspId: tslResponse.tsp_id
            },
            select: {
              workEmail: true
            }
          });
      }

      //Get tutor id accourding to tutorCentre
      const tutorEmail: any = approvedContactDataResponse
        ? approvedContactDataResponse.workEmail
        : 'productdevelopment@thirdspaceglobal.com';

      //get created user
      let responseNonTutor = null;
      if (data) {
        responseNonTutor = await this.prisma.nonTutorDirectory.findFirst({
          where: {
            hr_tsp_id: data[0].created_by
          },
          select: {
            short_name: true
          }
        });
      }

      const user = {
        name: responseNonTutor
          ? // eslint-disable-next-line no-prototype-builtins
            responseNonTutor.hasOwnProperty('short_name')
            ? responseNonTutor.short_name
            : ''
          : ''
      };

      // arrange the data to pass to the frontend.
      const obj = {
        user: user,
        notifyEmailSentAt: data[0].notify_email_sent_at,
        tutorEmail: tutorEmail,
        rawSessions: responseArray,
        cumulativeRating: data[0].cumulative_rating
          ? data[0].cumulative_rating.split(',')
          : [],
        overallEvaluationStatus: data[0].overall_evaluation_status
          ? data[0].overall_evaluation_status
          : '',
        evaluationStatus: data[0].evaluation_status,
        // emailFlag: data[0].email_flag,
        reasonForEvaluation: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.reason_for_evaluation
          : '',
        linkToFeedbackCall: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.link_to_feedback_call
          : '',
        feedbackAttendance: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.feedback_attendance
          : '',
        tutorEffort: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.tutor_effort
          : '',
        tutorMindset: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.tutor_mindset
          : '',
        tutorMindsetComm: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.tutor_mindset_comment
          : '',
        tutorSkill: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.tutor_comm_skill
          : '',
        tutorSkillComm: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.tutor_comm_skill_comm
          : '',
        qualityReflection: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.quality_refl_notes
          : '',
        feedbackDate: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.feedback_date
          : '',
        sRCompletion: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.sr_completion
          : '',
        commentsOnReflectionOrFeedback: data[0].sesRevampEvaluationDetail
          ? data[0].sesRevampEvaluationDetail.comment_reflection
          : '',
        otherComment: data[0].other_comments ? data[0].other_comments : '',
        editableCount: data[0].editable_count ? data[0].editable_count : 0,
        evaluatedSessionList:
          data[0].sesRevampSessionEvaluation.length !== 0
            ? sessionsNew
            : [
                {
                  sessionId: 0,
                  loEvaluated: '',
                  evaluationSessionStatus: 2,
                  evaluationSessionComment: '',
                  evaluationSessionRating: [
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    ''
                  ],
                  pupilsProgress: '',
                  timeSlider: [
                    {
                      id: '1-' + uuid().slice(0, 8),
                      range: ['000', '000']
                    },
                    {
                      id: '2-' + uuid().slice(0, 8),
                      range: ['000', '000']
                    },
                    {
                      id: '3-' + uuid().slice(0, 8),
                      range: ['000', '000']
                    }
                  ]
                }
              ],
        previousFocusAreas:
          previousFocusAreasData.length !== 0 ? previousFocusAreasData : [],
        focusAreasFromThisSession:
          focusAreasFromThisSessionData.sesRevampTarget.length !== 0
            ? focusAreasFromThisSessionData.sesRevampTarget
            : [
                {
                  id: '1-' + uuid().slice(0, 8),
                  pillar: '',
                  criteria: '',
                  comment1: ''
                },
                {
                  id: '2-' + uuid().slice(0, 8),
                  pillar: '',
                  criteria: '',
                  comment1: ''
                },
                {
                  id: '3-' + uuid().slice(0, 8),
                  pillar: '',
                  criteria: '',
                  comment1: ''
                }
              ],
        positiveActions:
          positiveActionsData.sesRevampTarget.length !== 0
            ? positiveActionsData.sesRevampTarget
            : [
                {
                  id: '1-' + uuid().slice(0, 8),
                  pillar: '',
                  criteria: '',
                  comment1: ''
                },
                {
                  id: '2-' + uuid().slice(0, 8),
                  pillar: '',
                  criteria: '',
                  comment1: ''
                },
                {
                  id: '3-' + uuid().slice(0, 8),
                  pillar: '',
                  criteria: '',
                  comment1: ''
                }
              ]
      };

      return {
        success: true,
        data: obj
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get filtered session data for the session note table - Service
  async allSessions(params: { skip?: number; take?: number; where: any }) {
    try {
      const { skip, take, where } = params;

      if (isNaN(skip)) {
        const maxTime = await this.prisma.sessions_for_evaluation_v3.aggregate({
          _max: { teaching_span: true }
        });
        const total = await this.prisma.sessions_for_evaluation_v3.count({
          where
        });
        const data = await this.prisma.sessions_for_evaluation_v3.findMany({
          take,
          where
        });

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
              updated_by: item.updated_by,
              updated_at: item.updated_at
            };
          })
        };
      } else {
        const maxTime = await this.prisma.sessions_for_evaluation_v3.aggregate({
          _max: { teaching_span: true }
        });
        const total = await this.prisma.sessions_for_evaluation_v3.count({
          where
        });
        const data = await this.prisma.sessions_for_evaluation_v3.findMany({
          skip,
          take,
          where
        });

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
              updated_by: item.updated_by,
              updated_at: item.updated_at
            };
          })
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // fetch the data for pdf generation
  async getDataForPdf(data1: any) {
    try {
      const data = await this.prisma.sesRevampEvaluation.findUnique({
        where: {
          evaluation_id: data1.evaluationId
        },
        select: {
          overall_evaluation_status: true,
          evaluation_status: true,
          other_comments: true,
          cumulative_rating: true,
          tutor_id: true,
          sesRevampEvaluationDetail: {
            select: {
              reason_for_evaluation: true,
              link_to_feedback_call: true,
              feedback_attendance: true,
              feedback_date: true,
              sr_completion: true,
              comment_reflection: true
            }
          },
          sesRevampSessionEvaluation: {
            include: {
              sesRevampTimespans: true
            }
          }
        }
      });

      // change the date format
      const objectDate = new Date(data.sesRevampEvaluationDetail.feedback_date);
      const day = objectDate.getDate();
      const month = objectDate.getMonth() + 1;
      const year = objectDate.getFullYear();
      // ------------------------

      const sessionDetail = {
        ...data.sesRevampEvaluationDetail,
        feedback_date: `${day}/${month}/${year}`
      };

      // session evaluation list
      const sessionListArr: any = [];
      const sessionEvaluationList = data.sesRevampSessionEvaluation;
      let singleSessionId: number;
      sessionEvaluationList.map((el, index) => {
        const timeSpan = el.sesRevampTimespans;
        const setOfTimes = [];
        timeSpan.map((ele) => {
          const fromTimes = this.fmtMSS(ele.from_time.split(','));
          setOfTimes.push(fromTimes);
        });
        const obj = {
          title: `${this.ordinal_suffix_of(index + 1)} Session Evaluated`,
          sessionId: el.session_id,
          timing: this.returnTimespans(setOfTimes)
        };
        sessionListArr.push(obj);
        singleSessionId = el.session_id;
      });

      const tutorId = data.tutor_id;
      const v3TableDetail =
        await this.prisma.sessions_for_evaluation_v3.findUnique({
          where: {
            session_id: singleSessionId
          },
          select: {
            type: true,
            tutor_name: true,
            ses_created_user_id: true
          }
        });

      let evaluatedUser: any = '';
      if (v3TableDetail.ses_created_user_id) {
        // Get evaluator's name
        evaluatedUser =
          await this.prisma.laravel_master_directory_v2.findUnique({
            where: {
              hr_tsp_id: v3TableDetail.ses_created_user_id
            },
            select: {
              short_name: true
            }
          });
      }

      //Get previous Focus area from New Tables--------------------START-------------------

      const result = await this.prisma.$queryRaw(
        Prisma.sql`SELECT MAX(sd.evaluation_id) AS evaluation_id FROM ses_revamp_session_evaluation sd
       JOIN (SELECT evaluation_id, tutor_id FROM ses_revamp_evaluation WHERE tutor_id = ${data1.tutorId} AND evaluation_status = 4 AND template_id = 1 AND evaluation_id < ${data1.evaluationId}) sre ON sd.evaluation_id = sre.evaluation_id
       JOIN (SELECT session_id, type, tutor_id FROM sessions_for_evaluation_v3 WHERE type = ${data1.type} AND tutor_id = ${data1.tutorId}) se ON sd.session_id = se.session_id;`
      );

      console.log(
        'previousEvaluationId New= ' + JSON.stringify(result[0].evaluation_id)
      );

      const previousEvaluationId = result[0].evaluation_id;
      console.log('data222');
      let previousFocusAreasData: any = [];
      if (previousEvaluationId) {
        previousFocusAreasData = await this.prisma.sesRevampTarget.findMany({
          where: {
            type: 'Targets',
            evaluation_id: previousEvaluationId
          },
          select: {
            id: true,
            pillar: true,
            criteria: true,
            comment1: true,
            comment2: true,
            status: true
          }
        });
      }

      //--------------------END-------------------

      // positive actions
      const positiveActionsData =
        await this.prisma.sesRevampEvaluation.findUnique({
          where: {
            evaluation_id: data1.evaluationId
          },
          select: {
            sesRevampTarget: {
              where: {
                type: 'strength'
              },
              select: {
                id: true,
                pillar: true,
                criteria: true,
                comment1: true
              }
            }
          }
        });

      // focus areas from this session
      const focusAreasFromThisSessionData =
        await this.prisma.sesRevampEvaluation.findUnique({
          where: {
            evaluation_id: data1.evaluationId
          },
          select: {
            sesRevampTarget: {
              select: {
                id: true,
                pillar: true,
                criteria: true,
                comment1: true,
                comment2: true,
                status: true
              },
              where: {
                type: 'Targets'
              }
            }
          }
        });

      return {
        all_data: {
          ...data,
          tutor_name: v3TableDetail.tutor_name,
          evaluator_name: evaluatedUser ? evaluatedUser.short_name : ''
        },
        session_detail: sessionDetail,
        session_timings: sessionListArr,
        previous_focus_areas: previousFocusAreasData,
        positive_actions: positiveActionsData.sesRevampTarget,
        focus_areas_from_this_session:
          focusAreasFromThisSessionData.sesRevampTarget
      };
    } catch (error) {
      console.log(error);
    }
  }

  // generate pdf
  async generateReportPdf(data: any) {
    try {
      const getSessionByEvalId =
        await this.prisma.sessions_for_evaluation_v3.findFirst({
          where: {
            evaluation_id: data.evalId
          }
        });

      const response = await this.newMailService.submitTutorMailService(
        data.evalId,
        data.subject,
        data.email,
        data.emailAc,
        getSessionByEvalId.tutor_name,
        data.evalId.toString(),
        data.type,
        data.tutorId
      );

      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // add suffix for the number values. Ex: 1st, 2nd, 3rd and 4th...
  ordinal_suffix_of = (i: number) => {
    const j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + 'st';
    }
    if (j == 2 && k != 12) {
      return i + 'nd';
    }
    if (j == 3 && k != 13) {
      return i + 'rd';
    }
    return i + 'th';
  };

  fmtMSS = (arr: any) => {
    const time = [];
    arr.forEach((s) => {
      time.push((s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s);
    });
    return time.join(' - ');
  };

  // join the timespan value according to the frontend need.
  returnTimespans = (arr: any) => {
    if (arr.length === 1) return arr[0];
    const firsts = arr.slice(0, arr.length - 1);
    const last = arr[arr.length - 1];
    return firsts.join(', ') + ' and ' + last;
  };

  //Create an Evaluation Initially Service
  async createEvaluationService(evaluationData: any) {
    try {
      const data = await this.prisma.sesRevampEvaluation.create({
        data: {
          tutor_id: evaluationData.tutorId,
          template_id: evaluationData.templateId,
          created_at: moment().format(),
          created_by: evaluationData.createdBy,
          updated_by: evaluationData.updatedBy
        }
      });

      const timeSpanList = [];

      const obj1 = {
        id: '1-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: data.evaluation_id,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.createdBy,
        updated_at: new Date(),
        updated_by: evaluationData.updatedBy
      };

      const obj2 = {
        id: '2-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: data.evaluation_id,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.createdBy,
        updated_at: new Date(),
        updated_by: evaluationData.updatedBy
      };

      const obj3 = {
        id: '3-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: data.evaluation_id,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.createdBy,
        updated_at: new Date(),
        updated_by: evaluationData.updatedBy
      };

      timeSpanList.push(obj1);
      timeSpanList.push(obj2);
      timeSpanList.push(obj3);

      const data2 = await this.prisma.sesRevampSessionEvaluation.create({
        data: {
          session_id: evaluationData.sessionId,
          pupil_name: evaluationData.pupilName,
          programme: evaluationData.programme,
          evaluation_id: data.evaluation_id,
          pupil_id: evaluationData.pupilId,
          evaluation_session_rating: ',,,,,,,,,,,',
          date_time: new Date(evaluationData.sessionDate),
          sess_eval_id: evaluationData.sessionId + '-' + data.evaluation_id,
          created_at: new Date(),
          created_by: evaluationData.createdBy,
          updated_at: new Date(),
          updated_by: evaluationData.updatedBy,
          sesRevampTimespans: {
            createMany: { data: timeSpanList }
          }
        }
      });
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  //Update Session table status service
  async updateSessionEvaluationStatusService(updateData: any) {
    try {
      const updateUser = await this.prisma.sessions_for_evaluation_v3.update({
        where: {
          session_id: Number(updateData.sessionId)
        },
        data: {
          session_evaluation_status: Number(updateData.status),
          evaluation_id: Number(updateData.evaluationId),
          ses_created_user_id: Number(updateData.sesCreatedUserId)
        }
      });
      if (updateUser) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //Update Session table status service
  async deleteSessionFromEvaluationService(updateData: DeleteSessionStatusDto) {
    try {
      //Update v3 table
      const updateSession = await this.prisma.sessions_for_evaluation_v3.update(
        {
          where: {
            session_id: Number(updateData.sessionId)
          },
          data: {
            session_evaluation_status: Number(updateData.status),
            ses_abandon_reason: updateData.abandonReason
          }
        }
      );

      //Check Value exist or not
      const sessionObj = await this.prisma.sesRevampSessionEvaluation.findFirst(
        {
          where: {
            session_id: updateData.sessionId,
            evaluation_id: Number(updateData.evaluationId)
          },
          select: {
            id: true
          }
        }
      );

      if (sessionObj) {
        //Delete timespnas
        const deleteSpans = await this.prisma.sesRevampTimespans.deleteMany({
          where: {
            session_id: Number(updateData.sessionId),
            evaluation_id: Number(updateData.evaluationId)
          }
        });
        if (deleteSpans) {
          //Delete session
          const result = await this.prisma.sesRevampSessionEvaluation.delete({
            where: {
              id: sessionObj.id
            }
          });
        }
      }

      if (updateSession) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // add session function
  async addSession(evaluationData: any) {
    try {
      const timeSpanList = [];

      const obj1 = {
        id: '1-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: evaluationData.evaluationId,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.userId,
        updated_at: new Date(),
        updated_by: evaluationData.userId
      };

      const obj2 = {
        id: '2-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: evaluationData.evaluationId,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.userId,
        updated_at: new Date(),
        updated_by: evaluationData.userId
      };

      const obj3 = {
        id: '3-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: evaluationData.evaluationId,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.userId,
        updated_at: new Date(),
        updated_by: evaluationData.userId
      };

      timeSpanList.push(obj1);
      timeSpanList.push(obj2);
      timeSpanList.push(obj3);

      const data2 = await this.prisma.sesRevampSessionEvaluation.create({
        data: {
          session_id: evaluationData.sessionId,
          pupil_name: evaluationData.pupilName,
          programme: evaluationData.programme,
          evaluation_id: evaluationData.evaluationId,
          pupil_id: evaluationData.pupilId,
          evaluation_session_rating: ',,,,,,,,,,,',
          date_time: new Date(evaluationData.sessionDate),
          sess_eval_id:
            evaluationData.sessionId + '-' + evaluationData.evaluationId,
          created_at: new Date(),
          created_by: evaluationData.userId,
          updated_at: new Date(),
          updated_by: evaluationData.userId,
          sesRevampTimespans: {
            createMany: { data: timeSpanList }
          }
        }
      });

      return { success: true, status: 200 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // generate id dynamically.
  generateEightDigitNumericId(): number {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const uuid = uuidv4();
    let randomId = parseInt(uuid.substr(0, 5), 16);
    randomId = randomId % 100000;
    const idWithPrefix = parseInt(
      `${currentYear.toString().slice(-2)}${nextYear
        .toString()
        .slice(-2)}${randomId.toString().padStart(5, '0')}`,
      10
    );
    return idWithPrefix;
  }

  // raise to sims function
  async simsSave(data: any) {
    try {
      const simsMasterId = this.generateEightDigitNumericId();

      const response0 = await this.prisma.simsMetaData.findFirst({
        where: {
          value: data.pointOfInvestigation
        },
        select: {
          id: true
        }
      });

      const getTutorTsp = await this.prisma.tslUser.findUnique({
        where: {
          tsl_id: data.tutorId
        },
        select: {
          tsp_id: true
        }
      });

      let response1;
      if (response0) {
        response1 = await this.prisma.simsMaster.create({
          data: {
            simsMasterId: simsMasterId,
            ticketStatus: 115,
            tutorID: data.tutorId,
            tutorTspId: getTutorTsp?.tsp_id,
            sessionId: data.sessionId,
            pointOfInvestigation: response0.id,
            descriptionOfTheIncident: data.evaluationFindings,
            createdAt: new Date(),
            createdBy: data.userId,
            isEscalatedToHR: 0,
            mandatoryFields: 0,
            isCollaborateToOps: 0,
            isCollaborateToAca: 0
          }
        });
      }

      if (response1) {
        const response2 = await this.prisma.sesRevampSessionEvaluation.update({
          where: {
            sess_eval_id: data.sessionId + '-' + data.evaluationId
          },
          data: {
            simsRaise: true
          }
        });
        return { success: true, status: 200 };
      } else {
        return { success: false, error: 'error' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
