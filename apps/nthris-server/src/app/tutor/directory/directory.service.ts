import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DirectorySearchDto,
  NontutorDetailDto,
  NontutorDto
} from './directory.dto';
import { MailService } from '../../mail/mail.service';
import { SettingsService } from '../../settings/settings.service';

@Injectable()
export class DirectoryService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private settingsService: SettingsService
  ) {}

  async userList(params: DirectorySearchDto) {
    try {
      const where = {
        level: { in: [1, 2] },
        approved_personal_data: {
          ...(params.fullName && { fullName: { startsWith: params.fullName } }),
          ...(params.gender && { gender: params.gender }),
          ...(params.nameWithInitials && {
            nameWithInitials: { startsWith: params.nameWithInitials }
          }),
          ...(params.nic && { nic: params.nic }),
          ...(params.religion && { religion: params.religion })
        },
        ApprovedJobRequisition: {
          ...(params.supervisor && {
            supervisorName: { startsWith: params.supervisor }
          }),
          ...(params.division && { division: params.division }),
          ...(params.department && { department: params.department })
        },
        approved_contact_data: {
          ...(params.contactNumber && { mobileNumber: params.contactNumber }),
          ...(params.workEmail && { workEmail: params.workEmail }),
          ...(params.personalEmail && { personalEmail: params.personalEmail })
        },
        NTProfile: {
          ...(params.tspId && { hr_tsp_id: Number(params.tspId) }),
          ...(params.status && { status: params.status }),
          ...(params.preferredName && {
            prefered_name: { startsWith: params.preferredName }
          }),
          ...(params.subDepartment && { sub_department: params.subDepartment }),
          ...(params.managementLevel && {
            management_level: params.managementLevel
          }),
          ...(params.location && { location: params.location }),
          ...(params.resignedDate && {
            resignation_given_date: params.resignedDate
          })
        },
        approved_contract_data: {
          ...(params.contractNumber && {
            contract_no: Number(params.contractNumber)
          }),
          ...(params.contractType && { contract_type: params.contractType }),
          ...(params.contractStartDate && {
            contract_start_d: {
              lte: new Date(params.contractStartDateTo),
              get: new Date(params.contractStartDate)
            }
          }),
          ...(params.contractEndDate && {
            contract_end_d: {
              lte: new Date(params.contractEndDateTo),
              get: new Date(params.contractEndDate)
            }
          })
        },
        approved_right2work_data: {
          ...(params.pccStatus && { pccState: params.pccStatus })
        }
      };

      const totalCount = await this.prisma.user.count({
        where
      });

      const page = params.page ? Number(params.page) : 1;
      const perPage = params.perPage ? Number(params.perPage) : 10;
      const users = await this.prisma.user.findMany({
        where,
        include: {
          approved_personal_data: true,
          ApprovedJobRequisition: true,
          approved_contact_data: true
        },
        skip: (page - 1) * perPage,
        take: perPage
      });

      const convertedData: Promise<NontutorDto>[] = users.map(async (obj) => {
        const pPicture = obj.approved_personal_data.ppUrl
          ? await this.settingsService.getSignedUrl(
              obj.approved_personal_data.ppUrl
            )
          : null;

        return {
          id: obj.tsp_id,
          tspId: obj.tsp_id,
          pPicture: pPicture,
          name: obj.approved_personal_data
            ? obj.approved_personal_data.fullName
            : null,
          designation: obj.ApprovedJobRequisition
            ? obj.ApprovedJobRequisition.jobTitle
            : null,
          department: obj.ApprovedJobRequisition
            ? obj.ApprovedJobRequisition.department
            : null,
          division: obj.ApprovedJobRequisition
            ? obj.ApprovedJobRequisition.division
            : null,
          phoneNumber: obj.approved_contact_data
            ? obj.approved_contact_data.mobileNumber
            : null,
          email: obj.username,
          address: obj.approved_contact_data
            ? obj.approved_contact_data.permanentAddressL1
            : null,
          lineManager: obj.ApprovedJobRequisition
            ? obj.ApprovedJobRequisition.supervisorName
            : null,
          country: obj.approved_contact_data
            ? obj.approved_contact_data.permanentCountry
            : null
        };
      });
      const resolvedConvertedData: NontutorDto[] = await Promise.all(
        convertedData
      );
      return {
        success: true,
        data: resolvedConvertedData,
        total: totalCount
      };
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

  async userDetail(tspId: number) {
    try {
      const data = await this.prisma.user.findFirst({
        where: {
          tsp_id: tspId
        },
        select: {
          username: true,
          level: true,
          approved_personal_data: {
            select: {
              fullName: true,
              nameWithInitials: true,
              shortName: true,
              dob: true,
              nationality: true,
              nic: true,
              gender: true,
              religion: true,
              ppUrl: true
            }
          },
          approved_contact_data: {
            select: {
              residingCountry: true,
              residingDistrict: true,
              residingProvince: true,
              mobileNumber: true,
              workEmail: true,
              personalEmail: true
            }
          },
          ApprovedJobRequisition: {
            select: {
              jobTitle: true,
              supervisorName: true,
              division: true,
              department: true
            }
          },
          approved_contract_data: {
            select: {
              contract_no: true,
              contract_type: true,
              contract_start_d: true,
              contract_end_d: true
            }
          },
          NTProfile: {
            select: {
              epf: true,
              sub_department: true,
              management_level: true,
              location: true,
              employment_type: true,
              resignation_given_date: true,
              lwd: true,
              resignation_withdrawal_date: true,
              preferred_name: true
            }
          },
          approved_right2work_data: {
            select: {
              pccState: true
            }
          }
        }
      });
      const convertedData: NontutorDetailDto = {
        tspId: tspId,
        fullName: data.approved_personal_data
          ? data.approved_personal_data.fullName
          : null,
        nameWithInitials: data.approved_personal_data
          ? data.approved_personal_data.nameWithInitials
          : null,
        shortName: data.approved_personal_data
          ? data.approved_personal_data.shortName
          : null,
        dob: data.approved_personal_data
          ? new Date(data.approved_personal_data.dob).toISOString()
          : null,
        nationality: data.approved_personal_data
          ? data.approved_personal_data.nationality
          : null,
        nic: data.approved_personal_data
          ? data.approved_personal_data.nic
          : null,
        gender: data.approved_personal_data
          ? data.approved_personal_data.gender
          : null,
        religion: data.approved_personal_data
          ? data.approved_personal_data.religion
          : null,
        ppUrl: data.approved_personal_data.ppUrl
          ? await this.settingsService.getSignedUrl(
              data.approved_personal_data.ppUrl
            )
          : null,
        residingCountry: data.approved_contact_data
          ? data.approved_contact_data.residingCountry
          : null,
        residingDistrict: data.approved_contact_data
          ? data.approved_contact_data.residingDistrict
          : null,
        residingProvince: data.approved_contact_data
          ? data.approved_contact_data.residingProvince
          : null,
        mobileNumber: data.approved_contact_data
          ? data.approved_contact_data.mobileNumber
          : null,
        workEmail: data.approved_contact_data
          ? data.approved_contact_data.workEmail
          : null,
        personalEmail: data.approved_contact_data
          ? data.approved_contact_data.personalEmail
          : null,
        jobTitle: data.ApprovedJobRequisition
          ? data.ApprovedJobRequisition.jobTitle
          : null,
        supervisorName: data.ApprovedJobRequisition
          ? data.ApprovedJobRequisition.supervisorName
          : null,
        division: data.ApprovedJobRequisition
          ? data.ApprovedJobRequisition.division
          : null,
        department: data.ApprovedJobRequisition
          ? data.ApprovedJobRequisition.department
          : null,
        contractNo: data.approved_contract_data
          ? data.approved_contract_data.contract_no
          : null,
        contractType: data.approved_contract_data
          ? data.approved_contract_data.contract_type
          : null,
        contractStartDate: data.approved_contract_data
          ? new Date(data.approved_contract_data.contract_start_d).toISOString()
          : null,
        contractEndDate: data.approved_contract_data
          ? new Date(data.approved_contract_data.contract_end_d).toISOString()
          : null,
        epf: data.NTProfile ? data.NTProfile.epf : null,
        subDepartment: data.NTProfile ? data.NTProfile.sub_department : null,
        managementLevel: data.NTProfile
          ? data.NTProfile.management_level
          : null,
        location: data.NTProfile ? data.NTProfile.location : null,
        employmentType: data.NTProfile ? data.NTProfile.employment_type : null,
        resignationGivenDate: data.NTProfile
          ? data.NTProfile.resignation_given_date
          : null,
        lastWorkingDate: data.NTProfile ? data.NTProfile.lwd : null,
        resignationWithdrawalDate: data.NTProfile
          ? data.NTProfile.resignation_withdrawal_date
          : null,
        preferredName: data.NTProfile ? data.NTProfile.preferred_name : null,
        pccStatus: data.NTProfile
          ? data.approved_right2work_data.pccState
          : null
      };

      return { success: true, data: convertedData };
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
