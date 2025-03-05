import { Injectable } from '@nestjs/common';
import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../prisma.service';
import { ExamService } from '../exam/exam.service';
import { UserService } from '../user/user.service';
import { WebhookSubmitMainDto } from './webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private prisma: PrismaService,
    private examService: ExamService,
    private userService: UserService,
    private mailService: MailService
  ) {}

  async addNewWebhookResponse(webHookData: WebhookSubmitMainDto) {
    try {
      const examRecord =
        await this.examService.getCandidateAssignedExamByFlexiUserIdAndFlexiExam(
          webHookData.data.quiz_id,
          webHookData.data.user_id
        );

      const userDetails = await this.userService.getUserDetail(
        examRecord.data.flexi_candidate_id
      );

      await this.prisma.$transaction(async (tx: any) => {
        await tx.flexiCandidateExam.update({
          where: {
            id: examRecord.data.id
          },
          data: {
            exam_status: 3,
            updated_at: new Date()
          }
        });

        await tx.flexiCandidateExamDetails.create({
          data: {
            flexi_exam_id: webHookData.data.quiz_id,
            flexi_candidate_id: webHookData.data.user_id,
            flexi_response_id: webHookData.data.response_id,
            quiz_name: webHookData.data.quiz_name,
            exam_submitted_date: new Date(
              webHookData.data.date_submitted
            ).toISOString(),
            points: parseFloat(webHookData.data.points),
            available_points: parseFloat(webHookData.data.available_points),
            percentage_score: parseFloat(webHookData.data.percentage_score),
            grade: webHookData.data.grade,
            pass: webHookData.data.pass,
            attempt: parseInt(webHookData.data.attempt),
            FlexiCandidateExam: { connect: { id: examRecord.data.id } }
          }
        });
      });

      //send email
      if (webHookData.data.pass) {
        await this.prisma.candidateLevel.upsert({
          where: { candidate_id: userDetails.data.user.tsp_id },
          update: {
            level: 4,
            updatedAt: new Date().toISOString(),
            step3UpdatedAt: new Date().toISOString(),
            step3: 'Pass'
          },
          create: {
            candidate_id: userDetails.data.user.tsp_id,
            level: 4,
            updatedAt: new Date().toISOString(),
            step3UpdatedAt: new Date().toISOString(),
            step3: 'Pass'
          }
        });
        this.mailService.sendPassMathsEmail(
          userDetails.data.user.username,
          userDetails.data.user.approved_personal_data?.firstName ?? ''
        );
      } else {
        await this.prisma.candidateLevel.upsert({
          where: { candidate_id: userDetails.data.user.tsp_id },
          update: {
            updatedAt: new Date().toISOString(),
            step3UpdatedAt: new Date().toISOString(),
            step3: 'Fail'
          },
          create: {
            candidate_id: userDetails.data.user.tsp_id,
            updatedAt: new Date().toISOString(),
            step3UpdatedAt: new Date().toISOString(),
            step3: 'Fail'
          }
        });
        this.mailService.sendFailMathsEmail(
          userDetails.data.user.username,
          userDetails.data.user.approved_personal_data?.firstName ?? ''
        );
      }

      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getAllExamDetailsService() {
    try {
      const details = await this.prisma.flexiCandidateExamDetails.findMany();

      return { success: true, data: details };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getExamDetailByIdService(id: number) {
    try {
      const details = await this.prisma.flexiCandidateExamDetails.findUnique({
        where: {
          id: id
        }
      });

      return { success: true, data: details };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getExamDetailsByTspIdService(tspId: number) {
    try {
      const userDetails = await this.prisma.flexiCandidate.findFirst({
        where: {
          tsp_id: tspId
        }
      });

      const details = await this.prisma.flexiCandidateExamDetails.findMany({
        where: {
          flexi_candidate_id: userDetails.flexi_cadidate_id
        }
      });

      return { success: true, data: details };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getCandidateExamIdDetailsService(id: number) {
    try {
      const examDetails = await this.prisma.flexiCandidateExamDetails.findFirst(
        {
          where: {
            FlexiCandidateExam: {
              id: id
            }
          }
        }
      );

      return { success: true, data: examDetails };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }
}
