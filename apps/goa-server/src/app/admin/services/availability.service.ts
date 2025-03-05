import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import moment from 'moment';
import { EmailService } from '../../email/email.service';
import {
  CONTRY_ABBERVIATIONS,
  LEAVE_MOVEMENTS,
  adjustTime,
  convertSLTimeToUKTime,
  convertTimeToMinutes,
  convertUKTimeToSLTime,
  getDatesOfAhead7Days,
  getDatesWithDays,
  getExactDateFromStartingDay,
  getNextDayOfWeekFromDate,
  getTheExactDate,
  getTutorWorkingCountry,
  getWeekDate
} from '../../util';
import { Prisma } from '@prisma/client';
import { UserService } from '../../user/service/user.service';
import {
  UpdateDemandDto,
  AvailabilityBulkActionDto,
  ResignedTutor
} from '../dtos';
import { SlotsService } from '../../slots/slots.service';
@Injectable()
export class AvailabilityService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
    private slotsService: SlotsService,
    private userService: UserService
  ) {}

  //Get Availability List - Start __________________________________
  async getAvailability(params: { skip?: number; take?: number; filter: any }) {
    try {
      const { skip, take, filter } = params;

      const {
        date,
        batch,
        tutor_id,
        tutor_name,
        hour_status,
        status,
        tutorType,
        country,
        slot_status,
        slot_id
      } = JSON.parse(filter);

      //Mondays date
      const mondayDate = moment(getTheExactDate(date, 'Monday'))
        .utc(true)
        .toISOString();
      //Fridays date
      const fridayDate = moment(getTheExactDate(date, 'Friday'))
        .utc(true)
        .toISOString();

      const tutorIdsForResult = [];

      const tutorContriesFilter =
        country.length > 0
          ? country.map((c: string) => CONTRY_ABBERVIATIONS[c])
          : [];

      //If there is nothing for filters get the active tutors
      // Batch and country is not here because its in where clause
      //
      if (
        tutor_id.length === 0 &&
        tutor_name.length === 0 &&
        hour_status.length === 0 &&
        tutorType.length === 0 &&
        status.length === 0
      ) {
        // In here active means tutors on notice and active both tutors
        const ids = await this.userService.getActiveTutorsForEffectiveDate(
          fridayDate
        );
        tutorIdsForResult.push(...ids);
      } else {
        const tutorIDFilter = [];
        const tutorNameFilter = [];
        const tutorStatusFilter = [];
        const tutorHourStateFilter = [];
        const tutorTypeFilter = [];

        if (tutorType.length > 0) {
          const tutorTypes = tutorType
            .map((value) => {
              const lowercaseValue = value.toLowerCase();
              return [value, lowercaseValue];
            })
            .flat();

          const data = await this.userService.getTutorsReleventBusinessLine(
            tutorIdsForResult,
            tutorTypes,
            fridayDate
          );
          const ids = data.map((id) => id.tspId);
          tutorTypeFilter.push(...ids);
        }

        //If tutor id is provided
        if (tutor_id.length > 0) {
          const tutorIdDetails = await this.prisma.tslUser.findMany({
            where: {
              tsl_id: {
                in: tutor_id.map(Number)
              }
            },
            select: {
              tsp_id: true
            }
          });

          const ids = tutorIdDetails.map((id) => id.tsp_id);

          tutorIDFilter.push(...ids);
        }

        // If tutor name is available
        if (tutor_name.length > 0) tutorNameFilter.push(...tutor_name);

        // If hour status is available
        if (hour_status.length > 0) {
          const ids = await this.userService.getTutorsForGivenHourStatus(
            fridayDate,
            hour_status
          );
          tutorHourStateFilter.push(...ids);
        }

        //If status is available
        if (status.length > 0) {
          const ids = await this.userService.getTutorsForGivenMultipleStatus(
            mondayDate,
            status
          );

          tutorStatusFilter.push(...ids);
        }

        const arraysToCompare = [
          tutorStatusFilter,
          tutorHourStateFilter,
          tutorNameFilter,
          tutorIDFilter,
          tutorTypeFilter
        ];

        // Filter out null arrays
        const validArrays = arraysToCompare.filter((arr) => arr.length > 0);

        if (validArrays.length < 2) {
          // If less than 2 valid arrays, return an empty array
          tutorIdsForResult.push(...validArrays[0]);
        } else {
          let commonValues = validArrays[0];

          for (let i = 1; i < validArrays.length; i++) {
            commonValues = commonValues.filter((value) =>
              validArrays[i].includes(value)
            );
          }
          tutorIdsForResult.push(...commonValues);
        }
      }

      const whereClause = {
        user:
          batch.length > 0 || tutorContriesFilter.length > 0
            ? {
                tm_approved_status: {
                  batch: batch.length > 0 ? { in: batch } : {},
                  center:
                    tutorContriesFilter.length > 0
                      ? { in: tutorContriesFilter }
                      : {}
                }
              }
            : {},
        effective_date: {
          lte: mondayDate
        },
        tsp_id: { in: tutorIdsForResult }
      };

      const filterSlotIds = slot_id.map((i) => Number(i)); // convert selected slot Ids from string to number

      const selectedActiveSlotIds =
        await this.slotsService.getActiveSelectedSlotsForEffectiveDate(
          fridayDate,
          filterSlotIds
        ); // get the time period range from filter slot ids

      const selectedSlotIds = selectedActiveSlotIds.map((slot) => slot.slotId); // selected slot ids fetched.

      const slotsAvailableForTimePeriod =
        await this.slotsService.getActiveSlotsForEffectiveDate(fridayDate);

      const count = await this.prisma.gOATutorsSlots.count({
        where: whereClause
      });

      // condition seperately written for the goaTutorSlotDetails section
      const goaQueryConditions: any = {
        effective_date: {
          lte: fridayDate
        },
        slot_id: {
          in:
            selectedSlotIds.length > 0
              ? selectedSlotIds
              : slotsAvailableForTimePeriod.map((slot) => slot.slotId)
        }
      };

      const tutorAvailability = await this.prisma.gOATutorsSlots.findMany({
        skip,
        take,
        where: whereClause,
        select: {
          id: true,
          tsp_id: true,
          GOATutorSlotsDetails: {
            where: goaQueryConditions,
            orderBy: [
              {
                effective_date: 'desc'
                // id: 'desc'
              },
              {
                id: 'desc'
              }
            ],
            distinct: ['slot_id'],
            select: {
              id: true,
              effective_date: true,
              slot_id: true,
              tutor_slot_id: true,
              slot: {
                select: {
                  id: true,
                  time_range_id: true,
                  date: {
                    select: {
                      date: true
                    }
                  }
                }
              },
              slot_status: {
                select: {
                  id: true,
                  code: true,
                  description: true
                }
              },
              slot_status_id: true
            }
          },
          user: {
            select: {
              TslUser: {
                select: {
                  tsl_full_name: true,
                  tsl_id: true,

                  tsl_contract: {
                    where: {
                      start_date: {
                        lte: fridayDate
                      },
                      end_date: {
                        gte: fridayDate
                      },
                      contract_status: 1
                    },
                    select: {
                      contract_id: true
                    },
                    take: 1
                  }
                }
              },
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              tm_approved_status: {
                select: {
                  supervisorName: true,
                  batch: true,
                  center: true
                }
              },
              GOATutorHourState: {
                select: {
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: fridayDate
                      }
                    },
                    orderBy: [
                      { effective_date: 'desc' }, // Primary sorting
                      { created_at: 'desc' } // Secondary sorting
                    ],
                    take: 1,
                    select: {
                      hour_state: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
                }
              },
              /* 
                fetch the booked UK sessions from goa_sessions_future table.
                pass the start date and the end date of the effective date's week.
              */
              GoaSessionsFuture: {
                where: {
                  date: {
                    gte: moment(mondayDate).format('YYYY-MM-DD'),
                    lte: fridayDate
                  },
                  statusId: 1
                },
                select: {
                  sessionType: true,
                  sessionId: true,
                  date: true,
                  slot: true,
                  tspId: true,
                  goaSlotId: true,
                  // This join will return the statuses: BOOKED or CANCELLED.
                  capautSessionStatus: {
                    select: {
                      code: true,
                      id: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      const usBookedSessionsOfTutors =
        await this.getUSBookedSessionsForSelectedTutorsWithTimeRange(
          tutorAvailability.map((ta) => ta.tsp_id),
          mondayDate,
          fridayDate
        );

      const calendar = await this.prisma.calendar.findMany({
        where: {
          holidays_type_id: 2,
          effective_date: {
            gte: mondayDate,
            lte: fridayDate
          }
        },
        select: {
          id: true,
          effective_date: true
        }
      });

      const data = [];
      const userIds = [];
      for (const r of tutorAvailability) {
        const hourStatus =
          r.user.GOATutorHourState[0] &&
          r.user.GOATutorHourState[0].GOATutorHourStateDetails[0]
            ? r.user.GOATutorHourState[0].GOATutorHourStateDetails[0].hour_state
                .name
            : '...';

        const tutorType = await this.userService.getTutorReleventBusinessLine(
          r.tsp_id,
          fridayDate
        );

        const tutorStatus =
          await this.userService.getTutorStatusForSpecificDate(
            r.tsp_id,
            fridayDate
          );

        const country = r.user.tm_approved_status
          ? getTutorWorkingCountry(r.user.tm_approved_status.center)
          : '';

        const contractId =
          r.user.TslUser[0] && r.user.TslUser[0].tsl_contract[0]
            ? r.user.TslUser[0].tsl_contract[0].contract_id
            : 'Pending';

        const movementsForTutor =
          await this.userService.getTutorsMovementForDateRange(
            mondayDate,
            fridayDate,
            r.tsp_id
          );

        const supervisorname =
          r.user.tm_approved_status && r.user.tm_approved_status.supervisorName
            ? r.user.tm_approved_status.supervisorName
            : '...';

        const batch =
          r.user.tm_approved_status && r.user.tm_approved_status.batch
            ? r.user.tm_approved_status.batch
            : 'N/A';

        const restructuredObject = {
          id: r.id,
          user_id: r.tsp_id,
          start_date: moment(mondayDate).format('YYYY-MM-DD'),
          tutor_id: r.user.TslUser[0] ? r.user.TslUser[0].tsl_id : '....',
          tutor_name: r.user.TslUser[0]
            ? r.user.TslUser[0].tsl_full_name
            : '...',
          supervisorName: supervisorname,
          tutorEmail: r.user.approved_contact_data.workEmail,
          hour_status: hourStatus,
          ppUrl: '',
          tutor_status: tutorStatus,
          tutor_slot: r.GOATutorSlotsDetails.length,
          tutor_type: tutorType,
          contract_id: contractId,
          country: country,
          batch: batch
        };

        // tutor's booked UK sessions from capaut table.
        // const bookedSessions = r?.user?.GoaSessionsFuture ?? [];

        const bookedSessions = await this.prisma.goaTslBookedDetails.findMany({
          where: {
            sessionDate: {
              gte: new Date(mondayDate),
              lte: new Date(fridayDate)
            },
            tspId: {
              equals: Number(r.tsp_id)
            },
            status: {
              equals: 6
            }
          },
          select: {
            sessionId: true,
            tutorPhaseGoaMetaData: {
              select: {
                value: true // Primary, Secondary
              }
            },
            goaSlotId: true,
            tspId: true
          }
        });

        // US Booked sessions from capaut table
        const overlappedDetails = await this.checkOverlap(
          selectedActiveSlotIds.length > 0
            ? selectedActiveSlotIds
            : slotsAvailableForTimePeriod,
          usBookedSessionsOfTutors.filter((us) => us.tspId === r.tsp_id),
          hourStatus === 'OH' ? 'oh_time' : 'hh_time',
          mondayDate
        );

        // check the filtered slotIds and pass if the array is not empty. :–––> selectedActiveSlotIds
        for (const slot of selectedActiveSlotIds.length > 0
          ? selectedActiveSlotIds
          : slotsAvailableForTimePeriod) {
          const availabilitForSlot = r.GOATutorSlotsDetails.find(
            (availability) => availability.slot.id === slot.slotId
          );

          const isClose = calendar.some(
            (c) =>
              moment(c.effective_date).format('YYYY-MM-DD') ===
              getWeekDate(slot.details.date.date, date)
          );

          /* 
            Checking with the slot id from the fetched array to get exact booked slot.
              - In future, booked?.capautSessionStatus?.code === 'BOOKED' this checking also can be added if it required.
                - because there are two statuses are coming with that code. 1. BOOKED, and 2. CANCELED.
          */
          const booked = bookedSessions?.find(
            (booked) => booked.goaSlotId === slot.slotId // checking goa slot ids are equal.
          );

          /* 
            checking the booked session is Primary or Secondary.
              - if Primary it will be denoted by P,
              - if Secondary it will be denoted by S
          */
          let bookedVal = '';
          if (booked?.tutorPhaseGoaMetaData.value.toUpperCase() === 'PRIMARY') {
            bookedVal = 'P';
          } else if (
            booked?.tutorPhaseGoaMetaData.value.toUpperCase() === 'SECONDARY'
          ) {
            bookedVal = 'S';
          }

          const usBookingOverlap = overlappedDetails.find(
            (ov) => ov.slotId === slot.slotId
          );

          /* 
            Here I've checked status is Time off, if yes return the TO, if not check US session available or not, if yes return the US value, after that check the bookedVal is not empty value will be denoted by the value of bookedVal.
            if not it will return the value of other statuses such as PA, PC, SA, SC, H, and N.

              –> Below order is followed.
                Approved Time off (TO)
                Session bookings (P/S/US)
                Accepted Availability (PA,SA,PC,SC)
                On hold (H)
                Availability given or not (Y, -)
          */

          const value =
            availabilitForSlot?.slot_status.code === 'TO'
              ? 'TO'
              : usBookingOverlap.overlapped
              ? 'US'
              : bookedVal !== ''
              ? bookedVal
              : availabilitForSlot?.slot_status.code ?? 'N';

          /*
            ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
            - if the user filter using filter status,
                - it checks the passing statuses included in the availabilitForSlot.
                  - if it's not there, then neglect that record.
            - ADDED BY - MISFAR
          */
          if (
            slot_status &&
            slot_status.length > 0 &&
            !slot_status.includes(value)
          ) {
            continue;
          }
          userIds.push(r.tsp_id); // get the tsp ids tutors. if the slot_status has value, only the tsp_id which has that value will be pushed. otherwise all tsp_id will be pushed.
          // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

          const movementForDay = movementsForTutor.filter(
            (move) =>
              new Date(move.effectiveDate) <
              new Date(getTheExactDate(mondayDate, slot.details.date.date))
          );
          const move =
            movementForDay.length === 0 ||
            !LEAVE_MOVEMENTS.includes(movementForDay[0].movementType)
              ? false
              : true;

          const outputKey = `${slot.details.date.date}${slot.details.time_range.id}`;

          restructuredObject[outputKey] = {
            idtutor_time_slots_data: slot.details.time_range.id,
            idslot: slot.slotId,
            value: isClose ? '' : value,
            isClose: isClose,
            movement: availabilitForSlot?.slot_status.id === 5 ? false : move,
            movementType: move ? movementForDay[0].movementType : 'active',
            effective_date: move
              ? moment(movementForDay[0].effectiveDate).format('YYYY-MM-DD')
              : '',
            return_date: move
              ? moment(movementForDay[0].returnDate).format('YYYY-MM-DD')
              : ''
          };
        }

        data.push(restructuredObject);
      }
      const uniqueIds = [...new Set(userIds)]; // get the unique tsp ids.
      const filteredData = data.filter((ds) => uniqueIds.includes(ds.user_id)); // only filter record which has tsp ids in the array.
      const finalData =
        slot_status && slot_status.length > 0 ? filteredData : data; // arrange the data display method according to the condition.

      return { success: true, date: fridayDate, count, data: finalData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //Get Availability List - End __________________________________

  //Update Slot Status - Start __________________________________
  async updateSlotsStatus(params: { details: any; user: any }) {
    const { details, user } = params;
    try {
      const { slots, date } = details;
      const begin = moment(date).isoWeekday(1).utc(true).format();
      const end = moment(date).isoWeekday(5).utc(true).format();
      const today = new Date().toISOString();
      const insertDetails = [];
      const emailDetails = [];

      // Group the data for tutor for make easy to process
      const groupedData = slots.reduce((result, currentSlot) => {
        const { tutorId, slotid, id, value } = currentSlot;

        // Find the tutor entry in the result array
        const tutorEntry = result.find((entry) => entry.tutorId === tutorId);

        // If tutor entry doesn't exist, create a new one
        if (!tutorEntry) {
          result.push({ tutorId, details: [{ slotid, id, value }] });
        } else {
          // If tutor entry exists, add the slotId to its slots array
          tutorEntry.details.push({ slotid, id, value });
        }

        return result;
      }, []);

      // Loop for tutor entries
      for (const tutorEntry of groupedData) {
        const requests = [];

        // Tutors slot details
        const tutorSlotDetails = await this.prisma.gOATutorsSlots.findFirst({
          where: {
            tsp_id: tutorEntry.tutorId
          },
          select: {
            id: true
          }
        });

        // Tutors details
        const tutorDetails = await this.prisma.user.findFirst({
          where: {
            tsp_id: tutorEntry.tutorId
          },
          select: {
            TslUser: {
              select: {
                tsl_full_name: true
              }
            },
            approved_personal_data: {
              select: {
                shortName: true
              }
            },
            approved_contact_data: {
              select: {
                workEmail: true
              }
            },
            GOATutorHourState: {
              select: {
                GOATutorHourStateDetails: {
                  where: {
                    effective_date: {
                      lte: end
                    }
                  },
                  orderBy: {
                    effective_date: 'desc'
                  },
                  take: 1,
                  select: {
                    hour_state: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
        // Supervisor email for tutor
        const supevisoremail = await this.emailService.getSupervisorEmail(
          tutorEntry.tutorId
        );

        for (const detail of tutorEntry.details) {
          // Slot status
          const slotStatus = await this.prisma.gOASlotStatus.findFirst({
            where: {
              code: detail.value
            }
          });

          // Get the slot details
          const slotDetails = await this.prisma.gOASlot.findUnique({
            where: {
              id: detail.slotid
            },
            select: {
              date: {
                select: {
                  date: true
                }
              },
              time_range: {
                select: {
                  hh_time: true,
                  oh_time: true
                }
              }
            }
          });

          // Get the current availability of the slot
          const currentAvailability =
            await this.prisma.gOATutorSlotsDetails.findFirst({
              where: {
                tutor_slot_id: tutorSlotDetails.id,
                slot_id: detail.slotid,
                effective_date: {
                  lte: end
                }
              },
              orderBy: {
                id: 'desc'
              }
            });

          const goodToGo = !currentAvailability
            ? true
            : currentAvailability.slot_status_id !== slotStatus.id
            ? true
            : false;

          if (goodToGo) {
            // Details or data need to be saved
            const day = await this.prisma.gOASlot.findUnique({
              where: {
                id: +detail.slotid
              },
              select: {
                date: true
              }
            });

            const effectiveDateForSlot = moment(
              getTheExactDate(begin, day.date.date)
            ).format();
            const savingData = {
              tutor_slot_id: tutorSlotDetails.id,
              slot_id: detail.slotid,
              slot_status_id: slotStatus.id,
              effective_date: effectiveDateForSlot,
              hour_status: '',
              created_at: today,
              created_by: Number(user.user.tsp_id)
            };

            insertDetails.push(savingData);
            // details needed to email
            requests.push({
              sessionDay: slotDetails.date.date,
              sessionTime:
                await this.userService.getExactSlotTimeRangeForHourState(
                  slotDetails.time_range,
                  tutorDetails.GOATutorHourState[0],
                  begin
                ),
              status1: {
                active: currentAvailability
                  ? currentAvailability.slot_status_id !== 5 &&
                    currentAvailability.slot_status_id !== 8
                    ? true
                    : false
                  : false,
                inActive: currentAvailability
                  ? currentAvailability.slot_status_id === 5
                    ? true
                    : false
                  : false,
                unAccepted: currentAvailability
                  ? currentAvailability.slot_status_id === 8
                    ? true
                    : false
                  : false
              },
              status2: {
                active:
                  slotStatus.id !== 5 && slotStatus.id !== 8 ? true : false,
                inActive: slotStatus.id === 5 ? true : false,
                unAccepted: slotStatus.id === 8 ? true : false
              }
            });

            // Email payload
            emailDetails.push({
              email: tutorDetails.approved_contact_data.workEmail,
              effective_date: effectiveDateForSlot,
              supevisoremail,
              name: tutorDetails.TslUser[0]
                ? tutorDetails.TslUser[0].tsl_full_name
                : tutorDetails.approved_personal_data.shortName,
              requests,
              isInformation: true
            });
          }
        }
      }

      // Saving information
      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.gOATutorSlotsDetails.createMany({
          data: insertDetails
        });
      });

      const adminEmail = process.env.ADMIN_EMAIL; // this wont be used.

      const ccTutorManager = process.env.TUTOR_MANAGER_EMAIL;
      const bccAdminMail = process.env.AVAILABILITY_CHANGE_BCC;

      // Email sending
      await this.emailService.TutorChangesMadeToAvailabilityByAdminService({
        subject: 'Change in Accepted Availability',
        email: emailDetails[0].email,
        supervisorBcc: [
          bccAdminMail !== 'NO_EMAIL' ? bccAdminMail : undefined,
          adminEmail
        ].filter(Boolean),
        ccEmails: [
          ccTutorManager !== 'NO_EMAIL' ? ccTutorManager : undefined
        ].filter(Boolean),

        tutorName: emailDetails[0].name,
        date: moment(emailDetails[0].effective_date)
          .utc(true)
          .format('DD.MM.YYYY'),
        requests: emailDetails[0].requests,
        isInformation: emailDetails[0].isInformation
      });

      return { success: true, message: 'Updated Successfully' };
    } catch (error) {
      console.log(error);

      return { success: false, error: error.message };
    }
  }
  //Update Slot Status - End __________________________________

  //Update Slot Status Bulk Actioning - Start __________________________________
  async availabilityBulkActioning(
    details: AvailabilityBulkActionDto,
    user: any
  ) {
    // Extract the details
    const { tutorIdList, startDate, endDate, workHour, slotStatus } = details;

    try {
      // Validating the API with the minimum data requirement
      if (workHour === '' && slotStatus.slotStatus === '')
        throw new Error('Please insert working hour or slot status');

      // Variable declaration
      const dates: any = getDatesOfAhead7Days(startDate);
      const mondayOfStartDate = moment(startDate)
        .isoWeekday(1)
        .utc(true)
        .format();
      const firdayOfStartDate = moment(startDate)
        .isoWeekday(5)
        .utc(true)
        .format();
      let mondayOfEndDate =
        endDate !== ''
          ? moment(endDate).add(1, 'weeks').isoWeekday(1).utc(true).format()
          : undefined;
      const today = new Date().toISOString();
      const slotStatusUpdate = [];
      const hourStatusUpdate = {
        detailInsert: [],
        mainInsert: []
      };

      const emailDetails = [];

      // If start date and end date in same week
      if (mondayOfEndDate <= moment(dates.Monday).utc(true).format()) {
        const nextMonday = moment(dates.Monday)
          .add(1, 'weeks')
          .utc(true)
          .format();
        mondayOfEndDate = nextMonday;
      }

      // Details needed for slot status update
      const slot =
        slotStatus.slotStatus !== ''
          ? await this.prisma.gOASlot.findFirst({
              where: {
                date: {
                  id: slotStatus.day
                },
                time_range: {
                  id: slotStatus.slotNumber
                }
              },
              select: {
                id: true,
                date: {
                  select: {
                    date: true
                  }
                },
                time_range: {
                  select: {
                    hh_time: true,
                    oh_time: true
                  }
                }
              }
            })
          : undefined;

      const slotStatusDetails =
        slotStatus.slotStatus !== ''
          ? await this.prisma.gOASlotStatus.findFirst({
              where: {
                code: slotStatus.slotStatus
              }
            })
          : undefined;

      // Details needed for working hours update
      const hourStatus =
        workHour !== ''
          ? await this.prisma.gOAHourState.findFirst({
              where: {
                name: workHour
              },
              select: {
                id: true
              }
            })
          : undefined;

      const tutorSlotDetails = await this.prisma.gOATutorsSlots.findMany({
        where: {
          tsp_id: { in: [...tutorIdList] }
        },
        select: {
          id: true,
          tsp_id: true,
          user: {
            select: {
              TslUser: {
                select: {
                  tsl_full_name: true
                }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              },
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              GOATutorHourState: {
                select: {
                  id: true,
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: firdayOfStartDate
                      }
                    },
                    orderBy: {
                      effective_date: 'desc'
                    },
                    take: 1,
                    select: {
                      id: true,
                      hour_state_id: true,
                      hour_state: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          GOATutorSlotsDetails: {
            where: {
              tutor_time_slots: {
                tsp_id: { in: [...tutorIdList] }
              },
              effective_date: {
                lte: firdayOfStartDate
              },
              slot_id: slot?.id
            },
            orderBy: {
              id: 'desc'
            },
            select: {
              tutor_slot_id: true,
              slot_id: true,
              slot_status_id: true
            },
            take: 1 // Limit the number  records to 1
          }
        }
      });

      const hhTime =
        slotStatus.slotStatus !== ''
          ? await this.userService.getExactSlotTimeRangeForHourState(
              slot.time_range,
              {
                GOATutorHourStateDetails: [
                  {
                    hour_state: {
                      name: 'HH'
                    }
                  }
                ]
              },
              mondayOfStartDate
            )
          : undefined;

      const ohTime =
        slotStatus.slotStatus !== ''
          ? await this.userService.getExactSlotTimeRangeForHourState(
              slot.time_range,
              {
                GOATutorHourStateDetails: [
                  {
                    hour_state: {
                      name: 'OH'
                    }
                  }
                ]
              },
              mondayOfStartDate
            )
          : undefined;

      const flexiTime =
        slotStatus.slotStatus !== ''
          ? await this.userService.getExactSlotTimeRangeForHourState(
              slot.time_range,
              {
                GOATutorHourStateDetails: [
                  {
                    hour_state: {
                      name: 'Flexi'
                    }
                  }
                ]
              },
              mondayOfStartDate
            )
          : undefined;

      for (const v of tutorSlotDetails) {
        const requests = [];

        if (slotStatus.slotStatus !== '') {
          // new line edit

          const goodToGo = !v.GOATutorSlotsDetails[0]
            ? true
            : v.GOATutorSlotsDetails[0].slot_status_id !== slotStatusDetails.id
            ? true
            : false;

          if (goodToGo) {
            const effectiveDate = moment(dates[slot.date.date])
              .utc(true)
              .format();

            const savingData = {
              tutor_slot_id: v.id,
              slot_id: slot.id,
              slot_status_id: slotStatusDetails.id,
              effective_date: effectiveDate,
              hour_status: '',
              created_at: today,
              created_by: Number(user.user.tsp_id)
            };

            slotStatusUpdate.push(savingData);

            const tutorHourState = v.user.GOATutorHourState[0];
            const tutorHourStateDetails =
              tutorHourState && tutorHourState.GOATutorHourStateDetails[0];

            const sessionTime =
              (tutorHourStateDetails &&
                tutorHourStateDetails.hour_state.name !== 'Flexi') ||
              false
                ? tutorHourStateDetails.hour_state.name === 'HH'
                  ? hhTime
                  : ohTime
                : flexiTime;

            // Email Data Add
            requests.push({
              sessionDay: slot.date.date,
              sessionTime: sessionTime,
              status1: {
                active: v.GOATutorSlotsDetails[0]
                  ? v.GOATutorSlotsDetails[0].slot_status_id !== 5 &&
                    v.GOATutorSlotsDetails[0].slot_status_id !== 8
                    ? true
                    : false
                  : false,
                inActive: v.GOATutorSlotsDetails[0]
                  ? v.GOATutorSlotsDetails[0].slot_status_id === 5
                    ? true
                    : false
                  : false,
                unAccepted: v.GOATutorSlotsDetails[0]
                  ? v.GOATutorSlotsDetails[0].slot_status_id === 8
                    ? true
                    : false
                  : false
              },
              status2: {
                active:
                  slotStatusDetails.id !== 5 && slotStatusDetails.id !== 8
                    ? true
                    : false,
                inActive: slotStatusDetails.id === 5 ? true : false,
                unAccepted: slotStatusDetails.id === 8 ? true : false
              }
            });

            // If End date exists add the existing event to be activated in the end
            if (endDate !== '' && v.GOATutorSlotsDetails[0]) {
              const savingData = {
                tutor_slot_id: v.GOATutorSlotsDetails[0].tutor_slot_id,
                slot_id: v.GOATutorSlotsDetails[0].slot_id,
                slot_status_id: v.GOATutorSlotsDetails[0].slot_status_id,
                effective_date: mondayOfEndDate,
                hour_status: '',
                created_at: today,
                created_by: Number(user.user.tsp_id)
              };

              slotStatusUpdate.push(savingData);
            }

            // Get Supervisor email for tutor
            const supevisoremail = await this.emailService.getSupervisorEmail(
              v.tsp_id
            );

            // Details needed to send details
            emailDetails.push({
              email: v.user.approved_contact_data.workEmail,
              supevisoremail,
              name: v.user.TslUser[0]
                ? v.user.TslUser[0].tsl_full_name
                : v.user.approved_personal_data.shortName,
              requests,
              isInformation: true
            });
          }
        }

        //If working hours are available
        if (workHour !== '') {
          const checkRecordAvailable =
            v.user.GOATutorHourState[0] &&
            v.user.GOATutorHourState[0].GOATutorHourStateDetails[0]
              ? true
              : false;

          // If record exists just add the detail only
          if (checkRecordAvailable) {
            const savingData = {
              tutor_hour_state_id: v.user.GOATutorHourState[0].id,
              effective_date: mondayOfStartDate,
              hour_state_id: hourStatus.id,
              created_at: today
            };
            hourStatusUpdate.detailInsert.push(savingData);
            // If End date exists add the existing event to be activated in the end
            if (endDate !== '') {
              const existingHourStatus =
                v.user.GOATutorHourState[0].GOATutorHourStateDetails[0];

              if (existingHourStatus) {
                const savingData = {
                  tutor_hour_state_id: v.user.GOATutorHourState[0].id,
                  effective_date: mondayOfEndDate,
                  hour_state_id: existingHourStatus.hour_state_id,
                  created_at: today
                };
                hourStatusUpdate.detailInsert.push(savingData);
              }
            }
          } else {
            // Else add the whole record
            const savingData = {
              created_at: today,
              tsp_id: v.tsp_id,
              GOATutorHourStateDetails: {
                create: {
                  effective_date: mondayOfStartDate,
                  hour_state_id: hourStatus.id,
                  created_at: today
                }
              }
            };
            hourStatusUpdate.mainInsert.push(savingData);
          }
        }
      }

      // Inserting data to the database
      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Insert slot details
        if (slotStatusUpdate.length > 0) {
          await tx.gOATutorSlotsDetails.createMany({
            data: slotStatusUpdate
          });
        }

        // Insert hour status details
        if (hourStatusUpdate.detailInsert.length > 0) {
          await tx.gOATutorHourStateDetails.createMany({
            data: hourStatusUpdate.detailInsert
          });
        }

        // Insert hour status which has no record previously.
        if (hourStatusUpdate.mainInsert.length > 0) {
          for (const insertData of hourStatusUpdate.mainInsert) {
            await tx.gOATutorHourState.create({
              data: insertData
            });
          }
        }
      });

      const adminEmail = process.env.ADMIN_EMAIL;
      // Email sending

      const ccTutorManager = process.env.TUTOR_MANAGER_EMAIL;
      const bccAdminMail = process.env.AVAILABILITY_CHANGE_BCC;

      for (const emailData of emailDetails) {
        await this.emailService.TutorChangesMadeToAvailabilityByAdminService({
          subject: 'Change in Accepted Availability',
          email: emailData.email,
          supervisorBcc: [
            bccAdminMail !== 'NO_EMAIL' ? bccAdminMail : undefined,
            adminEmail
          ].filter(Boolean),
          ccEmails: [
            ccTutorManager !== 'NO_EMAIL' ? ccTutorManager : undefined
          ].filter(Boolean),
          tutorName: emailData.name,
          date: moment(startDate).format('DD.MM.YYYY'),
          requests: emailData.requests,
          isInformation: emailData.isInformation
        });
      }

      return { success: true, message: 'Updated Successfully' };
    } catch (error) {
      console.log(error);

      return { success: false, error: error.message };
    }
  }
  //Update Slot Status Bulk Actioning - End __________________________________

  //Update Hour Status - Start __________________________________
  async updateHourStatus(details) {
    try {
      const { id, tsp_id, hour_status, effective_date } = details;

      const insertedDate = moment.utc(effective_date).local().format(); // changing this format date to below line.

      const hourStatus = await this.prisma.gOAHourState.findFirst({
        where: {
          name: { contains: hour_status }
        },
        select: {
          id: true,
          name: true
        }
      });

      if (!hourStatus) throw new Error('Hour status not found');

      const checkRecordAvailable =
        await this.prisma.gOATutorHourState.findFirst({
          where: {
            tsp_id: tsp_id
          },
          select: {
            id: true
          }
        });

      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        if (checkRecordAvailable) {
          await tx.gOATutorHourStateDetails.create({
            data: {
              tutor_hour_state_id: checkRecordAvailable.id,
              effective_date: insertedDate,
              hour_state_id: hourStatus.id,
              created_at: new Date().toISOString()
            }
          });
        } else {
          await tx.gOATutorHourState.create({
            data: {
              created_at: new Date().toISOString(),
              tsp_id: tsp_id,
              GOATutorHourStateDetails: {
                create: {
                  effective_date: insertedDate,
                  hour_state_id: hourStatus.id,
                  created_at: new Date().toISOString()
                }
              }
            }
          });
        }
      });

      return { success: true, data: { id: id, hour_status: hourStatus } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //Update Hour Status - End __________________________________

  // Header of the availability (admin table) fetch the slots dynamically for displaying in the table - Start __________________
  async getTimeSlot() {
    try {
      const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ];

      const result = await this.prisma.gOASlot.findMany({
        select: {
          date: {
            select: {
              id: true,
              date: true
            }
          },
          time_range_id: true
        }
      });

      const data = result.flatMap((value) => {
        return {
          id: `${value.date.date}${value.time_range_id}`,
          date: value.date.date,
          slot: value.time_range_id
        };
      });

      data.sort((a, b) => {
        const dayOrderA = daysOfWeek.indexOf(a.date);
        const dayOrderB = daysOfWeek.indexOf(b.date);

        // If the days are different, sort based on the order of daysOfWeek
        if (dayOrderA !== dayOrderB) {
          return dayOrderA - dayOrderB;
        }

        // If the days are the same, sort based on the slot
        return a.slot - b.slot;
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Header of the availability (admin table) fetch the slots dynamically for displaying in the table - End __________________

  //  Get Batch Number for filter suggestion - Start ____________________________________
  async getBatch(params: string) {
    const filter = params;
    try {
      const result = await this.prisma.tmApprovedStatus.findMany({
        where: {
          batch: {
            contains: filter
          }
        },
        distinct: ['batch'],
        select: {
          batch: true
        }
      });

      const data = result.map((key) => {
        return {
          tspId: Number(key.batch),
          name: key.batch
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //  Get Batch Number for filter suggestion - End ____________________________________

  //  Get Tutor ID for filter suggestion - Start ______________________________________
  async getTutorID(filter: number) {
    try {
      const result = await this.prisma
        .$queryRaw`SELECT  DISTINCT tsp_id, tsl_id FROM tsl_user WHERE tsl_id LIKE ${
        filter + '%'
      };`;

      const data = (result as unknown as any[]).map((key) => {
        return {
          tspId: Number(key.tsp_id),
          name: Number(key.tsl_id) + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  //  Get Tutor ID for filter suggestion - End ______________________________________

  //  Get Tutor Name for filter suggestion - Start ___________________________________
  async getTutorName(params: string) {
    const filter = params;

    try {
      const users = await this.prisma.tslUser.findMany({
        where: {
          AND: {
            tsl_full_name: {
              contains: filter
            }
          }
        },
        distinct: ['tsl_full_name'],
        select: {
          tsp_id: true,
          tsl_full_name: true
        }
      });

      const data = users.map((key) => {
        return {
          tspId: Number(key.tsp_id),
          name: key.tsl_full_name
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //  Get Tutor Name for filter suggestion - End ___________________________________

  //  Get Tutor time slots - Start ________________________________________________
  async getTutorTimeSlots(filter: number) {
    try {
      const result = await this.prisma.gOATutorsSlots.findMany({
        where: {
          AND: {
            tsp_id: {
              equals: Number(filter)
            }
          }
        },
        orderBy: [
          {
            effective_date: 'desc'
          }
        ],
        take: 1,
        include: {
          GOATutorSlotsDetails: true
        }
      });

      const data = result.flatMap((value) => {
        return {
          id: value.id,
          time_slots: value.GOATutorSlotsDetails
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //  Get Tutor time slots - End ________________________________________________

  // Get slot Report - Start ________________________________________________
  async getHourReport(params: { date?: any; slot?: number }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const status = await tx.gOATutorSlotsDetails.groupBy({
          by: ['hour_status'],
          where: {
            slot_status_id: {
              in: [1, 2]
            }
          },
          _count: {
            slot_id: true
          }
        });

        const coverStatus = await tx.gOATutorSlotsDetails.groupBy({
          by: ['hour_status'],
          where: {
            slot_status_id: {
              in: [3, 4]
            }
          },
          _count: {
            slot_id: true
          }
        });

        const pending = await tx.gOATutorsSlots.count({
          where: {
            hour_status: {
              in: ['']
            }
          }
        });

        const timeOf = await tx.gOATutorSlotsDetails.count({
          where: {
            slot_status_id: {
              in: [7]
            }
          }
        });

        const cover = coverStatus.reduce((prev, curr) => {
          return { ...prev, [curr.hour_status]: curr._count.slot_id };
        }, {});

        const sta = status.reduce((prev, curr) => {
          return { ...prev, [curr.hour_status]: curr._count.slot_id };
        }, {});

        return { cover: cover, uncover: sta, pending, timeOf };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Get slot Report - End ________________________________________________

  //  Get Status for filter - Start _______________________________________
  async getStatus() {
    try {
      const result = await this.prisma.tmApprovedStatus.findMany({
        distinct: ['movementType'],
        select: {
          movementType: true
        }
      });

      const getAllStatus = result.map((e) => {
        return e.movementType;
      });

      // Removing nulls and add onborading status
      const filteredArray = getAllStatus
        .filter((value) => value !== null)
        .concat('Onboarding');

      return {
        success: true,
        data: filteredArray
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //  Get Status for filter - End _______________________________________

  // Get Demand Summary Data - Start __________________________________
  /* 
      async demandSumerization(startDate, businessUnit) {
        const responseArr = [];

        const mondayDate = moment(startDate)
          .isoWeekday(1)
          .utc(true)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .format();
        const fridayDate = moment(startDate)
          .isoWeekday(5)
          .utc(true)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .format();

        const detailsOfSummery = [
          {
            type: 'Booked',
            color: '#B5D6F1'
          },
          {
            type: 'Bookable',
            color: '#8CDDC7'
          },
          {
            type: 'Cover',
            color: '#FFF1A8'
          },
          {
            type: 'Other',
            color: '#DCDCDC'
          }
        ];

        const selectedHourStatues = ['OH', 'HH'];
        let totalAvailableTutorsForWeek = 0;
        let totalCoverTutorsForWeek = 0;
        let totalBookedSessionsForWeek = 0;

        try {
          // get the time ranges/time slots per day
          const timeSlots = await this.prisma.gOATimeRange.findMany({
            orderBy: {
              id: 'asc'
            }
          });

          // Get the comiunity and on hold (HR) tutors who are ready for sessions
          const communityTutors =
            await this.userService.getComiunityReadyforSessionsTutors(mondayDate);

          const communityTutorsCount = communityTutors.length;

          // // Get the available tutors for the time frame
          const releventTutors =
            await this.userService.getActiveTutorsForEfectiveDate(fridayDate);

          const requiredTutors =
            await this.userService.getTutorsReleventBusinessLine(
              releventTutors,
              [
                businessUnit,
                businessUnit.toLowerCase(),
                'Primary and Secondary',
                'primary and secondary'
              ],
              fridayDate
            );

          //Requied tutors movment details in the week
          const movementsForTutor =
            await this.userService.getTutorsMovementForDateRangeByTutorList(
              mondayDate,
              fridayDate,
              requiredTutors.map((t) => t.tspId)
            );

          // Loop the available time slots
          for (const timeSlot of timeSlots) {
            // Get the slots available for that time slot
            const slots = await this.prisma.gOASlot.findMany({
              where: {
                time_range_id: timeSlot.id
              },
              select: {
                id: true,
                date: {
                  select: {
                    date: true,
                    id: true
                  }
                }
              },
              orderBy: {
                date_id: 'asc'
              }
            });

            const countDetailsFromAvailability =
              await this.getActiveTutorsCountOfAvailabilityForTimeRangeOrderByHourStatus(
                mondayDate,
                fridayDate,
                businessUnit,
                selectedHourStatues,
                requiredTutors,
                slots,
                movementsForTutor
              );

            const slotIds = slots.map((slot) => slot.id);
            // Hour slots loop
            for (const hStatus of selectedHourStatues) {
              // Get hour status details
              const houtStatus = await this.prisma.gOAHourState.findFirst({
                where: {
                  name: hStatus
                },
                select: {
                  id: true
                }
              });

              const statusDays = {};

              // Get the latest demand for the sent date
              const demands = await this.prisma.gOADemand.findMany({
                where: {
                  slot_id: { in: slotIds },
                  hour_status_id: houtStatus.id,
                  business_unit: businessUnit,
                  effective_date: {
                    lte: fridayDate
                  }
                },
                distinct: ['slot_id'],
                orderBy: {
                  id: 'desc'
                }
              });

              // Get the latest booking details for the sent date

              const bookedDetails = await this.prisma.gOABookedSessionsV2.findMany({
                where: {
                  slot_id: { in: slotIds },
                  hour_status_id: houtStatus.id,
                  business_unit: businessUnit,
                  effective_date: {
                    gte: mondayDate,
                    lte: fridayDate
                  }
                },
                distinct: ['slot_id', 'effective_date'],
                orderBy: {
                  created_at: 'desc'
                }
              });

              const commonBookedDetails =
                await this.prisma.gOABookedSessionsV2.findMany({
                  where: {
                    slot_id: { in: slotIds },
                    hour_status_id: houtStatus.id,
                    business_unit: 'Common',
                    effective_date: {
                      gte: mondayDate,
                      lte: fridayDate
                    }
                  },
                  distinct: ['slot_id', 'effective_date'],
                  orderBy: {
                    created_at: 'desc'
                  }
                });

              for (const slot of slots) {
                let totalPrimaryAvailable = 0;
                let totalCommonAvailable = 0;
                let totalPrimaryCover = 0;
                let totalCommonCover = 0;
                let totalHold = 0;

                // Details calculation
                const bookedDetail = bookedDetails.find(
                  (bd) => bd.slot_id === slot.id
                );

                const commonBookedDetail = commonBookedDetails.find(
                  (bd) => bd.slot_id === slot.id
                );

                const commonBookedAmount = commonBookedDetail
                  ? commonBookedDetail.amount
                  : 0;

                const bookedAmount = bookedDetail ? bookedDetail.amount : 0;

                if (Array.isArray(countDetailsFromAvailability)) {
                  const result = countDetailsFromAvailability.find(
                    (a) => a.slotId === slot.id && a.hourState == hStatus
                  );
                  // Asigning values
                  totalPrimaryAvailable = result.available.primary;
                  totalCommonAvailable = result.available.common;
                  totalPrimaryCover = result.cover.primary;
                  totalCommonCover = result.cover.common;
                  totalHold = result.hold;

                  //Reducing the booked sessions from given availability
                  totalPrimaryAvailable = totalPrimaryAvailable - bookedAmount;

                  if (totalPrimaryAvailable < 0) {
                    totalCommonAvailable =
                      totalCommonAvailable + totalPrimaryAvailable;
                  }
                }

                // Amounts should be in the  summery
                const percentages = [
                  bookedAmount + commonBookedAmount,
                  totalPrimaryAvailable + totalCommonAvailable,
                  totalPrimaryCover + totalCommonCover,
                  totalHold + communityTutorsCount
                ];

                //Total Available tutors for the week (After deducting the booked counts)
                totalAvailableTutorsForWeek =
                  totalAvailableTutorsForWeek +
                  (totalPrimaryAvailable + totalCommonAvailable);

                //Total Cover tutors for the week
                totalCoverTutorsForWeek =
                  totalCoverTutorsForWeek + (totalPrimaryCover + totalCommonCover);

                //Total Booked tutors for the week
                totalBookedSessionsForWeek += bookedAmount;

                // Amounts description
                const descriptions = [
                  [
                    // Booked amount
                    {
                      name: 'Pupil',
                      amount: bookedAmount
                    },
                    {
                      name: 'No Pupil',
                      amount: commonBookedAmount
                    }
                  ],
                  [
                    // Availability
                    {
                      name: businessUnit,
                      amount: totalPrimaryAvailable < 0 ? 0 : totalPrimaryAvailable
                    },
                    {
                      name: 'Common',
                      amount: totalCommonAvailable
                    }
                  ],
                  [
                    // Cover
                    {
                      name: businessUnit,
                      amount: totalPrimaryCover
                    },
                    {
                      name: 'Common',
                      amount: totalCommonCover
                    }
                  ],
                  [
                    // Holds
                    {
                      name: 'On Hold',
                      amount: totalHold
                    },
                    {
                      name: 'Community',
                      amount: communityTutorsCount
                    }
                  ]
                ];

                const summeryDetails = detailsOfSummery.map((d, index) => {
                  return {
                    type: d.type,
                    color: d.color,
                    percentage: percentages[index],
                    desciption: descriptions[index]
                  };
                });

                statusDays[slot.date.date.toLowerCase()] = {
                  slotId: slot.id,
                  demandId: demands.find((demand) => demand.slot_id === slot.id)
                    ?.id,
                  demand: demands.find((demand) => demand.slot_id === slot.id)
                    ?.amount,
                  hourStatusId: houtStatus.id,
                  changed: false,
                  summeryDetails
                };
              }

              const time = await this.userService.getDaylightSavingTimeUdpate(
                timeSlot[`${hStatus.toLowerCase()}_time`],
                new Date(mondayDate)
              );

              const ukTime = this.convertToUKTime(time);

              const data = {
                id: responseArr.length + 1,
                time,
                ukTime,
                ...statusDays
              };

              responseArr.push(data);
            }
          }

          const buffer =
            ((totalAvailableTutorsForWeek + totalCoverTutorsForWeek) /
              totalBookedSessionsForWeek) *
            100;

          return { buffer: parseFloat(buffer.toFixed(2)), details: responseArr };
        } catch (error) {
          console.log(error);
          return { success: false, error: error.message };
        }
      } 
  */

  async demandSumerization(startDate, businessUnit) {
    const responseArr = [];

    const mondayDate = moment(startDate)
      .isoWeekday(1)
      .utc(true)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .format();
    const fridayDate = moment(startDate)
      .isoWeekday(5)
      .utc(true)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .format();

    console.log('mondayDate', moment(mondayDate).format('YYYY-MM-DD'));
    console.log('fridayDate', fridayDate);

    /* 
      - fetch primary and secondary bookable tutor counts.
      - when only businessUnit is primary this function will be called.
    */
    let primaryBookable =
      businessUnit.toUpperCase() === 'PRIMARY'
        ? await this.getAvailabilityCountForSlots(
            moment(mondayDate).format('YYYY-MM-DD'),
            'primary',
            'normal'
          )
        : { success: false, message: '', data: [] };

    primaryBookable = primaryBookable?.data
      .map((d: any) => d.availability_count)
      .flat(Infinity);

    let secondaryBookable = await this.getAvailabilityCountForSlots(
      moment(mondayDate).format('YYYY-MM-DD'),
      'secondary',
      'normal'
    );

    secondaryBookable = secondaryBookable?.data
      .map((d: any) => d.availability_count)
      .flat(Infinity);

    /* 
      - fetch primary and secondary available cover tutor counts.
      - when only businessUnit is primary this function will be called.
    */
    let primaryCoverTutors =
      businessUnit.toUpperCase() === 'PRIMARY'
        ? await this.getAvailabilityCountForSlots(
            moment(mondayDate).format('YYYY-MM-DD'),
            'primary',
            'credit'
          )
        : { success: false, message: '', data: [] };

    let secondaryCoverTutors = await this.getAvailabilityCountForSlots(
      moment(mondayDate).format('YYYY-MM-DD'),
      'secondary',
      'credit'
    );

    // get the exact data into array and merged child arrays into a single array.
    primaryCoverTutors = primaryCoverTutors?.data
      .map((d: any) => d.availability_count)
      .flat(Infinity);

    // get the exact data into array and merged child arrays into a single array.
    secondaryCoverTutors = secondaryCoverTutors?.data
      .map((d: any) => d.availability_count)
      .flat(Infinity);

    const detailsOfSummery = [
      {
        type: 'Booked',
        color: '#B5D6F1'
      },
      {
        type: 'Bookable',
        color: '#8CDDC7'
      },
      {
        type: 'Cover',
        color: '#FFF1A8'
      },
      {
        type: 'Other',
        color: '#DCDCDC'
      }
    ];

    const selectedHourStatues = ['OH', 'HH'];
    const totalAvailableTutorsForWeek = 0;
    let totalCoverTutorsForWeek = 0;
    let totalBookedSessionsForWeek = 0;

    try {
      // get the time ranges/time slots per day
      const timeSlots = await this.prisma.gOATimeRange.findMany({
        orderBy: {
          id: 'asc'
        }
      });

      // Get the comiunity and on hold (HR) tutors who are ready for sessions
      const communityTutors =
        await this.userService.getComiunityReadyforSessionsTutors(mondayDate);

      const communityTutorsCount = communityTutors.length;

      // // Get the available tutors for the time frame
      const releventTutors =
        await this.userService.getActiveTutorsForEfectiveDate(fridayDate);

      const requiredTutors =
        await this.userService.getTutorsReleventBusinessLine(
          releventTutors,
          [
            businessUnit,
            businessUnit.toLowerCase(),
            'Primary and Secondary',
            'primary and secondary'
          ],
          fridayDate
        );

      //Requied tutors movment details in the week
      const movementsForTutor =
        await this.userService.getTutorsMovementForDateRangeByTutorList(
          mondayDate,
          fridayDate,
          requiredTutors.map((t) => t.tspId)
        );

      // Loop the available time slots
      for (const timeSlot of timeSlots) {
        // Get the slots available for that time slot
        const slots = await this.prisma.gOASlot.findMany({
          where: {
            time_range_id: timeSlot.id
          },
          select: {
            id: true,
            date: {
              select: {
                date: true,
                id: true
              }
            }
          },
          orderBy: {
            date_id: 'asc'
          }
        });

        /* const countDetailsFromAvailability =
          await this.getActiveTutorsCountOfAvailabilityForTimeRangeOrderByHourStatus(
            mondayDate,
            fridayDate,
            businessUnit,
            selectedHourStatues,
            requiredTutors,
            slots,
            movementsForTutor
          ); */

        const slotIds = slots.map((slot) => slot.id);
        // Hour slots loop
        for (const hStatus of selectedHourStatues) {
          // Get hour status details
          const houtStatus = await this.prisma.gOAHourState.findFirst({
            where: {
              name: hStatus
            },
            select: {
              id: true
            }
          });

          const statusDays = {};

          // Get the latest demand for the sent date
          const demands = await this.prisma.gOADemand.findMany({
            where: {
              slot_id: { in: slotIds },
              hour_status_id: houtStatus.id,
              business_unit: businessUnit,
              effective_date: {
                lte: fridayDate
              }
            },
            distinct: ['slot_id'],
            orderBy: {
              id: 'desc'
            }
          });

          /* 
            FETCHING BOOKED SESSION CODE BLOCK ----------------------xxxxxxxxxxx---------- START
          */

          /* 
            - get the latest booked counts according to the tutor type.
            - change the businessUnit to number value.
              - if PRIMARY then 4,
              - if SECONDARY then 5
          */
          const businessUnitValue: number =
            businessUnit.toUpperCase() === 'PRIMARY' ? 4 : 5;

          const bookedSessions = await this.prisma.goaTslBookedDetails.findMany(
            {
              where: {
                goaSlotId: { in: slotIds },
                hourSlot: hStatus,
                tutorPhase: businessUnitValue,
                sessionDate: {
                  gte: mondayDate,
                  lte: fridayDate
                },
                status: 6
              },
              distinct: ['goaSlotId', 'sessionDate'],
              orderBy: {
                createdAt: 'desc'
              },
              select: {
                tspId: true,
                tutorId: true,
                sessionDate: true,
                goaSlotId: true,
                tutorPhaseGoaMetaData: {
                  select: {
                    value: true
                  }
                }
              }
            }
          );

          const bookedTspIds: number[] = [
            ...new Set(bookedSessions?.map((val) => val.tspId) || [])
          ]; // get the booked sessions tutor tsp ids.

          const fetchTutorLinesOfBookedTutors =
            await this.prisma.tmApprovedStatus.findMany({
              where: {
                tutorTspId: { in: bookedTspIds }
              },
              select: {
                tutorLine: true,
                tutorTspId: true
              }
            });

          // Merge the arrays
          const mergedBookedSession = bookedTspIds.map((tspId) => {
            const matchingTutor = fetchTutorLinesOfBookedTutors.find(
              (tutor) => tutor.tutorTspId === tspId
            );
            return {
              tspId,
              tutorLine: matchingTutor?.tutorLine || 'Unknown' // Default to 'Unknown' if no match
            };
          });

          // Define the structure for the counts object
          interface Counts {
            PRIMARY: number;
            PRIMARY_AND_SECONDARY: number;
          }

          // Initialize groupedBookedCounts as an empty object
          const groupedBookedCounts: { [key: number]: Counts } = {};

          // Iterate over bookedSessions to group by goaSlotId
          bookedSessions.forEach((session) => {
            const { goaSlotId } = session;

            // Find the tutorLine for the current tspId
            const matchingTutor = mergedBookedSession.find(
              (item) => item.tspId === session.tspId
            );

            if (!matchingTutor) return; // Skip if no tutorLine is found

            const tutorLineKey = matchingTutor.tutorLine
              .toUpperCase()
              .replace(/\s+/g, '_'); // Format key

            // Only consider 'PRIMARY' and 'PRIMARY_AND_SECONDARY'
            if (!['PRIMARY', 'PRIMARY_AND_SECONDARY'].includes(tutorLineKey))
              return;

            // Initialize the structure for this goaSlotId if not already
            if (!groupedBookedCounts[goaSlotId]) {
              groupedBookedCounts[goaSlotId] = {
                PRIMARY: 0,
                PRIMARY_AND_SECONDARY: 0
              };
            }

            // Increment the appropriate count for the current goaSlotId
            groupedBookedCounts[goaSlotId][tutorLineKey]++;
          });

          // Convert groupedBookedCounts object into an array
          const groupedBookedCountsArray = Object.entries(
            groupedBookedCounts
          ).map(([goaSlotId, counts]: [string, Counts]) => ({
            goaSlotId: Number(goaSlotId), // Convert goaSlotId back to a number
            ...counts // Spread the count object into the array item
          }));
          /* 
            FETCHING BOOKED SESSION CODE BLOCK ----------------------xxxxxxxxxxx---------- END
          */

          // Output groupedBookedCounts
          // console.log('groupedBookedCountsArray', groupedBookedCountsArray);

          for (const slot of slots) {
            const totalPrimaryAvailable = 0;
            const totalCommonAvailable = 0;
            const totalPrimaryCover = 0;
            const totalCommonCover = 0;
            const totalHold = 0;

            // Details calculation
            const bookedDetail = groupedBookedCountsArray.find(
              (bd) => bd.goaSlotId === slot.id
            );

            // get the count of primary bookable tutors
            const bookablePrimary = primaryBookable?.find(
              (pb) => pb.goa_slot_id === slot.id && pb.hour_code === hStatus
            );

            // get the count of secondary bookable tutors
            const bookableSecondary = secondaryBookable?.find(
              (sb) => sb.goa_slot_id === slot.id && sb.hour_code === hStatus
            );

            // get the count of primary cover tutors
            const coverPrimary = primaryCoverTutors?.find(
              (pc) => pc.goa_slot_id === slot.id && pc.hour_code === hStatus
            );

            // get the count of secondary cover tutors
            const coverSecondary = secondaryCoverTutors?.find(
              (sc) => sc.goa_slot_id === slot.id && sc.hour_code === hStatus
            );

            // final primary bookable
            const finalPrimaryBookable: number = bookablePrimary
              ? bookablePrimary.available
              : 0;

            // final secondary bookable
            const finalSecondaryBookable: number = bookableSecondary
              ? bookableSecondary.available
              : 0;

            // final primary cover value
            const finalPrimaryCoverCount: number = coverPrimary
              ? coverPrimary?.available
              : 0;

            // final secondary cover value
            const finalSecondaryCoverCount: number = coverSecondary
              ? coverSecondary?.available
              : 0;

            const primaryBookedAmount = bookedDetail ? bookedDetail.PRIMARY : 0; // tutor type PRIMARY booked count
            const secondaryBookedAmount = bookedDetail
              ? bookedDetail.PRIMARY_AND_SECONDARY
              : 0; // tutor type PRIMARY AND SECONDARY booked count

            // get the total booked count
            const totalBookedCount =
              businessUnitValue === 4
                ? primaryBookedAmount + secondaryBookedAmount
                : secondaryBookedAmount;

            const totalBookableCount =
              businessUnitValue === 4
                ? finalPrimaryBookable + finalSecondaryBookable
                : finalSecondaryBookable;

            const totalCoverTutors =
              businessUnitValue === 4
                ? finalPrimaryCoverCount + finalSecondaryCoverCount
                : finalSecondaryCoverCount;

            /* if (Array.isArray(countDetailsFromAvailability)) {
              const result = countDetailsFromAvailability.find(
                (a) => a.slotId === slot.id && a.hourState == hStatus
              );
              // Asigning values
              totalPrimaryAvailable = result.available.primary;
              totalCommonAvailable = result.available.common;
              totalPrimaryCover = result.cover.primary;
              totalCommonCover = result.cover.common;
              totalHold = result.hold;

              //Reducing the booked sessions from given availability
              totalPrimaryAvailable =
                totalPrimaryAvailable - primaryBookedAmount;

              if (totalPrimaryAvailable < 0) {
                totalCommonAvailable =
                  totalCommonAvailable + totalPrimaryAvailable;
              }
            } */

            // Amounts should be in the  summery
            const percentages = [
              totalBookedCount,
              totalBookableCount,
              totalCoverTutors,
              communityTutorsCount
              // totalHold + communityTutorsCount
            ];

            //Total Available tutors for the week (After deducting the booked counts)
            /* totalAvailableTutorsForWeek =
              totalAvailableTutorsForWeek +
              (totalPrimaryAvailable + totalCommonAvailable); */

            //Total Cover tutors for the week
            totalCoverTutorsForWeek =
              totalCoverTutorsForWeek + totalCoverTutors;

            //Total Booked tutors for the week
            totalBookedSessionsForWeek += totalBookedCount;

            // Amounts description
            const descriptions = [
              [
                // Booked amount
                ...(businessUnitValue === 4
                  ? [
                      {
                        name: 'Primary Tutors',
                        amount: primaryBookedAmount
                      }
                    ]
                  : []),
                {
                  name: 'Secondary Tutors',
                  amount: secondaryBookedAmount
                }
              ],
              [
                // Availability
                ...(businessUnitValue === 4
                  ? [
                      {
                        name: 'Primary Tutors',
                        amount: finalPrimaryBookable,
                        break_down: bookablePrimary?.breakdown_counts
                      }
                    ]
                  : []),
                {
                  name: 'Secondary Tutors',
                  amount: finalSecondaryBookable,
                  break_down: bookableSecondary?.breakdown_counts
                }
              ],
              [
                // Cover
                ...(businessUnitValue === 4
                  ? [
                      {
                        name: 'Primary Tutors',
                        amount: finalPrimaryCoverCount
                      }
                    ]
                  : []),

                {
                  name: 'Secondary Tutors',
                  amount: finalSecondaryCoverCount
                }
              ],
              [
                // Holds
                /* {
                  name: 'On Hold',
                  amount: totalHold
                }, */
                {
                  name: 'Community Tutors',
                  amount: communityTutorsCount
                }
              ]
            ].map((subArray) =>
              subArray.filter((item) => Object.keys(item).length > 0)
            );

            const summeryDetails = detailsOfSummery.map((d, index) => {
              return {
                type: d.type,
                color: d.color,
                percentage: percentages[index],
                desciption: descriptions[index]
              };
            });

            statusDays[slot.date.date.toLowerCase()] = {
              slotId: slot.id,
              demandId: demands.find((demand) => demand.slot_id === slot.id)
                ?.id,
              demand: demands.find((demand) => demand.slot_id === slot.id)
                ?.amount,
              hourStatusId: houtStatus.id,
              changed: false,
              summeryDetails
            };
          }

          const time = await this.userService.getDaylightSavingTimeUdpate(
            timeSlot[`${hStatus.toLowerCase()}_time`],
            new Date(mondayDate)
          );

          const ukTime = this.convertToUKTime(time);

          const data = {
            id: responseArr.length + 1,
            time,
            ukTime,
            ...statusDays
          };

          responseArr.push(data);
        }
      }

      const buffer =
        ((totalAvailableTutorsForWeek + totalCoverTutorsForWeek) /
          totalBookedSessionsForWeek) *
        100;

      return { buffer: parseFloat(buffer.toFixed(2)), details: responseArr };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  // this function is not in use. But have to keep it until go for the PRODUCTION as a backup. --- Misfar
  async xzxgetAvailabilityCountForSlots(
    requiredStartDate: string,
    tutorTypeCode: string,
    type: string
  ): Promise<any> {
    try {
      console.log(
        'payload:' + JSON.stringify({ requiredStartDate, tutorTypeCode, type })
      );
      const dateFormat = 'YYYY-MM-DD';
      const isValidStartDate = moment(
        requiredStartDate,
        dateFormat,
        true
      ).isValid();
      //Start Date
      const startDate = moment(requiredStartDate, dateFormat).format();
      //Same Week Last day (Friday)
      const { monday, friday } = await this.getWeekMondayAndFriday(
        new Date(startDate)
      );

      const fridayDate = moment(friday, dateFormat).format();

      const tutorTypes = {
        secondary: ['Primary and Secondary', 'primary and secondary'],
        primary: [
          'Primary',
          'primary',
          'Primary and Secondary',
          'primary and secondary'
        ]
      };

      const data = await this.userService.getTutorsReleventBusinessLineV2(
        tutorTypes[tutorTypeCode],
        fridayDate
      );

      const movementsForTutors =
        await this.userService.getTutorsMovementForDateRangeByTutorList(
          moment(startDate).utc(true).toISOString(),
          fridayDate,
          data.map((item) => item.tspId)
        );

      const eligibleTutors = await this.selectEligibleTutorsForSessions(
        movementsForTutors,
        data.map((item) => item.tspId)
      );
      // 8912

      const ohTutors = await this.userService.getTutorsForGivenHourStatus(
        fridayDate.toString(),
        ['OH']
      );

      const hhTutors = await this.userService.getTutorsForGivenHourStatus(
        fridayDate.toString(),
        ['HH']
      );

      //Filter eligible tutors from OH and HH Tutors
      const hourStates = [
        {
          code: 'OH',
          tutors: ohTutors.filter((id) => eligibleTutors.includes(id))
        },
        {
          code: 'HH',
          tutors: hhTutors.filter((id) => eligibleTutors.includes(id))
        }
      ];

      if (!isValidStartDate) {
        throw new BadRequestException(
          `Invalid date format. Expected format is ${dateFormat}.`
        );
      }

      const dayDetails = await this.prisma.gOADaysOFWeek.findMany({
        where: {
          date: {
            in: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          }
        }
      });

      const datesWithDay = dayDetails.map((day) => {
        const dateByNumber = moment(getTheExactDate(startDate, day.date))
          .utc(true)
          .toString();
        const datee = getExactDateFromStartingDay(startDate, day.date);
        return { datee, dateByNumber, ...day };
      });

      const idsStringOH = hourStates[0].tutors.join(',');
      const idsStringHH = hourStates[1].tutors.join(',');

      const result = [];
      for (const date of datesWithDay) {
        const goaSlots = await this.prisma.gOASlot.findMany({
          where: {
            date_id: date.id
          },
          select: {
            id: true,
            date_id: true,
            status: true,
            created_at: true,
            updated_at: true,
            time_range_id: true,
            time_range: true
          }
        });
        const availabilityCount = [];

        for (const slot of goaSlots) {
          for (const hourState of hourStates) {
            // const goa = await this.prisma.gOATutorsSlots.findMany({
            //   where: {
            //     tsp_id: { in: hourState.tutors }
            //   }
            // });

            // const availableTutors1: any =
            //   await this.prisma.gOATutorSlotsDetails.findMany({
            //     where: {
            //       tutor_time_slots: {
            //         tsp_id: { in: hourState.tutors }
            //       },
            //       // tutor_slot_id: {
            //       //   in: goa.map((g) => g.id)
            //       // },
            //       slot_id: slot.id,
            //       // slot_status_id: {
            //       //   in: [1, 2, 6, 7, 8]
            //       // },
            //       slot_status: {
            //         code: {
            //           in: ['Y', 'TO', 'PA', 'SA', 'H'] //
            //         }
            //       },
            //       effective_date: {
            //         lte: fridayDate
            //       }
            //     },
            //     orderBy: [
            //       {
            //         id: 'desc'
            //       }
            //     ]
            //     // distinct: ['tutor_slot_id']
            //   });

            // Convert array to comma-separated string for SQL IN clause
            //Normal and Credit Avaialability
            const slotStatusIds =
              type == 'normal' ? [1, 2, 6, 7, 8].join(',') : [3, 4].join(',');

            const idsString =
              hourState.code == 'OH' ? idsStringOH : idsStringHH;
            let availableTutors: any = [];
            if (hourState.tutors.length > 0) {
              availableTutors = await this.prisma.$queryRawUnsafe(`
                SELECT *
                FROM main_app_db_sandbox.goa_tutors_slots t1
                INNER JOIN (
                    SELECT t2.*
                    FROM main_app_db_sandbox.goa_tutors_slots_details t2
                    WHERE t2.id IN (
                        SELECT MAX(t3.id)
                        FROM main_app_db_sandbox.goa_tutors_slots_details t3
                        WHERE t3.slot_id = ${slot.id}
                        AND effective_date <= '${fridayDate}'
                        GROUP BY t3.tutor_slot_id
                    )
                    AND t2.slot_status_id IN (${slotStatusIds})
                    AND t2.effective_date <= '${fridayDate}'
                ) t2
                ON t1.id = t2.tutor_slot_id
                WHERE t1.tsp_id IN (${idsString});
              `);
            }

            const bookedTutors = await this.prisma.goaTslBookedDetails.findMany(
              {
                where: {
                  sessionDate: new Date(date.dateByNumber),
                  goaSlotId: slot.id,
                  tspId: {
                    not: null
                  },
                  hourSlot: hourState.code
                }
              }
            );

            let groupedBookable: { [key: string]: number } = {
              accepted: 0,
              on_hold: 0,
              un_actioned: 0
            }; // Initialize with default values

            let filteredAvailableTutors;
            if (type === 'normal') {
              filteredAvailableTutors = availableTutors.filter(
                (available) =>
                  !bookedTutors.some(
                    (booked) =>
                      booked.tspId === available.tsp_id &&
                      booked.goaSlotId === available.tutor_slot_id
                  )
              );

              // Group by slot_status_id with custom grouping and counting
              groupedBookable = filteredAvailableTutors.reduce((acc, tutor) => {
                const { slot_status_id } = tutor;

                // Grouping based on slot_status_id with underscore format keys
                if (slot_status_id === 1 || slot_status_id === 2) {
                  acc['accepted'] = (acc['accepted'] || 0) + 1;
                } else if (slot_status_id === 8) {
                  acc['on_hold'] = (acc['on_hold'] || 0) + 1;
                } else if (slot_status_id === 6) {
                  acc['un_actioned'] = (acc['un_actioned'] || 0) + 1;
                }

                return acc;
              }, groupedBookable); // Start with the default values
            }

            availabilityCount.push({
              slot_id: slot.time_range_id,
              goa_slot_id: slot.id,
              hour_code: hourState.code,
              time:
                hourState.code === 'OH'
                  ? convertSLTimeToUKTime(slot.time_range.oh_time) //OH // No need to consider BST or STandard Time here
                  : convertSLTimeToUKTime(slot.time_range.hh_time), //HH // No need to consider BST or STandard Time here
              available:
                type === 'normal'
                  ? filteredAvailableTutors.length
                  : availableTutors.length - bookedTutors.length,
              // available: availableTutors.length
              breakdown_counts: groupedBookable
            });
          }
        }
        result.push({
          day: date.date,
          required_date: moment(date.dateByNumber).format(dateFormat),
          availability_count: availabilityCount
        });
      }

      return {
        success: true,
        message: 'Successfully retrieved availability data',
        data: [...result]
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  // get the availability count for the session demand function
  async xgetAvailabilityCountForSlots(
    requiredStartDate: string,
    tutorTypeCode: string,
    type: string
  ): Promise<any> {
    try {
      console.log(
        'payload:' + JSON.stringify({ requiredStartDate, tutorTypeCode, type })
      );
      const dateFormat = 'YYYY-MM-DD';
      const isValidStartDate = moment(
        requiredStartDate,
        dateFormat,
        true
      ).isValid();
      //Start Date
      const startDate = moment(requiredStartDate, dateFormat).format();
      //Same Week Last day (Friday)
      const { monday, friday } = await this.getWeekMondayAndFriday(
        new Date(startDate)
      );

      const fridayDate = moment(friday, dateFormat).format();
      // const fridayDate = new Date(friday);

      // const fridayDate = moment(getTheExactDate(startDate, 'Friday'))
      //   .utc(true)
      //   .toISOString();

      const tutorTypes = {
        secondary: ['Primary and Secondary', 'primary and secondary'],
        primary: [
          'Primary',
          'primary',
          'Primary and Secondary',
          'primary and secondary'
        ]
      };

      // const data = await this.userService.getTutorsReleventBusinessLineV2(
      //   tutorTypes[tutorTypeCode],
      //   fridayDate
      // );

      // Getting Active - Elogible tutors -- START ---
      const releventTutors =
        await this.userService.getActiveTutorsForEfectiveDate(fridayDate);

      const data = await this.userService.getTutorsReleventBusinessLine(
        releventTutors,
        tutorTypes[tutorTypeCode],
        fridayDate
      );
      // Getting Active - Elogible tutors -- END ---

      // const data: any = await this.getEligibleTutors(
      //   tutorTypes[tutorTypeCode],
      //   fridayDate
      // );

      // const d = data.map((item) => ({
      //   tspId: item.tspId
      // }));

      // console.log('data:' + JSON.stringify(d));
      // console.log('data-l:' + d.length); //124

      // const movementsForTutors =
      //   await this.userService.getTutorsMovementForDateRangeByTutorList(
      //     moment(startDate).utc(true).toISOString(),
      //     fridayDate,
      //     data.map((item) => item.tspId)
      //   );

      const movementsForTutors =
        await this.userService.getTutorsMovementForDateRangeByTutorList(
          new Date(startDate),
          fridayDate,
          data.map((item) => item.tspId)
        );

      const eligibleTutors = await this.selectEligibleTutorsForSessions(
        movementsForTutors,
        data.map((item) => item.tspId)
      );
      // 8912

      const ohTutors = await this.userService.getTutorsForGivenHourStatus(
        fridayDate.toString(),
        ['OH']
      );

      const hhTutors = await this.userService.getTutorsForGivenHourStatus(
        fridayDate.toString(),
        ['HH']
      );

      //Filter eligible tutors from OH and HH Tutors
      const hourStates = [
        {
          code: 'OH',
          tutors: ohTutors.filter((id) => eligibleTutors.includes(id))
        },
        {
          code: 'HH',
          tutors: hhTutors.filter((id) => eligibleTutors.includes(id))
        }
      ];

      if (!isValidStartDate) {
        throw new BadRequestException(
          `Invalid date format. Expected format is ${dateFormat}.`
        );
      }

      const dayDetails = await this.prisma.gOADaysOFWeek.findMany({
        where: {
          date: {
            in: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          }
        }
      });

      const datesWithDay = dayDetails.map((day) => {
        const dateByNumber = moment(getTheExactDate(startDate, day.date))
          .utc(true)
          .toString();
        const datee = getExactDateFromStartingDay(startDate, day.date);
        return { datee, dateByNumber, ...day };
      });

      const idsStringOH = hourStates[0].tutors.join(',');
      const idsStringHH = hourStates[1].tutors.join(',');

      const result = [];
      for (const date of datesWithDay) {
        const goaSlots = await this.prisma.gOASlot.findMany({
          where: {
            date_id: date.id
          },
          select: {
            id: true,
            date_id: true,
            status: true,
            created_at: true,
            updated_at: true,
            time_range_id: true,
            time_range: true
          }
        });

        const availabilityCount = [];

        for (const slot of goaSlots) {
          for (const hourState of hourStates) {
            // const goa = await this.prisma.gOATutorsSlots.findMany({
            //   where: {
            //     tsp_id: { in: hourState.tutors }
            //   }
            // });

            // const availableTutors1: any =
            //   await this.prisma.gOATutorSlotsDetails.findMany({
            //     where: {
            //       tutor_time_slots: {
            //         tsp_id: { in: hourState.tutors }
            //       },
            //       // tutor_slot_id: {
            //       //   in: goa.map((g) => g.id)
            //       // },
            //       slot_id: slot.id,
            //       // slot_status_id: {
            //       //   in: [1, 2, 6, 7, 8]
            //       // },
            //       slot_status: {
            //         code: {
            //           in: ['Y', 'TO', 'PA', 'SA', 'H'] //
            //         }
            //       },
            //       effective_date: {
            //         lte: fridayDate
            //       }
            //     },
            //     orderBy: [
            //       {
            //         id: 'desc'
            //       }
            //     ]
            //     // distinct: ['tutor_slot_id']
            //   });

            // Convert array to comma-separated string for SQL IN clause
            /**
             *  ----Normal and Credit Avaialability
             *  normal - normal availability (For Cover tutors)
             *  credit - credit avaialability (For Cover tutors)
             */
            const slotStatusIds =
              tutorTypeCode == 'primary'
                ? type == 'normal'
                  ? [1, 2, 6, 8].join(',') // in tsl count TO also included, but here I removed TO
                  : [3].join(',')
                : type == 'normal' // secondary
                ? [1, 2, 6, 8].join(',') // in tsl count TO also included, but here I removed TO
                : [4].join(',');

            // const slotStatusIds = type == 'normal' ? [1, 2, 6, 7, 8].join(',') : [3, 4].join(',');

            const idsString =
              hourState.code == 'OH' ? idsStringOH : idsStringHH;
            let availableTutors: any = [];
            if (hourState.tutors.length > 0) {
              availableTutors = await this.prisma.$queryRawUnsafe(`
                SELECT *
                FROM main_app_db_sandbox.goa_tutors_slots t1
                INNER JOIN (
                    SELECT t2.*
                    FROM main_app_db_sandbox.goa_tutors_slots_details t2
                    WHERE t2.id IN (
                        SELECT MAX(t3.id)
                        FROM main_app_db_sandbox.goa_tutors_slots_details t3
                        WHERE t3.slot_id = ${slot.id}
                        AND effective_date <= '${fridayDate}'
                        GROUP BY t3.tutor_slot_id
                    )
                    AND t2.slot_status_id IN (${slotStatusIds})
                    AND t2.effective_date <= '${fridayDate}'
                ) t2
                ON t1.id = t2.tutor_slot_id
                WHERE t1.tsp_id IN (${idsString});
              `);
            }

            let groupedBookable: { [key: string]: number } = {
              accepted: 0,
              on_hold: 0,
              un_actioned: 0,
              other: 0
            }; // Initialize with default values

            if (type === 'normal') {
              // Group by slot_status_id with custom grouping and counting
              groupedBookable = availableTutors.reduce((acc, tutor) => {
                const { slot_status_id } = tutor;

                // Grouping based on slot_status_id with underscore format keys
                if (slot_status_id === 1 || slot_status_id === 2) {
                  acc['accepted'] = (acc['accepted'] || 0) + 1;
                } else if (slot_status_id === 8) {
                  acc['on_hold'] = (acc['on_hold'] || 0) + 1;
                } else if (slot_status_id === 6) {
                  acc['un_actioned'] = (acc['un_actioned'] || 0) + 1;
                } else {
                  acc['other'] = (acc['other'] || 0) + 1; // if any case anyother statuses popout.
                }

                return acc;
              }, groupedBookable); // Start with the default values
            }

            availabilityCount.push({
              slot_id: slot.time_range_id,
              goa_slot_id: slot.id,
              hour_code: hourState.code,
              time:
                hourState.code === 'OH'
                  ? convertSLTimeToUKTime(slot.time_range.oh_time) //OH // No need to consider BST or STandard Time here
                  : convertSLTimeToUKTime(slot.time_range.hh_time), //HH // No need to consider BST or STandard Time here //HH // No need to consider BST or STandard Time here
              available: availableTutors.length,
              breakdown_counts: groupedBookable
            });
          }
        }
        result.push({
          day: date.date,
          required_date: moment(date.dateByNumber).format(dateFormat),
          availability_count: availabilityCount
        });
      }

      return {
        success: true,
        message: 'Successfully retrieved availability data',
        data: [...result]
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  async getAvailabilityCountForSlots(
    requiredStartDate: string,
    tutorTypeCode: string,
    type: string
  ): Promise<any> {
    try {
      console.log(`
      ----------------------------------------
      [LOG - ${new Date().toISOString()}]
      -- getAvailabilityCountForSlots --
      RequiredStartDate: ${requiredStartDate}  | tutorTypeCode: ${tutorTypeCode} | type: ${type}
      ----------------------------------------
      `);
      const dateFormat = 'YYYY-MM-DD';
      const isValidStartDate = moment(
        requiredStartDate,
        dateFormat,
        true
      ).isValid();

      if (!isValidStartDate) {
        throw new BadRequestException(
          `Invalid date format. Expected format is ${dateFormat}.`
        );
      }
      //Start Date
      const startDate = moment(requiredStartDate, dateFormat).format();
      //Same Week Last day (Friday)
      const { friday } = await this.getWeekMondayAndFriday(new Date(startDate));
      const fridayDate = moment(friday, dateFormat).format();

      const eligibleTutorsResponse = await this.getEligibalTutors(
        startDate,
        friday,
        tutorTypeCode
      );

      // Getting Active - Elogible tutors -- END ---

      const dayDetails = await this.prisma.gOADaysOFWeek.findMany({
        where: {
          date: {
            in: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          }
        }
      });

      const datesWithDay = dayDetails.map((day) => {
        const dateByNumber = moment(getTheExactDate(startDate, day.date))
          .utc(true)
          .toString();
        const datee = getExactDateFromStartingDay(startDate, day.date);
        return { datee, dateByNumber, ...day };
      });

      const idsStringOH = eligibleTutorsResponse.hourStates[0].tutors.join(',');
      const idsStringHH = eligibleTutorsResponse.hourStates[1].tutors.join(',');

      const result = [];
      for (const date of datesWithDay) {
        const goaSlots = await this.prisma.gOASlot.findMany({
          where: {
            date_id: date.id
          },
          select: {
            id: true,
            date_id: true,
            status: true,
            created_at: true,
            updated_at: true,
            time_range_id: true,
            time_range: true
          }
        });
        // console.log('fridayDate:' + JSON.stringify(fridayDate));
        const availabilityCount = [];

        const today = moment().startOf('day'); // Start of today's date (midnight);
        // Calculate the difference in days
        const daysDifference = moment(date.dateByNumber).diff(today, 'days');

        let isWithing48Hourse = false;
        if (daysDifference <= 2) {
          isWithing48Hourse = true;
        }
        for (const slot of goaSlots) {
          for (const hourState of eligibleTutorsResponse.hourStates) {
            const today = moment().startOf('day'); // Start of today's date (midnight);
            // Calculate the difference in days
            const daysDifference = moment(startDate).diff(today, 'days');

            // Convert array to comma-separated string for SQL IN clause
            /**
             *  ----Normal and Credit Avaialability
             *  normal - normal availability (For Cover tutors)
             *  credit - credit avaialability (For Cover tutors)
             */
            let slotStatusIds = '';
            if (isWithing48Hourse) {
              // For Bookings within 48 hours, the sales team should only be able to see accepted availabilities (PA or SA)
              slotStatusIds =
                tutorTypeCode == 'primary'
                  ? type == 'normal'
                    ? [1, 2].join(',')
                    : [1, 2, 3].join(',')
                  : type == 'normal' // secondary
                  ? [1, 2].join(',')
                  : [1, 2, 4].join(',');
            } else {
              slotStatusIds =
                tutorTypeCode == 'primary'
                  ? type == 'normal'
                    ? [1, 2, 6, 7, 8].join(',')
                    : [1, 2, 3].join(',')
                  : type == 'normal' // secondary
                  ? [1, 2, 6, 7, 8].join(',')
                  : [1, 2, 4].join(',');
            }

            // const slotStatusIds =
            // type == 'normal' ? [1, 2, 6, 7, 8].join(',') : [3, 4].join(',');

            const idsString =
              hourState.code == 'OH' ? idsStringOH : idsStringHH;
            let availableTutors: any = [];
            if (hourState.tutors.length > 0) {
              availableTutors = await this.prisma.$queryRawUnsafe(`
                SELECT *
                FROM main_app_db_sandbox.goa_tutors_slots t1
                INNER JOIN (
                    SELECT t2.*
                    FROM main_app_db_sandbox.goa_tutors_slots_details t2
                    WHERE t2.id IN (
                        SELECT MAX(t3.id)
                        FROM main_app_db_sandbox.goa_tutors_slots_details t3
                        WHERE t3.slot_id = ${slot.id}
                        AND effective_date <= '${fridayDate}'
                        GROUP BY t3.tutor_slot_id
                    )
                    AND t2.slot_status_id IN (${slotStatusIds})
                    AND t2.effective_date <= '${fridayDate}'
                ) t2
                ON t1.id = t2.tutor_slot_id
                WHERE t1.tsp_id IN (${idsString});
              `);
            }

            let groupedBookable: { [key: string]: number } = {
              accepted: 0,
              on_hold: 0,
              un_actioned: 0,
              other: 0
            }; // Initialize with default values

            if (type === 'normal') {
              // Group by slot_status_id with custom grouping and counting
              groupedBookable = availableTutors.reduce((acc, tutor) => {
                const { slot_status_id } = tutor;

                // Grouping based on slot_status_id with underscore format keys
                if (slot_status_id === 1 || slot_status_id === 2) {
                  acc['accepted'] = (acc['accepted'] || 0) + 1;
                } else if (slot_status_id === 8) {
                  acc['on_hold'] = (acc['on_hold'] || 0) + 1;
                } else if (slot_status_id === 6) {
                  acc['un_actioned'] = (acc['un_actioned'] || 0) + 1;
                } else {
                  acc['other'] = (acc['other'] || 0) + 1; // if any case anyother statuses popout.
                }

                return acc;
              }, groupedBookable); // Start with the default values
            }

            availabilityCount.push({
              slot_id: slot.time_range_id,
              goa_slot_id: slot.id,
              hour_code: hourState.code,
              time:
                hourState.code === 'OH'
                  ? convertSLTimeToUKTime(slot.time_range.oh_time) //OH // No need to consider BST or STandard Time here
                  : convertSLTimeToUKTime(slot.time_range.hh_time), //HH // No need to consider BST or STandard Time here //HH // No need to consider BST or STandard Time here
              available: availableTutors.length,
              breakdown_counts: groupedBookable
            });
          }
        }
        result.push({
          day: date.date,
          required_date: moment(date.dateByNumber).format(dateFormat),
          availability_count: availabilityCount
        });
      }

      return {
        success: true,
        message: 'Successfully retrieved availability data',
        data: [...result]
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  async getEligibalTutors(startDate, endDate, tutorPhase) {
    console.log(`
    ----------------------------------------
    [LOG - ${new Date().toISOString()}]
    -- Elibibal Tutors --
    startDate: ${startDate}  | endDate: ${endDate} | tutorPhase: ${tutorPhase}
    ----------------------------------------
    `);
    const tutorTypes = {
      secondary: ['Primary and Secondary', 'primary and secondary'],
      primary: [
        'Primary',
        'primary',
        'Primary and Secondary',
        'primary and secondary'
      ]
    };

    const releventTutors: any =
      await this.userService.getActiveTutorsForTimeFrame(
        new Date(startDate),
        new Date(endDate) // friday
      );

    console.log('ActiveTutors:' + JSON.stringify(releventTutors));

    const data = await this.userService.getTutorsReleventBusinessLine(
      releventTutors,
      tutorTypes[tutorPhase.toLowerCase()], // primary, secondary
      new Date(endDate) // fridayDate
    );
    // console.log('ActiveTutors:' + JSON.stringify(releventTutors));
    console.log('IN: 1');

    const eligibleTutors = data.map((item) => item.tspId);

    console.log('eligibleTutors:' + JSON.stringify(eligibleTutors));

    const ohTutors = await this.userService.getTutorsForGivenHourStatus(
      new Date(endDate),
      ['OH']
    );

    console.log('ohTutors:' + ohTutors.length);

    const hhTutors = await this.userService.getTutorsForGivenHourStatus(
      new Date(endDate),
      ['HH']
    );

    console.log('hhTutors:' + hhTutors.length);
    //Filter eligible tutors from OH and HH Tutors
    const hourStates = [
      {
        code: 'OH',
        tutors: ohTutors.filter((id) => eligibleTutors.includes(id))
      },
      {
        code: 'HH',
        tutors: hhTutors.filter((id) => eligibleTutors.includes(id))
      }
    ];

    return { eligibleTutors, hourStates };
  }

  async getWeekMondayAndFriday(date) {
    // Function to get the Monday and Friday of the week for a given date
    const inputDate = moment(date);
    // Find Monday of the same week
    const monday = inputDate.clone().startOf('isoWeek'); // ISO week starts on Monday
    // Find Friday of the same week
    const friday = monday.clone().add(4, 'days'); // Adding 4 days to Monday gives Friday
    // Return given day belong week monday and friday
    return {
      monday: monday.format('YYYY-MM-DD'),
      friday: friday.format('YYYY-MM-DD')
    };
  }

  async selectEligibleTutorsForSessions(movementDetailsForDateRange, tspIds) {
    const movementMap = new Map(
      movementDetailsForDateRange.map((move) => [move.tutorTspId, true])
    );

    const eligibleTutors = tspIds.filter((tspId) => !movementMap.has(tspId));

    return eligibleTutors;
  }

  // Get Demand Summary Data - End __________________________________

  // converting SL time to UK time.
  convertToUKTime = (countryTime: string) => {
    const countryTimeInMoment = moment.tz(countryTime, 'HH:mm', 'Asia/Colombo'); // Sri Lanka timezone
    const ukTime = countryTimeInMoment.tz('Europe/London').format('HH:mm');
    return ukTime;
  };

  // Get Active Tutors Count Of Availability For TimeRange Order By HourStatus - Start ____________________________________
  async getActiveTutorsCountOfAvailabilityForTimeRangeOrderByHourStatus(
    mondayDate,
    fridayDate,
    businesUnit,
    hourStatuses,
    requiredTutors,
    slots,
    movementsForTutor
  ) {
    const tutorSlotsForBusinessUnit = [];

    if (businesUnit === 'Primary') {
      tutorSlotsForBusinessUnit.push(1);
    } else if (businesUnit === 'Secondary') {
      tutorSlotsForBusinessUnit.push(2);
    }

    try {
      const returnArr = [];
      const slotIds = slots.map((slot) => slot.id);
      // Get availability for the time slots and related data in a single query
      const availability = await this.prisma.gOATutorsSlots.findMany({
        where: {
          tsp_id: {
            in: requiredTutors.map((t) => t.tspId)
          },
          effective_date: {
            lte: fridayDate
          }
        },
        include: {
          GOATutorSlotsDetails: {
            where: {
              effective_date: {
                lte: fridayDate
              },
              slot_id: {
                in: slotIds
              }
            },
            orderBy: {
              id: 'desc'
            },
            distinct: ['slot_id']
          },
          user: {
            select: {
              GOATutorHourState: {
                select: {
                  GOATutorHourStateDetails: {
                    where: {
                      effective_date: {
                        lte: fridayDate
                      }
                    },
                    orderBy: {
                      id: 'desc'
                    },
                    take: 1,
                    select: {
                      hour_state: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Loop Hour state
      for (const hourState of hourStatuses) {
        const filteredAvailability = availability.filter((availability) => {
          const hourStateName =
            availability.user?.GOATutorHourState[0]?.GOATutorHourStateDetails[0]
              ?.hour_state?.name;
          return hourStateName === hourState;
        });

        // Loop the slots to get one by one
        for (const slot of slotIds) {
          let totalPrimaryAvailable = 0;
          let totalCommonAvailable = 0;
          let totalPrimaryCover = 0;
          let totalCommonCover = 0;
          let totalHold = 0;

          const slotDetails = slots.find((s) => s.id === slot);

          const dateOfTheDay = getTheExactDate(
            mondayDate,
            slotDetails.date.date
          );

          for (const countableAvailability of filteredAvailability) {
            const movementForDay = movementsForTutor.filter(
              (move) =>
                move.tutorTspId === countableAvailability.tsp_id &&
                new Date(move.effectiveDate) <= new Date(dateOfTheDay)
            );

            if (
              movementForDay.length === 0 ||
              !LEAVE_MOVEMENTS.includes(movementForDay[0].movementType)
            ) {
              const details = countableAvailability.GOATutorSlotsDetails;

              const available = details.some(
                (detail) =>
                  detail.slot_id === slot &&
                  tutorSlotsForBusinessUnit.includes(detail.slot_status_id)
              );

              const cover = details.some(
                (detail) =>
                  detail.slot_id === slot &&
                  [3, 4].includes(detail.slot_status_id)
              );

              const hold = details.some(
                (detail) =>
                  detail.slot_id === slot && detail.slot_status_id === 8
              );

              const tutorBusinessLine = requiredTutors.find(
                (t) => t.tspId === countableAvailability.tsp_id
              );

              if (tutorBusinessLine?.businessLine === businesUnit) {
                if (available) totalPrimaryAvailable += 1;
                if (cover) totalPrimaryCover += 1;
              } else {
                if (available) totalCommonAvailable += 1;
                if (cover) totalCommonCover += 1;
              }
              if (hold) totalHold += 1;
            }
          }

          returnArr.push({
            slotId: slot,
            hourState,
            available: {
              primary: totalPrimaryAvailable,
              common: totalCommonAvailable,
              total: totalPrimaryAvailable + totalCommonAvailable
            },
            cover: {
              primary: totalPrimaryCover,
              common: totalCommonCover,
              total: totalPrimaryCover + totalCommonCover
            },
            hold: totalHold
          });
        }
      }

      return returnArr;
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  // Get Active Tutors Count Of Availability For TimeRange Order By HourStatus - End ____________________________________

  // Update Demand Summary  - Start __________________________________
  async updateDemand(data: UpdateDemandDto, user: any) {
    try {
      const insertingDetails = data.values.map((v) => {
        const mondayDate = moment(v.effectiveDate)
          .isoWeekday(1)
          .utc(true)
          .format();
        return {
          effective_date: mondayDate,
          amount: v.amount,
          business_unit: v.businessUnit,
          slot_id: v.slotId,
          hour_status_id: v.hourStatusId,
          created_at: new Date().toISOString(),
          created_by: user.user.tsp_id
        };
      });

      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.gOADemand.createMany({
          data: insertingDetails
        });
      });

      return { success: true, message: 'Updated Successfully' };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  // Update Demand Summary  - End __________________________________

  //Update availability of resigning tutor - Start __________________________________
  async availabilityUpdateOfResignedTutor(data: ResignedTutor) {
    try {
      const today = new Date().toISOString();
      const effectiveDate = moment(data.lastWorkingDate).add(1, 'day');
      const user = await this.prisma.user.findUnique({
        where: {
          tsp_id: data.tspId
        }
      });

      if (!user) throw new Error('User not found');

      const slots = await this.prisma.gOASlot.findMany({
        select: {
          id: true,
          date: true
        }
      });

      const notStatusOfSlot = await this.prisma.gOASlotStatus.findFirst({
        where: {
          code: 'N'
        }
      });

      const tutorSlot = await this.prisma.gOATutorsSlots.findFirst({
        where: {
          tsp_id: data.tspId
        }
      });

      if (!tutorSlot) throw new Error('Inital data is not available');

      const insertingVal = slots.map((slot) => {
        const eDate = getNextDayOfWeekFromDate(
          effectiveDate.toISOString(),
          slot.date.date
        );

        return {
          tutor_slot_id: tutorSlot.id,
          slot_status_id: notStatusOfSlot.id,
          slot_id: slot.id,
          effective_date: moment(eDate).utc(true).format(),
          hour_status: '',
          created_by: data.actionedUserId,
          created_at: today
        };
      });

      await this.prisma.gOATutorSlotsDetails.createMany({
        data: insertingVal
      });

      return { success: true, message: 'Removed the availability of tutor' };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  async getUSBookedSessionsForSelectedTutorsWithTimeRange(
    tspIds: number[],
    mondayDate: string,
    fridayDate: string
  ): Promise<any> {
    const usBookedSessions = await this.prisma.gOAUsBookedSession.findMany({
      where: {
        tspId: {
          in: tspIds
        },
        sessionScheduledDate: {
          gte: mondayDate,
          lte: fridayDate
        },
        status: {
          in: ['CONFIRMED']
        }
      },
      orderBy: [
        { sessionScheduledDate: 'asc' },
        { sessionScheduledTime: 'asc' }
      ]
    });

    return usBookedSessions;
  }

  // async slotsEffectedByUSSessions(
  //   usSessions: any[],
  //   slotsDetails: any[],
  //   hourStatus: string,
  //   mondayDate: string,
  //   fridayDate: string
  // ) {
  //   console.log(usSessions);

  //   if (usSessions.length === 0) return [];

  //   const dates = getDatesWithDays(mondayDate, fridayDate);

  //   for (const date of dates) {
  //     //Get the session for the date
  //     const sessions = usSessions.filter(
  //       (s) => moment(s.sessionScheduledDate).format('YYYY-MM-DD') === date.date
  //     );

  //     if (sessions.length === 0) continue;

  //     const slotsForDay = slotsDetails.filter(
  //       (sd) => sd.details.date.date === date.day
  //     );

  //     for (const slot of slotsForDay) {
  //       const timeRange =
  //         hourStatus === 'OH'
  //           ? slot.details.time_range.oh_time
  //           : slot.details.time_range.hh_time;

  //       // We are calculating uk session start time reducing 5 minutes
  //       const ukSessionStartTime = adjustTime(timeRange, -5);
  //       const ukSessionEndTime = adjustTime(ukSessionStartTime['24-hour'], 60);

  //       const overlappedSessions = sessions.filter(
  //         (s) =>
  //           ukSessionStartTime['24-hour'] <=
  //             moment(s.sessionScheduledTime, ['HH:mm', 'hh:mm A']).format(
  //               'HH:mm'
  //             ) &&
  //           ukSessionEndTime['24-hour'] >=
  //             moment(s.sessionScheduledTime, ['HH:mm', 'hh:mm A']).format(
  //               'HH:mm'
  //             ) &&
  //           ukSessionStartTime['24-hour'] >=
  //             adjustTime(s.sessionScheduledTime, s.length)['24-hour'] &&
  //           ukSessionEndTime['24-hour'] <=
  //             adjustTime(s.sessionScheduledTime, s.length)['24-hour']
  //       );

  //       // console.log(overlappedSessions);
  //     }
  //   }

  //   return dates;
  // }

  async checkOverlap(slots, usSessions, hourStatus, monday) {
    const output = [];

    // Preprocess usSessions into a hashmap grouped by session date
    const sessionsByDate = usSessions.reduce((acc, session) => {
      const sessionDate = new Date(session.sessionScheduledDate)
        .toISOString()
        .split('T')[0];
      if (!acc[sessionDate]) {
        acc[sessionDate] = [];
      }
      acc[sessionDate].push(session);
      return acc;
    }, {});

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];

      const effectiveDate = new Date(
        getNextDayOfWeekFromDate(monday, slot.details.date.date)
      );

      // Convert effectiveDate to YYYY-MM-DD format
      const targetDateString = effectiveDate.toISOString().split('T')[0];

      // Get relevant sessions for this date in O(1) time
      const usSessionForDate = sessionsByDate[targetDateString] || [];

      if (usSessionForDate.length === 0) {
        output.push({ slotId: slot.slotId, overlapped: false });
        continue;
      }

      const time = await this.userService.getDaylightSavingTimeUdpate(
        slot.details.time_range[hourStatus],
        new Date(monday)
      );

      // Reduce 5 min from start time for keeping time ready for the UK session
      const slotStartTime = adjustTime(time, -5)['24-hour'];

      // Add 60 min to slot start time (US SESSION DURATION === 60 MIN)
      const slotEndTime = adjustTime(slotStartTime, 60)['24-hour'];

      const startTime = moment(slotStartTime, 'HH:mm');
      const endTime = moment(slotEndTime, 'HH:mm');

      const overlapped = usSessionForDate.some((session) => {
        const sessionStartTime = moment(
          session.sessionScheduledTime,
          'hh:mm A'
        );
        const sessionEndTime = moment(
          session.sessionScheduledTime,
          'hh:mm A'
        ).add(session.length, 'minutes');

        // Check if the session start time is within the slot
        const startOverlaps =
          sessionStartTime.isSameOrAfter(startTime) &&
          sessionStartTime.isBefore(endTime);

        // Check if the session end time is within the slot
        const endOverlaps =
          sessionEndTime.isAfter(startTime) &&
          sessionEndTime.isSameOrBefore(endTime);

        return startOverlaps || endOverlaps;
      });

      output.push({ slotId: slot.slotId, overlapped });
    }

    return output;
  }

  // search tutor name and id searching by name or id.
  async getTutorNameOrId(searchItem: string, searchType: string) {
    try {
      // ------ Search by tutor name - START -------------------
      if (searchType === 'byname') {
        const users = await this.prisma.tslUser.findMany({
          where: {
            AND: {
              tsl_full_name: {
                contains: searchItem
              }
            }
          },
          distinct: ['tsl_full_name'],
          select: {
            tsp_id: true,
            tsl_full_name: true,
            tsl_id: true
          }
        });

        const data = users.map((key) => {
          return {
            tsp_id: Number(key.tsp_id),
            tutor_id: Number(key.tsl_id),
            name: key.tsl_full_name
          };
        });
        return { success: true, data: data };

        // ------ Search by tutor name - END -------------------
      } else if (searchType === 'byid') {
        // ------ Search by tutor id - START -------------------
        const result = await this.prisma
          .$queryRaw`SELECT  DISTINCT tsp_id, tsl_id, tsl_full_name FROM tsl_user WHERE tsl_id LIKE ${
          searchItem + '%'
        };`;

        const data = (result as unknown as any[]).map((key) => {
          return {
            tsp_id: Number(key.tsp_id),
            tutor_id: Number(key.tsl_id),
            name: key.tsl_full_name + ''
          };
        });

        return { success: true, data: data };
        // ------ Search by tutor id - END -------------------
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSessionDateBySlotId(
    startDate: string,
    slotId: number,
    tutorId: number
  ) {
    try {
      if (startDate === 'NA') {
        return {};
      }

      const begin = moment(startDate).isoWeekday(1).utc(true).format();

      const day = await this.prisma.gOASlot.findUnique({
        where: {
          id: slotId
        },
        select: {
          date: true,
          time_range_id: true
        }
      });

      const effectiveDateForSlot = moment(
        getTheExactDate(begin, day.date.date)
      ).format();

      return {
        session_date: effectiveDateForSlot,
        slotId,
        tutorId,
        slot_number: day.time_range_id
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSlotNumberByTime(time: string) {
    try {
      const slotStringSL = await convertUKTimeToSLTime(time);

      const gOATimeRangeRes = await this.prisma.gOATimeRange.findFirst({
        where: {
          OR: [
            {
              hh_time: slotStringSL
            },
            {
              oh_time: slotStringSL
            }
          ]
        },
        select: {
          id: true
        }
      });

      return gOATimeRangeRes;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
