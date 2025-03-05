import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  AdminApprovalDto,
  ProfileStatusDto,
  HrisAdminDto,
  HrisContractDto
} from './hris-admin.dto';

@Injectable()
export class HrisAdminService {

  constructor(private prisma: PrismaService) {}

  async create(hrisAdminDto: HrisAdminDto): Promise<any> {
    try {
      const { tspIds, ...rest } = hrisAdminDto;
      const batchSize = 10; // Batch size of 10

      await this.prisma.$transaction(async (prisma) => {
        for (let i = 0; i < tspIds.length; i += batchSize) {
          const batch = tspIds.slice(i, i + batchSize);
          const upsertPromises = batch.map((tspId) =>
            prisma.approvedJobRequisition.upsert({
              where: { tspId },
              update: { ...rest },
              create: { ...rest, tspId }
            })
          );
          await Promise.all(upsertPromises);
        }
      });

      const newRecords = tspIds.map((tspId) => ({ ...rest, tspId }));

      const affectedCount = await this.prisma.hrisJobRequisition.createMany({
        data: newRecords
      });

      let data = { success: false };
      if (affectedCount.count > 0) {
        data = { success: true };
      }
      return data;
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async createContract(hrisContractDto: HrisContractDto): Promise<any> {
    try {
      const { tspIds, ...rest } = hrisContractDto;

      const newRecords = tspIds.map((tspId) => ({
        tsp_id: tspId,
        contract_no: 1,
        contract_type: rest.contractType,
        contract_start_d: new Date(rest.startDate).toISOString(),
        contract_end_d: new Date(rest.endDate).toISOString(),
        hr_comment: rest.reasonValue
      }));

      const affectedCount = await this.prisma.$transaction(
        newRecords.map((record) =>
          this.prisma.approvedContractData.upsert({
            where: { tsp_id: record.tsp_id },
            create: record,
            update: record
          })
        )
      );

      let success = false;
      if (affectedCount.length > 0) {
        success = true;
      }
      return { success };
    } catch (error) {
      throw new Error(`Failed to upsert contracts: ${error.message}`);
    }
  }

  async updateProfileStatus(
    tspId: string,
    profileStatusDto: ProfileStatusDto
  ): Promise<void> {
    try {
      const { profileStatus } = profileStatusDto;
      await this.prisma.hrisProgress.updateMany({
        where: { tspId: {
          in: []
        } },
        data: { profileStatus }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async updateApproval(
    id: string,
    adminApprovalDto: AdminApprovalDto
  ): Promise<void> {
    try {
      const { hrAdminApproval, approvedBy, approvedAt } = adminApprovalDto;
      const now = new Date().toISOString();
      await this.prisma.hrisContractData.update({
        where: { id: parseInt(id),  },
        data: {
          hr_admin_approval: hrAdminApproval,
          approved_by: approvedBy,
          approved_at: now
        }
      });
      const approvedContracts = await this.prisma.approvedContractData.updateMany({
        where: {
          tsp_id: {
            in: []
          },
          hr_admin_approval: 'pending'
        },
        data: {
          hr_admin_approval: 'approved'
        }
      })
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }


  // approved, rejected
  async updateApprovalJobRequisition(
    id: string,
    adminApprovalDto: AdminApprovalDto,
    hrAdminId: number
  ): Promise<void> {
    try {
      const { hrAdminApproval, approvedBy, approvedAt } = adminApprovalDto;
      const now = new Date().toISOString();

      // TODO: have to get the last data and create a new one with previous data and change "approvalStatus"
      // const lastData = await this.prisma.hrisJobRequisition.findFirst({
      //   where: {
      //     tspId: [
      //     ],
      //   },
      //   orderBy: {
      //     id: 'desc'
      //   }
      // })

      await this.prisma.hrisJobRequisition.create({
        data: {
          tspId: +id,
          approvalStatus: hrAdminApproval,
        }
      });
      const approvedContracts = await this.prisma.approvedContractData.updateMany({
        where: {
          tsp_id: {
            in: []
          },
          hr_admin_approval: 'pending'
        },
        data: {
          hr_admin_approval: 'approved'
        }
      })
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
