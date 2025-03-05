import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommonService {
  constructor(private prisma: PrismaService) {}

  async collectReasons(lastData: any, newData: any) {
    let lastDataReasons = {};
    let updatedStatus = {};

    if (lastData) {
      lastDataReasons = Object.entries(lastData)
        .filter(
          ([key, value]) => value !== null && key.includes('RejectReason')
        )
        .reduce((prev, [key, value]) => {
          prev[key] = value;
          return prev;
        }, {});

      updatedStatus = Object.entries(lastData)
        .filter(([key]) => key.includes('Status'))
        .map(([key, value]) => {
          const field = key.replace('Status', '');
          const newStatus =
            lastData[field] !== newData[field] ? 'pending' : value;
          return [key, newStatus];
        })
        .reduce((prev, [key, value]) => {
          prev[key as string] = value;
          return prev;
        }, {});
    }
    return { lastDataReasons, updatedStatus };
  }

  async collectAuditingFields(previousApprovedData, lastData, newData) {
    let notAuditingFields = {};
    let auditingFields = {};

    notAuditingFields = Object.entries(previousApprovedData)
      .filter(([key]) => !Object.keys(lastData).includes(key + 'Status'))
      .reduce((prev, [key, value]) => {
        prev[key as string] = newData[key];
        return prev;
      }, {} as any);

    auditingFields = Object.entries(previousApprovedData)
      .filter(([key]) => Object.keys(lastData).includes(key + 'Status'))
      .reduce((prev, [key, value]) => {
        if (newData[key + 'Status'] === 'approved') {
          prev[key as string] = newData[key];
        } else {
          prev[key as string] = value;
        }
        return prev;
      }, {} as any);
    return { notAuditingFields, auditingFields };
  }

  async updateNonTutorDirectory(
    nontutorId: number,
    auditorId: number,
    data: any
  ) {
    const now = new Date().toISOString();
    const saveData: any = {
      nic: data.nic ? data.nic : null,
      epf: data.epf ? data.epf : null,
      full_name: data.fullName ? data.fullName : null,
      short_name: data.shortName ? data.shortName : null,
      preferred_name: data.preferredName ? data.preferredName : null,
      status: data.employeeStatus ? data.employeeStatus : null,
      status_reason: data.employeeStatusReason
        ? data.employeeStatusReason
        : null,
      contract_type: data.employmentType ? data.employmentType : null,
      job_title: data.jobTitle ? data.jobTitle : null,
      management_level: data.managementLevel ? data.managementLevel : null,
      supervisor: data.reportingManager ? data.reportingManager : null,
      supervisor_id: data.managerId ? data.managerId : null,
      division: data.departmentLevel ? data.departmentLevel : null,
      division_head: data.reportingManager ? data.reportingManager : null,
      department: data.department ? data.department : null,
      contract_end_date: data.contractEndDate ? data.contractEndDate : null,
      gender: data.gender ? data.gender : null,
      dob: data.dob ? data.dob : null,
      religion: data.religion ? data.religion : null,
      marital_status: data.maritalState ? data.maritalState : null,
      current_address: data.residingAddressL1 ? data.residingAddressL1 : null,
      current_address_city: data.residingCity ? data.residingCity : null,
      permanat_address: data.permanentAddressL1
        ? data.permanentAddressL1
        : null,
      permanat_address_district: data.permanentDistrict
        ? data.permanentDistrict
        : null,
      permanent_address_province: data.permanentProvince
        ? data.permanentProvince
        : null,
      contact_no: data.mobileNumber ? data.mobileNumber : null,
      emergency_contact_person: data.emgContactName
        ? data.emgContactName
        : null,
      relationship_to_emergency_contact_person: data.emgRelationship
        ? data.emgRelationship
        : null,
      emergency_contact_number: data.emgContactNum ? data.emgContactNum : null,
      tsg_email: data.workEmail ? data.workEmail : null,
      personal_email_address: data.personalEmail ? data.personalEmail : null,
      bank: data.bankName ? data.bankName : null,
      bank_branch: data.bBranch ? data.bBranch : null,
      branch_code: data.bBranchCode ? data.bBranchCode : null,
      name_as_per_bank: data.bAccountName ? data.bAccountName : null,
      bank_account_no: data.bAccountNo ? data.bAccountNo : null,
      b_card: data.bCardStatus ? data.bCardStatus : null,
      work_email: data.workEmail ? data.workEmail : null,
      sub_department: data.subDepartment ? data.subDepartment : null,
      contract_start_date: data.contractStartDate
        ? data.contractStartDate
        : null,
      employment_type: data.employmentType ? data.employmentType : null,
      bank_swift_code: data.bBranchCode ? data.bBranchCode : null
    };
    Object.keys(saveData).forEach(
      (k) => saveData[k] == null && delete saveData[k]
    );
    console.log(saveData);
    return await this.prisma.nonTutorDirectory.upsert({
      where: {
        hr_tsp_id: nontutorId
      },
      update: {
        ...saveData,
        update_at: now,
        updated_by: auditorId.toString()
      },
      create: {
        ...saveData,
        update_at: now,
        updated_by: auditorId.toString()
      }
    });
  }
}
