import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  FinalDecisionDto,
  JobAuditStatusDto,
  ProfileAuditStatusDto,
  RemindJobAuditDto,
  RemindUpdateProfileDto,
  SubmitToReviewDto,
  SummaryDataDto
} from './summary.dto';
import { MailService } from '../../../mail/mail.service';

@Injectable()
export class SummaryService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async fetchProfileSummary(tspId: number) {
    try {
      const bank = await this.prisma.hrisBankData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const contact = await this.prisma.hrisContactData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const education = await this.prisma.hrisEducationData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const experience = await this.prisma.hrisWorkExpData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const hardware = await this.prisma.hrisItData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const health = await this.prisma.hrisHealthData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const job = await this.prisma.nTHRISJobData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const personal = await this.prisma.hrisPersonalData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const qualification = await this.prisma.hrisQualificationsData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const reference = await this.prisma.hrisRefereeData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const right_to_work = await this.prisma.hrisRight2workData.findFirst({
        where: {
          tspId: tspId
        }
      });

      const status = await this.prisma.nTHRISProfileProgress.findFirst({
        where: {
          tspId: tspId
        },
        select: {
          profileCompleted: true,
          lastFilledSection: true,
          submittedToAudit: true,
          auditSubmitAt: true,
          profileAuditStatus: true,
          profileAuditor: {
            select: {
              short_name: true
            }
          },
          profileAuditAt: true,
          jobSectionFilled: true,
          jobAuditStatus: true,
          jobAuditAt: true,
          jobAuditor: {
            select: {
              short_name: true
            }
          },
          nonTutor: {
            select: {
              short_name: true
            }
          },
          jobFiller: {
            select: {
              short_name: true
            }
          },
          finalDecision: true,
          updatedBy: true,
          updatedAt: true
        }
      });
      const summary = {
        bank: bank ? true : false,
        contact: contact ? true : false,
        education: education ? true : false,
        experience: experience ? true : false,
        hardware: hardware ? true : false,
        health: health ? true : false,
        job: job ? true : false,
        personal: personal ? true : false,
        qualification: qualification ? true : false,
        reference: reference ? true : false,
        right_to_work: right_to_work ? true : false,
        jobFilledBy:
          status && status.jobFiller ? status.jobFiller.short_name : null,
        profileName:
          status && status.nonTutor ? status.nonTutor.short_name : null
      };

      return {
        success: true,
        data: {
          summary
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async fetchProfileOverview(tspId: number) {
    try {
      const status = await this.prisma.nTHRISProfileProgress.findFirst({
        where: {
          tspId: tspId
        },
        select: {
          profileCompleted: true,
          lastFilledSection: true,
          submittedToAudit: true,
          auditSubmitAt: true,
          profileAuditStatus: true,
          profileAuditor: {
            select: {
              short_name: true
            }
          },
          profileAuditAt: true,
          jobSectionFilled: true,
          jobAuditStatus: true,
          jobAuditAt: true,
          jobAuditor: {
            select: {
              short_name: true
            }
          },
          nonTutor: {
            select: {
              short_name: true
            }
          },
          jobFiller: {
            select: {
              short_name: true
            }
          },
          finalDecision: true,
          updatedBy: true,
          updatedAt: true
        }
      });

      const overview = {
        profileSectionCompleted: status ? status.profileCompleted : false,
        jobSectionFilled: status ? status.jobSectionFilled : false,
        lastFilledSection: status ? status.lastFilledSection : null,
        submittedToAudit: status ? status.submittedToAudit : false,
        auditSubmitAt: status ? status.auditSubmitAt : null,
        jobAuditStatus: status ? status.jobAuditStatus : null,
        jobAuditBy:
          status && status.jobAuditor ? status.jobAuditor.short_name : null,
        jobAuditDate: status ? status.jobAuditAt : null,
        profileAuditStatus: status ? status.profileAuditStatus : null,
        profileAuditBy:
          status && status.profileAuditor
            ? status.profileAuditor.short_name
            : null,
        profileAuditDate: status ? status.profileAuditAt : null,
        finalDecision: status ? status.finalDecision : null,
        jobFilledBy:
          status && status.jobFiller ? status.jobFiller.short_name : null,
        profileName:
          status && status.nonTutor ? status.nonTutor.short_name : null
      };
      return {
        success: true,
        data: {
          overview
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getAuditStatus(tspId: number) {
    try {
      const status = await this.prisma.nTHRISProfileProgress.findFirst({
        where: {
          tspId: tspId
        },
        select: {
          profileAuditStatus: true,
          jobAuditStatus: true
        }
      });
      return {
        success: true,
        data: {
          status
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async updateJobAuditStatus(params: JobAuditStatusDto) {
    try {
      const status = await this.prisma.nTHRISProfileProgress.upsert({
        where: {
          tspId: params.tspId
        },
        update: {
          jobAuditStatus: params.jobAuditStatus,
          jobAuditBy: params.jobAuditBy
        },
        create: {
          tspId: params.tspId,
          jobAuditStatus: params.jobAuditStatus,
          jobAuditBy: params.jobAuditBy,
          jobAuditAt: new Date()
        }
      });
      return { success: true, data: status };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async updateProfileAuditStatus(params: ProfileAuditStatusDto) {
    try {
      const status = await this.prisma.nTHRISProfileProgress.upsert({
        where: {
          tspId: params.tspId
        },
        update: {
          profileAuditStatus: params.profileAuditStatus,
          profileAuditBy: params.profileAuditBy
        },
        create: {
          tspId: params.tspId,
          profileAuditStatus: params.profileAuditStatus,
          profileAuditBy: params.profileAuditBy,
          profileAuditAt: new Date()
        }
      });
      return { success: true, data: status };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async remindUpdateProfile(params: RemindUpdateProfileDto) {
    try {
      const nonTutor = await this.prisma.nonTutorDirectory.findFirst({
        where: {
          hr_tsp_id: params.tspId
        }
      });
      const data = await this.mailService.sendProfileUpdateRemindEmail(
        nonTutor
      );
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async remindJobAudit(params: RemindJobAuditDto) {
    try {
      const nonTutor = await this.prisma.nonTutorDirectory.findFirst({
        where: {
          hr_tsp_id: params.tspId
        }
      });
      const data = await this.mailService.sendAuditRemindEmail(nonTutor);
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async updateFinalDecision(params: FinalDecisionDto) {
    try {
      const status = await this.prisma.nTHRISProfileProgress.update({
        where: {
          tspId: params.tspId
        },
        data: {
          finalDecision: params.finalDecision,
          finalDecisionReason: params.finalDecisionReason,
          updatedBy: params.updatedBy,
          updatedAt: new Date()
        }
      });
      return { success: true, data: status };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async submitToReview(tspId: number) {
    try {
      const status = await this.prisma.nTHRISProfileProgress.upsert({
        where: {
          tspId: tspId
        },
        update: {
          submittedToAudit: true,
          profileAuditStatus: 'pending',
          auditSubmitAt: new Date()
        },
        create: {
          tspId: tspId,
          submittedToAudit: true,
          profileAuditStatus: 'pending',
          auditSubmitAt: new Date()
        }
      });
      return { success: true, data: status };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }
}
