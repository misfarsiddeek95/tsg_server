// Import necessary modules and dependencies
import { Injectable } from '@nestjs/common';
import {
  CreateSimsMasterTableDto,
  DeleteSimsMasterTicketDto,
  TheHubTableDto
} from './dto/create-sims-master-table.dto';
import { PrismaService } from '../../prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { SimsEmailService } from '../sims-email/sims-email.service';
import moment = require('moment');
import { equal } from 'assert';

@Injectable()
export class SimsMasterTableService {
  // Constructor to inject required services
  constructor(
    private prisma: PrismaService,
    private emaiService: SimsEmailService
  ) {}

  // Helper function to generate an eight-digit numeric ID
  generateEightDigitNumericId(): number {
    const currentDate = new Date();
    const currentYear =
      currentDate.getMonth() >= 7
        ? currentDate.getFullYear()
        : currentDate.getFullYear() - 1;
    const nextYear = currentYear + 1;

    // Generate a random number between 0 and 99999
    const randomId = Math.floor(Math.random() * 100000);

    // Create the eight-digit ID with the specified format
    const idWithPrefix = parseInt(
      `${currentYear.toString().slice(-2)}${nextYear
        .toString()
        .slice(-2)}${randomId.toString().padStart(5, '0')}`,
      10
    );

    return idWithPrefix;
  }

  // **************** Service method to create a new ticket ****************
  async createTicketService(
    createSimsMasterTableDto: CreateSimsMasterTableDto
  ) {
    try {
      // Generate an eight-digit numeric ID
      const simsMasterId = this.generateEightDigitNumericId();
      // Create a new ticket using Prisma
      const ticket = await this.prisma.simsMaster.create({
        data: {
          simsMasterId: Number(simsMasterId),
          tutorID: null,
          tutorTspId: null,
          sessionId: null,
          relationshipManagerId: null,
          relationshipManagerName: null,
          pointOfInvestigation: null,
          concernCategory: null,
          academicCycle: null,
          impactLevel: null,
          descriptionOfTheIncident: null,
          validityOfThecase: null,
          tutorSuspension: null,
          tutorSupportPlan: null,
          actionNotes: null,
          actionCategory: null,
          concernType: null,
          escalatedToHRDate: null,
          tmsCaseId: null,
          suspensionStartDate: null,
          suspensionEndDate: null,
          suspensionPeriod: null,
          tutorRequestedCatchUp: null,
          tutortCatchUp: null,
          changeTheInitialDecision: null,
          noteToIncludeInTheHR: null,
          tutorComments: null,
          replyToTheTutorApplicableOnly: null,
          toEmail: null,
          ccEmail: null,
          subjectEmail: null,
          emailBody: null,
          createdAt: new Date(),
          createdBy: createSimsMasterTableDto.userId,
          updatedAt: null,
          updatedBy: null,
          ticketStatus: 111,
          ticketCloseDate: null,
          isEscalatedToHR: 0,
          mandatoryFields: 0,
          isCollaborateToOps: 0,
          isCollaborateToAca: 0
        }
      });
      // Return success message along with the created ticket ID
      return {
        success: true,
        data: ticket.simsMasterId,
        message: 'Ticket created Successfully !!'
      };
    } catch (error) {
      // Return failure message if an error occurs
      return { success: false, error: error.message };
    }
  }

  // **************** Service method to delete a ticket ****************
  async deleteTicketService(
    deleteSimsMasterTicketDto: DeleteSimsMasterTicketDto
  ) {
    try {
      // Delete the ticket using Prisma
      await this.prisma.simsMaster.delete({
        where: {
          simsMasterId: deleteSimsMasterTicketDto.simsMasterId
        }
      });

      // Return success message with HTTP status 200 OK
      return {
        status: 200,
        success: true,
        message: 'Ticket deleted Successfully !!'
      };
    } catch (error) {
      // Check if the error is due to the resource not being found
      if (error.code === 'P2025') {
        // Return failure message with HTTP status 404 Not Found
        return {
          status: 404,
          success: false,
          message: 'Failed to delete ticket. Ticket not found.'
        };
      }

      // Return failure message with a generic HTTP status 500 Internal Server Error
      return {
        status: 500,
        success: false,
        message: 'Failed to delete ticket.'
      };
    }
  }

  // **************** Service method to get data for The Hub Table ****************
  async getTheHubTableData(dto: TheHubTableDto, user: any) {
    // Extract properties from the DTO
    const {
      skip,
      take,

      //Filters
      sessionId,
      ticketStatus,
      createdBy,
      isEscalatedToHR,
      tutorName,
      tutorId,
      relationshipManagerName,
      ticketId,
      ticketValidity,
      actionCat,
      concernCat,
      pointOfInv,
      raisedBy,
      escalatedDate,
      createdDateEnd,
      createdDateStart,
      createdEscalatedDateStart,
      createdEscalatedDateEnd
    } = dto;

    try {
      // Create a whereClause object based on provided filters

      const dateFrom = moment(createdDateStart).utc(true).toISOString();
      const dateTo = moment(createdDateEnd)
        .add(1, 'day')
        .endOf('day')
        .toISOString();

      const dateEscFrom = moment(createdEscalatedDateStart)
        .utc(true)
        .toISOString();
      const dateEscTo = moment(createdEscalatedDateEnd)
        .add(1, 'day')
        .endOf('day')
        .toISOString();

      const whereClause = {
        AND: [
          createdDateEnd && createdDateStart
            ? {
                createdAt: {
                  lte: dateTo,
                  gte: dateFrom
                }
              }
            : undefined,

          createdEscalatedDateEnd && createdEscalatedDateStart
            ? {
                escalatedToHRDate: {
                  lte: dateEscTo,
                  gte: dateEscFrom
                }
              }
            : undefined,

          sessionId?.length > 0
            ? {
                sessionId: {
                  in: [...sessionId]
                }
              }
            : undefined,

          ticketStatus?.length > 0
            ? {
                ticketStatus: {
                  in: [...ticketStatus]
                }
              }
            : undefined,

          createdBy?.length > 0
            ? {
                createdBy: {
                  in: [...createdBy]
                }
              }
            : undefined,

          isEscalatedToHR?.length > 0
            ? {
                isEscalatedToHR: {
                  in: [...isEscalatedToHR]
                }
              }
            : undefined,
          tutorName.length > 0
            ? {
                tutorTspId: {
                  in: [...tutorName]
                }
              }
            : undefined,
          tutorId?.length > 0
            ? {
                tutorTspId: {
                  in: [...tutorId]
                }
              }
            : undefined,

          ticketId?.length > 0
            ? {
                simsMasterId: {
                  in: [...ticketId]
                }
              }
            : undefined,

          relationshipManagerName?.length > 0
            ? {
                relationshipManagerName: {
                  in: [...relationshipManagerName]
                }
              }
            : undefined,

          ticketValidity?.length > 0
            ? {
                validityOfThecase: {
                  in: [...ticketValidity]
                }
              }
            : undefined,

          pointOfInv?.length > 0
            ? {
                pointOfInvestigation: {
                  in: [...pointOfInv]
                }
              }
            : undefined,
          concernCat?.length > 0
            ? {
                concernCategory: {
                  in: [...concernCat]
                }
              }
            : undefined,
          actionCat?.length > 0
            ? {
                actionCategory: {
                  in: [...actionCat]
                }
              }
            : undefined,

          // escalatedDate
          //   ? {
          //       escalatedToHRDate: {
          //         gte: new Date(escalatedDate), // Start of the specified day
          //         lt: new Date(
          //           new Date(escalatedDate).setDate(
          //             new Date(escalatedDate).getDate() + 1
          //           )
          //         ) // Start of the next day
          //       }
          //     }
          //   : undefined,

          raisedBy?.length > 0
            ? {
                createdBy: {
                  in: [...raisedBy]
                }
              }
            : undefined
        ].filter(Boolean)
      };

      // Retrieve data from Prisma based on the constructed whereClause
      const data = await this.prisma.simsMaster.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip: skip,
        take: take,
        select: {
          simsMasterId: true,
          createdAt: true,
          tutorTspId: true,
          createdBy: true,
          validityOfThecase: true,
          pointOfInvestigationMeta: {
            select: {
              value: true
            }
          },
          userSimsMaster: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              },
              tm_approved_status: {
                select: {
                  department: true,
                  batch: true,
                  supervisorName: true
                }
              }
            }
          },
          userCreatedBy: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          sessionId: true,
          actionCategoryMeta: {
            select: {
              value: true,
              id: true
            }
          },
          impactLevelMeta: {
            select: {
              value: true
            }
          },
          validityOfThecaseMeta: {
            select: {
              value: true
            }
          },
          ticketStatusMeta: {
            select: {
              value: true
            }
          },
          mandatoryFields: true,
          ticketCloseDate: true,
          relationshipManagerName: true,
          pointOfInvestigation: true,
          actionCategory: true,
          concernCategory: true,

          academicCycleMeta: {
            select: {
              value: true
            }
          },
          tutorErrorMeta: {
            select: {
              value: true
            }
          },
          escalatedToHRDate: true,
          isEscalatedToHR: true,
          tutorSuspensionMeta: {
            select: {
              value: true
            }
          },
          suspensionStartDate: true,
          suspensionEndDate: true,
          suspensionPeriod: true,
          tutorID: true,

          concernCategoryMeta: {
            select: {
              value: true
            }
          },
          incidentDate: true,
          isEmailSent: true,
          isReplyEmailSent: true,
          tutorRequestedCatchUp: true,
          notesToHr: true
        }
      });

      // Count the total number of records based on the whereClause
      const count = await this.prisma.simsMaster.count({
        where: whereClause
      });

      // Retrieve collaborator tickets for the current user
      const colabTickets = await this.prisma.simsCollaborators.findMany({
        where: {
          tspId: user.userId
        },
        select: {
          simsMasterId: true
        }
      });

      // Process and format data for the response
      const tickets = await Promise.all(
        data.map(async (e: any) => {
          const isCollaborator = await this.getColabCounts(
            e.simsMasterId,
            user.userId
          );
          const overallCount = await this.getOverallCounts(e.tutorTspId);
          const removeHtmlTags = (html: string) =>
            html.replace(/<[^>]*>?/gm, '');
          return {
            id: e.simsMasterId,
            ticketStatus: e.ticketStatusMeta?.value ?? null,
            tutorName:
              e.userSimsMaster?.approved_personal_data?.shortName ?? null,
            ticketStartDate: e.createdAt,
            ticketCloseDate: e.ticketCloseDate,
            isCollaborator: Number(isCollaborator) === 0 ? false : true,
            pointOfInvestigationMeta: e.pointOfInvestigationMeta?.value ?? null,
            ticketCreator:
              e.userCreatedBy?.approved_personal_data?.shortName ?? null,
            sessionEvaluationPdfLink: 'test',
            sessionLink: `https://app.thirdspacelearning.com/learning_sessions/${e.sessionId}`,
            actionCategory: e.actionCategoryMeta?.value ?? null,
            actionCategoryId: e.actionCategoryMeta?.id ?? null,
            impactLevel: e.impactLevelMeta?.value ?? null,
            caseValidity: e.validityOfThecaseMeta?.value ?? null,
            overallIssueCount: overallCount,
            mandatoryFields: e.mandatoryFields,
            academicCycle: e.academicCycleMeta?.value ?? null,
            tutorError: e.tutorErrorMeta?.value ?? null,
            escalatedToHRDate: e.escalatedToHRDate ? e.escalatedToHRDate : null,
            isEscalatedToHR:
              e.isEscalatedToHR === 1 ? 'Escalated' : 'Not Escalated',
            tutorSuspension: e.tutorSuspensionMeta?.value ?? null,
            suspensionStartDate: e.suspensionStartDate
              ? e.suspensionStartDate
              : null,
            suspensionEndDate: e.suspensionEndDate ? e.suspensionEndDate : null,
            suspensionPeriod: e.suspensionPeriod,
            raisedByDepartment:
              e.userSimsMaster?.tm_approved_status?.department ?? null,

            tutorBatch: e.userSimsMaster?.tm_approved_status?.batch ?? null,
            RMExecutive:
              e.userSimsMaster?.tm_approved_status?.supervisorName ?? null,
            tutorID: e.tutorID,
            concernCategory: e.concernCategoryMeta?.value ?? null,
            incidentDate: e.incidentDate
              ? moment(e.incidentDate).format('YYYY-MM-DD')
              : 'N/A',
            weekCommencing: moment(e.createdAt, 'YYYY-MM-DD HH:mm:ss')
              .startOf('isoWeek')
              .format('YYYY-MM-DD'),

            noOfDays: e.ticketCloseDate
              ? moment(e.ticketCloseDate).diff(moment(e.createdAt), 'days') ===
                0
                ? 1
                : moment(e.ticketCloseDate).diff(moment(e.createdAt), 'days')
              : 'N/A',

            isEmailSent: e.isEmailSent,
            isReplyEmailSent: e.isReplyEmailSent,

            tutorRequestedCatchUp: e.tutorRequestedCatchUp,

            //For the Download CSV part
            csvTicketValue:
              e.ticketStatusMeta?.value === '1' ||
              e.ticketStatusMeta?.value === '2' ||
              e.ticketStatusMeta?.value === '5' ||
              e.ticketStatusMeta?.value === '6'
                ? 'Open Ticket'
                : e.ticketStatusMeta?.value === '3'
                ? 'Email Sent'
                : e.ticketStatusMeta?.value === '4'
                ? 'Close Ticket'
                : 'N/A',
            csvTutorName:
              e.userSimsMaster?.approved_personal_data?.shortName ?? 'N/A',

            csvTicketStartDate: e.createdAt
              ? moment(e.createdAt).format('YYYY-MM-DD')
              : 'N/A',

            csvTicketCloseDate: e.ticketCloseDate
              ? moment(e.ticketCloseDate).format('YYYY-MM-DD')
              : 'N/A',
            csvPointOfInvestigation: e.pointOfInvestigationMeta?.value ?? 'N/A',
            csvSessionLink: e.sessionId
              ? `https://app.thirdspacelearning.com/learning_sessions/${e.sessionId}`
              : 'N/A',

            csvActionCategory: e.actionCategoryMeta?.value ?? 'N/A',
            csvImpactLevel: e.impactLevelMeta?.value ?? 'N/A',
            csvCaseValidity: e.validityOfThecaseMeta?.value ?? 'N/A',
            notesToHr: e.notesToHr ? removeHtmlTags(e.notesToHr) : 'N/A'
          };
        })
      );

      // Return the final response
      return {
        success: true,
        count: count,
        ColabUserIds: colabTickets?.map((d: any) => {
          return d.simsMasterId;
        }),
        data: tickets
      };
    } catch (error) {
      // Return failure message if an error occurs
      return { success: false, error: error.message };
    }
  }

  // Helper method to get the count of collaborations for a given ticket and user
  async getColabCounts(masterId: number, createdById: number) {
    return await this.prisma.simsCollaborators.count({
      where: {
        simsMasterId: masterId,
        tspId: createdById
      }
    });
  }

  // Helper method to get the overall count of tickets for a given tutor
  async getOverallCounts(tutorId: number) {
    return await this.prisma.simsMaster.count({
      where: {
        tutorTspId: tutorId
      }
    });
  }

  // **************** Service method to filter and suggest tutor names ****************
  async tutorNameFilterService(tutorName: string) {
    try {
      // Query Prisma for tutors matching the provided name
      const tutors = await this.prisma.simsMaster.findMany({
        where: {
          userSimsMaster: {
            level: {
              equals: 1
            },
            approved_personal_data: {
              shortName: {
                contains: tutorName
              }
            }
          }
        },
        distinct: ['tutorTspId'],
        select: {
          tutorTspId: true,
          userSimsMaster: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });
      // Format data for response
      const data = tutors.map((d) => {
        return {
          value: d.tutorTspId,
          label: d.userSimsMaster.approved_personal_data.shortName
        };
      });
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Service method to filter and suggest tutor IDs ****************
  async tutorIdFilterService(tutorId: number) {
    try {
      // Query Prisma for distinct tutor IDs matching the provided ID
      const result = await this.prisma
        .$queryRaw`SELECT DISTINCT tutor_tsp_id, tutor_id FROM sims_master WHERE tutor_id LIKE ${
        tutorId + '%'
      } GROUP BY tutor_id
      `;
      // Format data for response
      const data = (result as unknown as any[]).map((key) => {
        return {
          value: Number(key.tutor_tsp_id),
          label: Number(key.tutor_id) + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Service method to filter and suggest ticket IDs ****************
  async ticketIdFilterService(ticketId: string) {
    try {
      // Query Prisma for distinct ticket IDs matching the provided ID
      const result = await this.prisma.$queryRaw`SELECT DISTINCT sims_master_id
      FROM sims_master WHERE sims_master_id LIKE ${ticketId + '%'};`;
      const data = (result as unknown as any[]).map((key) => {
        return {
          value: Number(key.sims_master_id),
          label: Number(key.sims_master_id) + ''
        };
      });

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Service method to filter and suggest relationship manager names ****************
  async relationshipManagerNameService(relationshipManagerName: string) {
    try {
      // Query Prisma for distinct relationship manager names matching the provided name
      const results = await this.prisma.simsMaster.findMany({
        where: {
          relationshipManagerName: {
            contains: relationshipManagerName
          }
        },
        distinct: ['relationshipManagerName'],
        select: {
          relationshipManagerName: true
        }
      });
      // Format data for response
      const data = results.map((d) => {
        return {
          value: d?.relationshipManagerName,
          label: d?.relationshipManagerName
        };
      });
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // **************** Service method to get collaborator ticket IDs for the current user ****************
  async getColabTicketIdsService(user: any) {
    try {
      // Query Prisma for collaborator tickets based on the current user
      const colabTickets = await this.prisma.simsCollaborators.findMany({
        where: {
          tspId: user.userId
        },
        select: {
          simsMaster: {
            select: {
              createdBy: true
            }
          }
        }
      });
      // Format data for response
      return {
        ColabUserIds: colabTickets?.map((d: any) => {
          return d?.simsMaster?.createdBy;
        })
      };
    } catch (error) {
      // Return failure message if an error occurs
      return { success: false, error: error.message };
    }
  }

  // **************** Service method to filter and suggest ticket creators ****************
  async ticketCreatorFilterService(raisedBy: string) {
    try {
      // Query Prisma for distinct ticket creators matching the provided name
      const ticketCreators = await this.prisma.simsMaster.findMany({
        where: {
          userCreatedBy: {
            approved_personal_data: {
              shortName: {
                contains: raisedBy
              }
            }
          }
        },
        distinct: ['createdBy'],
        select: {
          createdBy: true,
          userCreatedBy: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });
      // Format data for response
      const data = ticketCreators.map((d) => {
        return {
          value: d.createdBy,
          label: d.userCreatedBy.approved_personal_data.shortName
        };
      });
      return { success: true, data: data };
    } catch (error) {
      // Return failure message if an error occurs
      return { success: false, error: error.message };
    }
  }

  // **************** Service method to get email details for a ticket ****************
  // async getEmailDetailsService(ticketId: any, user: any) {
  //   try {
  //     // Check if the ticket ID exists
  //     const checkExists = await this.prisma.simsMaster.findUnique({
  //       where: {
  //         simsMasterId: +ticketId.ticketId
  //       }
  //     });
  //     // Throw an error if the ticket ID does not exist
  //     if (!checkExists) {
  //       throw new Error('Ticket ID does not exist.');
  //     }

  //     // Query Prisma for email details based on the ticket ID
  //     const emailData = await this.prisma.simsMaster.findUnique({
  //       where: {
  //         simsMasterId: +ticketId.ticketId
  //       },
  //       select: {
  //         ticketStatus: true,
  //         toEmail: true,
  //         ccEmail: true,
  //         subjectEmail: true,
  //         emailBody: true
  //       }
  //     });

  //     let data;

  //     // If the ticket status is appropriate, send emails and update ticket status
  //     if (emailData.ticketStatus === 111 || emailData.ticketStatus === 112) {
  //       await this.emaiService.actionCategoryMailsService(
  //         emailData.emailBody,
  //         emailData.toEmail,
  //         emailData.subjectEmail,
  //         user.username,
  //         emailData.ccEmail
  //       );

  //       // Update the ticket status
  //       data = await this.prisma.simsMaster.update({
  //         where: {
  //           simsMasterId: +ticketId.ticketId
  //         },
  //         data: {
  //           ticketStatus: 113
  //         }
  //       });
  //     }
  //     // Return success message along with the updated ticket status
  //     return { success: true, ticketStatus: data?.ticketStatus };
  //   } catch (error) {
  //     // Return failure message if an error occurs
  //     return { success: false, error: error.message };
  //   }
  // }
}
