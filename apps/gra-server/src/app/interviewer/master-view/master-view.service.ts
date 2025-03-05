import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as moment from 'moment';
import { BatchDto, FinalOutcomeDto, MasterViewDto } from './master-view.dto';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class MasterViewService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async getmasterview({
    tspId,
    batch,
    finalOutcome,
    finalDecision,
    skip,
    take,
    demoDateFrom,
    demoDateTo,
    cpdScore,
    attempt
  }: MasterViewDto) {
    const tspIds =
      tspId &&
      tspId
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    let cpdTspIds;
    if (cpdScore) {
      const cpd = await this.prisma.demoTalentlms.findMany({
        where: {
          cpd: {
            gte: cpdScore
          }
        },
        select: {
          tsp_id: true,
          cpd: true
        }
      });

      cpdTspIds = cpd.map((val) => val.tsp_id);
    }

    const filterWhereClause = {
      tspId:
        tspId && tspId != ''
          ? { in: tspIds }
          : cpdScore
          ? { in: cpdTspIds }
          : {},
      batch: batch ? { in: batch.split(',') } : {},
      finalOutcome: finalOutcome
        ? finalOutcome === 'NA'
          ? { notIn: ['pass', 'fail'] }
          : { equals: finalOutcome }
        : {},
      finalDecision: finalDecision ? { equals: finalDecision } : {},
      attempt: attempt ? { equals: attempt } : {},
      demoDate:
        demoDateFrom && demoDateTo && demoDateFrom !== '' && demoDateTo !== ''
          ? {
              gt: moment(demoDateFrom).startOf('date').toDate().toISOString(),
              lt: moment(demoDateTo).endOf('date').toDate().toISOString()
            }
          : {}
    };

    try {
      const totalcount = await this.prisma.demoAssessment.count({
        where: filterWhereClause
      });
      const masterview = await this.prisma.demoAssessment.findMany({
        take: +take,
        skip: +skip,
        where: filterWhereClause,
        select: {
          // Trainee Details
          name: true,
          tspId: true,
          email: true,
          batch: true,
          user: {
            select: {
              approved_contact_data: {
                select: {
                  mobileNumber: true
                }
              },
              FlexiCandidate: {
                select: {
                  FlexiExam: {
                    select: {
                      FlexiCandidateExamDetails: {
                        select: {
                          points: true
                        }
                      }
                    }
                  }
                }
              },
              teachingInterview: {
                select: {
                  intInteractionPillarRating: true,
                  lanPillarRate: true,
                  skKnowledgePillarRate: true,
                  assesAssessmentPillarRating: true,
                  familiarityPillarRating: true,
                  tiCreatedBy: {
                    select: {
                      // approved_personal_data: {
                      //   select: {
                      //     shortName: true
                      //   }
                      // }
                      username: true
                    }
                  }
                },
                orderBy: {
                  id: 'desc'
                }
              },
              DemoTalentlms: {
                select: {
                  course_completion: true,
                  course_score_avg: true,
                  attendance: true,
                  cpd_familiarity: true,
                  cpd_sct: true,
                  cpd_language: true,
                  cpd_sk: true,
                  cpd_reflection: true,
                  cpd: true
                },
                orderBy: {
                  id: 'desc'
                }
              }
            }
          },

          // Initial Assesment

          primaryAttendance: true,
          familiarityOverallRating: true,
          languageOverallRating: true,
          skOverallRatings: true,
          sctOverallRating: true,
          interactionOverallRating: true,
          reflectionOverallRating: true,
          sessionRating: true,

          // Training Completion

          demoDate: true,
          microphone: true,
          conceptualExplanation: true,
          preAssessment: true,
          adaptation: true,
          postAssessment: true,
          interactionEngagement: true,
          interactionEffort: true,
          interactionProfessionalism: true,
          vocabulary: true,
          pronunciation: true,
          grammar: true,
          rateOfSpeech: true,
          comprehension: true,
          identifyingWww: true,
          identifyingEbi: true,
          positiveMindset: true,
          sessionFlow: true,
          classroomResources: true,
          sessionOps: true,

          familiarityComment: true,
          languageComment: true,
          skComment: true,
          sctAssessmentComment: true,
          interactionComment: true,
          reflectionComment: true,
          whatNeedsToBeImproved: true,
          id: true,
          finalOutcome: true,
          finalReason: true,
          failReason1: true,
          whatWentWell: true,
          attempt: true,
          emailStatus: true,
          finalDecision: true,
          faCreatedBy: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });

      /**
       * fetching all batches found in demo entries
       */
      const batchNames = await this.prisma.demoAssessment.findMany({
        select: { batch: true },
        where: {},
        distinct: ['batch']
      });

      /**
       * fetching all demo Statuses found in demo entries
       */
      const fetchDemoStatusList = await this.prisma.demoAssessment.findMany({
        select: { finalOutcome: true },
        where: {},
        distinct: ['finalOutcome']
      });

      /**
       * fetching all final Decisions found in demo entries
       */
      const fetchFinalDecisionList = await this.prisma.demoAssessment.findMany({
        select: { finalDecision: true },
        where: {},
        distinct: ['finalDecision']
      });

      /**
       * fetching all attempts found in demo entries
       */
      const fetchAttemptList = await this.prisma.demoAssessment.findMany({
        select: { attempt: true },
        where: {},
        distinct: ['attempt']
      });

      if (masterview) {
        return {
          success: true,
          count: totalcount,
          batchNames: batchNames,
          demoStatuses: fetchDemoStatusList,
          finalDecisions: fetchFinalDecisionList,
          attempts: fetchAttemptList,
          data: masterview.map((values, index: any) => {
            return {
              // Traineer Details
              id: index + 1,
              fasDataId: values.id,
              name: values.name,
              userId: values.tspId,
              email: values.email,
              batch: values.batch,
              contactNo: values.user.approved_contact_data?.mobileNumber ?? '',

              // Intarnal assiement
              maths:
                values.user.FlexiCandidate?.FlexiExam[0]
                  ?.FlexiCandidateExamDetails[0]?.points ?? '',
              tiCreatedBy:
                // values.user.teachingInterview[0]?.tiCreatedBy
                //   ?.approved_personal_data?.shortName,
                values.user.teachingInterview[0]?.tiCreatedBy?.username,
              familiarity:
                values.user.teachingInterview[0]?.familiarityPillarRating,
              lang: values.user.teachingInterview[0]?.lanPillarRate,
              sk: values.user.teachingInterview[0]?.skKnowledgePillarRate,
              sct: values.user.teachingInterview[0]
                ?.assesAssessmentPillarRating,
              scti: values.user.teachingInterview[0]
                ?.intInteractionPillarRating,

              //Training Completion
              coursecomplicaiton: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].course_completion
                : '',
              coursescoreavg: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].course_score_avg
                : '',
              attendance: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].attendance
                : '',

              // Final Assessment DEMO
              faCreatedBy:
                values.faCreatedBy?.approved_personal_data?.shortName,
              attendance1: values.primaryAttendance,
              demodate: values.demoDate,
              familiarity1: values.familiarityOverallRating,
              language1: values.languageOverallRating,
              sk1: values.skOverallRatings,
              sctassess1: values.sctOverallRating,
              sctint1: values.interactionOverallRating,
              reflection: values.reflectionOverallRating,
              overall_session_rating: values.sessionRating,
              demo_status: values.finalOutcome,
              fail_reason: values.failReason1,
              demo_percentage: values.sessionRating / 2,
              what_went_well: values.whatWentWell,
              to_be_improved: values.whatNeedsToBeImproved,

              // Final Assessment CPD
              familiarity2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_familiarity
                : '',
              language2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_language
                : '',
              sk2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_sk
                : '',

              reflection2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_reflection
                : '',
              cdp2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd
                : '',

              // Overall & Decision

              overall_average:
                +(values.user.DemoTalentlms[0]?.cpd ?? 0) * 0.5 +
                (values.sessionRating ?? 0) / 2 +
                '%',

              // rank:
              attempts: values.attempt,

              final_decision2: values.finalDecision,
              reason_comment: values.failReason1,
              email_status: values.emailStatus
            };
          })
        };
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Update Final Decision of Demo Assestment Record
   * @param createdBy
   * @param data
   * @returns
   */
  async setFinalDecision(createdBy: number, data: FinalOutcomeDto) {
    try {
      await this.prisma.demoAssessment.update({
        where: {
          id: +data.fasDataId
        },
        data: {
          finalDecision: data.final_outcome,
          finalReason: data.final_reason,
          finalComment: data.final_comment,
          updatedBy: +createdBy,
          updatedAt: new Date().toISOString()
        }
      });
      return {
        success: true,
        message:
          'Sucessfully updated final decision of record: ' + data.fasDataId
      };
    } catch (error) {
      // console.log(error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Trigger Final Decision email to records based on selected batch (via batch filter)
   * @param createdBy // tsp_id of person triggerign emails
   * @param batchList
   * @returns
   */
  async sendFinalEmails(createdBy: number, batchList: BatchDto) {
    try {
      const emailList = await this.prisma.demoAssessment.findMany({
        where: {
          emailStatus: null,
          // primaryAttendance: 'attended',
          primaryAttendance: { in: ['Attended', 'attended'] },
          OR: [{ finalDecision: 'Pass' }, { finalDecision: 'Fail' }],
          batch: {
            in: batchList.batchList
          }
        },
        select: {
          name: true,
          email: true,
          tspId: true,
          id: true,
          finalDecision: true,
          whatNeedsToBeImproved: true,
          whatWentWell: true,
          emailStatus: true,
          primaryAttendance: true,
          bsBookingId: true,
          attempt: true
        }
      });

      if (emailList.length === 0) {
        return {
          success: false,
          message:
            'No eligable records found to trigger emails for batches: ' +
            batchList.batchList
        };
      }

      // console.log('emailList:', emailList);

      await Promise.all(
        emailList.map(async (item) => {
          let demo_attempt_progress = 99;

          /**
           * fetch record from bs_booking_status for bs_booking_history entries
           */
          const bookingStatus = await this.prisma.bookingStatus.findUnique({
            where: {
              id: +item.bsBookingId
            },
            select: {
              interviewer_id: true,
              time_slot_id: true,
              candidate_id: true,
              status: true,
              date: true,
              appointment_type_ref_id: true
            }
          });

          /**
           * update email trigger flag & datetime for all entires found 1 by 1
           */
          await this.prisma.demoAssessment.update({
            where: {
              id: item.id
            },
            data: {
              emailStatus: 1,
              triggeredBy: +createdBy,
              triggeredAt: new Date().toISOString()
            }
          });

          /**
           * fetch last TalentLMS learning plantform data record
           */
          const tlmsRecord = await this.prisma.demoTalentlms.findMany({
            where: {
              tsp_id: +item.tspId
            },
            orderBy: {
              id: 'desc'
            },
            skip: 0,
            take: 1
          });

          if (item.finalDecision === 'Pass') {
            demo_attempt_progress =
              item.attempt === 'First'
                ? -3
                : item.attempt === 'Second'
                ? -4
                : -5;

            // if (tlmsRecord) {
            await this.mailService.sendFianlOutcomePass(
              item.name,
              item.email,
              [
                {
                  name: 'Familiarity',
                  score: tlmsRecord[0]?.cpd_familiarity.toString() ?? '0'
                },
                {
                  name: 'Student Centred Teaching',
                  score: tlmsRecord[0]?.course_completion.toString() ?? '0'
                },
                {
                  name: 'Language',
                  score: tlmsRecord[0]?.cpd_language.toString() ?? '0'
                },
                {
                  name: 'Subject Knowledge',
                  score: tlmsRecord[0]?.cpd_sk.toString() ?? '0'
                },
                {
                  name: 'Reflection',
                  score: tlmsRecord[0]?.cpd_reflection.toString() ?? '0'
                }
              ],
              [item.whatNeedsToBeImproved, item.whatWentWell]
            );

            await this.prisma.bookingHistory.create({
              data: {
                created_by: +createdBy,
                booking_status_id: 10,
                candidate_id: +item.tspId,
                appointment_type_id: 3,
                slot_time_id: bookingStatus.time_slot_id,
                withdraw_reason: 'PASSED',
                date: bookingStatus.date,
                booking_id: +item.bsBookingId,
                interviewer_id: bookingStatus.interviewer_id
              }
            });

            await this.prisma.candidateLevel.update({
              where: {
                candidate_id: item.tspId
              },
              data: {
                level: 7,
                updatedAt: new Date().toISOString(),
                step6UpdatedAt: new Date().toISOString(),
                step6: 'Pass'
              }
            });
          } else if (item.finalDecision === 'Fail') {
            demo_attempt_progress =
              item.attempt === 'First'
                ? -6
                : item.attempt === 'Second'
                ? -7
                : -8;

            // if (tlmsRecord) {
            await this.mailService.sendFianlOutcomeFail(
              item.name,
              item.email,
              [
                {
                  name: 'Familiarity',
                  score: tlmsRecord[0]?.cpd_familiarity.toString() ?? '0'
                },
                {
                  name: 'Student Centred Teaching',
                  score: tlmsRecord[0]?.course_completion.toString() ?? '0'
                },
                {
                  name: 'Language',
                  score: tlmsRecord[0]?.cpd_language.toString() ?? '0'
                },
                {
                  name: 'Subject Knowledge',
                  score: tlmsRecord[0]?.cpd_sk.toString() ?? '0'
                },
                {
                  name: 'Reflection',
                  score: tlmsRecord[0]?.cpd_reflection.toString() ?? '0'
                }
              ],
              [item.whatNeedsToBeImproved, item.whatWentWell]
            );

            await this.prisma.bookingHistory.create({
              data: {
                created_by: +createdBy,
                booking_status_id: 9,
                candidate_id: +item.tspId,
                appointment_type_id: 3,
                slot_time_id: bookingStatus.time_slot_id,
                withdraw_reason: 'FAILED',
                date: bookingStatus.date,
                booking_id: +item.bsBookingId,
                interviewer_id: bookingStatus.interviewer_id
              }
            });

            await this.prisma.candidateLevel.update({
              where: {
                candidate_id: item.tspId
              },
              data: {
                updatedAt: new Date().toISOString(),
                step6UpdatedAt: new Date().toISOString(),
                step6: 'Fail'
              }
            });
          }

          if (demo_attempt_progress !== 99) {
            await this.prisma.hrisProgress.upsert({
              where: {
                tspId: +item.tspId
              },
              update: {
                demoAttempt: demo_attempt_progress
              },
              create: {
                tspId: +item.tspId,
                demoAttempt: demo_attempt_progress
              }
            });
          }
        })
      );

      return {
        success: true,
        message:
          'Sucessfully triggered: ' +
          emailList.length +
          ' emails belonging to batches: ' +
          batchList.batchList
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async exportFinalAssesments({
    tspId,
    batch,
    finalOutcome,
    finalDecision,
    demoDateFrom,
    demoDateTo,
    cpdScore,
    attempt
  }: Omit<MasterViewDto, 'take' | 'skip'>) {
    const isWhere =
      tspId ||
      batch ||
      finalOutcome ||
      finalDecision ||
      demoDateFrom ||
      demoDateTo ||
      cpdScore ||
      attempt;
    const tspIds =
      tspId &&
      tspId
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    let cpdTspIds;
    if (cpdScore) {
      const cpd = await this.prisma.demoTalentlms.findMany({
        where: {
          cpd: {
            gte: cpdScore
          }
        },
        select: {
          tsp_id: true,
          cpd: true
        }
      });

      cpdTspIds = cpd.map((val) => val.tsp_id);
    }

    const filterWhereClause = isWhere
      ? {
          tspId:
            tspId && tspId != ''
              ? { in: tspIds }
              : cpdScore
              ? { in: cpdTspIds }
              : {},
          batch: batch ? { in: batch.split(',') } : {},
          finalOutcome: finalOutcome
            ? finalOutcome === 'NA'
              ? { notIn: ['pass', 'fail'] }
              : { equals: finalOutcome }
            : {},
          finalDecision: finalDecision ? { equals: finalDecision } : {},
          attempt: attempt ? { equals: attempt } : {},
          demoDate:
            demoDateFrom &&
            demoDateTo &&
            demoDateFrom !== '' &&
            demoDateTo !== ''
              ? {
                  gt: moment(demoDateFrom)
                    .startOf('date')
                    .toDate()
                    .toISOString(),
                  lt: moment(demoDateTo).endOf('date').toDate().toISOString()
                }
              : {}
        }
      : {};

    try {
      const totalcount = await this.prisma.demoAssessment.count({
        where: filterWhereClause
      });
      const masterview = await this.prisma.demoAssessment.findMany({
        where: filterWhereClause,
        select: {
          // Trainee Details
          name: true,
          tspId: true,
          email: true,
          batch: true,
          user: {
            select: {
              approved_contact_data: {
                select: {
                  mobileNumber: true
                }
              },
              FlexiCandidate: {
                select: {
                  FlexiExam: {
                    select: {
                      FlexiCandidateExamDetails: {
                        select: {
                          points: true
                        }
                      }
                    }
                  }
                }
              },
              teachingInterview: {
                select: {
                  intInteractionPillarRating: true,
                  lanPillarRate: true,
                  skKnowledgePillarRate: true,
                  assesAssessmentPillarRating: true,
                  familiarityPillarRating: true,
                  tiCreatedBy: {
                    select: {
                      approved_personal_data: {
                        select: {
                          shortName: true
                        }
                      }
                    }
                  }
                },
                orderBy: {
                  id: 'desc'
                }
              },
              DemoTalentlms: {
                select: {
                  course_completion: true,
                  course_score_avg: true,
                  attendance: true,
                  cpd_familiarity: true,
                  cpd_sct: true,
                  cpd_language: true,
                  cpd_sk: true,
                  cpd_reflection: true,
                  cpd: true
                },
                orderBy: {
                  id: 'desc'
                }
              }
            }
          },

          // Initial Assesment

          primaryAttendance: true,
          familiarityOverallRating: true,
          languageOverallRating: true,
          skOverallRatings: true,
          sctOverallRating: true,
          interactionOverallRating: true,
          reflectionOverallRating: true,
          sessionRating: true,

          // Training Completion

          demoDate: true,
          attendanceComment: true,
          audioTechIssues: true,
          equipmentLocationIssues: true,
          speedTestLink: true,
          technicalComment: true,
          microphone: true,
          conceptualExplanation: true,
          preAssessment: true,
          adaptation: true,
          postAssessment: true,
          interactionEngagement: true,
          interactionEffort: true,
          interactionProfessionalism: true,
          vocabulary: true,
          pronunciation: true,
          grammar: true,
          rateOfSpeech: true,
          comprehension: true,
          identifyingWww: true,
          identifyingEbi: true,
          positiveMindset: true,
          sessionFlow: true,
          classroomResources: true,
          sessionOps: true,

          familiarityComment: true,
          languageComment: true,
          skComment: true,
          sctAssessmentComment: true,
          interactionComment: true,
          reflectionComment: true,
          whatNeedsToBeImproved: true,
          id: true,
          finalOutcome: true,
          finalReason: true,
          failReason1: true,
          whatWentWell: true,
          attempt: true,
          emailStatus: true,
          finalDecision: true,

          overallSessionRating: true,
          positiveActionsPOne: true,
          positiveActionsPOneComment: true,
          positiveActionsPTwo: true,
          positiveActionsPTwoComment: true,
          positiveActionsPThree: true,
          positiveActionsPThreeComment: true,
          focusAreaPOne: true,
          focusAreaPOneComment: true,
          focusAreaPTwo: true,
          focusAreaPTwoComment: true,
          focusAreaPThree: true,
          focusAreaPThreeComment: true,
          faCreatedBy: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });

      /**
       * fetching all batches found in demo entries
       */
      const batchNames = await this.prisma.demoAssessment.findMany({
        select: { batch: true },
        where: {},
        distinct: ['batch']
      });

      /**
       * fetching all demo Statuses found in demo entries
       */
      const demoStatuses = await this.prisma.demoAssessment.findMany({
        select: { finalOutcome: true },
        where: {},
        distinct: ['finalOutcome']
      });

      /**
       * fetching all final Decisions found in demo entries
       */
      const fetchFinalDecisionList = await this.prisma.demoAssessment.findMany({
        select: { finalDecision: true },
        where: {},
        distinct: ['finalDecision']
      });

      /**
       * fetching all attempts found in demo entries
       */
      const fetchAttemptList = await this.prisma.demoAssessment.findMany({
        select: { attempt: true },
        where: {},
        distinct: ['attempt']
      });
      if (masterview) {
        return {
          success: true,
          count: totalcount,
          batchNames: batchNames,
          demoStatuses: demoStatuses,
          finalDecisions: fetchFinalDecisionList,
          data: masterview.map((values, index: any) => {
            return {
              // Traineer Details
              id: index + 1,
              fasDataId: values.id,
              name: values.name,
              userId: values.tspId,
              email: values.email,
              batch: values.batch,
              contactNo: values.user.approved_contact_data?.mobileNumber ?? '',

              // Intarnal assiement
              maths:
                values.user.FlexiCandidate?.FlexiExam[0]
                  ?.FlexiCandidateExamDetails[0]?.points ?? '',
              tiCreatedBy:
                values.user.teachingInterview[0]?.tiCreatedBy
                  ?.approved_personal_data?.shortName,
              familiarity:
                values.user.teachingInterview[0]?.familiarityPillarRating,
              lang: values.user.teachingInterview[0]?.lanPillarRate,
              sk: values.user.teachingInterview[0]?.skKnowledgePillarRate,
              sct: values.user.teachingInterview[0]
                ?.assesAssessmentPillarRating,
              scti: values.user.teachingInterview[0]
                ?.intInteractionPillarRating,

              //Training Completion
              coursecomplicaiton: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].course_completion
                : '',
              coursescoreavg: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].course_score_avg
                : '',
              attendance: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].attendance
                : '',

              // Final Assessment DEMO
              faCreatedBy:
                values.faCreatedBy?.approved_personal_data?.shortName,
              attendance1: values.primaryAttendance,
              demodate: values.demoDate,
              attendanceComment: values.attendanceComment,
              audioTechIssues: values.audioTechIssues,
              equipmentLocationIssues: values.equipmentLocationIssues,
              speedTestLink: values.speedTestLink,
              technicalComment: values.technicalComment,
              familiarity1: values.familiarityOverallRating,
              language1: values.languageOverallRating,
              sk1: values.skOverallRatings,
              sctassess1: values.sctOverallRating,
              sctint1: values.interactionOverallRating,
              reflection: values.reflectionOverallRating,
              overall_session_rating: values.sessionRating,
              demo_status: values.finalOutcome,
              fail_reason: values.failReason1,
              demo_percentage: values.sessionRating / 2,
              what_went_well: values.whatWentWell,
              to_be_improved: values.whatNeedsToBeImproved,

              // Final Assessment CPD
              familiarity2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_familiarity
                : '',
              language2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_language
                : '',
              sk2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_sk
                : '',

              reflection2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_reflection
                : '',
              cdp2: values.user.DemoTalentlms[0]
                ? values.user.DemoTalentlms[0].cpd_reflection
                : '',

              // Overall & Decision

              overall_average:
                +(values.user.DemoTalentlms[0]?.cpd ?? 0) * 0.5 +
                (values.sessionRating ?? 0) / 2 +
                '%',

              // rank:
              attempts: values.attempt,

              final_decision2: values.finalDecision,
              reason_comment: values.failReason1,
              email_status: values.emailStatus,

              //mising data

              overallSessionRating: values.overallSessionRating,
              positiveActionsPOne: values.positiveActionsPOne,
              positiveActionsPOneComment: values.positiveActionsPOneComment,
              positiveActionsPTwo: values.positiveActionsPTwo,
              positiveActionsPTwoComment: values.positiveActionsPTwoComment,
              positiveActionsPThree: values.positiveActionsPThree,
              positiveActionsPThreeComment: values.positiveActionsPThreeComment,
              focusAreaPOne: values.focusAreaPOne,
              focusAreaPOneComment: values.focusAreaPOneComment,
              focusAreaPTwo: values.focusAreaPTwo,
              focusAreaPTwoComment: values.focusAreaPTwoComment,
              focusAreaPThree: values.focusAreaPThree,
              focusAreaPThreeComment: values.focusAreaPThreeComment
            };
          })
        };
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
