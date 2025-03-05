import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/service/user.service';
import { InvoiceDetails, InvoiceListDto } from '../dtos/invoice.dto';
import {
  PAYMENT_RATE_ORDER,
  PAYMENT_RATE_ORDER_NEW,
  compareDateIsDateBefor
} from '../../util';

@Injectable()
export class InvoiceService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  // get invoices
  async getInvoices(dto: InvoiceListDto, user: any) {
    const { skip, take, invoice_Id, invoice_type, date, tire_status } = dto;

    try {
      return this.prisma.$transaction(async (tx) => {
        const whereClause = {
          AND: [
            {
              tsp_id: user.user.tsp_id,
              status: { in: [1, 2] }
            },
            date?.startDate && date?.endDate
              ? {
                  invoicing_batch: {
                    start_date: {
                      gte: moment(date.startDate).format(),
                      lte: moment(date.endDate).format()
                    }
                  }
                }
              : undefined,
            invoice_type !== 'All'
              ? {
                  invoicing_batch: {
                    tutoring_country: { contains: invoice_type }
                  }
                }
              : undefined,

            invoice_Id.length > 0
              ? {
                  id: {
                    in: [...invoice_Id]
                  }
                }
              : undefined,

            tire_status !== 0
              ? {
                  tiers: {
                    id: {
                      in: tire_status === 1 ? [1, 3] : tire_status
                    }
                  }
                }
              : undefined
          ].filter(Boolean)
        };

        const count = await tx.gOAInvoice.count({
          where: whereClause
        });

        // get there country
        const data = await tx.gOAInvoice.findMany({
          where: whereClause,
          skip: skip,
          take: take,
          select: {
            id: true,
            batch_id: true,
            total_amount: true,
            tsp_id: true,
            status: true,
            updated: true,
            updated_at: true,
            tiers: { select: { id: true, discription: true } },
            invoicing_batch: {
              select: {
                tutoring_country: true,
                country: true,
                start_date: true,
                end_date: true,
                invoice_batch_tiers: true
              }
            }
          },
          orderBy: [
            {
              invoicing_batch: {
                created_at: 'desc'
              }
            }
          ]
        });

        const result = data.map((value, index) => {
          return {
            id: index + 1,
            invoiceID: value.id,
            invoicePeriod: `${moment(
              '' + value.invoicing_batch.start_date
            ).format('Do MMM YYYY')} - ${moment(
              '' + value.invoicing_batch.end_date
            ).format('Do MMM YYYY')}`,
            sendDate: `Sent on ${moment('' + value.updated_at).format(
              'DD.MM.YYYY'
            )} `,
            sessionCountry: value.invoicing_batch.tutoring_country,
            tier: value.tiers.id === 3 ? 'Tier 1' : value.tiers.discription,
            total: `${
              value.invoicing_batch.country === 'SL' ? 'LKR' : 'INR'
            } ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: value.invoicing_batch.country === 'SL' ? 'LKR' : 'INR'
            })
              .format(value.total_amount)
              .replace(/[^\d.,]/g, '')}`
          };
        });

        return { success: true, count: count, data: result };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // get invoice details
  async getInvoicedetails(dto: InvoiceDetails) {
    try {
      return this.prisma.$transaction(async (tx) => {
        const invoiceDetails = await tx.gOAInvoice.findUnique({
          where: {
            id: dto.invoice_id
          },
          select: {
            tsp_id: true,
            id: true,
            batch_id: true,
            total_amount: true,
            updated_at: true,
            updated: true,
            created_at: true,
            due_date: true,
            updated_by: true,
            invoicing_batch: {
              select: {
                start_date: true,
                end_date: true,
                tutoring_country: true,
                country: true
              }
            },
            tiers: { select: { discription: true } },
            invoice_details: {
              select: {
                id: true,
                total_slot_count: true,
                calculated_total_amount: true,
                tutor_payment_rate_id: true,
                tutor_payment_rates: {
                  select: {
                    id: true,
                    rate_code: true,
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

        // Date preparation
        const date2 = moment('2024-09-01 00:00:00');
        const date1 = moment(invoiceDetails.invoicing_batch.start_date);

        let PAYMENT_RATE_ORDER_CURRENT = PAYMENT_RATE_ORDER;
        if (!(await compareDateIsDateBefor(date1, date2))) {
          PAYMENT_RATE_ORDER_CURRENT = PAYMENT_RATE_ORDER_NEW;
        }

        if (invoiceDetails && invoiceDetails.invoice_details) {
          invoiceDetails.invoice_details.sort((a, b) => {
            const rateCodeA = a.tutor_payment_rates.rate_code;
            const rateCodeB = b.tutor_payment_rates.rate_code;
            const indexA = PAYMENT_RATE_ORDER_CURRENT.indexOf(rateCodeA);
            const indexB = PAYMENT_RATE_ORDER_CURRENT.indexOf(rateCodeB);

            return indexA - indexB;
          });
        }

        const userDetails = await await tx.approvedBankData.findUnique({
          where: {
            tspId: invoiceDetails.tsp_id
          },
          select: {
            bAccountNo: true,
            bankName: true,
            bAccountName: true,
            bBranch: true
          }
        });

        const userV3Details = await tx.user.findUnique({
          where: {
            tsp_id: invoiceDetails.updated_by
          },
          select: {
            username: true,
            approved_personal_data: {
              select: {
                fullName: true
              }
            }
          }
        });

        const personalData = await tx.approvedPersonalData.findUnique({
          where: {
            tspId: invoiceDetails.tsp_id
          },
          select: {
            nameWithInitials: true
          }
        });

        const contactData = await tx.approvedContactData.findUnique({
          where: {
            tspId: invoiceDetails.tsp_id
          },
          select: {
            residingAddressL1: true,
            residingAddressL2: true,
            residingCity: true,
            residingCountry: true,
            workEmail: true
          }
        });

        return {
          details: {
            invoiceDetails,
            userDetails,
            userV3Details,
            personalData,
            contactData
          }
        };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //  Get Invoice ID for filter suggestion
  async getInvoiceID(filter: number, user: any) {
    try {
      const result = await this.prisma
        .$queryRaw`SELECT DISTINCT tsp_id, id FROM goa_invoice WHERE tsp_id=${
        user.user.tsp_id
      } && id 
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
}
