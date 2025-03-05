import { Injectable } from '@nestjs/common';
import { CreateSimsTicketFormDto } from './dto/create-sims-ticket-form.dto';
import {
  UpdateCloseTicket,
  UpdateCollaborators,
  UpdateEscalateToHRDto,
  UpdateReplyEmail,
  UpdateResendPrimaryEmail,
  UpdateSimsTicketFormDto
} from './dto/update-sims-ticket-form.dto';
import { PrismaService } from '../../prisma/prisma.service';
import moment = require('moment');
import { SimsEmailService } from '../sims-email/sims-email.service';

@Injectable()
export class SimsTicketFormService {
  constructor(
    private prisma: PrismaService,
    private emaiService: SimsEmailService
  ) {}

  // get the session detail by passing session id.
  // ------ 0 ------
  async sessionDetails(id: number, ticketId: number) {
    try {
      const sessionDetail =
        await this.prisma.gOALaunchedSessions.findUniqueOrThrow({
          where: {
            id: id
          },
          select: {
            slot_status_id: true,
            tsp_id: true,
            id: true,
            effective_date: true
          }
        });

      const getTutorId = await this.prisma.tslUser.findUniqueOrThrow({
        where: {
          tsp_id: sessionDetail?.tsp_id
        },
        select: {
          tsl_id: true
        }
      });

      // Get the same session id count in the issue table except the current case.
      const hasSameSession = await this.prisma.simsMaster.count({
        where: {
          AND: [{ sessionId: id }],
          NOT: [{ simsMasterId: ticketId }]
        }
      });
      // ------------------------ END ---------------------------------------------

      return {
        success: true,
        data: {
          sessionType:
            sessionDetail?.slot_status_id === 1
              ? 'UK Primary'
              : sessionDetail?.slot_status_id === 2
              ? 'UK Secondary'
              : 'US',
          tutorId: getTutorId?.tsl_id,
          sessionId: sessionDetail?.id,
          hasSameSession: hasSameSession,
          sessionDate: sessionDetail.effective_date
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get the tutor name / id for the suggession.
  async getTutorNameOrId(searchItem: string, searchType: string) {
    try {
      // ------ Search by tutor name - START -------------------
      if (searchType === 'byname') {
        const tutors = await this.prisma.tslUser.findMany({
          where: {
            user: {
              level: {
                equals: 1
              },
              approved_personal_data: {
                shortName: {
                  contains: searchItem
                }
              }
            }
          },
          distinct: ['tsl_id'],
          select: {
            tsp_id: true,
            user: {
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

        // Organize the list of tutors according to the dropdown purpose.
        const data = tutors.map((d) => {
          return {
            value: d.tsp_id,
            label: d.user.approved_personal_data.shortName
          };
        });

        // This function will make the list item unique. No duplicate entries will be in the array.
        const getUniqueListBy = (arr, key) => {
          return [...new Map(arr.map((item) => [item[key], item])).values()];
        };
        const uniqueTutors = getUniqueListBy(data, 'label'); // call the function and pass the value for make the array values to unique.
        return { success: true, data: uniqueTutors };
        // ------ Search by tutor name - END -------------------
      } else if (searchType === 'byid') {
        // ------ Search by tutor id - START -------------------
        const result = await this.prisma
          .$queryRaw`SELECT DISTINCT tsp_id, tsl_id
          FROM tsl_user
          WHERE tsp_id IN (
            SELECT tsp_id 
            FROM user AS u
            WHERE u.level = 1
          ) 
          AND tsl_id LIKE ${searchItem + '%'};`;

        // Organize the list of tutors according to the dropdown purpose.
        const data = (result as unknown as any[]).map((key) => {
          return {
            value: Number(key.tsp_id),
            label: key.tsl_id.toString()
          };
        });

        return { success: true, data: data };
        // ------ Search by tutor id - END -------------------
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Fetch the tutor's detail.
  async getTutorDetail(tspId: number, ticketId: number) {
    try {
      // Initialize the values when tsp id not passed scenario.
      if (tspId == 0) {
        return {
          success: true,
          data: [
            {
              tutorTspId: '',
              tutorName: '',
              relationshipManager: '',
              relationshipManagerId: 0,
              tutorBatch: '',
              tutorStatus: '',
              raisedDepartment: '',
              businessUnit: '',
              tierNo: '',
              tutorId: '',
              tutorCountry: '',
              tutorEmail: '',
              tutorIssueHistory: []
            }
          ]
        };
      }
      const currentDate = moment().format('YYYY-MM-DD');

      // Find the tutor's relavant details - START -----------
      const tutor = await this.prisma.user.findUniqueOrThrow({
        where: {
          tsp_id: tspId
        },
        select: {
          tsp_id: true,
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          tm_approved_status: {
            select: {
              supervisorName: true,
              supervisorTspId: true,
              batch: true,
              employeeStatus: true,
              department: true,
              tutorLine: true,
              center: true
            }
          },
          approved_contact_data: {
            select: {
              residingCountry: true,
              workEmail: true
            }
          },
          GOATutorTier: {
            where: {
              effective_date: {
                lte: moment(currentDate).format()
              }
            },
            take: 1,
            orderBy: {
              effective_date: 'desc'
            },
            select: {
              tiers: {
                select: {
                  discription: true
                }
              }
            }
          },
          TslUser: {
            take: 1,
            orderBy: {
              tsl_id: 'desc'
            },
            select: {
              tsl_id: true
            }
          },
          userSimsMaster: {
            where: {
              NOT: {
                simsMasterId: ticketId
              }
            },
            select: {
              concernCategoryMeta: {
                select: {
                  value: true
                }
              },
              actionCategoryMeta: {
                select: {
                  value: true
                }
              },
              pointOfInvestigationMeta: {
                select: {
                  value: true
                }
              },
              impactLevelMeta: {
                select: {
                  value: true
                }
              },
              updatedAt: true
            }
          }
        }
      });
      // Find the tutor's relavant details - END -----------

      // Fetch the ID of the case creator. (Primary user)
      const ticketCreator = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: ticketId
        },
        select: {
          createdBy: true
        }
      });

      // Fetch the department of the ticket raised user's. (Primary user's department.)
      const ticketRaisedDepartment =
        await this.prisma.nonTutorDirectory.findUnique({
          where: {
            hr_tsp_id: ticketCreator?.createdBy
          },
          select: {
            division: true
          }
        });

      // arrange the data.
      const data = [
        {
          tutorTspId: tutor?.tsp_id,
          tutorName: tutor?.approved_personal_data?.shortName,
          relationshipManager: tutor?.tm_approved_status?.supervisorName,
          relationshipManagerId: tutor?.tm_approved_status?.supervisorTspId,
          tutorBatch: tutor?.tm_approved_status?.batch,
          tutorStatus: tutor?.tm_approved_status?.employeeStatus,
          raisedDepartment: ticketRaisedDepartment?.division,
          businessUnit:
            tutor?.tm_approved_status?.center === 'TSG' ? 'TSG SL' : 'TSG IND',
          tierNo: tutor?.GOATutorTier[0]?.tiers?.discription ?? null,
          tutorId: tutor?.TslUser[0]?.tsl_id ?? null,
          tutorCountry: tutor?.approved_contact_data?.residingCountry,
          tutorEmail: tutor?.approved_contact_data?.workEmail,
          // arrange the history of the user's previous cases.
          tutorIssueHistory: tutor?.userSimsMaster
            ?.map((item) => ({
              concernCategory:
                item?.concernCategoryMeta?.value ?? 'Concern Category',
              actionCategory:
                item?.actionCategoryMeta?.value ?? 'Action Category',
              pointOfInvestigation:
                item?.pointOfInvestigationMeta?.value ??
                'Point of Investigation',
              impactLevel: item?.impactLevelMeta?.value ?? 'Impact Level',
              issueUpdatedDate: item?.updatedAt
                ? moment(item.updatedAt).format('DD-MM-YYYY')
                : 'Date'
            }))
            .filter((item) =>
              Object.values(item).every(
                (value) => value !== null && value !== undefined
              )
            )
        }
      ];
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Fetch the number of same issues according to the concern category of the ticket.
  // Here count of same issues fetched except the current case.
  async getSameIssueCount(
    tutorId: number,
    concernCate: number,
    ticketId: number
  ) {
    try {
      return this.prisma.simsMaster.count({
        where: {
          AND: [{ tutorID: tutorId }, { concernCategory: concernCate }],
          NOT: [{ simsMasterId: ticketId }]
        }
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Fetch the relavent email template according to the action category.
  // 3 ----> ccEmail common email can be defined seperately. ----------
  async fetchRelaventEmailTemplate(actionCateId: number, ticketId: number) {
    try {
      /*
        - When the action category's value is 81, No any email templates will be response.
        - 81 is Action with another case.
      */
      if (actionCateId === 81) {
        return {
          success: true,
          data: {
            emailTemplate: '',
            emailSubject: ''
          }
        };
      }

      // Get the name of the action category by passing the action category id.
      const getActionCate = await this.prisma.simsMetaData.findUnique({
        where: {
          id: actionCateId
        },
        select: {
          value: true
        }
      });

      /*
        - Make all the letters to the capital letters in the action category name.
        - Because this upper case value is used as a key of finding the email template in the meta table.
      */
      const modifiedValue = getActionCate.value
        .replace(/ /g, '_')
        .toUpperCase();

      // Get the email template by passing the upper case value of the action category.
      const email = await this.prisma.simsMetaData.findFirstOrThrow({
        where: {
          category: 'EMAIL_TEMPLATE_CONTENT',
          subCategory: modifiedValue
        },
        select: {
          value: true,
          valueName: true
        }
      });

      /*
        88: Written notice
        89: Severe notice
        90: Termination
      */
      const writtenOrAboveIds = [88, 89, 90];

      // check the passed action category is one of these.
      const checkActionCateIdExists = writtenOrAboveIds.includes(actionCateId);

      const supervisorID = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: ticketId
        },
        select: {
          relationshipManagerId: true
        }
      });

      const supervisorEmail = await this.prisma.nonTutorDirectory.findUnique({
        where: {
          hr_tsp_id: supervisorID.relationshipManagerId
        },
        select: {
          tsg_email: true
        }
      });

      // Extract the email from the result, ensuring it's in the right format
      const supervisorEmailAddress = supervisorEmail
        ? supervisorEmail.tsg_email
        : ''; // Default to empty string if no email found

      // Define common CC emails and append the supervisor email if it exists
      const ccEmails = `wasana@thirdspaceglobal.com${
        supervisorEmailAddress ? `,${supervisorEmailAddress}` : ''
      }`;

      // const ccEmails = checkActionCateIdExists
      //   ? `${commonCCEmails},hr@thirdspaceglobal.com`
      //   : `${commonCCEmails}`;

      // Fetch the tsp id of the ticket created person's id. (Primary user's)
      const ticketCreatorTspId = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: ticketId
        },
        select: {
          createdBy: true
        }
      });

      // Fetch the ticket created person email address to attach to the CC field of the email.
      const ticketCreatorEmailAddress =
        await this.prisma.nonTutorDirectory.findUnique({
          where: {
            hr_tsp_id: ticketCreatorTspId?.createdBy
          },
          select: {
            tsg_email: true
          }
        });

      const primaryUserEmail = ticketCreatorEmailAddress?.tsg_email;

      // Attach the primary user's email address to the CC field.
      const ccEmailsWithPrimaryUser = primaryUserEmail
        ? `${ccEmails},${primaryUserEmail}`
        : ccEmails;

      const data = {
        emailTemplate: email.value,
        emailSubject: email.valueName,
        emailCCs: ccEmails
      };
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // This function will be called when escalate to hr bell icon clicked.
  async escalateToHR(escalateToHr: UpdateEscalateToHRDto) {
    try {
      const formattedTicketId = this.formatTicketId(
        escalateToHr.ticketId.toString()
      );

      // fetch the current ticket by ticket id.
      const ticket = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: +escalateToHr.ticketId
        },
        select: {
          isEscalatedToHR: true,
          userCreatedBy: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          createdBy: true
        }
      });

      /**
       * check the ticket's isEscalated field is 0 or 1.
       * Once the value is 0, value will be updated to 1.
       * after updating the value, email will be sent to the HR.
       * return the master id and updated field to save in the store for the validations.
       */
      if (ticket && ticket.isEscalatedToHR === 0) {
        const escalated = await this.prisma.simsMaster.update({
          where: {
            simsMasterId: +escalateToHr.ticketId
          },
          data: {
            isEscalatedToHR: 1,
            concernType: escalateToHr.concernType,
            escalatedToHRDate: new Date(
              escalateToHr.escalatedToHRDate
            ).toISOString(),
            tmsCaseId: escalateToHr.tmsCaseId,
            suspensionStartDate:
              escalateToHr.suspensionStartDate !== '1970-01-01T00:00:00.000Z' &&
              escalateToHr.suspensionStartDate !== '' &&
              escalateToHr.suspensionStartDate !== null &&
              escalateToHr.suspensionStartDate !== undefined
                ? new Date(escalateToHr.suspensionStartDate).toISOString()
                : null,
            suspensionEndDate:
              escalateToHr.suspensionEndDate !== '1970-01-01T00:00:00.000Z' &&
              escalateToHr.suspensionEndDate !== '' &&
              escalateToHr.suspensionEndDate !== null &&
              escalateToHr.suspensionEndDate !== undefined
                ? new Date(escalateToHr.suspensionEndDate).toISOString()
                : null,
            suspensionPeriod: escalateToHr.suspensionPeriod,
            notesToHr: escalateToHr.notesToHr
          },
          select: {
            simsMasterId: true,
            isEscalatedToHR: true,
            notesToHr: true,
            suspensionStartDate: true,
            suspensionEndDate: true,
            suspensionPeriod: true,
            tmsCaseId: true,
            concernType: true,
            escalatedToHRDate: true
          }
        });

        // Fetch the ticket created person's name.
        const fetchPrimaryUser = await this.prisma.nonTutorDirectory.findUnique(
          {
            where: {
              hr_tsp_id: ticket?.createdBy
            },
            select: {
              short_name: true
            }
          }
        );

        const primaryUser = fetchPrimaryUser?.short_name;

        // Call the email sending function.
        await this.emaiService.escalateToHREmailService(
          escalateToHr.hrEmail,
          escalateToHr.hrName,
          escalateToHr.fromEmail,
          formattedTicketId,
          escalateToHr.escalatorName,
          '',
          primaryUser
        );
        return { succcee: true, data: escalated };
      } else {
        throw new Error('Ticket is already escalated to HR.');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Add collaborators to the tickets.
  async collaborateUsersToTicket(collaborators: UpdateCollaborators) {
    try {
      // Format the ticket id. Ex: 232412569 ---> AY23/24_12569
      const formattedTicketId = this.formatTicketId(
        collaborators.ticketId.toString()
      );

      let ticketField, ticketType;

      /*
        - According to the collaborators division type, define the field which should be updated in the sims_master table.
          - ticketField: isCollaborateToOps or ticketField: isCollaborateToAca ===> These are sims_master table fields where value will be updated.
      */
      switch (collaborators.collaboratorType) {
        case 'Ops':
          ticketField = 'isCollaborateToOps';
          ticketType = 'Operations';
          break;
        case 'Aca':
          ticketField = 'isCollaborateToAca';
          ticketType = 'Academics';
          break;
        default:
          throw new Error('Invalid collaborator type.');
      }

      // Get the record by passing the sims ticket id.
      const ticket = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: +collaborators.ticketId
        },
        select: {
          [ticketField]: true,
          userCreatedBy: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          createdBy: true
        }
      });

      // Check the ticket field (isCollaborateToAca / isCollaborateToOps) whether it's 0 or 1.
      if (ticket && ticket[ticketField] === 0) {
        const primaryUserFetch = await this.prisma.nonTutorDirectory.findUnique(
          {
            where: {
              hr_tsp_id: ticket?.createdBy
            },
            select: {
              short_name: true
            }
          }
        );

        const primaryUser = primaryUserFetch?.short_name;

        // if the ticket field value is 0, that will be updated as 1 to the relevant field. (isCollaborateToAca / isCollaborateToOps)
        const data = await this.prisma.simsMaster.update({
          where: {
            simsMasterId: +collaborators.ticketId
          },
          data: {
            [ticketField]: 1
          },
          select: {
            simsMasterId: true,
            [ticketField]: true
          }
        });

        /*
          - By this promise email is sending to the relevant collaborators.
          - After the email is sent, collaborators' ids and some relevant data getting inserted to the table called sims_collaborators. 
        */
        await Promise.all(
          collaborators.collaborators.map(async (item) => {
            await this.emaiService.collaborateEmailService(
              item.userEmail,
              item.userName,
              formattedTicketId,
              collaborators.escalatorName,
              '',
              primaryUser
            );
            await this.prisma.simsCollaborators.create({
              data: {
                simsMasterId: +collaborators.ticketId,
                tspId: +item.tspId,
                note: item.note,
                collaboratorType: item.collaboratorType,
                emailSendAt: new Date()
              }
            });
          })
        );

        return { success: true, data: data, fieldType: ticketType };
      } else {
        throw new Error(`Ticket is already collaborated to ${ticketType}.`);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // This is for formatting the ticket id. Ex: AY23/24_12345
  formatTicketId = (originalTicketId: any) => {
    const text = 'AY';
    const firstYear = originalTicketId.substring(0, 2);
    const secondYear = originalTicketId.substring(2, 4);
    const finalDigits = originalTicketId.substring(4);
    const formatId = `${text}${firstYear}/${secondYear}_${finalDigits}`;
    return formatId;
  };

  // get Investigators
  async getInvestigatorNames() {
    try {
      const investigators = await this.prisma.nonTutorDirectory.findMany({
        where: {
          hr_tsp_id: { in: [7, 16, 85, 89, 105, 1211, 1894, 3336, 3346, 3349] }
        },
        select: {
          hr_tsp_id: true,
          short_name: true,
          full_name: true,
          division: true,
          tsg_email: true
        }
      });

      const data = await Promise.all(
        investigators.map((d) => {
          return {
            value: d.hr_tsp_id.toString(),
            label: d.short_name,
            full_name: d.full_name,
            division: d.division,
            tsg_email: d.tsg_email
          };
        })
      );

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Close Ticket
  async closeTicket(closeTicket: UpdateCloseTicket) {
    try {
      // Extract the required data from the input
      const { id, ticketStatus } = closeTicket;

      // Find the ticket by ID
      const ticket = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: +id
        }
      });

      // Check if the ticket exists
      if (!ticket) {
        throw new Error(`Ticket with ID ${id} not found.`);
      }

      // Check if the provided ticketStatus is 'closeCase' (assuming 114)
      if (ticketStatus !== '114') {
        throw new Error(`Invalid ticket status for closing the ticket.`);
      }

      // Update the ticket's ticketStatus and ticketCloseDate
      const updatedTicket = await this.prisma.simsMaster.update({
        where: {
          simsMasterId: +id
        },
        data: {
          ticketStatus: +ticketStatus,
          ticketCloseDate: new Date(), // Set the current date as the close date,
          updatedAt: new Date(),
          validityOfThecase:
            +closeTicket.validityOfThecase !== 0
              ? +closeTicket.validityOfThecase
              : null,
          // validityOfThecase
          actionCategory:
            +closeTicket.actionCategory !== 0
              ? +closeTicket.actionCategory
              : null,
          // actionCategory

          tutorRequestedCatchUp:
            closeTicket.tutorRequestedCatchUp !== 0
              ? closeTicket.tutorRequestedCatchUp
              : null,
          tutortCatchUp:
            // (closeTicket.tutorRequestedCatchUp === 94 ||
            //   closeTicket.tutorRequestedCatchUp === 142) && // check tutor requested catchup is YES or CATCHUP HELD PRIOR. 95 is NO, 94 is YES, and 142 is CATCHUP HELD PRIOR
            closeTicket.tutortCatchUp !== '' &&
            closeTicket.tutortCatchUp !== undefined &&
            closeTicket.tutortCatchUp !== null &&
            closeTicket.tutortCatchUp !== '1970-01-01T00:00:00.000Z'
              ? new Date(closeTicket.tutortCatchUp).toISOString()
              : null,
          changeTheInitialDecision:
            closeTicket.tutorRequestedCatchUp === 94 &&
            closeTicket.changeTheInitialDecision !== 0
              ? closeTicket.changeTheInitialDecision
              : null,
          noteToIncludeInTheHR:
            closeTicket.tutorRequestedCatchUp === 94
              ? closeTicket.noteToIncludeInTheHR
              : null,
          tutorComments: closeTicket.tutorComments,
          replyToTutorDate:
            closeTicket.tutorRequestedCatchUp === 94 && // check tutor requested catchup is YES or NO. 95 is NO. And 94 is YES.
            closeTicket.replyToTheTutorDate !== '' &&
            closeTicket.replyToTheTutorDate !== undefined &&
            closeTicket.replyToTheTutorDate !== null &&
            closeTicket.replyToTheTutorDate !== '1970-01-01T00:00:00.000Z'
              ? new Date(closeTicket.replyToTheTutorDate).toISOString()
              : null
        }
      });

      return { success: true, data: updatedTicket };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // This is the main function which is used to update the ticket form fields into the database table called sims_master.
  async updateTicketForm(ticketForm: UpdateSimsTicketFormDto, user: any) {
    try {
      // Ticket Exists checking ---- START -------------------------
      const checkExisits = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: +ticketForm.simsMasterId
        },
        select: {
          userCreatedBy: {
            select: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              }
            }
          },
          isEscalatedToHR: true,
          createdBy: true
        }
      });
      // Ticket Exists checking ---- END ----------------------------

      if (!!checkExisits === false) {
        throw new Error('Ticket ID does not exists.');
      }

      // Update the ticket fields ---------- START -----------
      const updateSims = await this.prisma.simsMaster.update({
        where: {
          simsMasterId: +ticketForm.simsMasterId
        },
        data: {
          tutorID: ticketForm.tutorID,
          tutorTspId: ticketForm.tutorTspId,
          concernType:
            ticketForm.concernType !== 0 ? ticketForm.concernType : null,
          escalatedToHRDate:
            ticketForm.escalatedDate !== '1970-01-01T00:00:00.000Z' &&
            ticketForm.escalatedDate !== '' &&
            ticketForm.escalatedDate !== null &&
            ticketForm.escalatedDate !== undefined
              ? new Date(ticketForm.escalatedDate).toISOString()
              : null,
          tmsCaseId: ticketForm.tmsCaseId,
          sessionId: ticketForm.sessionId,
          incidentDate:
            ticketForm.incidentDate !== '1970-01-01T00:00:00.000Z' &&
            ticketForm.incidentDate !== '' &&
            ticketForm.incidentDate !== null &&
            ticketForm.incidentDate !== undefined
              ? new Date(ticketForm.incidentDate).toISOString()
              : null,
          pointOfInvestigation:
            ticketForm.pointOfInvestigation !== 0
              ? ticketForm.pointOfInvestigation
              : null,
          concernCategory:
            ticketForm.concernCategory !== 0
              ? ticketForm.concernCategory
              : null,
          // academicCycle:
          //   ticketForm.academicCycle !== 0 ? ticketForm.academicCycle : null,
          impactLevel:
            ticketForm.impactLevel !== 0 ? ticketForm.impactLevel : null,
          descriptionOfTheIncident: ticketForm.descriptionOfTheIncident,
          validityOfThecase:
            ticketForm.validityOfThecase !== 0
              ? ticketForm.validityOfThecase
              : null,
          tutorSuspension:
            ticketForm.tutorSuspension !== 0
              ? ticketForm.tutorSuspension
              : null,
          tutorError:
            ticketForm.tutorError !== 0 ? ticketForm.tutorError : null,
          actionNotes: ticketForm.actionNotes,
          actionCategory:
            ticketForm.actionCategory !== 0 ? ticketForm.actionCategory : null,
          suspensionStartDate:
            ticketForm.tutorSuspension !== 0 &&
            ticketForm.suspensionStartDate !== '1970-01-01T00:00:00.000Z' &&
            ticketForm.suspensionStartDate !== '' &&
            ticketForm.suspensionStartDate !== null &&
            ticketForm.suspensionStartDate !== undefined
              ? new Date(ticketForm.suspensionStartDate).toISOString()
              : null,
          suspensionEndDate:
            ticketForm.tutorSuspension !== 0 &&
            ticketForm.suspensionEndDate !== '1970-01-01T00:00:00.000Z' &&
            ticketForm.suspensionEndDate !== '' &&
            ticketForm.suspensionEndDate !== null &&
            ticketForm.suspensionEndDate !== undefined
              ? new Date(ticketForm.suspensionEndDate).toISOString()
              : null,
          suspensionPeriod:
            ticketForm.tutorSuspension !== 0
              ? ticketForm.suspensionPeriod
              : null,
          tutorRequestedCatchUp:
            ticketForm.tutorRequestedCatchUp !== 0
              ? ticketForm.tutorRequestedCatchUp
              : null,
          tutortCatchUp:
            (ticketForm.tutorRequestedCatchUp === 94 ||
              ticketForm.tutorRequestedCatchUp === 142) && // check tutor requested catchup is YES or CATCHUP HELD PRIOR. 95 is NO, 94 is YES, and 142 is CATCHUP HELD PRIOR
            ticketForm.tutortCatchUp !== '' &&
            ticketForm.tutortCatchUp !== undefined &&
            ticketForm.tutortCatchUp !== null &&
            ticketForm.tutortCatchUp !== '1970-01-01T00:00:00.000Z' &&
            ticketForm.tutortCatchUp !== ''
              ? new Date(ticketForm.tutortCatchUp).toISOString()
              : null,
          changeTheInitialDecision:
            ticketForm.tutorRequestedCatchUp === 94 &&
            ticketForm.changeTheInitialDecision !== 0
              ? ticketForm.changeTheInitialDecision
              : null,
          noteToIncludeInTheHR:
            ticketForm.tutorRequestedCatchUp === 94
              ? ticketForm.noteToIncludeInTheHR
              : null,
          tutorComments: ticketForm.tutorComments,
          replyToTheTutorApplicableOnly:
            ticketForm.tutorRequestedCatchUp === 94
              ? ticketForm.replyToTheTutorApplicableOnly
              : null,
          replyToTutorDate:
            ticketForm.tutorRequestedCatchUp === 94 && // check tutor requested catchup is YES or NO. 95 is NO. And 94 is YES.
            ticketForm.replyToTheTutorDate !== '' &&
            ticketForm.replyToTheTutorDate !== undefined &&
            ticketForm.replyToTheTutorDate !== null &&
            ticketForm.replyToTheTutorDate !== '1970-01-01T00:00:00.000Z'
              ? new Date(ticketForm.replyToTheTutorDate).toISOString()
              : null,
          toEmail: ticketForm.toEmail,
          ccEmail: ticketForm.ccEmail,
          subjectEmail: ticketForm.subjectEmail,
          emailBody: ticketForm.emailBody,
          mandatoryFields: ticketForm.mandatoryFields,
          ticketStatus: ticketForm.ticketStatus,
          relationshipManagerId:
            ticketForm.relationshipManagerId !== 0 &&
            ticketForm.relationshipManagerId !== null
              ? ticketForm.relationshipManagerId
              : null,
          relationshipManagerName: ticketForm.relationshipManager,
          updatedAt: new Date().toISOString(),
          updatedBy: user.userId,
          replyCCEmail:
            ticketForm.ticketStatus === 141 ? ticketForm.replyEmailCCs : null,
          replyEmailSubject:
            ticketForm.ticketStatus === 141
              ? ticketForm.replyEmailSubject
              : null,
          replyEmailBody:
            ticketForm.ticketStatus === 141 ? ticketForm.replyEmailBody : null,
          notesToHr: ticketForm.notesToHr ?? null
        }
      });
      // Update the ticket fields ---------- END -------------

      /*
        - Check the ticket status which is coming from the Frontend.
        - If ticket status is 113,
            - This ticket will be updated as email sent status.
            - Final email will be sent to the tutor and relevant CC field users.
      */
      let isEmailSentVal = false; // when email successfully sent, this value will be TRUE, else FALSE.
      if (ticketForm.ticketStatus === 113) {
        const writtenOrAboveIds = [88, 89, 90]; // These ids for Written notice, Severe notice and the Termination respectively.

        // Check the passing action category included in the above categories.
        const checkActionCateIdExists = writtenOrAboveIds.includes(
          ticketForm.actionCategory
        );

        // Fetch the primary user's email address.
        const fetchPrimayUserEmail =
          await this.prisma.nonTutorDirectory.findUnique({
            where: {
              hr_tsp_id: checkExisits?.createdBy
            },
            select: {
              tsg_email: true
            }
          });

        const primaryUserEmail = fetchPrimayUserEmail?.tsg_email;

        // check the escalation status of this ticket. 1 or 0.
        const escalated = checkExisits?.isEscalatedToHR;

        const ccEmailIds = ticketForm.ccEmail; // previously this line was like this ticketForm.ccEmail + ',' + primaryUserEmail. Now primary user email attached to cc field when email template fetch. Because of that concatnation removed from this line.

        const replyToEmail = !checkActionCateIdExists
          ? primaryUserEmail
          : undefined;

        // once this is done, final email will be sent to the tutor.
        // If this escalated to the HR, from email will be sent from the hr@thirdspaceportal.com, if not sims@thirdspaceportal.com
        const emailResponse = await this.emaiService.actionCategoryMailsService(
          ticketForm.emailBody,
          ticketForm.toEmail, // receivers email
          ticketForm.subjectEmail,
          replyToEmail, // sender's email id [who created the ticket]. If action category is written or above, primary user email ID won't be applied here.
          ccEmailIds, // cc emails,
          escalated // if escalated 1, from email will be hr if not, sims
        );
        const updateEmailSentValue = await this.prisma.simsMaster.update({
          where: {
            simsMasterId: +ticketForm.simsMasterId
          },
          data: {
            isEmailSent: emailResponse.resp.success === true,
            primaryEmailMessageId: emailResponse.resp.success
              ? emailResponse.resp.messageId
              : null,
            emailSentAt: new Date().toISOString()
          },
          select: {
            isEmailSent: true
          }
        });
        isEmailSentVal = updateEmailSentValue.isEmailSent;
      }
      const fetchTicketDetail = await this.fetchTicketData(
        +ticketForm.simsMasterId,
        user
      );
      return {
        success: true,
        data: { ...updateSims, isEmailSent: isEmailSentVal },
        ticketDetails: { ...fetchTicketDetail?.data?.[0] }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Fetch the ticket data from db by passing the ticket Id.
  async fetchTicketData(ticketId: number, user: any) {
    try {
      const data = await this.prisma.simsMaster.findUniqueOrThrow({
        where: {
          simsMasterId: +ticketId
        },
        include: {
          userSimsMaster: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
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
          simsCollaborators: {
            select: {
              tspId: true,
              note: true,
              collaboratorType: true
            },
            where: {
              OR: [{ collaboratorType: 'Aca' }, { collaboratorType: 'Ops' }]
            }
          },
          concernCategoryMeta: {
            select: {
              value: true
            }
          },
          pointOfInvestigationMeta: {
            select: {
              value: true
            }
          },
          impactLevelMeta: {
            select: {
              value: true
            }
          },
          actionCategoryMeta: {
            select: {
              id: true,
              value: true
            }
          },
          tutorSuspensionMeta: {
            select: {
              value: true
            }
          },
          concernTypeMeta: {
            select: {
              value: true
            }
          }
        }
      });

      // get collaborators' ids
      const allCollabIds = data.simsCollaborators.map((coll) => {
        return Number(coll.tspId);
      });

      // include the ticket creator's id into the collaborators' ids.
      const ticketContributers = [...allCollabIds, data?.createdBy];

      // Academic collaborators
      const acaCollaborators = data.simsCollaborators.filter(
        (collaborator) => collaborator.collaboratorType === 'Aca'
      );

      // Operation collaborators.
      const opsCollaborators = data.simsCollaborators.filter(
        (collaborator) => collaborator.collaboratorType === 'Ops'
      );

      // Arrange the data according to the frontend perspective.
      const arranged = [
        {
          ...data,
          tutorName: data?.userSimsMaster?.approved_personal_data?.shortName,
          simsCollaboratorsAca: acaCollaborators.map((collaborator) => ({
            ...collaborator,
            tspId: Number(collaborator.tspId) // Convert BigInt to number
          })),
          simsCollaboratorsOps: opsCollaborators.map((collaborator) => ({
            ...collaborator,
            tspId: Number(collaborator.tspId) // Convert BigInt to number
          })),
          concernDetails: {
            concernCategoryTitle:
              data?.concernCategoryMeta?.value || 'Concern Details', // Add concernCategoryMeta value
            pointOfInvestigationTitle:
              data?.pointOfInvestigationMeta?.value || 'Point of Investigation',
            impactLevelTitle: data?.impactLevelMeta?.value || 'Impact Level'
          },
          concernActionDetails: {
            concernActionTitle: {
              id: data?.actionCategoryMeta?.id || '',
              value: data?.actionCategoryMeta?.id || '',
              label: data?.actionCategoryMeta?.value || 'Concern Action Details'
            },
            tutorSuspensionTitle:
              data?.tutorSuspensionMeta?.value || 'Tutor Suspension'
          },
          escalatedToHRTitle: {
            concernTypeTitle: data?.concernTypeMeta?.value || 'Concern Type',
            escalatedDateTitle:
              data?.escalatedToHRDate !== null
                ? new Date(data?.escalatedToHRDate).toISOString()
                : 'Escalated Date'
          },
          autoGenerateEmailTitle: {
            summeryTitle:
              data?.emailSentAt !== null
                ? data?.actionCategoryMeta?.value +
                  ' Email was sent to the tutor'
                : 'Auto Generated Email',
            emailSentDate:
              data?.emailSentAt !== null
                ? moment(data?.emailSentAt).format('DD/MM/YYYY')
                : 'Email Sent Date'
          },
          concernCategoryDetail: {
            id: data?.concernCategory || '',
            value: data?.concernCategoryMeta?.value || ''
          },
          ticketCreatedBy:
            data?.userCreatedBy?.approved_personal_data?.shortName,
          hasEditPermission: ticketContributers.includes(user.userId), // make only collaborators and creator of the ticket only can edit the ticket.
          noticeAckTutorCatchupDate:
            data?.tutortCatchUp !== null
              ? new Date(data?.tutortCatchUp).toISOString()
              : 'No catch up requested',
          userSimsMaster: undefined, // removing userSimsMaster items after retrieving the tutor name
          userCreatedBy: undefined,
          simsCollaborators: undefined, // removing simsCollaborators items after diversify according to the divisions,
          concernCategoryMeta: undefined,
          pointOfInvestigationMeta: undefined,
          impactLevelMeta: undefined,
          actionCategoryMeta: undefined,
          tutorSuspensionMeta: undefined,
          concernTypeMeta: undefined
        }
      ];

      return { success: true, data: arranged };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async resendPrimaryEmail(data: UpdateResendPrimaryEmail, user: any) {
    try {
      const checkExisits = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: +data.simsMasterId
        },
        select: {
          userCreatedBy: {
            select: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              }
            }
          },
          isEscalatedToHR: true,
          createdBy: true
        }
      });

      const writtenOrAboveIds = [88, 89, 90]; // These ids for Written notice, Severe notice and the Termination respectively.

      // Check the passing action category included in the above categories.
      const checkActionCateIdExists = writtenOrAboveIds.includes(
        +data.actionCategory
      );

      // Fetch the primary user's email address.
      const fetchPrimayUserEmail =
        await this.prisma.nonTutorDirectory.findUnique({
          where: {
            hr_tsp_id: checkExisits?.createdBy
          },
          select: {
            tsg_email: true
          }
        });

      const primaryUserEmail = fetchPrimayUserEmail?.tsg_email;

      // check the escalation status of this ticket. 1 or 0.
      const escalated = checkExisits?.isEscalatedToHR;

      const ccEmailIds = data.ccEmail;

      const replyToEmail = !checkActionCateIdExists
        ? primaryUserEmail
        : undefined;

      // once this is done, final email will be sent to the tutor.
      // If this escalated to the HR, from email will be sent from the hr@thirdspaceportal.com, if not sims@thirdspaceportal.com
      const emailResponse = await this.emaiService.actionCategoryMailsService(
        data.emailBody,
        data.toEmail, // receivers email
        data.subjectEmail,
        replyToEmail, // sender's email id [who created the ticket]. If action category is written or above, primary user email ID won't be applied here.
        ccEmailIds, // cc emails,
        escalated // if escalated 1, from email will be hr if not, sims
      );
      if (emailResponse.resp.success === true) {
        const updateEmailSentValue = await this.prisma.simsMaster.update({
          where: {
            simsMasterId: +data.simsMasterId
          },
          data: {
            toEmail: data.toEmail,
            subjectEmail: data.subjectEmail,
            emailBody: data.emailBody,
            ccEmail: ccEmailIds,
            isEmailSent: emailResponse.resp.success === true,
            primaryEmailMessageId: emailResponse.resp.success
              ? emailResponse.resp.messageId
              : null,
            emailSentAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            updatedBy: user.userId
          }
        });
        return {
          success: true,
          data: updateEmailSentValue
        };
      } else {
        return {
          success: false,
          message: 'Something was wrong while sending the email.'
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendReplyEmail(data: UpdateReplyEmail, user: any) {
    try {
      const checkExisits = await this.prisma.simsMaster.findUnique({
        where: {
          simsMasterId: +data.simsMasterId
        },
        select: {
          userCreatedBy: {
            select: {
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              }
            }
          },
          primaryEmailMessageId: true,
          isEmailSent: true,
          actionCategory: true,
          isEscalatedToHR: true,
          createdBy: true,
          subjectEmail: true,
          toEmail: true
        }
      });

      if (!!checkExisits === false) {
        throw new Error('Ticket ID does not exists.');
      }

      if (!checkExisits.isEmailSent) {
        throw new Error("Primary email didn't send for this ticket.");
      }

      const writtenOrAboveIds = [88, 89, 90]; // These ids for Written notice, Severe notice and the Termination respectively.

      // Check the passing action category included in the above categories.
      const checkActionCateIdExists = writtenOrAboveIds.includes(
        checkExisits.actionCategory
      );

      // Fetch the primary user's email address.
      const fetchPrimayUserEmail =
        await this.prisma.nonTutorDirectory.findUnique({
          where: {
            hr_tsp_id: checkExisits?.createdBy
          },
          select: {
            tsg_email: true
          }
        });

      const primaryUserEmail = fetchPrimayUserEmail?.tsg_email;

      // check the escalation status of this ticket. 1 or 0.
      const escalated = checkExisits?.isEscalatedToHR;

      const ccEmailIds = data.ccEmail;
      const replySubject = `Re: ${checkExisits.subjectEmail}`;
      const tutorEmail = checkExisits.toEmail;
      const messageId = checkExisits.primaryEmailMessageId;

      const replyToEmail = !checkActionCateIdExists
        ? primaryUserEmail
        : undefined;

      const emailResponse = await this.emaiService.sendReplyEmail(
        data.emailBody,
        tutorEmail, // receivers email
        replySubject,
        replyToEmail, // sender's email id [who created the ticket]. If action category is written or above, primary user email ID won't be applied here.
        ccEmailIds, // cc emails,
        escalated, // if escalated 1, from email will be hr if not, sims
        messageId
      );
      if (emailResponse.resp.success === true) {
        const updateEmailSentValue = await this.prisma.simsMaster.update({
          where: {
            simsMasterId: +data.simsMasterId
          },
          data: {
            replyEmailSubject: replySubject,
            replyEmailBody: data.emailBody,
            replyCCEmail: ccEmailIds,
            isReplyEmailSent: emailResponse.resp.success === true,
            updatedAt: new Date().toISOString(),
            updatedBy: user.userId
          }
        });
        return {
          success: true,
          data: updateEmailSentValue
        };
      } else {
        return {
          success: false,
          message: 'Something was wrong while sending the email.'
        };
      }
      console.log('ReplyEmailResponse', emailResponse);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
