import { HttpException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import 'moment-timezone';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import {
  TeachingInterviewDto,
  TeachingInterviewListDto
} from './teaching-interview.dto';

@Injectable()
export class TeachingInterviewService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async getCandidateDetailsByBookingStatus4ti(
    bookingStatusId: number,
    accessState?: string,
    tiRecordId?: number
  ) {
    try {
      //bs_booking_status > status is expected to be (3: Booked, 4: Completed)
      const bookingStatus = await this.prisma.bookingStatus.findUnique({
        where: {
          id: +bookingStatusId
        },
        select: {
          date: true,
          candidate_id: true,
          status: true,
          appointment_type_ref_id: true,
          interviewer_id: true,
          interviewer: {
            select: {
              username: true
            }
          },
          bs_all_booking_slot: {
            select: {
              slot_time: true
            }
          }
        }
      });
      if (bookingStatus === undefined || bookingStatus === null) {
        return {
          success: false,
          data: null
        };
      }
      const candidateTspId = bookingStatus.candidate_id;

      const data = await this.prisma.user.findUnique({
        where: {
          tsp_id: +candidateTspId
        },
        select: {
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          approved_contact_data: {
            select: {
              mobileNumber: true,
              residingCountry: true,
              workEmail: true
            }
          }
        }
      });

      let interviewReconsider = null;
      let bookingCompleted = null;

      if (accessState && accessState === 'view' && tiRecordId) {
        bookingCompleted = await this.prisma.teachingInterview.findUnique({
          where: {
            id: +tiRecordId
          }
        });
      } else {
        //check if candidate has exisiting reconsider outcome entry
        interviewReconsider = await this.prisma.teachingInterview.findFirst({
          where: {
            AND: [{ tspId: +candidateTspId }, { status: 'Reconsider' }]
          },
          select: {
            status: true
          },
          orderBy: {
            id: 'desc'
          }
        });

        //check if exist a interview entry with same booking id (for same candidate)
        bookingCompleted = await this.prisma.teachingInterview.findFirst({
          where: {
            AND: [{ tspId: +candidateTspId }, { bsBookingId: +bookingStatusId }]
          },
          orderBy: {
            id: 'desc'
          }
        });
      }

      return {
        success: true,
        data: {
          candidate: {
            tutorName: data.approved_personal_data?.shortName ?? '',
            tspId: +candidateTspId,
            dateTime: `${moment(bookingStatus.date).format('DD-MM-YYYY')} | ${
              bookingStatus.bs_all_booking_slot.slot_time
            }`,
            tutorEmail: data.approved_contact_data?.workEmail ?? '',

            tutorContact: data.approved_contact_data?.mobileNumber ?? '',
            tutorCountry: data.approved_contact_data?.residingCountry ?? '',
            interviewerEmail: bookingStatus.interviewer?.username ?? '',

            bookingId: +bookingStatusId,
            bookingState: +bookingStatus.status,
            interviewerId: +bookingStatus.interviewer_id,
            isSecondAttempt: interviewReconsider
              ? interviewReconsider.status
              : 'No',
            isBookingCompleted: bookingCompleted
              ? bookingCompleted.status
              : 'No'
          },
          bookingCompleted: bookingCompleted ?? null,
          accessState: accessState ?? ''
        }
      };
    } catch (error) {
      throw new Error(error);
    }
  } //end: getCandidateDetailsByBookingStatus4ti

  /**
   *
   * @param tspId
   * @param details
   * @returns
   */
  async submitTeachingInterview(tspId: number, details: TeachingInterviewDto) {
    try {
      const HasBooking = await this.prisma.teachingInterview.findMany({
        where: {
          bsBookingId: details.bsBookingId
        }
      });

      if (HasBooking && HasBooking.length > 0) {
        await this.prisma.systemErrorLog.create({
          data: {
            system: 'gra',
            subSystem: 'ti',
            function: 'submitTeachingInterview',
            location:
              'apps/gra-server/src/app/teaching-interview/teaching-interview.service.ts',
            description:
              `Failed attempt by ${tspId} to submit ti of booking_id ` +
              `${details.bsBookingId} for ${details.tutorEmail} - ${details.tspId} ` +
              `due to repeated booking_id`,
            createdAt: moment().tz('Asia/Colombo').toISOString(),
            createdBy: +tspId
          }
        });
        throw new HttpException(
          {
            success: false,
            error: `Duplicate booking found for Booking Id: ${details.bsBookingId}`
          },
          400
        );
      }

      const data = await this.prisma.teachingInterview.create({
        data: {
          tspId: details.tspId,
          date: new Date().toISOString(),
          attendance: details.attendance,
          attendComment: this.escapeDoublequotes(details.attendComment),
          workingPlace: details.workingPlace,
          preparation: details.preparation,
          slideUsed: details.slideUsed,
          safeguardingQuestion: details.safeguardingQuestion,
          safeguarding: details.safeguarding,
          safeguardingComment: this.escapeDoublequotes(
            details.safeguardingComment
          ),
          lanVocabulary: details.lanVocabulary,
          lanPronunciation: details.lanPronunciation,
          lanComprehension: details.lanComprehension,
          lanGrammar: details.lanGrammar,
          lanRateOfSpeech: details.lanRateOfSpeech,
          lanComment: this.escapeDoublequotes(details.lanComment),
          lanPillarRate: details.lanPillarRate,
          skMistakes: details.skMistakes,
          skConceptual: details.skConceptual,
          skKnowledgePillarRate: details.skKnowledgePillarRate,
          skKnowledgeComment: this.escapeDoublequotes(
            details.skKnowledgeComment
          ),
          assesPreAssessment: details.assesPreAssessment,
          assesAdaptation: details.assesAdaptation,
          assesPostAssessment: details.assesPostAssessment,
          assesAssessmentPillarRating: details.assesAssessmentPillarRating,
          assesAssessmentComment: this.escapeDoublequotes(
            details.assesAssessmentComment
          ),
          intToneOfVoice: details.intToneOfVoice,
          intProfessionalInteraction: details.intProfessionalInteraction,
          intInteractionPillarRating: details.intInteractionPillarRating,
          intInteractionComment: this.escapeDoublequotes(
            details.intInteractionComment
          ),
          familiarityPreparedTopic: details.familiarityPreparedTopic,
          familiarityResources: details.familiarityResources,
          familiarityPillarRating: details.familiarityPillarRating,
          familiarityComment: this.escapeDoublequotes(
            details.familiarityComment
          ),
          strength: details.strength,
          improvement: details.improvement,
          additionalComment: this.escapeDoublequotes(details.additionalComment),
          subjectKnowledgeQuestion: details.subjectKnowledgeQuestion,
          subjectKnowledge: details.subjectKnowledge,
          subjectKnowledgeComment: this.escapeDoublequotes(
            details.subjectKnowledgeComment
          ),
          redflag: details.redflag,
          redflagComment: this.escapeDoublequotes(details.redflagComment),
          secondOpinion: details.secondOpinion,
          generalComment: this.escapeDoublequotes(details.generalComment),
          status: details.status,
          passTarget1Pillar: details.passTarget1Pillar,
          passTarget1Targets: details.passTarget1Targets,
          passExplain: this.escapeDoublequotes(details.passExplain),
          passTarget2Pillar: details.passTarget2Pillar,
          passTarget2Targets: details.passTarget2Targets,
          passExplain2: this.escapeDoublequotes(details.passExplain2),
          failReason1: details.failReason1,
          failReason2: details.failReason2,
          failComment: this.escapeDoublequotes(details.failComment),
          incompleteCompletedUntil: details.incompleteCompletedUntil,
          incompleteComment: this.escapeDoublequotes(details.incompleteComment),
          // emailStatus: details.emailStatus,
          tutorEmail: details.tutorEmail,
          tutorName: details.tutorName,
          // createdByEmail: details.createdByEmail,
          // demoAttempt: details.demoAttempt,
          bsBookingId: details.bsBookingId,
          orientationDate: details.orientationDate
            ? new Date(details.orientationDate).toISOString()
            : null,
          orientationTime: details.orientationTime,
          orientationUrl: details.orientationUrl,
          reconsiderReason: this.escapeDoublequotes(details.reconsiderReason),
          createdBy: tspId
        }
      });

      // '1', 'AVAILABLE'
      // '2', 'NOT_BOOKED'
      // '3', 'BOOKED'
      // '4', 'COMPLETED'
      // '5', 'NOT_COMPLETED'
      // '6', 'ACTIVE'
      // '7', 'WITHDRAW'
      // '8', 'COVER'
      // '9', 'FAILED'
      // '10', 'PASSED'
      // '11', 'MISSED'
      // '12', 'RE_PREPARE'
      // '13', 'REMOVE'
      // '14', 'DROPOUT'

      /**
       * fetching bs_booking_status record from booking_id to:
       * do validations
       * get data to make bs_booking_history table entries
       */
      const bookingStatus = await this.prisma.bookingStatus.findUnique({
        where: {
          id: +details.bsBookingId
        },
        select: {
          interviewer_id: true,
          time_slot_id: true,
          candidate_id: true,
          status: true,
          date: true,
          appointment_type_ref_id: true,
          candidate: {
            select: {
              username: true,
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
          }
        }
      });

      //check if candidate has exisiting reconsider outcome entry
      const interviewReconsider = await this.prisma.teachingInterview.findMany({
        where: {
          AND: [
            { tspId: +bookingStatus.candidate_id },
            { status: 'Reconsider' }
          ]
        },
        select: {
          id: true
        },
        orderBy: {
          id: 'desc'
        },
        take: 1
      });

      //get nationality to send the orientation handbook
      const nationality = await this.prisma.approvedPersonalData.findUnique({
        where: {
          tspId: details.tspId
        },
        select: {
          nationality: true
        }
      });

      let orientationHandbookUrl;

      if (nationality && nationality.nationality === 'Sri Lankan') {
        orientationHandbookUrl =
          'https://heyzine.com/flip-book/38a3864192.html';
      } else if (nationality && nationality.nationality === 'Indian') {
        orientationHandbookUrl =
          'https://heyzine.com/flip-book/0da0c63d37.html';
      } else {
        orientationHandbookUrl = '';
      }

      switch (details.attendance) {
        //check attendance
        case 'Attended': {
          switch (details.status) {
            //check final outcome
            case 'Pass': {
              if (bookingStatus.status != 4) {
                //if bookingStatus.status is 4 - assume Checkin button used. marked completed
                await this.prisma.bookingHistory.create({
                  data: {
                    created_by: +tspId,
                    date: bookingStatus.date,
                    slot_time_id: bookingStatus.time_slot_id,
                    appointment_type_id: 2, // TI: 2
                    booking_status_id: 4, // booking_status_ref_id - COMPLETED
                    withdraw_reason: 'COMPLETED',
                    candidate_id: bookingStatus.candidate_id,
                    booking_id: details.bsBookingId,
                    interviewer_id: bookingStatus.interviewer_id
                  }
                });
              }
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +tspId,
                  date: bookingStatus.date,
                  slot_time_id: bookingStatus.time_slot_id,
                  appointment_type_id: 2, // TI: 2
                  booking_status_id: 10, // booking_status_ref_id - PASSED
                  withdraw_reason: 'PASSED',
                  candidate_id: bookingStatus.candidate_id,
                  booking_id: details.bsBookingId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              });
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: bookingStatus.candidate_id
                },
                create: {
                  candidate_id: bookingStatus.candidate_id,
                  level: 6,
                  updatedAt: new Date().toISOString(),
                  step5UpdatedAt: new Date().toISOString(),
                  step5: 'Pass'
                },
                update: {
                  level: 6,
                  updatedAt: new Date().toISOString(),
                  step5UpdatedAt: new Date().toISOString(),
                  step5: 'Pass'
                }
              });

              // update previous reconsider entry if exisit
              interviewReconsider[0]
                ? await this.prisma.teachingInterview.update({
                    where: {
                      id: interviewReconsider[0].id
                    },
                    data: {
                      status: 'Reconsider_Pass'
                    }
                  })
                : null;
              // refactored HRIS your information section
              const frontendURL =
                process.env.FRONT_URL ?? 'http://localhost:4200/';
              const detailsUrl = frontendURL + 'general-information';

              //Send TI Pass Email
              await this.mail.sendTIPassEmail(
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
                details.passTarget1Targets,
                details.passExplain,
                details.passTarget2Targets,
                details.passExplain2,
                details.orientationDate
                  ? moment(details.orientationDate).format('DD-MM-YYYY')
                  : '',
                details.orientationTime,
                details.orientationUrl,
                details.orientationDate
                  ? moment(details.orientationDate)
                      .add(2, 'days')
                      .format('DD-MM-YYYY')
                  : '',
                orientationHandbookUrl,
                detailsUrl
              );

              const tutorTimeSlot = await this.prisma.gOATutorsSlots.findMany({
                where: {
                  tsp_id: bookingStatus.candidate_id
                }
              });

              if (!tutorTimeSlot) {
                // add default tutor-availability slots
                const today = moment().toISOString();
                //Get all the slots available
                const slots = await this.prisma.gOASlot.findMany();
                const begin = moment().isoWeekday(1).utc(true).format();

                const availabilityData = slots.map((s) => {
                  return {
                    slot_id: s.id,
                    slot_status_id: 5,
                    effective_date: begin,
                    hour_status: '',
                    created_at: today,
                    created_by: bookingStatus.candidate_id
                  };
                });

                await this.prisma.$transaction(async (tx) => {
                  await tx.gOATutorsSlots.create({
                    data: {
                      tsp_id: bookingStatus.candidate_id,
                      effective_date: begin,
                      hour_status: '',
                      created_at: today,
                      updated_at: today,
                      GOATutorSlotsDetails: {
                        createMany: {
                          data: availabilityData
                        }
                      }
                    }
                  });
                });
                // end: add default tutor-availability slots
              }

              // updates related to hris
              await this.prisma.$transaction(async (tx) => {
                await tx.hrisProgress.upsert({
                  where: {
                    tspId: details.tspId
                  },
                  create: {
                    tspId: details.tspId,
                    tutorStatus: 'onboarding ready',
                    profileStatus: 'onboarding ready',
                    submitedAt: new Date().toISOString()
                  },
                  update: {
                    tutorStatus: 'onboarding ready',
                    profileStatus: 'onboarding ready',
                    submitedAt: new Date().toISOString()
                  }
                });

                await tx.hrisAuditedData.create({
                  data: {
                    tspId: details.tspId,
                    tutorStatus: 'onboarding ready',
                    createdBy: details.tspId
                  }
                });
                return true;
              });

              break;
            }
            case 'Fail': {
              if (bookingStatus.status != 4) {
                await this.prisma.bookingHistory.create({
                  data: {
                    created_by: +tspId,
                    date: bookingStatus.date,
                    slot_time_id: bookingStatus.time_slot_id,
                    appointment_type_id: 2, // TI: 2
                    booking_status_id: 4, // booking_status_ref_id - COMPLETED
                    withdraw_reason: 'COMPLETED',
                    candidate_id: bookingStatus.candidate_id,
                    booking_id: details.bsBookingId,
                    interviewer_id: bookingStatus.interviewer_id
                  }
                });
              }
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +tspId,
                  date: bookingStatus.date,
                  slot_time_id: bookingStatus.time_slot_id,
                  appointment_type_id: 2, // TI: 2
                  booking_status_id: 9, // booking_status_ref_id - FAILED
                  withdraw_reason: 'FAILED',
                  candidate_id: bookingStatus.candidate_id,
                  booking_id: details.bsBookingId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              });
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: bookingStatus.candidate_id
                },
                create: {
                  candidate_id: bookingStatus.candidate_id,
                  updatedAt: new Date().toISOString(),
                  step5UpdatedAt: new Date().toISOString(),
                  step5: 'Fail'
                },
                update: {
                  updatedAt: new Date().toISOString(),
                  step5UpdatedAt: new Date().toISOString(),
                  step5: 'Fail'
                }
              });

              // update previous reconsider entry if exisit
              interviewReconsider[0]
                ? await this.prisma.teachingInterview.update({
                    where: {
                      id: interviewReconsider[0].id
                    },
                    data: {
                      status: 'Reconsider_Fail'
                    }
                  })
                : null;

              // Send TI Fail Email
              await this.mail.sendTIFailEmail(
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
                details.failComment
              );
              break;
            }
            case 'Reconsider': {
              if (bookingStatus.status != 4) {
                await this.prisma.bookingHistory.create({
                  data: {
                    created_by: +tspId,
                    date: bookingStatus.date,
                    slot_time_id: bookingStatus.time_slot_id,
                    appointment_type_id: 2, // TI: 2
                    booking_status_id: 4, // booking_status_ref_id - COMPLETED
                    withdraw_reason: 'COMPLETED',
                    candidate_id: bookingStatus.candidate_id,
                    booking_id: details.bsBookingId,
                    interviewer_id: bookingStatus.interviewer_id
                  }
                });
              }
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +tspId,
                  date: bookingStatus.date,
                  slot_time_id: bookingStatus.time_slot_id,
                  appointment_type_id: 2, // TI: 2
                  booking_status_id: 12, // booking_status_ref_id - RE_PREPARE
                  withdraw_reason: 'RE_PREPARE',
                  candidate_id: bookingStatus.candidate_id,
                  booking_id: details.bsBookingId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              });
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: bookingStatus.candidate_id
                },
                create: {
                  candidate_id: bookingStatus.candidate_id,
                  updatedAt: new Date().toISOString(),
                  step5UpdatedAt: new Date().toISOString(),
                  step5: 'Reconsider'
                },
                update: {
                  updatedAt: new Date().toISOString(),
                  step5UpdatedAt: new Date().toISOString(),
                  step5: 'Reconsider'
                }
              });

              // Send TI Reconsider Email
              await this.mail.sendTIFailReconsiderEmail(
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
                details.failComment
              );
              break;
            }
            case 'Incomplete Interview': {
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +tspId,
                  date: bookingStatus.date,
                  slot_time_id: bookingStatus.time_slot_id,
                  appointment_type_id: 2, // TI: 2
                  booking_status_id: 4, // booking_status_ref_id - NOT_COMPLETED
                  withdraw_reason: 'NOT_COMPLETED',
                  candidate_id: bookingStatus.candidate_id,
                  booking_id: details.bsBookingId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              });

              // Send TI Incomplete Email
              await this.mail.sendTIResheduleEmail(
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
              );
              break;
            }
            default: {
              // WHAT TO DO HERE ?
              break;
            }
          }
          break;
        }
        case 'No Show': {
          await this.prisma.bookingHistory.create({
            data: {
              created_by: +tspId,
              date: bookingStatus.date,
              slot_time_id: bookingStatus.time_slot_id,
              appointment_type_id: 2, // TI: 2
              booking_status_id: 11, // booking_status_ref_id - MISSED
              withdraw_reason: 'MISSED',
              candidate_id: bookingStatus.candidate_id,
              booking_id: details.bsBookingId,
              interviewer_id: bookingStatus.interviewer_id
            }
          });

          //Send TI No Show Email
          await this.mail.sendTINoshowEmail(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
          );

          break;
        }
        case 'Drop Out': {
          await this.prisma.bookingHistory.create({
            data: {
              created_by: +tspId,
              date: bookingStatus.date,
              slot_time_id: bookingStatus.time_slot_id,
              appointment_type_id: 2, // TI: 2
              booking_status_id: 14, // booking_status_ref_id - DROPOUT
              withdraw_reason: 'DROPOUT',
              candidate_id: bookingStatus.candidate_id,
              booking_id: details.bsBookingId,
              interviewer_id: bookingStatus.interviewer_id
            }
          });

          // update bs_candidate level
          await this.prisma.candidateLevel.upsert({
            where: {
              candidate_id: bookingStatus.candidate_id
            },
            create: {
              candidate_id: bookingStatus.candidate_id,
              updatedAt: new Date().toISOString(),
              step5UpdatedAt: new Date().toISOString(),
              step5: 'Dropout'
            },
            update: {
              updatedAt: new Date().toISOString(),
              step5UpdatedAt: new Date().toISOString(),
              step5: 'Dropout'
            }
          });

          // update previous reconsider entry if exisit
          interviewReconsider[0]
            ? await this.prisma.teachingInterview.update({
                where: {
                  id: interviewReconsider[0].id
                },
                data: {
                  status: 'Reconsider_Drop Out'
                }
              })
            : null;

          //Send TI Drop Out Email
          await this.mail.sendTIDropoutEmail(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
          );

          break;
        }
        case 'Reschedule': {
          await this.prisma.bookingHistory.create({
            data: {
              created_by: +tspId,
              date: bookingStatus.date,
              slot_time_id: bookingStatus.time_slot_id,
              appointment_type_id: 2, // TI: 2
              booking_status_id: 7, // booking_status_ref_id - WITHDRAW
              withdraw_reason: 'WITHDRAWx',
              candidate_id: bookingStatus.candidate_id,
              booking_id: details.bsBookingId,
              interviewer_id: bookingStatus.interviewer_id
            }
          });

          //Send TI Reshedule Email
          await this.mail.sendTIResheduleEmail(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
          );

          break;
        }
      } //end: switch: attendance

      /**
       * update bs_booking_status: status to completed: 4 despite what happens
       */
      await this.prisma.bookingStatus.update({
        where: {
          id: +details.bsBookingId
        },
        data: {
          updated_at: new Date().toISOString(),
          updated_by: +tspId,
          status: 4 // booking_status_ref_id - COMPLETED
        }
      });

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('ti submit fail', error.message);
      throw new Error(error);
    }
  } //end: submitTeachingInterview

  /**
   * Handle fetching Previous Teaching Interview entries for TI Master Table
   * @param take
   * @param skip
   * @param tspid
   * @param candiName
   * @param finalOutcome
   * @returns
   */
  async getTiList(
    take,
    skip,
    tspId,
    candiName,
    finalOutcome,
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
      const filterWhereClause = {
        tspId: tspId ? { in: tspIds } : {},
        user: {
          approved_personal_data: {
            shortName: candiName ? { contains: candiName } : {}
          }
        },
        status: finalOutcome !== '' ? { startsWith: finalOutcome } : {},
        date:
          startDate && endDate && startDate !== '' && endDate !== ''
            ? {
                gte: moment(startDate).startOf('date').toISOString(),
                lte: moment(endDate).endOf('date').toISOString()
              }
            : {}
      };

      const [count, details] = await this.prisma.$transaction([
        this.prisma.teachingInterview.count({
          where: filterWhereClause
        }),
        this.prisma.teachingInterview.findMany({
          take,
          skip,
          where: filterWhereClause,
          select: {
            id: true,
            tspId: true,
            bsBookingId: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                approved_personal_data: {
                  select: {
                    tspId: true,
                    shortName: true
                  }
                },
                approved_contact_data: {
                  select: {
                    workEmail: true,
                    mobileNumber: true
                  }
                }
              }
            }
            // bookingStatus: {
            //   select: {
            //     date: true,
            //     bs_all_booking_slot: {
            //       select: {
            //         slot_time: true
            //       }
            //     },
            //   }
            // },
          },
          orderBy: {
            id: 'asc'
          }
        })
      ]);

      // const data = details;
      const data = details.flatMap((detail, index) => {
        return {
          id: detail.id,
          tspId: detail.tspId,
          bsBookingId: detail.bsBookingId,
          status: detail.status,
          shortName: detail.user.approved_personal_data?.shortName,
          workEmail: detail.user.approved_contact_data?.workEmail,
          mobileNumber: detail.user.approved_contact_data?.mobileNumber,
          date: moment(detail.createdAt)
            .tz('Asia/Kolkata')
            .format('DD/MM/YYYY'), //change datetime timezone to Sri Lanka
          time: moment(detail.createdAt).tz('Asia/Kolkata').format('HH:mm:ss')
        };
      });

      return { success: true, data, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  } //end: getTiList

  async exportTeachingInterview({
    tspId,
    candiName,
    finalOutcome,
    startDate,
    endDate
  }: Omit<TeachingInterviewListDto, 'take' | 'skip'>) {
    try {
      const isWhere =
        tspId || candiName || finalOutcome || startDate || endDate;

      const tspIds =
        tspId &&
        tspId
          .replace(/[^\d,]/g, '')
          .split(',')
          .map(Number)
          .filter(Boolean);
      const filterWhereClause = isWhere
        ? {
            tspId: tspId ? { in: tspIds } : {},
            user: {
              approved_personal_data: {
                shortName: candiName ? { contains: candiName } : {}
              }
            },
            status: finalOutcome ? { startsWith: finalOutcome } : {},
            date:
              startDate && endDate && startDate !== '' && endDate !== ''
                ? {
                    // gt: moment(startDate)
                    //   .startOf('date')
                    //   .toDate()
                    //   .toISOString(),
                    // lt: moment(endDate).endOf('date').toDate().toISOString()

                    gte: moment(startDate).startOf('date').toISOString(),
                    lte: moment(endDate).endOf('date').toISOString()
                  }
                : {}
          }
        : {};

      const [count, details] = await this.prisma.$transaction([
        this.prisma.teachingInterview.count({
          where: filterWhereClause
        }),
        this.prisma.teachingInterview.findMany({
          where: filterWhereClause,
          select: {
            id: true,
            tspId: true,
            bsBookingId: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                approved_personal_data: {
                  select: {
                    tspId: true,
                    shortName: true
                  }
                },
                approved_contact_data: {
                  select: {
                    workEmail: true,
                    mobileNumber: true
                  }
                }
              }
            }
          },
          orderBy: {
            id: 'asc'
          }
        })
      ]);

      // const data = details;
      const data = details.flatMap((detail, index) => {
        return {
          id: detail.id,
          tspId: detail.tspId,
          bsBookingId: detail.bsBookingId,
          status: detail.status,
          shortName: detail.user.approved_personal_data?.shortName,
          workEmail: detail.user.approved_contact_data?.workEmail,
          mobileNumber: detail.user.approved_contact_data?.mobileNumber,
          date: moment(detail.createdAt)
            .tz('Asia/Kolkata')
            .format('DD/MM/YYYY'), //change datetime timezone to Sri Lanka
          time: moment(detail.createdAt).tz('Asia/Kolkata').format('HH:mm:ss')
        };
      });

      return { success: true, data, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  escapeDoublequotes(input: string) {
    return input ? input.replace(/"/g, '""') : input;
  }
}
