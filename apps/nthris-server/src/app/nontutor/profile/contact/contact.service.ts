import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AuditorSubmitContactDetailsDto,
  SaveContactDataDto
} from './contact.dto';
import { CommonService } from '../../../common/common.service';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private commonService: CommonService
  ) {}

  async fetchContactDetails(tspId: number) {
    const approvedDetails = await this.getApprovedData(tspId);
    const details = await this.getTempData(tspId);
    return {
      success: true,
      data: {
        details,
        approvedDetails
      }
    };
  }

  async saveContactDetails(tspId: number, data: SaveContactDataDto) {
    const lastData = await this.getTempData(tspId);
    const { lastDataReasons, updatedStatus } =
      await this.commonService.collectReasons(lastData, data);
    const tempData = {
      ...data,
      ...lastDataReasons,
      ...updatedStatus
    };
    return await this.saveTempData(tspId, tempData);
  }

  async auditorSubmitContactDetails(
    auditorId: number,
    data: AuditorSubmitContactDetailsDto
  ) {
    const { nonTutorId, ...rest } = data;
    const lastData = await this.getTempData(nonTutorId);
    await this.saveTempData(nonTutorId, rest);
    let previousApprovedData = await this.getApprovedData(nonTutorId);
    if (!previousApprovedData) {
      previousApprovedData = await this.saveApprovedData(auditorId, {
        tspId: nonTutorId
      });
    }
    const { notAuditingFields, auditingFields } =
      await this.commonService.collectAuditingFields(
        previousApprovedData,
        lastData,
        rest
      );
    const saveData = {
      ...notAuditingFields,
      ...auditingFields,
      tspId: nonTutorId
    };
    await this.saveApprovedData(auditorId, saveData);
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
    try {
      return await this.prisma.hrisContactData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          personalEmail: true,
          workEmail: true,
          workEmailStatus: true,
          workEmailRejectReason: true,
          mobileNumber: true,
          mobileNumberStatus: true,
          mobileNumberRejectReason: true,
          landlineNumber: true,
          landlineNumberStatus: true,
          landlineNumberRejectReason: true,
          residingAddressL1: true,
          residingAddressL1Status: true,
          residingAddressL1RejectReason: true,
          residingAddressL2: true,
          residingAddressL2Status: true,
          residingAddressL2RejectReason: true,
          residingCity: true,
          residingCityStatus: true,
          residingCityRejectReason: true,
          residingDistrict: true,
          residingDistrictStatus: true,
          residingDistrictRejectReason: true,
          residingProvince: true,
          residingProvinceStatus: true,
          residingProvinceRejectReason: true,
          residingCountry: true,
          residingCountryStatus: true,
          residingCountryRejectReason: true,
          sameResidingPermanent: true,
          permanentAddressL1: true,
          permanentAddressL1Status: true,
          permanentAddressL1RejectReason: true,
          permanentAddressL2: true,
          permanentAddressL2Status: true,
          permanentAddressL2RejectReason: true,
          permanentCity: true,
          permanentCityStatus: true,
          permanentCityRejectReason: true,
          permanentDistrict: true,
          permanentDistrictStatus: true,
          permanentDistrictRejectReason: true,
          permanentProvince: true,
          permanentProvinceStatus: true,
          permanentProvinceRejectReason: true,
          permanentCountry: true,
          permanentCountryStatus: true,
          permanentCountryRejectReason: true,
          emgContactName: true,
          emgRelationship: true,
          emgContactNum: true,
          emgContactNumStatus: true,
          emgContactNumRejectReason: true,
          residingPin: true,
          residingPinStatus: true,
          residingPinRejectReason: true,
          permanentPin: true,
          permanentPinStatus: true,
          permanentPinRejectReason: true
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getApprovedData(tspId: number) {
    try {
      return await this.prisma.approvedContactData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          personalEmail: true,
          workEmail: true,
          mobileNumber: true,
          landlineNumber: true,
          residingAddressL1: true,
          residingAddressL2: true,
          residingCity: true,
          residingDistrict: true,
          residingProvince: true,
          residingCountry: true,
          sameResidingPermanent: true,
          permanentAddressL1: true,
          permanentAddressL2: true,
          permanentCity: true,
          permanentDistrict: true,
          permanentProvince: true,
          permanentCountry: true,
          emgContactName: true,
          emgRelationship: true,
          emgContactNum: true,
          residingPin: true,
          permanentPin: true
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveTempData(
    tspId: number,
    tempData: SaveContactDataDto,
    auditorId?: number
  ) {
    try {
      const now = new Date().toISOString();
      await this.prisma.hrisContactData.create({
        data: {
          tspId,
          ...tempData,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: auditorId ? now : null,
          auditedBy: auditorId ? auditorId : null
        }
      });
      await this.prisma.nTHRISProfileProgress.upsert({
        where: {
          tspId: tspId
        },
        update: {
          contactSectionFilled: true,
          lastFilledSection: 'contact'
        },
        create: {
          tspId: tspId,
          contactSectionFilled: true,
          lastFilledSection: 'contact'
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async saveApprovedData(auditorId: number, data) {
    try {
      const now = new Date().toISOString();
      return await this.prisma.approvedContactData.upsert({
        where: {
          tspId: data.tspId
        },
        update: {
          ...data,
          approvedAt: now,
          approvedBy: auditorId
        },
        create: {
          ...data,
          approvedAt: now,
          approvedBy: auditorId
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
