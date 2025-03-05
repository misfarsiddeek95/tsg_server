import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from '../prisma/prisma.service';
import {
  CancelInvoicesDTO,
  GenerateInvoicesDto,
  UpateInvoiceDTO
} from './dto/invoice.dto';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/service/user.service';
import {
  checkInvoiceCalculationEligibility,
  eligibilityForIncentives,
  getAvailabilityForTimeFrame,
  getDatesExcludingWeekends
} from '../util';
import { SlotsService } from '../slots/slots.service';

@Injectable()
export class InvoicingService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
    private userService: UserService,
    private slotsService: SlotsService
  ) {}

  async generateInvoices(data: GenerateInvoicesDto, user: any) {
    const { country, tier_type, date, tutoring_country, due_date } = data;
    // const tier_type_new = ['t1', 't2', 't1d', 't0'];
    const counties = [
      { code: 'SL', center: 'TSG', calender: 'srilankan' },
      { code: 'IND', center: 'TSG-IND', calender: 'indian' }
    ];
    const dateFrom = new Date(date[0].datefrom).toISOString();
    const dateTo = new Date(date[0].dateto).toISOString();

    try {
      if (!user) throw new Error('User not found');
      // START - Initial data requred for calculation
      const {
        paymentRates,
        workedDates,
        tutorsWithData,
        movementsForTutors,
        tutorsLaunchedSessions,
        availabilityOfTutorsForEachDate,
        slots,
        sessionsSwap,
        tutorsUpfr,
        tutorsLateLaunches
      } = await this.mainDataRequiredForInvoiceGeneration(
        country,
        tutoring_country,
        dateFrom,
        dateTo,
        tier_type,
        counties
      );
      // END - Initial data requred for calculation

      if (workedDates.workingDates.length === 0)
        throw new Error(
          'Invalid date range. Please check the selected dates again, as they are not eligible for calculation.'
        );

      if (tutorsWithData.length === 0)
        throw new Error('There are no eligible tutors to generate invoice.');

      // START - Calculations for invoices
      const calculation = await this.calculateInvoiceAmoutsForTutors(
        tutorsWithData,
        movementsForTutors,
        paymentRates,
        tutorsLaunchedSessions,
        availabilityOfTutorsForEachDate,
        workedDates.workingDates,
        slots,
        sessionsSwap,
        tutorsUpfr,
        tutorsLateLaunches,
        dateFrom,
        dateTo
      );
      // END - Calculations for invoices
      // console.log('calculation:' + JSON.stringify(calculation[0]));
      const invoiceBatch = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          // Create invoice batch
          const invoiceBatch = await tx.gOAInvoicingBatch.create({
            data: {
              start_date: dateFrom,
              end_date: dateTo,
              country: country,
              status: 0,
              updated_by: user.user.tsp_id,
              created_at: new Date().toISOString(),
              tutoring_country: tutoring_country
            },
            select: {
              id: true
            }
          });

          // Get the tiers that is sellected
          const tiers = await tx.gOATiers.findMany({
            where: {
              tier_code: {
                in: tier_type
              }
            },
            select: {
              id: true
            }
          });

          const tierIds = tiers.map((tier) => tier.id);

          await tx.gOAInvoiceBatchTiers.createMany({
            data: tierIds.map((tierId) => ({
              tier_id: tierId,
              batch_id: invoiceBatch.id
            }))
          });

          for (const data of calculation) {
            let invoiceDetailsSaving = [];

            //Push availability prices
            data.availability.map((availability: any, index: number) => {
              console.log('in:' + index);
              invoiceDetailsSaving.push({
                tutor_payment_rate_id: availability.rateId,
                total_slot_count: availability.count,
                calculated_total_amount: availability.amount,
                status: 0,
                updated_by: user.user.tsp_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            });

            invoiceDetailsSaving.push({
              tutor_payment_rate_id: data.saturation.rateId,
              total_slot_count: data.saturation.count,
              calculated_total_amount: data.saturation.amount,
              status: 0,
              updated_by: user.user.tsp_id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

            invoiceDetailsSaving.push({
              tutor_payment_rate_id: data.launchedSessions.rateId,
              total_slot_count: data.launchedSessions.count,
              calculated_total_amount: data.launchedSessions.amount,
              status: 0,
              updated_by: user.user.tsp_id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

            invoiceDetailsSaving.push({
              tutor_payment_rate_id: data.secondary.rateId,
              total_slot_count: data.secondary.count,
              calculated_total_amount: data.secondary.amount,
              status: 0,
              updated_by: user.user.tsp_id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

            // const invoiceDetailsSaving = [
            //   {
            //     tutor_payment_rate_id: data.availability.rateId,
            //     total_slot_count: data.availability.count,
            //     calculated_total_amount: data.availability.amount,
            //     status: 0,
            //     updated_by: user.user.tsp_id,
            //     created_at: new Date().toISOString(),
            //     updated_at: new Date().toISOString()
            //   },
            //   {
            //     tutor_payment_rate_id: data.saturation.rateId,
            //     total_slot_count: data.saturation.count,
            //     calculated_total_amount: data.saturation.amount,
            //     status: 0,
            //     updated_by: user.user.tsp_id,
            //     created_at: new Date().toISOString(),
            //     updated_at: new Date().toISOString()
            //   },
            //   {
            //     tutor_payment_rate_id: data.launchedSessions.rateId,
            //     total_slot_count: data.launchedSessions.count,
            //     calculated_total_amount: data.launchedSessions.amount,
            //     status: 0,
            //     updated_by: user.user.tsp_id,
            //     created_at: new Date().toISOString(),
            //     updated_at: new Date().toISOString()
            //   },
            //   {
            //     tutor_payment_rate_id: data.secondary.rateId,
            //     total_slot_count: data.secondary.count,
            //     calculated_total_amount: data.secondary.amount,
            //     status: 0,
            //     updated_by: user.user.tsp_id,
            //     created_at: new Date().toISOString(),
            //     updated_at: new Date().toISOString()
            //   }
            // ];

            //If Insentives are there add that details too
            if (data.incentives) {
              invoiceDetailsSaving.push({
                tutor_payment_rate_id: data.incentives.rateId,
                total_slot_count: data.incentives.count,
                calculated_total_amount: data.incentives.amount,
                status: 0,
                updated_by: user.user.tsp_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            }

            await tx.gOAInvoice.create({
              data: {
                batch_id: invoiceBatch.id,
                tsp_id: data.tsp_id,
                total_amount: data.totalAmount,
                status: 0,
                updated_by: user.user.tsp_id,
                updated: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tier_id: data.tierId,
                due_date: new Date(due_date).toISOString(),
                comment: '',
                invoice_details: {
                  createMany: {
                    data: invoiceDetailsSaving
                  }
                }
              },
              select: {
                id: true
              }
            });
          }

          return invoiceBatch;
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 60000 // default: 5000
        }
      );

      return {
        success: true,
        // invoicingBatchId: invoiceBatch.id,
        invoicingBatchId: 1,
        message: 'Invoices generated successfully'
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }

  async getAllTiers() {
    return await this.prisma.gOATiers.findMany({
      select: {
        discription: true,
        tier_code: true,
        id: true
      }
    });
  }

  async getInvoicedetails(invoiceId: number) {
    try {
      return this.prisma.$transaction(async (tx) => {
        const invoiceDetails = await tx.gOAInvoice.findUnique({
          where: {
            id: invoiceId
          },
          select: {
            tsp_id: true,
            id: true,
            batch_id: true,
            total_amount: true,
            due_date: true,
            tiers: { select: { discription: true } },
            invoice_details: {
              select: {
                total_slot_count: true,
                calculated_total_amount: true,
                tutor_payment_rates: {
                  select: {
                    id: true,
                    description: true,
                    tier: {
                      select: {
                        tier_code: true,
                        discription: true,
                        id: true
                      }
                    },
                    amount: true
                  }
                }
              }
            }
          }
        });

        const userDetails = await tx.user.findUnique({
          where: {
            tsp_id: invoiceDetails.tsp_id
          },
          select: {
            approved_bank_data: {
              select: {
                bAccountNo: true,
                bankName: true,
                bAccountName: true,
                bBranch: true
              }
            },
            approved_contact_data: {
              select: {
                workEmail: true,
                residingAddressL1: true,
                residingAddressL2: true,
                residingCity: true,
                residingDistrict: true,
                residingProvince: true,
                permanentAddressL1: true,
                permanentAddressL2: true,
                permanentCity: true,
                permanentDistrict: true,
                permanentProvince: true
              }
            },
            TslUser: {
              select: {
                tsl_full_name: true
              }
            }
          }
        });

        const invoicePeriod = await tx.gOAInvoicingBatch.findUnique({
          where: {
            id: invoiceDetails.batch_id
          },
          select: {
            start_date: true,
            end_date: true,
            country: true
          }
        });

        return {
          details: {
            invoiceDetails,
            userDetails: {
              bank_account_no: userDetails.approved_bank_data.bAccountNo,
              bank: userDetails.approved_bank_data.bankName,
              name_as_per_bank: userDetails.approved_bank_data.bAccountName,
              bank_branch: userDetails.approved_bank_data.bBranch,
              personal_email_address:
                userDetails.approved_contact_data.workEmail,
              tsl_platform_name: userDetails.TslUser[0].tsl_full_name,
              current_address: `${userDetails.approved_contact_data.residingAddressL1} \n ${userDetails.approved_contact_data.residingAddressL2}`,
              current_address_city:
                userDetails.approved_contact_data.residingCity,
              permanat_address: `${userDetails.approved_contact_data.permanentAddressL1} \n ${userDetails.approved_contact_data.permanentAddressL2}`,
              permanat_address_district:
                userDetails.approved_contact_data.permanentDistrict,
              permanent_address_province:
                userDetails.approved_contact_data.permanentProvince
            },
            invoicePeriod
          }
        };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateInvoice(id: number, data: UpateInvoiceDTO, user: any) {
    try {
      const rates = await this.prisma.gOATutorPaymentRates.findMany({
        where: {
          id: {
            in: data.details.map((d) => +d.rate_id)
          }
        }
      });

      // START - Transaction for updating the invoices
      await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          for (const details of data.details) {
            const { amount, rate_id, detail_id } = details;

            const rateDetails = rates.find((r) => r.id === rate_id);

            await tx.gOAInvoiceDetails.update({
              where: {
                id: detail_id
              },
              data: {
                total_slot_count: +amount,
                calculated_total_amount: +amount * rateDetails.amount,
                updated_by: user.user.tsp_id
              }
            });
          }

          const allDetails = await tx.gOAInvoiceDetails.findMany({
            where: {
              invoice_id: id
            },
            select: {
              id: true,
              calculated_total_amount: true
            }
          });

          const totalAmount = allDetails.reduce(
            (acc, curr) => acc + curr.calculated_total_amount,
            0
          );

          if (data.due_date !== null) {
            await tx.gOAInvoice.update({
              where: {
                id: id
              },
              data: {
                total_amount: totalAmount,
                updated: 1,
                due_date: new Date(data.due_date).toISOString(),
                updated_by: user.user.tsp_id,
                updated_at: new Date().toISOString()
              }
            });
          } else {
            await tx.gOAInvoice.update({
              where: {
                id: id
              },
              data: {
                total_amount: totalAmount,
                updated: 1,
                updated_by: user.user.tsp_id,
                updated_at: new Date().toISOString()
              }
            });
          }
          if (data.state !== 0) {
            const updateInvoiceData = await tx.gOAInvoice.findUnique({
              where: {
                id: id
              },
              select: {
                tsp_id: true,
                invoicing_batch: {
                  select: {
                    tutoring_country: true,
                    start_date: true,
                    end_date: true
                  }
                }
              }
            });

            const updateTutorName = await this.emailService.getTutorName(
              updateInvoiceData.tsp_id
            );
            const UpdateTutorEmail = await this.emailService.getTutorEmail(
              updateInvoiceData.tsp_id
            );
            const tutorId = await this.emailService.getTutorId(
              updateInvoiceData.tsp_id
            );

            const startMonth = moment(
              updateInvoiceData.invoicing_batch.start_date.toString()
            ).format('MMM');
            const endMonth = moment(
              updateInvoiceData.invoicing_batch.end_date.toString()
            ).format('MMM');

            let subjectDate = '';

            if (startMonth === endMonth) {
              subjectDate = moment(
                updateInvoiceData.invoicing_batch.start_date.toString()
              ).format('MMMM YYYY');
            } else {
              subjectDate =
                moment(
                  updateInvoiceData.invoicing_batch.start_date.toString()
                ).format('MMM') +
                '/' +
                moment(
                  updateInvoiceData.invoicing_batch.end_date.toString()
                ).format('MMM YYYY');
            }

            await this.emailService.UpdateInvoiceService({
              tutorName: updateTutorName,
              email: UpdateTutorEmail,
              invoiceId: String(id).padStart(10, '0'),
              invoiceType:
                updateInvoiceData.invoicing_batch.tutoring_country +
                ' ' +
                'Session Delivery',
              invoicePeriod:
                moment(
                  '' + updateInvoiceData.invoicing_batch.start_date
                ).format('DD.MM.YYYY') +
                ' - ' +
                moment('' + updateInvoiceData.invoicing_batch.end_date).format(
                  'DD.MM.YYYY'
                ),
              subjectDate: subjectDate,
              tutorId: tutorId,
              supervisorBcc: [
                'ba@thirdspaceglobal.com',
                'omtinvoice@thirdspaceglobal.com'
              ]
            });
          }
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 60000 // default: 5000
        }
      );
      // END - Transaction for updating the invoices

      return await this.getInvoicedetails(id);
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  async cancelInvoice(data: CancelInvoicesDTO, user: any) {
    try {
      const invoice = await this.prisma.gOAInvoice.findFirst({
        where: {
          id: data.invoice_ids[0]
        },
        select: {
          batch_id: true
        }
      });

      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        if (!data.cancel_all) {
          // Update sent invoices
          for (const invoice of data.invoice_ids) {
            await tx.gOAInvoice.update({
              where: {
                id: invoice
              },
              data: {
                status: 3, // status 3 = cancel
                updated_by: user.user.tsp_id,
                comment: data.reason
              }
            });
          }
        } else {
          // Udpate all the invoices as canceled except sent ones
          await tx.gOAInvoice.updateMany({
            where: {
              invoicing_batch: {
                id: invoice.batch_id
              },
              status: 0
            },
            data: {
              status: 3, // status 3 = cancel
              updated_by: user.user.tsp_id,
              comment: data.reason
            }
          });
        }
        // Check if remaining invoice in draft
        const draftCount = await tx.gOAInvoice.count({
          where: {
            invoicing_batch: {
              id: invoice.batch_id
            },
            status: 0
          }
        });

        // Check if remaining invoice left in sent
        const stagedCount = await tx.gOAInvoice.count({
          where: {
            invoicing_batch: {
              id: invoice.batch_id
            },
            status: 1
          }
        });
        // Check if remaining invoice left in completed
        const completedCount = await tx.gOAInvoice.count({
          where: {
            invoicing_batch: {
              id: invoice.batch_id
            },
            status: 2
          }
        });

        // Update batch status if there is no draft invoice left
        if (draftCount === 0) {
          await tx.gOAInvoicingBatch.update({
            where: {
              id: invoice.batch_id
            },
            data: {
              status: stagedCount > 0 ? 1 : completedCount > 0 ? 2 : 3
            }
          });
        }
      });
      return { success: true, message: 'Successfully Abandoned' };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }

  async mainDataRequiredForInvoiceGeneration(
    country,
    tutoring_country,
    dateFrom,
    dateTo,
    tier_type,
    counties
  ) {
    const slotsData = this.prisma.gOASlot.findMany({
      select: {
        id: true,
        time_range_id: true,
        date: {
          select: {
            date: true,
            id: true
          }
        },
        time_range: true
      }
    });

    let effective_date = {};
    // Specify the target date
    const date2 = moment('2024-09-01 00:00:00');
    const date1 = moment(dateFrom);

    // Compare the dateFrom with the 2024-09-01 00:00:00 date - this will excecute old logic
    if (await this.compareDateIsDateBefor(date1, date2)) {
      effective_date = {
        lte: dateFrom
      };
    } else {
      //this will execute new logic
      const effectiveDateData = this.prisma.gOATutorPaymentRates.findFirst({
        where: {
          effective_date: {
            lte: dateFrom
          }
        },
        orderBy: {
          effective_date: 'desc'
        },
        distinct: ['effective_date'],
        select: {
          effective_date: true
        }
      });
      effective_date = (await effectiveDateData).effective_date;
    }
    console.log('effective_date:' + JSON.stringify(effective_date));
    // Payement rates for tutoring country and tutor country
    const paymentRatesData = this.prisma.gOATutorPaymentRates.findMany({
      where: {
        country: country,
        tutoring_country: tutoring_country,
        effective_date: effective_date,
        tier: {
          tier_code: {
            in: tier_type
          }
        }
      },
      orderBy: {
        effective_date: 'desc'
      },
      distinct: ['rate_code', 'tier_id']
    });

    const calenderData = this.prisma.calendar.findMany({
      where: {
        effective_date: {
          gte: dateFrom,
          lte: dateTo
        },
        country: counties.find((item) => item.code === country)?.calender,
        holidays_type_id: {
          in: [1, 2, 8]
        }
      },
      select: {
        effective_date: true,
        holidays_type_id: true
      }
    });

    const releveventTutorsData = this.userService.getActiveTutorsForTimeFrame(
      dateFrom,
      dateTo
    );

    //

    const [paymentRates, calender, releveventTutors, slots]: any =
      await Promise.all([
        paymentRatesData,
        calenderData,
        releveventTutorsData,
        slotsData
      ]);

    // console.log('releveventTutorsData:' + JSON.stringify(releveventTutors));

    // const excludedIds = [
    //   732, 877, 1141, 1372, 1949, 2553, 2784, 8573, 8582, 8799, 8882, 8638,
    //   106558, 108416, 129986, 132796, 132311, 132277, 135508, 130680, 138736,
    //   137841, 646, 136767, 1193, 137808
    // ];

    // // Filter out the excluded IDs
    // const filteredIds = releveventTutors.filter(
    //   (id) => !excludedIds.includes(id)
    // );

    // console.log('filteredIds:' + JSON.stringify(filteredIds));

    // console.log('paymentRates:' + JSON.stringify(paymentRates));
    // Get the all workable dates
    const workedDates = getDatesExcludingWeekends(dateFrom, dateTo, calender);

    const tutorsWithData =
      await this.userService.getDataOFTutorsForInvoicePeroid(
        releveventTutors as number[],
        counties,
        tier_type,
        dateFrom,
        dateTo,
        country
      );

    console.log('tutorsWithData:' + JSON.stringify(tutorsWithData));

    const tutorIdsRequiredAvailability = tutorsWithData.map((t) => t.tsp_id);

    const movementsForTutorsData =
      this.userService.getTutorsMovementForDateRangeByTutorList(
        dateFrom,
        dateTo,
        tutorIdsRequiredAvailability
      );

    const tutorsLaunchedSessionsData = this.prisma.gOALaunchedSessions.findMany(
      {
        where: {
          tsp_id: {
            in: tutorIdsRequiredAvailability
          },
          effective_date: {
            gte: dateFrom,
            lte: dateTo
          }
        },
        distinct: ['effective_date', 'slot_id', 'tsp_id'],
        orderBy: {
          id: 'desc'
        }
      }
    );

    const sessionsSwapData = this.prisma.gOASessionsSwaps.findMany({
      where: {
        old_tutor_tsp_id: {
          in: tutorIdsRequiredAvailability
        },
        effective_date: {
          gte: dateFrom,
          lte: dateTo
        }
      }
    });

    const availabilityOfTutorsForEachDateData =
      this.getTutorAvailabilityForWorkingDates(
        workedDates.weeks,
        tutorIdsRequiredAvailability
      );

    const [
      availabilityOfTutorsForEachDate,
      movementsForTutors,
      tutorsLaunchedSessions,
      sessionsSwap
    ] = await Promise.all([
      availabilityOfTutorsForEachDateData,
      movementsForTutorsData,
      tutorsLaunchedSessionsData,
      sessionsSwapData
    ]);

    const sessionIds = tutorsLaunchedSessions.map((s) => s.id);

    const tutorsUpfrData = this.prisma.simsMaster.findMany({
      where: {
        sessionId: {
          in: sessionIds
        },
        concernCategoryMeta: {
          category: 'CONCERN_CATEGORY',
          value: 'UPFR',
          status: '1'
        },
        tutorErrorMeta: {
          category: 'TUTOR_ERROR',
          value: 'Yes',
          status: '1'
        },
        validityOfThecaseMeta: {
          category: 'VALIDITY_OF_THE_CASE',
          value: 'Valid',
          status: '1'
        }
      }
    });

    const tutorsLateLaunchesData = this.prisma.simsMaster.findMany({
      where: {
        sessionId: {
          in: sessionIds
        },
        concernCategoryMeta: {
          category: 'CONCERN_CATEGORY',
          value: 'Late launch',
          status: '1'
        },
        tutorErrorMeta: {
          category: 'TUTOR_ERROR',
          value: 'Yes',
          status: '1'
        },
        validityOfThecaseMeta: {
          category: 'VALIDITY_OF_THE_CASE',
          value: 'Valid',
          status: '1'
        }
      }
    });

    const [tutorsUpfr, tutorsLateLaunches] = await Promise.all([
      tutorsUpfrData,
      tutorsLateLaunchesData
    ]);

    return {
      paymentRates,
      workedDates,
      tutorsWithData,
      movementsForTutors,
      tutorsLaunchedSessions,
      availabilityOfTutorsForEachDate,
      slots,
      sessionsSwap,
      tutorsUpfr,
      tutorsLateLaunches
    };
  }

  async getTutorAvailabilityForWorkingDates(workingWeeks, tutors) {
    const output = [];
    // START - Get availability for the all tutors which are passed for each week thats required
    for (const week of workingWeeks) {
      const weekEndDate = moment(week.end).utc(true).toISOString();

      const activeSlotsForWeek =
        await this.slotsService.getActiveSlotsForEffectiveDate(weekEndDate);

      const availabilibityCount = await this.prisma.gOATutorsSlots.findMany({
        where: {
          effective_date: {
            lte: weekEndDate
          },
          tsp_id: {
            in: tutors
          }
        },
        select: {
          tsp_id: true,
          id: true,
          GOATutorSlotsDetails: {
            where: {
              slot_id: {
                in: activeSlotsForWeek.map((slot) => slot.slotId)
              },
              effective_date: {
                lte: weekEndDate
              }
            },
            orderBy: [
              {
                id: 'desc'
              }
            ],
            distinct: ['slot_id'],
            include: {
              slot: {
                select: {
                  time_range_id: true
                }
              }
            }
          }
        }
      });

      output.push({
        startDate: week.start,
        endDate: week.end,
        availabilibityCount
      });
    }
    // END - Get availability for the all tutors which are passed for each week thats required

    return output;
  }

  async calculateInvoiceAmoutsForTutors(
    tutorsWithData,
    movementsForTutors,
    paymentRates,
    tutorsLaunchedSessions,
    availabilityOfTutors,
    workingDates,
    slots,
    sessionsSwap,
    tutorsUpfr,
    tutorsLateLaunches,
    dateFrom,
    dateTo
  ) {
    const calculatedValues = [];
    // concernCategory  - Staging
    // 1440 - Critical launch
    // 1441 - Failure to launch
    // 1447 - Two Fold Slot Disruption - 6th instance onwards
    // 1448 - Three Fold Slot Disruption
    // 1460 - Availability Decrease
    //concernCategory  - Production
    // 28 - Critical launch
    // 29 - Failure to launch
    // 36 - Two Fold Slot Disruption - 6th instance onwards
    // 37 - Three Fold Slot Disruption
    // 49 - Availability Decrease
    const response1 = await this.prisma.simsMaster.findMany({
      where: {
        concernCategory: {
          in: [28, 29, 36, 37, 49]
        },
        incidentDate: {
          gte: dateFrom,
          lte: dateTo
        },
        ticketStatus: 114, // close
        tutorError: 117 // Yes
      },
      select: {
        tutorTspId: true
      }
    });

    const excludedIds = response1.map((item) => item.tutorTspId);

    console.log('excludedIds:' + JSON.stringify(excludedIds));

    // START - Calculate invoices for each tutor
    for (const tutor of tutorsWithData) {
      const tspId = tutor.tsp_id;
      const tutorTier = tutor.user.GOATutorTier[0].tier_id;

      // Get required movements during the time period
      const movementsForTutor = movementsForTutors.filter(
        (move) => move.tutorTspId == tspId
      );

      // Get required calculation parameters to that tutor
      const calculateParameters = paymentRates.filter(
        (val) => val.tier_id === 4 //tutorTier
      );
      console.log('tutorTier: ' + tutorTier);
      console.log('calculateParameters: ' + calculateParameters);
      // Get lauched sessions to that tutor
      const tutorLaunchedSessions = tutorsLaunchedSessions.filter(
        (tls) => tls.tsp_id === tspId
      );

      // Get session swap details to that tutor
      const tutorsSessionsSwaps = sessionsSwap.filter(
        (swap) => swap.old_tutor_tsp_id === tspId
      );

      // Get UPFR details to that tutor
      const tutorUPFR = tutorsUpfr.filter((swap) => swap.tutorTspId === tspId);

      // Get late lauches details to that tutor
      const tutorLateLaunches = tutorsLateLaunches.filter(
        (swap) => swap.tutorTspId === tspId
      );

      // Initial calculate values to tutor
      let availability = 0;
      let saturation = 0;
      let availabilibityCountAfternoon = 0;
      let availabilibityCountEvening = 0;
      let availabilibityCountMidnight = 0;

      // Check the eligibility of tutor to recive incentive to that invoice
      // const incentives = eligibilityForIncentives(
      //   tutorsSessionsSwaps,
      //   tutorUPFR,
      //   tutorLateLaunches
      // );

      // Get the secondary count for the tutor
      const secondary = tutorLaunchedSessions.filter(
        (session) => session.slot_status_id === 2
      ).length;

      // START - Calculate availability for each working day
      for (const date of workingDates) {
        //check tutor is eligible
        if (checkInvoiceCalculationEligibility(movementsForTutor, date.date)) {
          const theDate = new Date(date.date);
          // let availabilibityCount = 0;
          //Get availabilibity for requred date
          const availabilitiesForTheDay = getAvailabilityForTimeFrame(
            availabilityOfTutors,
            tspId,
            date,
            slots
          );
          // console.log(
          //   'availabilitiesForTheDay:' + JSON.stringify(availabilitiesForTheDay)
          // );
          // Launched sessions for the day
          const lauchedSessionsForDay = tutorLaunchedSessions.filter(
            (session) =>
              new Date(session.effective_date).toISOString() ===
              theDate.toISOString()
          );

          // Date preparation
          // const date2 = moment('2024-09-01 00:00:00');
          // const date1 = moment(dateFrom);

          // Compare the dateFrom with the 2024-09-01 00:00:00 date - this will excecute old logic
          // if (await this.compareDateIsDateBefor(date1, date2)) {
          //   //Count the given availabilibity
          //   for (const available of availabilitiesForTheDay) {
          //     if ([1, 2, 3, 4].includes(available.slot_status_id)) {
          //       availabilibityCount += 1;
          //     }
          //   }
          // } else {
          //this will execute new logic
          for (const available of availabilitiesForTheDay) {
            if ([1, 2, 3, 4].includes(available.slot_status_id)) {
              if ([1, 2, 3, 4].includes(available.slot.time_range_id)) {
                availabilibityCountAfternoon += 1;
              } else if ([5, 6, 7, 8].includes(available.slot.time_range_id)) {
                availabilibityCountEvening += 1;
              } else {
                availabilibityCountMidnight += 1;
              }
            }
            // availabilibityCount += 1;
          }
          // }

          // //Count the given availabilibity
          // for (const available of availabilitiesForTheDay) {
          //   if ([1, 2, 3, 4].includes(available.slot_status_id)) {
          //     //change here
          //     availabilibityCount += 1;
          //   }
          // }

          // If the day is saturation and tutor has launched sessions to the day then saturation is counted
          date.satutaryDay && lauchedSessionsForDay.length > 0
            ? (saturation += lauchedSessionsForDay.length)
            : saturation;

          // Add the availability to the day
          //availability += availabilibityCount;
        }
      }
      // END - Calculate availability for each working day

      // console.log('calculateParameters:' + JSON.stringify(calculateParameters));

      // START - Multiplication of the per amount with values
      let availabilityCalculated = 0;
      let availabilityCalculatedAfternoon = 0;
      let availabilityCalculatedEvening = 0;
      let availabilityCalculatedMidnight = 0;
      let availabilityArr = [];
      // Date preparation
      const date2 = moment('2024-09-01 00:00:00');
      const date1 = moment(dateFrom);

      // Compare the dateFrom with the 2024-09-01 00:00:00 date - this will excecute old logic
      // if (await this.compareDateIsDateBefor(date1, date2)) {
      //   availabilityCalculated =
      //     calculateParameters.find((p) => p.rate_code === 'AVL').amount *
      //     availability;

      //   availabilityArr = [
      //     {
      //       count: availability,
      //       amount: availabilityCalculated,
      //       rateId: calculateParameters.find((p) => p.rate_code === 'AVL').id
      //     }
      //   ];
      // } else  if (tutorTier === 4) {

      if (true) {
        availabilityCalculatedAfternoon =
          calculateParameters.find((p) => p.rate_code === 'AVL_AFT').amount *
          availabilibityCountAfternoon;

        availabilityCalculatedEvening =
          calculateParameters.find((p) => p.rate_code === 'AVL_EVE').amount *
          availabilibityCountEvening;

        availabilityArr = [
          {
            count: availabilibityCountAfternoon,
            amount: availabilityCalculatedAfternoon,
            rateId: calculateParameters.find((p) => p.rate_code === 'AVL_AFT')
              .id
          },
          {
            count: availabilibityCountEvening,
            amount: availabilityCalculatedEvening,
            rateId: calculateParameters.find((p) => p.rate_code === 'AVL_EVE')
              .id
          },
          {
            count: availabilibityCountMidnight,
            amount: availabilityCalculatedMidnight,
            rateId: calculateParameters.find((p) => p.rate_code === 'AVL_MID')
              .id
          }
        ];

        availabilityCalculated =
          availabilityCalculatedAfternoon + availabilityCalculatedEvening;
      }

      const launchedSessionCalculated =
        calculateParameters.find((p) => p.rate_code === 'SES_DE').amount *
        tutorLaunchedSessions.length;

      const statutaryCalculated =
        calculateParameters.find((p) => p.rate_code === 'STAT_ALW').amount *
        saturation;

      const secondaryCalculated =
        calculateParameters.find((p) => p.rate_code === 'SES_AD_SEC').amount *
        secondary;

      //Checking validation for insentives
      const incentiveParams = calculateParameters.find(
        (p) => p.rate_code === 'INC_PAY'
      );

      availability =
        availabilibityCountAfternoon +
        availabilibityCountEvening +
        availabilibityCountMidnight;

      // const incentivesCalculated =
      //   incentiveParams && incentives
      //     ? incentiveParams.amount * availability
      //     : 0;

      // const incentivesCalculated = incentiveParams
      //   ? incentiveParams.amount * availability
      //   : 0;

      // const excludedIds = [
      //   732, 877, 1141, 1372, 1949, 2553, 2784, 8573, 8582, 8799, 8882, 8638,
      //   106558, 108416, 129986, 132796, 132311, 132277, 135508, 130680, 138736,
      //   137841, 646, 136767, 1193, 137808
      // ];

      // Check if id exists in the array
      const idExists = excludedIds.includes(tspId);

      const incentivesCalculated = idExists
        ? 0
        : incentiveParams
        ? incentiveParams.amount * tutorLaunchedSessions.length
        : 0;

      // END - Multiplication of the per amount with values

      const commonData = {
        tsp_id: tspId,
        tierId: tutorTier,
        totalAmount:
          availabilityCalculated +
          launchedSessionCalculated +
          statutaryCalculated +
          secondaryCalculated +
          incentivesCalculated,
        availability: availabilityArr,
        launchedSessions: {
          count: tutorLaunchedSessions.length,
          amount: launchedSessionCalculated,
          rateId: calculateParameters.find((p) => p.rate_code === 'SES_DE').id
        },
        saturation: {
          count: saturation,
          amount: statutaryCalculated,
          rateId: calculateParameters.find((p) => p.rate_code === 'STAT_ALW').id
        },
        secondary: {
          count: secondary,
          amount: secondaryCalculated,
          rateId: calculateParameters.find((p) => p.rate_code === 'SES_AD_SEC')
            .id
        }
      };

      // If tutor is in tier 2 then add insentives
      // if (tutorTier === 2 || tutorTier === 4) {
      if (true) {
        calculatedValues.push({
          ...commonData,
          incentives: {
            // count: incentiveParams && incentives ? availability : 0,
            // count: incentiveParams && availability,
            count: idExists
              ? 0
              : incentiveParams && tutorLaunchedSessions.length,
            amount: incentivesCalculated,
            rateId: incentiveParams.id
          }
        });
      } else {
        calculatedValues.push(commonData);
      }
    }
    // END - Calculate invoices for each tutor

    return calculatedValues;
  }

  async compareDateIsDateBefor(date1, date2) {
    return date1.isBefore(date2);
  }
}
