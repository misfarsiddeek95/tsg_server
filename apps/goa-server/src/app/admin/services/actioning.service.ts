import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../email/email.service';
import { ConcernsDto, PaymentConcernsTableDto } from '../dtos/actioning.dto';
import { getTutorWorkingCountry, getWeekDate } from '../../util';
import { CommonService } from '../../util/common.service';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class ActioningService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
    private commonService: CommonService,
    private userService: UserService
  ) {}

  //Get Payment Concerns Table Data - Start __________________________________
  async getPaymentConcernsTable(dto: PaymentConcernsTableDto) {
    const {
      skip,
      take,
      business_unit,
      actionStatus,
      concernType,
      tutor_name,
      tutor_id,
      concern_Id,
      date,
      slot_number,
      tutorLocation
    } = dto;

    try {
      const currentweek = moment().isoWeekday(1).startOf('week');
      const startDate = currentweek.add(1, 'd').format();
      const endDate = currentweek.add(5, 'd').format();

      const academicCalendarCountries = {
        'TSG-IND': 'indian',
        TSG: 'srilankan'
      };

      const counties = { TSG: 'SL', 'TSG-IND': 'IND' };
      const RateCode = {
        0: 'AVL',
        1: 'SES_DE',
        2: 'SES_AD_SEC',
        3: 'STAT_ALW'
      };

      const slotStatusType = {
        1: 'Primary',
        2: 'Secondary',
        3: 'Primary Cover',
        4: 'Secondary Cover',
        5: 'Unavailable',
        7: 'Time Off',
        8: 'On Hold',
        9: 'No Session',
        10: 'AdhocTimeOff'
      };

      const editable = [8, 7, 6];

      const tutor_tsp_id = await this.prisma.tmApprovedStatus
        .findMany({
          where: {
            AND: [
              business_unit.length > 0
                ? {
                    tutorLine: {
                      in:
                        business_unit == 'Common'
                          ? 'Primary and Secondary'
                          : business_unit
                    }
                  }
                : undefined,

              tutorLocation.length > 0
                ? {
                    center: {
                      in: [...tutorLocation]
                    }
                  }
                : undefined
            ]
          },
          select: {
            tutorTspId: true
          }
        })
        .then((results) => results.map((r) => r.tutorTspId));

      const whereClause = {
        AND: [
          {
            status: {
              notIn: [3]
            }
          },
          {
            date: {
              gte: date?.startDate,
              lte: date?.endDate
            }
          },

          tutor_name.length > 0 || tutor_id.length > 0
            ? {
                tsp_id: {
                  in: [...tutor_name, ...tutor_id]
                }
              }
            : undefined,

          concernType.length > 0
            ? {
                concern: {
                  in: [...concernType]
                }
              }
            : undefined,

          slot_number.length > 0
            ? {
                slot: {
                  time_range: {
                    id: {
                      in: [...slot_number]
                    }
                  }
                }
              }
            : undefined,
          actionStatus.length > 0
            ? {
                status: {
                  in: [...actionStatus]
                }
              }
            : undefined,

          business_unit.length > 0 || tutorLocation.length > 0
            ? { tsp_id: { in: tutor_tsp_id } }
            : undefined,

          concern_Id.length > 0
            ? {
                id: {
                  in: [...concern_Id]
                }
              }
            : undefined
        ].filter(Boolean)
      };

      const countData = await this.prisma.gOASessionFlags.count({
        where: whereClause
      });

      const CountStatus = await this.prisma.gOASessionFlags.findMany({
        where: whereClause,
        select: {
          status: true
        }
      });

      // get there country
      const data = await this.prisma.gOASessionFlags.findMany({
        where: whereClause,
        skip: skip,
        take: take,
        orderBy: {
          created_at: 'desc'
        },
        select: {
          id: true,
          date: true,
          created_at: true,
          status: true,
          slot_id: true,
          tsp_id: true,
          satutary: true,

          slot_status: {
            select: {
              id: true,
              description: true
            }
          },
          hour_state: {
            select: {
              name: true
            }
          },
          slot: {
            select: {
              time_range: {
                select: {
                  id: true,
                  hh_time: true,
                  oh_time: true
                }
              }
            }
          },
          GOASessionFlagStatus: {
            select: {
              status: true,
              reason: true,
              comment: true,
              created_at: true,
              created_by: true
            },
            orderBy: [
              { created_at: 'desc' }, // Order by created_at descending order
              { id: 'desc' }
            ],
            take: 1 // get order 1
          },

          concern: true,
          description: true,
          document_uri: true
        }
      });

      const tslUser = await this.prisma.tslUser.findMany({
        where: {
          tsp_id: {
            in: data.map((key) => {
              return key.tsp_id;
            })
          }
        },
        select: {
          tsp_id: true,
          tsl_id: true,
          tsl_full_name: true
        }
      });

      const tmApprovedStatus = await this.prisma.tmApprovedStatus.findMany({
        where: {
          tutorTspId: {
            in: data.map((key) => {
              return key.tsp_id;
            })
          }
        },
        select: {
          tutorLine: true,
          tutorTspId: true,
          center: true,
          supervisorName: true
        }
      });

      const approvedContactData =
        await this.prisma.approvedContactData.findMany({
          where: {
            tspId: {
              in: data.map((key) => {
                return key.tsp_id;
              })
            }
          },
          select: {
            workEmail: true,
            tspId: true
          }
        });

      const tm_master_tb = await this.prisma.tmMasterTb.findMany({
        where: {
          effectiveDate: {
            lte: endDate
          },
          returnDate: {
            gte: startDate
          }
        },
        select: {
          tutorTspId: true,
          movementType: true,
          returnDate: true,
          effectiveDate: true
        }
      });

      const tier = await this.prisma.gOATutorTier.findMany({
        where: {
          effective_date: {
            lte: currentweek.format()
          }
        },
        orderBy: [
          {
            effective_date: 'desc'
          }
        ],
        select: {
          tsp_id: true,
          tier_id: true,
          tiers: {
            select: {
              id: true,
              discription: true
            }
          }
        }
      });

      const mergedList = await Promise.all(
        data.map((t1) => ({
          ...t1,
          ...tslUser.find((t2) => Number(t2.tsp_id) === t1.tsp_id),
          ...tmApprovedStatus.find((t3) => Number(t3.tutorTspId) === t1.tsp_id),
          ...tm_master_tb.find((t3) => t3.tutorTspId === t1.tsp_id),
          ...tier.find((t3) => t3.tsp_id === t1.tsp_id),
          ...approvedContactData.find((t4) => t4.tspId === t1.tsp_id)
        }))
      );

      const ConcernsTableData: Array<any> = [];

      const Current_Status = {
        0: 'Pending',
        1: 'Rejected',
        2: 'Resolved',
        5: 'In Review'
      };

      for (const d of mergedList) {
        const begin = moment(d.date).isoWeekday(1).startOf('week');
        const fromDate = begin.add(1, 'd').format();
        const toDate = begin.add(5, 'd').format();

        const launchedSessions = await this.getLaunchedSessions(
          fromDate,
          toDate,
          d.tsp_id
        );

        const AcademicCalendar = await this.getAcademicCalendar(
          fromDate,
          toDate,
          academicCalendarCountries[d.center]
        );

        const CurrentAvailability = await this.getCurrentAvailability(
          toDate,
          d.tsp_id,
          d.slot_id
        );

        // const PaymentRates = await this.getPaymentRates(
        //   toDate,
        //   counties[d.center],
        //   d.tier_id
        // );

        const PaymentRates = await this.userService.getPaymentRates(
          d.tsp_id,
          toDate,
          counties[d.center]
        );

        const AdhoctimeOffDetails = await this.getAdhoctimeOffDetails(
          fromDate,
          toDate,
          d.tsp_id
        );

        const filteredAdhocTimeOffDetails = AdhoctimeOffDetails.flatMap(
          (obj) => obj.timeoff_details
        );

        const filteredAdhocArray = filteredAdhocTimeOffDetails.filter(
          (innerObj) => innerObj.slot_id === d.slot_id
        );

        const launchedSessionsArray = launchedSessions.filter(
          (innerObj) => innerObj.slot_id === d.slot_id
        );

        const country = d.center ? getTutorWorkingCountry(d.center) : '';

        ConcernsTableData.push({
          id: d.id,
          concern_id: d.id.toString().padStart(10, '0'),
          slot_id: d.slot.time_range.id,
          status: d.status,
          Current_Status: Current_Status[d.status],
          Tier: d.tiers?.discription ?? '', // need add their
          tutor_name: d.tsl_full_name,
          tutor_id: Number(d.tsl_id),
          supervisorName: d.supervisorName,
          country: country,
          tutor_tsp_id: d.tsp_id,
          tutorEmail: d.workEmail,
          effective_date: moment(d.date).format('DD.MM.YYYY'),
          ppUrl: '',
          tutor_status: d.movementType
            ? moment(d.effectiveDate).format('YYYY-MM-DD') <=
                begin.format('YYYY-MM-DD') &&
              moment(d.returnDate).format('YYYY-MM-DD') >
                begin.format('YYYY-MM-DD')
              ? d.movementType
              : 'Active'
            : 'Active',
          tutor_type: d.tutorLine
            ? d.tutorLine === 'Primary'
              ? 'Primary'
              : d.tutorLine === 'Secondary'
              ? 'Secondary'
              : 'Common'
            : 'Trainee',
          concern: d.concern,
          comment: d.description?.replace(/\n/g, '') ?? '',
          created_at: d.created_at,
          document_uri: d.document_uri,
          slot_status: d.slot_status?.description ?? '',
          satutary: d.satutary === true ? ' - Statutory' : '',
          sessionFlagComments: d.GOASessionFlagStatus,
          adminComment:
            d.GOASessionFlagStatus[0].status !== 0
              ? d.GOASessionFlagStatus[0].comment.replace(/\n/g, '')
              : '',
          adminChangeDate:
            d.GOASessionFlagStatus[0].status !== 0
              ? d.GOASessionFlagStatus[0].created_at
              : '',
          createdBy: await this.getCreateByName(
            d.GOASessionFlagStatus[0].created_by
          ),
          slotType:
            launchedSessionsArray.length > 0
              ? `${slotStatusType[launchedSessionsArray[0].slot_status_id]} ${
                  AcademicCalendar.some(
                    (item) =>
                      moment(item.effective_date).format('YYYY-MM-DD') ===
                        moment(launchedSessionsArray[0].effective_date).format(
                          'YYYY-MM-DD'
                        ) && [1].includes(item.holidays_type_id)
                  )
                    ? '-Statutory'
                    : ''
                }`
              : `${
                  CurrentAvailability === 6
                    ? slotStatusType[5]
                    : editable.includes(CurrentAvailability)
                    ? CurrentAvailability === 7
                      ? filteredAdhocArray.length > 0
                        ? slotStatusType[10]
                        : slotStatusType[CurrentAvailability]
                      : slotStatusType[CurrentAvailability]
                    : slotStatusType[9]
                } ${
                  AcademicCalendar.some(
                    (item) =>
                      moment(item.effective_date).format('YYYY-MM-DD') ===
                        moment(begin).format('YYYY-MM-DD') &&
                      [1].includes(item.holidays_type_id)
                  )
                    ? '-Statutory'
                    : ''
                }`,
          // earnings1:
          //   launchedSessionsArray.length > 0
          //     ? (counties[d.center] === 'SL' ? 'LKR' : 'INR') +
          //       ' ' +
          //       (PaymentRates
          //         ? AcademicCalendar.some(
          //             (item) =>
          //               moment(item.effective_date).format('YYYY-MM-DD') ===
          //                 moment(
          //                   launchedSessionsArray[0].effective_date
          //                 ).format('YYYY-MM-DD') &&
          //               [2, 8].includes(item.holidays_type_id)
          //           )
          //           ? 0
          //           : PaymentRates.reduce((totalAmount, entry) => {
          //               const isStatus1Or3 =
          //                 [1, 3].includes(
          //                   launchedSessionsArray[0].slot_status_id
          //                 ) &&
          //                 (entry.rate_code === RateCode[0] ||
          //                   entry.rate_code === RateCode[1] ||
          //                   AcademicCalendar.some(
          //                     (item) =>
          //                       moment(item.effective_date).format(
          //                         'YYYY-MM-DD'
          //                       ) ===
          //                         moment(
          //                           launchedSessionsArray[0].effective_date
          //                         ).format('YYYY-MM-DD') &&
          //                       entry.rate_code === RateCode[3] &&
          //                       [1].includes(item.holidays_type_id)
          //                   ));

          //               const isStatus2Or4 =
          //                 [2, 4].includes(
          //                   launchedSessionsArray[0].slot_status_id
          //                 ) &&
          //                 (entry.rate_code === RateCode[0] ||
          //                   entry.rate_code === RateCode[1] ||
          //                   entry.rate_code === RateCode[2] ||
          //                   AcademicCalendar.some(
          //                     (item) =>
          //                       moment(item.effective_date).format(
          //                         'YYYY-MM-DD'
          //                       ) ===
          //                         moment(
          //                           launchedSessionsArray[0].effective_date
          //                         ).format('YYYY-MM-DD') &&
          //                       entry.rate_code === RateCode[3] &&
          //                       [1].includes(item.holidays_type_id)
          //                   ));

          //               if (isStatus1Or3 || isStatus2Or4) {
          //                 return totalAmount + entry.amount;
          //               } else {
          //                 return totalAmount;
          //               }
          //             }, 0)
          //         : 0)
          //     : (counties[d.center] === 'SL' ? ' LKR' : ' INR') +
          //       ' ' +
          //       (PaymentRates
          //         ? !editable.includes(CurrentAvailability)
          //           ? PaymentRates.find(
          //               (entry) => entry.rate_code === RateCode[0]
          //             ).amount
          //           : 0
          //         : 0),
          earnings: await this.commonService.calculateInvoiceTotalAmount({
            launchedSessionsForSlot: launchedSessionsArray,
            tutorCenter: counties[d.center],
            paymentRate: PaymentRates,
            academicCalendar: AcademicCalendar,
            fromDate: fromDate,
            timeRangeId: d.slot.time_range.id // time_range_id
          })
        });
      }

      let PendingCount = 0;
      let InReviewCount = 0;

      await Promise.all([
        (PendingCount = CountStatus.reduce((count, v) => {
          if (v.status === 0) {
            return count + 1;
          }
          return count;
        }, 0)),
        (InReviewCount = CountStatus.reduce((count, v) => {
          if (v.status === 5) {
            return count + 1;
          }
          return count;
        }, 0))
      ]);

      const sortedData = ConcernsTableData.sort(
        (a, b) => b.created_at - a.created_at
      );

      // const paginatedData = sortedData.slice(skip, skip + take);

      return {
        success: true,
        data: sortedData,
        Count: countData,
        PendingCount: PendingCount,
        InReviewCount: InReviewCount
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  //Get Payment Concerns Table Data - End __________________________________

  // Concerns Request  - Start __________________________________
  async ConcernRequest(dto: ConcernsDto, user: any) {
    const { Concern_request_details, comment, status } = dto;

    try {
      await Promise.all(
        Concern_request_details.map(async (value: any) => {
          const result = await this.prisma.gOASessionFlags.findUnique({
            where: {
              id: value.id
            },
            select: {
              concern: true
            }
          });

          await this.prisma.gOASessionFlags.update({
            where: {
              id: value.id
            },
            data: {
              status: status,
              GOASessionFlagStatus: {
                create: {
                  status: status,
                  comment: comment,
                  reason: result.concern,
                  created_at: new Date().toISOString(),
                  created_by: user.user.tsp_id
                }
              }
            }
          });
        })
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Concerns Request  - End __________________________________

  // Search  Tutor Name - Start __________________________________
  async getTutorName(params: any) {
    const { filter } = params;

    const tutors_ID = await this.prisma.gOASessionFlags.findMany({
      select: {
        tsp_id: true
      }
    });

    try {
      const users = await this.prisma.tslUser.findMany({
        where: {
          AND: {
            tsl_full_name: {
              contains: filter
            },
            tsp_id:
              tutors_ID.length > 0
                ? {
                    in: tutors_ID.map((e) => e.tsp_id)
                  }
                : {}
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
  // Search  Tutor Name - End __________________________________

  // Search Tutor ID - Start __________________________________
  async getTutorID(params: any) {
    const { filter } = params;

    try {
      const result = await this.prisma.$queryRaw`SELECT DISTINCT tsp_id, tsl_id 
          FROM tsl_user 
          WHERE tsp_id IN (
            SELECT tsp_id 
            FROM goa_session_flags 
            WHERE tsp_id 
          ) 
          AND tsl_id LIKE ${filter + '%'};`;

      const data = (result as unknown as any[]).map((key) => {
        return {
          tspId: Number(key.tsp_id),
          name: Number(key.tsl_id) + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Search Tutor ID - End __________________________________

  //Search Concern ID - Start __________________________________
  async getConcerneID(filter: number) {
    try {
      const result = await this.prisma
        .$queryRaw`SELECT DISTINCT tsp_id, id FROM goa_session_flags WHERE  id 
          LIKE ${filter + '%'};`;

      const data = (result as unknown as any[]).map((key) => {
        return {
          tspId: Number(key.id),
          name: String(key.id).padStart(10, '0')
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //Search Concern ID - End __________________________________

  // Get Create By Name - Start _____________________________
  async getCreateByName(created_by: number) {
    const results = await this.prisma.nonTutorDirectory.findMany({
      where: {
        hr_tsp_id: {
          in: [created_by]
        }
      },
      select: {
        hr_tsp_id: true,
        short_name: true
      }
    });

    return results.map((r) => `by ${r.short_name}`);
  }
  // Get Create By Name - End _____________________________

  // Get Payment Rates - Start _____________________________
  // async getPaymentRates(endDate: any, counties: string, tier_id: number) {
  //   if (tier_id) {
  //     const PaymentRates = await this.prisma.gOATutorPaymentRates.findMany({
  //       where: {
  //         effective_date: {
  //           lte: moment(endDate).format()
  //         },
  //         country: counties,
  //         tier_id: tier_id
  //       },
  //       orderBy: [
  //         {
  //           effective_date: 'desc' // Get the latest payment rates
  //         }
  //       ],
  //       select: {
  //         rate_code: true,
  //         amount: true
  //       },
  //       distinct: ['rate_code'] // take one each payement rates
  //     });

  //     return PaymentRates;
  //   }
  // }
  // Get Payment Rates - End _____________________________

  // Get Launched Sessions - Start _____________________________
  async getLaunchedSessions(fromDate: any, toDate: any, tsp_id: number) {
    const launchedSessions = await this.prisma.gOALaunchedSessions.findMany({
      where: {
        effective_date: {
          gte: moment(fromDate).format(),
          lte: moment(toDate).format()
        },
        tsp_id: {
          equals: tsp_id
        }
      },
      orderBy: [
        {
          effective_date: 'asc'
        }
      ],
      select: {
        slot_id: true,
        slot_status_id: true,
        effective_date: true
      }
    });

    return launchedSessions;
  }
  // Get Launched Sessions - End _____________________________

  // Get Academic Calendar - Start _____________________________
  async getAcademicCalendar(fromDate: any, toDate: any, country: string) {
    const AcademicCalendar = await this.prisma.calendar.findMany({
      where: {
        effective_date: {
          gte: fromDate,
          lte: toDate
        },
        holidays_type_id: {
          notIn: [5, 7]
        },
        country: {
          equals: country
        }
      },
      select: {
        id: true,
        holidays_type_id: true,
        effective_date: true,
        description: true
      }
    });
    return AcademicCalendar;
  }
  // Get Academic Calendar - End _____________________________

  // Get Current Availability - Start _____________________________
  async getCurrentAvailability(endDate: any, tsp_id: number, slot_id: number) {
    console.log(tsp_id);
    console.log(endDate);

    const currentAvailability = await this.prisma.gOATutorsSlots.findMany({
      where: {
        AND: {
          tsp_id: {
            in: tsp_id
          },
          effective_date: {
            lte: moment(endDate).format()
          }
        }
      },
      orderBy: [
        {
          effective_date: 'desc'
        }
      ],
      take: 1,
      select: {
        tsp_id: true,
        GOATutorSlotsDetails: {
          where: {
            AND: {
              slot_id: slot_id,
              effective_date: {
                lte: moment(endDate).format()
              }
            }
          },
          orderBy: [
            {
              id: 'desc'
            }
          ],
          select: {
            id: true,
            tutor_slot_id: true,
            slot_id: true,
            slot_status_id: true,
            slot: {
              select: {
                id: true,
                time_range_id: true,
                date_id: true,
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
            }
          }
        }
      }
    });

    const slotStatus = currentAvailability[0].GOATutorSlotsDetails[0]
      ? currentAvailability[0].GOATutorSlotsDetails[0].slot_status_id
      : 9;

    return slotStatus;
  }
  // Get Current Availability - End _____________________________

  // Get Adhoc timeOff Details - Start _____________________________
  async getAdhoctimeOffDetails(fromDate: any, toDate: any, tsp_id: number) {
    const AdhoctimeOffDetails = await this.prisma.gOATimeOff.findMany({
      where: {
        AND: {
          tsp_id: tsp_id,
          status: 6
        }
      },
      select: {
        timeoff_details: {
          where: {
            effective_date: {
              gte: moment(fromDate).format(),
              lte: moment(toDate).format()
            },
            req_status: 6
          },
          orderBy: [
            {
              effective_date: 'asc'
            }
          ],
          select: {
            slot_id: true,
            req_status: true
          }
        }
      }
    });

    return AdhoctimeOffDetails;
  }
  // Get Adhoc timeOff Details - End _____________________________
}
