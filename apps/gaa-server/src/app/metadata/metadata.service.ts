import { Injectable } from '@nestjs/common';
import { arrayUnique, ArrayUnique } from 'class-validator';
import { identity } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetadatumDto } from './dto/create-metadatum.dto';
import { UpdateMetadatumDto } from './dto/update-metadatum.dto';

@Injectable()
export class MetadataService {
  constructor(private prisma: PrismaService) {}

  async getMetadataService(evaluationData: CreateMetadatumDto) {
    try {
      console.log('CreateMetadatumDto service', evaluationData);
      //category = overall session rating
      const data = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Overall Session Rating'
        },
        select: {
          id: true,
          value: true
        }
      });
      const reasonforEvaluation = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Reason for Evaluation'
        },
        select: {
          id: true,
          value: true
        }
      });
      const feedbackAttendance = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Feedback Attendance'
        },
        select: {
          id: true,
          value: true
        }
      });
      const sRCompletion = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'SR Completion'
        },
        select: {
          id: true,
          value: true
        }
      });
      const previousFocusAreasStatus =
        await this.prisma.sesRevampMetaData.findMany({
          where: {
            status: '1',
            category: 'Previous focus area status'
          },
          select: {
            id: true,
            value: true
          }
        });
      const rating = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Rating'
        },
        select: {
          id: true,
          value: true
        }
      });

      const pupilsProgress = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Pupil’s Progress'
        },
        select: {
          id: true,
          value: true
        }
      });

      const pillar = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Pillar'
        },
        select: {
          id: true,
          value: true
        }
      });

      const qnotes = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Quality Notes'
        },
        select: {
          id: true,
          value: true
        }
      });

      const skills = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Skills'
        },
        select: {
          id: true,
          value: true
        }
      });

      const mindset = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Mindset'
        },
        select: {
          id: true,
          value: true
        }
      });

      const effort = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Effort'
        },
        select: {
          id: true,
          value: true
        }
      });

      const criteria = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Criteria'
        },
        select: {
          id: true,
          sub_category: true,
          value: true
        }
      });

      const c1 = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Criteria',
          sub_category: 'Language'
        },
        select: {
          id: true,
          sub_category: true,
          value: true
        }
      });

      const c2 = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Criteria',
          sub_category: 'Subject Knowledge'
        },
        select: {
          id: true,
          sub_category: true,
          value: true
        }
      });
      const c3 = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Criteria',
          sub_category: 'SCT Assessment'
        },
        select: {
          id: true,
          sub_category: true,
          value: true
        }
      });

      const c4 = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Criteria',
          sub_category: 'SCT Interaction'
        },
        select: {
          id: true,
          sub_category: true,
          value: true
        }
      });
      const c5 = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Criteria',
          sub_category: 'Familiarity'
        },
        select: {
          id: true,
          sub_category: true,
          value: true
        }
      });
      const criteriaArr = [
        {
          name: 'Language',
          criterias: c1
        },
        {
          name: 'Subject Knowledge',
          criterias: c2
        },
        {
          name: 'SCT Assessment',
          criterias: c3
        },
        {
          name: 'SCT Interaction',
          criterias: c4
        },
        {
          name: 'Familiarity',
          criterias: c5
        }
      ];

      const requiredAction = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Required Action'
        },
        select: {
          id: true,
          value: true
        }
      });

      const finalOutcomeOfTheInvestigation =
        await this.prisma.sesRevampMetaData.findMany({
          where: {
            status: '1',
            category: 'Outcome of the Investigation'
          },
          select: {
            id: true,
            value: true
          }
        });

      const pointOfInvestigation = await this.prisma.sesRevampMetaData.findMany(
        {
          where: {
            status: '1',
            category: 'Point of Investigation'
          },
          select: {
            id: true,
            value: true
          }
        }
      );

      const concern = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Concern'
        },
        select: {
          id: true,
          value: true
        }
      });

      const abandonReason = await this.prisma.sesRevampMetaData.findMany({
        where: {
          status: '1',
          category: 'Abandon Reason'
        },
        select: {
          id: true,
          value: true
        }
      });

      // const data = data.map((item)  => {
      //   return {
      //      overallSessionRating:data,
      //      reasonforEvaluation:reasonforEvaluation,
      //      feedbackAttendance:feedbackAttendance,
      //      sRCompletion:sRCompletion,
      //      previousFocusAreasStatus:previousFocusAreasStatus,
      //      ratings:rating,
      //   }
      // });

      const data1 = {
        overallSessionRating: data,
        reasonforEvaluation: reasonforEvaluation,
        feedbackAttendance: feedbackAttendance,
        sRCompletion: sRCompletion,
        previousFocusAreasStatus: previousFocusAreasStatus,
        ratings: rating,
        pupilsProgress: pupilsProgress,
        effort: effort,
        pillar: pillar,
        qnotes: qnotes,
        skills: skills,
        mindset: mindset,
        criteria: criteriaArr,
        requiredAction: requiredAction,
        finalOutcomeOfTheInvestigation: finalOutcomeOfTheInvestigation,
        pointOfInvestigation: pointOfInvestigation,
        concern: concern,
        abandonReason: abandonReason
      };

      return {
        success: true,
        data: data1
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
