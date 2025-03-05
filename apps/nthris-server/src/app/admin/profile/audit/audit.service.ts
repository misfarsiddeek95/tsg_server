import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditSearchDto } from './audit.dto';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async fetchAuditDetails(params: AuditSearchDto) {
    try {
      const where = {
        status: 'Active',
        ...(params.tspId && { hr_tsp_id: Number(params.tspId) }),
        ...(params.fullName && {
          full_name: { startsWith: params.fullName }
        }),
        ...(params.designation && {
          job_title: { equals: params.designation }
        }),
        ...(params.workEmail && { work_email: { equals: params.workEmail } }),
        profileStatus: {
          ...(params.jobAuditStatus && {
            jobAuditStatus: { equals: params.jobAuditStatus }
          }),
          ...(params.profileAuditStatus && {
            profileAuditStatus: { equals: params.profileAuditStatus }
          })
        }
      };
      //console.log('test');
      const totalCount = await this.prisma.nonTutorDirectory.count({
        where
      });
      //console.log(totalCount);

      const page = params.page ? Number(params.page) : 1;
      const perPage = params.perPage ? Number(params.perPage) : 10;
      const users = await this.prisma.nonTutorDirectory.findMany({
        where,
        include: {
          profileStatus: true
        },
        ...(!params.exportToCsv
          ? { take: perPage, skip: (page - 1) * perPage }
          : {})
      });

      const convertedData = users.map((obj) => ({
        id: obj.hr_tsp_id,
        fullName: obj.full_name,
        tspId: obj.hr_tsp_id,
        designation: obj.job_title,
        status: obj.status,
        statusReason: obj.status_reason,
        submittedToAudit: obj.profileStatus
          ? obj.profileStatus.submittedToAudit == true
            ? 'Yes'
            : 'No'
          : 'Pending',
        profileAudit: obj.profileStatus
          ? obj.profileStatus.profileAuditStatus
          : 'Pending',
        jobAudit: obj.profileStatus
          ? obj.profileStatus.jobAuditStatus
          : 'Pending',
        finalDecision: obj.profileStatus
          ? obj.profileStatus.finalDecision
          : 'Pending'
      }));
      return {
        success: true,
        data: convertedData,
        total: totalCount
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
