import { HttpException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import {
  CallLogDto,
  CallLogsDto,
  MarkBookingCompletedRequestDto,
  PhoneInterviewDto,
  UpdatePhoneInterviewDto
} from './interviewer.dto';

@Injectable()
export class InterviewerService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async getCandidateDetails(candidateTspId: string) {
    const candidateId =
      candidateTspId[0] === '0' ? +candidateTspId.slice(1) : +candidateTspId;
    const dataRef = candidateTspId[0] === '0' ? 0 : 1;

    try {
      const data = await this.prisma.user.findUnique({
        where: {
          tsp_id: candidateId
        },
        select: {
          approved_personal_data: {
            select: {
              shortName: true,
              firstName: true,
              surname: true
            }
          },
          approved_contact_data: {
            select: {
              mobileNumber: true,
              residingCountry: true
            }
          }
        }
      });
      const piRefs = await this.prisma.piRef.findMany({
        where: {
          tspId: candidateId
        },
        include: {
          piDatas: true,
          piCallLogs: true
        },
        orderBy: {
          id: 'desc'
        }
      });

      const allCallLogs = piRefs.filter((ref) => ref.piCallLogs.length > 0);

      const isAllProcessCompleted =
        piRefs[0].piDatas.length === 2 ? true : false;

      return {
        success: true,
        data: {
          completed: true,
          piRefId: piRefs[0].id,
          candidate: {
            name: data.approved_personal_data?.shortName ?? '',
            contact: data.approved_contact_data?.mobileNumber ?? '',
            country: data.approved_contact_data?.residingCountry ?? '',
            tspId: candidateId,
            dateTime: '',
            mathTest: ''
          },
          callLogs: allCallLogs,
          interviewDetails:
            isAllProcessCompleted && dataRef === 0
              ? {
                  ...piRefs[0].piDatas[dataRef],
                  educationQualification: 'Investigation Completed'
                }
              : piRefs[0].piDatas[dataRef]
        }
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCandidateDetailsByBookingStatus(
    bookingStatusId: number,
    status?: string,
    piDataId?: number,
    actionedBy?: number
  ) {
    try {
      const bookingStatus = await this.prisma.bookingStatus.findUnique({
        where: {
          id: +bookingStatusId
        },
        select: {
          date: true,
          candidate_id: true,
          bs_all_booking_slot: {
            select: {
              slot_time: true
            }
          }
        }
      });

      const candidateTspId = bookingStatus.candidate_id;

      const data = await this.prisma.user.findUnique({
        where: {
          tsp_id: +candidateTspId
        },
        select: {
          approved_personal_data: {
            select: {
              shortName: true,
              firstName: true,
              surname: true,
              nic: true
            }
          },
          graRegistrationData: {
            select: {
              documentsList: true,
              detailsStatus: true
            }
          },
          approved_contact_data: {
            select: {
              mobileNumber: true,
              residingCountry: true
            }
          },
          FlexiCandidate: {
            select: {
              FlexiExam: {
                where: {
                  flexi_exam_id: 1
                },
                orderBy: {
                  id: 'desc'
                },
                select: {
                  exam_status: true,
                  FlexiCandidateExamDetails: {
                    select: {
                      points: true,
                      percentage_score: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      const piRefs = await this.prisma.piRef.findMany({
        where: {
          bookingStatusId: +bookingStatusId
        },
        include: {
          piDatas: true,
          piCallLogs: true
        }
      });

      // let otherData = piRefs.find((ref) => {
      //   return ref.bookingStatusId === +bookingStatusId;
      // });

      // const allCallLogs = piRefs.filter((ref) => ref.piCallLogs.length > 0);

      let otherData = piRefs[0];

      if (!otherData) {
        otherData = await this.prisma.piRef.create({
          data: {
            updatedBy: actionedBy,
            tspId: +candidateTspId,
            bookingStatusId: +bookingStatusId
          },
          include: {
            piDatas: true,
            piCallLogs: true
          }
        });
      }

      return {
        success: true,
        data: {
          completed: otherData.piCallLogs.length > 0 ? true : false,
          investigationCompleted: otherData.piDatas.length > 1 ? true : false,
          piRefId: otherData.id,
          candidate: {
            name: data.approved_personal_data?.shortName ?? '',
            contact: data.approved_contact_data?.mobileNumber ?? '',
            country: data.approved_contact_data?.residingCountry ?? '',
            tspId: +candidateTspId,
            dateTime: `${moment(bookingStatus.date).format('DD-MM-YYYY')} | ${
              bookingStatus.bs_all_booking_slot.slot_time
            }`,
            mathTest:
              data.FlexiCandidate?.FlexiExam[0]?.exam_status === 4
                ? 'Skipped'
                : `${
                    data.FlexiCandidate?.FlexiExam[0]
                      ?.FlexiCandidateExamDetails[0]?.percentage_score ?? 0
                  } / 100`,
            nic: data.approved_personal_data?.nic ?? '',
            documentsList: data.graRegistrationData?.documentsList ?? ''
          },
          callLogs: otherData.piCallLogs,
          interviewDetails: piDataId
            ? {
                ...otherData.piDatas.find((data) => data.id === +piDataId),
                detailsStatus: data.graRegistrationData.detailsStatus
              }
            : {
                ...otherData.piDatas[otherData.piDatas.length - 1],
                detailsStatus: data.graRegistrationData.detailsStatus
              }
        }
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async addCallLog(details: CallLogDto, actionedBy: number) {
    try {
      const data = await this.prisma.piCallLog.create({
        data: {
          createdBy: +actionedBy,
          piRefId: details.piRefId,
          callAttempt: details.callAttempt,
          piStatus: details.piStatus,
          date: details.date
        }
      });

      const bookingStatus = await this.prisma.bookingStatus.findUnique({
        where: {
          id: details.bookingStatusId
        },
        select: {
          candidate_id: true,
          interviewer_id: true,
          time_slot_id: true,
          bs_all_booking_slot: {
            select: {
              slot_time: true
            }
          },
          date: true,
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

      await this.prisma.bookingHistory.createMany({
        data: [
          {
            created_by: +actionedBy,
            booking_status_id: 5, // booking_status_ref_id - NOT_COMPLETED
            candidate_id: bookingStatus.candidate_id,
            appointment_type_id: 1,
            slot_time_id: bookingStatus.time_slot_id,
            withdraw_reason: 'NOT_COMPLETED',
            date: bookingStatus.date,
            booking_id: details.bookingStatusId,
            interviewer_id: bookingStatus.interviewer_id
          }
        ]
      });

      await this.prisma.bookingStatus.update({
        where: {
          id: details.bookingStatusId
        },
        data: {
          updated_at: new Date().toISOString(),
          updated_by: +actionedBy,
          status: 4 // booking_status_ref_id - COMPLETED
        }
      });

      // Attended - 1
      // No Answer - 2
      // Invalid Number - 3
      // Wrong Number - 4
      // Call Back - 5
      // Incomplete - 6
      // Investigate - 7

      // send email to candidate

      const [first, last] =
        bookingStatus.bs_all_booking_slot.slot_time.split(' - ');
      const [, session] = last.split(' ');

      if (details.callAttempt === 6) {
        await this.prisma.bookingHistory.create({
          data: {
            created_by: +actionedBy,
            booking_status_id: 14, // booking_status_ref_id - DROPOUT
            candidate_id: bookingStatus.candidate_id,
            appointment_type_id: 1,
            slot_time_id: bookingStatus.time_slot_id,
            withdraw_reason: 'DROPOUT',
            date: bookingStatus.date,
            booking_id: details.bookingStatusId,
            interviewer_id: bookingStatus.interviewer_id
          }
        });
        await this.prisma.bookingStatus.update({
          where: {
            id: details.bookingStatusId
          },
          data: {
            updated_at: new Date().toISOString(),
            updated_by: +actionedBy,
            status: 4 // booking_status_ref_id - COMPLETED
          }
        });

        await this.mail.sendPIDropoutNoanswerEmailv2(
          bookingStatus.candidate.approved_personal_data?.firstName ?? '',
          bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
        );
      } else {
        if (details.piStatus === 2) {
          await this.mail.sendPINoAnswerEmailv2(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
            moment(bookingStatus.date).format('DD.MM.YYYY'),
            last === '12:15 PM' ? `12:00 AM` : `${first} ${session}`
          );
        } else if (details.piStatus === 3 || details.piStatus === 4) {
          await this.mail.sendPIWrongNumberEmailv2(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
          );
        }
      }
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async addCallLogs(details: CallLogsDto, actionedBy: number) {
    try {
      const data = await this.prisma.piCallLog.createMany({
        data: details.callLogs.map((callLog) => {
          return {
            createdBy: +actionedBy,
            piRefId: details.piRefId,
            callAttempt: callLog.callAttempt,
            piStatus: callLog.piStatus,
            date: callLog.date
          };
        })
      });

      const bookingStatus = await this.prisma.bookingStatus.findUnique({
        where: {
          id: details.bookingStatusId
        },
        select: {
          candidate_id: true,
          interviewer_id: true,
          time_slot_id: true,
          bs_all_booking_slot: {
            select: {
              slot_time: true
            }
          },
          date: true,
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

      await this.prisma.bookingHistory.createMany({
        data: [
          {
            created_by: +actionedBy,
            booking_status_id: 5, // booking_status_ref_id - NOT_COMPLETED
            candidate_id: bookingStatus.candidate_id,
            appointment_type_id: 1,
            slot_time_id: bookingStatus.time_slot_id,
            withdraw_reason: 'NOT_COMPLETED',
            date: bookingStatus.date,
            booking_id: details.bookingStatusId,
            interviewer_id: bookingStatus.interviewer_id
          }
        ]
      });

      await this.prisma.bookingStatus.update({
        where: {
          id: details.bookingStatusId
        },
        data: {
          updated_at: new Date().toISOString(),
          updated_by: +actionedBy,
          status: 4 // booking_status_ref_id - COMPLETED
        }
      });

      // Attended - 1
      // No Answer - 2
      // Invalid Number - 3
      // Wrong Number - 4
      // Call Back - 5
      // Incomplete - 6
      // Investigate - 7

      // send email to candidate

      const [first, last] =
        bookingStatus.bs_all_booking_slot.slot_time.split(' - ');
      const [, session] = last.split(' ');

      const lastCallLogStatus =
        details.callLogs[details.callLogs.length - 1].piStatus;

      switch (lastCallLogStatus) {
        case 2: {
          await this.mail.sendPINoAnswerEmailv2(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
            moment(bookingStatus.date).format('DD.MM.YYYY'),
            last === '12:15 PM' ? `12:00 AM` : `${first} ${session}`
          );
          break;
        }
        case 3:
        case 4: {
          await this.mail.sendPIWrongNumberEmailv2(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
          );
          break;
        }
        case 5: {
          await this.prisma.bookingHistory.create({
            data: {
              created_by: +actionedBy,
              booking_status_id: 14, // booking_status_ref_id - DROPOUT
              candidate_id: bookingStatus.candidate_id,
              appointment_type_id: 1,
              slot_time_id: bookingStatus.time_slot_id,
              withdraw_reason: 'DROPOUT',
              date: bookingStatus.date,
              booking_id: details.bookingStatusId,
              interviewer_id: bookingStatus.interviewer_id
            }
          });
          await this.prisma.bookingStatus.update({
            where: {
              id: details.bookingStatusId
            },
            data: {
              updated_at: new Date().toISOString(),
              updated_by: +actionedBy,
              status: 4 // booking_status_ref_id - COMPLETED
            }
          });

          await this.prisma.candidateLevel.update({
            where: {
              id: bookingStatus.candidate_id
            },
            data: {
              updatedAt: new Date().toISOString(),
              step4UpdatedAt: new Date().toISOString(),
              step4: 'Fail'
            }
          });

          await this.mail.sendPIDropoutNoanswerEmailv2(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
          );
          break;
        }
      }
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async submitPhoneInterview(details: PhoneInterviewDto, actionedBy: number) {
    try {
      const HasBooking = await this.prisma.piData.findMany({
        where: {
          piRefId: details.piRefId,
          finalOutcome: details.finalOutcome
        }
      });

      if (HasBooking && HasBooking.length > 0) {
        await this.prisma.systemErrorLog.create({
          data: {
            system: 'gra',
            subSystem: 'pi',
            function: 'submitPhoneInterview',
            location:
              'apps/gra-server/src/app/interviewer/interviewer.service.ts',
            description:
              `Failed attempt by ${actionedBy} to submit pi of booking_id ` +
              `${details.bookingStatusId} ` +
              `due to repeated piRefId ${details.piRefId}`,
            createdAt: moment().tz('Asia/Colombo').toISOString(),
            createdBy: +actionedBy
          }
        });
        throw new HttpException(
          {
            success: false,
            error: `Duplicate entry found for piRefId: ${details.piRefId}`
          },
          400
        );
      }

      const data = await this.prisma.piData.create({
        data: {
          updatedBy: +actionedBy,
          bsBookingId: +details.bookingStatusId,
          piRefId: details.piRefId,
          languageCheck: details.languageCheck,
          grammar: details.grammar,
          pronounciation: details.pronounciation,
          sentenceFormation: details.sentenceFormation,
          languageReason: details.languageReason,
          languageOther: details.languageOther,
          mathCheck: details.mathCheck,
          simpleMathematics: details.simpleMathematics,
          mathReason: this.escapeDoublequotes(details.mathReason),
          mathOther: details.mathOther,
          educationQualification: details.educationQualification,
          cityStatus: details.cityStatus,
          workStatus: details.workStatus,
          paymentMethodStatus: details.paymentMethodStatus,
          overallComments: this.escapeDoublequotes(details.overallComments),
          finalOutcome: details.finalOutcome,
          finalReason: details.finalReason,
          finalReasonOther: this.escapeDoublequotes(details.finalReasonOther),
          adminAdditionalComment: this.escapeDoublequotes(
            details.adminAdditionalComment
          )
        }
      });

      const piRef = await this.prisma.piRef.findUnique({
        where: {
          id: details.piRefId
        },
        include: {
          piCallLogs: true
        }
      });

      if (piRef.piCallLogs.length === 0) {
        await this.prisma.piCallLog.createMany({
          data: details.callLogs.map((callLog) => {
            return {
              createdBy: +actionedBy,
              piRefId: details.piRefId,
              callAttempt: callLog.callAttempt,
              piStatus: callLog.piStatus,
              date: callLog.date
            };
          })
        });
      }

      await this.prisma.graRegistrationData.update({
        where: {
          tspId: piRef.tspId
        },
        data: {
          detailsStatus: details.detailsStatus
        }
      });

      // Attended - 1
      // No Answer - 2
      // Invalid Number - 3
      // Wrong Number - 4
      // Call Back - 5
      // Incomplete - 6
      // Investigate - 7

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

      const bookingStatus = await this.prisma.bookingStatus.findUnique({
        where: {
          id: details.bookingStatusId
        },
        select: {
          candidate_id: true,
          interviewer_id: true,
          time_slot_id: true,
          date: true,
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

      // if (lastCallLog.piStatus === 1) {
      if (details.educationQualification === 'Reject') {
        await this.prisma.bookingHistory.create({
          data: {
            created_by: +actionedBy,
            candidate_id: piRef.tspId,
            appointment_type_id: 1,
            slot_time_id: bookingStatus.time_slot_id,
            booking_status_id: 9, // booking_status_ref_id - NOT_BOOKED
            withdraw_reason: 'FAILED',
            date: bookingStatus.date,
            booking_id: details.bookingStatusId,
            interviewer_id: bookingStatus.interviewer_id
          }
        });
        await this.prisma.bookingStatus.update({
          where: {
            id: details.bookingStatusId
          },
          data: {
            updated_at: new Date().toISOString(),
            updated_by: +actionedBy,
            status: 4
          }
        });
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: piRef.tspId
          },
          create: {
            candidate_id: piRef.tspId,
            level: 4,
            updatedAt: new Date().toISOString(),
            step4UpdatedAt: new Date().toISOString(),
            step4: 'Fail'
          },
          update: {
            level: 4,
            updatedAt: new Date().toISOString(),
            step4UpdatedAt: new Date().toISOString(),
            step4: 'Fail'
          }
        });
        await this.mail.sendPIFailEmailv2(
          bookingStatus.candidate.approved_personal_data?.firstName ?? '',
          bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
          ['Education qualifications are rejected']
        );
      } else {
        switch (details.finalOutcome) {
          case 'pass': {
            await this.prisma.bookingHistory.createMany({
              data: [
                {
                  created_by: +actionedBy,
                  booking_status_id: 4, // booking_status_ref_id - COMPLETED
                  candidate_id: piRef.tspId,
                  appointment_type_id: 1,
                  slot_time_id: bookingStatus.time_slot_id,
                  withdraw_reason: 'COMPLETED',
                  date: bookingStatus.date,
                  booking_id: details.bookingStatusId,
                  interviewer_id: bookingStatus.interviewer_id
                },
                {
                  created_by: +actionedBy,
                  booking_status_id: 10, // booking_status_ref_id - PASSED
                  candidate_id: piRef.tspId,
                  appointment_type_id: 1,
                  slot_time_id: bookingStatus.time_slot_id,
                  withdraw_reason: 'PASSED',
                  date: bookingStatus.date,
                  booking_id: details.bookingStatusId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              ]
            });
            await this.prisma.bookingStatus.update({
              where: {
                id: details.bookingStatusId
              },
              data: {
                updated_at: new Date().toISOString(),
                updated_by: +actionedBy,
                status: 4 // booking_status_ref_id - COMPLETED
              }
            });
            // update booking_history, booking status, bs_candidate level
            await this.prisma.candidateLevel.upsert({
              where: {
                candidate_id: piRef.tspId
              },
              create: {
                candidate_id: piRef.tspId,
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
            await this.mail.sendPIPassEmailv2(
              bookingStatus.candidate.approved_personal_data?.firstName ?? '',
              bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
            );
            break;
          }
          case 'fail': {
            await this.prisma.bookingHistory.createMany({
              data: [
                {
                  created_by: +actionedBy,
                  booking_status_id: 4, // booking_status_ref_id - COMPLETED
                  candidate_id: piRef.tspId,
                  appointment_type_id: 1,
                  slot_time_id: bookingStatus.time_slot_id,
                  withdraw_reason: 'COMPLETED',
                  date: bookingStatus.date,
                  booking_id: details.bookingStatusId,
                  interviewer_id: bookingStatus.interviewer_id
                },
                {
                  created_by: +actionedBy,
                  booking_status_id: 9, // booking_status_ref_id - FAILED
                  candidate_id: piRef.tspId,
                  appointment_type_id: 1,
                  slot_time_id: bookingStatus.time_slot_id,
                  withdraw_reason: 'FAILED',
                  date: bookingStatus.date,
                  booking_id: details.bookingStatusId,
                  interviewer_id: bookingStatus.interviewer_id
                }
              ]
            });
            await this.prisma.bookingStatus.update({
              where: {
                id: details.bookingStatusId
              },
              data: {
                updated_at: new Date().toISOString(),
                updated_by: +actionedBy,
                status: 4 // booking_status_ref_id - COMPLETED
              }
            });
            await this.prisma.candidateLevel.upsert({
              where: {
                candidate_id: piRef.tspId
              },
              create: {
                candidate_id: piRef.tspId,
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
            const reasonMessages = {
              Language:
                'Your overall communication and Language was not up to the expected standards.',
              'Subject Knowledge':
                'Your overall Subject Knowledge was not up to the expected standards.',
              'Educational Qualifications':
                'Your Educational Qualifications are not matched with our hiring criteria for this position.',
              Age: 'You currently do not fit into our hiring Age limits.'
            };
            const message = reasonMessages[details.finalReason ?? ' '];

            await this.mail.sendPIFailEmailv2(
              bookingStatus.candidate.approved_personal_data?.firstName ?? '',
              bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
              [message]
            );
            break;
          }
          case 'dropout': {
            await this.prisma.bookingHistory.create({
              data: {
                created_by: +actionedBy,
                booking_status_id: 14, // booking_status_ref_id - DROPOUT
                candidate_id: piRef.tspId,
                appointment_type_id: 1,
                slot_time_id: bookingStatus.time_slot_id,
                withdraw_reason: 'DROPOUT',
                date: bookingStatus.date,
                booking_id: details.bookingStatusId,
                interviewer_id: bookingStatus.interviewer_id
              }
            });
            await this.prisma.bookingStatus.update({
              where: {
                id: details.bookingStatusId
              },
              data: {
                updated_at: new Date().toISOString(),
                updated_by: +actionedBy,
                status: 4 // booking_status_ref_id - COMPLETED
              }
            });
            await this.prisma.candidateLevel.upsert({
              where: {
                candidate_id: piRef.tspId
              },
              create: {
                candidate_id: piRef.tspId,
                updatedAt: new Date().toISOString(),
                step4UpdatedAt: new Date().toISOString(),
                step4: 'Dropout'
              },
              update: {
                updatedAt: new Date().toISOString(),
                step4UpdatedAt: new Date().toISOString(),
                step4: 'Dropout'
              }
            });

            if (details.finalReason === 'Lost Interest') {
              await this.mail.sendPIDropoutNoanswerEmailv2(
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
              );
            } else {
              await this.mail.sendPIDropoutEmailv2(
                bookingStatus.candidate.approved_personal_data?.firstName ?? '',
                bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
              );
            }
            break;
          }
          case 'investigate': {
            await this.prisma.bookingHistory.create({
              data: {
                created_by: +actionedBy,
                candidate_id: piRef.tspId,
                appointment_type_id: 1,
                slot_time_id: bookingStatus.time_slot_id,
                booking_status_id: 4, // booking_status_ref_id - NOT_BOOKED
                withdraw_reason: 'COMPLETED',
                date: bookingStatus.date,
                booking_id: details.bookingStatusId,
                interviewer_id: bookingStatus.interviewer_id
              }
            });
            await this.prisma.bookingStatus.update({
              where: {
                id: details.bookingStatusId
              },
              data: {
                updated_at: new Date().toISOString(),
                updated_by: +actionedBy,
                status: 4
              }
            });
            await this.mail.sendPIInvestigateEmailv2(
              bookingStatus.candidate.approved_personal_data?.firstName ?? '',
              bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
            );
            break;
          }
        }
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('pi submit fail', error.message);
      throw new Error(error);
    }
  }

  async updatePhoneInterview(
    details: UpdatePhoneInterviewDto,
    actionedBy: number
  ) {
    try {
      const piRef = await this.prisma.piRef.findUnique({
        where: {
          id: details.piRefId
        }
      });

      const data = await this.prisma.piData.create({
        data: {
          bsBookingId: piRef ? +piRef.bookingStatusId : 0,
          updatedBy: +actionedBy,
          piRefId: details.piRefId,
          languageCheck: details.languageCheck,
          grammar: details.grammar,
          pronounciation: details.pronounciation,
          sentenceFormation: details.sentenceFormation,
          languageReason: details.languageReason,
          languageOther: details.languageOther,
          mathCheck: details.mathCheck,
          simpleMathematics: details.simpleMathematics,
          mathReason: this.escapeDoublequotes(details.mathReason),
          mathOther: details.mathOther,
          educationQualification: details.educationQualification,
          cityStatus: details.cityStatus,
          workStatus: details.workStatus,
          paymentMethodStatus: details.paymentMethodStatus,
          overallComments: this.escapeDoublequotes(details.overallComments),
          finalOutcome: details.finalOutcome,
          finalReason: details.finalReason,
          finalReasonOther: this.escapeDoublequotes(details.finalReasonOther),
          adminAdditionalComment: this.escapeDoublequotes(
            details.adminAdditionalComment
          )
        }
      });

      await this.prisma.graRegistrationData.update({
        where: {
          tspId: piRef.tspId
        },
        data: {
          detailsStatus: details.detailsStatus
        }
      });

      const bookingStatus = await this.prisma.bookingStatus.findUnique({
        where: {
          id: piRef.bookingStatusId
        },
        select: {
          candidate_id: true,
          time_slot_id: true,
          interviewer_id: true,
          date: true,
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

      switch (details.finalOutcome) {
        case 'pass': {
          await this.prisma.bookingHistory.createMany({
            data: [
              {
                created_by: +actionedBy,
                booking_status_id: 4, // booking_status_ref_id - COMPLETED
                candidate_id: piRef.tspId,
                appointment_type_id: 1,
                slot_time_id: bookingStatus.time_slot_id,
                withdraw_reason: 'COMPLETED',
                date: bookingStatus.date,
                booking_id: piRef.bookingStatusId,
                interviewer_id: bookingStatus.interviewer_id
              },
              {
                created_by: +actionedBy,
                booking_status_id: 10, // booking_status_ref_id - PASSED
                candidate_id: piRef.tspId,
                appointment_type_id: 1,
                slot_time_id: bookingStatus.time_slot_id,
                withdraw_reason: 'PASSED',
                date: bookingStatus.date,
                booking_id: piRef.bookingStatusId,
                interviewer_id: bookingStatus.interviewer_id
              }
            ]
          });
          await this.prisma.bookingStatus.update({
            where: {
              id: piRef.bookingStatusId
            },
            data: {
              updated_at: new Date().toISOString(),
              updated_by: +actionedBy,
              status: 4 // booking_status_ref_id - COMPLETED
            }
          });
          // update booking_history, booking status, bs_candidate level
          await this.prisma.candidateLevel.upsert({
            where: {
              candidate_id: piRef.tspId
            },
            create: {
              candidate_id: piRef.tspId,
              updatedAt: new Date().toISOString(),
              step4UpdatedAt: new Date().toISOString(),
              step4: 'Pass',
              level: 5
            },
            update: {
              updatedAt: new Date().toISOString(),
              step4UpdatedAt: new Date().toISOString(),
              step4: 'Pass',
              level: 5
            }
          });
          await this.mail.sendPIPassEmailv2(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
          );
          break;
        }
        case 'fail': {
          await this.prisma.bookingHistory.createMany({
            data: [
              {
                created_by: +actionedBy,
                booking_status_id: 4, // booking_status_ref_id - COMPLETED
                candidate_id: piRef.tspId,
                appointment_type_id: 1,
                slot_time_id: bookingStatus.time_slot_id,
                withdraw_reason: 'COMPLETED',
                date: bookingStatus.date,
                booking_id: piRef.bookingStatusId,
                interviewer_id: bookingStatus.interviewer_id
              },
              {
                created_by: +actionedBy,
                booking_status_id: 9, // booking_status_ref_id - FAILED
                candidate_id: piRef.tspId,
                appointment_type_id: 1,
                slot_time_id: bookingStatus.time_slot_id,
                withdraw_reason: 'FAILED',
                date: bookingStatus.date,
                booking_id: piRef.bookingStatusId,
                interviewer_id: bookingStatus.interviewer_id
              }
            ]
          });
          await this.prisma.bookingStatus.update({
            where: {
              id: piRef.bookingStatusId
            },
            data: {
              updated_at: new Date().toISOString(),
              updated_by: +actionedBy,
              status: 4 // booking_status_ref_id - COMPLETED
            }
          });

          const reasonMessages = {
            Language:
              'Your overall communication and Language was not up to the expected standards.',
            'Subject Knowledge':
              'Your overall Subject Knowledge was not up to the expected standards.',
            'Educational Qualifications':
              'Your Educational Qualifications are not matched with our hiring criteria for this position.',
            Age: 'You currently do not fit into our hiring Age limits.'
          };
          const message = reasonMessages[details.finalReason ?? ' '];

          await this.mail.sendPIFailEmailv2(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? '',
            [message]
          );

          break;
        }
        case 'dropout': {
          await this.prisma.bookingHistory.create({
            data: {
              created_by: +actionedBy,
              booking_status_id: 14, // booking_status_ref_id - DROPOUT
              candidate_id: piRef.tspId,
              appointment_type_id: 1,
              slot_time_id: bookingStatus.time_slot_id,
              withdraw_reason: 'DROPOUT',
              date: bookingStatus.date,
              booking_id: piRef.bookingStatusId,
              interviewer_id: bookingStatus.interviewer_id
            }
          });
          await this.prisma.bookingStatus.update({
            where: {
              id: piRef.bookingStatusId
            },
            data: {
              updated_at: new Date().toISOString(),
              updated_by: +actionedBy,
              status: 4 // booking_status_ref_id - COMPLETED
            }
          });
          await this.mail.sendPIDropoutEmailv2(
            bookingStatus.candidate.approved_personal_data?.firstName ?? '',
            bookingStatus.candidate.approved_contact_data?.workEmail ?? ''
          );
          break;
        }
        default: {
          if (details.educationQualification === 'Reject') {
            await this.prisma.bookingHistory.create({
              data: {
                created_by: +actionedBy,
                candidate_id: piRef.tspId,
                appointment_type_id: 1,
                slot_time_id: bookingStatus.time_slot_id,
                booking_status_id: 9, // booking_status_ref_id - NOT_BOOKED
                withdraw_reason: 'FAILED',
                date: bookingStatus.date,
                booking_id: piRef.bookingStatusId,
                interviewer_id: bookingStatus.interviewer_id
              }
            });
            await this.prisma.bookingStatus.update({
              where: {
                id: piRef.bookingStatusId
              },
              data: {
                updated_at: new Date().toISOString(),
                updated_by: +actionedBy,
                status: 4
              }
            });
          }
        }
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async markBookingCompleted(
    details: MarkBookingCompletedRequestDto,
    actionedBy: number
  ) {
    if (details.status === 4) {
      // convert to COMPLETED slot
      try {
        const updatedBooking = await this.prisma.bookingStatus.updateMany({
          where: {
            id: details.id,
            status: 3
          },
          data: {
            updated_at: new Date().toISOString(),
            updated_by: +actionedBy,
            date_slot_inter: 'Attended mark Completed',
            status: 4 // booking_status_ref_id - COMPLETED
          }
        });

        if (updatedBooking.count > 0) {
          return {
            success: true,
            message: 'Slot marked as completed successfully'
          };
        } else {
          return { success: false, error: 'Slot not updated' };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  }

  escapeDoublequotes(input: string) {
    return input ? input.replace(/"/g, '""') : input;
  }

  // async masterTable() {
  //   this.prisma.piRef.findMany({
  //     select: {
  //       id: true,
  //       tspId: true,
  //     }
  //   })
  // }
}
