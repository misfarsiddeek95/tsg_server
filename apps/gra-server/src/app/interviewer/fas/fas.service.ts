import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import moment = require('moment');

@Injectable()
export class FasService {
  constructor(private prisma: PrismaService) {}

  async getFAS(bookingId: number) {
    try {
      const bookingRecord = await this.prisma.bookingStatus.findUnique({
        where: {
          id: bookingId
        },
        select: {
          candidate_id: true
        }
      });

      const tspId = bookingRecord.candidate_id;

      const [fas, batches] = await this.prisma.$transaction([
        this.prisma.user.findUnique({
          where: {
            tsp_id: tspId
          },
          select: {
            approved_contact_data: {
              select: {
                tspId: true,
                workEmail: true
              }
            },
            approved_personal_data: {
              select: {
                firstName: true,
                surname: true
              }
            }
            // hris_progress: {
            //   select: {
            //     demoAttempt: true
            //   }
            // }
          }
        }),
        this.prisma.tutorBatchList.findMany({
          select: {
            batchName: true
          }
        })
      ]);

      const pastAttemptSecond = await this.prisma.demoAssessment.findMany({
        where: {
          tspId: tspId,
          primaryAttendance: 'attended',
          attempt: 'Second'
        },
        select: {
          id: true
        }
      });
      const pastAttemptFirst = await this.prisma.demoAssessment.findMany({
        where: {
          tspId: tspId,
          primaryAttendance: 'attended',
          attempt: 'First'
        },
        select: {
          id: true
        }
      });

      /*
      if (
        fas.hris_progress.demoAttempt !== 0 &&
        fas.hris_progress.demoAttempt !== 1
      ) {
        fas.hris_progress.demoAttempt = 2;
      }
      */

      if (fas) {
        const demoAttempt =
          pastAttemptSecond.length > 0
            ? 'Invalid'
            : pastAttemptFirst.length > 0
            ? 'Second'
            : 'First';

        return {
          success: true,
          data: {
            fas,
            batches: batches.map((batch) => ({
              batch_name: batch.batchName
            })),
            bookingId,
            demoAttempt
          }
        };
      } else {
        return {
          success: false
        };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async submitFAS(
    createdBy: number,
    {
      bookingId,
      traineeName,
      traineeUserId,
      batch,
      attempt,
      traineeEmail,
      attendance,
      attendanceComment,
      demoDate,
      audioTechIssues,
      equipmentLocationIssues,
      speedTestLink,
      technicalComment,
      microphone,
      mistakesAndMisconceptions,
      conceptualExplanation,
      skOverallRatings,
      skComment,
      preAssessment,
      adaptation,
      postAssessment,
      sctOverallRating,
      sctAssessmentComment,
      interactionEngagement,
      interactionEffort,
      interactionProfessionalism,
      interactionOverallRating,
      interactionComment,
      vocabulary,
      pronunciation,
      grammar,
      rateOfSpeech,
      comprehension,
      languageOverallRating,
      languageComment,
      identifyingWww,
      identifyingEbi,
      positiveMindset,
      reflectionOverallRating,
      reflectionComment,
      sessionFlow,
      classroomResources,
      sessionOps,
      familiarityOverallRating,
      familiarityComment,
      sessionRating,
      finalOutcome,
      failReason_1,
      failReason_2,
      overallSessionRating,
      positiveActionsPOne,
      positiveActionsPOneComment,
      positiveActionsPTwo,
      positiveActionsPTwoComment,
      positiveActionsPThree,
      positiveActionsPThreeComment,
      focusAreaPOne,
      focusAreaPOneComment,
      focusAreaPTwo,
      focusAreaPTwoComment,
      focusAreaPThree,
      focusAreaPThreeComment
    }
  ) {
    try {
      if (!traineeUserId) {
        return {
          success: false,
          message: 'Candidate User ID Not found.'
        };
      }

      // let bsBookingHistory;
      // let bsBookingStatus;
      // let bsHistoryId;
      // let setDemoAttempt;
      let tlmsId = null;
      // let interviewerId;
      // let bStatus;

      await this.prisma.$transaction(async (tx) => {
        const HasBooking = await this.prisma.demoAssessment.findMany({
          where: {
            bsBookingId: bookingId
          }
        });

        if (HasBooking && HasBooking.length > 0) {
          await this.prisma.systemErrorLog.create({
            data: {
              system: 'gra',
              subSystem: 'fas',
              function: 'submitFAS',
              location:
                'apps/gra-server/src/app/interviewer/fas/fas.service.ts',
              description:
                `Failed attempt by ${createdBy} to submit fas of booking_id ` +
                `${bookingId} for ${traineeName} - ${traineeUserId} ` +
                `due to repeated booking_id`,
              createdAt: moment().tz('Asia/Colombo').toISOString(),
              createdBy: +createdBy
            }
          });
          return {
            success: false,
            message: `Duplicate booking found for Booking Id: ${bookingId}`
          };
        }

        const bookingStatus = await tx.bookingStatus.findUnique({
          where: {
            id: bookingId
          }
        });
        // interviewerId = bookingStatus.interviewer_id;
        // bStatus = bookingStatus.status;

        /*
        // alternative logic to handle not attended
        const bookingHistories = await tx.bookingHistory.findMany({
          where: {
            candidate_id: traineeUserId,
            appointment_type_id: 3
          },
          orderBy: {
            id: 'desc'
          },
          take: 1
        });

        if (bookingHistories.length > 0) {
          const tempRes = bookingHistories[0];

          bsHistoryId =
            tempRes.booking_status_id && tempRes.booking_status_id === 4
              ? tempRes.id
              : 0;
        }

        bsBookingHistory = 4;
        bsBookingStatus = 4;
        */

        if (traineeUserId !== bookingStatus.candidate_id) {
          return {
            success: false,
            message: 'Candidate User ID not matched with booking'
          };
        }

        /**
         * stop using progress table fetch logic.
         */
        /*
        const progress = await tx.hrisProgress.findUnique({
          where: {
            tspId: traineeUserId
          },
          select: {
            demoAttempt: true,
            tspId: true
          }
        });
        if (progress) {
          attempt =
            progress.demoAttempt === 0
              ? 'First'
            : progress.demoAttempt === 1
              ? 'Second'
              : 'Invalid';

          setDemoAttempt =
            progress.demoAttempt === 0
              ? 5
            : progress.demoAttempt === 1
              ? 2
              : 99;
        }
        */

        //check for previous Second attended attempt. if found throw error
        const pastAttemptSecond = await tx.demoAssessment.findMany({
          where: {
            tspId: traineeUserId,
            primaryAttendance: 'attended',
            attempt: 'Second'
          },
          select: {
            id: true
          }
        });
        if (pastAttemptSecond.length > 0) {
          return {
            success: false,
            message: 'Attempts Allowed exceeded.'
          };
        }

        //check for previous First attended attempt
        const pastAttemptFirst = await tx.demoAssessment.findMany({
          where: {
            tspId: traineeUserId,
            primaryAttendance: 'attended',
            attempt: 'First'
          },
          select: {
            id: true
          }
        });

        const demoTalentlmsRecord = await tx.demoTalentlms.findMany({
          where: {
            AND: [{ tsp_id: traineeUserId }, { copied: 0 }]
          },
          select: {
            id: true,
            tsp_id: true,
            copied: true
          },
          take: 1
        });

        if (demoTalentlmsRecord.length > 0) {
          const resTemp = demoTalentlmsRecord;
          tlmsId = resTemp && demoTalentlmsRecord[0].id ? resTemp[0].id : null;
        }

        if (tlmsId !== null) {
          this.prisma.demoTalentlms.update({
            where: {
              id: tlmsId
            },
            data: {
              copied: 1
            }
          });
        }

        if (attendance !== 'attended') {
          await tx.demoAssessment.create({
            data: {
              tspId: traineeUserId,
              name: traineeName,
              batch: '',
              email: traineeEmail,
              attempt: pastAttemptFirst.length > 0 ? 'Second' : 'First',
              primaryAttendance: attendance,
              demoDate: demoDate,
              attendanceComment: this.escapeDoublequotes(attendanceComment),
              audioTechIssues: '',
              equipmentLocationIssues: '',
              speedTestLink: '',
              technicalComment: '',
              microphone: -2,
              conceptualExplanation: -2,
              skOverallRatings: -2,
              skComment: '',
              preAssessment: -2,
              adaptation: -2,
              postAssessment: -2,
              sctOverallRating: -2,
              sctAssessmentComment: '',
              interactionEngagement: -2,
              interactionEffort: -2,
              interactionProfessionalism: -2,
              interactionOverallRating: -2,
              interactionComment: '',
              vocabulary: -2,
              pronunciation: -2,
              grammar: -2,
              rateOfSpeech: -2,
              comprehension: -2,
              languageOverallRating: -2,
              languageComment: '',
              identifyingWww: -2,
              identifyingEbi: -2,
              positiveMindset: -2,
              reflectionOverallRating: -2,
              reflectionComment: '',
              sessionFlow: -2,
              classroomResources: -2,
              sessionOps: -2,
              familiarityOverallRating: -2,
              familiarityComment: '',
              sessionRating: -2,
              whatWentWell: '',
              whatNeedsToBeImproved: '',
              finalOutcome: '',
              failReason1: '',
              failReason2: '',
              bsBookingId: bookingId,
              telentlmsId: tlmsId,
              overallSessionRating: '',
              positiveActionsPOne: '',
              positiveActionsPOneComment: '',
              positiveActionsPTwo: '',
              positiveActionsPTwoComment: '',
              positiveActionsPThree: '',
              positiveActionsPThreeComment: '',
              focusAreaPOne: '',
              focusAreaPOneComment: '',
              focusAreaPTwo: '',
              focusAreaPTwoComment: '',
              focusAreaPThree: '',
              focusAreaPThreeComment: '',
              createdBy: createdBy
            }
          });

          // Insert to bs_booking_history table according to attendance
          switch (attendance) {
            case 'dropout':
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +createdBy,
                  booking_status_id: 14, // booking_status_ref_id - DROPOUT
                  candidate_id: bookingStatus.candidate_id,
                  appointment_type_id: 3, // FAS: 3
                  slot_time_id: bookingStatus.time_slot_id,
                  withdraw_reason: 'DROPOUT',
                  date: bookingStatus.date,
                  booking_id: bookingId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              });
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: bookingStatus.candidate_id
                },
                create: {
                  candidate_id: bookingStatus.candidate_id,
                  updatedAt: new Date().toISOString(),
                  step6UpdatedAt: new Date().toISOString(),
                  step6: 'Dropout'
                },
                update: {
                  updatedAt: new Date().toISOString(),
                  step6UpdatedAt: new Date().toISOString(),
                  step6: 'Dropout'
                }
              });
              break;
            case 'no show':
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +createdBy,
                  booking_status_id: 11, // booking_status_ref_id - MISSED
                  candidate_id: bookingStatus.candidate_id,
                  appointment_type_id: 3, // FAS: 3
                  slot_time_id: bookingStatus.time_slot_id,
                  withdraw_reason: 'MISSED',
                  date: bookingStatus.date,
                  booking_id: bookingId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              });
              break;
            case 'reschedule':
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +createdBy,
                  booking_status_id: 7, // booking_status_ref_id - WITHDRAW
                  candidate_id: bookingStatus.candidate_id,
                  appointment_type_id: 3, // FAS: 3
                  slot_time_id: bookingStatus.time_slot_id,
                  withdraw_reason: 'WITHDRAWx',
                  date: bookingStatus.date,
                  booking_id: bookingId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              });
              break;
          }
        } else {
          await tx.demoAssessment.create({
            data: {
              tspId: traineeUserId,
              name: traineeName,
              batch: batch,
              email: traineeEmail,
              attempt: pastAttemptFirst.length > 0 ? 'Second' : 'First',
              primaryAttendance: attendance,
              demoDate: demoDate,
              attendanceComment: this.escapeDoublequotes(attendanceComment),
              audioTechIssues: audioTechIssues.toString(),
              equipmentLocationIssues: equipmentLocationIssues.toString(),
              speedTestLink: speedTestLink,
              technicalComment: this.escapeDoublequotes(technicalComment),
              microphone: mistakesAndMisconceptions,
              conceptualExplanation: conceptualExplanation,
              skOverallRatings: skOverallRatings,
              skComment: this.escapeDoublequotes(skComment),
              preAssessment: preAssessment,
              adaptation: adaptation,
              postAssessment: postAssessment,
              sctOverallRating: sctOverallRating,
              sctAssessmentComment:
                this.escapeDoublequotes(sctAssessmentComment),
              interactionEngagement: interactionEngagement,
              interactionEffort: interactionEffort,
              interactionProfessionalism: interactionProfessionalism,
              interactionOverallRating: interactionOverallRating,
              interactionComment: this.escapeDoublequotes(interactionComment),
              vocabulary: vocabulary,
              pronunciation: pronunciation,
              grammar: grammar,
              rateOfSpeech: rateOfSpeech,
              comprehension: comprehension,
              languageOverallRating: languageOverallRating,
              languageComment: this.escapeDoublequotes(languageComment),
              identifyingWww: identifyingWww,
              identifyingEbi: identifyingEbi,
              positiveMindset: positiveMindset,
              reflectionOverallRating: reflectionOverallRating,
              reflectionComment: this.escapeDoublequotes(reflectionComment),
              sessionFlow: sessionFlow,
              classroomResources: classroomResources,
              sessionOps: sessionOps,
              familiarityOverallRating: familiarityOverallRating,
              familiarityComment: this.escapeDoublequotes(familiarityComment),
              sessionRating: sessionRating,
              whatWentWell: '',
              whatNeedsToBeImproved: '',
              finalOutcome: finalOutcome,
              failReason1: this.escapeDoublequotes(failReason_1),
              failReason2: this.escapeDoublequotes(failReason_2),
              bsBookingId: bookingId,
              telentlmsId: tlmsId,
              overallSessionRating: overallSessionRating,
              positiveActionsPOne: positiveActionsPOne,
              positiveActionsPOneComment: this.escapeDoublequotes(
                positiveActionsPOneComment
              ),
              positiveActionsPTwo: positiveActionsPTwo,
              positiveActionsPTwoComment: this.escapeDoublequotes(
                positiveActionsPTwoComment
              ),
              positiveActionsPThree: positiveActionsPThree,
              positiveActionsPThreeComment: this.escapeDoublequotes(
                positiveActionsPThreeComment
              ),
              focusAreaPOne: focusAreaPOne,
              focusAreaPOneComment:
                this.escapeDoublequotes(focusAreaPOneComment),
              focusAreaPTwo: focusAreaPTwo,
              focusAreaPTwoComment:
                this.escapeDoublequotes(focusAreaPTwoComment),
              focusAreaPThree: focusAreaPThree,
              focusAreaPThreeComment: this.escapeDoublequotes(
                focusAreaPThreeComment
              ),
              createdBy: createdBy
            }
          });

          if (bookingStatus.status !== 4) {
            // if bs_booking_status: status is 4, assume CHECK IN button ins pressed
            await this.prisma.bookingHistory.create({
              data: {
                created_by: +createdBy,
                booking_status_id: 4, // booking_status_ref_id - COMPLETED
                candidate_id: bookingStatus.candidate_id,
                appointment_type_id: 3, // FAS: 3
                slot_time_id: bookingStatus.time_slot_id,
                withdraw_reason: 'COMPLETED',
                date: bookingStatus.date,
                booking_id: bookingId,
                interviewer_id: bookingStatus.interviewer_id
              }
            });
          }
        }

        /*
        *** flag meaning of demo_attempt column in hris_progreee table
        0 - First (Default)
        1 - Second

        2 - Second - Pending
        5 - First - Pending
        -1 - No Show
        -2 - Drop Out

        -3 - Pass - First
        -4 - Pass - Second
        -5 - Pass - Unknown
        -6 - Fail - First
        -7 - Fail - Second
        -8 - Fail - Unknown
        ## - Invalid
        */

        tx.hrisProgress.upsert({
          where: {
            tspId: traineeUserId
          },
          update: {
            demoAttempt: pastAttemptFirst.length > 0 ? 2 : 5
          },
          create: {
            tspId: traineeUserId,
            demoAttempt: pastAttemptFirst.length > 0 ? 2 : 5
          }
        });

        /*
        bsHistoryId === 0
          ? tx.bookingHistory.create({
              data: {
                date: bookingStatus.date,
                slot_time_id: bookingStatus.time_slot_id,
                appointment_type_id: bookingStatus.appointment_type_ref_id,
                booking_status_id: bsBookingHistory,
                withdraw_reason: '',
                candidate_id: bookingStatus.candidate_id
              }
            })
          : tx.bookingStatus.update({
              where: {
                id: bookingId
              },
              data: {
                status: bsBookingStatus
              }
            });
        */

        // mark bs_booking_status: status to completed:4 no matter what
        await this.prisma.bookingStatus.update({
          where: {
            id: bookingId
          },
          data: {
            updated_at: new Date().toISOString(),
            updated_by: +createdBy,
            status: 4 // booking_status_ref_id - COMPLETED
          }
        });
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getCompletedFAS(bookingId?: number, userId?: number, demoId?: number) {
    try {
      if (bookingId) {
        const demoAssessmentData = await this.prisma.demoAssessment.findFirst({
          where: {
            bsBookingId: bookingId
          }
        });
        if (demoAssessmentData) {
          return {
            success: true,
            data: {
              demoAssessmentData
            }
          };
        } else {
          return { success: false };
        }
      } else if (demoId) {
        const demoAssessmentData = await this.prisma.demoAssessment.findUnique({
          where: {
            id: +demoId
          }
        });
        if (demoAssessmentData) {
          return {
            success: true,
            data: {
              demoAssessmentData
            }
          };
        } else {
          return { success: false };
        }
      } else {
        const demoAssessmentData = await this.prisma.demoAssessment.findFirst({
          where: {
            tspId: userId
          }
        });
        if (demoAssessmentData) {
          return {
            success: true,
            data: {
              demoAssessmentData
            }
          };
        } else {
          return { success: false };
        }
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  escapeDoublequotes(input: string) {
    return input ? input.replace(/"/g, '""') : input;
  }
}
