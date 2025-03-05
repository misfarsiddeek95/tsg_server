import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JobDataDto, JobSaveDto } from './job.dto';
import moment = require('moment');
import { CommonService } from '../../../common/common.service';

@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService
  ) {}

  async fetchJobDetails(tspId: number) {
    try {
      const approvedDetails = await this.getApprovedData(tspId);
      const details = await this.getTempData(tspId);
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

  async saveJobDetails(hrUserId: number, data: JobSaveDto) {
    const { nonTutorId, ...jobData } = data;
    const lastData = await this.getTempData(nonTutorId);
    const { lastDataReasons, updatedStatus } =
      await this.commonService.collectReasons(lastData, jobData);
    const tempData = {
      ...jobData,
      ...lastDataReasons,
      ...updatedStatus
    };
    return await this.saveTempData(nonTutorId, tempData);
  }

  async auditorSubmitJobDetails(auditorId: number, data: JobSaveDto) {
    const { nonTutorId, ...jobData } = data;
    const lastData = await this.getTempData(nonTutorId);
    await this.saveTempData(nonTutorId, jobData);
    let previousApprovedData = await this.getApprovedData(nonTutorId);
    if (!previousApprovedData) {
      previousApprovedData = await this.saveApprovedData(
        auditorId,
        nonTutorId,
        {
          tspId: nonTutorId
        }
      );
    }
    const { notAuditingFields, auditingFields } =
      await this.commonService.collectAuditingFields(
        previousApprovedData,
        lastData,
        jobData
      );
    const saveData = {
      ...notAuditingFields,
      ...auditingFields,
      tspId: nonTutorId
    };
    await this.saveApprovedData(auditorId, nonTutorId, saveData);
    await this.commonService.updateNonTutorDirectory(
      nonTutorId,
      auditorId,
      saveData
    );
    const details = await this.getTempData(nonTutorId);
    const approvedDetails = await this.getApprovedData(nonTutorId);
    return { details, approvedDetails };
  }

  async getTempData(tspId: number) {
    return await this.prisma.nTHRISJobData.findFirst({
      where: {
        tspId
      },
      select: {
        jobProfile: true,
        jobPosition: true,
        jobTitle: true,
        department: true,
        subDepartment: true,
        team: true,
        reportingManager: true,
        tspId: true,
        epfNumber: true,
        employmentType: true,
        payGrade: true,
        managementLevel: true,
        departmentLevel: true,
        bCardStatus: true,
        bCardUrl: true,
        basicSalary: true,
        applicableAllowances: true,
        location: true,
        shift: true,
        workHoursType: true,
        sessionApplicability: true,
        bCardReceived: true,
        probationStatus: true,
        epfNumberRejectReason: true,
        epfNumberStatus: true,
        employeeStatus: true,
        employeeStatusReason: true,
        gsCertificate: true,
        pcCertificate: true,
        dbsReport: true,
        fbicCertificate: true
      },
      orderBy: {
        id: 'desc'
      }
    });
  }

  async getApprovedData(tspId: number) {
    return await this.prisma.approvedJobData.findUnique({
      where: {
        tspId: tspId
      },
      select: {
        jobProfile: true,
        jobPosition: true,
        jobTitle: true,
        department: true,
        subDepartment: true,
        team: true,
        reportingManager: true,
        tspId: true,
        epfNumber: true,
        employmentType: true,
        payGrade: true,
        managementLevel: true,
        departmentLevel: true,
        bCardStatus: true,
        bCardUrl: true,
        basicSalary: true,
        applicableAllowances: true,
        location: true,
        shift: true,
        workHoursType: true,
        sessionApplicability: true,
        bCardReceived: true,
        probationStatus: true,
        employeeStatus: true,
        employeeStatusReason: true,
        gsCertificate: true,
        pcCertificate: true,
        dbsReport: true,
        fbicCertificate: true
      }
    });
  }

  async saveTempData(hrUserId: number, tempData) {
    const now = new Date().toISOString();
    const savedData = await this.prisma.nTHRISJobData.create({
      data: {
        ...tempData,
        updated_at: now,
        updated_by: hrUserId
      }
    });

    await this.prisma.nTHRISProfileProgress.upsert({
      where: {
        tspId: savedData.tspId
      },
      update: {
        jobAuditStatus: 'pending',
        jobSectionFilled: true,
        updatedAt: now,
        updatedBy: hrUserId,
        jobFilledBy: hrUserId
      },
      create: {
        tspId: savedData.tspId,
        jobAuditStatus: 'pending',
        jobSectionFilled: true,
        updatedAt: now,
        updatedBy: hrUserId,
        jobFilledBy: hrUserId
      }
    });
  }

  async saveApprovedData(auditorId: number, nonTutorId: number, data) {
    const now = new Date().toISOString();
    console.log(data);
    try {
      const approvedData = await this.prisma.approvedJobData.upsert({
        where: {
          tspId: nonTutorId
        },
        update: {
          ...data,
          approvedAt: now,
          approvedBy: auditorId
        },
        create: {
          ...data,
          tspId: nonTutorId,
          approvedAt: now,
          approvedBy: auditorId
        }
      });
      await this.prisma.nTHRISProfileProgress.update({
        where: {
          tspId: data.tspId
        },
        data: {
          jobAuditStatus: 'complete',
          jobAuditBy: auditorId,
          jobAuditAt: now
        }
      });
      return approvedData;
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
