import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AuditorSubmitPersonalDetailsDto,
  PersonalDataDto,
  SaveBioDto
} from './personal.dto';
import moment = require('moment');

@Injectable()
export class PersonalService {
  constructor(private prisma: PrismaService) {}

  async fetchPersonalDetails(tspId: number) {
    try {
      const details = await this.getTempData(tspId);
      const approvedDetails = await this.getApprovedData(tspId);
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

  async savePersonalDetails(tspId: number, data: PersonalDataDto) {
    const lastData = await this.getTempData(tspId);
    let lastDataReasons = {};
    let updatedStatus = {};
    let gotPendingFields = false;

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
          const newStatus = lastData[field] !== data[field] ? 'pending' : value;
          gotPendingFields =
            (field === 'workEmail' && newStatus === 'pending') ||
            gotPendingFields;
          return [key, newStatus];
        })
        .reduce((prev, [key, value]) => {
          prev[key as string] = value;
          return prev;
        }, {});
    }
    const tempData = {
      ...data,
      ...lastDataReasons,
      ...updatedStatus,
      idLanguage: data.idLanguage ? data.idLanguage.join(',') : ''
    };
    await this.saveTempData(tspId, tempData, null);
    const details = await this.getTempData(tspId);
    return details;
  }

  async auditorSubmitPersonalDetails(
    auditorId: number,
    data: AuditorSubmitPersonalDetailsDto
  ) {
    const { nonTutorId, ...rest } = data;
    const lastData = await this.getTempData(nonTutorId);
    const tempData = {
      ...rest,
      idLanguage: data.idLanguage ? data.idLanguage.join(',') : ''
    };
    await this.saveTempData(nonTutorId, tempData, auditorId);

    let previousApprovedData = await this.getApprovedData(nonTutorId);

    if (!previousApprovedData) {
      previousApprovedData = await this.saveApprovedData(
        auditorId,
        nonTutorId,
        {}
      );
    }

    let notAuditingFields = {};
    let auditingFields = {};
    if (previousApprovedData && lastData) {
      notAuditingFields = Object.entries(previousApprovedData)
        .filter(([key]) => !Object.keys(lastData).includes(key + 'Status'))
        .reduce((prev, [key, value]) => {
          prev[key as string] = data[key];
          return prev;
        }, {} as any);

      auditingFields = Object.entries(previousApprovedData)
        .filter(([key]) => Object.keys(lastData).includes(key + 'Status'))
        .reduce((prev, [key, value]) => {
          if (data[key + 'Status'] === 'approved') {
            prev[key as string] = data[key];
          } else {
            prev[key as string] = value;
          }
          return prev;
        }, {} as any);
    }

    const saveData = {
      ...notAuditingFields,
      ...auditingFields
    };
    await this.saveApprovedData(auditorId, nonTutorId, saveData);

    const details = await this.getTempData(data.nonTutorId);
    const approvedDetails = await this.getApprovedData(data.nonTutorId);
    return { details, approvedDetails };
  }

  async getTempData(tspId: number) {
    const data = await this.prisma.hrisPersonalData.findFirst({
      where: {
        tspId
      },
      orderBy: {
        id: 'desc'
      },
      select: {
        preferredName: true,
        firstName: true,
        firstNameRejectReason: true,
        firstNameStatus: true,
        surname: true,
        surnameRejectReason: true,
        surnameStatus: true,
        fullName: true,
        fullNameRejectReason: true,
        fullNameStatus: true,
        nameWithInitials: true,
        nameWithInitialsRejectReason: true,
        nameWithInitialsStatus: true,
        age: true,
        ppUrl: true,
        ppUrlRejectReason: true,
        ppUrlStatus: true,
        gender: true,
        religion: true,
        dob: true,
        dobRejectReason: true,
        dobStatus: true,
        birthCertificateUrl: true,
        birthCertificateUrlStatus: true,
        typeOfId: true,
        typeOfIdRejectReason: true,
        typeOfIdStatus: true,
        idLanguage: true,
        idLanguageRejectReason: true,
        idLanguageStatus: true,
        nic: true,
        nicRejectReason: true,
        nicStatus: true,
        passportCountry: true,
        passportCountryRejectReason: true,
        passportCountryStatus: true,
        passportExpirationDate: true,
        passportExpirationDateRejectReason: true,
        passportExpirationDateStatus: true,
        nicUrl: true,
        nicUrlRejectReason: true,
        nicUrlStatus: true,
        maritalState: true,
        includeFamilyInInsurance: true,
        whomIncludeInInsurance: true,
        spouseName: true,
        spouseNic: true,
        spouseDob: true,
        marriageCertificate: true,
        marriageCertificateStatus: true,
        haveAffiliations: true,
        haveChildren: true,
        xfamily_affiliations: {
          select: {
            affiliateName: true,
            affiliateRelationship: true,
            affiliateJob: true
          }
        },
        xfamily_members_children: {
          select: {
            childDob: true,
            childName: true
          }
        },
        xfamily_members_parents: {
          select: {
            relationship: true,
            memberDob: true,
            memberName: true,
            memberNic: true
          }
        }
      }
    });
    if (data && data.xfamily_affiliations.length == 0) {
      data.xfamily_affiliations = null;
    }
    if (data && data.xfamily_members_children.length == 0) {
      data.xfamily_members_children = null;
    }
    if (data && data.xfamily_members_parents.length == 0) {
      data.xfamily_members_parents = null;
    }
    if (data) {
      return {
        ...data,
        idLanguage: data.idLanguage ? data.idLanguage.split(',') : [],
        tspId: tspId
      };
    } else {
      return data;
    }
  }

  async getApprovedData(tspId: number) {
    const data = await this.prisma.approvedPersonalData.findUnique({
      where: {
        tspId: tspId
      },
      select: {
        fullName: true,
        nameWithInitials: true,
        firstName: true,
        surname: true,
        gender: true,
        dob: true,
        birthCertificateUrl: true,
        religion: true,
        maritalState: true,
        spouseName: true,
        haveChildren: true,
        nic: true,
        nicUrl: true,
        haveAffiliations: true,
        shortName: true,
        age: true,
        ppUrl: true,
        nationality: true,
        typeOfId: true,
        passportCountry: true,
        passportExpirationDate: true,
        haveRtwDocument: true,
        rtwDocumentUrl: true,
        haveRtwExpirationDate: true,
        rtwExpirationDate: true,
        idLanguage: true
      }
    });
    if (data) {
      return {
        ...data,
        idLanguage: data.idLanguage ? data.idLanguage.split(',') : [],
        tspId: tspId
      };
    } else {
      return data;
    }
  }

  async saveTempData(tspId, data, auditorId?) {
    const {
      xfamily_affiliations,
      xfamily_members_parents,
      xfamily_members_children,
      ...rest
    } = data;
    const now = new Date().toISOString();
    await this.prisma.$transaction(async (tx) => {
      const personalData = await tx.hrisPersonalData.create({
        data: {
          tspId,
          ...rest,
          shortName: (rest.firstName + ' ' + rest.surname).trim(),
          age: rest.dob ? moment().diff(moment(rest.dob), 'years') : null,
          dob: new Date(rest.dob),
          passportExpirationDate:
            rest.passportExpirationDate !== ''
              ? new Date(rest.passportExpirationDate).toISOString()
              : null,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: auditorId ? now : null,
          auditedBy: auditorId ? auditorId : null
        },
        select: {
          id: true
        }
      });
      //console.log(rest);
      if (rest.haveAffiliations == 'yes' && xfamily_affiliations.length != 0) {
        await tx.xfamilyAffiliations.createMany({
          data: data.xfamily_affiliations.map((affiliation) => {
            return {
              pdId: personalData.id,
              userId: tspId,
              ...affiliation,
              updatedAt: now,
              updatedBy: tspId
            };
          })
        });
      }

      if (
        (rest.whomIncludeInInsurance == 'Include Both' ||
          rest.whomIncludeInInsurance == 'Include your Parents') &&
        xfamily_members_parents.length != 0
      ) {
        await tx.xfamilyMembersParents.createMany({
          data: xfamily_members_parents.map((affiliation) => {
            return {
              pdId: personalData.id,
              userId: tspId,
              ...affiliation,
              updatedAt: now,
              updatedBy: tspId
            };
          })
        });
      }

      if (rest.haveChildren == 'yes' && xfamily_members_children.length != 0) {
        await tx.xfamilyMembersChildren.createMany({
          data: xfamily_members_children.map((affiliation) => {
            return {
              pdId: personalData.id,
              userId: tspId,
              ...affiliation,
              updatedAt: now,
              updatedBy: tspId
            };
          })
        });
      }

      await tx.nTHRISProfileProgress.upsert({
        where: {
          tspId: tspId
        },
        update: {
          personalSectionFilled: true,
          lastFilledSection: 'personal'
        },
        create: {
          tspId: tspId,
          personalSectionFilled: true,
          lastFilledSection: 'personal'
        }
      });
    });
  }

  async saveApprovedData(auditorId: number, nonTutorId: number, data) {
    const now = new Date().toISOString();
    //console.log(data);
    const approvedData = await this.prisma.approvedPersonalData.upsert({
      where: {
        tspId: nonTutorId
      },
      update: {
        ...data,
        shortName: (data.firstName + ' ' + data.surname).trim(),
        age: data.dob ? moment().diff(moment(data.dob), 'years') : null,
        dob: new Date(data.dob),
        passportExpirationDate:
          data.passportExpirationDate !== ''
            ? new Date(data.passportExpirationDate).toISOString()
            : null,
        idLanguage: data.idLanguage ? data.idLanguage.join(',') : '',
        approvedAt: now,
        approvedBy: auditorId
      },
      create: {
        ...data,
        age: data.dob ? moment().diff(moment(data.dob), 'years') : null,
        tspId: nonTutorId,
        idLanguage: data.idLanguage ? data.idLanguage.join(',') : '',
        approvedAt: now,
        approvedBy: auditorId
      }
    });
    //return approvedData;
    return {
      ...approvedData,
      idLanguage: approvedData.idLanguage
        ? approvedData.idLanguage.split(',')
        : [],
      tspId: nonTutorId
    };
  }

  async saveBio(tspId: number, data: SaveBioDto) {
    const approvedData = await this.prisma.approvedPersonalData.upsert({
      where: {
        tspId: tspId
      },
      update: {
        ...data
      },
      create: {
        ...data,
        tspId: tspId
      }
    });
    return approvedData;
  }

  async getBio(tspId: number) {
    try {
      const data = await this.prisma.approvedPersonalData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          bio: true
        }
      });
      return data;
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
