import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import moment from 'moment';
import { EmailService } from '../../email/email.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CompleteAllInvoiceDto,
  CompleteInvoiceDto,
  ExportInvoiceTableDto,
  FiltersDto,
  InvoiceTableDto,
  SendAllInvoiceDto,
  SendInvoiceDto
} from '../dtos/invoice.dto';
import { PAYMENT_RATE_ORDER, getTutorWorkingCountry } from '../../util';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class InvoiceService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
    private userService: UserService
  ) {}

  // Get Side Panel Data - Start __________________________________
  async getInvoicingBatch() {
    try {
      return this.prisma.$transaction(
        async (tx) => {
          // get there country
          const country = [
            { country: 'SL', tutoring_country: 'UK', isActive: true },
            { country: 'IND', tutoring_country: 'UK', isActive: true },
            { country: 'PH', tutoring_country: 'UK', isActive: false },
            { country: 'SL', tutoring_country: 'US', isActive: false },
            { country: 'IND', tutoring_country: 'US', isActive: false },
            { country: 'PH', tutoring_country: 'US', isActive: false }
          ];

          const invoiceStatus = {};

          await Promise.all(
            country.map(async (d) => {
              const latestData = await tx.gOAInvoicingBatch.findFirst({
                where: {
                  country: d.country,
                  tutoring_country: d.tutoring_country
                },
                orderBy: {
                  created_at: 'desc'
                },
                select: {
                  status: true,
                  invoice: true,
                  id: true
                }
              });

              let count = 0;
              if (latestData !== null) {
                count = await tx.gOAInvoice.count({
                  where: {
                    batch_id: latestData.id,
                    status: latestData.status
                  }
                });
                // Rest of your code using the 'count' variable
              }

              const key = d.tutoring_country + '_' + d.country;
              invoiceStatus[key] = {
                state: latestData ? latestData.status : 2,
                value: count,
                batch_Id: latestData ? latestData.id : 0,
                isActive: d.isActive
              };
            })
          );

          invoiceStatus['UK'] = { isActive: true };
          invoiceStatus['US'] = { isActive: false };

          return invoiceStatus;
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000 // default: 5000
        }
      );
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Get Side Panel Data - End __________________________________

  // Get Draft and Send table Data - Start __________________________________
  async getInvoiceTable(dto: InvoiceTableDto) {
    const {
      skip,
      take,
      invoicing_batch_Id,
      tutor_id,
      invoice_Id,
      tutor_name,
      business_unit,
      invoice_status,
      tire_status,
      edited_status,
      maxEarning,
      minEarning
    } = dto;

    try {
      return this.prisma.$transaction(
        async (tx) => {
          const tutor_tsp_id = await tx.tmApprovedStatus
            .findMany({
              where: {
                tutorLine: business_unit
                  ? {
                      in:
                        business_unit == 'Common'
                          ? 'Primary and Secondary'
                          : business_unit
                    }
                  : {}
              },
              select: {
                tutorTspId: true
              }
            })
            .then((results) => results.map((r) => r.tutorTspId));

          const whereClause = {
            AND: [
              {
                batch_id: Number(invoicing_batch_Id) // pass id
              },

              tutor_name.length > 0 || tutor_id.length > 0
                ? {
                    tsp_id: {
                      in: [...tutor_name, ...tutor_id]
                    }
                  }
                : undefined,

              invoice_status.length > 0
                ? {
                    status: {
                      in: [...invoice_status]
                    }
                  }
                : undefined,
              edited_status.length > 0
                ? {
                    updated: {
                      in: [...edited_status]
                    }
                  }
                : undefined,

              business_unit.length > 0
                ? { tsp_id: { in: tutor_tsp_id } }
                : undefined,

              invoice_Id.length > 0
                ? {
                    id: {
                      in: [...invoice_Id]
                    }
                  }
                : undefined,

              tire_status.length > 0
                ? {
                    tiers: {
                      id: {
                        in: tire_status.map(Number)
                      }
                    }
                  }
                : undefined,

              {
                total_amount: {
                  gte: minEarning,
                  lte: maxEarning
                }
              }
            ].filter(Boolean)
          };

          // Get the Start date
          const basicData = await tx.gOAInvoice.findMany({
            where: {
              batch_id: Number(invoicing_batch_Id) // pass id
            },
            select: {
              status: true,
              batch_id: true,
              tiers: { select: { discription: true } },
              invoicing_batch: {
                select: {
                  country: true,
                  start_date: true,
                  end_date: true,
                  invoice_batch_tiers: true
                }
              }
            }
          });

          // get max total

          const maxTotalAmount = await tx.gOAInvoice.aggregate({
            where: {
              batch_id: Number(invoicing_batch_Id) // pass id
            },
            _max: { total_amount: true }
          });

          // get there country
          const data = await tx.gOAInvoice.findMany({
            where: whereClause,
            select: {
              id: true,
              batch_id: true,
              total_amount: true,
              tsp_id: true,
              status: true,
              updated: true,
              tiers: { select: { discription: true } },
              invoicing_batch: {
                select: {
                  country: true,
                  start_date: true,
                  end_date: true,
                  invoice_batch_tiers: true
                }
              }
            }
          });
          const tslUser = await tx.tslUser.findMany({
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

          const tmApprovedStatus = await tx.tmApprovedStatus.findMany({
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
              supervisorName: true,
              center: true
            }
          });

          const mergedList = await Promise.all(
            data.map((t1) => ({
              ...t1,
              ...tslUser.find((t2) => Number(t2.tsp_id) === t1.tsp_id),
              ...tmApprovedStatus.find(
                (t3) => Number(t3.tutorTspId) === t1.tsp_id
              ),
              ...approvedContactData.find((t4) => t4.tspId === t1.tsp_id)
            }))
          );

          const Draft = [];
          const Send = [];
          let DraftTotal = 0;
          let SendTotal = 0;
          await Promise.all(
            mergedList.map(async (d, index) => {
              const tutorStatus =
                await this.userService.getTutorStatusForSpecificDate(
                  d.tsp_id,
                  d.invoicing_batch.end_date
                );

              const country = d.center ? getTutorWorkingCountry(d.center) : '';

              if (d.status === 0) {
                DraftTotal = DraftTotal + d.total_amount;
                Draft.push({
                  id: index + 1,
                  invoiceId: d.id,
                  supervisorName: d.supervisorName,
                  country: country,
                  tutorEmail: d.workEmail,
                  tutor_tsp_id: d.tsp_id,
                  Tier: d.tiers?.discription, // need add their
                  tutor_type: d.tutorLine ? d.tutorLine : 'Trainee',
                  tutor_name: d.tsl_full_name,
                  tutor_id: Number(d.tsl_id),
                  effective_date: `${moment(
                    d.invoicing_batch.start_date + ''
                  ).format('DD MMM YYYY')} - ${moment(
                    d.invoicing_batch.end_date + ''
                  ).format('DD MMM YYYY')}`,
                  tutor_status: tutorStatus,
                  invoiceDetails: String(d.id).padStart(10, '0'),
                  totalEarnings: d.total_amount,
                  updated: d.updated
                });
              } else if (d.status === 1) {
                SendTotal = SendTotal + d.total_amount;
                Send.push({
                  id: index + 1,
                  invoiceId: d.id,
                  supervisorName: d.supervisorName,
                  country: country,
                  tutor_tsp_id: d.tsp_id,
                  tutorEmail: d.workEmail,
                  Tier: d.tiers?.discription, // need add their
                  tutor_type: d.tutorLine ? d.tutorLine : 'Trainee',
                  tutor_name: d.tsl_full_name,
                  tutor_id: Number(d.tsl_id),
                  effective_date: `${moment(
                    d.invoicing_batch.start_date + ''
                  ).format('DD MMM YYYY')} - ${moment(
                    d.invoicing_batch.end_date + ''
                  ).format('DD MMM YYYY')}`,
                  tutor_status: tutorStatus,
                  invoiceDetails: String(d.id).padStart(10, '0'),
                  totalEarnings: d.total_amount,
                  updated: d.updated
                });
              }
            })
          );

          let DraftLength = 0;
          let SendLength = 0;

          await Promise.all([
            (DraftLength = basicData.reduce((count, invoice) => {
              if (invoice.status === 0) {
                return count + 1;
              }
              return count;
            }, 0)),
            (SendLength = basicData.reduce((count, invoice) => {
              if (invoice.status === 1) {
                return count + 1;
              }
              return count;
            }, 0))
          ]);

          const sortedDraft = Draft.sort((a, b) => b.id - a.id);

          const sortedSend = Send.sort((a, b) => b.id - a.id);

          return {
            success: true,
            DraftTotal: DraftTotal,
            SendTotal: SendTotal,
            start_date: basicData[0]?.invoicing_batch.start_date,
            end_date: basicData[0]?.invoicing_batch.end_date,
            DraftTable: sortedDraft.slice(skip, +take + +skip),
            DraftCount: Draft.length,
            SendTable: sortedSend.slice(skip, +take + +skip),
            SendCount: Send.length,
            DraftSize: DraftLength,
            SendSize: SendLength,
            MaxTotalAmount: maxTotalAmount._max.total_amount
          };
        },
        {
          maxWait: 50000, // default: 2000
          timeout: 100000 // default: 5000
        }
      );
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Get Draft and Send table Data - End __________________________________

  // Send Invoice - Start __________________________________
  async sendInvoice(dto: SendInvoiceDto, user: User) {
    try {
      await Promise.all(
        dto.send_invoice_details.map(async (e) => {
          const send = await this.prisma.gOAInvoice.update({
            where: {
              id: e.invoiceId
            },
            data: {
              status: 1,
              updated_at: new Date().toISOString(),
              updated_by: user.tsp_id
            },
            select: {
              batch_id: true
            }
          });

          const invoices = await this.prisma.gOAInvoice.findMany({
            where: {
              batch_id: { equals: send.batch_id },
              status: 0
            }
          });

          if (invoices.length === 0) {
            await this.prisma.gOAInvoicingBatch.update({
              where: { id: send.batch_id },
              data: { status: 1 }
            });
          }
          //send invoice
          const invoiceData = await this.prisma.gOAInvoice.findUnique({
            where: {
              id: e.invoiceId
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

          const tutorName = await this.emailService.getTutorName(
            invoiceData.tsp_id
          );
          const tutorEmail = await this.emailService.getTutorEmail(
            invoiceData.tsp_id
          );
          const tutorId = await this.emailService.getTutorId(
            invoiceData.tsp_id
          );

          const startMonth = moment(
            invoiceData.invoicing_batch.start_date.toString()
          ).format('MMM');
          const endMonth = moment(
            invoiceData.invoicing_batch.end_date.toString()
          ).format('MMM');

          let subjectDate = '';

          if (startMonth === endMonth) {
            subjectDate = moment(
              invoiceData.invoicing_batch.start_date.toString()
            ).format('MMMM YYYY');
          } else {
            subjectDate =
              moment(invoiceData.invoicing_batch.start_date.toString()).format(
                'MMM'
              ) +
              '/' +
              moment(invoiceData.invoicing_batch.end_date.toString()).format(
                'MMM YYYY'
              );
          }

          const adminEmail = process.env.ADMIN_EMAIL;
          await this.emailService.SendInvoiceService({
            tutorName: tutorName,
            email: tutorEmail,
            // date: string;
            invoiceId: String(e.invoiceId).padStart(10, '0'),
            invoiceType:
              invoiceData.invoicing_batch.tutoring_country +
              ' ' +
              'Session Delivery',
            invoicePeriod:
              moment('' + invoiceData.invoicing_batch.start_date).format(
                'DD.MM.YYYY'
              ) +
              ' - ' +
              moment('' + invoiceData.invoicing_batch.end_date).format(
                'DD.MM.YYYY'
              ),
            subjectDate: subjectDate,
            tutorId: tutorId,
            supervisorBcc: [
              'ba@thirdspaceglobal.com',
              'omtinvoice@thirdspaceglobal.com'
            ]
          });
        })
      );
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  // Send Invoice - End __________________________________

  // Send All Invoice  - Start __________________________________
  async sendAllInvoice(dto: SendAllInvoiceDto, user: User) {
    try {
      await Promise.all([
        this.prisma.gOAInvoice.updateMany({
          where: {
            batch_id: dto.invoice_batch_id,
            status: 0
          },
          data: {
            status: 1,
            updated_at: new Date().toISOString(),
            updated_by: user.tsp_id
          }
        }),

        this.prisma.gOAInvoicingBatch.update({
          where: { id: dto.invoice_batch_id },
          data: { status: 1 }
        }),
        await this.prisma.$transaction(async (tx) => {
          const invoiceData = await tx.gOAInvoice.findMany({
            where: {
              batch_id: dto.invoice_batch_id,
              status: 0
            },
            select: {
              id: true,
              tsp_id: true,
              invoicing_batch: {
                select: {
                  start_date: true,
                  end_date: true,
                  tutoring_country: true
                }
              }
            }
          });

          invoiceData.map(async (value) => {
            const tutorName = await this.emailService.getTutorName(
              value.tsp_id
            );
            const tutorEmail = await this.emailService.getTutorEmail(
              value.tsp_id
            );
            const tutorId = await this.emailService.getTutorId(value.tsp_id);
            const startMonth = moment(
              value.invoicing_batch.start_date.toString()
            ).format('MMM');
            const endMonth = moment(
              value.invoicing_batch.end_date.toString()
            ).format('MMM');

            let subjectDate = '';

            if (startMonth === endMonth) {
              subjectDate = moment(
                value.invoicing_batch.start_date.toString()
              ).format('MMMM YYYY');
            } else {
              subjectDate =
                moment(value.invoicing_batch.start_date.toString()).format(
                  'MMM'
                ) +
                '/' +
                moment(value.invoicing_batch.end_date.toString()).format(
                  'MMM YYYY'
                );
            }

            const adminEmail = process.env.ADMIN_EMAIL;
            await this.emailService.SendInvoiceService({
              tutorName: tutorName,
              email: tutorEmail,
              // date: string;
              invoiceId: String(value.id).padStart(10, '0'),
              invoiceType:
                value.invoicing_batch.tutoring_country +
                ' ' +
                ' Session Delivery',
              invoicePeriod:
                moment('' + value.invoicing_batch.start_date).format(
                  'DD.MM.YYYY'
                ) +
                ' - ' +
                moment('' + value.invoicing_batch.end_date).format(
                  'DD.MM.YYYY'
                ),
              subjectDate: subjectDate,
              tutorId: tutorId,
              supervisorBcc: [
                'ba@thirdspaceglobal.com',
                'omtinvoice@thirdspaceglobal.com'
              ]
            });
          });
        })
      ]);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Send All Invoice  - End __________________________________

  //  Complete  Invoice - Start __________________________________
  async CompleteInvoice(dto: CompleteInvoiceDto, user: User) {
    try {
      await Promise.all(
        dto.complete_invoice_details.map(async (e) => {
          const send = await this.prisma.gOAInvoice.update({
            where: {
              id: e.invoiceId
            },
            data: {
              status: 2,
              updated_by: user.tsp_id
            },
            select: {
              batch_id: true
            }
          });

          const invoices = await this.prisma.gOAInvoice.findMany({
            where: {
              batch_id: { equals: send.batch_id },
              status: { in: [0, 1] }
            }
          });

          if (invoices.length === 0) {
            await this.prisma.gOAInvoicingBatch.update({
              where: { id: send.batch_id },
              data: { status: 2 }
            });
          }
        })
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //  Complete  Invoice - End __________________________________

  // Complete  All  Invoice - Start __________________________________
  async completeAllInvoice(dto: CompleteAllInvoiceDto, user: User) {
    try {
      await Promise.all([
        this.prisma.gOAInvoice.updateMany({
          where: {
            batch_id: dto.invoice_batch_id,
            status: 1
          },
          data: {
            status: 2,
            updated_by: user.tsp_id
          }
        })
      ]);

      const invoices = await this.prisma.gOAInvoice.findMany({
        where: {
          batch_id: dto.invoice_batch_id,
          status: { in: [0, 1] }
        }
      });

      if (invoices.length === 0) {
        await this.prisma.gOAInvoicingBatch.update({
          where: { id: dto.invoice_batch_id },
          data: { status: 2 }
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Complete  All  Invoice - End __________________________________

  // Complete Table Data load  - Start __________________________________
  async getCompleteInvoice(dto: FiltersDto) {
    try {
      const {
        skip,
        take,
        tutor_id,
        invoice_Id,
        tutor_name,
        business_unit,
        invoice_status,
        tire_status,
        edited_status,
        country,
        tutoring_country,
        date,
        maxEarning,
        minEarning
      } = dto;

      return this.prisma.$transaction(async (tx) => {
        const tutor_tsp_id = await tx.tmApprovedStatus
          .findMany({
            where: {
              tutorLine: business_unit
                ? {
                    in:
                      business_unit == 'Common'
                        ? 'Primary and Secondary'
                        : business_unit
                  }
                : {}
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
                in: [2, 3]
              }
            },

            {
              invoicing_batch: {
                country: { contains: country },
                tutoring_country: { contains: tutoring_country },
                start_date: { gte: new Date(date[0].datefrom).toISOString() },
                end_date: { lte: new Date(date[0].dateto).toISOString() }
              }
            },

            tutor_name.length > 0
              ? {
                  tsp_id: {
                    in: [...tutor_name]
                  }
                }
              : undefined,

            tutor_id.length > 0
              ? {
                  tsp_id: {
                    in: [...tutor_id]
                  }
                }
              : undefined,

            invoice_status.length > 0
              ? {
                  status: {
                    in: [...invoice_status]
                  }
                }
              : undefined,
            edited_status.length > 0
              ? {
                  updated: {
                    in: [...edited_status]
                  }
                }
              : undefined,
            business_unit.length > 0
              ? { tsp_id: { in: tutor_tsp_id } }
              : undefined,

            invoice_Id.length > 0
              ? {
                  id: {
                    in: [...invoice_Id]
                  }
                }
              : undefined,

            tire_status.length > 0
              ? {
                  tiers: {
                    id: {
                      in: tire_status.map(Number)
                    }
                  }
                }
              : undefined,
            {
              total_amount: {
                gte: minEarning,
                lte: maxEarning
              }
            }
          ].filter(Boolean)
        };

        // Get the count
        const count = await tx.gOAInvoice.count({
          where: whereClause
        });

        const maxTotalAmount = await tx.gOAInvoice.aggregate({
          where: {
            AND: [
              {
                status: {
                  in: [2, 3]
                }
              },

              {
                invoicing_batch: {
                  country: { contains: country },
                  tutoring_country: { contains: tutoring_country },
                  start_date: { gte: new Date(date[0].datefrom).toISOString() },
                  end_date: { lte: new Date(date[0].dateto).toISOString() }
                }
              }
            ]
          },
          _max: { total_amount: true }
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
            updated: true,
            status: true,
            updated_at: true,
            comment: true,
            tiers: { select: { discription: true, id: true } },
            invoicing_batch: {
              select: {
                country: true,
                start_date: true,
                end_date: true,
                tutoring_country: true
              }
            }
          }
        });

        const tslUser = await tx.tslUser.findMany({
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

        const tmApprovedStatus = await tx.tmApprovedStatus.findMany({
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
            supervisorName: true,
            center: true
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

        const mergedList = await Promise.all(
          data.map((t1) => ({
            ...t1,
            ...tslUser.find((t2) => Number(t2.tsp_id) === t1.tsp_id),
            ...tmApprovedStatus.find(
              (t3) => Number(t3.tutorTspId) === t1.tsp_id
            ),
            ...approvedContactData.find((t4) => t4.tspId === t1.tsp_id)
          }))
        );

        const Complete = [];
        let Total = 0;

        await Promise.all(
          mergedList.map(async (d, index) => {
            const tutorStatus =
              await this.userService.getTutorStatusForSpecificDate(
                d.tsp_id,
                d.invoicing_batch.end_date
              );

            const center = d.center ? getTutorWorkingCountry(d.center) : '';

            (Total = Total + d.total_amount),
              Complete.push({
                id: index + 1,
                invoiceId: d.id,
                Tier: d.tiers?.discription,
                // need add their
                tutor_type: d.tutorLine ? d.tutorLine : 'Trainee',
                tutor_name: d.tsl_full_name,
                tutor_id: Number(d.tsl_id),
                status: d.status,
                updated_at: d.updated_at,
                updated: d.updated,
                supervisorName: d.supervisorName,
                country: center,
                tutorEmail: d.workEmail,
                tutor_tsp_id: d.tsp_id,
                tutor_status: tutorStatus,
                comment: d.comment,
                effective_date: `${moment(
                  d.invoicing_batch.start_date + ''
                ).format('DD MMM YYYY')} - ${moment(
                  d.invoicing_batch.end_date + ''
                ).format('DD MMM YYYY')}`,
                invoiceDetails: String(d.id).padStart(10, '0'),
                totalEarnings: d.total_amount
              });
          })
        );

        return {
          success: true,
          data: Complete,
          count: count,
          total: Total,
          MaxTotalAmount: maxTotalAmount._max.total_amount
        };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Complete Table Data load  - End __________________________________

  // Search Tutor Name - Start __________________________________
  async getTutorName(params: any) {
    const { country, filter } = params;

    const timeOff = await this.prisma.gOAInvoice.findMany({
      where: {
        invoicing_batch: { country: country }
      },
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
              timeOff.length > 0
                ? {
                    in: timeOff.map((e) => e.tsp_id)
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
  // Search Tutor Name - End __________________________________

  //  Get Tutor ID for filter suggestion - Start ________________________________________
  async getTutorID(params: any) {
    const { filter, country } = params;

    try {
      const result = await this.prisma.$queryRaw`SELECT DISTINCT tsp_id, tsl_id 
          FROM tsl_user 
          WHERE tsp_id IN (
            SELECT tsp_id 
            FROM goa_invoice 
            WHERE batch_id IN (
              SELECT id 
              FROM goa_invoicing_batch 
              WHERE country = ${country}
            )
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
  //  Get Tutor ID for filter suggestion - End ________________________________________

  //  Get Invoice ID for filter suggestion - Start _________________________________________
  async getInvoiceID(filter: number) {
    try {
      const result = await this.prisma
        .$queryRaw`SELECT DISTINCT tsp_id, id FROM goa_invoice WHERE  id 
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
  //  Get Invoice ID for filter suggestion - End _________________________________________

  //To get invoice details - Start _________________________________________________
  async getInvoicedetails(invoiceId: number) {
    try {
      const invoiceDetails = await this.prisma.gOAInvoice.findUnique({
        where: {
          id: invoiceId
        },
        select: {
          tsp_id: true,
          id: true,
          batch_id: true,
          total_amount: true,
          updated_at: true,
          updated_by: true,
          due_date: true,
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

      if (invoiceDetails && invoiceDetails.invoice_details) {
        invoiceDetails.invoice_details.sort((a, b) => {
          const rateCodeA = a.tutor_payment_rates.rate_code;
          const rateCodeB = b.tutor_payment_rates.rate_code;
          const indexA = PAYMENT_RATE_ORDER.indexOf(rateCodeA);
          const indexB = PAYMENT_RATE_ORDER.indexOf(rateCodeB);

          return indexA - indexB;
        });
      }

      const userDetails = await this.prisma.approvedContactData.findUnique({
        where: {
          tspId: invoiceDetails.tsp_id
        },
        select: {
          workEmail: true,
          residingAddressL1: true,
          residingAddressL2: true,
          residingCity: true,
          residingCountry: true,
          residingDistrict: true,
          residingPin: true,
          residingProvince: true
        }
      });

      const invoicePeriod = await this.prisma.gOAInvoicingBatch.findUnique({
        where: {
          id: invoiceDetails.batch_id
        },
        select: {
          start_date: true,
          end_date: true,
          country: true
        }
      });

      const userV3Details = await this.prisma.user.findUnique({
        where: {
          tsp_id: invoiceDetails.updated_by
        },
        select: {
          username: true,
          TslUser: {
            select: {
              tsl_full_name: true
            }
          }
        }
      });

      const userBankDetails = await this.prisma.approvedBankData.findUnique({
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

      return {
        details: {
          invoiceDetails,
          userDetails: {
            personal_email_address: userDetails.workEmail,
            tsl_platform_name: userV3Details.TslUser,
            current_address: userDetails.residingAddressL1,
            current_address_city: userDetails.residingCity,
            permanat_address: userDetails.residingAddressL2,
            permanat_address_district: userDetails.residingDistrict,
            permanent_address_province: userDetails.residingProvince
          },
          invoicePeriod,
          userV3Details: {
            user_name: userV3Details.username,
            name: userV3Details.TslUser
          },
          userBankDetails: {
            b_account_no: userBankDetails.bAccountNo,
            bank_name: userBankDetails.bankName,
            b_account_name: userBankDetails.bAccountName,
            b_branch: userBankDetails.bBranch
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  //To get invoice details - End _________________________________________________

  // Get Export Invoice details - Start __________________________________
  async getExportInvoiceTable(dto: ExportInvoiceTableDto) {
    const {
      invoiceIds,
      invoiceBatchId,
      status,
      date,
      invoice_Id,
      invoice_status,
      edited_status,
      tire_status,
      tutor_id,
      tutor_name,
      business_unit,
      country,
      tutoring_country,
      maxEarning,
      minEarning
    } = dto;

    try {
      const whereClause = {
        AND: [
          {
            ...(invoiceIds.length > 0
              ? {
                  id: {
                    in: [...invoiceIds]
                  }
                }
              : {})
          },
          status !== 2
            ? {
                batch_id: invoiceBatchId
              }
            : {},
          status === 2
            ? {
                status: {
                  in: [2, 3]
                }
              }
            : { status: status },

          status === 2
            ? {
                invoicing_batch: {
                  country: { contains: country },
                  tutoring_country: { contains: tutoring_country },
                  start_date: { gte: new Date(date[0].datefrom).toISOString() },
                  end_date: { lte: new Date(date[0].dateto).toISOString() }
                }
              }
            : {},

          tutor_name.length > 0 || tutor_id.length > 0
            ? {
                tsp_id: {
                  in: [...tutor_name, ...tutor_id]
                }
              }
            : undefined,

          invoice_status.length > 0
            ? {
                status: {
                  in: [...invoice_status]
                }
              }
            : undefined,
          edited_status.length > 0
            ? {
                updated: {
                  in: [...edited_status]
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

          tire_status.length > 0
            ? {
                tiers: {
                  id: {
                    in: tire_status.map(Number)
                  }
                }
              }
            : undefined,
          business_unit.length > 0
            ? {
                user: {
                  tm_approved_status: {
                    tutorLine: business_unit
                      ? {
                          in:
                            business_unit == 'Common'
                              ? 'Primary and Secondary'
                              : business_unit
                        }
                      : {}
                  }
                }
              }
            : undefined,
          {
            total_amount: {
              gte: minEarning,
              lte: maxEarning
            }
          }
        ].filter(Boolean)
      };

      const invoiceStatus = {
        0: 'Draft',
        1: 'Sent',
        2: 'Completed',
        3: 'Cancelled'
      };

      const data = await this.prisma.gOAInvoice.findMany({
        where: whereClause,
        select: {
          id: true,
          batch_id: true,
          total_amount: true,
          tsp_id: true,
          status: true,
          due_date: true,
          tiers: { select: { discription: true } },
          invoicing_batch: {
            select: { country: true, start_date: true, end_date: true }
          },
          user: {
            select: {
              tm_approved_status: {
                select: {
                  tutorLine: true
                }
              },
              TslUser: {
                select: {
                  tsl_id: true,
                  tsl_full_name: true,
                  tsp_id: true
                }
              },
              approved_bank_data: {
                select: {
                  bAccountNo: true,
                  bankName: true,
                  bAccountName: true,
                  bBranch: true,
                  bSwift: true
                }
              }
            }
          },
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

      const transformed = await Promise.all(
        data.map(async (item) => {
          const startDate = new Date(item.invoicing_batch.start_date);
          const endDate = new Date(item.invoicing_batch.end_date);
          const invoicePeriod = `${startDate.toDateString()} - ${endDate.toDateString()}`;

          const tutorStatus =
            await this.userService.getTutorStatusForSpecificDate(
              item.user.TslUser[0].tsp_id,
              endDate
            );

          function getDetailValues(details, rateCode) {
            const detail = details.find(
              (detail) => detail.tutor_payment_rates.rate_code === rateCode
            );

            return {
              count: detail ? detail.total_slot_count : 0,
              fee: detail
                ? detail.tutor_payment_rates.amount * detail.total_slot_count
                : 0
            };
          }

          const Availability = getDetailValues(item.invoice_details, 'AVL'); // not used.

          // Availabilities
          const availabilityAfternoon = getDetailValues(
            item.invoice_details,
            'AVL_AFT'
          );

          const availabilityEvening = getDetailValues(
            item.invoice_details,
            'AVL_EVE'
          );

          const availabilityMidnight = getDetailValues(
            item.invoice_details,
            'AVL_MID'
          );

          // ––––––––––––––––––––––––––––––––––––––––––≥

          const Session_Delivery = getDetailValues(
            item.invoice_details,
            'SES_DE'
          );
          const Statutory_Allowance = getDetailValues(
            item.invoice_details,
            'STAT_ALW'
          );

          const Additional_Top_up = getDetailValues(
            item.invoice_details,
            'SES_AD_SEC'
          );

          const Incentives = getDetailValues(item.invoice_details, 'INC_PAY');

          const bankDetails = item.user.approved_bank_data
            ? item.user.approved_bank_data
            : {
                bAccountNo: '',
                bankName: '',
                bAccountName: '',
                bBranch: '',
                bSwift: ''
              };

          return {
            InvoiceID: item.id,
            Tier: item.tiers.discription,
            tutor_type: item.user.tm_approved_status.tutorLine,
            TutorName: item.user.TslUser[0].tsl_full_name,
            TutorID: item.user.TslUser[0].tsl_id,
            TspID: item.user.TslUser[0].tsp_id,
            InvoicePeriod: invoicePeriod,
            InvoiceStatus: invoiceStatus[item.status],
            tutor_status: tutorStatus,
            BusinessUnit: item.user.tm_approved_status.tutorLine,
            BankAccountnumber: bankDetails.bAccountNo,
            BankAccountName: bankDetails.bAccountName,
            BankName: bankDetails.bankName,
            BankBranch: bankDetails.bBranch,
            SwiftCode: bankDetails.bSwift,
            FeeDueDate: item.due_date,
            invoiceDetails: item.id.toString().padStart(10, '0'),
            TotalAmountDue: item.total_amount,

            AvailabilityAftCount: availabilityAfternoon.count,
            AvailabilityAftFee: availabilityAfternoon.fee,

            AvailabilityEveCount: availabilityEvening.count,
            AvailabilityEveFee: availabilityEvening.fee,

            AvailabilityMidCount: availabilityMidnight.count,
            AvailabilityMidFee: availabilityMidnight.fee,

            SessionDeliveryFee: Session_Delivery.fee,
            SessionDeliveryCount: Session_Delivery.count,
            StatutoryAllowanceFee: Statutory_Allowance.fee,
            StatutoryAllowanceCount: Statutory_Allowance.count,
            AdditionalTopUpFee: Additional_Top_up.fee,
            AdditionalTopUpCount: Additional_Top_up.count,
            IncentiveFee: Incentives.fee,
            IncentiveCount: Incentives.count
          };
        })
      );

      return { data: transformed };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
  // Get Export Invoice details - End __________________________________
}
