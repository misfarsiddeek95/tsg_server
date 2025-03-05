import { HttpException, Injectable } from '@nestjs/common';
import {
  AdditionalDocumentsTbDto,
  DeleteTsgDocumentDto,
  SubmitTsgDocumentsDto,
  SubmitCommonResourcesDto,
  AssignCommonResourcesDto,
  DeleteCommonResourceDto
} from './additional-documents-tb.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdditionalDocumentsTbService {
  constructor(private prisma: PrismaService) {}

  async fetchTableAdditionalDocumentDetails({
    skip,
    take,
    export2Csv = '',
    email,
    name,
    nic,
    country,
    tspId,
    profileStatus,
    auditor,
    auditStatus
  }: AdditionalDocumentsTbDto) {
    const isWhere =
      email ||
      name ||
      tspId ||
      profileStatus ||
      auditor ||
      auditStatus ||
      nic ||
      country;

    const result = await this.prisma.user.findMany({
      where: {
        level: 1
      },
      select: {
        tsp_id: true,
        user_hris_progress: {
          select: {
            tutorStatus: true,
            profileStatus: true,
            tspActivatedAt: true
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
        tm_approved_status: {
          select: {
            employeeStatus: true,
            subStatus: true
          }
        },
        TslUser: {
          select: {
            tsl_id: true
          }
        }
      }
    });

    const latestQuali = await this.prisma.user.findMany({
      where: {
        level: {
          in: [1, 2]
        }
      },
      orderBy: [
        {
          tm_approved_status: {
            batch: 'asc'
          }
        },
        { tsp_id: 'asc' }
      ],
      select: {
        tsp_id: true,
        username: true,
        tm_approved_status: {
          select: {
            employeeStatus: true,
            movementType: true
          }
        },
        approved_personal_data: {
          select: {
            shortName: true
          }
        },
        hris_qualifications_data: {
          orderBy: {
            id: 'desc'
          },
          take: 1,
          include: {
            xother_quali_data: true
          }
        }
      }
    });

    const tspIds =
      tspId &&
      tspId
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    let approved_personal_data: any = {};
    if (name || nic) {
      approved_personal_data = {
        shortName: name ? { contains: name } : {},
        nic: nic ? { contains: nic } : {}
      };
    }

    let approved_contact_data: any = {};
    if (email || country) {
      approved_contact_data = {
        workEmail: email ? { contains: email } : {},
        residingCountry:
          country && ['Sri Lanka', 'India'].includes(country)
            ? { equals: country }
            : country && country === 'Other'
            ? { notIn: ['Sri Lanka', 'India'] }
            : {}
      };
    }

    let user_hris_progress: any = {
      tutorStatus: {
        not: null
      }
    };
    if (auditStatus || auditor || profileStatus) {
      user_hris_progress = {
        tutorStatus: auditStatus
          ? { equals: auditStatus }
          : {
              not: null
            },
        auditorId: auditor ? { equals: +auditor } : {},
        profileStatus: profileStatus ? { equals: profileStatus } : {}
      };
    }

    const defaultFilter = {
      level: {
        in: [1, 2]
      },
      user_hris_progress: {
        tutorStatus: {
          not: null
        }
      }
    };
    const filterWhereClause = isWhere
      ? {
          level: {
            in: [1, 2]
          },
          approved_personal_data,
          approved_contact_data,
          tsp_id: tspId ? { in: tspIds } : {},
          user_hris_progress
        }
      : {
          level: {
            in: [1, 2]
          }
        };
    try {
      const [rows, count] = await Promise.all([
        this.prisma.user.findMany({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter,
          include: {
            approved_personal_data: {
              select: {
                shortName: true,
                nic: true
              }
            },
            approved_contact_data: true,
            tm_approved_status: {
              select: {
                employeeStatus: true,
                movementType: true,
                supervisorName: true
              }
            },
            user_hris_progress: {
              select: {
                tutorStatus: true,
                profileStatus: true,
                auditorId: true,
                auditor: {
                  select: {
                    username: true,
                    approved_personal_data: {
                      select: {
                        shortName: true
                      }
                    }
                  }
                }
              }
            },
            TslUser: {
              take: 1
            },
            hris_support_documents: {
              select: {
                id: true,
                document01Url: true
              },
              orderBy: {
                id: 'desc'
              },
              take: 1
            },
            ApprovedXotherAdminDocs: {
              select: {
                id: true,
                documentUrl: true
              },
              orderBy: {
                id: 'desc'
              },
              take: 1
            }
          },
          ...(!export2Csv ? { take: +take, skip: +skip } : {})
        }),
        this.prisma.user.count({
          where: isWhere
            ? { ...defaultFilter, ...filterWhereClause }
            : defaultFilter
        })
      ]);

      const dataToReturn = rows
        ? rows.map((row) => {
            const residingCountry =
              row.approved_contact_data?.residingCountry ?? '';
            let addressX = '';
            if (row.approved_contact_data) {
              addressX =
                addressX +
                (row.approved_contact_data?.residingAddressL1 &&
                row.approved_contact_data?.residingAddressL1 != ''
                  ? row.approved_contact_data?.residingAddressL1 + ', '
                  : '');
              addressX =
                addressX +
                (row.approved_contact_data?.residingAddressL2 &&
                row.approved_contact_data?.residingAddressL2 != ''
                  ? row.approved_contact_data?.residingAddressL2 + ', '
                  : '');
              addressX =
                addressX +
                (row.approved_contact_data?.residingCity &&
                row.approved_contact_data?.residingCity != ''
                  ? row.approved_contact_data?.residingCity + ', '
                  : '');
              if (residingCountry === 'India') {
                addressX =
                  addressX +
                  (row.approved_contact_data?.residingDistrict &&
                  row.approved_contact_data?.residingDistrict != ''
                    ? row.approved_contact_data?.residingDistrict + ', '
                    : '');
              }

              addressX = addressX + row?.approved_contact_data?.residingCountry;
            }
            return {
              id: row.tsp_id,
              tspId: row.tsp_id,
              shortName: row.approved_personal_data?.shortName ?? '',
              residingCountry: residingCountry,
              workEmail: row.approved_contact_data?.workEmail ?? '',
              mobileNumber: row.approved_contact_data?.mobileNumber ?? '',
              tutorStatus: row.user_hris_progress?.tutorStatus ?? '',
              profileStatus: row?.user_hris_progress?.profileStatus ?? '',
              supervisorName: row?.tm_approved_status?.supervisorName ?? '',
              employeeStatus: row?.tm_approved_status?.employeeStatus ?? '',
              movementType: row?.tm_approved_status?.movementType ?? '',
              auditorEmail: row.user_hris_progress?.auditor?.username ?? '',
              tslTutorId: row.TslUser[0]?.tsl_id ?? '',
              tslTutorName: row.TslUser[0]?.tsl_full_name ?? '',
              tslTutorEmail: row.TslUser[0]?.tsl_email ?? '',
              nic: row.approved_personal_data?.nic ?? '',
              address: addressX,

              auditorTspId: row.user_hris_progress?.auditorId ?? '',
              auditorName:
                row.user_hris_progress?.auditor?.approved_personal_data
                  ?.shortName ?? '',

              hasSupportDocuments: row.hris_support_documents[0]?.document01Url
                ? true
                : false,
              hasAdminDocuments: row.ApprovedXotherAdminDocs[0]?.documentUrl
                ? true
                : false
            };
          })
        : {};

      if (rows) {
        if (export2Csv === 'export2Csv') {
          return dataToReturn;
        } else {
          return {
            success: true,
            data: {
              details: dataToReturn,
              count: count
            }
          };
        }
      } else {
        return { success: false, message: 'No Records Available' };
      }
    } catch (error) {
      // console.log('error', error);
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async fetchTsgDocuments(tspId: number) {
    const approvedXotherAdminDocs =
      await this.prisma.approvedXotherAdminDocs.findMany({
        where: {
          tspId: +tspId,
          documentEnable: 1
        }
      });

    return approvedXotherAdminDocs;
  }

  //Tutor: Fetch User Documents
  async fetchUserDocuments(tspId: number) {
    try {
      const approvedDetails =
        await this.prisma.approvedSupportDocuments.findUnique({
          where: {
            tspId: tspId
          },
          select: {
            document01Type: true,
            document01Comment: true,
            document01Url: true,
            document02Type: true,
            document02Comment: true,
            document02Url: true,
            document03Type: true,
            document03Comment: true,
            document03Url: true,
            document04Type: true,
            document04Comment: true,
            document04Url: true,
            document05Type: true,
            document05Comment: true,
            document05Url: true,
            document06Type: true,
            document06Comment: true,
            document06Url: true,
            document07Type: true,
            document07Comment: true,
            document07Url: true,
            document08Type: true,
            document08Comment: true,
            document08Url: true,
            document09Type: true,
            document09Comment: true,
            document09Url: true,
            document10Type: true,
            document10Comment: true,
            document10Url: true,
            document11Type: true,
            document11Comment: true,
            document11Url: true,
            document12Type: true,
            document12Comment: true,
            document12Url: true,
            document13Type: true,
            document13Comment: true,
            document13Url: true,
            document14Type: true,
            document14Comment: true,
            document14Url: true,
            document15Type: true,
            document15Comment: true,
            document15Url: true,
            document16Type: true,
            document16Comment: true,
            document16Url: true,
            document17Type: true,
            document17Comment: true,
            document17Url: true,
            document18Type: true,
            document18Comment: true,
            document18Url: true,
            document19Type: true,
            document19Comment: true,
            document19Url: true,
            document20Type: true,
            document20Comment: true,
            document20Url: true
          }
        });

      const details = await this.prisma.hrisSupportDocuments.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        }
      });

      // console.log('details', details);
      return {
        success: true,
        data: {
          details,
          approvedDetails
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async submitTsgDocuments(userId: number, data: SubmitTsgDocumentsDto) {
    const now = new Date().toISOString();

    return this.prisma.$transaction(async (tx) => {
      await tx.approvedXotherAdminDocs.create({
        data: {
          tspId: data.tspId,
          ...data,
          updatedAt: now,
          updatedBy: userId
        },
        select: {
          documentType: true,
          documentComment: true,
          documentUrl: true
        }
      });
      const details = await tx.approvedXotherAdminDocs.findFirst({
        where: {
          tspId: data.tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          documentType: true,
          documentComment: true,
          documentUrl: true
        }
      });
      return details;
    });
  }

  async deleteTsgDocument(data: DeleteTsgDocumentDto) {
    try {
      await this.prisma.approvedXotherAdminDocs.update({
        where: {
          id: data.documentId
        },
        data: {
          documentEnable: 0
        }
      });
      return {
        success: true,
        message: 'Document deleted Successfully !!'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete Document.'
      };
    }
  }

  async deleteCommonResource(data: DeleteCommonResourceDto) {
    // console.log('data.documentId', data.documentId);
    try {
      await this.prisma.hrisTutorResourceDocs.update({
        where: {
          id: data.documentId
        },
        data: {
          documentEnable: 0
        }
      });
      return {
        success: true,
        message: 'Common Resource deleted Successfully !!'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete Common Resource.'
      };
    }
  }

  async submitCommonResources(userId: number, data: SubmitCommonResourcesDto) {
    const now = new Date().toISOString();
    try {
      this.prisma.$transaction(async (tx) => {
        await tx.hrisTutorResourceDocs.create({
          data: {
            ...data,
            updatedAt: now,
            updatedBy: userId
          }
        });
        return {
          success: true,
          message: 'Resource added successfully'
        };
      });
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add resource.'
      };
    }
  }

  // fetch: list of all common resources
  async fetchCommonResources() {
    try {
      const allCommonResources =
        await this.prisma.hrisTutorResourceDocs.findMany({
          where: {
            documentEnable: 1
          }
        });

      return {
        success: true,
        data: allCommonResources
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async assignCommonResources(userId: number, data: AssignCommonResourcesDto) {
    // const now = new Date().toISOString();
    try {
      // console.log('data', data);
      const { tspIds, ...rest } = data;
      if (tspIds.length <= 0) {
        throw new Error('Please select candiates.');
      } else if (
        [rest.documentType, rest.documentUrl, rest.documentComment].includes('')
      ) {
        throw new Error('Please enter document details.');
      }
      const batchSize = 10; // Batch size of 10
      await this.prisma.$transaction(async (prisma) => {
        for (let i = 0; i < tspIds.length; i += batchSize) {
          const batch = tspIds.slice(i, i + batchSize);
          const upsertPromises = batch.map((tspId) =>
            prisma.approvedXotherAdminDocs.upsert({
              where: {
                tspId_documentUrl: {
                  tspId: +tspId,
                  documentUrl: rest.documentUrl
                }
              },
              create: {
                tspId,
                documentUrl: rest.documentUrl,
                documentType: rest.documentType,
                documentName: rest.documentName,
                documentComment: rest.documentComment,
                documentEnable: 1,
                updatedBy: userId,
                updatedAt: new Date().toISOString()
              },
              update: {
                documentType: rest.documentType,
                documentName: rest.documentName,
                documentComment: rest.documentComment,
                documentEnable: 1,
                updatedBy: userId,
                updatedAt: new Date().toISOString()
              }
            })
          );
          await Promise.all(upsertPromises);
        }
      });

      return {
        success: true,
        message: 'Resource added successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add resource.'
      };
    }
  }
}
