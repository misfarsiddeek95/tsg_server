import { Injectable } from '@nestjs/common';
import moment = require('moment');
import { PrismaService } from '../prisma.service';
import { Data } from './user-details.dto';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';
import { Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserDetailsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  /***
   * Thanks Banuka, Gishan for supporting this query....
   */
  async getCandidateList(
    take,
    skip,
    names,
    email,
    mobileNo,
    startDate,
    endDate,
    tspId,
    country
  ) {
    try {
      const tspIds =
        tspId &&
        tspId
          .replace(/[^\d,]/g, '')
          .split(',')
          .map(Number)
          .filter(Boolean);
      const filterWhereClause = {
        level: {
          equals: 2
        },
        CandidateLevel: {
          candidate_id: { not: { in: [] } }
        },
        tsp_id: tspId ? { in: tspIds } : {},
        approved_personal_data: {
          shortName:
            names.length > 0
              ? {
                  in: names
                }
              : {}
        },
        approved_contact_data: {
          residingCountry: country
            ? {
                equals: country
              }
            : {},
          mobileNumber: mobileNo
            ? {
                contains: mobileNo
              }
            : {},
          workEmail: email
            ? {
                contains: email
              }
            : {}
        },
        created_at:
          startDate || endDate
            ? {
                gte: moment(startDate).startOf('date').toISOString(),
                lte: moment(endDate).endOf('date').toISOString()
              }
            : {}
      };

      const [count, candidates] = await this.prisma.$transaction([
        this.prisma.user.count({
          where: filterWhereClause
        }),
        this.prisma.user.findMany({
          where: filterWhereClause,
          skip,
          take,
          select: {
            tsp_id: true,
            created_at: true,
            approved_contact_data: {
              select: {
                workEmail: true,
                residingCountry: true,
                mobileNumber: true
              }
            },
            approved_personal_data: {
              select: {
                shortName: true
              }
            },
            CandidateLevel: {
              select: {
                level: true
              }
            }
          }
        })
      ]);

      const data = candidates.map((d, index) => {
        const candiateLevelList = {
          0: 'No Record',
          1: 'Basic Information',
          2: 'Qualifications',
          3: 'Maths Test',
          4: 'Phone Interview',
          5: 'Teaching Interview',
          6: 'Final Assestment System',
          7: 'Complete'
        };

        return {
          id: d.tsp_id,
          tspId: d.tsp_id,
          name: d.approved_personal_data?.shortName ?? '',
          email: d.approved_contact_data?.workEmail ?? '',
          country: d.approved_contact_data?.residingCountry ?? '',
          registrationDate: moment(d.created_at).format('DD/MM/YYYY'),
          mobileNo: d.approved_contact_data?.mobileNumber ?? '',
          stage: d.CandidateLevel
            ? candiateLevelList[d.CandidateLevel.level]
            : candiateLevelList[0],
          viewProfile: 'profile'
        };
      });

      return { success: true, data, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getNewCandidateList(
    take,
    skip,
    names,
    email,
    mobileNo,
    startDate,
    endDate,
    tspId,
    country
  ) {
    try {
      const tspIds =
        tspId &&
        tspId
          .replace(/[^\d,]/g, '')
          .split(',')
          .map(Number)
          .filter(Boolean);

      const filterWhereClause = {
        level: {
          equals: 2
        },
        AND: [
          {
            tsp_id: {
              // gte: 135520,
              gte: 20
            }
          },
          {
            tsp_id: tspId ? { in: tspIds } : {}
          }
        ],
        CandidateLevel: {
          level: {
            gte: 2
          }
        },
        approved_personal_data: {
          shortName:
            names.length > 0
              ? {
                  in: names
                }
              : {}
        },
        approved_contact_data: {
          residingCountry: country
            ? {
                equals: country
              }
            : {},
          mobileNumber: mobileNo
            ? {
                contains: mobileNo
              }
            : {},
          workEmail: email
            ? {
                contains: email
              }
            : {}
        },
        created_at:
          startDate || endDate
            ? {
                gte: moment(startDate).startOf('date').toISOString(),
                lte: moment(endDate).endOf('date').toISOString()
              }
            : {}
      };

      const [count, candidates] = await this.prisma.$transaction([
        this.prisma.user.count({
          where: filterWhereClause
        }),
        this.prisma.user.findMany({
          where: filterWhereClause,
          skip,
          take,
          select: {
            tsp_id: true,
            created_at: true,
            approved_contact_data: {
              select: {
                workEmail: true,
                residingCountry: true,
                mobileNumber: true
              }
            },
            approved_personal_data: {
              select: {
                shortName: true
              }
            },
            CandidateLevel: {
              select: {
                level: true,
                candidate_id: true,
                step5: true
              }
            }
          }
        })
      ]);

      const data = candidates.map((d, index) => {
        const candiateLevelList = {
          0: 'No Record',
          1: 'Basic Information',
          2: 'Qualifications',
          3: 'Maths Test',
          4: 'Phone Interview',
          5: 'Teaching Interview',
          6: 'Final Assestment System',
          7: 'Complete'
        };

        return {
          id: d.tsp_id,
          tspId: d.tsp_id,
          candidateId: d.CandidateLevel?.candidate_id,
          step5: d.CandidateLevel?.step5,
          name: d.approved_personal_data.shortName,
          email: d.approved_contact_data.workEmail,
          country: d.approved_contact_data.residingCountry,
          registrationDate: moment(d.created_at).format('DD/MM/YYYY'),
          mobileNo: d.approved_contact_data.mobileNumber,
          stage: d.CandidateLevel
            ? candiateLevelList[d.CandidateLevel.level]
            : candiateLevelList[0],
          viewProfile: 'profile'
        };
      });

      return { success: true, data, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async giveCandidateAccessToHris(data: any) {
    try {
      const environment = process.env.NX_ENVIRONMENT;
      const candidateId = data.candidateId;
      const result = data.result;
      const tspId = data.tspId;
      const email: any = data.email;
      const firstName: any = data.firstName;

      let level = null;
      let step5 = null;
      if (result == 'Pass') {
        level = 6;
        step5 = 'Pass';
      } else {
        level = 5;
        step5 = 'Fail';
      }

      await this.prisma.$transaction(async (tx) => {
        // update bs_candidate level
        await this.prisma.candidateLevel.update({
          where: {
            candidate_id: candidateId
          },
          data: {
            level: level,
            step5: step5,
            step1: 'Skip',
            step2: 'Skip',
            step3: 'Skip',
            step4: 'Skip',
            step5UpdatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });

        if (result == 'Pass') {
          // updates related to hris
          await tx.hrisProgress.upsert({
            where: {
              tspId: tspId
            },
            create: {
              tspId: tspId,
              tutorStatus: 'onboarding ready',
              profileStatus: 'onboarding ready',
              lmsEmail: email ?? null,
              updatedAt: new Date().toISOString()
            },
            update: {
              tutorStatus: 'onboarding ready',
              profileStatus: 'onboarding ready',
              updatedAt: new Date().toISOString()
            }
          });
        }

        return true;
      });

      if (result === 'Pass') {
        //password
        const password: any = generator.generate({
          length: 10,
          numbers: true
        });

        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);

        const data: Prisma.UserUpdateInput = {
          password: hash
        };

        await this.prisma.user.update({
          where: {
            username: email
          },
          data
        });

        await this.mailService.sendCredentialsToCandidateEmail(
          email,
          password,
          firstName
        );
        // //Emial
        // if (environment === 'production') {
        //   await this.mailService.sendCredentialsToCandidateEmail(
        //     email,
        //     password,
        //     firstName
        //   );
        // } else if (environment === 'staging') {
        //   await this.mailService.sendCredentialsToCandidateEmail(
        //     'inusha@thirdspaceglobal.com',
        //     password,
        //     firstName
        //   );
        // }
      }
      return { success: true, status: 201 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async exportCandidateProfiles({
    names,
    email,
    mobileNo,
    startDate,
    endDate,
    tspId,
    country
  }: Data) {
    const isWhere =
      names || email || mobileNo || startDate || endDate || tspId || country;

    const tspIds =
      tspId &&
      tspId
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number)
        .filter(Boolean);
    try {
      const filterWhereClause = isWhere
        ? {
            level: {
              in: [1, 2]
            },
            tsp_id: tspId ? { in: tspIds } : {},
            approved_personal_data: {
              shortName: names ? { contains: names } : {}
            },
            approved_contact_data: {
              residingCountry: country ? { equals: country } : {},
              mobileNumber: mobileNo ? { contains: mobileNo } : {},
              workEmail: email ? { contains: email } : {}
            },
            created_at:
              startDate || endDate
                ? {
                    gte: moment(startDate).startOf('date').toISOString(),
                    lte: moment(endDate).endOf('date').toISOString()
                  }
                : {}
          }
        : {
            level: {
              in: [1, 2]
            }
          };

      const [count, candidates] = await this.prisma.$transaction([
        this.prisma.user.count({
          where: filterWhereClause
        }),
        this.prisma.user.findMany({
          where: filterWhereClause,
          select: {
            tsp_id: true,
            created_at: true,
            approved_contact_data: {
              select: {
                workEmail: true,
                residingCountry: true,
                mobileNumber: true
              }
            },
            approved_personal_data: {
              select: {
                shortName: true
              }
            },
            CandidateLevel: {
              select: {
                level: true
              }
            }
          }
        })
      ]);

      const data = candidates.map((d, index) => {
        const candiateLevelList = {
          0: 'No Record',
          1: 'Basic Information',
          2: 'Qualifications',
          3: 'Maths Test',
          4: 'Phone Interview',
          5: 'Teaching Interview',
          6: 'Final Assestment System',
          7: 'Complete'
        };

        return {
          id: d.tsp_id,
          tspId: d.tsp_id,
          name: d.approved_personal_data?.shortName ?? '',
          email: d.approved_contact_data?.workEmail ?? '',
          country: d.approved_contact_data?.residingCountry ?? '',
          registrationDate: moment(d.created_at).format('DD/MM/YYYY'),
          mobileNo: d.approved_contact_data?.mobileNumber ?? '',
          stage: d.CandidateLevel
            ? candiateLevelList[d.CandidateLevel.level]
            : candiateLevelList[0],
          viewProfile: 'profile'
        };
      });

      return { success: true, data, count };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }
}
