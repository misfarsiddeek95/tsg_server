import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSessionInvestigationDto } from './dto/update-session-investigation.dto';
import { v4 as uuid } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import moment = require('moment');
import { CreateSessionInvestigationDto } from './dto/create-session-investigation.dto';
import { json } from 'stream/consumers';

@Injectable()
export class SessionInvestigationService {
  constructor(private prisma: PrismaService) {}

  // **************** Method to retrieve session investigation details by ID ****************
  async findOne(id: number) {
    try {
      // Fetch session investigation data from the database
      return this.prisma.$transaction(async (tx) => {
        const data = await tx.sesRevampEvaluation.findUnique({
          where: {
            evaluation_id: id
          },
          include: {
            sesRevampSessionEvaluation: {
              include: {
                sesRevampTimespans: true
              }
            }
          }
        });
        // Additional logic to fetch user data associated with the session investigation
        let responseNonTutor = null;
        if (data) {
          responseNonTutor = await tx.nonTutorDirectory.findFirst({
            where: {
              hr_tsp_id: data.created_by
            },
            select: {
              short_name: true
            }
          });
        }
        // Construct the user object
        const user = {
          name: responseNonTutor
            ? // eslint-disable-next-line no-prototype-builtins
              responseNonTutor.hasOwnProperty('short_name')
              ? responseNonTutor.short_name
              : ''
            : ''
        };

        let obj = {};
        // Construct the final response object
        if (data) {
          obj = {
            finalOutcome: data.overall_evaluation_status,
            investigationStatus: data.evaluation_status,
            pointOfInvestigation: data.point_of_investigation,
            otherComment: data.other_comments,
            issueRegisterCaseId: data.issue_register_case_id,
            requiredAction: data.required_action,
            evaluatedSessionList: getSessionList(
              data.sesRevampSessionEvaluation
            ),
            editableCount: data.editable_count,
            user: user
          };
        }
        return {
          success: true,
          data: obj
        };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // **************** Method to update session investigation details ****************
  async updateSessionInvestigation(updateDto: UpdateSessionInvestigationDto) {
    try {
      // Extract evaluated session list from the update DTO
      const evaluatedSessionList = updateDto.evaluatedSessionList;
      // Initialize an empty array to store session objects
      const sessionList: any = [];
      // Check if there are evaluated sessions
      if (evaluatedSessionList) {
        evaluatedSessionList.map((list) => {
          // Construct session object for create/update
          const obj = {
            create: {
              session_id: list.sessionId,
              school_id: list.schoolId,
              pupil_id: list.pupilId,
              evaluation_session_status: list.investigationSessionStatus,
              evaluation_session_comment: list.investigationSessionComment,
              evaluation_session_rating: list.investigationSessionConcern
                ? list.investigationSessionConcern.join()
                : '',
              date_time: new Date(list.dateTime),
              sess_eval_id: list.sessionId + '-' + updateDto.investigationId,
              created_at: new Date(),
              created_by: updateDto.updatedBy,
              updated_at: new Date(),
              updated_by: updateDto.updatedBy
            },
            update: {
              session_id: list.sessionId,
              school_id: list.schoolId,
              pupil_id: list.pupilId,
              evaluation_session_status: list.investigationSessionStatus,
              evaluation_session_comment: list.investigationSessionComment,
              evaluation_session_rating: list.investigationSessionConcern
                ? list.investigationSessionConcern.join()
                : '',
              date_time: new Date(list.dateTime),
              sess_eval_id: list.sessionId + '-' + updateDto.investigationId,
              updated_at: new Date(),
              updated_by: updateDto.updatedBy
            },
            where: {
              sess_eval_id: list.sessionId + '-' + updateDto.investigationId
            }
          };
          // Add the session object to the list
          sessionList.push(obj);
        });
      }
      // Update session investigation data in the database
      const updatedInvestigationData =
        await this.prisma.sesRevampEvaluation.update({
          where: {
            evaluation_id: updateDto.investigationId
          },
          data: {
            overall_evaluation_status: updateDto.finalOutcome,
            evaluation_status: updateDto.investigationStatus,
            point_of_investigation: updateDto.pointOfInvestigation,
            other_comments: updateDto.otherComment,
            issue_register_case_id: updateDto.issueRegisterCaseId,
            required_action: updateDto.requiredAction,
            updated_by: updateDto.updatedBy,
            submitted_at: null,
            submitted_by: null,
            updated_at: new Date(),
            sesRevampSessionEvaluation: {
              upsert: sessionList
            }
          },
          include: {
            sesRevampSessionEvaluation: true,
            sesRevampTimespans: true
          }
        });

      // Additional logic based on a constant condition
      // eslint-disable-next-line no-constant-condition
      if (true) {
        evaluatedSessionList.map((list) => {
          // Extract time sliders from the evaluated session
          const timspanList = list.timeSlider;
          const sessionTimespans = [];
          timspanList.map((ts) => {
            // Construct time span object for create/update
            const tsObj = {
              create: {
                id: ts.id,
                evaluation_id: updateDto.investigationId,
                session_id: list.sessionId,
                from_time: ts.range.toString(),
                to_time: 'ts.to',
                created_at: new Date(),
                created_by: updateDto.updatedBy,
                updated_at: new Date(),
                updated_by: updateDto.updatedBy
              },
              update: {
                evaluation_id: updateDto.investigationId,
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
            list.sessionId + '-' + updateDto.investigationId,
            sessionTimespans
          );
        });
      }
      // Return success response with updated data
      return {
        success: true,
        status: 200,
        data: updatedInvestigationData
      };
    } catch (error) {
      // Handle errors and throw an error with a meaningful message
      throw new Error(error);
    }
  }

  // **************** Function to update or insert time spans related to a session evaluation ****************
  async updatedOrInsertTimspan(parentId: string, timesArrayList: any) {
    // Update or insert time spans in the sesRevampSessionEvaluation table
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

  // **************** Update Session table status service ****************
  async updateSessionInvestigationStatusService(updateData: any) {
    try {
      // Update the sessions_for_evaluation_v3 table with the provided data
      const updateUser = await this.prisma.sessions_for_evaluation_v3.update({
        where: {
          session_id: Number(updateData.sessionId)
        },
        data: {
          session_investigation_status: Number(updateData.status),
          investigation_id: Number(updateData.investigationId),
          sis_created_user_id: Number(updateData.sisCreatedUserId)
        }
      });
      // Check if the update was successful
      if (updateUser) {
        return { success: true };
      } else {
        // Return failure if the update was not successful
        return { success: false };
      }
    } catch (error) {
      // Handle errors and return a failure response with the error message
      return { success: false, error: error.message };
    }
  }

  // **************** Create an Evaluation Initially Service ****************
  async createEvaluationService(evaluationData: any) {
    try {
      // Step 1: Create an entry in the sesRevampEvaluation table
      return this.prisma.$transaction(async (tx) => {
        const data = await tx.sesRevampEvaluation.create({
          data: {
            tutor_id: evaluationData.tutorId,
            template_id: evaluationData.templateId,
            created_at: moment().format(), // Set creation timestamp
            created_by: evaluationData.createdBy,
            updated_by: evaluationData.updatedBy,
            updated_at: new Date() // Set initial update timestamp
          }
        });
        console.log(JSON.stringify(data));
        // Step 2: Create three time span objects for the evaluation session
        const timeSpanList = [];

        // obj1 - START
        const obj1 = {
          id: '1-' + uuid().slice(0, 8),
          session_id: evaluationData.sessionId,
          evaluation_id: data.evaluation_id,
          from_time: '0,0',
          to_time: 'ts.to', // This should be replaced with the actual 'to_time' value
          created_at: new Date(),
          created_by: evaluationData.createdBy,
          updated_at: new Date(),
          updated_by: evaluationData.updatedBy
        };
        // obj1 - END

        // obj2 - START
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
        // obj2 - END

        // obj3 - START
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
        // obj3 - END

        // Add time span objects to the timeSpanList array
        timeSpanList.push(obj1);
        timeSpanList.push(obj2);
        timeSpanList.push(obj3);

        await tx.sesRevampSessionEvaluation.create({
          data: {
            session_id: evaluationData.sessionId,
            school_id: evaluationData.schoolId,
            evaluation_id: data.evaluation_id,
            pupil_id: evaluationData.pupilId,
            evaluation_session_rating: ',,,,',
            date_time: new Date(evaluationData.sessionDate).toISOString(),
            sess_eval_id: evaluationData.sessionId + '-' + data.evaluation_id,
            created_at: new Date().toISOString(),
            created_by: evaluationData.createdBy,
            updated_at: new Date().toISOString(),
            updated_by: evaluationData.updatedBy,
            sesRevampTimespans: {
              createMany: { data: timeSpanList }
            }
          }
        });
        // Return success with the created data
        return {
          success: true,
          data: data
        };
      });
    } catch (error) {
      // Log and return failure with the error message if an exception occurs
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  // **************** Method to retrieve sessions based on parameters ****************
  async allSessions(params: { skip?: number; take?: number; where: any }) {
    try {
      const { skip, take, where } = params;

      // Check if 'skip' is not a number
      if (isNaN(skip)) {
        // Step 1: Aggregate maximum teaching span from sessions_for_evaluation_v3 table
        const maxTime = await this.prisma.sessions_for_evaluation_v3.aggregate({
          _max: { teaching_span: true }
        });
        // Step 2: Count total sessions based on the provided 'where' condition
        const total = await this.prisma.sessions_for_evaluation_v3.count({
          where
        });
        // Step 3: Retrieve sessions from sessions_for_evaluation_v3 table based on 'take' and 'where'
        const data = await this.prisma.sessions_for_evaluation_v3.findMany({
          take,
          where
        });

        // Return success with formatted data
        return {
          success: true,
          maxTime: Number(maxTime._max.teaching_span),
          total: total,
          data: data.map((item) => {
            return {
              // Map and format each item in the retrieved data
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
              session_investigation_status: item.session_investigation_status,
              updated_by: item.updated_by,
              updated_at: item.updated_at
            };
          })
        };
      } else {
        // Similar steps as above, but with 'skip' parameter included in the query
        const maxTime = await this.prisma.sessions_for_evaluation_v3.aggregate({
          _max: { teaching_span: true }
        });
        // Step 1 and 2 are the same
        const total = await this.prisma.sessions_for_evaluation_v3.count({
          where
        });
        // Step 3: Retrieve sessions with 'skip' and 'take' from sessions_for_evaluation_v3 table
        const data = await this.prisma.sessions_for_evaluation_v3.findMany({
          skip,
          take,
          where
        });
        // Return success with formatted data
        return {
          success: true,
          maxTime: Number(maxTime._max.teaching_span),
          total: total,
          data: data.map((item) => {
            return {
              // Map and format each item in the retrieved data
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
              session_investigation_status: item.session_investigation_status,
              updated_by: item.updated_by,
              updated_at: item.updated_at
            };
          })
        };
      }
    } catch (error) {
      // Return failure with error message if an exception occurs
      return { success: false, error: error.message };
    }
  }

  // **************** Method to update investigation status ****************
  async updateInvestigationStatus(updateSessionStatusUpdate: any) {
    try {
      // Initialize data1 object
      let data1 = {};
      // Check investigation status to determine data1 content
      if (updateSessionStatusUpdate.investigationStatus === 4) {
        data1 = {
          evaluation_status: updateSessionStatusUpdate.investigationStatus,
          submitted_at: new Date(),
          submitted_by: 0,
          updated_at: new Date()
        };
      } else if (updateSessionStatusUpdate.investigationStatus === 3) {
        data1 = {
          evaluation_status: updateSessionStatusUpdate.investigationStatus,
          completed_at: new Date(),
          updated_at: new Date()
        };
      } else {
        data1 = {
          evaluation_status: updateSessionStatusUpdate.investigationStatus,
          updated_at: new Date()
        };
      }
      // Update sesRevampEvaluation table based on evaluation_id
      const updatedData = await this.prisma.sesRevampEvaluation.update({
        where: {
          evaluation_id: updateSessionStatusUpdate.investigationId
        },
        data: data1
      });

      //------------------------------------------------------------------------------
      // Initialize data2 object
      let data2 = {};
      // Check investigation status to determine data2 content
      if (updateSessionStatusUpdate.investigationStatus === 5) {
        data2 = {
          session_investigation_status:
            updateSessionStatusUpdate.investigationStatus,
          sis_abandon_reason: updateSessionStatusUpdate.abandonReason
        };
      } else {
        data2 = {
          session_investigation_status:
            updateSessionStatusUpdate.investigationStatus
        };
      }

      // update sessions_for_evaluation_v3 table's session_evaluation_status
      await this.prisma.sessions_for_evaluation_v3.updateMany({
        where: {
          investigation_id: updateSessionStatusUpdate.investigationId
        },
        data: data2
      });
      //------------------------------------------------------------------------------
      //If only Abandon Session - Delete all sessions and it's timespans related to sessions
      //Delete timespnas
      if (updateSessionStatusUpdate.investigationStatus === 5) {
        const deleteSpans = await this.prisma.sesRevampTimespans.deleteMany({
          where: {
            evaluation_id: updateSessionStatusUpdate.investigationId
          }
        });
        // If timespans are deleted, delete sessions
        if (deleteSpans) {
          //Delete session
          const result =
            await this.prisma.sesRevampSessionEvaluation.deleteMany({
              where: {
                evaluation_id: updateSessionStatusUpdate.investigationId
              }
            });
        }
      }
      //------------------------------------------------
      // Return success with updated data
      return {
        success: true,
        data: updatedData
      };
    } catch (error) {
      // Throw an error if an exception occurs
      throw new Error(error);
    }
  }

  // **************** update editable count of the session evaluation ****************
  async updateEditableCount(updateEditableCount: any) {
    try {
      // Retrieve existing editable count from sesRevampEvaluation table
      const existingRecord = await this.prisma.sesRevampEvaluation.findUnique({
        where: {
          evaluation_id: updateEditableCount.evaluationId
        },
        select: {
          editable_count: true
        }
      });
      // Initialize editCount with a default value of 3
      let editCount = 3;
      // Update editCount if it's less than 3
      if (existingRecord.editable_count < 3) {
        editCount = existingRecord.editable_count + 1;
      }
      // Update sesRevampEvaluation table with new editable count
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
      // Throw an error if an exception occurs
      throw new Error(error);
    }
  }

  // **************** Update Session table status service ****************
  async deleteSessionFromEvaluationService(updateData: any) {
    try {
      // Update session_investigation_status and sis_abandon_reason in sessions_for_evaluation_v3 table
      const updateSession = await this.prisma.sessions_for_evaluation_v3.update(
        {
          where: {
            session_id: Number(updateData.sessionId)
          },
          data: {
            session_investigation_status: Number(updateData.status),
            sis_abandon_reason: updateData.abandonReason
          }
        }
      );

      // Check if the session exists in sesRevampSessionEvaluation table
      const sessionObj = await this.prisma.sesRevampSessionEvaluation.findFirst(
        {
          where: {
            session_id: updateData.sessionId,
            evaluation_id: Number(updateData.investigationId)
          },
          select: {
            id: true
          }
        }
      );

      if (sessionObj) {
        // Delete timespans related to the session
        const deleteSpans = await this.prisma.sesRevampTimespans.deleteMany({
          where: {
            session_id: Number(updateData.sessionId),
            evaluation_id: Number(updateData.investigationId)
          }
        });
        // If timespans are deleted, delete the session
        if (deleteSpans) {
          const result = await this.prisma.sesRevampSessionEvaluation.delete({
            where: {
              id: sessionObj.id
            }
          });
        }
      }

      if (updateSession) {
        return { success: true, status: 200 };
      } else {
        return { success: false, status: 500 };
      }
    } catch (error) {
      // Log and return an error message if an exception occurs
      console.log('This is error', error);
      return { success: false, error: error.message };
    }
  }

  // **************** Add a session to sesRevampSessionEvaluation table ****************
  async addSession(evaluationData: any) {
    try {
      // Initialize an array to store time span objects
      const timeSpanList = [];

      // Create three time span objects and add them to timeSpanList
      // obj1 - START
      const obj1 = {
        id: '1-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: evaluationData.investigationId,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.userId,
        updated_at: new Date(),
        updated_by: evaluationData.userId
      };
      // obj1 - END

      // obj2 - START
      const obj2 = {
        id: '2-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: evaluationData.investigationId,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.userId,
        updated_at: new Date(),
        updated_by: evaluationData.userId
      };
      // obj2 - END

      // obj3 - START
      const obj3 = {
        id: '3-' + uuid().slice(0, 8),
        session_id: evaluationData.sessionId,
        evaluation_id: evaluationData.investigationId,
        from_time: '0,0',
        to_time: 'ts.to',
        created_at: new Date(),
        created_by: evaluationData.userId,
        updated_at: new Date(),
        updated_by: evaluationData.userId
      };
      // obj3 - END

      // Add time span objects to the timeSpanList array
      timeSpanList.push(obj1);
      timeSpanList.push(obj2);
      timeSpanList.push(obj3);

      const data2 = await this.prisma.sesRevampSessionEvaluation.create({
        data: {
          session_id: evaluationData.sessionId,
          pupil_name: evaluationData.pupilName,
          programme: evaluationData.programme,
          evaluation_id: evaluationData.investigationId,
          school_id: evaluationData.schoolId,
          pupil_id: evaluationData.pupilId,
          evaluation_session_rating: ',,,,,,,,,,,',
          date_time: new Date(evaluationData.sessionDate),
          sess_eval_id:
            evaluationData.sessionId + '-' + evaluationData.investigationId,
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
      // Log and return an error message if an exception occurs
      console.log('This is error', error);
      return { success: false, error: error.message };
    }
  }

  // Generate an eight-digit numeric ID
  generateEightDigitNumericId(): number {
    // Get the current year
    const currentYear = new Date().getFullYear();
    // Calculate the next year
    const nextYear = currentYear + 1;
    // Generate a random UUID
    const uuid = uuidv4();
    // Extract the first 5 characters from the UUID and convert them to a decimal number
    let randomId = parseInt(uuid.substr(0, 5), 16);
    // Take the remainder when dividing by 100,000 to get a 5-digit random number
    randomId = randomId % 100000;
    // Concatenate the current year (last two digits), next year (last two digits), and the random number
    const idWithPrefix = parseInt(
      `${currentYear.toString().slice(-2)}${nextYear
        .toString()
        .slice(-2)}${randomId.toString().padStart(5, '0')}`,
      10
    );
    return idWithPrefix;
  }

  // **************** Method to save data related to SIMS ****************
  async simsSave(data: any) {
    try {
      // Generate an eight-digit numeric ID for SIMS master
      const simsMasterId = this.generateEightDigitNumericId();
      // Step 1: Check if the metadata with the given value (pointOfInvestigation) exists
      const response0 = await this.prisma.simsMetaData.findFirst({
        where: {
          value: data.pointOfInvestigation
        },
        select: {
          id: true
        }
      });
      // Step 2: Get the TSP ID of the tutor
      const getTutorTsp = await this.prisma.tslUser.findUnique({
        where: {
          tsl_id: data.tutorId
        },
        select: {
          tsp_id: true
        }
      });

      let response1;
      // Step 3: If metadata exists, create a new entry in the simsMaster table
      if (response0) {
        response1 = await this.prisma.simsMaster.create({
          data: {
            simsMasterId: simsMasterId,
            ticketStatus: 115,
            tutorID: data.tutorId,
            tutorTspId: getTutorTsp?.tsp_id,
            sessionId: data.sessionId,
            pointOfInvestigation: response0.id,
            descriptionOfTheIncident: data.investigationFindings,
            createdAt: new Date(),
            createdBy: data.userId,
            isEscalatedToHR: 0,
            mandatoryFields: 0,
            isCollaborateToOps: 0,
            isCollaborateToAca: 0
          }
        });
      }
      // Step 4: If simsMaster entry is created, update sesRevampSessionEvaluation with simsRaise flag
      if (response1) {
        const response2 = await this.prisma.sesRevampSessionEvaluation.update({
          where: {
            sess_eval_id: data.sessionId + '-' + data.investigationId
          },
          data: {
            simsRaise: true
          }
        });
        // Return success if everything is executed successfully
        return { success: true, status: 200 };
      } else {
        // Return failure if there is an error or simsMaster entry is not created
        return { success: false, error: 'error' };
      }
    } catch (error) {
      // Handle and log any errors that occur during the process
      return { success: false, error: error.message };
    }
  }
}
// Function to transform session data into a standardized session list
function getSessionList(sessions: any) {
  // Check if there are sessions to process
  const sessionList = [];
  if (sessions.length != 0) {
    // Iterate through each session in the input array
    for (let i = 0; i < sessions.length; i++) {
      // Extract relevant information from the session
      const evaluationSessionConcerngNew =
        sessions[i].evaluation_session_rating.split(',');
      const session = sessions[i];
      // Create a session object with standardized properties
      const sessObj = {
        sessionId: session.session_id,
        schoolId: session.school_id,
        pupilId: session.pupil_id,
        investigationSessionStatus: session.evaluation_session_status,
        investigationSessionComment: session.evaluation_session_comment,
        investigationSessionConcern: evaluationSessionConcerngNew,
        dateTime: session.date_time,
        timeSlider: getTimeSliders(session.sesRevampTimespans),
        simsRaise: session.simsRaise
      };
      // Add the session object to the session list
      sessionList.push(sessObj);
    }
  }
  // Return the standardized session list
  return sessionList;
}

// Function to transform time span data into a standardized time slider list
function getTimeSliders(sesRevampTimespans: any) {
  const slidesList = [];
  // Check if there are time spans to process
  if (sesRevampTimespans.length != 0) {
    // Iterate through each time span in the input array
    for (let i = 0; i < sesRevampTimespans.length; i++) {
      // Extract relevant information from the time span
      const slider = sesRevampTimespans[i];
      // Create a time slider object with standardized properties
      const slideObj = {
        id: slider.id,
        range: slider.from_time.split(',')
      };
      // Add the time slider object to the time slider list
      slidesList.push(slideObj);
    }
  }
  // Return the standardized time slider list
  return slidesList;
}
