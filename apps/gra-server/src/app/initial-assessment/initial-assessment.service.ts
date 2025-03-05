import { HttpException, Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import moment = require('moment');
import { InitialAssessmentListDto } from './initial-assessment.dto';

@Injectable()
export class InitialAssessmentService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  private readonly appointmentTypeIdEsa = 5; //bs_candidate_level 3 processing interview

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

  async fetchInitialAssessmentByBookingId(
    bsBookingId: number,
    accessState?: string,
    esaRecordId?: number
  ) {
    try {
      console.log(
        'fetchInitialAssessmentByBookingId',
        bsBookingId,
        accessState,
        esaRecordId
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

      if (
        !bookingStatus ||
        !bookingStatus.candidate_id ||
        ![this.appointmentTypeIdEsa].includes(
          bookingStatus.appointment_type_ref_id
        )
      ) {
        return {
          success: false,
          data: null
        };
      }
      const candidateTspId = bookingStatus.candidate_id;

      //get count of all booking/reschedules by candidate
      // const bookedHistoryCount = await this.prisma.bookingHistory.count({
      //   where: {
      //     candidate_id: bookingStatus.candidate_id,
      //     appointment_type_id: this.appointmentTypeIdEsa,
      //     booking_status_id: 3 //booked
      //   }
      // });

      //get count of all withdraws/reschedules & missed by candidate
      const bookedHistoryCount = await this.prisma.bookingHistory.groupBy({
        by: ['booking_id'],
        where: {
          candidate_id: bookingStatus.candidate_id,
          appointment_type_id: this.appointmentTypeIdEsa,
          booking_status_id: {
            in: [7, 11] // WITHDRAW & MISSED
          }
        },
        _count: true
      });

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
          }
        }
      });

      let bookingCompleted = null;

      if (accessState && accessState === 'view' && esaRecordId) {
        bookingCompleted = await this.prisma.initialAssessment.findUnique({
          where: {
            id: +esaRecordId
          }
        });
      } else {
        //check if exist a interview entry with same booking id (for same candidate)
        bookingCompleted = await this.prisma.initialAssessment.findFirst({
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
            candidateName: data.approved_personal_data?.shortName ?? '',
            tspId: +candidateTspId,
            dateTime: `${moment(bookingStatus.date).format('DD-MM-YYYY')} | ${
              bookingStatus.bs_all_booking_slot.slot_time
            }`,
            candidateEmail: data.approved_contact_data?.workEmail ?? '',

            candidateNic: data.approved_personal_data?.nic ?? '',
            candidateContact: data.approved_contact_data?.mobileNumber ?? '',
            candidateCountry: data.approved_contact_data?.residingCountry ?? '',
            interviewerEmail: bookingStatus.interviewer?.username ?? '',

            bsBookingId: +bsBookingId,
            bookingState: +bookingStatus.status,
            interviewerId: +bookingStatus.interviewer_id,
            bookedHistoryCount: (bookedHistoryCount.length + 1)
              .toString()
              .padStart(2, '0'),
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
  } //end: fetchInitialAssessmentByBookingId

  async submitInitialAssessment(tspId: number, details: any) {
    try {
      if (!details.tspId || !details.bsBookingId || !details.attendance) {
        throw new HttpException(
          {
            success: false,
            error: `Missing data for ESA submission`
          },
          400
        );
      }

      const HasBookingNotes = await this.prisma.initialAssessment.findFirst({
        where: {
          bsBookingId: details.bsBookingId
        },
        orderBy: { id: 'desc' }
      });

      if (HasBookingNotes) {
        await this.prisma.systemErrorLog.create({
          data: {
            system: 'gra',
            subSystem: 'ia',
            function: 'submitInitialAssessment',
            location:
              'apps/gra-server/src/app/initial-assessment/initial-assessment.service.ts',
            description:
              `Failed attempt by ${tspId} to submit ia of booking_id ` +
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

      const createdRecord = await this.prisma.initialAssessment.create({
        data: {
          tspId: details.tspId,
          bsBookingId: details.bsBookingId,
          date: bookingStatus?.date ?? null,
          attendance: details.attendance,
          language: details.language || null,
          subjectKnowledge: details.subjectKnowledge || null,
          mindset: details.mindset || null,
          commitment: details.commitment ?? '',
          overallComments:
            this.escapeDoublequotes(details.overallComments) ?? '',
          finalOutcome: details.finalOutcome ?? '',
          finalReason: this.escapeDoublequotes(details.finalReason) ?? '',
          createdBy: tspId
        }
      });

      switch (details.attendance) {
        //check attendance
        case 'Did Not Attend': {
          //check for any withdraw reschedules
          const rescheduleCount = await this.prisma.bookingHistory.count({
            where: {
              candidate_id: bookingStatus.candidate_id,
              appointment_type_id: this.appointmentTypeIdEsa,
              booking_status_id: { in: [7, 11] }
            }
          });
          const rescheduleLimit =
            await this.prisma.appointmentTypeRef.findUnique({
              where: {
                id: this.appointmentTypeIdEsa
              },
              select: {
                candi_reschedule_limit: true
              }
            });

          await this.prisma.bookingHistory.create({
            data: {
              created_by: +tspId,
              date: bookingStatus.date,
              slot_time_id: bookingStatus.time_slot_id,
              appointment_type_id: this.appointmentTypeIdEsa,
              booking_status_id: 11, // booking_status_ref_id - MISSED
              withdraw_reason: 'MISSED',
              candidate_id: bookingStatus.candidate_id,
              booking_id: details.bsBookingId,
              interviewer_id: bookingStatus.interviewer_id
            }
          });

          //Send ESA No Show Email (without or without dropout message)
          if (
            rescheduleLimit &&
            rescheduleLimit.candi_reschedule_limit &&
            rescheduleLimit.candi_reschedule_limit <= rescheduleCount + 1
          ) {
            await this.mail.sendGraEsaMissedEmail(
              bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
              bookingStatus.candidate.approved_personal_data?.firstName ?? '',
              true
            );
          } else {
            await this.mail.sendGraEsaMissedEmail(
              bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
              bookingStatus.candidate.approved_personal_data?.firstName ?? '',
              false
            );
          }

          // on No Show - mark booking status as Missed
          await this.prisma.bookingStatus.update({
            where: {
              id: +details.bsBookingId
            },
            data: {
              updated_at: new Date().toISOString(),
              updated_by: +tspId,
              date_slot_inter: 'ESA No Show',
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
                appointment_type_id: this.appointmentTypeIdEsa,
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
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +tspId,
                  date: bookingStatus.date,
                  slot_time_id: bookingStatus.time_slot_id,
                  appointment_type_id: this.appointmentTypeIdEsa,
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
                  level: 4,
                  updatedAt: new Date().toISOString(),
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Pass'
                },
                update: {
                  level: 4,
                  updatedAt: new Date().toISOString(),
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Pass'
                }
              });

              //Send ESA Pass Email
              await this.mail.sendGraEsaOutcomeEmail(
                bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                'Pass'
              );

              /*
              // Move Enable HRIS action to after foundation training level 1 assessment pass 
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
              */

              break;
            }
            case 'Fail': {
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +tspId,
                  date: bookingStatus.date,
                  slot_time_id: bookingStatus.time_slot_id,
                  appointment_type_id: this.appointmentTypeIdEsa,
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
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Fail',
                  failedState: 1,
                  failedLevel: 'ESA - Fail',
                  failedAt: new Date().toISOString()
                },
                update: {
                  updatedAt: new Date().toISOString(),
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Fail',
                  failedState: 1,
                  failedLevel: 'ESA - Fail',
                  failedAt: new Date().toISOString()
                }
              });
              // update user - deactivate candidate account
              await this.prisma.user.update({
                where: {
                  tsp_id: +details.tspId
                },
                data: {
                  isDeactivated: true,
                  updated_at: new Date().toISOString()
                }
              });

              // Send ESA Fail Email
              await this.mail.sendGraEsaOutcomeEmail(
                bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                'Fail'
              );
              break;
            }
            case 'On Hold': {
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +tspId,
                  date: bookingStatus.date,
                  slot_time_id: bookingStatus.time_slot_id,
                  appointment_type_id: this.appointmentTypeIdEsa,
                  booking_status_id: 15, // booking_status_ref_id - ONHOLD
                  withdraw_reason: 'ONHOLD',
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
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'On Hold'
                },
                update: {
                  updatedAt: new Date().toISOString(),
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'On Hold'
                }
              });

              // Send ESA On Hold Email
              await this.mail.sendGraEsaOutcomeEmail(
                bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                'On Hold'
              );

              break;
            }
            case 'Drop Out': {
              await this.prisma.bookingHistory.create({
                data: {
                  created_by: +tspId,
                  date: bookingStatus.date,
                  slot_time_id: bookingStatus.time_slot_id,
                  appointment_type_id: this.appointmentTypeIdEsa,
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
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Dropout',
                  failedState: 1,
                  failedLevel: 'ESA - Dropout',
                  failedAt: new Date().toISOString()
                },
                update: {
                  updatedAt: new Date().toISOString(),
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Dropout',
                  failedState: 1,
                  failedLevel: 'ESA - Dropout',
                  failedAt: new Date().toISOString()
                }
              });
              // update user - deactivate candidate account
              await this.prisma.user.update({
                where: {
                  tsp_id: +details.tspId
                },
                data: {
                  isDeactivated: true,
                  updated_at: new Date().toISOString()
                }
              });

              // Send ESA Fail Email
              await this.mail.sendGraEsaOutcomeEmail(
                bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                'Drop Out'
              );

              break;
            }
            default: {
              throw new HttpException(
                {
                  success: false,
                  error: `Unknown attendence value found with: ${details.bsBookingId}`
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
              date_slot_inter: 'ESA Completed Submit',
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
      console.error('ESA submit fail', error.message);
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: submitInitialAssessment

  escapeDoublequotes(input: string) {
    return input ? input.replace(/"/g, '""') : input;
  }

  async getEsaList(
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
        date:
          startDate && endDate && startDate !== '' && endDate !== ''
            ? {
                gte: moment(startDate).startOf('date').toISOString(),
                lte: moment(endDate).endOf('date').toISOString()
              }
            : {}
      };

      const [count, details] = await this.prisma.$transaction([
        this.prisma.initialAssessment.count({
          where: filterWhereClause
        }),
        this.prisma.initialAssessment.findMany({
          take,
          skip,
          where: filterWhereClause,
          select: {
            id: true,
            tspId: true,
            bsBookingId: true,
            attendance: true,
            finalOutcome: true,
            finalReason: true,
            commitment: true,
            language: true,
            subjectKnowledge: true,
            mindset: true,
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

      // const data = details;
      const data = details.flatMap((detail, index) => {
        return {
          id: detail.id,
          tspId: detail.tspId,
          bsBookingId: detail.bsBookingId,
          status: detail.finalOutcome,
          attendance: detail.attendance,
          finalReason: detail.finalReason,
          commitment: detail.commitment,
          language: detail.language,
          subjectKnowledge: detail.subjectKnowledge,
          mindset: detail.mindset,
          date: moment(detail.createdAt)
            .tz('Asia/Kolkata')
            .format('DD/MM/YYYY'),
          time: moment(detail.createdAt).tz('Asia/Kolkata').format('HH:mm:ss'),

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
            detail.bookingStatus.interviewer.approved_personal_data.shortName,
          interviewDate: moment(detail.bookingStatus.date).format('DD.MM.YYYY'),
          interviewTime: detail.bookingStatus.bs_all_booking_slot.slot_time
        };
      });

      return { success: true, data, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  } //end: getEsaList

  async exportInitialAssessment({
    tspId,
    candiName,
    finalOutcome,
    startDate,
    endDate
  }: Omit<InitialAssessmentListDto, 'take' | 'skip'>) {
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
        this.prisma.initialAssessment.count({
          where: filterWhereClause
        }),
        this.prisma.initialAssessment.findMany({
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
  } //end: exportInitialAssessment
}
