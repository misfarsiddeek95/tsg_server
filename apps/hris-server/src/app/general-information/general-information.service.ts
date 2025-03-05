import { HttpException, Injectable } from '@nestjs/common';
import moment = require('moment');
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import {
  SubmitPersonalDetailsDto,
  SubmitContactDetailsDto,
  AuditorSubmitPersonalDetailsDto,
  AuditorSubmitContactDetailsDto
} from './general-information.dto';

@Injectable()
export class GeneralInformationService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  //Tutor: Fetch Personal Information Details
  async fetchPersonalDetails(tspId: number) {
    try {
      const approvedDetails = await this.prisma.approvedPersonalData.findUnique(
        {
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
        }
      );

      const details = await this.prisma.hrisPersonalData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          fullName: true,
          fullNameStatus: true,
          fullNameRejectReason: true,
          nameWithInitials: true,
          nameWithInitialsStatus: true,
          nameWithInitialsRejectReason: true,
          firstName: true,
          firstNameStatus: true,
          firstNameRejectReason: true,
          surname: true,
          surnameStatus: true,
          surnameRejectReason: true,
          gender: true,
          dob: true,
          dobStatus: true,
          dobRejectReason: true,
          birthCertificateUrl: true,
          birthCertificateUrlStatus: true,
          birthCertificateUrlRejectReason: true,
          religion: true,
          maritalState: true,
          spouseName: true,
          haveChildren: true,
          nic: true,
          nicStatus: true,
          nicRejectReason: true,
          nicUrl: true,
          nicUrlStatus: true,
          nicUrlRejectReason: true,
          haveAffiliations: true,
          shortName: true,
          age: true,
          ppUrl: true,
          ppUrlStatus: true,
          ppUrlRejectReason: true,
          nationality: true,
          typeOfId: true,
          typeOfIdStatus: true,
          typeOfIdRejectReason: true,
          passportCountry: true,
          passportCountryStatus: true,
          passportCountryRejectReason: true,
          passportExpirationDate: true,
          passportExpirationDateStatus: true,
          passportExpirationDateRejectReason: true,
          haveRtwDocument: true,
          haveRtwDocumentStatus: true,
          haveRtwDocumentRejectReason: true,
          rtwDocumentUrl: true,
          rtwDocumentUrlStatus: true,
          rtwDocumentUrlRejectReason: true,
          haveRtwExpirationDate: true,
          haveRtwExpirationDateStatus: true,
          haveRtwExpirationDateRejectReason: true,
          rtwExpirationDate: true,
          rtwExpirationDateStatus: true,
          rtwExpirationDateRejectReason: true,
          idLanguage: true,
          idLanguageStatus: true,
          idLanguageRejectReason: true,
          xfamily_affiliations: {
            select: {
              affiliateName: true,
              affiliateRelationship: true,
              affiliateJob: true
            }
          }
        }
      });
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

  /**
   *  TODO: Personal
   *  - take last record belongs to candidate - tspId
   *
   *  - shortname firstname + ' ' + surname
   *  - calculate age
   * - clear nameOfSpouce if maritalState is NOT Married
   *
   *  - copy last reasons to the new row
   *  - change status of related status field to pending if last field value with current data field value
   */

  //Tutor: Submit Personal Information Details
  async submitPersonalDetails(tspId: number, data: SubmitPersonalDetailsDto) {
    const {
      id,
      type,
      country,
      confirm,
      xfamily_affiliations,
      profileStatus,
      ...rest
    } = data;

    const lastData = await this.prisma.hrisPersonalData.findFirst({
      where: {
        tspId
      },
      orderBy: {
        id: 'desc'
      }
    });

    let lastDataReasons = {};
    let updatedStatus = {};
    let gotPendingFields = false; //logic to trigger email notification to hris@ticketsthirdspaceportal.com

    if (lastData) {
      lastDataReasons = Object.entries(lastData)
        .filter(
          ([key, value]) => value !== null && key.includes('RejectReason')
        )
        .reduce((prev, [key, value]) => {
          prev[key] = value;
          return prev;
        }, {});

      const dateTimeFields = [
        'dob',
        'passportExpirationDate',
        'rtwExpirationDate'
      ];

      updatedStatus = Object.entries(lastData)
        .filter(([key]) => key.includes('Status'))
        .map(([key, value]) => {
          const field = key.replace('Status', '');

          const newStatus =
            dateTimeFields.includes(field) && !!lastData[field]
              ? lastData[field].toISOString() !== data[field]
                ? 'pending'
                : value
              : lastData[field] !== data[field]
              ? 'pending'
              : value;
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
    const now = new Date().toISOString();

    return this.prisma.$transaction(async (tx) => {
      const personalData = await tx.hrisPersonalData.create({
        data: {
          tspId,
          ...rest,
          shortName: (rest.firstName + ' ' + rest.surname).trim(),
          age: rest.dob ? moment().diff(moment(rest.dob), 'years') : null,

          passportExpirationDate:
            rest.passportExpirationDate !== ''
              ? rest.passportExpirationDate
              : null,
          rtwExpirationDate:
            rest.rtwExpirationDate !== '' ? rest.rtwExpirationDate : null,
          ...lastDataReasons,
          ...updatedStatus,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: null,
          auditedBy: null
        },
        select: {
          id: true,
          fullName: true,
          fullNameStatus: true,
          fullNameRejectReason: true,
          nameWithInitials: true,
          nameWithInitialsStatus: true,
          nameWithInitialsRejectReason: true,
          firstName: true,
          firstNameStatus: true,
          firstNameRejectReason: true,
          surname: true,
          surnameStatus: true,
          surnameRejectReason: true,
          gender: true,
          dob: true,
          dobStatus: true,
          dobRejectReason: true,
          birthCertificateUrl: true,
          birthCertificateUrlStatus: true,
          birthCertificateUrlRejectReason: true,
          religion: true,
          maritalState: true,
          spouseName: true,
          haveChildren: true,
          nic: true,
          nicStatus: true,
          nicRejectReason: true,
          nicUrl: true,
          nicUrlStatus: true,
          nicUrlRejectReason: true,
          haveAffiliations: true,
          shortName: true,
          age: true,
          ppUrl: true,
          ppUrlStatus: true,
          ppUrlRejectReason: true,
          nationality: true,
          typeOfId: true,
          typeOfIdStatus: true,
          typeOfIdRejectReason: true,
          passportCountry: true,
          passportCountryStatus: true,
          passportCountryRejectReason: true,
          passportExpirationDate: true,
          passportExpirationDateStatus: true,
          passportExpirationDateRejectReason: true,
          haveRtwDocument: true,
          haveRtwDocumentStatus: true,
          haveRtwDocumentRejectReason: true,
          rtwDocumentUrl: true,
          rtwDocumentUrlStatus: true,
          rtwDocumentUrlRejectReason: true,
          haveRtwExpirationDate: true,
          haveRtwExpirationDateStatus: true,
          haveRtwExpirationDateRejectReason: true,
          rtwExpirationDate: true,
          rtwExpirationDateStatus: true,
          rtwExpirationDateRejectReason: true,
          idLanguage: true,
          idLanguageStatus: true,
          idLanguageRejectReason: true
        }
      });

      await tx.approvedPersonalData.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
        }
      });

      !['yes', 'Yes'].includes(data.haveAffiliations)
        ? null
        : await tx.xfamilyAffiliations.createMany({
            data: xfamily_affiliations.map((affiliation) => {
              return {
                pdId: personalData.id,
                userId: tspId,
                ...affiliation,
                updatedAt: now,
                updatedBy: tspId
              };
            })
          });

      const fieldsMandatory = [
        'fullName',
        'nameWithInitials',
        'firstName',
        'surname',
        'gender',
        'dob',
        'religion',
        'maritalState',
        'haveChildren',
        'haveAffiliations',
        'nic',
        'nicUrl',
        // 'ppUrl',
        'typeOfId',
        'idLanguage'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (personalData[curr] && personalData[curr] !== '' ? 1 : 0);
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          personalDataEmp: filledMandatoryFieldCount,
          personalDataCount: `${filledMandatoryFieldCount}/14`
        },
        create: {
          tspId,
          personalDataEmp: filledMandatoryFieldCount,
          personalDataCount: `${filledMandatoryFieldCount}/14`
        }
      });

      const details = await tx.hrisPersonalData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          fullName: true,
          fullNameStatus: true,
          fullNameRejectReason: true,
          nameWithInitials: true,
          nameWithInitialsStatus: true,
          nameWithInitialsRejectReason: true,
          firstName: true,
          firstNameStatus: true,
          firstNameRejectReason: true,
          surname: true,
          surnameStatus: true,
          surnameRejectReason: true,
          gender: true,
          dob: true,
          dobStatus: true,
          dobRejectReason: true,
          birthCertificateUrl: true,
          birthCertificateUrlStatus: true,
          birthCertificateUrlRejectReason: true,
          religion: true,
          maritalState: true,
          spouseName: true,
          haveChildren: true,
          nic: true,
          nicStatus: true,
          nicRejectReason: true,
          nicUrl: true,
          nicUrlStatus: true,
          nicUrlRejectReason: true,
          haveAffiliations: true,
          shortName: true,
          age: true,
          ppUrl: true,
          ppUrlStatus: true,
          ppUrlRejectReason: true,
          nationality: true,
          typeOfId: true,
          typeOfIdStatus: true,
          typeOfIdRejectReason: true,
          passportCountry: true,
          passportCountryStatus: true,
          passportCountryRejectReason: true,
          passportExpirationDate: true,
          passportExpirationDateStatus: true,
          passportExpirationDateRejectReason: true,
          haveRtwDocument: true,
          haveRtwDocumentStatus: true,
          haveRtwDocumentRejectReason: true,
          rtwDocumentUrl: true,
          rtwDocumentUrlStatus: true,
          rtwDocumentUrlRejectReason: true,
          haveRtwExpirationDate: true,
          haveRtwExpirationDateStatus: true,
          haveRtwExpirationDateRejectReason: true,
          rtwExpirationDate: true,
          rtwExpirationDateStatus: true,
          rtwExpirationDateRejectReason: true,
          idLanguage: true,
          idLanguageStatus: true,
          idLanguageRejectReason: true,
          xfamily_affiliations: {
            select: {
              affiliateName: true,
              affiliateRelationship: true,
              affiliateJob: true
            }
          }
        }
      });

      const hrisProgressFetched = await tx.user.findUnique({
        where: {
          tsp_id: tspId
        },
        include: {
          user_hris_progress: {
            select: {
              profileStatus: true
            }
          },
          approved_personal_data: {
            select: {
              shortName: true
            }
          },
          approved_contact_data: {
            select: {
              workEmail: true
            }
          }
        }
      });
      if (
        hrisProgressFetched &&
        hrisProgressFetched.user_hris_progress &&
        hrisProgressFetched.user_hris_progress.profileStatus &&
        hrisProgressFetched.user_hris_progress.profileStatus === 'active' &&
        gotPendingFields
      ) {
        // notify hris@ticketsthirdspaceportal.com on tutor updating key profile data
        await this.mailService.sendNotification2Ticketsthirdspaceportal(
          tspId + '',
          hrisProgressFetched?.approved_personal_data?.shortName ?? '',
          hrisProgressFetched?.approved_contact_data?.workEmail ?? '',
          'Contact Data - Work Email'
        );
      }

      return details;
    });
  }

  //Auditor: Submit Personal Information Details
  async auditorSubmitPersonalInformation(
    tspId: number,
    data: AuditorSubmitPersonalDetailsDto
  ) {
    const {
      id,
      type,
      country,
      confirm,
      candidateId,
      xfamily_affiliations,
      profileStatus,
      ...rest
    } = data;

    const lastData = await this.prisma.hrisPersonalData.findFirst({
      where: {
        tspId: candidateId
      },
      orderBy: {
        id: 'desc'
      }
    });
    const now = new Date().toISOString();

    return this.prisma.$transaction(async (tx) => {
      const personalData = await tx.hrisPersonalData.create({
        data: {
          tspId: candidateId,
          ...rest,
          shortName: (rest.firstName + ' ' + rest.surname).trim(),
          age: rest.dob ? moment().diff(moment(rest.dob), 'years') : null,
          passportExpirationDate:
            rest.passportExpirationDate !== ''
              ? rest.passportExpirationDate
              : null,
          rtwExpirationDate:
            rest.rtwExpirationDate !== '' ? rest.rtwExpirationDate : null,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
        },
        select: {
          id: true,
          fullName: true,
          fullNameStatus: true,
          fullNameRejectReason: true,
          nameWithInitials: true,
          nameWithInitialsStatus: true,
          nameWithInitialsRejectReason: true,
          firstName: true,
          firstNameStatus: true,
          firstNameRejectReason: true,
          surname: true,
          surnameStatus: true,
          surnameRejectReason: true,
          gender: true,
          dob: true,
          dobStatus: true,
          dobRejectReason: true,
          birthCertificateUrl: true,
          birthCertificateUrlStatus: true,
          birthCertificateUrlRejectReason: true,
          religion: true,
          maritalState: true,
          spouseName: true,
          haveChildren: true,
          nic: true,
          nicStatus: true,
          nicRejectReason: true,
          nicUrl: true,
          nicUrlStatus: true,
          nicUrlRejectReason: true,
          haveAffiliations: true,
          shortName: true,
          age: true,
          ppUrl: true,
          ppUrlStatus: true,
          ppUrlRejectReason: true,
          nationality: true,
          typeOfId: true,
          typeOfIdStatus: true,
          typeOfIdRejectReason: true,
          passportCountry: true,
          passportCountryStatus: true,
          passportCountryRejectReason: true,
          passportExpirationDate: true,
          passportExpirationDateStatus: true,
          passportExpirationDateRejectReason: true,
          haveRtwDocument: true,
          haveRtwDocumentStatus: true,
          haveRtwDocumentRejectReason: true,
          rtwDocumentUrl: true,
          rtwDocumentUrlStatus: true,
          rtwDocumentUrlRejectReason: true,
          haveRtwExpirationDate: true,
          haveRtwExpirationDateStatus: true,
          haveRtwExpirationDateRejectReason: true,
          rtwExpirationDate: true,
          rtwExpirationDateStatus: true,
          rtwExpirationDateRejectReason: true,
          idLanguage: true,
          idLanguageStatus: true,
          idLanguageRejectReason: true
        }
      });

      !['yes', 'Yes'].includes(data.haveAffiliations)
        ? null
        : await tx.xfamilyAffiliations.createMany({
            data: xfamily_affiliations.map((affiliation) => {
              return {
                pdId: personalData.id,
                userId: candidateId,
                ...affiliation,
                updatedAt: now,
                updatedBy: tspId
              };
            })
          });

      let previousApprovedData = await tx.approvedPersonalData.findUnique({
        where: {
          tspId: candidateId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedPersonalData.create({
          data: {
            tspId: candidateId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }

      let notAuditingFields = {};
      let auditingFields = {};
      let customAuditingFields = {};
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

        // custom logic to handle fields that depend on other fields for audit approved values
        if (data.country) {
          // based on dobStatus, approve related fields
          // based on firstNameStatus & surnameStatus, approve related fields
          customAuditingFields = {
            ...customAuditingFields,
            age:
              rest.dobStatus === 'approved'
                ? rest.dob
                  ? moment().diff(moment(rest['dob']), 'years')
                  : null
                : previousApprovedData.age,
            shortName:
              rest.firstNameStatus === 'approved' &&
              rest.surnameStatus === 'approved'
                ? rest.firstName + ' ' + rest.surname
                : previousApprovedData.shortName,
            birthCertificateUrl: rest.birthCertificateUrl,
            nationality: previousApprovedData.nationality
          };
        }
      }

      await tx.approvedPersonalData.update({
        where: { tspId: candidateId },
        data: {
          ...notAuditingFields,
          ...auditingFields,
          ...customAuditingFields,
          updatedFlag: 3,
          approvedAt: now,
          approvedBy: tspId
        }
      });

      const fieldsMandatory = [
        'fullName',
        'nameWithInitials',
        'firstName',
        'surname',
        'gender',
        'dob',
        'religion',
        'maritalState',
        'haveChildren',
        'haveAffiliations',
        'nic',
        'nicUrl',
        // 'ppUrl',
        'typeOfId',
        'idLanguage'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (personalData[curr] && personalData[curr] !== '' ? 1 : 0);
      }, 0);

      const fieldsAudited = [
        'fullNameStatus',
        'nameWithInitialsStatus',
        'firstNameStatus',
        'surnameStatus',
        'dobStatus',
        'nicStatus',
        'nicUrlStatus',
        'ppUrlStatus',
        'typeOfIdStatus',
        'idLanguageStatus'
      ];

      (personalData as any)['typeOfId'] === 'Passport' &&
        fieldsAudited.push(
          'passportCountryStatus',
          'passportExpirationDateStatus'
        );
      (personalData as any)['typeOfId'] === 'Passport' &&
        (personalData as any)['country'] !==
          (personalData as any)['passportCountry'] &&
        fieldsAudited.push('haveRtwDocumentStatus');

      (personalData as any)['haveRtwDocument'] === 'Yes' &&
        fieldsAudited.push(
          'rtwDocumentUrlStatus',
          'haveRtwExpirationDateStatus'
        );
      (personalData as any)['haveRtwExpirationDate'] === 'Yes' &&
        fieldsAudited.push('rtwExpirationDateStatus');

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (personalData[curr] &&
          ['approved', 'rejected'].includes(personalData[curr])
            ? 1
            : 0)
        );
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId: candidateId
        },
        update: {
          personalDataEmp: filledMandatoryFieldCount,
          personalDataAuditor: auditedFieldCount,
          personalDataCount: `${filledMandatoryFieldCount}/14`
        },
        create: {
          tspId,
          personalDataEmp: filledMandatoryFieldCount,
          personalDataAuditor: auditedFieldCount,
          personalDataCount: `${filledMandatoryFieldCount}/14`
        }
      });

      const details = await tx.hrisPersonalData.findFirst({
        where: {
          tspId: candidateId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          fullName: true,
          fullNameStatus: true,
          fullNameRejectReason: true,
          nameWithInitials: true,
          nameWithInitialsStatus: true,
          nameWithInitialsRejectReason: true,
          firstName: true,
          firstNameStatus: true,
          firstNameRejectReason: true,
          surname: true,
          surnameStatus: true,
          surnameRejectReason: true,
          gender: true,
          dob: true,
          dobStatus: true,
          dobRejectReason: true,
          birthCertificateUrl: true,
          birthCertificateUrlStatus: true,
          birthCertificateUrlRejectReason: true,
          religion: true,
          maritalState: true,
          spouseName: true,
          haveChildren: true,
          nic: true,
          nicStatus: true,
          nicRejectReason: true,
          nicUrl: true,
          nicUrlStatus: true,
          nicUrlRejectReason: true,
          haveAffiliations: true,
          shortName: true,
          age: true,
          ppUrl: true,
          ppUrlStatus: true,
          ppUrlRejectReason: true,
          nationality: true,
          typeOfId: true,
          typeOfIdStatus: true,
          typeOfIdRejectReason: true,
          passportCountry: true,
          passportCountryStatus: true,
          passportCountryRejectReason: true,
          passportExpirationDate: true,
          passportExpirationDateStatus: true,
          passportExpirationDateRejectReason: true,
          haveRtwDocument: true,
          haveRtwDocumentStatus: true,
          haveRtwDocumentRejectReason: true,
          rtwDocumentUrl: true,
          rtwDocumentUrlStatus: true,
          rtwDocumentUrlRejectReason: true,
          haveRtwExpirationDate: true,
          haveRtwExpirationDateStatus: true,
          haveRtwExpirationDateRejectReason: true,
          rtwExpirationDate: true,
          rtwExpirationDateStatus: true,
          rtwExpirationDateRejectReason: true,
          idLanguage: true,
          idLanguageStatus: true,
          idLanguageRejectReason: true,
          xfamily_affiliations: {
            select: {
              affiliateName: true,
              affiliateRelationship: true,
              affiliateJob: true
            }
          }
        }
      });
      const approvedDetails = await tx.approvedPersonalData.findUnique({
        where: {
          tspId: candidateId
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
      return { details, approvedDetails };
    });
  }

  //Tutor: Fetch Contact Information Details
  async fetchContactDetails(tspId: number) {
    try {
      const approvedDetails = await this.prisma.approvedContactData.findUnique({
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
      const details = await this.prisma.hrisContactData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        }
      });
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

  /**
   *  TODO: Contact
   *  - take last record belongs to candidate - tspId
   *
   *  - if permanatSameasResiding == Yes -> copy data from permanat to residing. else leave as is
   *
   *  - copy last reasons to the new row
   *  - change status of related status field to pending if last field value with current data field value
   */

  //Tutor: Submit Contact Information Details
  async submitContactDetails(tspId: number, data: SubmitContactDetailsDto) {
    const { id, type, country, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    const lastData = await this.prisma.hrisContactData.findFirst({
      where: {
        tspId
      },
      orderBy: {
        id: 'desc'
      }
    });
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
          const newStatus = lastData[field] !== data[field] ? 'pending' : value;
          return [key, newStatus];
        })
        .reduce((prev, [key, value]) => {
          prev[key as string] = value;
          return prev;
        }, {});
    }

    return this.prisma.$transaction(async (tx) => {
      const contactData = await tx.hrisContactData.create({
        data: {
          tspId,
          ...rest,
          ...lastDataReasons,
          ...updatedStatus,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: null,
          auditedBy: null
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
          permanentPinRejectReason: true,
          recordApproved: true
        }
      });

      await tx.approvedContactData.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
        }
      });

      let fieldsMandatory = [
        'personalEmail',
        'workEmail',
        'mobileNumber',
        'permanentAddressL1',
        'permanentDistrict',
        'permanentProvince',
        'permanentCountry',
        'sameResidingPermanent',
        'residingAddressL1',
        'residingCity',
        'residingDistrict',
        'residingProvince',
        'residingCountry',
        'emgContactName',
        'emgRelationship',
        'emgContactNum'
      ];

      if (data.country === 'India') {
        fieldsMandatory = [...fieldsMandatory, 'residingPin', 'permanentPin'];
      } else {
        fieldsMandatory = [...fieldsMandatory, 'permanentCity'];
      }

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (contactData[curr] && contactData[curr] !== '' ? 1 : 0);
      }, 0);

      let contactDataCount = '';
      if (data.country === 'India') {
        contactDataCount = `${filledMandatoryFieldCount}/18`;
      } else {
        contactDataCount = `${filledMandatoryFieldCount}/17`;
      }

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          contactDataEmp: filledMandatoryFieldCount,
          contactDataCount: contactDataCount
        },
        create: {
          tspId,
          contactDataEmp: filledMandatoryFieldCount,
          contactDataCount: contactDataCount
        }
      });

      const details = await tx.hrisContactData.findFirst({
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
          permanentPinRejectReason: true,
          recordApproved: true
        }
      });

      return details;
    });
  }

  //Auditor: Submit Contact Information Details
  async auditorSubmitContactInformation(
    tspId: number,
    data: AuditorSubmitContactDetailsDto
  ) {
    const { id, type, country, candidateId, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    let lastData = await this.prisma.hrisContactData.findFirst({
      where: {
        tspId: candidateId
      },
      orderBy: {
        id: 'desc'
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisContactData.create({
        data: {
          tspId: candidateId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const contactData = await tx.hrisContactData.create({
        data: {
          tspId: candidateId,
          ...rest,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
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
          permanentPinRejectReason: true,
          recordApproved: true
        }
      });

      let previousApprovedData = await tx.approvedContactData.findUnique({
        where: {
          tspId: candidateId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedContactData.create({
          data: {
            tspId: candidateId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }

      let notAuditingFields = {};
      let auditingFields = {};
      let customAuditingFields = {};
      if (previousApprovedData) {
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

      // custom logic to handle fields that depend on other fields for audit approved values
      if (data.country) {
        customAuditingFields = {
          ...customAuditingFields,
          residingAddressL2:
            rest.residingAddressL1Status === 'approved'
              ? rest.residingAddressL2
              : previousApprovedData.residingAddressL2,
          permanentAddressL2:
            rest.permanentAddressL1Status === 'approved'
              ? rest.permanentAddressL2
              : previousApprovedData.permanentAddressL2
        };
      }

      await tx.approvedContactData.update({
        where: { tspId: candidateId },
        data: {
          ...notAuditingFields,
          ...auditingFields,
          ...customAuditingFields,
          updatedFlag: 3,
          approvedAt: now,
          approvedBy: tspId
        }
      });

      let fieldsMandatory = [
        'personalEmail',
        'workEmail',
        'mobileNumber',
        'permanentAddressL1',
        'permanentDistrict',
        'permanentProvince',
        'permanentCountry',
        'sameResidingPermanent',
        'residingAddressL1',
        'residingCity',
        'residingDistrict',
        'residingProvince',
        'residingCountry',
        'emgContactName',
        'emgRelationship',
        'emgContactNum'
      ];

      let fieldsAudited = [
        'workEmailStatus',
        'mobileNumberStatus',
        'landlineNumberStatus',
        'residingAddressL1Status',
        'residingDistrictStatus',
        'residingCountryStatus',
        'permanentAddressL1Status',
        'permanentDistrictStatus',
        'permanentCountryStatus',
        'emgContactNumStatus',
        'residingPinStatus',
        'permanentPinStatus'
      ];

      if (data.country === 'India') {
        fieldsMandatory = [...fieldsMandatory, 'residingPin', 'permanentPin'];
      } else {
        fieldsMandatory = [...fieldsMandatory, 'permanentCity'];

        fieldsAudited = [
          ...fieldsAudited,
          'permanentCityStatus',
          'residingCityStatus',
          'residingProvinceStatus',
          'permanentProvinceStatus'
        ];
      }

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (contactData[curr] && contactData[curr] !== '' ? 1 : 0);
      }, 0);

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (contactData[curr] &&
          ['approved', 'rejected'].includes(contactData[curr])
            ? 1
            : 0)
        );
      }, 0);

      let contactDataCount = '';
      if (data.country === 'India') {
        contactDataCount = `${filledMandatoryFieldCount}/18`;
      } else {
        contactDataCount = `${filledMandatoryFieldCount}/17`;
      }

      await tx.hrisProgress.upsert({
        where: {
          tspId: candidateId
        },
        update: {
          contactDataEmp: filledMandatoryFieldCount,
          contactDataAuditor: auditedFieldCount,
          contactDataCount: contactDataCount
        },
        create: {
          tspId,
          contactDataEmp: filledMandatoryFieldCount,
          contactDataAuditor: auditedFieldCount,

          contactDataCount: contactDataCount
        }
      });

      const details = await tx.hrisContactData.findFirst({
        where: {
          tspId: candidateId
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
          permanentPinRejectReason: true,
          recordApproved: true
        }
      });

      const approvedDetails = await tx.approvedContactData.findUnique({
        where: {
          tspId: candidateId
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
      return { details, approvedDetails };
    });
  }
}
