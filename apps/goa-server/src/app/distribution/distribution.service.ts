import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import moment = require('moment-timezone');
import { SlotsService } from '../slots/slots.service';
import { UserService } from '../user/service/user.service';
import {
  BookedDetails,
  DistributionRequestDto,
  LaunchedDetails
} from './dtos/distribution.dto';
import {
  convertSLDateTimeToUKTime,
  convertUKDateTimeToSLTime,
  getWeekStartAndEnd,
  convertSLTimeToUKTime,
  getTheExactDate,
  getExactDateFromStartingDay,
  convertUKTimeToSLTime,
  getWeekDate
} from '../util';
import { SlackService } from '../slack/slack/slack.service';
import axios from 'axios';
import { EmailService } from '../email/email.service';

@Injectable()
export class DistributionService {
  constructor(
    private prisma: PrismaService,
    private slotsService: SlotsService,
    private userService: UserService,
    private slackService: SlackService,
    private emailService: EmailService
  ) {}

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
      console.log(
        'eligibleTutors:' +
          JSON.stringify(eligibleTutorsResponse.eligibleTutors)
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

      console.log('datesWithDay:' + JSON.stringify(datesWithDay));

      const idsStringOH = eligibleTutorsResponse.hourStates[0].tutors.join(',');
      const idsStringHH = eligibleTutorsResponse.hourStates[1].tutors.join(',');

      console.log('idsStringOH:' + JSON.stringify(idsStringOH));
      console.log('idsStringHH:' + JSON.stringify(idsStringHH));

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

        let today = moment().startOf('day'); // Start of today's date (midnight);
        // Calculate the difference in days
        const daysDifference = moment(date.dateByNumber).diff(today, 'days');
        console.log('--------');
        console.log('today:' + today.format(dateFormat));
        console.log('D:' + moment(date.dateByNumber).format(dateFormat));
        console.log('daysDifference:' + daysDifference);
        console.log('--------');
        let isWithing48Hourse = false;
        if (daysDifference <= 2) {
          isWithing48Hourse = true;
        }
        for (const slot of goaSlots) {
          for (const hourState of eligibleTutorsResponse.hourStates) {
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

            let today = moment().startOf('day'); // Start of today's date (midnight);
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
            console.log(`---------------------------------------------------`);
            console.log('Slot Id   - ' + slot.id);
            console.log('HourState - ' + hourState.code);
            console.log('Availabel Tutors Count: ' + availableTutors.length);
            console.log('Availabel Tutors: ' + JSON.stringify(availableTutors));
            // WHERE t1.tsp_id IN (8913, 8914, 8917, 8918, 8932, 8933, 8936, 8937, 8908, 8909, 8905, 8910, 8922, 8921, 8923, 8924, 8925, 8926, 8927, 8928, 8929, 8930, 8931, 8912, 8906, 8907)

            // const bookedTutors = await this.prisma.goaSessionsFuture.findMany({
            //   where: {
            //     date: date.dateByNumber,
            //     goaSlotId: slot.id,
            //     tspId: {
            //       not: null
            //     }
            //   }
            // });

            // const bookedTutors = await this.prisma.goaTslBookedDetails.findMany(
            //   {
            //     where: {
            //       sessionDate: new Date(date.dateByNumber),
            //       goaSlotId: slot.id,
            //       tspId: {
            //         not: null
            //       },
            //       hourSlot: hourState.code,
            //       tutorPhase: tutorTypeCode == 'primary' ? 4 : 5
            //     }
            //   }
            // );

            // console.log('bookedTutors: ' + bookedTutors.length);
            console.log(`---------------------------------------------------`);
            console.log(``);
            // const oh = `${date.datee} ${slot.time_range.oh_time}`;
            // const hh = `${date.datee} ${slot.time_range.hh_time}`;

            // console.log('oh: ' + oh);

            availabilityCount.push({
              slot_id: slot.time_range_id,
              time:
                hourState.code === 'OH'
                  ? convertSLTimeToUKTime(slot.time_range.oh_time) //OH // No need to consider BST or STandard Time here
                  : convertSLTimeToUKTime(slot.time_range.hh_time), //HH // No need to consider BST or STandard Time here
              // available: availableTutors.length - bookedTutors.length
              available: availableTutors.length
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

  async getEligibleTutors(businessLines: string[], effectiveDate) {
    // const movementTypesForFilter = ['sub-department'];
    const selectedTutors = [];

    // if getAvailability - StartDate (effectiveDate)
    const approvedDetails = await this.prisma.tmApprovedStatus.findMany({
      where: {
        employeeStatus: 'Active'
      },
      select: {
        tutorLine: true,
        tutorTspId: true
      }
    });

    /**
      -- If Approved  -> Active
      withdrawal-resignation = Withdrawal of resignation
      community = Community return
      return-from-temp = Tempory unvalible return
      return-from-long = long term unvalible return
      
      -- If Approved -> Incative
      on-notice = On notice
      resign = Resignation
      termination = Termination
      no-show = No show
      long-term = Long term unavailability
      community = Community
      suspension = Suspension
     */

    const activeMoments = [
      'withdrawal-resignation',
      'community',
      'return-from-temp',
      'return-from-long'
    ];

    const inactiveMoments = [
      'on-notice',
      'resign',
      'termination',
      'no-show',
      'long-term',
      'community',
      'suspension'
    ];
    const masterDetails = await this.prisma.tmMasterTb.findMany({
      where: {
        // movementType: {
        //   in: movementTypesForFilter
        // },
        movementType: {
          in: activeMoments // filters for activeMoments
        },
        movementStatus: 'Approved',
        effectiveDate: {
          lte: effectiveDate
        }
      },
      select: {
        tutorLine: true,
        tutorTspId: true,
        effectiveDate: true
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      distinct: ['tutorTspId']
    });

    //Filter the tutors with respective busness line Primary or Secondary
    for (const approved of approvedDetails) {
      // get matched turor from tmMasterTb table data
      const masterDetail = masterDetails.find(
        (md) => md.tutorTspId === approved.tutorTspId
      );

      // if we have maching tmMasterTb data, we take it otherwise we take tmApprovedStatus table data
      const movement = masterDetail ? masterDetail : approved;

      if (businessLines.includes(movement.tutorLine)) {
        selectedTutors.push({
          tspId: movement.tutorTspId,
          businessLine: movement.tutorLine
        });
      }
    }
  }

  async getTheExactSlotDateOfWeek(goaSlotId, weekDate) {
    const responseGoaSlot = await this.prisma.gOASlot.findFirst({
      where: {
        id: goaSlotId
      },
      select: {
        date: {
          select: {
            date: true
          }
        }
      }
    });

    return await getWeekDate(responseGoaSlot.date.date, weekDate);
  }

  async getSlotStatusAccordingToEffectiveDate(
    tutorSlotId,
    goaSlotId,
    date,
    isNewTutor
  ) {
    const responseGoaSlot = await this.prisma.gOASlot.findFirst({
      where: {
        id: goaSlotId
      },
      select: {
        date: {
          select: {
            date: true
          }
        }
      }
    });

    const newDate = await getWeekDate(responseGoaSlot.date.date, date);

    console.log('tutorSlotId:' + tutorSlotId);
    console.log('goaSlotId:' + goaSlotId);
    console.log('Date: ' + moment(date).format('YYYY-MM-DD'));
    console.log('Date New: ' + newDate);

    const sameCount = await this.prisma.gOATutorSlotsDetails.count({
      where: {
        tutor_slot_id: tutorSlotId,
        slot_id: goaSlotId,
        effective_date: new Date(newDate)
      }
    });
    let response: any = null;
    let slotStatusId = null;
    // if (sameCount > 1) {
    //   response = await this.prisma.$queryRawUnsafe(`
    //   SELECT slot_status_id
    //     FROM goa_tutors_slots_details
    //     WHERE tutor_slot_id = ${tutorSlotId}
    //       AND slot_id = ${goaSlotId}
    //       AND effective_date <=${newDate}'
    //     ORDER BY effective_date DESC, id DESC
    //     LIMIT 2;
    // `);
    //   if (isNewTutor) {
    //     //New Tutor
    //     slotStatusId = response[0].slot_status_id;
    //   } else {
    //     //Old Tutor
    //     slotStatusId = response[1].slot_status_id;
    //   }
    // } else {
    //   response = await this.prisma.$queryRawUnsafe(`
    //   SELECT slot_status_id
    //     FROM goa_tutors_slots_details
    //     WHERE tutor_slot_id = ${tutorSlotId}
    //       AND slot_id = ${goaSlotId}
    //       AND effective_date < '${newDate}'
    //     ORDER BY effective_date DESC, id DESC
    //     LIMIT 2;
    // `);
    //   if (isNewTutor) {
    //     //New Tutor
    //     slotStatusId = response[0].slot_status_id;
    //   } else {
    //     //Old Tutor - get befor(P,S) tutor
    //     slotStatusId = response[1].slot_status_id;
    //   }
    // }
    response = await this.prisma.$queryRawUnsafe(`
    SELECT slot_status_id
      FROM goa_tutors_slots_details
      WHERE tutor_slot_id = ${tutorSlotId}
        AND slot_id = ${goaSlotId}
        AND effective_date <= '${newDate}'
      ORDER BY effective_date DESC, id DESC 
      LIMIT 2;
  `);
    if (isNewTutor) {
      //New Tutor
      slotStatusId = response[0].slot_status_id;
    } else {
      //Old Tutor
      slotStatusId = response[1].slot_status_id;
    }
    console.log('slotStatusId:' + JSON.stringify(slotStatusId));
    return slotStatusId;
  }

  // async reservingTutors(data: any) {
  async reservingTutors(distributionRequest: DistributionRequestDto) {
    try {
      return this.prisma.$transaction(
        async (tx) => {
          //Extract the correct UUID (Second UUID)
          const uuid = await this.extractSecondUUID(
            distributionRequest.request_uuid
          );

          // Requesting tutor phase
          const tutorPhase =
            distributionRequest.tutor_phase === 'primary'
              ? 'Primary'
              : distributionRequest.tutor_phase === 'secondary'
              ? 'Secondary'
              : distributionRequest.tutor_phase;

          //Get tutor phase id
          const response1 = await tx.goaMetaData.findFirst({
            where: {
              value: tutorPhase
            },
            select: {
              id: true
            }
          });

          //Save data - table 1
          const createdData1 = await tx.goaTslReservationBooking.create({
            data: {
              tslUuid: uuid,
              startDate: new Date(distributionRequest.start_date), // no need to convert UK to SL, date format is YYYY-MM-DD
              endDate: new Date(distributionRequest.end_date), // no need to convert UK to SL, date format is YYYY-MM-DD
              schoolId: distributionRequest.school_id,
              tutorPhase: response1.id,
              status: 1 // Reserved
            }
          });

          // //Getting First week StartDate(Monday) and EndDate(Friday)
          // const weekStartAndEnd = getWeekStartAndEnd(
          //   distributionRequest.start_date // no need to convert UK to SL, date format is YYYY-MM-DD
          // );

          //startDateSession belong week Monday and Friday
          const { monday, friday } = await this.getWeekMondayAndFriday(
            distributionRequest.start_date
          );

          // console.log('weekStartAndEnd:' + JSON.stringify(weekStartAndEnd));

          const list = [];
          // "groups":[
          //   {
          //      "weekday":1,
          //      "timeslot":"11:30",
          //      "number_of_students":5
          //   },
          //   {
          //      "weekday":2,
          //      "timeslot":"11:30",
          //      "number_of_students":4
          //   },
          // ]
          const otherOperations = distributionRequest.groups.map(
            async (data) => {
              const numberOfStudents = data.number_of_students;
              const slotStringSL = await convertUKTimeToSLTime(data.timeslot);
              // const slotStringSL = moment(slTime, 'HH:mm')
              //   .subtract(1, 'hour')
              //   .format('HH:mm'); // We are Substracting 1h becuase Ex: 13.30 slot in SL time also doing 12.30 Tutors

              // console.log('ukTime:' + JSON.stringify(ukTime));
              console.log('UK:' + data.timeslot + '_SL:' + slotStringSL);

              const hourState = slotStringSL.includes(':00') ? 'HH' : 'OH'; // OH or HH

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

              console.log('gOATimeRangeRes:' + JSON.stringify(gOATimeRangeRes));

              const goaSlotRes = await this.prisma.gOASlot.findFirst({
                where: {
                  date_id: Number(data.weekday),
                  time_range: {
                    id: gOATimeRangeRes.id //timeRangeId
                  }
                },
                select: {
                  id: true
                }
              });

              //Save data - table 2
              const createdData2 =
                await tx.goaTslReservationBookingDetails.create({
                  data: {
                    timeSlotUK: data.timeslot,
                    week: data.weekday,
                    slotId: goaSlotRes.id, // slotId
                    numberOfStudents: data.number_of_students,
                    goaTslReservationBookingId: createdData1.id
                  }
                });

              // const ukTime = `${distributionRequest.start_date} ${data.timeslot}`; //2024-08-11 12:30
              //Convert UK time to SL time
              // const slotStringSL = await this.convertUKTimeToSriLankaTime(
              //   data.timeslot
              // );
              /**
               *  After Converting UK to SL we have to substract 1h
               *  Becuase when we convertim Time, the moment library get defualt date as 2001-01-01 which is standard time
               *  for Ex: 08:00 -> 13:30 we are getting this. but always day start time should be 12.30. so i substract 1h to get 12.30
               */

              // get weekly session count for the tutor

              // const weeklyStartDate = weekStartAndEnd.startOfWeek; // '2024-04-15'; // Start of the date range
              // const weeklyEndDate = weekStartAndEnd.endOfWeek; //'2024-08-15'; // End of the date range
              console.log('Before');
              const tutors: any = await this.tutorDistribution(
                moment(distributionRequest.start_date).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
                moment(distributionRequest.end_date).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
                hourState, // OH or HH
                tutorPhase, //Primary or Secondary
                new Date(monday), //Date should be string and YYYY-MM-DD format
                new Date(friday), //Date should be string and YYYY-MM-DD format
                goaSlotRes.id, //Ex: 1, 2, .. 40 // slotId
                gOATimeRangeRes.id, // timeRangeId
                numberOfStudents, //Ex: 10
                false // not requesting cover tutors
              );
              await Promise.all(tutors);

              // tsl_id: item.tsl_id,
              // tsp_id: item.tsp_id,
              // slot_status_id: item.slot_status_id
              console.log('After');
              console.log('tutorIds:' + JSON.stringify(tutors));
              // console.log('End date friday:' + new Date(friday));
              console.log(
                'End date friday:' +
                  moment(friday).add(1, 'day').format('YYYY-MM-DD')
              );
              const exactStartDate = await this.getTheExactSlotDateOfWeek(
                goaSlotRes.id,
                distributionRequest.start_date
              );
              let tutorData = [];
              //prepare data
              const response = await tutors?.map(async (item: any) => {
                // Getting last status before the change the statuses of the Tutor
                // const lastSlotStatus =
                //   await this.getSlotStatusAccordingToEffectiveDate(
                //     item.tutor_slot_id,
                //     goaSlotRes.id,
                //     exactStartDate,
                //     true //isStatusforGivenDate
                //     // distributionRequest.start_date
                //   );
                // // console.log('End date friday:' + new Date(friday));
                // console.log('tutorPhase:' + tutorPhase);
                // console.log('lastSlotStatus:' + lastSlotStatus);
                console.log('exactStartDate:' + exactStartDate);
                // getSlotStatusAccordingToEffectiveDate(tutorSlotId, goaSlotId, date)
                /**
                 * 8 - On Hold
                 * 6 - Yes
                 * if they not give the PA, or SA. first give the |Availability and then book
                 */

                if ([8, 6].includes(item.slot_status_id)) {
                  await tx.gOATutorSlotsDetails.create({
                    data: {
                      tutor_slot_id: item.tutor_slot_id, // gOATutorsSlots table id
                      slot_id: goaSlotRes.id,
                      // effective_date: new Date(distributionRequest.start_date),
                      effective_date: new Date(exactStartDate),
                      slot_status_id: tutorPhase == 'Primary' ? 1 : 2, // Slot Status Ex:- 1 - PA, 2 - SA
                      hour_status: hourState,
                      created_at: new Date(),
                      created_by: 2 // add the user here
                    }
                  });
                }
                console.log('item.slot_status_id:' + item.slot_status_id);
                await tx.gOATutorSlotsDetails.create({
                  data: {
                    tutor_slot_id: item.tutor_slot_id, // gOATutorsSlots table id
                    slot_id: goaSlotRes.id,
                    // effective_date: new Date(distributionRequest.start_date),
                    // effective_date: new Date(exactStartDate),
                    effective_date: new Date(
                      moment(exactStartDate).add(7, 'day').format('YYYY-MM-DD')
                    ),
                    slot_status_id: tutorPhase == 'Primary' ? 11 : 12, // Slot Status Ex:- 11-  P, 12 - S
                    hour_status: hourState,
                    created_at: new Date(),
                    created_by: 2 // add the user here
                  }
                });

                const exactLastDate = await this.getPreviousDateForDay(
                  exactStartDate,
                  distributionRequest.end_date
                );
                console.log(
                  'distributionRequest.end_date' + distributionRequest.end_date
                );

                // Finally tutor updated with his last status before this reseration/booking happening
                await tx.gOATutorSlotsDetails.create({
                  data: {
                    tutor_slot_id: item.tutor_slot_id, // gOATutorsSlots table id
                    slot_id: goaSlotRes.id,
                    //  End date friday - add 1 date beacuse of the validation
                    // effective_date: new Date(
                    //   moment(friday).add(1, 'day').format('YYYY-MM-DD')
                    // ),
                    effective_date: new Date(
                      moment(exactLastDate).add(1, 'day').format('YYYY-MM-DD')
                    ),
                    // slot_status_id: tutorPhase == 'Primary' ? 1 : 2, // Slot Status Ex:- 1 - PA, 2 - SA
                    // slot_status_id: lastSlotStatus, // Slot Status Ex:-  1 - PA, 2 - SA, 3 - PC, 4 - SC, 6 - Y, 7 - TO, 8 - H
                    slot_status_id: item.slot_status_id,
                    hour_status: hourState,
                    created_at: new Date(),
                    created_by: 2 // add the user here
                  }
                });

                tutorData.push({
                  tslTutorId: item.tsl_id,
                  goaTslReservationBookingDetailsId: createdData2.id,
                  lastSlotStatusId: item.slot_status_id
                });
              });

              /**
               *  Should update GoaTutorSlotDetails table for each tutor - distributionRequest.end_date as the effective date for availability in future.
               *  Otherwise onced tutors are booked still show as avaialabe du to GoaTutorSlotDetails - this should be don when booked confirm from TSL side - When reserving tutors - in this function
               */
              // update GoaTutorSlotDetails table for new tutor - this tutor will be availabe again after this session series end date

              await Promise.all(response);
              console.log('tutorData:' + JSON.stringify(tutorData));
              //Save data - table 3
              if (tutorData) {
                await tx.goaTslBookingTutors.createMany({
                  data: tutorData
                });
              }

              //Data prepare for return
              list.push({
                weekday: data.weekday,
                timeslot: data.timeslot,
                number_of_students: data.number_of_students,
                contract_ids: tutors.map((item) => item.tsl_id) // tutorIds
              });

              console.log('tslIds:' + JSON.stringify(tutors));
            }
          );

          await Promise.all([createdData1, ...otherOperations]);
          // -- end
          console.log('list:' + JSON.stringify(list));
          return {
            status: 201,
            success: true,
            message: 'success',
            data: list
          };
        },
        {
          maxWait: 60000, // 60s // default: 2000
          timeout: 30000 // 30s // default: 5000
        }
      ); // set to 15000 ms (15 seconds));
    } catch (error) {
      console.log('error:' + error.message);
      return {
        status: 500,
        success: false,
        message: error.message,
        error: error.message
      };
    }
  }

  async getPreviousDateForDay(exactStartDate: string, endDate: string) {
    const targetDay = moment(exactStartDate, 'YYYY-MM-DD').format('dddd');
    console.log('targetDay' + targetDay);
    // Parse the input date
    const givenDate = moment(endDate, 'YYYY-MM-DD');
    if (!givenDate.isValid()) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    // Convert targetDay to a valid day index
    const targetDayIndex = moment().day(targetDay).day();
    if (isNaN(targetDayIndex)) {
      throw new Error(
        'Invalid day name. Use full day names like Monday, Tuesday, etc.'
      );
    }

    // Calculate the next occurrence of the target day
    let nextDate = givenDate.clone().add(1, 'day');
    while (nextDate.day() !== targetDayIndex) {
      nextDate.add(1, 'day');
    }

    // Subtract 1 day from the next occurrence
    const finalDate = nextDate.subtract(1, 'day');

    return finalDate.format('YYYY-MM-DD');
  }

  async tutorDistribution(
    startDateString, //Date should be string and YYYY-MM-DD format
    endDateString, //Date should be string and YYYY-MM-DD format
    hourState, // Ex:  OH , HH
    tutorPhase, //Ex:  Primary,  Secondary
    weeklyStartDate, //Date should be string and YYYY-MM-DD format
    weeklyEndDate, //Date should be string and YYYY-MM-DD format
    slotId, // Ex: 1, 2, ... 40
    timeRangeId, // Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
    numberOfStudents, //Ex: 10
    isCoverTutors // true or false
  ) {
    try {
      //get the respective slot(time) id
      const amOrPm = [1, 2, 3, 4].includes(timeRangeId) ? 'AM' : 'PM'; // AM or PM
      // This loop is for prioritise tutors by tutors currunt status ----------
      /**
       * If the session first date less than the 2 days only priority 1 will get
       * otherwise getting all the priorities(1-4)
       */
      let today = moment().startOf('day'); // Start of today's date (midnight);
      const dateNew = moment(startDateString); // Example end date and time
      // Calculate the difference in days
      const daysDifference = dateNew.diff(today, 'days');

      let tutorList = [];
      let count = 0;
      let priority = 1;
      while (count < numberOfStudents) {
        const tutors: any = await this.getAvailability(
          new Date(startDateString),
          new Date(endDateString),
          startDateString,
          endDateString,
          slotId,
          hourState,
          tutorPhase,
          new Date(weeklyStartDate),
          new Date(weeklyEndDate),
          isCoverTutors,
          priority // priority: 1, 2, 3, 4
        );

        if (tutors.length > 0) {
          tutorList = [...tutorList, ...tutors];
        }
        count = count + tutors.length;
        /**
         *  Priority == 4 means end of the loop
         *  daysDifference < 2 if this true, running priority 1 only
         */
        if (priority == 4 || daysDifference < 2) {
          break; // Stop when condition is met
        }
        console.log(`priority - ${priority} | No of Tutors- ${tutors.length}`);
        priority++;
      }
      console.log('All Tutors - ' + tutorList.length);
      console.log('All Tutors - ' + JSON.stringify(tutorList));

      console.log(`
      -------------------------------------------------------------------
      Start Date (Parsed): ${new Date(startDateString) || 'Not Provided'}
      End Date (Parsed):   ${new Date(endDateString) || 'Not Provided'}
      Start Date (Raw):    ${startDateString || 'Not Provided'}
      End Date (Raw):      ${endDateString || 'Not Provided'}
      Slot ID:             ${slotId ?? 'Not Provided'}
      Hour State:          ${hourState || 'Not Provided'}
      Tutor Phase:         ${tutorPhase || 'Not Provided'}
      Weekly Start Date:   ${new Date(weeklyStartDate) || 'Not Provided'}
      Weekly End Date:     ${new Date(weeklyEndDate) || 'Not Provided'}
      Is Cover Tutors:     ${isCoverTutors ?? 'Not Provided'}
      -------------------------------------------------------------------
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
      //-----------------------------
      //3. filter 3(no of students) suitable tutors from above array
      let tutorIds = [];
      if (tutorPhase == 'Secondary') {
        // -------------------- Secondary Logic --------------
        //Get the weekly least session count tutors
        // Filter by tutor_phase "Secondary"
        // const secondaryTutors = tutorList.filter((item) =>
        //   item.tutor_phase.includes('Primary and Secondary')
        // );

        const secondaryTutors = tutorList
          .filter(({ tutor_phase }) =>
            ['Primary and Secondary', 'primary and secondary'].includes(
              tutor_phase
            )
          )
          .sort((a, b) => a.session_count - b.session_count);

        console.log('tutorList - ' + JSON.stringify(tutorList));

        // Sort by session_count in ascending order
        const sortedData = secondaryTutors.sort(
          (a, b) => a.session_count - b.session_count
        );
        // Get the first numberOfStudents tsl_id values
        tutorIds = sortedData.slice(0, numberOfStudents).map((item) => ({
          tsl_id: item.tsl_id,
          tsp_id: item.tsp_id,
          slot_status_id: item.slot_status_id,
          tutor_slot_id: item.tutor_slot_id
        }));
      } else if (tutorPhase == 'Primary') {
        // -------------------- Primary Logic --------------
        if (amOrPm == 'AM') {
          /**
           * ----Logic-----
           * Priority 1: The tutor_phase should be "Secondary".
           * Priority 2: If there aren't enough "Secondary" tutors, fill the remaining slots with "Primary" tutors.
           * Priority 3: Tutors with the least session_count should be selected.
           */

          // Step 1: Filter and sort by tutor_phase and session_count
          // const secondaryTutors = tutorList
          //   .filter((item) =>
          //     item.tutor_phase.includes('Primary and Secondary')
          //   )
          //   .sort((a, b) => a.session_count - b.session_count);

          const secondaryTutors = tutorList
            .filter(({ tutor_phase }) =>
              ['Primary and Secondary', 'primary and secondary'].includes(
                tutor_phase
              )
            )
            .sort((a, b) => a.session_count - b.session_count);

          const primaryTutors = tutorList
            .filter(({ tutor_phase }) =>
              ['Primary', 'primary'].includes(tutor_phase)
            )
            .sort((a, b) => a.session_count - b.session_count);

          // console.log('secondaryTutors:' + JSON.stringify(secondaryTutors));
          // console.log('primaryTutors:' + JSON.stringify(primaryTutors));

          // Step 2: Collect numberOfStudents tutors, prioritizing Secondary phase tutors
          let result = [...secondaryTutors];

          // If there are fewer than numberOfStudents Secondary tutors, fill with Primary tutors
          if (result.length < numberOfStudents) {
            const remainingSlots = numberOfStudents - result.length;
            result = [...result, ...primaryTutors.slice(0, remainingSlots)];
          }

          // Step 3: Extract the tsl_id values of the selected tutors
          tutorIds = result.slice(0, numberOfStudents).map((item) => ({
            tsl_id: item.tsl_id,
            tsp_id: item.tsp_id,
            slot_status_id: item.slot_status_id,
            tutor_slot_id: item.tutor_slot_id
          }));
        } else if (amOrPm == 'PM') {
          /**
           * ----Logic-----
           * Priority 1: The tutor_phase should be "Primary".
           * Priority 2: If there aren't enough "Primary" tutors, fill the remaining slots with "Secondary" tutors.
           * Priority 3: Tutors with the least session_count should be selected.
           */

          // Step 1: Filter and sort by tutor_phase and session_count
          // const primaryTutors = tutorList
          //   .filter((item) => item.tutor_phase === 'Primary')
          //   .sort((a, b) => a.session_count - b.session_count);

          const primaryTutors = tutorList
            .filter(({ tutor_phase }) =>
              ['Primary', 'primary'].includes(tutor_phase)
            )
            .sort((a, b) => a.session_count - b.session_count);

          console.log('primaryTutors:' + JSON.stringify(primaryTutors));

          // const secondaryTutors = tutorList
          //   .filter((item) =>
          //     item.tutor_phase.includes('Primary and Secondary')
          //   )
          //   .sort((a, b) => a.session_count - b.session_count);
          const secondaryTutors = tutorList
            .filter(({ tutor_phase }) =>
              ['Primary and Secondary', 'primary and secondary'].includes(
                tutor_phase
              )
            )
            .sort((a, b) => a.session_count - b.session_count);

          // Step 2: Collect numberOfStudents tutors, prioritizing Primary phase tutors
          let result = [...primaryTutors];

          // If there are fewer than numberOfStudents Primary tutors, fill with Secondary tutors
          if (result.length < numberOfStudents) {
            const remainingSlots = numberOfStudents - result.length;
            result = [...result, ...secondaryTutors.slice(0, remainingSlots)];
          }

          // Step 3: Extract the tsl_id values of the selected tutors
          tutorIds = result.slice(0, numberOfStudents).map((item) => ({
            tsl_id: item.tsl_id,
            tsp_id: item.tsp_id,
            slot_status_id: item.slot_status_id,
            tutor_slot_id: item.tutor_slot_id
          }));
        }
      }
      console.log('tutorIds In Destri :' + JSON.stringify(tutorIds));
      return tutorIds; // tutorIds
    } catch (error) {
      console.log('error:' + error.message);
      return { success: false, error: error.message };
    }
  }

  async getAvailability(
    startDate, // Date
    endDate, // Date
    startDateString, // String
    endDateString, // String
    slotId,
    ohOrHH, // OH or HH
    tutorPhase, //Primary or Secondary
    weeklyStartDate, // Date
    weeklyEndDate, // Date
    isCoverTutors,
    priority
  ) {
    try {
      const eligibleTutorsResponse = await this.getEligibalTutors(
        moment(startDate).format('YYYY-MM-DD'),
        moment(endDate).format('YYYY-MM-DD'),
        tutorPhase // tutorTypeCode
      );

      //filter tutors according to OH, HH
      const hhOhState: any = eligibleTutorsResponse.hourStates.find(
        (state) => state.code === ohOrHH
      );
      //-------
      console.log('hhOhState - ' + JSON.stringify(hhOhState));
      console.log(`eligibleTutors ${ohOrHH}:` + hhOhState.tutors.length);

      const idsString = hhOhState.tutors.join(',');

      //--------------------------------------------------------------------------
      let today = moment().startOf('day'); // Start of today's date (midnight);
      // Calculate the difference in days
      const daysDifference = moment(startDate).diff(today, 'days');

      // Convert array to comma-separated string for SQL IN clause
      /**
       */
      let slotStatusIds = '';
      if (daysDifference <= 2) {
        // For Bookings within 48 hours, the sales team should only be able to see accepted availabilities (PA or SA)
        slotStatusIds = [1, 2].join(',');
      } else {
        slotStatusIds =
          priority == 1
            ? [1, 2].join(',')
            : priority == 2
            ? [8].join(',')
            : priority == 3
            ? [6].join(',')
            : [7].join(',');
      }

      // const slotStatusIds =
      //   priority == 1
      //     ? [1, 2].join(',')
      //     : priority == 2
      //     ? [8].join(',')
      //     : priority == 3
      //     ? [6].join(',')
      //     : [7].join(',');

      console.log('slotStatusIds: ' + slotStatusIds);

      /**
       * Slot Status Id
       * 1 - PA (Primary Accepted (SA))
       * 2 - SA (Secondary Accepted (SA))
       * 3 - PC (Primary Cover)
       * 4 - SC (Secondary Cover)
       * 6 - Y (Yes (Availability given by Candidate))
       * 7 - TO (Time Off)
       * 8 - H (On Hold)
       */
      //  (1, 2, 6, 7, 8)
      const tutors = [];
      let availableTutors1: any = [];
      if (hhOhState.tutors.length > 0) {
        if (!isCoverTutors) {
          console.log('Normal Avialability');
          availableTutors1 = await this.prisma.$queryRawUnsafe(`
          SELECT t1.tsp_id, t2.slot_id, t2.slot_status_id, t1.id, tsl.tsl_id, tm.tutor_line
          FROM main_app_db_sandbox.goa_tutors_slots t1
          INNER JOIN (
              SELECT t2.*
              FROM main_app_db_sandbox.goa_tutors_slots_details t2
              WHERE t2.id IN (
                  SELECT MAX(t3.id)
                  FROM main_app_db_sandbox.goa_tutors_slots_details t3
                  WHERE t3.slot_id = ${slotId}
                  AND effective_date <= '${endDateString}'
                  GROUP BY t3.tutor_slot_id
              )
              AND t2.slot_status_id IN (${slotStatusIds})
              AND t2.effective_date <= '${endDateString}'
          ) t2 ON t1.id = t2.tutor_slot_id
          INNER JOIN main_app_db_sandbox.user u ON t1.tsp_id = u.tsp_id
          INNER JOIN main_app_db_sandbox.tsl_user tsl ON u.tsp_id = tsl.tsp_id
          INNER JOIN main_app_db_sandbox.tm_approved_status tm ON tm.tutor_tsp_id = t1.tsp_id
          WHERE t1.tsp_id IN (${idsString});
          `);
          //  AND effective_date <= '${endDateString}'   - Remove this line to get last state

          console.log('availableTutors1:' + JSON.stringify(availableTutors1));
          // console.log('Selected Tutors :' + availableTutors1.length);

          await Promise.all(
            availableTutors1.map(async (tutor: any) => {
              console.log('endDate :' + endDate);
              console.log('startDate :' + startDate);
              // const reservation = await this.prisma.goaTslBookingTutors.count({
              //   where: {
              //     tslTutorId: tutor.tsl_id, // Filter by the specified tslTutorId
              //     gOATSLReservationBookingDetails: {
              //       slotId: slotId,
              //       GOATSLReservationBooking: {
              //         // startDate: { lte: endDate }, // Reservation starts on or before the given end date
              //         // endDate: { gte: startDate }
              //         AND: [
              //           { startDate: { lte: endDate } }, // Reservation starts on or before the given end date
              //           { endDate: { gte: startDate } } // Reservation ends on or after the given start date
              //         ]
              //       }
              //     }
              //   }
              // });
              // console.log('reservation count: ' + JSON.stringify(reservation));
              // if (reservation == 0) {
              const sessionCount = await this.prisma.goaTslBookedDetails.count({
                where: {
                  tspId: tutor.tsp_id,
                  sessionDate: {
                    gte: weeklyStartDate,
                    lte: weeklyEndDate
                  }
                }
              });

              const tutorPhase = await this.getTutorsReleventBusinessLine(
                [tutor.tsp_id],
                endDate
              );

              const tutorPhaseTutor = tutorPhase.find(
                (i) => i.tspId == tutor.tsp_id
              );
              // console.log('sessionCount:' + JSON.stringify(sessionCount));
              tutors.push({
                tsp_id: tutor.tsp_id,
                tsl_id: tutor.tsl_id,
                slot_id: tutor.slot_id,
                tutor_phase: tutorPhaseTutor.businessLine, //tutor.tutor_line,
                slot_status_id: tutor.slot_status_id,
                tutor_slot_id: tutor.id,
                session_count: sessionCount
              });
              // }
            })
          );
        } else if (isCoverTutors) {
          //Check the query for suitable for get cover tutors -> removed this line ->  AND t2.effective_date <= '${endDateString}'
          // availableTutors1 = await this.prisma.$queryRawUnsafe(`
          // SELECT t1.tsp_id, t2.slot_id, t2.slot_status_id, t1.id, tsl.tsl_id, tm.tutor_line
          // FROM main_app_db_sandbox.goa_tutors_slots t1
          // INNER JOIN (
          //     SELECT t2.*
          //     FROM main_app_db_sandbox.goa_tutors_slots_details t2
          //     WHERE t2.id IN (
          //         SELECT MAX(t3.id)
          //         FROM main_app_db_sandbox.goa_tutors_slots_details t3
          //         WHERE t3.slot_id = ${slotId}
          //         GROUP BY t3.tutor_slot_id
          //     )
          //     AND t2.slot_status_id IN (3, 4)
          // ) t2 ON t1.id = t2.tutor_slot_id
          // INNER JOIN main_app_db_sandbox.user u ON t1.tsp_id = u.tsp_id
          // INNER JOIN main_app_db_sandbox.tsl_user tsl ON u.tsp_id = tsl.tsp_id
          // INNER JOIN main_app_db_sandbox.tm_approved_status tm ON tm.tutor_tsp_id = t1.tsp_id
          // WHERE t1.tsp_id IN (${idsString});
          // `);
          const slotStatusIdsCover = [3, 4].join(',');

          availableTutors1 = await this.prisma.$queryRawUnsafe(`
          SELECT t1.tsp_id, t2.slot_id, t2.slot_status_id, t1.id, tsl.tsl_id, tm.tutor_line
          FROM main_app_db_sandbox.goa_tutors_slots t1
          INNER JOIN (
              SELECT t2.*
              FROM main_app_db_sandbox.goa_tutors_slots_details t2
              WHERE t2.id IN (
                  SELECT MAX(t3.id)
                  FROM main_app_db_sandbox.goa_tutors_slots_details t3
                  WHERE t3.slot_id = ${slotId}
                  AND effective_date <= '${endDateString}'
                  GROUP BY t3.tutor_slot_id
              )
              AND t2.slot_status_id IN (${slotStatusIdsCover})
              AND t2.effective_date <= '${endDateString}'
          ) t2 ON t1.id = t2.tutor_slot_id
          INNER JOIN main_app_db_sandbox.user u ON t1.tsp_id = u.tsp_id
          INNER JOIN main_app_db_sandbox.tsl_user tsl ON u.tsp_id = tsl.tsp_id
          INNER JOIN main_app_db_sandbox.tm_approved_status tm ON tm.tutor_tsp_id = t1.tsp_id
          WHERE t1.tsp_id IN (${idsString});
          `);
          await Promise.all(
            availableTutors1.map(async (tutor: any) => {
              //Also Check GoaTslReservationTable for validate that we are not getting this tutor
              // const reservation = await this.prisma.goaTslBookingTutors.count({
              //   where: {
              //     tslTutorId: tutor.tsl_id, // Filter by the specified tslTutorId
              //     gOATSLReservationBookingDetails: {
              //       slotId: slotId,
              //       GOATSLReservationBooking: {
              //         AND: [
              //           { startDate: { lte: endDate } }, // Reservation starts on or before the given end date
              //           { endDate: { gte: startDate } } // Reservation ends on or after the given start date
              //         ]
              //       }
              //     }
              //   }
              // });
              //get count of checking startDateString and endDateString dates are overlapping with gOASessionSwap startDate and endDate
              // const swap = await this.prisma.gOASessionSwap.count({
              //   where: {
              //     newTutorId: tutor.tsl_id, // tutorId == tsl_id
              //     slotId: slotId,
              //     AND: [
              //       {
              //         startDate: {
              //           lte: endDate // Ends on or after the start of the range
              //         }
              //       },
              //       {
              //         endDate: {
              //           gte: startDate // Starts on or before the end of the range
              //         }
              //       }
              //     ]
              //   }
              // });

              // Record ID	startDate	endDate	Overlaps with 2023-05-01 to 2023-05-10?
              // 1	2023-04-25	2023-05-05	Yes (overlaps from 2023-05-01 to 2023-05-05)
              // 2	2023-05-07	2023-05-15	Yes (overlaps from 2023-05-07 to 2023-05-10)
              // 3	2023-04-20	2023-04-30	No (ends before 2023-05-01)
              // 4	2023-05-12	2023-05-20	No (starts after 2023-05-10)
              // 5	2023-05-01	2023-05-10	Yes (exact match with 2023-05-01 to 2023-05-10)
              // 6	2023-04-28	2023-05-02	Yes (overlaps from 2023-05-01 to 2023-05-02)
              // console.log('swap:' + JSON.stringify(swap));
              // console.log('reservation:' + JSON.stringify(reservation));
              //Not overlapping
              // if (swap == 0 && reservation == 0) {
              const sessionCount = await this.prisma.goaTslBookedDetails.count({
                where: {
                  tspId: tutor.tsp_id,
                  sessionDate: {
                    gte: weeklyStartDate,
                    lte: weeklyEndDate
                  }
                }
              });
              const tutorPhase = await this.getTutorsReleventBusinessLine(
                [tutor.tsp_id],
                endDate
              );

              const tutorPhaseTutor = tutorPhase.find(
                (i) => i.tspId == tutor.tsp_id
              );

              console.log('sessionCount:' + JSON.stringify(sessionCount));
              tutors.push({
                // tsp_id: tutor.tsp_id,
                // tsl_id: tutor.tsl_id,
                // slot_id: tutor.slot_id,
                // tutor_phase: tutor.tutor_line,
                // slot_status_id: tutor.slot_status_id,
                // tutor_slot_id: tutor.id,
                // session_count: sessionCount,
                tsp_id: tutor.tsp_id,
                tsl_id: tutor.tsl_id,
                slot_id: tutor.slot_id,
                tutor_phase: tutorPhaseTutor.businessLine, //tutor.tutor_line,
                slot_status_id: tutor.slot_status_id,
                tutor_slot_id: tutor.id,
                session_count: sessionCount
              });
              // }
            })
          );
        }
      }

      // console.log('availableTutors:' + JSON.stringify(availableTutors));
      // console.log('availableTutors1:' + JSON.stringify(availableTutors1));
      //Get the weekly session count for each tutor and prepare the object

      // console.log(`Available tutors for slot(${slotId}) - ` + tutors.length);
      return tutors;
    } catch (error) {
      console.log('error:' + error.message);
      return { success: false, error: error.message };
    }
  }

  async getTutorsReleventBusinessLine(
    tutorIds: number[],
    // businessLines: string[],
    effectiveDate
  ) {
    const movementTypesForFilter = ['sub-department'];
    const selectedTutors = [];

    const masterDetails = await this.prisma.tmMasterTb.findMany({
      where: {
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          lte: effectiveDate
        }
      },
      select: {
        tutorLine: true,
        tutorTspId: true,
        effectiveDate: true
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      distinct: ['tutorTspId']
    });

    const approvedDetails = await this.prisma.tmApprovedStatus.findMany({
      where: {
        tutorTspId:
          tutorIds.length > 0
            ? {
                in: tutorIds
              }
            : {}
      },
      select: {
        tutorLine: true,
        tutorTspId: true
      }
    });

    if (tutorIds.length > 0) {
      for (const t of tutorIds) {
        let masterMove = undefined;
        // Find tutors movement from the master table
        masterMove = masterDetails.find((m) => m.tutorTspId === t);

        // If no record in master then get from approved details
        if (!masterMove)
          masterMove = approvedDetails.find((a) => a.tutorTspId === t);

        // if (businessLines.includes(masterMove.tutorLine)) {
        selectedTutors.push({
          tspId: t,
          businessLine: masterMove.tutorLine
        });
        // }
      }

      return selectedTutors;
    }

    for (const approved of approvedDetails) {
      const masterDetail = masterDetails.find(
        (md) => md.tutorTspId === approved.tutorTspId
      );

      const movement = masterDetail ? masterDetail : approved;

      // if (businessLines.includes(movement.tutorLine)) {
      selectedTutors.push({
        tspId: movement.tutorTspId,
        businessLine: movement.tutorLine
      });
      // }
    }

    return selectedTutors;
  }

  async convertUKTimeToSriLankaTime(ukTime: string) {
    // Define the UK and Sri Lanka time zones
    const ukTimeZone = 'Europe/London';
    const sriLankaTimeZone = 'Asia/Colombo';
    // Parse the UK time string to a moment object with the correct timezone
    const timeInUK = moment.tz(ukTime, 'HH:mm', ukTimeZone);
    // Convert to Sri Lanka time
    const timeInSriLanka = timeInUK.clone().tz(sriLankaTimeZone);

    //Format the result in 24-hour format
    return timeInSriLanka.format('HH:mm');

    // console.log(
    //   `UK Offset: ${timeInUK.format(
    //     'Z'
    //   )}, Sri Lanka Offset: ${timeInSriLanka.format('Z')}`
    // );
    // const ukTimeInBST = moment.tz(
    //   '2024-08-11 12:30',
    //   'YYYY-MM-DD HH:mm',
    //   ukTimeZone
    // );
    // const ukTimeInGMT = moment.tz(
    //   '2024-01-01 12:30',
    //   'YYYY-MM-DD HH:mm',
    //   ukTimeZone
    // );

    // const slTimeInBST = ukTimeInBST
    //   .clone()
    //   .tz(sriLankaTimeZone)
    //   .format('HH:mm');
    // const slTimeInGMT = ukTimeInGMT
    //   .clone()
    //   .tz(sriLankaTimeZone)
    //   .format('HH:mm');

    // console.log(`BST: UK 12:30 -> SL ${slTimeInBST}`); // Expected: SL 17:00
    // console.log(`GMT: UK 12:30 -> SL ${slTimeInGMT}`); // Expected: SL 18:00
  }

  async extractSecondUUID(arn: string) {
    // Define a regex pattern to match UUIDs
    const uuidPattern =
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

    // Find all UUIDs in the ARN
    const uuids = arn.match(uuidPattern);

    // Return the second UUID if it exists
    return uuids && uuids.length >= 2 ? uuids[1] : null;

    //Ex ARN = arn:aws:states:eu-west-1:267739230747:express:staging-api_block_create:9d7c2117-456f-4ac3-9cf7-66c2133f24d2:040837c9-f01e-45b9-98cb-ee965068a7ef
    //first UUID and likely represents the unique identifier for a specific execution or instance of the Step Function
    //second UUID might be another unique identifier associated with a task or subcomponent within that specific execution
  }

  async selectEligibleTutorsForSessions(movementDetailsForDateRange, tspIds) {
    const movementMap = new Map(
      movementDetailsForDateRange.map((move) => [move.tutorTspId, true])
    );

    const eligibleTutors = tspIds.filter((tspId) => !movementMap.has(tspId));

    return eligibleTutors;
  }

  async removeReservedTutors(uuid: string) {
    try {
      //Find data - table 1
      const response = await this.prisma.goaTslReservationBooking.findFirst({
        where: {
          tslUuid: uuid
        },
        select: {
          startDate: true,
          endDate: true,
          goaTslReservationBookingDetails: {
            select: {
              slotId: true,
              goaTslBookingTutors: {
                select: {
                  tslTutorId: true,
                  lastSlotStatusId: true
                }
              }
            }
          }
        }
      });

      const tutorSlotsDetails = [];
      // Loop Slots
      const response1 = response.goaTslReservationBookingDetails.map(
        async (item) => {
          const slotId = item.slotId;
          // Loop Tutors
          const response2 = item.goaTslBookingTutors.map(async (item2) => {
            console.log('item2:' + JSON.stringify(item2));
            const responseTslUser = await this.prisma.tslUser.findFirst({
              where: {
                tsl_id: item2.tslTutorId
              },
              select: {
                tsp_id: true
              }
            });

            const gOATutorsSlots = await this.prisma.gOATutorsSlots.findFirst({
              where: {
                tsp_id: responseTslUser.tsp_id
              },
              select: {
                id: true
              }
            });

            const goaTslBookedDetails =
              await this.prisma.gOATutorSlotsDetails.findMany({
                where: {
                  tutor_slot_id: gOATutorsSlots.id,
                  slot_id: slotId,
                  effective_date: {
                    lte: response.endDate
                  }
                },
                select: {
                  tutor_slot_id: true,
                  hour_status: true,
                  effective_date: true,
                  slot_status_id: true
                },
                orderBy: {
                  effective_date: 'desc' // Sort by session_date in acending order to get the first
                },
                take: 3
              });

            if ([8, 6].includes(item2.lastSlotStatusId)) {
              tutorSlotsDetails.push({
                tutor_slot_id: goaTslBookedDetails[2].tutor_slot_id, // gOATutorsSlots table id
                slot_id: slotId,
                effective_date: goaTslBookedDetails[2].effective_date,
                slot_status_id: goaTslBookedDetails[2].slot_status_id, // Last Status
                hour_status: goaTslBookedDetails[2].hour_status,
                created_at: new Date(),
                created_by: 2 // add the user here});
              });
            } else {
              tutorSlotsDetails.push({
                tutor_slot_id: goaTslBookedDetails[1].tutor_slot_id, // gOATutorsSlots table id
                slot_id: slotId,
                effective_date: goaTslBookedDetails[1].effective_date,
                slot_status_id: goaTslBookedDetails[1].slot_status_id, // Slot Status Ex:- P, S
                hour_status: goaTslBookedDetails[1].hour_status,
                created_at: new Date(),
                created_by: 2 // add the user here
              });
            }
          });
          await Promise.all(response2);
        }
      );

      await Promise.all(response1);
      console.log('tutorSlotsDetails:' + JSON.stringify(tutorSlotsDetails));
      await this.prisma.gOATutorSlotsDetails.createMany({
        data: tutorSlotsDetails
      });

      await this.prisma.goaTslReservationBooking.updateMany({
        where: {
          tslUuid: uuid
        },
        data: {
          updatedAt: new Date(),
          status: 3 // Cancelled
        }
      });
      return {
        success: true,
        message: `UUID: ${uuid}. Successfully Removed!`,
        status: 200
      };
    } catch (error) {
      console.log('error:' + error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * ------ Session SWAP triggering points ----
   * TMS Status change - Banuka
   *  - Resignation: tutorId, tspId, LastWorkingDate,
   *  - Suspenstion
   *  - on-hold
   *  - Termination:
   * Change Availability
   * Time Off -> Tutor Side, Adhoc, Capacity Admin
   * Manual Session SWAP - FE
   */

  /**
   *  --- Information ----
   * if withing 48H Swap - Temp Swap (1 week)   |  If more than 48h Swap - Permanat Swap (2 week onward)
   * Credit sessions are free session for schools - this also using cover tutors as well
   * */
  /**
     *
     * 1. Get all the session withing next 48h - Temp Swap   |   Get all the sessions now onward - Permanat Swap
     * 2. Swap will happend session by session - not all at once
     *    Temp Swap - Get only cover tutors and find a suited tutor - using Destribution logic - (if not cover tutor send proper error message) 
     *    Permanat Swap  - get all Available tutor and find a suited tutor - using destribution logic
     * 3. update swap data in swap gOASessionSwap Table
            id           Int      @id @default(autoincrement())
            sessionId    String   @map("session_id")
            oldTutorId   Int      @map("old_tutor_id")
            newTutorId   Int      @map("new_tuor_id")  //currentTutor
            swapType     String   @map("swap_type")   -> Temp Swap, Permanat Swap
            reason       String   @map("reason")
            //tempSwap     Boolean  @map("temp_swap")
            createdBy    Int      @map("created_by")  -> Which system swaped - Availability change, TMS status change, Tutor timeoff apply, Session swap manul in TASMS
            createdAt    DateTime @default(now()) @map("created_at")
            updatedAt    DateTime @updatedAt @map("updated_at")
            user         User     @relation(fields: [oldTutorId], references: [tsp_id])
            user         User     @relation(fields: [newTutorId], references: [tsp_id])
      * 4. Update the goaTSLBookingTutors Table
      * 5. If Permanat Swap - Deactiavte tutor - GoaTutorSlots table - Ask Kasun
      *    If Temp Swap  - Do nothing
      * 6. If Permanat Swap - Update -  GoaTutorSlotDetails table
      *    If Temp Swap - Already updated - GoaTutorSlotDetails table for cover the session 
      * 7. Send swaped data to TSL side
     * */
  /**
   * ---Temp Swap ---
   *  Should add cover tutor for that session - Find suited cover tutor using destribution logic
   *
   *
   * ---Permanant Swap ---
   *  Available tutor - Find in destribution logic
   */
  /**
   * --- Actions
   * Send TSL side to which session and tutor swaped
   *
   * */

  // --1-- (UPDATED - PENDING TEST)
  async swapTMS(date, tspId, swapCategory, reason, type) {
    /**
     * Movements - set 1 (Have effective date)
     * - 1 - No Show
     * - 2 - Long term unvalibility
     * - 3 - Community
     * - 4 - Suspension
     * Movements - set 2 (Have LWD (Last Working Day))
     * - 5 - On notice
     * - 6 - Resignation
     * - 7 - Termination
     */
    let success: any = '';
    let message = '';
    let status = 200;
    // TMS
    await this.prisma.$transaction(
      async (tx) => {
        const responseTslUser = await this.prisma.tslUser.findFirst({
          where: {
            tsp_id: tspId
          },
          select: {
            tsl_id: true
          }
        });
        const oldTutorId = responseTslUser.tsl_id;
        let today = moment().startOf('day'); // Start of today's date (midnight);
        const dateNew = moment(date); // Example end date and time

        console.log('old tutorId:' + oldTutorId);
        // Calculate the difference in days
        const daysDifference = dateNew.diff(today, 'days');

        console.log('daysDifference: ' + daysDifference);
        if (daysDifference <= 2) {
          // 2 Days
          // Temp Swap
          today = moment().startOf('day'); // Start of today's date (midnight)
          const twoDaysLater: any = today.add(2, 'days'); // Add 2 days to today's date

          /**
           * if type one of these [5, 6, 7] add 1 day to dateNew
           * if type one of these [1, 2, 3, 4] add nothing and get dateNew
           */
          const startDate: any = [5, 6, 7].includes(type)
            ? dateNew.add(1, 'days')
            : [1, 2, 3, 4].includes(type) && dateNew; // Next day onward should be swapped

          console.log('startDate:' + moment(startDate).format('YYYY-MM-DD'));
          console.log(
            'twoDaysLater:' + moment(twoDaysLater).format('YYYY-MM-DD')
          );

          const updatedSessionsTemp = await this.tempPermFullSwap(
            oldTutorId,
            new Date(startDate),
            new Date(twoDaysLater),
            swapCategory,
            reason,
            true, // isTempSwap
            'TMS', // swapAction
            tx
          ); //tutorId, startDate, endDate, swapCategory, reason
          console.log(
            'updatedSessionsTemp' + JSON.stringify(updatedSessionsTemp)
          );
          if (updatedSessionsTemp.success) {
            const responseTemp = {
              sessions: updatedSessionsTemp.data,
              update_future_sessions: false
            };
            await this.sendSwappedDataToTSL(responseTemp);
          }
          await this.log(
            200,
            updatedSessionsTemp.success,
            updatedSessionsTemp.message
          );
          //
          //Perm Swap -------------
          const startDatePerm = [5, 6, 7].includes(type)
            ? twoDaysLater.add(1, 'days')
            : [1, 2, 3, 4].includes(type) && twoDaysLater; // Next day onward should be swapped

          console.log(
            'startDatePerm:' + moment(startDatePerm).format('YYYY-MM-DD')
          );
          const updatedSessionsPerm = await this.tempPermFullSwap(
            oldTutorId,
            new Date(startDatePerm),
            null,
            swapCategory,
            reason,
            false, // isTempSwap
            'TMS', // swapAction
            tx
          ); //tutorId, startDate, endDate, swapCategory, reason
          console.log(
            'updatedSessionsPerm' + JSON.stringify(updatedSessionsPerm)
          );
          if (updatedSessionsPerm.success) {
            const responsePerm = {
              sessions: updatedSessionsPerm.data,
              update_future_sessions: true
            };
            await this.sendSwappedDataToTSL(responsePerm);
          }
          await this.log(
            200,
            updatedSessionsPerm.success,
            updatedSessionsPerm.message
          );
          success = updatedSessionsPerm.success;
          message = updatedSessionsPerm.message;
          status = 200;
        } else {
          //Permanant Swap
          const startDatePerm: any = [5, 6, 7].includes(type)
            ? dateNew.add(1, 'days')
            : [1, 2, 3, 4].includes(type) && dateNew; // Next day onward should be swapped
          console.log(
            'startDatePerm' + moment(startDatePerm).format('YYYY-MM-DD')
          );
          // updated Sessions With New TutorIds (Swapped Tutors)
          const updatedSessionsPerm = await this.tempPermFullSwap(
            oldTutorId,
            new Date(startDatePerm),
            null,
            swapCategory,
            reason,
            false, // isTempSwap
            'TMS', // swapAction
            tx
          ); // tutorId, startDate, swapCategory, reason
          console.log(
            'updatedSessionsPerm' + JSON.stringify(updatedSessionsPerm)
          );
          if (updatedSessionsPerm.success) {
            const responsePerm = {
              sessions: updatedSessionsPerm.data,
              update_future_sessions: true
            };
            await this.sendSwappedDataToTSL(responsePerm);
          }
          await this.log(
            200,
            updatedSessionsPerm.success,
            updatedSessionsPerm.message
          );
          success = updatedSessionsPerm.success;
          message = updatedSessionsPerm.message;
          status = 200;
        }
      },
      {
        maxWait: 60000, // 60s // default: 2000
        timeout: 30000 // 30s // default: 5000
      }
    );
    return { success: success, message: message, status: status };
  }
  // --2.1-- (UPDATED - PENDING TEST)
  async swapChangeAvailability(
    startDateProp,
    endDateProp,
    tspIdList,
    slotStatus,
    swapCategory,
    reason
  ) {
    let success: any = '';
    let message = '';
    let status = 200;
    await this.prisma.$transaction(
      async (tx) => {
        const gOASlotResponse = await tx.gOASlot.findFirst({
          where: {
            date_id: slotStatus.day,
            time_range_id: slotStatus.slotNumber
          },
          select: {
            id: true
          }
        });

        const goaSlotId = gOASlotResponse.id;

        for (const tspId of tspIdList) {
          //
          const responseTslUser = await this.prisma.tslUser.findFirst({
            where: {
              tsp_id: tspId
            },
            select: {
              tsl_id: true
            }
          });
          const oldTutorId = responseTslUser.tsl_id;

          let today = moment().startOf('day'); // Start of today's date (midnight);
          const startDate: any = moment(startDateProp); // Example end date and time

          // Calculate the difference in days
          const daysDifference = startDate.diff(today, 'days');

          //Temp + Permanant SWAP
          if (daysDifference <= 2) {
            // 2 Days
            // Temp Swap -------------
            today = moment().startOf('day'); // Start of today's date (midnight)
            const twoDaysLater: any = today.add(2, 'days'); // Add 2 days to today's date
            const updatedSessionsTemp = await this.swapWithSlotId(
              oldTutorId,
              new Date(startDate),
              new Date(twoDaysLater),
              swapCategory,
              reason,
              goaSlotId,
              true, // isTempSwap
              tx
            ); //tutorId, startDate, endDate, swapCategory, reason

            console.log(
              'updatedSessionsTemp' + JSON.stringify(updatedSessionsTemp)
            );
            if (updatedSessionsTemp.success) {
              const responseTemp = {
                sessions: updatedSessionsTemp.data,
                update_future_sessions: false
              };
              await this.sendSwappedDataToTSL(responseTemp);
            }
            await this.log(
              200,
              updatedSessionsTemp.success,
              updatedSessionsTemp.message
            );
            // Perm Swap with or without end date -------------
            const startDatePerm = twoDaysLater.add(1, 'days'); // Add 1 days to twoDaysLater date
            const updatedSessionsPerm = await this.swapWithSlotId(
              oldTutorId,
              new Date(startDatePerm),
              endDateProp ? new Date(endDateProp) : null, // With or without end date
              swapCategory,
              reason,
              goaSlotId,
              false, // isTempSwap
              tx
            );

            if (updatedSessionsPerm.success) {
              const responsePerm = {
                sessions: updatedSessionsPerm.data,
                update_future_sessions: endDateProp ? false : true // If date range swap swaped one by one| If not chnage at once
              };
              await this.sendSwappedDataToTSL(responsePerm);
            }

            await this.log(
              200,
              updatedSessionsPerm.success,
              updatedSessionsPerm.message
            );
            success = updatedSessionsPerm.success;
            message = updatedSessionsPerm.message;
            status = 200;
          } else {
            //Only Permanant Swap
            const updatedSessionsPerm = await this.swapWithSlotId(
              oldTutorId,
              new Date(startDate),
              endDateProp ? new Date(endDateProp) : null, // With or without end date
              swapCategory,
              reason,
              goaSlotId,
              false, // isTempSwap
              tx
            ); //tutorId, startDate, endDate, swapCategory, reason
            if (updatedSessionsPerm.success) {
              const responsePerm = {
                sessions: updatedSessionsPerm.data,
                update_future_sessions: endDateProp ? false : true // If date range swap swaped one by one| If not chnage at once
              };
              await this.sendSwappedDataToTSL(responsePerm);
            }
            await this.log(
              200,
              updatedSessionsPerm.success,
              updatedSessionsPerm.message
            );
            success = updatedSessionsPerm.success;
            message = updatedSessionsPerm.message;
            status = 200;
          }
        }
      },
      {
        maxWait: 60000, // 60s // default: 2000
        timeout: 30000 // 30s // default: 5000
      }
    );

    return { success: success, message: message, status: status };
  }
  //2.2 --- (UPDATED - PENDING TEST)
  async swapChangeAvailabilityRequest(
    effectiveDateProp,
    oldTutorId,
    slotArr,
    swapCategory,
    reason
  ) {
    let success: any = '';
    let message = '';
    let status = 200;
    await this.prisma.$transaction(
      async (tx) => {
        let today = moment().startOf('day'); // Start of today's date (midnight);
        const startDate: any = moment(effectiveDateProp); // Example end date and time

        // Calculate the difference in days
        const daysDifference = startDate.diff(today, 'days');

        if (daysDifference <= 2) {
          for (const slot of slotArr) {
            // 2 Days
            // Temp Swap -------------
            today = moment().startOf('day'); // Start of today's date (midnight)
            const twoDaysLater: any = today.add(2, 'days'); // Add 2 days to today's date
            const updatedSessionsTemp = await this.swapWithSlotId(
              oldTutorId,
              new Date(startDate),
              new Date(twoDaysLater),
              swapCategory,
              reason,
              slot.slotId,
              true, // isTempSwap
              tx
            );

            console.log(
              'updatedSessionsTemp' + JSON.stringify(updatedSessionsTemp)
            );
            if (updatedSessionsTemp.success) {
              const responseTemp = {
                sessions: updatedSessionsTemp.data,
                update_future_sessions: false
              };
              await this.sendSwappedDataToTSL(responseTemp);
            }
            await this.log(
              200,
              updatedSessionsTemp.success,
              updatedSessionsTemp.message
            );
            // Perm Swap without end date -------------
            const startDatePerm = twoDaysLater.add(1, 'days'); // Add 1 days to twoDaysLater date
            const updatedSessionsPerm = await this.swapWithSlotId(
              oldTutorId,
              new Date(startDatePerm),
              null, // No EndDate
              swapCategory,
              reason,
              slot.slotId,
              false, // isTempSwap
              tx
            ); //tutorId, startDate, endDate, swapCategory, reason

            console.log(
              'updatedSessionsPerm' + JSON.stringify(updatedSessionsPerm)
            );
            if (updatedSessionsPerm.success) {
              const responsePerm = {
                sessions: updatedSessionsPerm.data,
                update_future_sessions: true
              };
              await this.sendSwappedDataToTSL(responsePerm);
            }
            await this.log(
              200,
              updatedSessionsPerm.success,
              updatedSessionsPerm.message
            );
            success = updatedSessionsPerm.success;
            message = updatedSessionsPerm.message;
            status = 200;
          }
        } else {
          //Permanant Swap
          for (const slot of slotArr) {
            // updated Sessions With New TutorIds (Swapped Tutors)
            const updatedSessionsPerm = await this.swapWithSlotId(
              oldTutorId,
              new Date(startDate),
              null, // No EndDate
              swapCategory,
              reason,
              slot.slotId,
              false, // isTempSwap
              tx
            ); // tutorId, startDate, swapCategory, reason

            if (updatedSessionsPerm.success) {
              const responsePerm = {
                sessions: updatedSessionsPerm.data,
                update_future_sessions: true
              };
              await this.sendSwappedDataToTSL(responsePerm);
            }
            await this.log(
              200,
              updatedSessionsPerm.success,
              updatedSessionsPerm.message
            );
            success = updatedSessionsPerm.success;
            message = updatedSessionsPerm.message;
            status = 200;
          }
        }
      },
      {
        maxWait: 60000, // 60s // default: 2000
        timeout: 30000 // 30s // default: 5000
      }
    );

    return { success: success, message: message, status: status };
  }
  // --3-- (TESTED - Only Subordinate)
  async swapTimeOff(timeOffDateProp, tutorId, slotArr, swapCategory, reason) {
    let success = '';
    let message = '';
    let status = 200;
    await this.prisma.$transaction(
      async (tx) => {
        const { monday, friday } = await this.getWeekMondayAndFriday(
          timeOffDateProp // This is Friday Date
        );
        for (const slot of slotArr) {
          const updatedSessionsTemp: any = await this.tempTimeOffSwapWithSlotId(
            tutorId,
            new Date(monday),
            new Date(friday),
            swapCategory,
            reason,
            slot.slotId,
            'TimeOff',
            tx
          );

          await this.log(
            200,
            updatedSessionsTemp.success,
            updatedSessionsTemp.message
          );

          if (updatedSessionsTemp.success) {
            const responseTemp = {
              sessions: updatedSessionsTemp.data,
              update_future_sessions: false
            };

            await this.sendSwappedDataToTSL(responseTemp);
          }
          success = updatedSessionsTemp.success;
          message = updatedSessionsTemp.message;
          status = 200;
        }
      },
      {
        maxWait: 60000, // 60s // default: 2000
        timeout: 30000 // 30s // default: 5000
      }
    );
    return { success: success, message: message, status: status };
  }
  // --4-- Manual SWAP (TESTED)
  async swapSession(
    startDateProp,
    endDateProp,
    oldTutorId,
    newTutorId,
    slotIdofTheDay,
    swapCategory,
    reason,
    type
  ) {
    /**
     * Type - set 1 (Have effective date)    | 1 - One-Time (one Date)  |    2 - Temporary (Date Range)  |   3 - Permanant
     */
    await this.prisma.$transaction(
      async (tx) => {
        let isSessionsAvailable = true;
        let endDate: any = '';
        const newTutor = await this.getTutorDetailsForSwap(newTutorId);
        const goaSlotId = await this.getGoaSlotId(
          startDateProp,
          slotIdofTheDay
        );
        if (type == 3) {
          const responseGoaTslBookedDetails =
            await tx.goaTslBookedDetails.findMany({
              where: {
                tutorId: oldTutorId,
                goaSlotId: goaSlotId,
                sessionDate: { gte: new Date(startDateProp) } //get all the future sessions
              },
              select: {
                sessionDate: true
              },
              orderBy: {
                sessionDate: 'desc' // Sort by session_date in acending order to get the first
              }
            });
          if (responseGoaTslBookedDetails.length > 0) {
            endDate = responseGoaTslBookedDetails?.[0]?.sessionDate;
          } else {
            isSessionsAvailable = false; // No session available to swap
          }
        } else if (type == 2) {
          endDate = endDateProp;
        } else {
          endDate = moment(startDateProp).add(6, 'day').format('YYYY-MM-DD'); //type 1
        }

        // const endDate =
        //   type == 1
        //     ? moment(startDateProp).add(6, 'day').format('YYYY-MM-DD')
        //     : endDateProp; //sessionDate
        console.log('endDate:' + JSON.stringify(endDate));
        //Get last goaSlot before the swap

        if (isSessionsAvailable) {
          const lastSlotStatus =
            await this.getSlotStatusAccordingToEffectiveDate(
              newTutor.tutor_slot_id,
              goaSlotId,
              startDateProp,
              true
            );
          console.log('lastSlotStatus:' + lastSlotStatus);
          /**
           * 1 - PA | 2 - SA | 3 - PC | 4 - SC | 6 - Y | 7 - TO | 8 - H
           */
          if ([1, 2, 3, 4, 6, 7, 8].includes(lastSlotStatus)) {
            if ([1, 2].includes(type)) {
              // 2 - // Temporary Swap have date range. we have to do it one by one so we use Temp swap for that
              // const endDate = type == 1 ? startDateProp : endDateProp; //sessionDate

              const updatedSessionsTemp =
                await this.tempSwapWithSlotIdWithoutDistributionLogic(
                  oldTutorId,
                  newTutorId,
                  new Date(startDateProp), //sessionDate
                  new Date(endDate),
                  swapCategory,
                  reason,
                  goaSlotId,
                  tx
                );
              if (updatedSessionsTemp.success) {
                const responseTemp = {
                  sessions: updatedSessionsTemp.data,
                  update_future_sessions: false
                };
                await this.sendSwappedDataToTSL(responseTemp);

                await this.log(
                  200,
                  updatedSessionsTemp.success,
                  updatedSessionsTemp.message
                );
                return {
                  success: updatedSessionsTemp.success,
                  message: updatedSessionsTemp.message,
                  status: 200
                };
              }
            } else if (type == 3) {
              const updatedSessionsPerm: any =
                await this.permSwapWithSlotIdWithoutDistributionLogic(
                  oldTutorId,
                  newTutorId,
                  new Date(startDateProp), //sessionDate
                  swapCategory,
                  reason,
                  goaSlotId,
                  tx
                );

              if (updatedSessionsPerm.success) {
                const responsePerm = {
                  sessions: updatedSessionsPerm.data,
                  update_future_sessions: true
                };
                await this.sendSwappedDataToTSL(responsePerm);
                await this.log(
                  200,
                  updatedSessionsPerm.success,
                  updatedSessionsPerm.message
                );
                return {
                  success: updatedSessionsPerm.success,
                  message: updatedSessionsPerm.message,
                  status: 200
                };
              }
            }
          } else {
            console.log('message: Tutor Not Eligibal');
            return {
              success: false,
              message: 'Tutor Not Eligibal',
              status: 200
            };
          }
        } else {
          console.log('message: No Sessions for SWAP');
          return {
            success: false,
            message: 'No Sessions for SWAP',
            status: 200
          };
        }
      },
      {
        maxWait: 60000, // 60s // default: 2000
        timeout: 30000 // 30s // default: 5000
      }
    );
    return { success: true, message: 'Ok', status: 200 };
  }

  // Swap Session Find a Tutor
  async swapSessionFindTutor(
    startDateProp, // dateString
    endDateProp, // dateString or null
    oldTutorId,
    slotIdofTheDay,
    type
  ) {
    try {
      /**
       * Type - set 1 (Have effective date)
       * - 1 - One-Time (one Date)
       * - 2 - Temporary (Date Range)
       * - 3 - Permanant
       */
      // Get the day number (Monday as 1 to Friday as 5)
      // const dayNumber = moment(startDateProp).isoWeekday();

      // const gOASlot = await this.prisma.gOASlot.findFirst({
      //   where: {
      //     time_range_id: slotIdofTheDay,
      //     date_id: dayNumber
      //   },
      //   select: {
      //     id: true
      //   }
      // });
      const slotId = await this.getGoaSlotId(startDateProp, slotIdofTheDay);
      let today = moment().startOf('day'); // Start of today's date (midnight);
      const dateNew = moment(startDateProp); // Example end date and time
      // Calculate the difference in days
      const daysDifference = dateNew.diff(today, 'days');

      const isCoverTutor = daysDifference < 2 ? true : false;
      let isSessionsAvailable = true;
      // 1 - One-Time (one Date)
      let endDate: any = '';
      if (type == 3) {
        const goaTslBookedDetails =
          await this.prisma.goaTslBookedDetails.findMany({
            where: {
              tutorId: oldTutorId,
              goaSlotId: slotId,
              sessionDate: { gte: new Date(startDateProp) } //get all the future sessions
            },
            select: {
              sessionDate: true
            },
            orderBy: {
              sessionDate: 'desc' // Sort by session_date in acending order to get the first
            }
          });
        if (goaTslBookedDetails.length > 0) {
          endDate = goaTslBookedDetails?.[0]?.sessionDate;
        } else {
          isSessionsAvailable = false; // No session available to swap
        }
      } else if (type == 2) {
        endDate = endDateProp;
      } else {
        endDate = moment(startDateProp).add(6, 'day').format('YYYY-MM-DD'); //type 1
      }

      console.log('endDate:' + JSON.stringify(endDate));

      if (isSessionsAvailable) {
        const responseTslUser = await this.prisma.tslUser.findFirst({
          where: {
            tsl_id: oldTutorId
          },
          select: {
            tsp_id: true
          }
        });

        const hourState = await this.userService.getTutorHourStatus(
          new Date(endDate),
          responseTslUser.tsp_id
        );
        console.log('hourState:' + JSON.stringify(hourState));

        const { monday, friday } = await this.getWeekMondayAndFriday(
          new Date(startDateProp)
        );

        const goaSlot = await this.prisma.gOASlot.findFirst({
          where: {
            id: slotId
          },
          select: {
            time_range_id: true
          }
        });

        const tutorLine =
          await this.userService.getTutorsReleventBusinessLineV3(
            new Date(endDate),
            responseTslUser.tsp_id
          );

        console.log('tutorLine:' + JSON.stringify(tutorLine));

        //find a tutor in destribution logic according to startDateSession and  endDateSession
        const tutors: any = await this.tutorDistribution(
          moment(startDateProp).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
          moment(endDate).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
          hourState.hourState, // Ex:  OH , HH
          tutorLine[0]?.businessLine, //Ex:  Primary,  Secondary
          monday, //weeklyStartDate - Date should be string and YYYY-MM-DD format
          friday, //weeklyEndDate - Date should be string and YYYY-MM-DD format
          slotId, // slotId
          goaSlot.time_range_id, //Ex: 1, 2, 3, 4, 5, 6, 7, 8 //timeRangeId
          1, //numberOfStudents
          isCoverTutor // requesting cover tutors (true, false)
        );

        if (tutors.length > 0) {
          const tutor = tutors[0];
          const responseTslUser2 = await this.prisma.tslUser.findFirst({
            where: {
              tsl_id: tutor.tsl_id
            },
            select: {
              tsl_full_name: true
            }
          });
          return {
            success: true,
            message: 'Ok',
            status: 200,
            data: {
              tutorId: tutor.tsl_id,
              tutorName: responseTslUser2.tsl_full_name
            }
          };
        } else {
          console.log('No Any Tutors');
          return {
            success: false,
            message: 'No Any Tutors Found',
            status: 200
          };
        }
      } else {
        console.log('message: No Sessions for SWAP');
        return {
          success: false,
          message: 'No Sessions for SWAP',
          status: 200
        };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  async getGoaSlotId(date, slotIdofTheDay) {
    const dayNumber = moment(date).isoWeekday();

    const gOASlot = await this.prisma.gOASlot.findFirst({
      where: {
        time_range_id: slotIdofTheDay,
        date_id: dayNumber
      },
      select: {
        id: true
      }
    });
    return gOASlot.id;
  }

  async getTspId(tutorId) {
    const tslUser = await this.prisma.tslUser.findFirst({
      where: {
        tsl_id: tutorId
      },
      select: {
        tsp_id: true
      }
    });

    return tslUser.tsp_id;
  }

  async sendSwappedDataToTSL(swappedData) {
    //{
    //    "sessions":[
    //     {
    //        "session_id":123,
    //        "tutor_id":1,
    //        "tutor_name":"John D",
    //        "contract_id":2,
    //        "tutor_swap_reason":"Some reason",
    //        "tutor_swap_category":"Some category"
    //     }
    //  ],
    //  "update_future_sessions":true
    // }

    console.log('swappedData:' + JSON.stringify(swappedData));
    //Call TSL SessionSwap End point here and pass updated swapped data to TSL side
    axios
      .put(process.env.NX_TSL_URL + '/v1/api/tutor_swap', swappedData, {
        // headers: {
        //   Authorization: 'Bearer ' + process.env.NX_API_GATEWAY_TOKEN
        // }
        headers: {
          Cookie: `${
            process.env.NX_ENVIRONMENT == 'production'
              ? '_tsg_platform'
              : '_tsg_platform_staging'
          }=${process.env.NX_API_GATEWAY_TOKEN}` // Pass the token as a cookie
        }
      })
      .then((response) => {
        console.log('SWAP Response: ' + JSON.stringify(response.data));
        return true;
      })
      .catch((err) => {
        console.log(err.response?.data?.message || 'An error occurred');
        return err.response?.data?.message || 'An error occurred'; // Handle error
      })
      .finally(() => {
        // setLoading(false); // Always set loading to false after request completion
      });
    return false;
  }

  async log(status, success, message) {
    console.log(`
      ----------------------------------------
      [LOG - ${new Date().toISOString()}]
      Status: ${status}  | Success: ${success} | Message: ${message}
      ----------------------------------------
      `);
  }

  async isTheSameWeek(friday, response) {
    function getWeekStart(date: Date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay()); // Adjust to start from Sunday (use `getDay() === 0` for Monday start)
      return d;
    }

    const maxSessionDate = response.reduce((max, item) => {
      return new Date(item.sessionDate) > new Date(max)
        ? item.sessionDate
        : max;
    }, new Date(0));

    const givenDate = new Date(friday); // Replace with your actual date

    const maxWeekStart = getWeekStart(new Date(maxSessionDate));
    const givenWeekStart = getWeekStart(givenDate);

    const isInSameWeek = maxWeekStart.getTime() === givenWeekStart.getTime();

    console.log('Do both dates belong to the same week?', isInSameWeek);

    return isInSameWeek;
  }

  async newTutorUpdate(
    newTutorId,
    startDate,
    endDate,
    goaSlotId,
    tutorPhase,
    hourState,
    tx
  ) {
    console.log(`
    --------------------------------------NEW TUTOR UPDATE------------------------------------------------------------------
    [LOG - ${new Date().toISOString()}]
    newTutorId: ${newTutorId}  | goaSlotId: ${goaSlotId}  | startDate: ${moment(
      startDate
    ).format('YYYY-MM-DD')} | endDate: ${moment(endDate).format(
      'YYYY-MM-DD'
    )}  | hourState:   ${hourState} 
    tutorPhase: ${tutorPhase}
    -------------------------------------------------------------------------------------------------------------------------
      `);
    /**
     * tutorPhase
     * 4 - Primary
     * 5 - Secondary
     */
    const newTutor = await this.getTutorDetailsForSwap(newTutorId);
    const lastSlotStatusNewTutor =
      await this.getSlotStatusAccordingToEffectiveDate(
        newTutor.tutor_slot_id,
        goaSlotId,
        startDate,
        true //isNewTutor
      );
    console.log(`
      lastSlotStatusNewTutor: ${lastSlotStatusNewTutor}`);
    // if H or Y then add record for Aceepted(PA,SA)
    if ([8, 6].includes(lastSlotStatusNewTutor)) {
      await tx.gOATutorSlotsDetails.create({
        data: {
          tutor_slot_id: newTutor.tutor_slot_id, // gOATutorsSlots table id
          slot_id: goaSlotId,
          effective_date: new Date(startDate),
          slot_status_id: tutorPhase == 4 ? 1 : 2, // Slot Status Ex:- PA, SA
          hour_status: hourState,
          created_at: new Date(),
          created_by: 2 // add the user here
        }
      });
    }

    const exactLastDateNewTutor = await this.getPreviousDateForDay(
      startDate,
      endDate
    );
    console.log(`
    exactLastDateNewTutor: ${exactLastDateNewTutor}`);
    // -------------- Changed data update in TSG side tables ------------------------------------------------------------------
    // update GoaTutorSlotDetails table for new tutor - this tutor will be availabe again after this session series end date
    await tx.gOATutorSlotsDetails.createMany({
      data: [
        {
          tutor_slot_id: newTutor.tutor_slot_id, // gOATutorsSlots table id
          slot_id: goaSlotId,
          effective_date: new Date(startDate),
          slot_status_id: tutorPhase == 4 ? 11 : 12, // Slot Status Ex:- P, S
          hour_status: hourState,
          created_at: new Date(),
          created_by: 2 // add the user here
        },
        {
          tutor_slot_id: newTutor.tutor_slot_id, // gOATutorsSlots table id
          slot_id: goaSlotId,
          effective_date: new Date(
            moment(exactLastDateNewTutor).add(1, 'day').format('YYYY-MM-DD')
          ),
          slot_status_id: lastSlotStatusNewTutor, // New Tutor
          hour_status: hourState,
          created_at: new Date(),
          created_by: 2 // add the user here
        }
      ]
    });
    console.log(`
    -------------------------------------------------------------------------------------------------------------------------`);
    return {
      exactLastDateNewTutor: exactLastDateNewTutor,
      tsl_full_name: newTutor.tsl_full_name
    };
  }

  async oldTutorUpdate(
    oldTutorId,
    goaSlotId,
    startDate,
    endDateProp,
    hourState,
    tutorPhase,
    exactLastDateNewTutor,
    swapAction,
    tx
  ) {
    console.log(`
    ----------------------------------OLD TUTOR UPDATE-----------------------------------------------------------------------
    [LOG - ${new Date().toISOString()}]
    oldTutorId: ${oldTutorId}  | goaSlotId: ${goaSlotId}  | startDate: ${moment(
      startDate
    ).format('YYYY-MM-DD')} | endDateProp: ${moment(endDateProp).format(
      'YYYY-MM-DD'
    )}  | hourState:   ${hourState} 
    tutorPhase: ${tutorPhase}
    exactLastDateNewTutor: ${exactLastDateNewTutor}
    swapAction: ${swapAction}
    -------------------------------------------------------------------------------------------------------------------------
      `);
    const oldTutor = await this.getTutorDetailsForSwap(oldTutorId);
    const lastSlotStatusOldTutor =
      await this.getSlotStatusAccordingToEffectiveDate(
        oldTutor.tutor_slot_id,
        goaSlotId,
        startDate,
        false //isNewTutor
      );
    console.log(`
    lastSlotStatusOldTutor: ${lastSlotStatusOldTutor}`);

    const slot_status_id =
      swapAction == 'TimeOff'
        ? 7
        : swapAction == 'TMS'
        ? 5
        : lastSlotStatusOldTutor;

    // Releasing Old tutor during swap time
    const list = [
      {
        tutor_slot_id: oldTutor.tutor_slot_id, // gOATutorsSlots table id
        slot_id: goaSlotId,
        effective_date: new Date(startDate),
        slot_status_id: slot_status_id, // Slot Status Ex:- PA, SA
        hour_status: hourState,
        created_at: new Date(),
        created_by: 2 // add the user here
      }
    ];

    // if have not have a enddate the it will be Permanant SWAP
    if (endDateProp) {
      // checking next week for, are there any session
      const futureSessions = await tx.goaTslBookedDetails.findMany({
        where: {
          tutorId: oldTutorId,
          goaSlotId: goaSlotId,
          sessionDate: {
            gte: new Date(endDateProp)
          }
        },
        select: {
          sessionDate: true
        },
        orderBy: {
          sessionDate: 'desc'
        }
      });
      console.log(`
      sessionCount next week: ${futureSessions.length}`);

      if (futureSessions.length > 0) {
        // Book old tutor after swapped time, if there are more sessions after that
        list.push({
          tutor_slot_id: oldTutor.tutor_slot_id,
          slot_id: goaSlotId,
          effective_date: new Date(
            moment(exactLastDateNewTutor).add(1, 'day').format('YYYY-MM-DD')
          ),
          slot_status_id: tutorPhase == 4 ? 11 : 12, // Slot Status Ex:- P, S
          hour_status: hourState,
          created_at: new Date(),
          created_by: 2 // add the user here
        });
        console.log(`
        futureSessions[0].sessionDate: ${futureSessions[0].sessionDate}`);
        //After last booked session tutor moved in to Available stage
        list.push({
          tutor_slot_id: oldTutor.tutor_slot_id,
          slot_id: goaSlotId,
          effective_date: new Date(
            moment(futureSessions[0].sessionDate)
              .add(7, 'day')
              .format('YYYY-MM-DD')
          ),
          slot_status_id: lastSlotStatusOldTutor, // Slot Status Ex:- PA, SA
          hour_status: hourState,
          created_at: new Date(),
          created_by: 2 // add the user here
        });
      }
    }

    // Update Old Tutoe timeline
    await tx.gOATutorSlotsDetails.createMany({
      data: list
    });
    console.log(`
    -------------------------------------------------------------------------------------------------------------------------`);
  }

  // ---------------------------------------------------

  // -------- TEMP | PERM ----- WITH DISTRIBUTION & WITHOUT SLOT ID -------------------
  async tempPermFullSwap(
    oldTutorId,
    startDateProp, // Type - Date
    endDateProp, // Type - Date
    swapCategory,
    reason,
    isTempSwap,
    swapAction,
    tx
  ) {
    console.log(`
      ------------------------------------------------------------------------------------------------------------------------
      [LOG - ${new Date().toISOString()}]
      oldTutorId: ${oldTutorId}  | startDateProp: ${moment(
      startDateProp
    ).format('YYYY-MM-DD')} | endDateProp: ${moment(endDateProp).format(
      'YYYY-MM-DD'
    )}  
      swapCategory: ${swapCategory}
      reason: ${reason}
      -------------------------------------------------------------------------------------------------------------------------
        `);
    let where: any = {
      tutorId: oldTutorId,
      sessionDate: { gte: startDateProp } //get all the future sessions
    };

    if (endDateProp) {
      where = {
        tutorId: oldTutorId,
        sessionDate: {
          gte: startDateProp,
          lte: endDateProp
        } //get data withing a range
      };
    }

    // get all the booked sessions for the Tutor in between startDate and endDate,  ...
    // add GoaTslBookedDetails insted of capautSessionsToday here
    const response = await tx.goaTslBookedDetails.findMany({
      where: where,
      select: {
        tspId: true,
        tutorId: true, //Tsl_id
        sessionId: true,
        tutorPhase: true,
        sessionDate: true,
        studentId: true,
        goaSlotId: true,
        hourSlot: true
      },
      orderBy: {
        sessionDate: 'asc' // Sort by session_date in acending order to get the first
      },
      distinct: ['goaSlotId'] // Ensure only the latest session per student_id is returned
    });

    console.log(
      `Sessions Tutor: ${oldTutorId}:` +
        JSON.stringify(response, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
    );
    console.log(`Sessions Count: ` + response.length);
    let success = false;
    let message = '';
    const sessions = [];
    if (response.length > 0) {
      for (const item of response) {
        let where2: any = {
          tutorId: oldTutorId,
          goaSlotId: item.goaSlotId,
          sessionDate: { gte: startDateProp } //get all the future sessions
        };

        if (endDateProp) {
          where2 = {
            tutorId: oldTutorId,
            goaSlotId: item.goaSlotId,
            sessionDate: {
              gte: startDateProp,
              lte: endDateProp
            } //get data withing a range
          };
        }
        //session endDate should find from each session series last record
        const response2 = await tx.goaTslBookedDetails.findMany({
          where: where2,
          select: {
            sessionDate: true,
            sessionId: true
          },
          orderBy: {
            sessionDate: 'desc' // Sort by session_date in acending order to get the first
          }
        });
        const sessionId = item.sessionId;
        const goaSlotId = item.goaSlotId;
        const startDate = item.sessionDate;
        const endDate = isTempSwap
          ? moment(startDate).add(6, 'day').format('YYYY-MM-DD')
          : moment(response2[0].sessionDate).add(6, 'day').format('YYYY-MM-DD');
        const hourState = item.hourSlot;
        const tutorPhase = item.tutorPhase;
        const tutorPhaseString = item.tutorPhase == 4 ? 'Primary' : 'Secondary';

        //startDateSession belong week Monday and Friday
        const { monday, friday } = await this.getWeekMondayAndFriday(startDate);

        const goaSlot = await tx.gOASlot.findFirst({
          where: {
            id: goaSlotId
          },
          select: {
            time_range_id: true
          }
        });

        console.log('startDate:' + startDate);

        //find a tutor in destribution logic according to startDateSession and  endDateSession
        const tutors: any = await this.tutorDistribution(
          moment(startDate).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
          moment(endDate).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
          hourState, // Ex:  OH , HH
          tutorPhaseString, //Ex:  Primary,  Secondary
          monday, //weeklyStartDate - Date should be string and YYYY-MM-DD format
          friday, //weeklyEndDate - Date should be string and YYYY-MM-DD format
          goaSlotId, // slotId
          goaSlot.time_range_id, //Ex: 1, 2, 3, 4, 5, 6, 7, 8 //timeRangeId
          1, //numberOfStudents
          isTempSwap // requesting cover tutors
        );

        if (tutors.length > 0) {
          // New Tutor Update----------------------------
          const newTutorUpdateResponse = await this.newTutorUpdate(
            tutors[0].tsl_id, // newTutorId
            startDate,
            endDate,
            goaSlotId,
            tutorPhase,
            hourState,
            tx
          );

          // Old Tutor Update------------------------------
          await this.oldTutorUpdate(
            oldTutorId,
            goaSlotId,
            startDate,
            endDate,
            hourState,
            tutorPhase,
            newTutorUpdateResponse.exactLastDateNewTutor,
            swapAction,
            tx
          );

          //Prepare data for Swap tables
          const data = [
            {
              sessionDate: item.sessionDate,
              sessionId: sessionId
            }
          ];

          //update our database table (gOASessionSwap)
          await tx.gOASessionSwap.create({
            data: {
              slotId: goaSlotId, // slotId
              startDate: startDate,
              endDate: new Date(endDate), // for permanat swap there are no any end date.
              oldTutorId: oldTutorId, // Old TutorId / TslId
              newTutorId: tutors[0].tsl_id, // Newly found tutorId / TslId
              swapType: isTempSwap ? 'Temp' : 'Perm', //Permanant
              swapCategory: swapCategory,
              reason: reason,
              createdBy: 2, // add the user here
              createdAt: new Date(),
              gOASessionSwapDetails: {
                createMany: { data: data }
              }
            }
          });

          const newTutorTspId = await this.getTspId(tutors[0].tsl_id);
          // Update booked data table with new tutorId
          await tx.goaTslBookedDetails.update({
            where: {
              sessionId: sessionId
            },
            data: {
              tutorId: tutors[0].tsl_id,
              tspId: newTutorTspId
            }
          });

          //Prepare data for TSL
          // If we have a end date then it will be range swap - should swap one by one
          if (endDateProp) {
            response2.map((j) => {
              sessions.push({
                session_id: j.sessionId,
                tutor_id: tutors[0].tsl_id,
                tutor_name: newTutorUpdateResponse.tsl_full_name,
                contract_id: tutors[0].tsl_id,
                tutor_swap_reason: reason, //'Some reason',
                tutor_swap_category: swapCategory //'Some category'
              });
            });
          } else {
            // If we don't have a end date then it will be permanat swap - only first session should send- future sessions will swap automaticaly
            // Assign that tutor to the sessions
            sessions.push({
              session_id: sessionId, // Only First session will be send to TSL, future session will swaped automatically
              tutor_id: tutors[0].tsl_id,
              tutor_name: newTutorUpdateResponse.tsl_full_name,
              contract_id: tutors[0].tsl_id,
              tutor_swap_reason: reason, //'Some reason',
              tutor_swap_category: swapCategory //'Some category'
            });
          }

          // Send Slack Message
          await this.slackService.sendTutorSwapNotificationSlack({
            timeRangeId: goaSlot.time_range_id,
            hourState: hourState,
            sessionDate: moment(startDate).format('YYYY-MM-DD'),
            tutorId: tutors[0].tsl_id // New Tutor
          });

          // Send Perm email
          if (!isTempSwap) {
            await this.sendEmailForPermanant({
              timeRangeId: goaSlot.time_range_id,
              hourState: hourState,
              sessionDate: moment(startDate).format('YYYY-MM-DD'),
              tutorId: tutors[0].tsl_id, // New Tutor
              tutorPhase: tutorPhaseString
            });
          }
          message = 'Swaped Success';
          success = true;
        } else {
          message = `Not Enough ${hourState} - ${tutorPhaseString}(${tutorPhase}) ${
            isTempSwap ? 'Cover' : 'Normal'
          } Tutors for Swap`;
          success = false;
        }
      }
    } else {
      success = false;
      message =
        'No Any Tempory Sessions to SWAP (No any sessions withing next 48h)';
    }

    return { success: success, message: message, data: sessions };
  }

  // -------- TEMP | PERM ----- WITH DISTRIBUTION & SLOT ID -------------------
  async swapWithSlotId(
    oldTutorId,
    startDateProp, // Type: Date
    endDateProp, // Type: Date
    swapCategory,
    reason,
    slotId,
    isTempSwap,
    tx
  ) {
    console.log(`
  ------------------------------------------------------------------------------------------------------------------------
  [LOG - ${new Date().toISOString()}]
  oldTutorId: ${oldTutorId}  | startDateProp: ${moment(startDateProp).format(
      'YYYY-MM-DD'
    )} | endDateProp: ${moment(endDateProp).format(
      'YYYY-MM-DD'
    )}  | slotId:   ${slotId} 
  swapCategory: ${swapCategory}
  reason: ${reason}
  -------------------------------------------------------------------------------------------------------------------------
    `);

    let where: any = {
      tutorId: oldTutorId,
      goaSlotId: slotId,
      sessionDate: { gte: startDateProp } //get all the future sessions
    };

    if (endDateProp) {
      where = {
        tutorId: oldTutorId,
        goaSlotId: slotId,
        sessionDate: {
          gte: startDateProp,
          lte: endDateProp
        } //get data withing a range
      };
    }

    // get all the booked sessions for the Tutor in between startDate and endDate,  ...
    const response = await tx.goaTslBookedDetails.findMany({
      where: where,
      select: {
        id: true,
        tspId: true,
        tutorId: true, //Tsl_id
        sessionId: true,
        tutorPhase: true,
        sessionDate: true,
        studentId: true,
        goaSlotId: true,
        hourSlot: true
      },
      orderBy: {
        sessionDate: 'asc' // Sort by session_date in acending order to get the first
      }
    });
    // console.log('response' + JSON.stringify(response));
    let success = false;
    let message = '';
    const sessions = [];
    if (response.length > 0) {
      console.log('IN');
      const sessionId = response[0].sessionId;
      const goaSlotId = slotId;
      const startDate = response[0].sessionDate;
      const endDate = isTempSwap
        ? endDateProp
        : response[response.length - 1].sessionDate;
      const hourState = response[0].hourSlot;
      const tutorPhase = response[0].tutorPhase;
      const tutorPhaseString =
        response[0].tutorPhase == 4 ? 'Primary' : 'Secondary';

      //startDateSession belong week Monday and Friday
      const { monday, friday } = await this.getWeekMondayAndFriday(startDate);

      const goaSlot = await tx.gOASlot.findFirst({
        where: {
          id: goaSlotId
        },
        select: {
          time_range_id: true
        }
      });

      //find a tutor in destribution logic according to startDateSession and  endDateSession
      const tutors: any = await this.tutorDistribution(
        moment(startDate).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
        moment(endDate).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
        hourState, // Ex:  OH , HH
        tutorPhaseString, //Ex:  Primary,  Secondary
        monday, //weeklyStartDate - Date should be string and YYYY-MM-DD format
        friday, //weeklyEndDate - Date should be string and YYYY-MM-DD format
        goaSlotId, // slotId
        Number(goaSlot.time_range_id), //Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
        1, //numberOfStudents
        isTempSwap // requesting cover tutors (Only PC or SC)
      );

      if (tutors.length > 0) {
        // New Tutor Update----------------------------
        const newTutorUpdateResponse = await this.newTutorUpdate(
          tutors[0].tsl_id, // newTutorId
          startDate,
          endDate,
          goaSlotId,
          tutorPhase,
          hourState,
          tx
        );

        // Old Tutor Update------------------------------
        await this.oldTutorUpdate(
          oldTutorId,
          goaSlotId,
          startDate,
          endDate,
          hourState,
          tutorPhase,
          newTutorUpdateResponse.exactLastDateNewTutor,
          '', // swapAction
          tx
        );

        //Prepare data for Swap tables
        const data = response.map((i) => ({
          sessionDate: i.sessionDate,
          sessionId: i.sessionId
        }));

        //update our database table (gOASessionSwap)
        await tx.gOASessionSwap.create({
          data: {
            slotId: goaSlotId, // slotId
            startDate: startDate,
            endDate: endDateProp, // for permanat swap there are no any end date.
            oldTutorId: oldTutorId, // Old TutorId / TslId
            newTutorId: tutors[0].tsl_id, // Newly found tutorId / TslId
            swapType: isTempSwap ? 'Temp' : 'Perm', //Permanant
            swapCategory: swapCategory,
            reason: reason,
            createdBy: 2, // add the user here
            createdAt: new Date(),
            gOASessionSwapDetails: {
              createMany: { data: data }
            }
          }
        });

        const newTutorTspId = await this.getTspId(tutors[0].tsl_id);
        const bookedIds = response.map((booking) => booking.id);
        // Update booked data table with new tutorId
        await tx.goaTslBookedDetails.updateMany({
          where: {
            id: {
              in: bookedIds
            }
          },
          data: {
            tutorId: tutors[0].tsl_id,
            tspId: newTutorTspId
          }
        });

        //Prepare data for TSL
        // If we have a end date then it will be range swap - should swap one by one
        if (endDateProp) {
          response.map((j) => {
            sessions.push({
              session_id: j.sessionId,
              tutor_id: tutors[0].tsl_id,
              tutor_name: newTutorUpdateResponse.tsl_full_name,
              contract_id: tutors[0].tsl_id,
              tutor_swap_reason: reason, //'Some reason',
              tutor_swap_category: swapCategory //'Some category'
            });
          });
        } else {
          // If we don't have a end date then it will be permanat swap - only first session should send- future sessions will swap automaticaly
          // Assign that tutor to the sessions
          sessions.push({
            session_id: sessionId, // Only First session will be send to TSL, future session will swaped automatically
            tutor_id: tutors[0].tsl_id,
            tutor_name: newTutorUpdateResponse.tsl_full_name,
            contract_id: tutors[0].tsl_id,
            tutor_swap_reason: reason, //'Some reason',
            tutor_swap_category: swapCategory //'Some category'
          });
        }

        //-----------------------------------------------------------------
        // Send Slack Message
        await this.slackService.sendTutorSwapNotificationSlack({
          timeRangeId: goaSlot.time_range_id,
          hourState: hourState,
          sessionDate: moment(startDate).format('YYYY-MM-DD'),
          tutorId: tutors[0].tsl_id // NewTutorId
        });
        // Send Perm email
        if (!isTempSwap) {
          await this.sendEmailForPermanant({
            timeRangeId: goaSlot.time_range_id,
            hourState: hourState,
            sessionDate: moment(startDate).format('YYYY-MM-DD'),
            tutorId: tutors[0].tsl_id, // New Tutor
            tutorPhase: tutorPhaseString
          });
        }
        message = 'Swaped Success';
        success = true;
      } else {
        message = `Not Enough ${hourState} - ${tutorPhaseString}(${tutorPhase}) ${
          isTempSwap ? 'Cover' : 'Normal'
        } Tutors for Swap`;
        success = false;
      }
    } else {
      success = false;
      message =
        'No Any Tempory Sessions to SWAP (No any sessions withing next 48h)';
    }
    return { success: success, message: message, data: sessions };
  }

  // -------- TEMP ----- WITH DISTRIBUTION -------------------
  async tempTimeOffSwapWithSlotId(
    oldTutorId,
    startDateProp, // Type: Date
    endDateProp, // Type: Date (Friday)
    swapCategory,
    reason,
    slotId,
    swapAction,
    tx
  ) {
    console.log(`
  ------------------------------------------------------------------------------------------------------------------------
  [LOG - ${new Date().toISOString()}]
  oldTutorId: ${oldTutorId}  | startDateProp: ${moment(startDateProp).format(
      'YYYY-MM-DD'
    )} | endDateProp: ${moment(endDateProp).format(
      'YYYY-MM-DD'
    )}  | slotId:   ${slotId} 
  swapCategory: ${swapCategory}
  reason: ${reason}
  -------------------------------------------------------------------------------------------------------------------------
    `);
    // get all the booked sessions for the Tutor in between startDate and endDate,  ...
    const response = await tx.goaTslBookedDetails.findMany({
      where: {
        tutorId: oldTutorId,
        goaSlotId: slotId,
        sessionDate: { gte: startDateProp, lte: endDateProp } //get all the future sessions
      },
      select: {
        tspId: true,
        tutorId: true, //Tsl_id
        sessionId: true,
        tutorPhase: true,
        sessionDate: true,
        studentId: true,
        goaSlotId: true,
        hourSlot: true
      },
      orderBy: {
        sessionDate: 'asc' // Sort by session_date in acending order to get the first
      }
    });
    // console.log('response' + JSON.stringify(response));
    let success = false;
    let message = '';
    const sessions = [];
    const oldTutor = await this.getTutorDetailsForSwap(oldTutorId);
    if (response.length > 0) {
      console.log('IN');
      // const goaSlotId = response[0].goaSlotId;
      const goaSlotId = slotId;
      const startDate = response[0].sessionDate;
      // const endDate = response[response.length - 1].sessionDate;
      // const endDate = endDateProp;
      const hourState = response[0].hourSlot;
      const tutorPhase = response[0].tutorPhase;
      const tutorPhaseString =
        response[0].tutorPhase == 4 ? 'Primary' : 'Secondary';
      const friday = endDateProp;

      //startDateSession belong week Monday and Friday
      const { monday } = await this.getWeekMondayAndFriday(startDate);

      const goaSlot = await tx.gOASlot.findFirst({
        where: {
          id: goaSlotId
        },
        select: {
          time_range_id: true
        }
      });

      //find a tutor in destribution logic according to startDateSession and  endDateSession
      const tutors: any = await this.tutorDistribution(
        moment(startDate).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
        moment(endDateProp).format('YYYY-MM-DD'), //Date should be string and YYYY-MM-DD format
        hourState, // Ex:  OH , HH
        tutorPhaseString, //Ex:  Primary,  Secondary
        monday, //weeklyStartDate - Date should be string and YYYY-MM-DD format
        friday, //weeklyEndDate - Date should be string and YYYY-MM-DD format
        goaSlotId, // slotId
        Number(goaSlot.time_range_id), //Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
        1, //numberOfStudents
        true // requesting cover tutors (Only PC or SC)
      );

      if (tutors.length > 0) {
        // console.log(`tspId:${tspId}`);

        // New Tutor Update----------------------------
        const newTutorUpdateResponse = await this.newTutorUpdate(
          tutors[0].tsl_id, //newTutorId
          startDate,
          endDateProp,
          goaSlotId,
          tutorPhase,
          hourState,
          tx
        );

        // Have to remove last two records which is subordinate swap added after 'oldTutorUpdate' function add new records
        await this.deleteLastTwoRecords(
          oldTutor.tutor_slot_id, // gOATutorsSlots table id
          goaSlotId
        );
        // Old Tutor Update------------------------------
        await this.oldTutorUpdate(
          oldTutorId,
          goaSlotId,
          startDate,
          endDateProp,
          hourState,
          tutorPhase,
          newTutorUpdateResponse.exactLastDateNewTutor,
          swapAction, // swapAction
          tx
        );

        //Prepare data
        const data = response.map((i) => ({
          sessionDate: i.sessionDate,
          sessionId: i.sessionId
        }));

        //update our database table (gOASessionSwap)
        await tx.gOASessionSwap.create({
          data: {
            slotId: goaSlotId, // slotId
            startDate: startDate,
            endDate: endDateProp, // for permanat swap there are no any end date.
            oldTutorId: oldTutorId, // Old TutorId / TslId
            newTutorId: tutors[0].tsl_id, // Newly found tutorId / TslId
            swapType: 'Temp', //Permanant
            swapCategory: swapCategory,
            reason: reason,
            createdBy: 2, // add the user here
            createdAt: new Date(),
            gOASessionSwapDetails: {
              createMany: { data: data }
            }
          }
        });

        const newTutorTspId = await this.getTspId(tutors[0].tsl_id);
        // Update booked data table with new tutorId
        await tx.goaTslBookedDetails.updateMany({
          where: {
            studentId: response[0].studentId,
            goaSlotId: goaSlotId,
            sessionDate: { gte: startDate, lte: endDateProp }
          },
          data: {
            tutorId: tutors[0].tsl_id,
            tspId: newTutorTspId
          }
        });
        //Assign that tutor to the sessions
        //Prepare data for TSL
        response.map((j) => {
          sessions.push({
            session_id: j.sessionId,
            tutor_id: tutors[0].tsl_id,
            tutor_name: newTutorUpdateResponse.tsl_full_name,
            contract_id: tutors[0].tsl_id,
            tutor_swap_reason: reason, //'Some reason',
            tutor_swap_category: swapCategory //'Some category'
          });
        });
        // Send Slack Message
        await this.slackService.sendTutorSwapNotificationSlack({
          timeRangeId: goaSlot.time_range_id,
          hourState: hourState,
          sessionDate: moment(startDate).format('YYYY-MM-DD'),
          tutorId: oldTutorId
        });
        message = 'Swaped Success';
        success = true;
      } else {
        await this.deleteLastTwoRecords(
          oldTutor.tutor_slot_id, // gOATutorsSlots table id
          goaSlotId
        );
        message = `Not Enough ${hourState} - ${tutorPhaseString}(${tutorPhase}) Cover Tutors for swap`;
        success = false;
      }
    } else {
      success = false;
      message = 'No Any Sessions to SWAP';
    }
    return { success: success, message: message, data: sessions };
  }

  async deleteLastTwoRecords(tutor_slot_id, slot_id) {
    try {
      // Step 1: Retrieve the last two records ordered by `id` in descending order
      const lastTwoRecords = await this.prisma.gOATutorSlotsDetails.findMany({
        where: {
          tutor_slot_id: tutor_slot_id,
          slot_id: slot_id
        },
        orderBy: {
          id: 'desc'
        },
        take: 2 // Take the last two records
      });

      // Step 2: Delete the last two records based on the retrieved ids
      if (lastTwoRecords.length === 2) {
        await this.prisma.gOATutorSlotsDetails.deleteMany({
          where: {
            id: {
              in: lastTwoRecords.map((record) => record.id) // Get the ids of the last two records
            }
          }
        });

        console.log('Last two records deleted successfully.');
      } else {
        console.log('Less than two records found, nothing to delete.');
      }
    } catch (error) {
      console.error('Error deleting records:', error);
    }
  }

  // With NewTutor -------- TEMP ----- WITHOUT DISTRIBUTION -------------------
  async tempSwapWithSlotIdWithoutDistributionLogic(
    oldTutorId,
    newTutorId,
    startDateProp, // Type: Date
    endDateProp, // Type: Date
    swapCategory,
    reason,
    slotId,
    tx
  ) {
    console.log(`
    ------------------------------------------------------------------------------------------------------------------------
    [LOG - ${new Date().toISOString()}]
    oldTutorId: ${oldTutorId}  | newTutorId: ${newTutorId}  | startDateProp: ${moment(
      startDateProp
    ).format('YYYY-MM-DD')} | endDateProp: ${moment(endDateProp).format(
      'YYYY-MM-DD'
    )}  | slotId:   ${slotId} 
    swapCategory: ${swapCategory}
    reason: ${reason}
    -------------------------------------------------------------------------------------------------------------------------
      `);
    // get all the booked sessions for the Tutor in between startDate and endDate,  ...
    const response = await tx.goaTslBookedDetails.findMany({
      where: {
        tutorId: oldTutorId,
        goaSlotId: slotId,
        sessionDate: { gte: startDateProp, lte: endDateProp } //get all the future sessions
      },
      select: {
        tspId: true,
        tutorId: true, //Tsl_id
        sessionId: true,
        tutorPhase: true,
        sessionDate: true,
        studentId: true,
        goaSlotId: true,
        hourSlot: true
      },
      orderBy: {
        sessionDate: 'asc' // Sort by session_date in acending order to get the first
      }
    });
    console.log('response.length:' + response.length);
    let success = false;
    let message = '';
    const sessions = [];
    if (response.length > 0) {
      const goaSlotId = response[0].goaSlotId;
      const startDate = response[0].sessionDate;
      // const endDate = response[response.length - 1].sessionDate;
      const endDate = endDateProp;
      const hourState = response[0].hourSlot;
      const tutorPhase = response[0].tutorPhase;

      // New Tutor Update----------------------------
      const newTutorUpdateResponse = await this.newTutorUpdate(
        newTutorId,
        startDate,
        endDate,
        goaSlotId,
        tutorPhase,
        hourState,
        tx
      );

      // Old Tutor Update------------------------------
      await this.oldTutorUpdate(
        oldTutorId,
        goaSlotId,
        startDate,
        endDateProp,
        hourState,
        tutorPhase,
        newTutorUpdateResponse.exactLastDateNewTutor,
        '', //swapAction
        tx
      );

      //Prepare data
      const data = response.map((i) => ({
        sessionDate: i.sessionDate,
        sessionId: i.sessionId
      }));

      //update our database table (gOASessionSwap)
      await tx.gOASessionSwap.create({
        data: {
          slotId: goaSlotId, // slotId
          startDate: startDate,
          endDate: endDate, // for permanat swap there are no any end date.
          oldTutorId: oldTutorId, // Old TutorId / TslId
          newTutorId: newTutorId, // Newly found tutorId / TslId
          swapType: 'Temp', //Permanant
          swapCategory: swapCategory,
          reason: reason,
          createdBy: 2, // add the user here
          createdAt: new Date(),
          gOASessionSwapDetails: {
            createMany: { data: data }
          }
        }
      });

      const newTutorTspId = await this.getTspId(newTutorId);
      // Update booked data table with new tutorId
      await tx.goaTslBookedDetails.updateMany({
        where: {
          studentId: response[0].studentId,
          goaSlotId: goaSlotId,
          sessionDate: { gte: startDate, lte: endDate }
        },
        data: {
          tutorId: newTutorId,
          tspId: newTutorTspId
        }
      });

      //Assign that tutor to the sessions
      //Prepare data for TSL
      response.map((j) => {
        sessions.push({
          session_id: j.sessionId,
          tutor_id: newTutorId,
          tutor_name: newTutorUpdateResponse.tsl_full_name,
          contract_id: newTutorId,
          tutor_swap_reason: reason, //'Some reason',
          tutor_swap_category: swapCategory //'Some category'
        });
      });
      // Send Slack Message
      const goaSlot = await tx.gOASlot.findFirst({
        where: {
          id: goaSlotId
        },
        select: {
          time_range_id: true
        }
      });
      await this.slackService.sendTutorSwapNotificationSlack({
        timeRangeId: goaSlot.time_range_id,
        hourState: hourState,
        sessionDate: moment(startDate).format('YYYY-MM-DD'),
        tutorId: newTutorId
      });

      message = 'Swaped Success';
      success = true;
    } else {
      success = false;
      message = 'No Any Sessions to SWAP (No any sessions withing next 48h)';
    }
    return { success: success, message: message, data: sessions };
  }

  // With NewTutor -------- PERM ----- WITHOUT DISTRIBUTION -------------------
  async permSwapWithSlotIdWithoutDistributionLogic(
    oldTutorId,
    newTutorId,
    startDateProp, // Type -  Date
    swapCategory,
    reason,
    slotId,
    tx
  ) {
    console.log(`
    ------------------------------------------------------------------------------------------------------------------------
    [LOG - ${new Date().toISOString()}]
    oldTutorId: ${oldTutorId}  | newTutorId: ${newTutorId}  | startDateProp: ${moment(
      startDateProp
    ).format('YYYY-MM-DD')} | slotId:   ${slotId} 
    swapCategory: ${swapCategory}
    reason: ${reason}
    -------------------------------------------------------------------------------------------------------------------------
      `);
    // get all the booked sessions for the Tutor in between startDate and endDate,  ...
    const response = await tx.goaTslBookedDetails.findMany({
      where: {
        tutorId: oldTutorId,
        goaSlotId: slotId,
        sessionDate: { gte: startDateProp } //get all the future sessions
      },
      select: {
        tspId: true,
        tutorId: true, //Tsl_id
        sessionId: true,
        tutorPhase: true,
        sessionDate: true,
        studentId: true,
        goaSlotId: true,
        hourSlot: true
      },
      orderBy: {
        sessionDate: 'asc' // Sort by session_date in acending order to get the first
      }
    });

    let success = false;
    let message = '';
    const sessions = [];
    if (response.length > 0) {
      const sessionId = response[0].sessionId;
      const goaSlotId = slotId;
      const startDate = response[0].sessionDate;
      const endDate = response[response.length - 1].sessionDate;
      const hourState = response[0].hourSlot;
      const tutorPhase = response[0].tutorPhase;
      const tutorPhaseString =
        response[0].tutorPhase == 4 ? 'Primary' : 'Secondary';

      console.log('tutorPhase:' + tutorPhase);

      // New Tutor Update----------------------------
      const newTutorUpdateResponse = await this.newTutorUpdate(
        newTutorId,
        startDate,
        endDate,
        goaSlotId,
        tutorPhase,
        hourState,
        tx
      );

      // Old Tutor Update----------------------------
      await this.oldTutorUpdate(
        oldTutorId,
        goaSlotId,
        startDate,
        null, // endDateProp
        hourState,
        tutorPhase,
        newTutorUpdateResponse.exactLastDateNewTutor,
        '', //swapAction
        tx
      );

      const data = response.map((i) => ({
        sessionDate: i.sessionDate,
        sessionId: i.sessionId
      }));

      //update our database table (gOASessionSwap)
      await tx.gOASessionSwap.create({
        data: {
          slotId: goaSlotId, // slotId
          startDate: startDate,
          endDate: endDate, // for permanat swap there are no any end date.
          oldTutorId: oldTutorId, // Old TutorId / TslId
          newTutorId: newTutorId, // Newly found tutorId / TslId
          swapType: 'Perm', //Permanant
          swapCategory: swapCategory,
          reason: reason,
          createdBy: 2, // add the user here
          createdAt: new Date(),
          gOASessionSwapDetails: {
            createMany: { data: data }
          }
        }
      });

      const newTutorTspId = await this.getTspId(newTutorId);
      // Update booked data table with new tutorId
      await tx.goaTslBookedDetails.updateMany({
        where: {
          studentId: response[0].studentId,
          goaSlotId: slotId,
          sessionDate: { gte: startDateProp } //get all the future sessions
        },
        data: {
          tutorId: newTutorId,
          tspId: newTutorTspId
        }
      });
      //Assign that tutor to the sessions
      sessions.push({
        session_id: sessionId,
        tutor_id: newTutorId,
        tutor_name: newTutorUpdateResponse.tsl_full_name,
        contract_id: newTutorId,
        tutor_swap_reason: reason, //'Some reason',
        tutor_swap_category: swapCategory //'Some category'
      });
      // Send Slack Message
      const goaSlot = await tx.gOASlot.findFirst({
        where: {
          id: goaSlotId
        },
        select: {
          time_range_id: true
        }
      });
      await this.slackService.sendTutorSwapNotificationSlack({
        timeRangeId: goaSlot.time_range_id,
        hourState: hourState,
        sessionDate: moment(startDate).format('YYYY-MM-DD'),
        tutorId: newTutorId
      });
      // Send Perm email

      await this.sendEmailForPermanant({
        timeRangeId: goaSlot.time_range_id,
        hourState: hourState,
        sessionDate: moment(startDate).format('YYYY-MM-DD'),
        tutorId: newTutorId, // New Tutor
        tutorPhase: tutorPhaseString
      });

      message = 'Swaped Success';
      success = true;
    } else {
      message = 'No Any Permanat Sessions to SWAP';
      success = false;
    }

    return { success: success, message: message, data: sessions };
  }

  async sendEmailForPermanant(data) {
    // timeRangeId: goaSlot.time_range_id,
    // hourState: hourState,
    // sessionDate: moment(startDate).format('YYYY-MM-DD'),
    // tutorId: tutors[0].tsl_id // New Tutor
    //tutorPhase
    const gOATimeRange = await this.prisma.gOATimeRange.findFirst({
      where: {
        id: data.timeRangeId
      },
      select: {
        hh_time: true,
        oh_time: true
      }
    });
    const time =
      data.hourState == 'OH' ? gOATimeRange.oh_time : gOATimeRange.hh_time;
    const tslUser = await this.prisma.tslUser.findFirst({
      where: {
        tsl_id: data.tutorId
      },
      select: {
        tsp_id: true
      }
    });
    const tspId = tslUser.tsp_id;

    const responseUserTutor = await this.prisma.user.findFirst({
      where: {
        tsp_id: tspId
      },
      select: {
        approved_contact_data: {
          select: {
            workEmail: true
          }
        },
        tm_approved_status: {
          select: {
            supervisorTspId: true
          }
        },
        approved_personal_data: {
          select: {
            firstName: true,
            surname: true
          }
        }
      }
    });

    const supervisorTspId =
      responseUserTutor.tm_approved_status.supervisorTspId;

    const responseUserSupervisor =
      await this.prisma.nonTutorDirectory.findFirst({
        where: {
          hr_tsp_id: supervisorTspId
        },
        select: {
          tsg_email: true,
          short_name: true
        }
      });
    const day = moment(data.sessionDate, 'YYYY-MM-DD').format('dddd');
    // Get User Details by Email Address - Tutor
    const emailTutor =
      process.env.NX_ENVIRONMENT == 'production'
        ? responseUserTutor.approved_contact_data?.workEmail
        : 'nishad.nazrul@thirdspaceglobal.com'; // responseUserTutor.approved_contact_data?.workEmail
    // Get User Details by Email Address - Supervisor
    const emailSupervisor =
      process.env.NX_ENVIRONMENT == 'production'
        ? responseUserSupervisor?.tsg_email
        : 'inusha@thirdspaceglobal.com'; //responseUserSupervisor?.tsg_email;

    await this.emailService.PermanentSwapNotificationEmailService({
      email: emailTutor, //email: string
      firstName: responseUserTutor.approved_personal_data.firstName, // firstName: string;
      tutorManagerEmail: emailSupervisor, //tutorManagerEmail: string;
      tutorId: data.tutorId, //tutorId: number;
      sessionType: data.tutorPhase, //sessionType: string;
      date: data.sessionDate, //date: string;
      sessionSlot: day + ' ' + time //sessionSlot: string;
    });
  }

  async getTutorDetailsForSwap(tutorId) {
    const tslUser = await this.prisma.tslUser.findFirst({
      where: {
        tsl_id: tutorId
      },
      select: {
        tsp_id: true,
        tsl_full_name: true,
        tsl_first_name: true
      }
    });

    console.log('tslUser:' + JSON.stringify(tslUser));

    const gOATutorsSlots = await this.prisma.gOATutorsSlots.findFirst({
      where: { tsp_id: tslUser.tsp_id },
      select: {
        id: true
      }
    });

    return {
      tutor_slot_id: gOATutorsSlots.id,
      tsl_full_name: tslUser.tsl_full_name,
      tsl_first_name: tslUser.tsl_first_name
    };
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

  async bookedDetails(bookedDetails: any) {
    //BookedDetails
    try {
      console.log('bookedDetails' + JSON.stringify(bookedDetails));
      //Extract the correct UUID (Second UUID)
      const uuid = await this.extractSecondUUID(bookedDetails.reservation_uuid);

      const resTutorPhase =
        await this.prisma.goaTslReservationBooking.findFirst({
          where: {
            tslUuid: uuid
          },
          select: {
            tutorPhase: true
          }
        });
      console.log('resTutorPhase' + JSON.stringify(resTutorPhase));
      const transformedSessions = [];
      const res = bookedDetails.sessions.map(async (session) => {
        const responseTslUser = await this.prisma.tslUser.findFirst({
          where: {
            tsl_id: session.tutor_id
          },
          select: {
            tsp_id: true
          }
        });

        const slTime = convertUKDateTimeToSLTime(session.session_planned_at);
        console.log('slTime:' + slTime);
        const hourState = slTime.includes(':00') ? 'HH' : 'OH'; // OH or HH
        console.log('hourState:' + hourState);

        const weekDay = moment(session.date).format('dddd'); // 'dddd' format returns the full name of the day
        const goaSlot = await this.prisma.gOASlot.findFirst({
          where: {
            date: {
              date: weekDay // Monday, Tusday, ...
            },
            time_range: {
              OR: [{ hh_time: slTime }, { oh_time: slTime }]
            }
          },
          select: {
            id: true
          }
        });

        console.log('session:' + JSON.stringify(session));

        console.log('timeRange:' + JSON.stringify(goaSlot));
        transformedSessions.push({
          sessionId: session.id, // Session Id
          tslUuid: uuid,
          tutorId: session.tutor_id,
          tspId: responseTslUser.tsp_id,
          studentId: session.student_id,
          studentName: session.student_name,
          schoolId: session.school_id,
          tutorPhase: resTutorPhase.tutorPhase,
          sessionDate: new Date(session.date), // Session Date
          hourSlot: hourState, // HH or OH
          goaSlotId: goaSlot.id, // 1,2,.. 40 //slotId
          status: 6, // Booked
          sessionPlannedAt: session.session_planned_at,
          sessionEndAt: session.session_to_end_at,
          createdAt: new Date()
        });
      });
      await Promise.all(res);

      // Sort ASC
      transformedSessions.sort(
        (a, b) =>
          moment(a.sessionDate).valueOf() - moment(b.sessionDate).valueOf()
      );
      console.log('transformedSessions:' + JSON.stringify(transformedSessions));
      await this.prisma.goaTslBookedDetails.createMany({
        data: transformedSessions
      });

      // Update the reservation table as Booked
      await this.prisma.goaTslReservationBooking.updateMany({
        where: {
          tslUuid: uuid
        },
        data: {
          status: 2 // Booked
        }
      });

      return { success: true, status: 200 };
    } catch (error) {
      console.error('error:', error);
      console.log('error:' + JSON.stringify(error));
      return new Error(error);
    }
  }

  async daylightSavingTesingFunction(data: any) {
    const obj = {
      // slDate1: await convertUKDateTimeToSLTimeSchoolStartTime(data.ukDate1),
      // slDate2: await convertUKDateTimeToSLTimeSchoolStartTime(data.ukDate2),
      // sltime1: await this.convertUKTimeToSriLankaTime(data.uktime1),
      slDate1: await convertUKDateTimeToSLTime(data.ukDate1),
      slDate2: await convertUKDateTimeToSLTime(data.ukDate2),
      ukDate1: await convertSLDateTimeToUKTime(data.slDate1),
      ukDate2: await convertSLDateTimeToUKTime(data.slDate2)
    };

    return obj;
  }

  async launchedDetails(launchedDetails: LaunchedDetails) {
    try {
      const goaTslBookedDetails =
        await this.prisma.goaTslBookedDetails.findFirst({
          where: {
            sessionId: launchedDetails.session_id
          },
          select: {
            tutorPhase: true
          }
        });

      const responseTslUser = await this.prisma.tslUser.findFirst({
        where: {
          tsl_id: launchedDetails.tutor_id
        },
        select: {
          tsp_id: true
        }
      });

      const slTime = convertUKDateTimeToSLTime(
        launchedDetails.session_planned_at
      );
      console.log('slTime:' + slTime);
      const hourState = slTime.includes(':00') ? 'OH' : 'HH'; // OH or HH
      console.log('hourState:' + hourState);

      const weekDay = moment(launchedDetails.session_planned_at).format('dddd'); // 'dddd' format returns the full name of the day
      const goaSlot = await this.prisma.gOASlot.findFirst({
        where: {
          date: {
            date: weekDay // Monday, Tusday, ...
          },
          time_range: {
            OR: [{ hh_time: slTime }, { oh_time: slTime }]
          }
        },
        select: {
          id: true
        }
      });

      console.log('timeRange:' + JSON.stringify(goaSlot));

      await this.prisma.goaTslLaunchedDetails.create({
        data: {
          sessionId: launchedDetails.session_id, // Session Id
          tutorId: launchedDetails.tutor_id,
          tspId: responseTslUser.tsp_id,
          studentId: launchedDetails.student_id,
          schoolId: launchedDetails.school_id,
          tutorPhase: goaTslBookedDetails?.tutorPhase,
          sessionDate: new Date(launchedDetails.session_planned_at), // Session Date
          hourSlot: hourState, // HH or OH
          goaSlotId: goaSlot.id, // 1,2,.. 40 //slotId
          sessionPlannedAt: launchedDetails.session_planned_at,
          sessionEndAt: launchedDetails.session_to_end_at,
          createdAt: new Date()
        }
      });

      return { success: true, status: 200 };
    } catch (error) {
      console.error('error:', error);
      console.log('error:' + JSON.stringify(error));
      return new Error(error);
    }
  }

  async findTutorDetails(tutorId) {
    try {
      const tslUser = await this.prisma.tslUser.findFirst({
        where: {
          tsl_id: tutorId
        },
        select: {
          tsl_full_name: true
        }
      });
      return {
        status: 201,
        success: true,
        message: 'success',
        data: {
          tutor_id: tutorId,
          tutor_name: tslUser.tsl_full_name
        }
      };
    } catch (error) {
      console.error('error:', error);
      console.log('error:' + JSON.stringify(error));
      return {
        status: 500,
        success: false,
        message: error.message,
        error: error.message
      };

      // return new Error(error);
    }
  }

  async sessionCancelation(sessionId) {
    try {
      await this.prisma.$transaction(
        async (tx) => {
          const goaTslBookedDetails = await tx.goaTslBookedDetails.findFirst({
            where: {
              sessionId: sessionId
            },
            select: {
              id: true,
              tspId: true,
              sessionDate: true,
              goaSlotId: true,
              tutorPhase: true
            }
          });
          const gOATutorsSlots = await tx.gOATutorsSlots.findFirst({
            where: {
              tsp_id: goaTslBookedDetails.tspId
            },
            select: {
              id: true
            }
          });

          const gOATutorSlotsDetails = await tx.gOATutorSlotsDetails.findFirst({
            where: {
              tutor_slot_id: gOATutorsSlots.id,
              slot_id: goaTslBookedDetails.goaSlotId,
              effective_date: {
                lte: goaTslBookedDetails.sessionDate
              }
            },
            select: {
              tutor_slot_id: true,
              hour_status: true,
              effective_date: true,
              slot_status_id: true,
              slot_id: true
            },
            orderBy: {
              effective_date: 'desc' // Sort by session_date in acending order to get the first
            }
          });

          const newData = [];
          newData.push({
            tutor_slot_id: gOATutorSlotsDetails.tutor_slot_id,
            slot_id: gOATutorSlotsDetails.slot_id,
            slot_status_id: goaTslBookedDetails.tutorPhase ? 1 : 2, // 1 - PA, 2 - SA
            effective_date: goaTslBookedDetails.sessionDate,
            hour_status: gOATutorSlotsDetails.hour_status,
            created_at: new Date(),
            created_by: 2
          });
          newData.push({
            tutor_slot_id: gOATutorSlotsDetails.tutor_slot_id,
            slot_id: gOATutorSlotsDetails.slot_id,
            slot_status_id: gOATutorSlotsDetails.slot_status_id,
            effective_date: gOATutorSlotsDetails.effective_date,
            hour_status: gOATutorSlotsDetails.hour_status,
            created_at: new Date(),
            created_by: 2
          });

          await tx.gOATutorSlotsDetails.createMany({
            data: newData
          });

          await tx.goaTslBookedDetails.update({
            where: {
              id: goaTslBookedDetails.id
            },
            data: {
              status: 7 // Cancelled
            }
          });
        },
        {
          maxWait: 60000, // 60s // default: 2000
          timeout: 30000 // 30s // default: 5000
        }
      );

      return { success: true, message: 'Ok', status: 200 };
    } catch (error) {
      console.error('error:', error);
      console.log('error:' + JSON.stringify(error));
      return {
        status: 500,
        success: false,
        message: error.message,
        error: error.message
      };
    }
  }
}
