import { HttpException, Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import moment = require('moment');
import {
  FtAssessmentListDto,
  SendFtAssessmentFinalEmailDto
} from './ft-assessment.dto';

@Injectable()
export class FtAssessmentService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  private readonly appointmentTypeIdFtaObj = { 1: 6, 2: 7 }; //bs_candidate_level 6, 7 processing interview

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

  async fetchFtAssessmentByBookingId(
    bsBookingId: number,
    foundationTrainingLevel: 1 | 2,
    accessState?: string,
    ftaRecordId?: number
  ) {
    try {
      console.log(
        'fetchFtAssessmentByBookingId',
        bsBookingId,
        foundationTrainingLevel,
        accessState,
        ftaRecordId
      );

      //bs_booking_status > status is expected to be (3: Booked, 4: Completed)
      const bookingStatus = await this.prisma.bookingStatus.findUnique({
        where: {
          id: +bsBookingId
        },
        select: {
          date: true,
          candidate_id: true,
          status: true,
          appointment_type_ref_id: true,
          interviewer_id: true,
          interviewer: {
            select: {
              username: true,
              approved_personal_data: {
                select: { shortName: true }
              }
            }
          },
          bs_all_booking_slot: {
            select: {
              slot_time: true
            }
          }
        }
      });

      if (
        !bookingStatus ||
        !bookingStatus.candidate_id ||
        bookingStatus.appointment_type_ref_id !=
          this.appointmentTypeIdFtaObj[foundationTrainingLevel]
      ) {
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
              shortName: true,
              nic: true
            }
          },
          approved_contact_data: {
            select: {
              mobileNumber: true,
              residingCountry: true,
              workEmail: true
            }
          },
          ApprovedJobRequisition: {
            select: { batch: true }
          }
        }
      });

      let interviewReconsider = null;
      let bookingCompleted = null;

      if (accessState && accessState === 'view' && ftaRecordId) {
        bookingCompleted = await this.prisma.ftAssessment.findUnique({
          where: {
            id: +ftaRecordId
          }
        });
      } else {
        //check if candidate has exisiting reconsider outcome entry
        interviewReconsider = await this.prisma.ftAssessment.findFirst({
          where: {
            AND: [{ tspId: +candidateTspId }, { finalOutcome: 'Reconsider' }]
          },
          select: {
            finalOutcome: true
          },
          orderBy: {
            id: 'desc'
          }
        });

        //check if exist a interview entry with same booking id (for same candidate)
        bookingCompleted = await this.prisma.ftAssessment.findFirst({
          where: {
            AND: [{ tspId: +candidateTspId }, { bsBookingId: +bsBookingId }]
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
            candidateName: data.approved_personal_data?.shortName ?? '-',
            candidateEmail: data.approved_contact_data?.workEmail ?? '-',
            candidateBatch: data.ApprovedJobRequisition?.batch ?? '-',
            tspId: +candidateTspId,
            foundationTrainingLevel: foundationTrainingLevel,
            // dateTime: `${moment(bookingStatus.date).format('DD-MM-YYYY')} | ${
            //   bookingStatus.bs_all_booking_slot.slot_time
            // }`,
            demoAttempt: bookingCompleted
              ? bookingCompleted.demoAttempt
              : interviewReconsider
              ? 2
              : 1,

            // candidateNic: data.approved_personal_data?.nic ?? '',
            // candidateContact: data.approved_contact_data?.mobileNumber ?? '',
            candidateCountry: data.approved_contact_data?.residingCountry ?? '',
            interviewerName: bookingStatus.interviewer?.approved_personal_data
              ?.shortName
              ? bookingStatus.interviewer?.approved_personal_data?.shortName
              : bookingStatus.interviewer?.username ?? '-',
            // interviewerEmail: bookingStatus.interviewer?.username ?? '',

            bsBookingId: +bsBookingId,
            bookingState: +bookingStatus.status,
            interviewerId: +bookingStatus.interviewer_id,
            isBookingCompleted: bookingCompleted
              ? bookingCompleted.finalOutcome
              : 'No'
          },
          bookingCompleted: bookingCompleted ?? null,
          accessState: accessState ?? ''
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: fetchFtAssessmentByBookingId

  async submitFtAssessment(tspId: number, details: any) {
    const isHrAdmin = true; //TODO: add logic to check if admin
    try {
      // console.log('submitFtAssessment_details', details);
      // console.log(
      //   'appointmentTypeIdFtaObj',
      //   Object.keys(this.appointmentTypeIdFtaObj)
      // );
      if (
        !details.tspId ||
        !details.bsBookingId ||
        !details.attendance ||
        !Object.keys(this.appointmentTypeIdFtaObj).includes(
          details.foundationTrainingLevel + ''
        )
      ) {
        throw new HttpException(
          {
            success: false,
            error: `Missing data for FTA submission`
          },
          400
        );
      }

      const HasBookingNotes = await this.prisma.ftAssessment.findFirst({
        where: {
          bsBookingId: details.bsBookingId
        },
        orderBy: { id: 'desc' }
      });

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

      const emailSentFlag =
        +details.saveDraft === 0 &&
        details.attendance &&
        !details.attendance.includes('Attended -')
          ? 1
          : 0;
      let createdRecord = null;

      if (HasBookingNotes) {
        createdRecord = null;
        if (HasBookingNotes.emailSent === 1) {
          console.log('Email already sent. Cannot update.');
          await this.prisma.systemErrorLog.create({
            data: {
              system: 'gra',
              subSystem: 'ia',
              function: 'submitFtAssessment',
              location:
                'apps/gra-server/src/app/ft-assessment/ft-assessment.service.ts',
              description:
                `Failed attempt by ${tspId} to submit fta of booking_id ` +
                `${details.bsBookingId} for ${details.tutorEmail} - ${details.tspId} ` +
                `due to email already sent`,
              createdAt: moment().tz('Asia/Colombo').toISOString(),
              createdBy: +tspId
            }
          });
          throw new HttpException(
            {
              success: false,
              error: `Email already sent for Booking Id: ${details.bsBookingId}`
            },
            400
          );
        } else if (
          HasBookingNotes.saveDraft === 1 ||
          (HasBookingNotes.saveDraft === 0 && isHrAdmin)
        ) {
          console.log(
            'Exisiting record. Proceed to update if its a draft save or admin is saving'
          );
          createdRecord = await this.prisma.ftAssessment.update({
            where: {
              id: HasBookingNotes.id
            },
            data: {
              foundationTrainingLevel: +details.foundationTrainingLevel,
              tspId: details.tspId,
              bsBookingId: details.bsBookingId,
              demoDate: bookingStatus?.date ?? null,
              demoAttempt: details.demoAttempt ?? 0,
              batch: details.batch || null,
              saveDraft:
                HasBookingNotes.saveDraft === 0 ? 0 : +details.saveDraft,
              emailSent: emailSentFlag,

              attendance: details.attendance,
              attendanceComment:
                this.escapeDoublequotes(details.attendanceComment) ?? '',
              a1LocationCheck: details.a1LocationCheck || null,
              a2Familiar1SessionPage: details.a2Familiar1SessionPage || null,
              a2Familiar2LaunchSession:
                details.a2Familiar2LaunchSession || null,
              a2Familiar3StudentProfile:
                details.a2Familiar3StudentProfile || null,
              a2Familiar4Troubleshooting:
                details.a2Familiar4Troubleshooting || null,
              a2Familiar5NextLesson: details.a2Familiar5NextLesson || null,
              a2Familiar6EndSession: details.a2Familiar6EndSession || null,
              a2Familiar7FillPsff: details.a2Familiar7FillPsff || null,
              p1Environment: details.p1Environment || null,
              p1EnvironmentComment:
                this.escapeDoublequotes(details.p1EnvironmentComment) ?? '',
              p2NonSessionConduct: details.p2NonSessionConduct || null,
              p2NonSessionConductComment:
                this.escapeDoublequotes(details.p2NonSessionConductComment) ??
                '',
              p3InSessionConduct: details.p3InSessionConduct || null,
              p3InSessionConductComment:
                this.escapeDoublequotes(details.p3InSessionConductComment) ??
                '',
              p4Safeguarding: details.p4Safeguarding || null,
              p4SafeguardingComment:
                this.escapeDoublequotes(details.p4SafeguardingComment) ?? '',
              p5Language: details.p5Language || null,
              p5LanguageComment:
                this.escapeDoublequotes(details.p5LanguageComment) ?? '',
              p6SctInteraction: details.p6SctInteraction || null,
              p6SctInteractionComment:
                this.escapeDoublequotes(details.p6SctInteractionComment) ?? '',
              p7SctAssessment: details.p7SctAssessment || null,
              p7SctAssessmentComment:
                this.escapeDoublequotes(details.p7SctAssessmentComment) ?? '',
              p8MathematicalInstruction:
                details.p8MathematicalInstruction || null,
              p8MathematicalInstructionComment:
                this.escapeDoublequotes(
                  details.p8MathematicalInstructionComment
                ) ?? '',
              whatWentWellP1: details.whatWentWellP1 || null,
              whatWentWellP1Comment:
                this.escapeDoublequotes(details.whatWentWellP1Comment) ?? '',
              whatWentWellP2: details.whatWentWellP2 || null,
              whatWentWellP2Comment:
                this.escapeDoublequotes(details.whatWentWellP2Comment) ?? '',
              areaOfImprovementP1: details.areaOfImprovementP1 || null,
              areaOfImprovementP1Comment:
                this.escapeDoublequotes(details.areaOfImprovementP1Comment) ??
                '',
              areaOfImprovementP2: details.areaOfImprovementP2 || null,
              areaOfImprovementP2Comment:
                this.escapeDoublequotes(details.areaOfImprovementP2Comment) ??
                '',
              monitoringComment:
                this.escapeDoublequotes(details.monitoringComment) ?? '',
              generalComment:
                this.escapeDoublequotes(details.generalComment) ?? '',
              finalOutcome: details.finalOutcome || null,
              failReason: details.failReason || null,
              failReasonOther:
                this.escapeDoublequotes(details.failReasonOther) ?? '',

              updatedBy: tspId,
              updatedAt: new Date().toISOString()
            }
          });
        } else {
          console.log('Exisiting submission');
          await this.prisma.systemErrorLog.create({
            data: {
              system: 'gra',
              subSystem: 'ia',
              function: 'submitFtAssessment',
              location:
                'apps/gra-server/src/app/ft-assessment/ft-assessment.service.ts',
              description:
                `Failed attempt by ${tspId} to submit fta of booking_id ` +
                `${details.bsBookingId} for ${details.tutorEmail} - ${details.tspId} ` +
                `due to exisiting submission`,
              createdAt: moment().tz('Asia/Colombo').toISOString(),
              createdBy: +tspId
            }
          });
          throw new HttpException(
            {
              success: false,
              error: `Exisitign submission for Booking Id: ${details.bsBookingId}`
            },
            400
          );
        }
      } else {
        console.log('No previous records. Proceed to create');
        createdRecord = await this.prisma.ftAssessment.create({
          data: {
            foundationTrainingLevel: +details.foundationTrainingLevel,
            tspId: details.tspId,
            bsBookingId: details.bsBookingId,
            demoDate: bookingStatus?.date ?? null,
            demoAttempt: details.demoAttempt ?? 0,
            batch: details.batch || null,
            saveDraft: +details.saveDraft,
            emailSent: emailSentFlag,

            attendance: details.attendance,
            attendanceComment:
              this.escapeDoublequotes(details.attendanceComment) ?? '',
            a1LocationCheck: details.a1LocationCheck || null,
            a2Familiar1SessionPage: details.a2Familiar1SessionPage || null,
            a2Familiar2LaunchSession: details.a2Familiar2LaunchSession || null,
            a2Familiar3StudentProfile:
              details.a2Familiar3StudentProfile || null,
            a2Familiar4Troubleshooting:
              details.a2Familiar4Troubleshooting || null,
            a2Familiar5NextLesson: details.a2Familiar5NextLesson || null,
            a2Familiar6EndSession: details.a2Familiar6EndSession || null,
            a2Familiar7FillPsff: details.a2Familiar7FillPsff || null,
            p1Environment: details.p1Environment || null,
            p1EnvironmentComment:
              this.escapeDoublequotes(details.p1EnvironmentComment) ?? '',
            p2NonSessionConduct: details.p2NonSessionConduct || null,
            p2NonSessionConductComment:
              this.escapeDoublequotes(details.p2NonSessionConductComment) ?? '',
            p3InSessionConduct: details.p3InSessionConduct || null,
            p3InSessionConductComment:
              this.escapeDoublequotes(details.p3InSessionConductComment) ?? '',
            p4Safeguarding: details.p4Safeguarding || null,
            p4SafeguardingComment:
              this.escapeDoublequotes(details.p4SafeguardingComment) ?? '',
            p5Language: details.p5Language || null,
            p5LanguageComment:
              this.escapeDoublequotes(details.p5LanguageComment) ?? '',
            p6SctInteraction: details.p6SctInteraction || null,
            p6SctInteractionComment:
              this.escapeDoublequotes(details.p6SctInteractionComment) ?? '',
            p7SctAssessment: details.p7SctAssessment || null,
            p7SctAssessmentComment:
              this.escapeDoublequotes(details.p7SctAssessmentComment) ?? '',
            p8MathematicalInstruction:
              details.p8MathematicalInstruction || null,
            p8MathematicalInstructionComment:
              this.escapeDoublequotes(
                details.p8MathematicalInstructionComment
              ) ?? '',
            whatWentWellP1: details.whatWentWellP1 || null,
            whatWentWellP1Comment:
              this.escapeDoublequotes(details.whatWentWellP1Comment) ?? '',
            whatWentWellP2: details.whatWentWellP2 || null,
            whatWentWellP2Comment:
              this.escapeDoublequotes(details.whatWentWellP2Comment) ?? '',
            areaOfImprovementP1: details.areaOfImprovementP1 || null,
            areaOfImprovementP1Comment:
              this.escapeDoublequotes(details.areaOfImprovementP1Comment) ?? '',
            areaOfImprovementP2: details.areaOfImprovementP2 || null,
            areaOfImprovementP2Comment:
              this.escapeDoublequotes(details.areaOfImprovementP2Comment) ?? '',
            monitoringComment:
              this.escapeDoublequotes(details.monitoringComment) ?? '',
            generalComment:
              this.escapeDoublequotes(details.generalComment) ?? '',
            finalOutcome: details.finalOutcome || null,
            failReason: details.failReason || null,
            failReasonOther:
              this.escapeDoublequotes(details.failReasonOther) ?? '',

            createdBy: tspId,
            updatedBy: tspId
          }
        });
      }

      switch (details.attendance) {
        //check attendance
        case 'No show':
        case 'Reschedule Requested':
        case 'Cancelled':
        case 'Other': {
          //check for any withdraw reschedules
          // const rescheduleCount = await this.prisma.bookingHistory.count({
          //   where: {
          //     candidate_id: bookingStatus.candidate_id,
          //     appointment_type_id:
          //       this.appointmentTypeIdFtaObj[details.foundationTrainingLevel],
          //     booking_status_id: { in: [7, 11] }
          //   }
          // });
          // const rescheduleLimit =
          //   await this.prisma.appointmentTypeRef.findUnique({
          //     where: {
          //       id: this.appointmentTypeIdFtaObj[
          //         details.foundationTrainingLevel
          //       ]
          //     },
          //     select: {
          //       candi_reschedule_limit: true
          //     }
          //   });

          await this.prisma.bookingHistory.create({
            data: {
              created_by: +tspId,
              date: bookingStatus.date,
              slot_time_id: bookingStatus.time_slot_id,
              appointment_type_id:
                this.appointmentTypeIdFtaObj[details.foundationTrainingLevel],
              booking_status_id: 11, // booking_status_ref_id - MISSED
              withdraw_reason: 'MISSED',
              candidate_id: bookingStatus.candidate_id,
              booking_id: details.bsBookingId,
              interviewer_id: bookingStatus.interviewer_id
            }
          });

          //Send FTA No Show Email (without or without dropout message)
          await this.mail.sendGraFtaL1AndL2MissedEmail(
            bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            +details.foundationTrainingLevel
          );

          // on No Show - mark booking status as Missed
          await this.prisma.bookingStatus.update({
            where: {
              id: +details.bsBookingId
            },
            data: {
              updated_at: new Date().toISOString(),
              updated_by: +tspId,
              status: 11 // booking_status_ref_id - MISSED
            }
          });

          break;
        } //end: no show
        case 'Attended - On time':
        case 'Attended - Late': {
          if (bookingStatus.status != 4) {
            //if bookingStatus.status is 4 - assume Checkin button used. marked completed
            await this.prisma.bookingHistory.create({
              data: {
                created_by: +tspId,
                date: bookingStatus.date,
                slot_time_id: bookingStatus.time_slot_id,
                appointment_type_id:
                  this.appointmentTypeIdFtaObj[details.foundationTrainingLevel],
                booking_status_id: 4, // booking_status_ref_id - COMPLETED
                withdraw_reason: 'COMPLETED',
                candidate_id: bookingStatus.candidate_id,
                booking_id: details.bsBookingId,
                interviewer_id: bookingStatus.interviewer_id
              }
            });
          }

          switch (details.finalOutcome) {
            //check final outcome
            case 'Pass': {
              //do nothing
              break;
            }
            case 'Fail': {
              //do nothing
              break;
            }
            case 'Reconsider': {
              //do nothing
              break;
            }
            case '':
            case null: {
              //do nothing
              break;
            }
            default: {
              throw new HttpException(
                {
                  success: false,
                  error: `Unknown outcome value found with booking id: ${details.bsBookingId}`
                },
                400
              );
            }
          }

          /**
           * update bs_booking_status: status to completed: 4 - if attended
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

          break;
        } //end: attended
      } //end: switch: attendance

      return {
        success: true,
        data: createdRecord
      };
    } catch (error) {
      console.error('FTA submit fail', error.message);
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: submitFtAssessment

  async sendFtAssessmentFinalEmail(
    createdBy: number,
    data: SendFtAssessmentFinalEmailDto
  ) {
    try {
      const { recordIds, foundationTrainingLevel } = data;
      if (recordIds.length <= 0) {
        throw new Error('No records selected.');
      }
      const successIdsArray = [];
      const errorArray = [];

      const ftAssessmentNotes = await this.prisma.ftAssessment.findMany({
        where: {
          id: { in: recordIds },
          foundationTrainingLevel: foundationTrainingLevel,
          emailSent: 0,
          saveDraft: 0,
          attendance: {
            startsWith: 'Attended'
          },
          finalOutcome: { in: ['Pass', 'Fail', 'Reconsider'] },
          bookingStatus: {
            appointment_type_ref_id: foundationTrainingLevel === 1 ? 6 : 7
          }
        },
        include: {
          bookingStatus: {
            select: {
              id: true,
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
              },
              BookingHistory: {
                select: {
                  id: true,
                  booking_status_id: true
                },
                orderBy: {
                  id: 'desc'
                },
                take: 1
              }
            }
          }
        }
      });
      if (ftAssessmentNotes.length <= 0) {
        throw new Error('No valid records selected.');
      } else {
        console.log('process rec', ftAssessmentNotes.length);
      }

      for (let i = 0; i < ftAssessmentNotes.length; i += 1) {
        let allGood = 1;
        const ftAssessmentNotesX = ftAssessmentNotes[i];
        const bookingHistoryRecordX = ftAssessmentNotesX?.bookingStatus
          ?.BookingHistory
          ? ftAssessmentNotesX?.bookingStatus?.BookingHistory[0]
          : null;
        console.log('bookingHistoryRecordX', bookingHistoryRecordX);

        if (
          bookingHistoryRecordX &&
          bookingHistoryRecordX.booking_status_id === 3
        ) {
          //if last history record is booked, insert 1 as completed
          await this.prisma.bookingHistory.create({
            data: {
              created_by: +createdBy,
              date: ftAssessmentNotesX.bookingStatus.date,
              slot_time_id: ftAssessmentNotesX.bookingStatus.time_slot_id,
              appointment_type_id:
                ftAssessmentNotesX.bookingStatus.appointment_type_ref_id,
              booking_status_id: 4, // booking_status_ref_id - COMPLETED
              withdraw_reason: 'COMPLETED',
              candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
              booking_id: ftAssessmentNotesX.bookingStatus.id,
              interviewer_id: ftAssessmentNotesX.bookingStatus.interviewer_id
            }
          });
        }
        //repare what went well & need for imporovement strings
        const tableTagGenerated1 = `<tr><td>${
          ftAssessmentNotesX.whatWentWellP1 ?? ''
        }</td><td>${
          ftAssessmentNotesX.whatWentWellP1Comment ?? ''
        }</td></tr><tr><td>${ftAssessmentNotesX.whatWentWellP2 ?? ''}</td><td>${
          ftAssessmentNotesX.whatWentWellP2Comment ?? ''
        }</td></tr>`;

        const tableTagGenerated2 = `<tr><td>${
          ftAssessmentNotesX.areaOfImprovementP1 ?? ''
        }</td><td>${
          ftAssessmentNotesX.areaOfImprovementP1Comment ?? ''
        }</td></tr><tr><td>${
          ftAssessmentNotesX.areaOfImprovementP2 ?? ''
        }</td><td>${
          ftAssessmentNotesX.areaOfImprovementP2Comment ?? ''
        }</td></tr>`;

        const splitStringFunction = (input) =>
          input ? input.split(',').map((item) => item.trim()) : [];
        const failCriteria = splitStringFunction(ftAssessmentNotesX.failReason);

        switch (ftAssessmentNotesX.finalOutcome) {
          //check final outcome
          case 'Pass': {
            await this.prisma.bookingHistory.create({
              data: {
                created_by: +createdBy,
                date: ftAssessmentNotesX.bookingStatus.date,
                slot_time_id: ftAssessmentNotesX.bookingStatus.time_slot_id,
                appointment_type_id:
                  ftAssessmentNotesX.bookingStatus.appointment_type_ref_id,
                booking_status_id: 10, // booking_status_ref_id - PASSED
                withdraw_reason: 'PASSED',
                candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
                booking_id: ftAssessmentNotesX.bookingStatus.id,
                interviewer_id: ftAssessmentNotesX.bookingStatus.interviewer_id
              }
            });
            if (foundationTrainingLevel === 1) {
              // FTA level 1
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id
                },
                create: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
                  level: 5,
                  updatedAt: new Date().toISOString(),
                  step4UpdatedAt: new Date().toISOString(),
                  step4: 'Pass'
                },
                update: {
                  level: 5,
                  updatedAt: new Date().toISOString(),
                  step4UpdatedAt: new Date().toISOString(),
                  step4: 'Pass'
                }
              });

              //Send FTA level 1 Pass Email
              await this.mail.sendGraFtaL1PassEmail(
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_contact_data?.workEmail ?? '',
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_personal_data?.firstName ?? '',
                tableTagGenerated1,
                tableTagGenerated2
              );

              // updates related to hris
              await this.prisma.hrisProgress.upsert({
                where: {
                  tspId: ftAssessmentNotesX.bookingStatus.candidate_id
                },
                create: {
                  tspId: ftAssessmentNotesX.bookingStatus.candidate_id,
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

              await this.prisma.hrisAuditedData.create({
                data: {
                  tspId: ftAssessmentNotesX.bookingStatus.candidate_id,
                  tutorStatus: 'onboarding ready',
                  createdBy: +createdBy
                }
              });
            } else {
              // FTA level 2
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id
                },
                create: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
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

              //Send FTA level 2 Pass Email
              await this.mail.sendGraFtaL2PassEmail(
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_contact_data?.workEmail ?? '',
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_personal_data?.firstName ?? '',
                tableTagGenerated1,
                tableTagGenerated2
              );
            }

            break;
          }
          case 'Fail': {
            await this.prisma.bookingHistory.create({
              data: {
                created_by: +createdBy,
                date: ftAssessmentNotesX.bookingStatus.date,
                slot_time_id: ftAssessmentNotesX.bookingStatus.time_slot_id,
                appointment_type_id:
                  ftAssessmentNotesX.bookingStatus.appointment_type_ref_id,
                booking_status_id: 9, // booking_status_ref_id - FAILED
                withdraw_reason: 'FAILED',
                candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
                booking_id: ftAssessmentNotesX.bookingStatus.id,
                interviewer_id: ftAssessmentNotesX.bookingStatus.interviewer_id
              }
            });

            if (foundationTrainingLevel === 1) {
              // FTA level 1
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id
                },
                create: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
                  updatedAt: new Date().toISOString(),
                  step4UpdatedAt: new Date().toISOString(),
                  step4: 'Fail'
                },
                update: {
                  updatedAt: new Date().toISOString(),
                  step4UpdatedAt: new Date().toISOString(),
                  step4: 'Fail'
                }
              });

              // Send FTA level 1 Fail Email
              await this.mail.sendGraFtaL1AndL2FailEmail(
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_contact_data?.workEmail ?? '',
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_personal_data?.firstName ?? '',
                'I',
                failCriteria,
                tableTagGenerated1,
                tableTagGenerated2
              );
            } else {
              // FTA level 2
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id
                },
                create: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
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

              // Send FTA level 2 Fail Email
              await this.mail.sendGraFtaL1AndL2FailEmail(
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_contact_data?.workEmail ?? '',
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_personal_data?.firstName ?? '',
                'II',
                failCriteria,
                tableTagGenerated1,
                tableTagGenerated2
              );
            }

            break;
          }
          case 'Reconsider': {
            await this.prisma.bookingHistory.create({
              data: {
                created_by: +createdBy,
                date: ftAssessmentNotesX.bookingStatus.date,
                slot_time_id: ftAssessmentNotesX.bookingStatus.time_slot_id,
                appointment_type_id:
                  ftAssessmentNotesX.bookingStatus.appointment_type_ref_id,
                booking_status_id: 12, // booking_status_ref_id - RE_PREPARE
                withdraw_reason: 'RE_PREPARE',
                candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
                booking_id: ftAssessmentNotesX.bookingStatus.id,
                interviewer_id: ftAssessmentNotesX.bookingStatus.interviewer_id
              }
            });

            if (foundationTrainingLevel === 1) {
              // FTA level 1
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id
                },
                create: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
                  updatedAt: new Date().toISOString(),
                  step4UpdatedAt: new Date().toISOString(),
                  step4: 'Reconsider'
                },
                update: {
                  updatedAt: new Date().toISOString(),
                  step4UpdatedAt: new Date().toISOString(),
                  step4: 'Reconsider'
                }
              });

              // Send FTA level 1 Reconsider Email
              await this.mail.sendGraFtaL1AndL2ReconsiderEmail(
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_contact_data?.workEmail ?? '',
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_personal_data?.firstName ?? '',
                'I',
                failCriteria,
                tableTagGenerated1,
                tableTagGenerated2
              );
            } else {
              // FTA level 2
              // update bs_candidate level
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id
                },
                create: {
                  candidate_id: ftAssessmentNotesX.bookingStatus.candidate_id,
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

              // Send FTA level 2 Reconsider Email
              await this.mail.sendGraFtaL1AndL2ReconsiderEmail(
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_contact_data?.workEmail ?? '',
                ftAssessmentNotesX.bookingStatus.candidate
                  ?.approved_personal_data?.firstName ?? '',
                'II',
                failCriteria,
                tableTagGenerated1,
                tableTagGenerated2
              );
            }

            break;
          }
          default: {
            allGood = 0;
            errorArray.push(
              `Unknown outcome on booking id: ${ftAssessmentNotesX.bsBookingId}`
            );
            // throw new HttpException(
            //   {
            //     success: false,
            //     error: `Unknown outcome value found with record id: ${ftAssessmentNotesX.bsBookingId}`
            //   },
            //   400
            // );
          }
        } //end: switch - finalOutcome

        /**
         * update bs_booking_status: status to completed: 4 - if attended
         */
        if (allGood) {
          successIdsArray.push({ id: ftAssessmentNotesX.id, emailSent: 1 });
          //mark booking record as completed
          await this.prisma.bookingStatus.update({
            where: {
              id: +ftAssessmentNotesX.bsBookingId
            },
            data: {
              updated_at: new Date().toISOString(),
              updated_by: +createdBy,
              status: 4 // booking_status_ref_id - COMPLETED
            }
          });
          //mark assessment record as email sent
          await this.prisma.ftAssessment.update({
            where: {
              id: +ftAssessmentNotesX.id
            },
            data: {
              emailSent: 1,
              updatedAt: new Date().toISOString(),
              updatedBy: +createdBy,
              triggeredAt: new Date().toISOString(),
              triggeredBy: +createdBy
            }
          });
        }
      } // end: for loop

      return successIdsArray && successIdsArray.length > 0
        ? {
            success: true,
            message: `${successIdsArray.length}/${ftAssessmentNotes.length} Emails sent`,
            data: successIdsArray,
            foundationTrainingLevel: foundationTrainingLevel
          }
        : {
            success: true,
            message: 'No emails sent',
            data: null,
            foundationTrainingLevel: foundationTrainingLevel
          };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  } //end: sendFtAssessmentFinalEmail

  escapeDoublequotes(input: string) {
    return input ? input.replace(/"/g, '""') : input;
  }

  async getFtaList(
    foundationTrainingLevel: 1 | 2,
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
        foundationTrainingLevel: foundationTrainingLevel,
        tspId: tspId ? { in: tspIds } : {},
        ...(candiName
          ? {
              user: {
                approved_personal_data: {
                  shortName: candiName ? { contains: candiName } : {}
                }
              }
            }
          : {}),

        finalOutcome: finalOutcome !== '' ? { startsWith: finalOutcome } : {},
        demoDate:
          startDate && endDate && startDate !== '' && endDate !== ''
            ? {
                gte: moment(startDate).startOf('date').toISOString(),
                lte: moment(endDate).endOf('date').toISOString()
              }
            : {}
      };

      const [count, details] = await this.prisma.$transaction([
        this.prisma.ftAssessment.count({
          where: filterWhereClause
        }),
        this.prisma.ftAssessment.findMany({
          take,
          skip,
          where: filterWhereClause,
          select: {
            id: true,
            tspId: true,
            bsBookingId: true,
            finalOutcome: true,
            demoAttempt: true,
            saveDraft: true,
            emailSent: true,
            updatedAt: true,
            createdAt: true,
            user: {
              select: {
                isDeactivated: true,
                created_at: true,
                approved_personal_data: {
                  select: {
                    tspId: true,
                    shortName: true
                  }
                },
                approved_contact_data: {
                  select: {
                    workEmail: true,
                    mobileNumber: true,
                    residingCountry: true
                  }
                },
                ApprovedJobRequisition: {
                  select: { batch: true }
                },
                user_hris_progress: {
                  select: {
                    tutorStatus: true,
                    profileStatus: true
                  }
                }
              }
            },
            bookingStatus: {
              select: {
                date: true,
                bs_all_booking_slot: {
                  select: {
                    slot_time: true
                  }
                },
                interviewer: {
                  select: {
                    tsp_id: true,
                    approved_personal_data: {
                      select: { shortName: true }
                    }
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

      const data = details.flatMap((detail, index) => {
        return {
          id: detail.id,
          tspId: detail.tspId,
          bsBookingId: detail.bsBookingId,
          status: detail.finalOutcome,
          date: moment(detail.createdAt)
            .tz('Asia/Kolkata')
            .format('DD.MM.YYYY'),
          time: moment(detail.createdAt).tz('Asia/Kolkata').format('HH:mm:ss'),
          demoAttempt: detail.demoAttempt,
          saveDraft: detail.saveDraft,
          emailSent: detail.emailSent,
          updatedAt: moment(detail.updatedAt)
            .tz('Asia/Kolkata')
            .format('DD.MM.YYYY'),

          isDeactivated: detail.user.isDeactivated,
          signUpDate: detail.user.created_at
            ? moment(detail.user.created_at).format('DD.MM.YYYY')
            : '',
          shortName: detail.user.approved_personal_data?.shortName,
          workEmail: detail.user.approved_contact_data?.workEmail,
          mobileNumber: detail.user.approved_contact_data?.mobileNumber,
          residingCountry: detail.user.approved_contact_data?.residingCountry,
          batch: detail.user.ApprovedJobRequisition?.batch,
          tutorStatus: detail.user.user_hris_progress?.tutorStatus ?? null,
          profileStatus: detail.user.user_hris_progress?.profileStatus ?? null,

          interviewerTspId: detail.bookingStatus.interviewer?.tsp_id,
          interviewerName:
            detail.bookingStatus.interviewer?.approved_personal_data?.shortName,
          interviewDate: moment(detail.bookingStatus.date).format('DD.MM.YYYY'),
          interviewTime: detail.bookingStatus.bs_all_booking_slot.slot_time
        };
      });

      return { success: true, data, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  } //end: getTiList

  async exportFtAssessment({
    tspId,
    candiName,
    finalOutcome,
    startDate,
    endDate
  }: Omit<FtAssessmentListDto, 'take' | 'skip'>) {
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
            finalOutcome: finalOutcome ? { startsWith: finalOutcome } : {},
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
        this.prisma.ftAssessment.count({
          where: filterWhereClause
        }),
        this.prisma.ftAssessment.findMany({
          where: filterWhereClause,
          select: {
            id: true,
            tspId: true,
            bsBookingId: true,
            finalOutcome: true,
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
          finalOutcome: detail.finalOutcome,
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
  } //end: exportFtAssessment
}
