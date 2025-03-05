import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../../prisma/prisma.service';
import {
  LEAVE_MOVEMENTS,
  ONBORDING_MOVEMENTS,
  TUTOR_STATUS_KEYWORDS,
  activeTutorsForInvoicing,
  groupAndSortTutorMovementsAndReturnActiveTutors,
  compareDateIsDateBefor
} from '../../util';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getDaylightSavingTimeUdpate(
    timeString: string,
    effectiveDateSting: Date
  ) {
    const daylightSaving = await this.prisma.daylightSaving.findFirst({
      where: {
        start_Date: {
          lte: new Date(effectiveDateSting).toISOString() // Check if start date is less than or equal to effective date
        },
        end_Date: {
          gte: new Date(effectiveDateSting).toISOString() // Check if end date is greater than or equal to effective date
        }
      }
    });

    if (!daylightSaving) {
      return timeString;
    }

    const format = 'HH:mm'; // format of the input time string
    const time = moment(timeString, format);

    const hourChange = daylightSaving.effective_hours;

    if (hourChange >= 0) {
      time.add(Math.abs(hourChange), 'hours');
    } else {
      time.subtract(Math.abs(hourChange), 'hours');
    }

    const newTimeString = time.format(format);

    return newTimeString;
  }

  async getExactSlotTimeRangeForHourState(timeRange, tutorHourState, date) {
    const hhTime = await this.getDaylightSavingTimeUdpate(
      timeRange.hh_time,
      date
    );

    const ohTime = await this.getDaylightSavingTimeUdpate(
      timeRange.oh_time,
      date
    );

    if (tutorHourState && tutorHourState.GOATutorHourStateDetails[0]) {
      if (
        tutorHourState.GOATutorHourStateDetails[0].hour_state.name === 'Flexi'
      ) {
        return `${ohTime}/${hhTime}`;
      } else if (
        tutorHourState.GOATutorHourStateDetails[0].hour_state.name === 'OH'
      ) {
        return ohTime;
      } else {
        return hhTime;
      }
    }

    return `${ohTime}/${hhTime}`;
  }
  /**
   * tmApprovedStatus - Currunt Status (Today) - employeeStatus: 'Active'
   * tmMasterTb - Past, Currunt and Future (All) - filter data with date range - consider below moment types
   * movementTypesForFilter = [
      'initial',
      'on-hold',
      'resign',
      'long-term',
      'termination',
      'no-show',
      'community',
      'return-from-long',
      'return-from-temp',
      'released-from',
      'withdrawal-resignation'
    ];
   * 
   * Steps-----
   * 1. get all the data from tmApprovedStatus table 
   * 2. compared with  tmApprovedStatus data list with tmMasterTb
   *
   * Active - no moments on  tmMasterTb table  -> can diresctly get these tutors
   * Active - have moment - but no effective date -> think and filter with moment type and get the tutor ex:- on-hold
   * Inactive - Curruntly innactive but in future can be Active
   *
   *
   * info-
   * cronjob run for tmApprovedStatus table everyday 12AM
   */

  async getActiveTutorsForEffectiveDate(effectiveDate) {
    const movementTypesForFilter = [
      'initial',
      'on-hold',
      'resign',
      'long-term',
      'termination',
      'no-show',
      'community',
      'return-from-long',
      'return-from-temp',
      'released-from',
      'withdrawal-resignation'
    ];

    const tutors = await this.prisma.tmMasterTb.findMany({
      where: {
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          lte: effectiveDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true,
        createdAt: true
      }
    });

    // Group the array by tutorTspId
    const selectedTutors = groupAndSortTutorMovementsAndReturnActiveTutors(
      tutors,
      movementTypesForFilter
    );

    return selectedTutors;
  }

  async getActiveTutorsForTimeFrame(startDate, endDate) {
    const movementTypesForFilter = [
      'initial',
      'on-hold',
      'resign',
      'long-term',
      'termination',
      'no-show',
      'community',
      'suspension',
      'return-from-long',
      'return-from-temp',
      'released-from',
      'withdrawal-resignation'
    ];

    const tutorsDetailsForStartDateData = this.prisma.tmMasterTb.findMany({
      where: {
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          lte: startDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        },
        {
          id: 'desc'
        }
      ],
      distinct: ['tutorTspId'],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true,
        createdAt: true
      }
    });

    const tutorsDetailsForDateRangeData = this.prisma.tmMasterTb.findMany({
      where: {
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          gt: startDate,
          lte: endDate
        }
      },
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true,
        createdAt: true
      }
    });

    const [tutorsDetailsForStartDate, tutorsDetailsForDateRange] =
      await Promise.all([
        tutorsDetailsForStartDateData,
        tutorsDetailsForDateRangeData
      ]);

    const selectedTutors = activeTutorsForInvoicing(
      tutorsDetailsForStartDate,
      tutorsDetailsForDateRange
    );

    return selectedTutors;
  }

  async getTutorsReleventBusinessLine(
    tutorIds: number[],
    businessLines: string[],
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

        if (businessLines.includes(masterMove?.tutorLine)) {
          selectedTutors.push({
            tspId: t,
            businessLine: masterMove?.tutorLine
          });
        }
      }

      return selectedTutors;
    }

    for (const approved of approvedDetails) {
      const masterDetail = masterDetails.find(
        (md) => md.tutorTspId === approved.tutorTspId
      );

      const movement = masterDetail ? masterDetail : approved;

      if (businessLines.includes(movement?.tutorLine)) {
        selectedTutors.push({
          tspId: movement.tutorTspId,
          businessLine: movement?.tutorLine
        });
      }
    }

    return selectedTutors;
  }

  async getTutorsReleventBusinessLineV2(
    businessLines: string[],
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
        employeeStatus: 'Active'
      },
      select: {
        tutorLine: true,
        tutorTspId: true
      }
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

    return selectedTutors;
  }

  async getTutorsReleventBusinessLineV3(effectiveDate, tutorId) {
    //Tutors type curruntly using
    const tutorTypes = {
      Secondary: ['Primary and Secondary', 'primary and secondary'],
      Primary: [
        'Primary',
        'primary',
        'Primary and Secondary',
        'primary and secondary'
      ]
    };

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
        employeeStatus: 'Active'
      },
      select: {
        tutorLine: true,
        tutorTspId: true
      }
    });

    //Filter the tutors with respective busness line Primary or Secondary
    for (const approved of approvedDetails) {
      // get matched turor from tmMasterTb table data
      const masterDetail = masterDetails.find(
        (md) => md.tutorTspId === approved.tutorTspId
      );

      // if we have maching tmMasterTb data, we take it otherwise we take tmApprovedStatus table data
      const movement = masterDetail ? masterDetail : approved;

      if (movement.tutorTspId === tutorId) {
        if (tutorTypes.Primary.includes(movement.tutorLine)) {
          selectedTutors.push({
            tspId: movement.tutorTspId,
            businessLine: 'Primary'
          });
        } else if (tutorTypes.Secondary.includes(movement.tutorLine)) {
          selectedTutors.push({
            tspId: movement.tutorTspId,
            businessLine: 'Secondary'
          });
        }
      }
    }

    return selectedTutors;
  }

  async getTutorsMovementForDateRange(startDate, endDate, tspId) {
    const movementTypesForFilter = [...LEAVE_MOVEMENTS, ...ONBORDING_MOVEMENTS];

    const movements = await this.prisma.tmMasterTb.findMany({
      where: {
        tutorTspId: tspId,
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true,
        returnDate: true
      }
    });

    movements.sort((a, b) => {
      // First, compare effectiveDate in descending order
      const dateComparison =
        new Date(b.effectiveDate).getTime() -
        new Date(a.effectiveDate).getTime();

      // If effectiveDates are the same, compare tutorTspId in descending order
      if (dateComparison === 0) {
        return b.tutorTspId - a.tutorTspId;
      }

      return dateComparison;
    });

    return movements;
  }

  async getTutorsMovementForDateRangeByTutorList(startDate, endDate, tspIds) {
    const movementTypesForFilter = [...LEAVE_MOVEMENTS, ...ONBORDING_MOVEMENTS];

    const movements = await this.prisma.tmMasterTb.findMany({
      where: {
        tutorTspId: {
          in: tspIds
        },
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true,
        returnDate: true
      }
    });

    //This is done because only for resign there is last working date added to effective date
    // Iterate through the array and update effectiveDate if movementType is 'resign'
    const updatedData = movements.map((item) => {
      if (item.movementType === 'resign') {
        // Use moment.js to add one day to the effectiveDate
        const newEffectiveDate = moment(item.effectiveDate)
          .add(1, 'day')
          .toISOString();
        // Create a new object with the updated effectiveDate
        return {
          ...item,
          effectiveDate: newEffectiveDate
        };
      }
      return item; // For other movement types, return the original object
    });

    // Sort the records in descending order by effectiveDate, then by tutorTspId,
    // and finally by id if both tutorTspId and effectiveDate are equal
    updatedData.sort((a, b) => {
      // First, compare effectiveDate in descending order
      const dateComparison =
        new Date(b.effectiveDate).getTime() -
        new Date(a.effectiveDate).getTime();

      if (dateComparison === 0) {
        // If effectiveDates are the same, compare tutorTspId in descending order
        const tutorTspIdComparison = b.tutorTspId - a.tutorTspId;

        if (tutorTspIdComparison === 0) {
          // If tutorTspIds are also the same, compare by id in descending order
          return b.id - a.id;
        }

        return tutorTspIdComparison;
      }

      return dateComparison;
    });

    return updatedData;
  }

  async getTutorsForGivenHourStatus(effectiveDate: any, hourStatus: string[]) {
    const selectedTutors = [];

    const allHoursStatedetails =
      await this.prisma.gOATutorHourStateDetails.findMany({
        where: {
          effective_date: {
            lte: effectiveDate
          }
        },
        orderBy: [
          { effective_date: 'desc' }, // Primary sorting
          { created_at: 'desc' } // Secondary sorting
        ],
        distinct: ['tutor_hour_state_id'],
        select: {
          tutor_hour_state: {
            select: {
              tsp_id: true
            }
          },
          hour_state: {
            select: {
              name: true
            }
          }
        }
      });

    for (const detail of allHoursStatedetails) {
      if (detail.hour_state && hourStatus.includes(detail.hour_state.name)) {
        selectedTutors.push(detail.tutor_hour_state.tsp_id);
      }
    }

    //If not assigned tutors are needed
    if (hourStatus.includes('NONE')) {
      const tspIds = allHoursStatedetails.map((h) => h.tutor_hour_state.tsp_id);

      const notAssignedTutors = await this.prisma.gOATutorsSlots.findMany({
        where: {
          tsp_id: {
            notIn: tspIds
          }
        }
      });

      const notAssignedTutorsIds = notAssignedTutors.map((nat) => nat.tsp_id);

      selectedTutors.push(...notAssignedTutorsIds);
    }

    return selectedTutors;
  }

  async getTutorHourStatus(effectiveDate: Date, tspId: number) {
    const gOATutorHourState = await this.prisma.gOATutorHourState.findFirst({
      where: {
        tsp_id: tspId
      },
      select: {
        id: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const gOATutorHourStateDetails =
      await this.prisma.gOATutorHourStateDetails.findFirst({
        where: {
          tutor_hour_state_id: gOATutorHourState.id,
          effective_date: {
            lte: effectiveDate
          }
        },
        orderBy: [
          { effective_date: 'desc' }, // Primary sorting
          { created_at: 'desc' } // Secondary sorting
        ],
        distinct: ['tutor_hour_state_id'],
        select: {
          tutor_hour_state: {
            select: {
              tsp_id: true
            }
          },
          hour_state: {
            select: {
              name: true
            }
          }
        }
      });

    return {
      hourState: gOATutorHourStateDetails.hour_state.name
    };
  }

  async getComiunityReadyforSessionsTutors(effectiveDate) {
    const movementType = ['community', 'on-hold'];
    const description = 'Ready for Sessions';

    const tutorslastMovement = await this.prisma.tmMasterTb.findMany({
      where: {
        movementStatus: 'Approved',
        effectiveDate: {
          lte: effectiveDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true,
        description: true
      },
      distinct: ['tutorTspId']
    });

    const filltedTutors = tutorslastMovement.filter(
      (move) =>
        move.description === description &&
        movementType.includes(move.movementType)
    );

    return filltedTutors.map((t) => t.tutorTspId);
  }

  async getActiveTutorsForEfectiveDate(effectiveDate) {
    const movementType = [
      'initial',
      'on-hold',
      'resign',
      'long-term',
      'termination',
      'no-show',
      'community',
      'return-from-long',
      'return-from-temp',
      'released-from',
      'withdrawal-resignation',
      'on-notice'
    ];

    const tutorslastMovement = await this.prisma.tmMasterTb.findMany({
      where: {
        movementType: {
          in: movementType
        },
        movementStatus: 'Approved',
        effectiveDate: {
          lte: effectiveDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true,
        description: true
      },
      distinct: ['tutorTspId']
    });

    const filltedTutors = tutorslastMovement.filter((move) =>
      [
        movementType[0],
        movementType[7],
        movementType[8],
        movementType[9],
        movementType[10],
        movementType[11]
      ].includes(move.movementType)
    );

    return filltedTutors.map((t) => t.tutorTspId);
  }

  async getTutorsForGivenStatus(effectiveDate, status) {
    const movementTypesForFilter = [
      'initial',
      'on-hold',
      'resign',
      'long-term',
      'termination',
      'no-show',
      'community',
      'return-from-long',
      'return-from-temp',
      'released-from',
      'withdrawal-resignation',
      'on-notice'
    ];

    const statusNeedToFilter = [];

    if (status === 'Active') {
      statusNeedToFilter.push(
        movementTypesForFilter[0],
        movementTypesForFilter[7],
        movementTypesForFilter[8],
        movementTypesForFilter[9],
        movementTypesForFilter[10]
      );
    } else if (status === 'No Show') {
      statusNeedToFilter.push(movementTypesForFilter[5]);
    } else if (status === 'Long Term Unavailability') {
      statusNeedToFilter.push(movementTypesForFilter[3]);
    } else if (status === 'Termination') {
      statusNeedToFilter.push(movementTypesForFilter[4]);
    } else if (status === 'Community') {
      statusNeedToFilter.push(movementTypesForFilter[6]);
    } else if (status === 'Resignation') {
      statusNeedToFilter.push(movementTypesForFilter[2]);
    } else if (status === 'On Hold') {
      statusNeedToFilter.push(movementTypesForFilter[1]);
    } else if (status === 'Onboarding') {
      const allTutorsInTms = await this.prisma.tmMasterTb.findMany({
        distinct: ['tutorTspId'],
        select: {
          tutorTspId: true
        }
      });

      const onboradingTutors = await this.prisma.gOATutorsSlots.findMany({
        where: {
          tsp_id: {
            notIn: allTutorsInTms.map((t) => t.tutorTspId)
          }
        },
        select: {
          tsp_id: true
        }
      });

      return onboradingTutors.map((t) => t.tsp_id);
    } else if (status === 'On Notice Resignation') {
      statusNeedToFilter.push(movementTypesForFilter[11]);
    }

    const selectedTutors = [];

    const tutors = await this.prisma.tmMasterTb.findMany({
      where: {
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          lte: effectiveDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true
      }
    });

    // Group the array by tutorTspId
    const groupedData = tutors.reduce((result, currentItem) => {
      const tutorTspId = currentItem.tutorTspId;

      if (!result[tutorTspId]) {
        result[tutorTspId] = [];
      }

      result[tutorTspId].push(currentItem);

      return result;
    }, {});

    // Convert the grouped data into an array of objects
    const groupedArray = Object.keys(groupedData).map((tutorTspId) => {
      return {
        tutorTspId: parseInt(tutorTspId, 10),
        details: groupedData[tutorTspId]
      };
    });

    //Check the tutors latest movement
    for (const tutor of groupedArray) {
      const details = tutor.details[0];

      if (statusNeedToFilter.includes(details.movementType)) {
        selectedTutors.push(tutor.tutorTspId);
      }
    }

    return selectedTutors;
  }

  async getTutorReleventBusinessLine(tspId, effectiveDate) {
    const movementTypesForFilter = ['sub-department'];
    const movmentDetails = await this.prisma.tmMasterTb.findMany({
      where: {
        tutorTspId: tspId,
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          lte: effectiveDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ]
    });

    movmentDetails.sort((a, b) => {
      // First, compare effectiveDate in descending order
      const dateComparison =
        new Date(b.effectiveDate).getTime() -
        new Date(a.effectiveDate).getTime();

      // If effectiveDates are the same, compare tutorTspId in descending order
      if (dateComparison === 0) {
        return b.tutorTspId - a.tutorTspId;
      }

      return dateComparison;
    });

    const latesDetails = movmentDetails[0];

    if (latesDetails) {
      return latesDetails.tutorLine;
    }

    const approvedDetails = await this.prisma.tmApprovedStatus.findFirst({
      where: {
        tutorTspId: tspId
      },
      select: {
        tutorLine: true
      }
    });

    return approvedDetails
      ? approvedDetails.tutorLine === 'Primary and Secondary'
        ? 'Common'
        : approvedDetails.tutorLine
      : 'Trainee';
  }

  async getTutorStatusForSpecificDate(tspId, effectiveDate) {
    const movementTypesForFilter = [
      'initial',
      ...LEAVE_MOVEMENTS,
      ...ONBORDING_MOVEMENTS
    ];

    const movements = await this.prisma.tmMasterTb.findMany({
      where: {
        tutorTspId: tspId,
        effectiveDate: {
          lte: effectiveDate
        },
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved'
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true
      }
    });

    movements.sort((a, b) => {
      // First, compare effectiveDate in descending order
      const dateComparison =
        new Date(b.effectiveDate).getTime() -
        new Date(a.effectiveDate).getTime();

      // If effectiveDates are the same, compare tutorTspId in descending order
      if (dateComparison === 0) {
        return b.id - a.id;
      }

      return dateComparison;
    });
    return movements[0]
      ? TUTOR_STATUS_KEYWORDS[movements[0].movementType]
      : 'Onboarding';
  }

  async getTutorsForGivenMultipleStatus(effectiveDate, status: string[]) {
    const movementTypesForFilter = [
      'initial',
      'on-hold',
      'resign',
      'long-term',
      'termination',
      'no-show',
      'community',
      'return-from-long',
      'return-from-temp',
      'released-from',
      'withdrawal-resignation',
      'on-notice'
    ];

    let onboardingDataNeeded = false;
    const statusNeedToFilter = [];

    status.map((status) => {
      if (status === 'Active') {
        statusNeedToFilter.push(
          movementTypesForFilter[0],
          movementTypesForFilter[7],
          movementTypesForFilter[8],
          movementTypesForFilter[9],
          movementTypesForFilter[10]
        );
      } else if (status === 'No Show') {
        statusNeedToFilter.push(movementTypesForFilter[5]);
      } else if (status === 'Long Term Unavailability') {
        statusNeedToFilter.push(movementTypesForFilter[3]);
      } else if (status === 'Termination') {
        statusNeedToFilter.push(movementTypesForFilter[4]);
      } else if (status === 'Community') {
        statusNeedToFilter.push(movementTypesForFilter[6]);
      } else if (status === 'Resignation') {
        statusNeedToFilter.push(movementTypesForFilter[2]);
      } else if (status === 'On Hold') {
        statusNeedToFilter.push(movementTypesForFilter[1]);
      } else if (status === 'Onboarding') {
        onboardingDataNeeded = true;
      } else if (status === 'On Notice Resignation') {
        statusNeedToFilter.push(movementTypesForFilter[11]);
      }
    });

    const selectedTutors = [];

    const tutors = await this.prisma.tmMasterTb.findMany({
      where: {
        movementType: {
          in: movementTypesForFilter
        },
        movementStatus: 'Approved',
        effectiveDate: {
          lte: effectiveDate
        }
      },
      orderBy: [
        {
          effectiveDate: 'desc'
        }
      ],
      select: {
        id: true,
        tutorTspId: true,
        movementType: true,
        effectiveDate: true
      }
    });

    // Group the array by tutorTspId
    const groupedArray = tutors.reduce((result, currentItem) => {
      const tutorTspId: any = currentItem.tutorTspId;
      const date = new Date(currentItem.effectiveDate).getTime();

      // Find or create the group for the current tutorTspId
      let group = result.find((item) => item.tutorTspId === tutorTspId);

      if (!group) {
        group = {
          tutorTspId: parseInt(tutorTspId, 10),
          details: [],
          latestDate: date
        };
        result.push(group);
      }

      group.details.push(currentItem);

      if (date > group.latestDate) {
        group.latestDate = date;
      }

      return result;
    }, []);

    // Sort groupedArray
    groupedArray.forEach((data) => {
      data.details.sort((a, b) => {
        const dateA = new Date(b.effectiveDate).getTime();
        const dateB = new Date(a.effectiveDate).getTime();

        if (dateA === dateB) {
          return b.id - a.id;
        }

        return dateA - dateB;
      });
    });

    //Check the tutors latest movement
    for (const tutor of groupedArray) {
      const details = tutor.details[0];

      if (statusNeedToFilter.includes(details.movementType)) {
        selectedTutors.push(tutor.tutorTspId);
      }
    }

    if (onboardingDataNeeded) {
      const allTutorsInTms = await this.prisma.tmMasterTb.findMany({
        where: {
          effectiveDate: {
            lte: effectiveDate
          }
        },
        distinct: ['tutorTspId'],
        select: {
          tutorTspId: true
        }
      });

      const onboradingTutors = await this.prisma.gOATutorsSlots.findMany({
        where: {
          effective_date: {
            lte: effectiveDate
          },
          tsp_id: {
            notIn: allTutorsInTms.map((t) => t.tutorTspId)
          }
        },
        select: {
          tsp_id: true
        }
      });

      const ids = onboradingTutors.map((t) => t.tsp_id);

      selectedTutors.push(...ids);
    }

    return selectedTutors;
  }

  async getDataOFTutorsForInvoicePeroid(
    releveventTutors: number[],
    counties: any[],
    tier_type: any,
    dateFrom: string,
    dateTo: string,
    country: string
  ) {
    const tutorsWithDataBegining = await this.prisma.gOATutorsSlots.findMany({
      where: {
        AND: [
          {
            tsp_id: {
              in: releveventTutors as number[]
            },
            user: {
              tm_approved_status: {
                center: counties.find((item) => item.code === country)?.center
              },
              GOATutorTier: {
                some: {
                  tiers: {
                    tier_code: { in: tier_type }
                  },
                  effective_date: {
                    lte: dateFrom
                  }
                }
              }
            }
          }
        ]
      },
      select: {
        id: true,
        tsp_id: true,
        user: {
          select: {
            GOATutorTier: {
              where: {
                effective_date: {
                  lte: dateFrom
                }
              },
              orderBy: {
                effective_date: 'desc'
              },
              select: {
                tier_id: true,
                effective_date: true
              },
              take: 1
            }
          }
        }
      }
    });

    const tutorsWithDataDateRange = await this.prisma.gOATutorsSlots.findMany({
      where: {
        AND: [
          {
            tsp_id: {
              in: releveventTutors as number[],
              notIn: tutorsWithDataBegining.map((t) => t.tsp_id)
            },
            user: {
              tm_approved_status: {
                center: counties.find((item) => item.code === country)?.center
              },
              GOATutorTier: {
                some: {
                  tiers: {
                    tier_code: { in: tier_type }
                  },
                  effective_date: {
                    lte: dateTo,
                    gte: dateFrom
                  }
                }
              }
            }
          }
        ]
      },
      select: {
        id: true,
        tsp_id: true,
        user: {
          select: {
            GOATutorTier: {
              where: {
                effective_date: {
                  lte: dateTo,
                  gte: dateFrom
                }
              },
              orderBy: {
                effective_date: 'desc'
              },
              select: {
                tier_id: true,
                effective_date: true
              },
              take: 1
            }
          }
        }
      }
    });

    return [...tutorsWithDataBegining, ...tutorsWithDataDateRange];
  }

  async getPaymentRates(tsp_id: number, toDate: string, counties: string) {
    // Date preparation
    const date2 = moment('2024-09-01 00:00:00');
    const date1 = moment(toDate);

    // Compare the dateFrom with the 2024-09-01 00:00:00 date - this will excecute old logic
    if (await compareDateIsDateBefor(date1, date2)) {
      const tutorTier = await this.prisma.gOATutorTier.findFirst({
        where: {
          effective_date: {
            lt: toDate
          },
          tsp_id: tsp_id
        },
        orderBy: [
          {
            effective_date: 'desc' // to get the latest tier
          }
        ],
        select: {
          tier_id: true
        }
      });

      let PaymentRates;

      if (tutorTier) {
        PaymentRates = await this.prisma.gOATutorPaymentRates.findMany({
          where: {
            effective_date: {
              lte: toDate
            },
            country: counties,
            tier_id: tutorTier.tier_id
          },
          orderBy: [
            {
              effective_date: 'desc' // Get the latest payment rates
            }
          ],
          select: {
            rate_code: true,
            amount: true
          },
          distinct: ['rate_code'] // take one each payement rates
        });
      }

      return PaymentRates;
    } else {
      const PaymentRates = await this.prisma.gOATutorPaymentRates.findMany({
        where: {
          effective_date: {
            lte: toDate
          },
          country: counties,
          tier_id: 4
        },
        orderBy: [
          {
            effective_date: 'desc' // Get the latest payment rates
          }
        ],
        select: {
          rate_code: true,
          amount: true
        },
        distinct: ['rate_code'] // take one each payement rates
      });

      return PaymentRates;
    }
  }
}
