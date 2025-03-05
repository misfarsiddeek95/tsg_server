import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// import { rejectedFieldFetchFunc } from '../auditor/auditor.service';
@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getProgress(tspId: number) {
    const contactDetails = await this.prisma.approvedContactData.findUnique({
      where: {
        tspId: tspId
      },
      select: {
        residingCountry: true,
        user: { select: { level: true } }
      }
    });

    const sriLankan = {
      personalDataEmp: 14,
      contactDataEmp: 17,
      educationDataEmp: 6,
      qualificationsDataEmp: 8,
      workExpEmp: 2,
      availabilityDataEmp: 35,
      itDataEmp: 9,
      bankDataEmp: 5,
      healthDataEmp: 12,
      refereeDataEmp: 16
      // right2workInfoEmp: 6
    };

    const indian = {
      personalDataEmp: 14,
      contactDataEmp: 18,
      educationDataEmp: 6,
      qualificationsDataEmp: 8,
      workExpEmp: 2,
      availabilityDataEmp: 35,
      itDataEmp: 9,
      bankDataEmp: 8,
      healthDataEmp: 12,
      refereeDataEmp: 16
      // right2workInfoEmp: 6
    };

    const progress = await this.prisma.hrisProgress.findUnique({
      where: {
        tspId: tspId
      },
      select: {
        personalDataEmp: true,
        personalDataAuditor: true,
        personalDataSidebarProg: true,
        contactDataEmp: true,
        contactDataAuditor: true,
        contactDataSidebarProg: true,
        educationDataEmp: true,
        educationDataAuditor: true,
        educationDataSidebarProg: true,
        qualificationsDataEmp: true,
        qualificationsDataAuditor: true,
        qualificationsDataSidebarProg: true,
        workExpEmp: true,
        workExpAuditor: true,
        workExpSidebarProg: true,
        availabilityDataEmp: true,
        availabilityDataAuditor: true,
        availabilityDataSidebarProg: true,
        itDataEmp: true,
        itDataAuditor: true,
        itDataSidebarProg: true,
        bankDataEmp: true,
        bankDataAuditor: true,
        bankDataSidebarProg: true,
        healthDataEmp: true,
        healthDataAuditor: true,
        healthDataSidebarProg: true,
        right2workInfoEmp: true,
        right2workInfoAuditor: true,
        right2workInfoSidebarProg: true,
        refereeDataEmp: true,
        refereeDataAuditor: true,
        refereeDataSidebarProg: true,
        tutorStatus: true,
        profileStatus: true,
        initialAuditPassDate: true,
        contractAuditPassDate: true,
        finalAuditPassDate: true,
        dbsAuditPassDate: true,
        personalDataCount: true,
        contactDataCount: true,
        educationalDataCount: true,
        qualificationDataCount: true,
        workExperienceDataCount: true,
        bankDataCount: true,
        refereeDataCount: true,
        healthDataCount: true,
        itDataCount: true,
        availabilityDataCount: true
      }
    });

    let details = {};

    if (contactDetails && contactDetails.residingCountry === 'India') {
      details = Object.entries(progress).reduce((prev, curr) => {
        if (indian[curr[0]]) {
          prev[curr[0]] = Math.round(
            ((curr[1] as number) / indian[curr[0]]) * 100
          );
        } else {
          prev[curr[0]] = curr[1];
        }
        return prev;
      }, {} as any);
    } else {
      details = Object.entries(progress).reduce((prev, curr) => {
        if (sriLankan[curr[0]]) {
          prev[curr[0]] = Math.round(
            ((curr[1] as number) / sriLankan[curr[0]]) * 100
          );
        } else {
          prev[curr[0]] = curr[1];
        }
        return prev;
      }, {} as any);
    }

    //for active tutors (level 1, concider availability completed)
    if (
      contactDetails &&
      contactDetails.user &&
      contactDetails.user.level &&
      contactDetails.user.level === 1
    ) {
      details = {
        ...details,
        availabilityDataCount: '35/35',
        availabilityDataEmp: 100
      };
    }

    // also return PCC_State, DBS State... etc
    const right2WorkX = await this.prisma.hrisProgress.findUnique({
      where: {
        tspId: tspId
      }
    });

    return details;
  }


}
