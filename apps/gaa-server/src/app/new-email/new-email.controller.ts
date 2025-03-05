import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { NewEmailService } from "./new-email.service";
import { PrismaService } from "../prisma/prisma.service";
@Controller("email")
export class NewEmailController {
  constructor(
    private readonly newEmailService: NewEmailService,
    private prisma: PrismaService
  ) {}

  @Post("notify-tutor-mail")
  async NotifyTutor(
    @Body()
    data: any
  ) {
    try {
      const response = await this.newEmailService.sendNotifyTutorMailService(
        data.subject,
        data.email,
        data.emailAc,
        data.first_name,
        data.focusAreas,
        data.linkToBookDiscussion,
        data.reasonForEvaluation,
        data.pillar1,
        data.criteria1,
        data.comment1,
        data.pillar2,
        data.criteria2,
        data.comment2,
        data.pillar3,
        data.criteria3,
        data.comment3,
        data.sesData,
        data.evaluationId
      );
      if (response) {
        // console.log(JSON.stringify(response));
        const status = response[0].statusCode;
        if (status == 202) {
          const updatedRecord = await this.prisma.sesRevampEvaluation.update({
            where: {
              evaluation_id: data.evaluationId,
            },
            data: {
              notify_email_sent_at: new Date(),
            },
          });
          return {
            success: true,
            status: 200,
            message: `${data.first_name} initial  notify email sent to ${data.email} email address `,
          };
        } else if (status == 403) {
          return {
            success: false,
            status: 403, //403 Forbidden
          };
        } else {
          return {
            success: false,
            status: 500,
          };
        }
      } else {
        return {
          success: false,
          status: 500,
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post("submit-tutor-mail")
  async SubmitTutorMail(
    @Body()
    {
      evaluationId,
      subject,
      email,
      emailAc,
      first_name,
      pdfName,
      type,
      tutorId,
    }: {
      evaluationId: number;
      subject: string;
      email: string;
      emailAc: string;
      first_name: string;
      pdfName: string;
      type: string;
      tutorId: number;
    }
  ) {
    return await this.newEmailService.submitTutorMailService(
      evaluationId,
      subject,
      email,
      emailAc,
      first_name,
      pdfName,
      type,
      tutorId
    );
  }
}
