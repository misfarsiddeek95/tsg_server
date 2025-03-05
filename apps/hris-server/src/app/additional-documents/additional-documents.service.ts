import { HttpException, Injectable, Query } from '@nestjs/common';
import {
  AuditorSubmitReferenceDetailsDto,
  AuditorSubmitRightToWorkDetailsDto,
  AuditorSubmitSupportDocumentsDto,
  ReferenceFormDto,
  SubmitReferencesDetailsDto,
  SubmitRightToWorkDetailsDto,
  SubmitSupportDocumentsDto
} from './additional-documents.dto';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import moment = require('moment');
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdditionalDocumentsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService
  ) {}

  //Tutor: Fetch References Details
  async fetchReferenceDetails(tspId: number) {
    try {
      const approvedDetails = await this.prisma.approvedRefereeData.findUnique({
        where: {
          tspId: tspId
        },
        select: {
          refereeTitle1: true,
          refereeFirstName1: true,
          refereeLastName1: true,
          refereeRelationship1: true,
          refereeEmail1: true,
          refereeTelephoneNumber1: true,
          refereeConfirmation1: true,
          refereeTitle2: true,
          refereeFirstName2: true,
          refereeLastName2: true,
          refereeRelationship2: true,
          refereeEmail2: true,
          refereeTelephoneNumber2: true,
          refereeConfirmation2: true,
          acknowledgement1: true,
          acknowledgement2: true,
          emailFlag1: true,
          emailFlag2: true,
          submissionFlag1: true,
          submissionFlag2: true
        }
      });

      const details = await this.prisma.hrisRefereeData.findFirst({
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

  //Tutor: Submit Reference Details
  async submitReferenceDetails(
    tspId: number,
    data: SubmitReferencesDetailsDto
  ) {
    const { id, type, country, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    const lastData = await this.prisma.hrisRefereeData.findFirst({
      where: {
        tspId
      },
      orderBy: {
        id: 'desc'
      }
    });

    let lastDataReasons = {};
    let updatedStatus = {};
    let referee1Status = ''; //manually handle grouped section status
    let referee2Status = '';
    const gotPendingFields = false; //logic to trigger email notification to hris@ticketsthirdspaceportal.com

    if (lastData) {
      referee1Status = lastData.referee1Status; //set previous status for groupd section status
      referee2Status = lastData.referee2Status;

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

      //custom logic to handle pending status movement of referee data based on grouped field update
      const refereeFieldList2Compare = [
        'refereeTitle',
        'refereeFirstName',
        'refereeLastName',
        'refereeRelationship',
        'refereeEmail',
        'refereeTelephoneNumber'
      ];
      //even a single field is updated, change status to pending
      referee1Status = refereeFieldList2Compare.some(
        (key) => lastData[`${key}1`] !== data[`${key}1`]
      )
        ? 'pending'
        : referee1Status;
      referee2Status = refereeFieldList2Compare.some(
        (key) => lastData[`${key}2`] !== data[`${key}2`]
      )
        ? 'pending'
        : referee2Status;
      //end: custom logic
    }

    return this.prisma.$transaction(async (tx) => {
      const refereeData = await tx.hrisRefereeData.create({
        data: {
          tspId,
          ...rest,
          ...lastDataReasons,
          ...updatedStatus,
          referee1Status,
          referee2Status,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: null,
          auditedBy: null
        },
        select: {
          refereeTitle1: true,
          refereeFirstName1: true,
          refereeLastName1: true,
          refereeRelationship1: true,
          refereeEmail1: true,
          refereeTelephoneNumber1: true,
          refereeConfirmation1: true,
          refereeTitle2: true,
          refereeFirstName2: true,
          refereeLastName2: true,
          refereeRelationship2: true,
          refereeEmail2: true,
          refereeTelephoneNumber2: true,
          refereeConfirmation2: true,
          acknowledgement1: true,
          acknowledgement2: true,
          referee1Status: true,
          referee1RejectReason: true,
          referee2Status: true,
          referee2RejectReason: true
        }
      });

      await tx.approvedRefereeData.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
        }
      });

      const fieldsMandatory = [
        'refereeTitle1',
        'refereeFirstName1',
        'refereeLastName1',
        'refereeRelationship1',
        'refereeEmail1',
        'refereeTelephoneNumber1',
        'refereeConfirmation1',
        'refereeTitle2',
        'refereeFirstName2',
        'refereeLastName2',
        'refereeRelationship2',
        'refereeEmail2',
        'refereeTelephoneNumber2',
        'refereeConfirmation2',
        'acknowledgement1',
        'acknowledgement2'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (refereeData[curr] && refereeData[curr] !== '' ? 1 : 0);
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          refereeDataEmp: filledMandatoryFieldCount,
          refereeDataCount: `${filledMandatoryFieldCount}/16`
        },
        create: {
          tspId,
          refereeDataEmp: filledMandatoryFieldCount,
          refereeDataCount: `${filledMandatoryFieldCount}/16`
        }
      });

      const details = await tx.hrisRefereeData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          refereeTitle1: true,
          refereeFirstName1: true,
          refereeLastName1: true,
          refereeRelationship1: true,
          refereeEmail1: true,
          refereeTelephoneNumber1: true,
          refereeConfirmation1: true,
          refereeTitle2: true,
          refereeFirstName2: true,
          refereeLastName2: true,
          refereeRelationship2: true,
          refereeEmail2: true,
          refereeTelephoneNumber2: true,
          refereeConfirmation2: true,
          acknowledgement1: true,
          acknowledgement2: true,
          referee1Status: true,
          referee1RejectReason: true,
          referee2Status: true,
          referee2RejectReason: true
        }
      });

      return details;
    });
  }

  //Tutor: Fetch Right To Work Details
  async fetchRightToWorkDetails(tspId: number) {
    try {
      //get contract record making sure hr_admin_approval is approved
      const contractData = await this.prisma.approvedContractData.findUnique({
        where: {
          tsp_id: tspId
        },
        include: {
          user: {
            include: {
              approved_personal_data: {
                select: {
                  fullName: true,
                  shortName: true,
                  typeOfId: true,
                  nic: true
                }
              },
              approved_contact_data: {
                select: {
                  residingAddressL1: true,
                  residingAddressL2: true,
                  residingCity: true,
                  residingDistrict: true,
                  residingProvince: true,
                  residingPin: true,
                  residingCountry: true
                }
              }
            }
          }
        }
      });

      let contractDetails: any = null;

      // const idTypeMap = {
      //   Passport: 'Passport No.',
      //   NIC: 'National Identity Card No.',
      //   Aadhar: 'Aadhar Card No.',
      //   'Driving License': 'Driving License No.'
      // };

      if (contractData && contractData.hr_admin_approval == 'approved') {
        // const typeOfId =
        //   contractData?.user?.approved_personal_data?.typeOfId ?? '';
        const residingCountry =
          contractData?.user?.approved_contact_data?.residingCountry ?? '';

        //generate comma separate address dynamically
        let addressX = '';
        if (contractData?.user?.approved_contact_data) {
          addressX =
            addressX +
            (contractData?.user?.approved_contact_data?.residingAddressL1 &&
            contractData?.user?.approved_contact_data?.residingAddressL1 != ''
              ? contractData?.user?.approved_contact_data?.residingAddressL1.trim() +
                ', '
              : '');
          addressX =
            addressX +
            (contractData?.user?.approved_contact_data?.residingAddressL2 &&
            contractData?.user?.approved_contact_data?.residingAddressL2 != ''
              ? contractData?.user?.approved_contact_data?.residingAddressL2.trim() +
                ', '
              : '');
          addressX =
            addressX +
            (contractData?.user?.approved_contact_data?.residingCity &&
            contractData?.user?.approved_contact_data?.residingCity != ''
              ? contractData?.user?.approved_contact_data?.residingCity.trim() +
                ', '
              : '');
          if (residingCountry === 'India') {
            addressX =
              addressX +
              (contractData?.user?.approved_contact_data?.residingDistrict &&
              contractData?.user?.approved_contact_data?.residingDistrict != ''
                ? contractData?.user?.approved_contact_data?.residingDistrict.trim() +
                  ', '
                : '');
          }
          addressX =
            addressX +
            (contractData?.user?.approved_contact_data?.residingPin &&
            contractData?.user?.approved_contact_data?.residingPin != ''
              ? contractData?.user?.approved_contact_data?.residingPin.trim() +
                ', '
              : '');
          addressX = addressX + residingCountry;
        }

        contractDetails = {
          // typeOfIdx: idTypeMap[typeOfId]
          //   ? idTypeMap[typeOfId]
          //   : residingCountry == 'India'
          //   ? 'Aadhaar Card / Passport No.'
          //   : 'NIC / Passport No.',
          typeOfIdx:
            residingCountry == 'Sri Lanka'
              ? 'National Identity Card No.'
              : residingCountry == 'India'
              ? 'Aadhar Card No.'
              : 'NIC/Aadhaar Card No.',
          nic: contractData?.user?.approved_personal_data?.nic ?? '',
          fullName:
            contractData?.user?.approved_personal_data?.fullName &&
            contractData?.user?.approved_personal_data?.fullName != ''
              ? contractData?.user?.approved_personal_data?.fullName
              : contractData?.user?.approved_personal_data?.shortName ?? '',
          address: addressX,
          residingCountry: residingCountry,
          startDate: contractData?.contract_start_d ?? '',
          endDate: contractData?.contract_end_d ?? '',
          contractUrl: contractData?.contract_url ?? '',

          contract_assigned_at: contractData?.contract_assigned_at ?? '',
          contract_url_status: contractData?.contract_url_status ?? '',
          contract_url_reject_reason:
            contractData?.contract_url_reject_reason ?? '',
          tspId: tspId,
          contractNo: contractData?.contract_no ?? ''
        };
      }

      const approvedDetails =
        await this.prisma.approvedRight2workData.findUnique({
          where: {
            tspId: tspId
          },
          select: {
            contractUrl: true,
            gsIssuedDate: true,
            gsUrl: true,
            pccIssuedDate: true,
            pccReferenceNo: true,
            pccUrl: true,
            pccExpireDate: true,
            pccUploadedAt: true,
            pccState: true
          }
        });

      const details = await this.prisma.hrisRight2workData.findFirst({
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
          contractDetails,
          approvedDetails
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Tutor: Submit Right To Work Details
  async submitRightToWorkDetails(
    tspId: number,
    data: SubmitRightToWorkDetailsDto
  ) {
    const now = new Date().toISOString();
    const { id, type, country, profileStatus, ...rest } = data;

    //TODO : Wanna add GS and PCC re submit emails to auditor only applicable for active tutors

    const lastData = await this.prisma.hrisRight2workData.findFirst({
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

      const dateTimeFields = ['pccIssuedDate', 'gsIssuedDate'];

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
            (newStatus === 'pending' &&
              ['pccUrl', 'pccIssuedDate'].includes(field)) ||
            gotPendingFields;

          return [key, newStatus];
        })
        .reduce((prev, [key, value]) => {
          prev[key as string] = value;
          return prev;
        }, {});
    }

    return this.prisma.$transaction(async (tx) => {
      const rightToWorkData = await tx.hrisRight2workData.create({
        data: {
          tspId,
          ...rest,
          ...lastDataReasons,
          ...updatedStatus,
          pccExpireDate: rest.pccExpireDate !== '' ? rest.pccExpireDate : null,
          pccIssuedDate: rest.pccIssuedDate !== '' ? rest.pccIssuedDate : null,
          gsIssuedDate: rest.gsIssuedDate !== '' ? rest.gsIssuedDate : null,
          pccUploadedAt:
            ![null, ''].includes(rest.pccUrl) &&
            (!lastData || rest.pccUrl != lastData?.pccUrl)
              ? now
              : lastData?.pccUploadedAt ?? null,
          gsUploadedAt:
            ![null, ''].includes(rest.gsUrl) &&
            (!lastData || rest.gsUrl != lastData?.gsUrl)
              ? now
              : lastData?.gsUploadedAt ?? null,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: null,
          auditedBy: null
        },
        select: {
          contractUrl: true,
          contractUrlStatus: true,
          contractUrlRejectReason: true,
          gsIssuedDate: true,
          gsIssuedDateStatus: true,
          gsIssuedDateRejectReason: true,
          gsUrl: true,
          gsUrlStatus: true,
          gsUrlRejectReason: true,
          pccIssuedDate: true,
          pccIssuedDateStatus: true,
          pccIssuedDateRejectReason: true,
          pccReferenceNo: true,
          pccReferenceNoStatus: true,
          pccReferenceNoRejectReason: true,
          pccUrl: true,
          pccUrlStatus: true,
          pccUrlRejectReason: true,
          pccExpireDate: true,
          pccUploadedAt: true,
          pccState: true,
          recordApproved: true
        }
      });

      await tx.approvedRight2workData.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
        }
      });

      const fieldsMandatory = [
        'gsIssuedDate',
        'gsUrl',
        'pccReferenceNo',
        'pccIssuedDate',
        'pccUrl'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return (
          prev + (rightToWorkData[curr] && rightToWorkData[curr] !== '' ? 1 : 0)
        );
      }, 0);

      const right2workDataCount = `${filledMandatoryFieldCount}/${fieldsMandatory.length}`;

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          right2workInfoEmp: filledMandatoryFieldCount,
          right2workDataCount: right2workDataCount
        },
        create: {
          tspId,
          right2workInfoEmp: filledMandatoryFieldCount,
          right2workDataCount: right2workDataCount
        }
      });

      const details = await tx.hrisRight2workData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          contractUrl: true,
          contractUrlStatus: true,
          contractUrlRejectReason: true,
          gsIssuedDate: true,
          gsIssuedDateStatus: true,
          gsIssuedDateRejectReason: true,
          gsUrl: true,
          gsUrlStatus: true,
          gsUrlRejectReason: true,
          pccIssuedDate: true,
          pccIssuedDateStatus: true,
          pccIssuedDateRejectReason: true,
          pccReferenceNo: true,
          pccReferenceNoStatus: true,
          pccReferenceNoRejectReason: true,
          pccUrl: true,
          pccUrlStatus: true,
          pccUrlRejectReason: true,
          pccExpireDate: true,
          pccUploadedAt: true,
          pccState: true,
          recordApproved: true
        }
      });

      /**
       * Notify Auditors when PCC/GS document has been updated by candidate/tutor
       * Banu
       * 07-02-2024
       */
      const auditorData = await this.prisma.hrisProgress.findUnique({
        where: {
          tspId: +tspId
        },
        select: {
          user: {
            select: {
              user_hris_progress: {
                select: {
                  profileStatus: true
                }
              },
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          auditor: {
            select: {
              username: true,
              NTProfile: {
                select: {
                  short_name: true
                }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });
      const pccUpdated =
        rest.pccUrl && (!lastData || lastData['pccUrl'] != rest.pccUrl);
      const pccDateUpdated = !!(
        rest.pccIssuedDate &&
        (!lastData ||
          !lastData['pccIssuedDate'] ||
          lastData['pccIssuedDate'].getTime() !=
            new Date(rest.pccIssuedDate).getTime())
      );

      const gsUpdated =
        rest.gsUrl && (!lastData || lastData['gsUrl'] != rest.gsUrl);

      if (
        auditorData &&
        auditorData.auditor &&
        auditorData.auditor.username &&
        (pccUpdated || gsUpdated || pccDateUpdated)
      ) {
        const first_name = auditorData.auditor?.NTProfile
          ? auditorData.auditor?.NTProfile?.short_name
          : auditorData.auditor?.approved_personal_data
          ? auditorData.auditor?.approved_personal_data?.shortName
          : '';
        const candidateName =
          auditorData.user?.approved_personal_data?.shortName ?? '';
        const email = auditorData.auditor?.username ?? '';
        const documentsText =
          pccUpdated && gsUpdated
            ? 'Police Certificate<br>GS Certificate'
            : gsUpdated
            ? 'GS Certificate'
            : 'Police Certificate';
        const profileState =
          auditorData.user?.user_hris_progress?.profileStatus === 'active'
            ? 'Tutor'
            : 'Candidate';

        await this.mailService.sendNotifyAuditorRight2WorkUploaded(
          email,
          first_name,
          candidateName,
          tspId + '',
          documentsText,
          profileState
        );
      }

      if (
        auditorData &&
        auditorData.user?.user_hris_progress &&
        auditorData.user?.user_hris_progress.profileStatus &&
        auditorData.user?.user_hris_progress.profileStatus === 'active' &&
        gotPendingFields
      ) {
        // notify hris@ticketsthirdspaceportal.com on tutor updating key profile data
        await this.mailService.sendNotification2Ticketsthirdspaceportal(
          tspId + '',
          auditorData?.user?.approved_personal_data?.shortName ?? '',
          auditorData?.user?.approved_contact_data?.workEmail ?? '',
          'Right to work - PCC'
        );
      }

      return details;
    });
  }

  //Auditor: Submit Right To Work Details
  async auditorSubmitRightToWorkDetails(
    tspId: number,
    data: AuditorSubmitRightToWorkDetailsDto
  ) {
    const now = new Date().toISOString();
    const { id, type, country, candidateId, profileStatus, ...rest } = data;

    let lastData = await this.prisma.hrisRight2workData.findFirst({
      where: {
        tspId: candidateId
      },
      orderBy: {
        id: 'desc'
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisRight2workData.create({
        data: {
          tspId: candidateId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const rightToWorkData = await tx.hrisRight2workData.create({
        data: {
          tspId: candidateId,
          ...rest,
          pccExpireDate: rest.pccExpireDate !== '' ? rest.pccExpireDate : null,
          pccIssuedDate: rest.pccIssuedDate !== '' ? rest.pccIssuedDate : null,
          gsIssuedDate: rest.gsIssuedDate !== '' ? rest.gsIssuedDate : null,
          pccUploadedAt:
            ![null, ''].includes(rest.pccUrl) &&
            (!lastData || rest.pccUrl != lastData?.pccUrl)
              ? now
              : lastData?.pccUploadedAt ?? null,
          gsUploadedAt:
            ![null, ''].includes(rest.gsUrl) &&
            (!lastData || rest.gsUrl != lastData?.gsUrl)
              ? now
              : lastData?.gsUploadedAt ?? null,
          gsIssuedDateStatus:
            rest.gsUrlStatus === 'approved'
              ? 'approved'
              : rest.gsIssuedDateStatus,
          pccIssuedDateStatus:
            rest.pccUrlStatus === 'approved'
              ? 'approved'
              : rest.pccIssuedDateStatus,
          pccReferenceNoStatus:
            rest.pccUrlStatus === 'approved'
              ? 'approved'
              : rest.pccReferenceNoStatus,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
        },
        select: {
          contractUrl: true,
          contractUrlStatus: true,
          contractUrlRejectReason: true,
          gsIssuedDate: true,
          gsIssuedDateStatus: true,
          gsIssuedDateRejectReason: true,
          gsUrl: true,
          gsUrlStatus: true,
          gsUrlRejectReason: true,
          pccIssuedDate: true,
          pccIssuedDateStatus: true,
          pccIssuedDateRejectReason: true,
          pccReferenceNo: true,
          pccReferenceNoStatus: true,
          pccReferenceNoRejectReason: true,
          pccUrl: true,
          pccUrlStatus: true,
          pccUrlRejectReason: true,
          pccExpireDate: true,
          pccUploadedAt: true,
          pccState: true,
          recordApproved: true
        }
      });

      let previousApprovedData = await tx.approvedRight2workData.findUnique({
        where: {
          tspId: candidateId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedRight2workData.create({
          data: {
            tspId: candidateId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }

      const fieldsMandatory = [
        'gsIssuedDate',
        'gsUrl',
        'pccReferenceNo',
        'pccIssuedDate',
        'pccUrl'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return (
          prev + (rightToWorkData[curr] && rightToWorkData[curr] !== '' ? 1 : 0)
        );
      }, 0);

      const right2workDataCount = `${filledMandatoryFieldCount}/${fieldsMandatory.length}`;

      let fieldsAudited = ['gsUrlStatus', 'pccUrlStatus'];
      if (data.country === 'India') {
        fieldsAudited = [
          ...fieldsAudited,
          'gsIssuedDateStatus',
          'pccIssuedDateStatus',
          'pccReferenceNoStatus'
        ];
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
            } else if (!fieldsAudited.includes(key + 'Status')) {
              prev[key as string] = data[key];
            } else {
              prev[key as string] = value;
            }
            return prev;
          }, {} as any);

        // custom logic to handle fields that depend on other fields for audit approved values
        if (data.country === 'India') {
          // based on pccIssuedDateStatus, approve related fields
          // based on pccUrlStatus, approve related fields
          customAuditingFields = {
            ...customAuditingFields,
            pccExpireDate:
              rest.pccIssuedDateStatus === 'approved'
                ? rest.pccExpireDate
                : previousApprovedData.pccExpireDate,
            pccState:
              rest.pccIssuedDateStatus === 'approved'
                ? rest.pccState
                : previousApprovedData.pccState,
            pccUploadedAt:
              rest.pccUrlStatus === 'approved'
                ? ![null, ''].includes(rest.pccUrl) &&
                  (!lastData || rest.pccUrl != lastData?.pccUrl)
                  ? now
                  : lastData?.pccUploadedAt ?? null
                : previousApprovedData.pccUploadedAt
          };
        } else {
          // based on gsUrlStatus, approve related fields
          // based on pccUrlStatus, approve related fields
          customAuditingFields = {
            ...customAuditingFields,
            gsIssuedDate:
              rest.gsUrlStatus === 'approved'
                ? rest.gsIssuedDate
                : previousApprovedData.gsIssuedDate,
            gsUploadedAt:
              rest.gsUrlStatus === 'approved'
                ? ![null, ''].includes(rest.gsUrl) &&
                  (!lastData || rest.gsUrl != lastData?.gsUrl)
                  ? now
                  : lastData?.gsUploadedAt ?? null
                : previousApprovedData.gsUploadedAt,
            pccIssuedDate:
              rest.pccUrlStatus === 'approved'
                ? rest.pccIssuedDate
                : previousApprovedData.pccIssuedDate,
            pccReferenceNo:
              rest.pccUrlStatus === 'approved'
                ? rest.pccReferenceNo
                : previousApprovedData.pccReferenceNo,
            pccExpireDate:
              rest.pccUrlStatus === 'approved'
                ? rest.pccExpireDate
                : previousApprovedData.pccExpireDate,
            pccState:
              rest.pccUrlStatus === 'approved'
                ? rest.pccState
                : previousApprovedData.pccState,
            pccUploadedAt:
              rest.pccUrlStatus === 'approved'
                ? ![null, ''].includes(rest.pccUrl) &&
                  (!lastData || rest.pccUrl != lastData?.pccUrl)
                  ? now
                  : lastData?.pccUploadedAt ?? null
                : previousApprovedData.pccUploadedAt
          };
        } // end of: customAuditingFields
      }
      await tx.approvedRight2workData.update({
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

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (rightToWorkData[curr] &&
          ['approved', 'rejected'].includes(rightToWorkData[curr])
            ? 1
            : 0)
        );
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId: candidateId
        },
        update: {
          right2workInfoEmp: filledMandatoryFieldCount,
          right2workInfoAuditor: auditedFieldCount,
          right2workDataCount: right2workDataCount
        },
        create: {
          tspId: candidateId,
          right2workInfoEmp: filledMandatoryFieldCount,
          right2workInfoAuditor: auditedFieldCount,
          right2workDataCount: right2workDataCount
        }
      });

      const details = await tx.hrisRight2workData.findFirst({
        where: {
          tspId: candidateId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          contractUrl: true,
          contractUrlStatus: true,
          contractUrlRejectReason: true,
          gsIssuedDate: true,
          gsIssuedDateStatus: true,
          gsIssuedDateRejectReason: true,
          gsUrl: true,
          gsUrlStatus: true,
          gsUrlRejectReason: true,
          pccIssuedDate: true,
          pccIssuedDateStatus: true,
          pccIssuedDateRejectReason: true,
          pccReferenceNo: true,
          pccReferenceNoStatus: true,
          pccReferenceNoRejectReason: true,
          pccUrl: true,
          pccUrlStatus: true,
          pccUrlRejectReason: true,
          pccExpireDate: true,
          pccUploadedAt: true,
          pccState: true,
          recordApproved: true
        }
      });

      const approvedDetails = await tx.approvedRight2workData.findUnique({
        where: {
          tspId: candidateId
        },
        select: {
          contractUrl: true,
          gsIssuedDate: true,
          gsUrl: true,
          pccIssuedDate: true,
          pccReferenceNo: true,
          pccUrl: true,
          pccExpireDate: true,
          pccState: true
        }
      });

      return { details, approvedDetails };
    });
  }

  //Auditor: Submit Reference Details
  async auditorSubmitReferenceDetails(
    tspId: number,
    data: AuditorSubmitReferenceDetailsDto
  ) {
    const now = new Date().toISOString();
    const { id, type, country, candidateId, profileStatus, ...rest } = data;
    let lastData = await this.prisma.hrisRefereeData.findFirst({
      where: {
        tspId: candidateId
      },
      orderBy: {
        id: 'desc'
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisRefereeData.create({
        data: {
          tspId: candidateId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const refereeData = await tx.hrisRefereeData.create({
        data: {
          tspId: candidateId,
          ...rest,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
        },
        select: {
          refereeTitle1: true,
          refereeFirstName1: true,
          refereeLastName1: true,
          refereeRelationship1: true,
          refereeEmail1: true,
          refereeTelephoneNumber1: true,
          refereeConfirmation1: true,
          refereeTitle2: true,
          refereeFirstName2: true,
          refereeLastName2: true,
          refereeRelationship2: true,
          refereeEmail2: true,
          refereeTelephoneNumber2: true,
          refereeConfirmation2: true,
          acknowledgement1: true,
          acknowledgement2: true,
          referee1Status: true,
          referee1RejectReason: true,
          referee2Status: true,
          referee2RejectReason: true
        }
      });

      let previousApprovedData = await tx.approvedRefereeData.findUnique({
        where: {
          tspId: candidateId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedRefereeData.create({
          data: {
            tspId: candidateId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }

      let notAuditingFields = {};
      let auditingFields = {};
      const bulkFields = [];

      /**
       * custom logic to approve referee data
       */
      [1, 2].forEach((i) => {
        if (data[`referee${i}Status`] !== 'approved') {
          bulkFields.push(
            `refereeTitle${i}`,
            `refereeFirstName${i}`,
            `refereeLastName${i}`,
            `refereeRelationship${i}`,
            `refereeEmail${i}`,
            `refereeTelephoneNumber${i}`,
            `refereeConfirmation${i}`,
            `acknowledgement${i}`
          );
        }
      });

      if (previousApprovedData && lastData) {
        notAuditingFields = Object.entries(previousApprovedData)
          .filter(([key]) => !bulkFields.includes(key))
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

      await tx.approvedRefereeData.update({
        where: { tspId: candidateId },
        data: {
          ...notAuditingFields,
          ...auditingFields,
          updatedFlag: 3,
          approvedAt: now,
          approvedBy: tspId
        }
      });

      const fieldsMandatory = [
        'refereeTitle1',
        'refereeFirstName1',
        'refereeLastName1',
        'refereeRelationship1',
        'refereeEmail1',
        'refereeTelephoneNumber1',
        'refereeConfirmation1',
        'refereeTitle2',
        'refereeFirstName2',
        'refereeLastName2',
        'refereeRelationship2',
        'refereeEmail2',
        'refereeTelephoneNumber2',
        'refereeConfirmation2',
        'acknowledgement1',
        'acknowledgement2'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (refereeData[curr] && refereeData[curr] !== '' ? 1 : 0);
      }, 0);

      const fieldsAudited = ['referee1Status', 'referee2Status'];

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (refereeData[curr] &&
          ['approved', 'rejected'].includes(refereeData[curr])
            ? 1
            : 0)
        );
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId: candidateId
        },
        update: {
          refereeDataEmp: filledMandatoryFieldCount,
          refereeDataAuditor: auditedFieldCount,
          refereeDataCount: `${filledMandatoryFieldCount}/16`
        },
        create: {
          tspId: candidateId,
          refereeDataEmp: filledMandatoryFieldCount,
          refereeDataAuditor: auditedFieldCount,
          refereeDataCount: `${filledMandatoryFieldCount}/16`
        }
      });

      const details = await tx.hrisRefereeData.findFirst({
        where: {
          tspId: candidateId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          refereeTitle1: true,
          refereeFirstName1: true,
          refereeLastName1: true,
          refereeRelationship1: true,
          refereeEmail1: true,
          refereeTelephoneNumber1: true,
          refereeConfirmation1: true,
          refereeTitle2: true,
          refereeFirstName2: true,
          refereeLastName2: true,
          refereeRelationship2: true,
          refereeEmail2: true,
          refereeTelephoneNumber2: true,
          refereeConfirmation2: true,
          acknowledgement1: true,
          acknowledgement2: true,
          referee1Status: true,
          referee1RejectReason: true,
          referee2Status: true,
          referee2RejectReason: true
        }
      });

      const approvedDetails = await tx.approvedRefereeData.findUnique({
        where: {
          tspId: candidateId
        },
        select: {
          refereeTitle1: true,
          refereeFirstName1: true,
          refereeLastName1: true,
          refereeRelationship1: true,
          refereeEmail1: true,
          refereeTelephoneNumber1: true,
          refereeConfirmation1: true,
          refereeTitle2: true,
          refereeFirstName2: true,
          refereeLastName2: true,
          refereeRelationship2: true,
          refereeEmail2: true,
          refereeTelephoneNumber2: true,
          refereeConfirmation2: true,
          acknowledgement1: true,
          acknowledgement2: true,
          emailFlag1: true,
          emailFlag2: true,
          submissionFlag1: true,
          submissionFlag2: true
        }
      });

      return { details, approvedDetails };
    });
  }

  //Auditor: Update Referee flags email & submission
  async setAuditorRefereeActionBtnFlag(
    auditorId: number,
    candidateId: number,
    refereeAction: 'send_email' | 'edit_enable',
    refereeCount: 1 | 2
  ) {
    /**
     * function handles 4 actions
     * send email for referee 1 & 2
     * grant edit access for referee 1 & 2
     */
    const now = new Date().toISOString();
    try {
      const emailFlagX = `emailFlag${refereeCount}`;
      const submissionFlagX = `submissionFlag${refereeCount}`;
      const refereeXStatus = `referee${refereeCount}Status`;
      const refereeXRejectReason = `referee${refereeCount}RejectReason`;
      const emailedFormAtX = `emailedFormAt${refereeCount}`;
      /**
       * FLAG GUIDE/ MANUAL ********************************
       * emailFlagX possible values and meanings:
       * 0 : email not yet sent
       * 1 : referee form email sent
       * 3 : 3day reminder sent
       * -1 : edit enabled
       * -5 : 5day deadline over & edit enabled
       *
       * submissionFlagX possible values and meanings:
       * 0 : pending submission
       * 1 : submitted
       * -1 : edit enabled
       */

      switch (refereeAction) {
        case 'send_email': {
          // first fetch relevent referee data from approved table
          const approvedRefereeData4Email =
            await this.prisma.approvedRefereeData.findUnique({
              where: {
                tspId: +candidateId
              },
              include: {
                user: {
                  include: {
                    approved_personal_data: {
                      select: {
                        shortName: true
                      }
                    }
                  }
                }
              }
            });

          if (approvedRefereeData4Email) {
            const refereeTitleName =
              approvedRefereeData4Email[`refereeTitle${refereeCount}`] +
              '. ' +
              approvedRefereeData4Email[`refereeFirstName${refereeCount}`] +
              ' ' +
              approvedRefereeData4Email[`refereeLastName${refereeCount}`];
            const candidateName =
              approvedRefereeData4Email.user?.approved_personal_data
                ?.shortName ?? '';
            const dueDate = moment().add(3, 'days').format('DD/MM/YYYY');
            const refereeEmail =
              approvedRefereeData4Email[`refereeEmail${refereeCount}`] ?? '';

            /**
             * ONLY proceed with actions if approved - fetched referee email is a valid one
             */
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(refereeEmail)) {
              const token = this.jwtService.sign({
                tspId: candidateId,
                refereeCount: refereeCount,
                refereeEmail: refereeEmail
              });
              const tsgLink =
                process.env.NX_TSG_URL ?? 'https://www.thirdspaceglobal.com';

              const formLink = tsgLink + '/reference-check-form?token=' + token;
              // let email = 'banuka+ref@thirdspaceglobal.com'; //for testing

              await this.mailService.sendRefereeReferenceRequestOrReminder(
                refereeTitleName,
                candidateName,
                dueDate,
                formLink,
                refereeEmail
              );

              await this.prisma.approvedRefereeData.update({
                where: {
                  tspId: candidateId
                },
                data: {
                  [emailFlagX]: 1, //email sent flag
                  [submissionFlagX]: 0, //reset submission flag to accept new
                  [emailedFormAtX]: now,
                  approvedAt: now,
                  approvedBy: auditorId
                }
              });

              return {
                success: true,
                data: {
                  emailFlagX: 1,
                  submissionFlagX: 0,
                  refereeAction,
                  refereeCount
                }
              };
            }
          }
          throw new HttpException(
            { success: false, error: 'Referee Notificaiton failed' },
            400
          );

          break;
        }
        case 'edit_enable': {
          // when enabling edit, reset relevent audit status to rejected
          const lastRecord = await this.prisma.hrisRefereeData.findFirst({
            where: {
              tspId: candidateId
            },
            orderBy: { id: 'desc' }
          });
          const now = new Date().toISOString();
          if (lastRecord) {
            await this.prisma.hrisRefereeData.update({
              where: {
                id: lastRecord.id
              },
              data: {
                [refereeXStatus]: 'rejected',
                [refereeXRejectReason]: 'Edit enabled by auditor',
                updatedAt: now,
                updatedBy: auditorId,
                auditedAt: now,
                auditedBy: auditorId
              }
            });
          }

          await this.prisma.approvedRefereeData.update({
            where: {
              tspId: candidateId
            },
            data: {
              [emailFlagX]: -1, //email pending flag*
              [submissionFlagX]: -1, // submission pending flag*
              [emailedFormAtX]: null
            }
          });

          return {
            success: true,
            data: {
              emailFlagX: -1,
              submissionFlagX: -1,
              refereeAction,
              refereeCount
            }
          };
          break;
        }

        default: {
          throw new HttpException(
            { success: false, error: 'Referee action not recognized' },
            400
          );
          break;
        }
      }
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Auditor: Update Auditor contract audit approval/reject
  async setAuditorContractAction(
    auditorId: number,
    candidateId: number,
    contractAction: 'approved' | 'rejected' | 'pending',
    contractRejectReason: string | null
  ) {
    const now = new Date().toISOString();
    try {
      const getContractRecord =
        await this.prisma.approvedContractData.findUnique({
          where: { tsp_id: candidateId }
        });

      if (!getContractRecord) {
        throw new Error(`No contract data found`);
      } else if (
        !getContractRecord.contract_url ||
        getContractRecord.contract_url == ''
      ) {
        throw new Error(`No contract url found`);
      } else if (getContractRecord.contract_url_status == 'approved') {
        throw new Error(`Contract record already approved`);
      }

      const candidateData = await this.prisma.user.findUnique({
        where: { tsp_id: candidateId },
        select: {
          approved_personal_data: {
            select: {
              firstName: true
            }
          },
          approved_contact_data: { select: { workEmail: true } },
          user_hris_progress: {
            select: {
              auditor: {
                select: {
                  NTProfile: {
                    select: { short_name: true }
                  },
                  approved_personal_data: {
                    select: {
                      firstName: true,
                      surname: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      const auditorName =
        candidateData.user_hris_progress?.auditor?.NTProfile &&
        candidateData.user_hris_progress?.auditor?.NTProfile.short_name &&
        candidateData.user_hris_progress?.auditor?.NTProfile.short_name != ''
          ? candidateData.user_hris_progress?.auditor?.NTProfile.short_name
          : candidateData.user_hris_progress?.auditor?.approved_personal_data
              ?.firstName
          ? candidateData.user_hris_progress?.auditor?.approved_personal_data
              ?.firstName +
            ' ' +
            candidateData.user_hris_progress?.auditor?.approved_personal_data
              ?.surname
          : '';

      let updatedContractRecord = null;
      switch (contractAction) {
        case 'approved':
          updatedContractRecord = await this.prisma.approvedContractData.update(
            {
              where: {
                tsp_id: candidateId
              },
              data: {
                contract_audited_at: now,
                contract_audited_by: auditorId,
                contract_url_status: contractAction,
                contract_url_reject_reason: ''
              }
            }
          );

          //add recod to approved history contract table
          updatedContractRecord &&
            (await this.prisma.hrisContractData.create({
              data: updatedContractRecord
            }));

          //add recod to backup table
          updatedContractRecord &&
            (await this.prisma.hrisContractDataBackup.create({
              data: updatedContractRecord
            }));

          //TODO: send email to tutor & hr admin
          break;
        case 'rejected':
          updatedContractRecord = await this.prisma.approvedContractData.update(
            {
              where: {
                tsp_id: candidateId
              },
              data: {
                contract_audited_at: now,
                contract_audited_by: auditorId,
                contract_url_status: contractAction,
                contract_url_reject_reason: contractRejectReason ?? ''
              }
            }
          );

          //TODO: send email to tutor
          candidateData &&
            updatedContractRecord &&
            (await this.mailService.sendContractFail(
              candidateData.approved_personal_data?.firstName ?? '',
              candidateData.approved_contact_data?.workEmail ?? '',
              updatedContractRecord.contract_url_reject_reason ?? '',
              auditorName
            ));
          break;
        case 'pending':
          updatedContractRecord = await this.prisma.approvedContractData.update(
            {
              where: {
                tsp_id: candidateId
              },
              data: {
                contract_audited_at: now,
                contract_audited_by: auditorId,
                contract_url_status: contractAction,
                contract_url_reject_reason: 'rejected reason TODO'
              }
            }
          );
          break;
        default:
          throw new Error(`Unidentified Contract audit status`);
          break;
      }
      // console.log('updatedContractRecord', updatedContractRecord);
      return {
        success: true,
        data: { updatedContractRecord: updatedContractRecord }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Auditor: Fetch Referee Response
  async fetchRefereeResponseData(tspId: number, refereeCount: number) {
    try {
      const candidateData = await this.prisma.approvedPersonalData.findUnique({
        where: {
          tspId
        },
        select: {
          shortName: true
        }
      });
      const candidateName = candidateData ? candidateData.shortName : '-';

      const refereeResponseData =
        await this.prisma.hrisReferenceCollected.findFirst({
          where: {
            tspId,
            refereeCount
          },
          select: {
            refereeId: true,
            refereeEmail: true,
            refereeName: true,
            applicantName: true,
            refereeApplicantHowKnow: true,
            refereeApplicantKnowDuration: true,
            refereeApplicantNotWorkChildren: true,
            refereeApplicantEmploymentConsider: true,
            refereeApplicantPositionTutor: true,
            submittedAt: true
          },
          orderBy: {
            id: 'desc'
          },
          take: 1
        });

      if (refereeResponseData) {
        return {
          success: true,
          details: { candidateName, ...refereeResponseData }
        };
      }
      throw new HttpException(
        { success: false, error: 'Referee response not found' },
        400
      );
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Tutor: Update Contract URL on sign contrat action
  async updateContractUrl(url: string, userId: number) {
    try {
      const now = new Date().toISOString();

      const getContractRecord =
        await this.prisma.approvedContractData.findUnique({
          where: { tsp_id: userId }
        });

      if (!getContractRecord) {
        throw new Error(`No contract data found`);
      } else if (!url || url == '') {
        throw new Error(`No contract url found`);
      } else if (getContractRecord.contract_url_status == 'approved') {
        throw new Error(`Contract record already approved`);
      } else {
        await this.prisma.approvedContractData.update({
          where: {
            tsp_id: userId
          },
          data: {
            contract_url: url,
            contract_uploaded_at: now,
            contract_url_status: 'pending'
          }
        });

        const auditorData = await this.prisma.hrisProgress.findUnique({
          where: {
            tspId: +userId
          },
          select: {
            user: {
              select: {
                approved_personal_data: {
                  select: {
                    shortName: true
                  }
                }
              }
            },
            auditor: {
              select: {
                username: true,
                NTProfile: {
                  select: {
                    short_name: true
                  }
                },
                approved_personal_data: {
                  select: {
                    shortName: true
                  }
                }
              }
            }
          }
        });
        // console.log('auditorData', auditorData);

        if (
          auditorData &&
          auditorData.auditor &&
          auditorData.auditor.username
        ) {
          const first_name = auditorData.auditor?.NTProfile
            ? auditorData.auditor?.NTProfile?.short_name
            : auditorData.auditor?.approved_personal_data
            ? auditorData.auditor?.approved_personal_data?.shortName
            : '';
          const candidateName =
            auditorData.user?.approved_personal_data?.shortName ?? '';
          const email = auditorData.auditor?.username ?? '';
          const tspId = '' + userId;
          const contract_assigned_at = getContractRecord.contract_assigned_at
            ? getContractRecord.contract_assigned_at.toDateString()
            : '';
          const contract_uploaded_at = moment().format('YYYY-MM-DD').toString();
          const contract_info =
            'No: ' +
            getContractRecord.contract_no +
            ' | Type: ' +
            getContractRecord.contract_type +
            ' | Starting on: ' +
            getContractRecord.contract_start_d.toDateString();

          //send email to Notify Auditor of audit pending Contract
          await this.mailService.sendNotifyAuditorContractUploaded(
            email,
            first_name,
            candidateName,
            tspId,
            contract_assigned_at,
            contract_uploaded_at,
            contract_info
          );
        }

        //update url in backup table
        const getBackupContractRecord =
          await this.prisma.hrisContractDataBackup.findFirst({
            where: { tsp_id: userId },
            orderBy: { id: 'desc' },
            take: 1
          });

        getBackupContractRecord &&
          (await this.prisma.hrisContractDataBackup.update({
            where: {
              id: getBackupContractRecord.id
            },
            data: {
              contract_url: url,
              contract_uploaded_at: now,
              contract_url_status: 'pending'
            }
          }));
      }

      /*
      //update contract logic
      const resubmit = await this.prisma.hrisRight2workData.findFirst({
        where: {
          tspId: userId,
          contractUrl: {
            not: ''
          }
        },
        select: {
          user: {
            select: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          auditedBy: true,
          id: true
        },
        orderBy: {
          id: 'desc'
        }
      });

      const firstTimeSubmit = await this.prisma.hrisRight2workData.findFirst({
        where: {
          tspId: userId,
          contractUrl: ''
        },
        select: {
          id: true
        },
        orderBy: {
          id: 'desc'
        }
      });

      if (resubmit) {
        const auditorData = await this.prisma.user.findUnique({
          where: {
            tsp_id: resubmit.auditedBy
          },
          select: {
            username: true,
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

        //TODO : Wanna change to correct template names in mail service are bit confusing
        await this.mailService.sendNotifyAuditorResubmission(
          auditorData.approved_personal_data?.shortName ??
            auditorData.username ??
            '',
          resubmit.user.approved_personal_data?.shortName ?? '',
          'Contract',
          auditorData.username ?? '',
          `${userId}`
        );

        await this.prisma.hrisRight2workData.update({
          where: {
            id: resubmit.id
          },
          data: {
            contractUrl: url,
            updatedBy: userId,
            updatedAt: moment().toISOString()
          }
        });
      } else {
        await this.prisma.hrisRight2workData.update({
          where: {
            id: firstTimeSubmit.id
          },
          data: {
            contractUrl: url,
            updatedBy: userId,
            updatedAt: moment().toISOString()
          }
        });
      }
      */

      return {
        success: true
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Get Contract Url
  async checkExistingContract(userId: number) {
    //this function might be redundent
    try {
      const getContractRecord =
        await this.prisma.approvedContractData.findUnique({
          where: { tsp_id: userId }
        });

      if (getContractRecord) {
        if (
          getContractRecord.hr_admin_approval == 'approved' &&
          getContractRecord.contract_url &&
          getContractRecord.contract_url !== ''
        ) {
          return {
            isExisting: true,
            url: getContractRecord.contract_url,
            urlAuditStatus: getContractRecord.contract_url_status,
            UrlAuditRejectReason: getContractRecord.contract_url_reject_reason
          };
        }
      } else {
        return {
          isExisting: false
        };
      }
      /*
      //update contract logic
      const existing = await this.prisma.hrisRight2workData.findFirst({
        where: {
          tspId: userId
        },
        select: {
          contractUrl: true
        },
        orderBy: {
          id: 'desc'
        }
      });

      if (existing && existing.contractUrl && existing.contractUrl !== '') {
        return {
          isExisting: true,
          url: existing.contractUrl
        };
      } else {
        return {
          isExisting: false
        };
      }
      */
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //TSG External Form: Fetch referee values
  async fetchReferenceFormData(token: any) {
    const decodedToken = this.jwtService.decode(token) as any;
    const refereeEmailX = 'refereeEmail' + decodedToken.refereeCount;
    const refereeDetails = await this.prisma.approvedRefereeData.findMany({
      where: {
        tspId: decodedToken.tspId,
        [refereeEmailX]: decodedToken.refereeEmail
      }
    });
    const candidateName = await this.prisma.approvedPersonalData.findUnique({
      where: {
        tspId: decodedToken.tspId
      },
      select: {
        shortName: true
      }
    });
    let details;

    if (
      decodedToken.refereeCount === 1 &&
      refereeDetails &&
      refereeDetails[0]
    ) {
      details = {
        tspId: decodedToken.tspId,
        refereeEmail: refereeDetails[0].refereeEmail1,
        refereeName:
          refereeDetails[0].refereeTitle1 +
          '.' +
          refereeDetails[0].refereeFirstName1 +
          ' ' +
          refereeDetails[0].refereeLastName1,
        applicantName: candidateName.shortName ?? '',
        refereeId: `${decodedToken.tspId}-1`
      };
    } else if (
      decodedToken.refereeCount === 2 &&
      refereeDetails &&
      refereeDetails[0]
    ) {
      details = {
        tspId: decodedToken.tspId,
        refereeEmail: refereeDetails[0].refereeEmail2,
        refereeName:
          refereeDetails[0].refereeTitle2 +
          '.' +
          refereeDetails[0].refereeFirstName2 +
          ' ' +
          refereeDetails[0].refereeLastName2,
        applicantName: candidateName.shortName ?? '',
        refereeId: `${decodedToken.tspId}-2`
      };
    }

    return details;
  }

  //TSG External Form: Submit reference form data
  async saveReferenceForm(tspId: number, data: ReferenceFormDto) {
    try {
      const refereeID = data.refereeId.split('-');
      const refereeCount = refereeID[1];

      return this.prisma.$transaction(async (tx) => {
        const lastData = await this.prisma.approvedRefereeData.findUnique({
          where: {
            tspId: data.tspId
          }
        });

        if (lastData) {
          const submissionFlagFetched =
            lastData[`submissionFlag${refereeCount}`];

          if (submissionFlagFetched === 1) {
            // previous record found
            return {
              success: false,
              error: `Pre Exisiting Entry Found.`
            };
          } else if (submissionFlagFetched === -1) {
            // edit enabled, do not accept submissions
            return {
              success: false,
              error: `The link is expired. Please get in touch with us for any queries at: hr@thirdspaceglobal.com`
            };
          } else if (![0, null].includes(submissionFlagFetched)) {
            //no approved refree record exisit
            return {
              success: false,
              error: `Save failed due to Invalid Data`
            };
          } else {
            // valid, can submit

            const { refereeId, ...rest } = data;

            const collectedData = await tx.hrisReferenceCollected.create({
              data: {
                refereeId: data.refereeId,
                ...rest,
                refereeCount: +refereeCount
              }
            });

            const submissionFlagX = `submissionFlag${refereeCount}`;

            await tx.approvedRefereeData.update({
              where: { tspId: data.tspId },
              data: {
                [submissionFlagX]: 1
              }
            });

            return {
              success: true,
              message: `Record added Successfully`
            };
          }
        } else {
          //no approved refree record exisit
          return {
            success: false,
            error: `Save failed due to Invalid Data`
          };
        }
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Tutor: Fetch Support Documents
  async fetchSupportDocuments(tspId: number) {
    try {
      const approvedDetails =
        await this.prisma.approvedSupportDocuments.findUnique({
          where: {
            tspId: tspId
          },
          select: {
            document01Type: true,
            document01Comment: true,
            document01Url: true,
            document02Type: true,
            document02Comment: true,
            document02Url: true,
            document03Type: true,
            document03Comment: true,
            document03Url: true,
            document04Type: true,
            document04Comment: true,
            document04Url: true,
            document05Type: true,
            document05Comment: true,
            document05Url: true,
            document06Type: true,
            document06Comment: true,
            document06Url: true,
            document07Type: true,
            document07Comment: true,
            document07Url: true,
            document08Type: true,
            document08Comment: true,
            document08Url: true,
            document09Type: true,
            document09Comment: true,
            document09Url: true,
            document10Type: true,
            document10Comment: true,
            document10Url: true,
            document11Type: true,
            document11Comment: true,
            document11Url: true,
            document12Type: true,
            document12Comment: true,
            document12Url: true,
            document13Type: true,
            document13Comment: true,
            document13Url: true,
            document14Type: true,
            document14Comment: true,
            document14Url: true,
            document15Type: true,
            document15Comment: true,
            document15Url: true,
            document16Type: true,
            document16Comment: true,
            document16Url: true,
            document17Type: true,
            document17Comment: true,
            document17Url: true,
            document18Type: true,
            document18Comment: true,
            document18Url: true,
            document19Type: true,
            document19Comment: true,
            document19Url: true,
            document20Type: true,
            document20Comment: true,
            document20Url: true
          }
        });

      const details = await this.prisma.hrisSupportDocuments.findFirst({
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

  //Tutor: Fetch TSG User Support Documents
  async fetchTsgTutorSupportDocuments(tspId: number) {
    try {
      const approvedXotherAdminDocs =
        await this.prisma.approvedXotherAdminDocs.findMany({
          where: {
            tspId: +tspId,
            documentEnable: 1
          }
        });
      return {
        success: true,
        data: {
          details: approvedXotherAdminDocs
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  //Tutor: Submit Support Documents
  async submitSupportDocuments(tspId: number, data: SubmitSupportDocumentsDto) {
    const now = new Date().toISOString();
    const { id, type, country, profileStatus, ...rest } = data;

    // const data = { ...values };
    const selectedKeys = Object.entries(rest)
      .filter(
        ([key, value]) =>
          key.includes('document') && key.includes('Url') && value !== ''
      )
      .map(([key]) => key);

    const lastData = await this.prisma.hrisSupportDocuments.findFirst({
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
      const supportDocumentsData = await tx.hrisSupportDocuments.create({
        data: {
          tspId,
          ...rest,
          ...lastDataReasons,
          ...updatedStatus,
          updatedAt: now,
          updatedBy: tspId
        },
        select: {
          document01Type: true,
          document01Comment: true,
          document01Url: true,
          document01Status: true,
          document01RejectReason: true,
          document02Type: true,
          document02Comment: true,
          document02Url: true,
          document02Status: true,
          document02RejectReason: true,
          document03Type: true,
          document03Comment: true,
          document03Url: true,
          document03Status: true,
          document03RejectReason: true,
          document04Type: true,
          document04Comment: true,
          document04Url: true,
          document04Status: true,
          document04RejectReason: true,
          document05Type: true,
          document05Comment: true,
          document05Url: true,
          document05Status: true,
          document05RejectReason: true,
          document06Type: true,
          document06Comment: true,
          document06Url: true,
          document06Status: true,
          document06RejectReason: true,
          document07Type: true,
          document07Comment: true,
          document07Url: true,
          document07Status: true,
          document07RejectReason: true,
          document08Type: true,
          document08Comment: true,
          document08Url: true,
          document08Status: true,
          document08RejectReason: true,
          document09Type: true,
          document09Comment: true,
          document09Url: true,
          document09Status: true,
          document09RejectReason: true,
          document10Type: true,
          document10Comment: true,
          document10Url: true,
          document10Status: true,
          document10RejectReason: true,
          document11Type: true,
          document11Comment: true,
          document11Url: true,
          document11Status: true,
          document11RejectReason: true,
          document12Type: true,
          document12Comment: true,
          document12Url: true,
          document12Status: true,
          document12RejectReason: true,
          document13Type: true,
          document13Comment: true,
          document13Url: true,
          document13Status: true,
          document13RejectReason: true,
          document14Type: true,
          document14Comment: true,
          document14Url: true,
          document14Status: true,
          document14RejectReason: true,
          document15Type: true,
          document15Comment: true,
          document15Url: true,
          document15Status: true,
          document15RejectReason: true,
          document16Type: true,
          document16Comment: true,
          document16Url: true,
          document16Status: true,
          document16RejectReason: true,
          document17Type: true,
          document17Comment: true,
          document17Url: true,
          document17Status: true,
          document17RejectReason: true,
          document18Type: true,
          document18Comment: true,
          document18Url: true,
          document18Status: true,
          document18RejectReason: true,
          document19Type: true,
          document19Comment: true,
          document19Url: true,
          document19Status: true,
          document19RejectReason: true,
          document20Type: true,
          document20Comment: true,
          document20Url: true,
          document20Status: true,
          document20RejectReason: true
        }
      });

      await tx.approvedSupportDocuments.upsert({
        where: { tspId: tspId },
        update: {
          updatedFlag: 1
        },
        create: {
          tspId: tspId,
          updatedFlag: 1
        }
      });

      const fieldsMandatory = ['document01Url'];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return (
          prev +
          (supportDocumentsData[curr] && supportDocumentsData[curr] !== ''
            ? 1
            : 0)
        );
      }, 0);
      const supportDataCount = `${filledMandatoryFieldCount}/${fieldsMandatory.length}`;

      await tx.hrisProgress.upsert({
        where: {
          tspId
        },
        update: {
          supportDataCount: supportDataCount
        },
        create: {
          tspId,
          supportDataCount: supportDataCount
        }
      });

      const details = await tx.hrisSupportDocuments.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          document01Type: true,
          document01Comment: true,
          document01Url: true,
          document01Status: true,
          document01RejectReason: true,
          document02Type: true,
          document02Comment: true,
          document02Url: true,
          document02Status: true,
          document02RejectReason: true,
          document03Type: true,
          document03Comment: true,
          document03Url: true,
          document03Status: true,
          document03RejectReason: true,
          document04Type: true,
          document04Comment: true,
          document04Url: true,
          document04Status: true,
          document04RejectReason: true,
          document05Type: true,
          document05Comment: true,
          document05Url: true,
          document05Status: true,
          document05RejectReason: true,
          document06Type: true,
          document06Comment: true,
          document06Url: true,
          document06Status: true,
          document06RejectReason: true,
          document07Type: true,
          document07Comment: true,
          document07Url: true,
          document07Status: true,
          document07RejectReason: true,
          document08Type: true,
          document08Comment: true,
          document08Url: true,
          document08Status: true,
          document08RejectReason: true,
          document09Type: true,
          document09Comment: true,
          document09Url: true,
          document09Status: true,
          document09RejectReason: true,
          document10Type: true,
          document10Comment: true,
          document10Url: true,
          document10Status: true,
          document10RejectReason: true,
          document11Type: true,
          document11Comment: true,
          document11Url: true,
          document11Status: true,
          document11RejectReason: true,
          document12Type: true,
          document12Comment: true,
          document12Url: true,
          document12Status: true,
          document12RejectReason: true,
          document13Type: true,
          document13Comment: true,
          document13Url: true,
          document13Status: true,
          document13RejectReason: true,
          document14Type: true,
          document14Comment: true,
          document14Url: true,
          document14Status: true,
          document14RejectReason: true,
          document15Type: true,
          document15Comment: true,
          document15Url: true,
          document15Status: true,
          document15RejectReason: true,
          document16Type: true,
          document16Comment: true,
          document16Url: true,
          document16Status: true,
          document16RejectReason: true,
          document17Type: true,
          document17Comment: true,
          document17Url: true,
          document17Status: true,
          document17RejectReason: true,
          document18Type: true,
          document18Comment: true,
          document18Url: true,
          document18Status: true,
          document18RejectReason: true,
          document19Type: true,
          document19Comment: true,
          document19Url: true,
          document19Status: true,
          document19RejectReason: true,
          document20Type: true,
          document20Comment: true,
          document20Url: true,
          document20Status: true,
          document20RejectReason: true
        }
      });

      return details;
    });
  }

  //Auditor: Submit Support Documents
  async auditorSubmitSupportDocuments(
    tspId: number,
    data: AuditorSubmitSupportDocumentsDto
  ) {
    const now = new Date().toISOString();
    const { id, type, country, candidateId, profileStatus, ...rest } = data;
    let lastData = await this.prisma.hrisSupportDocuments.findFirst({
      where: {
        tspId: candidateId
      },
      orderBy: {
        id: 'desc'
      }
    });

    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisSupportDocuments.create({
        data: {
          tspId: candidateId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const supportDocumentsData = await tx.hrisSupportDocuments.create({
        data: {
          tspId: candidateId,
          ...rest,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
        },
        select: {
          document01Type: true,
          document01Comment: true,
          document01Url: true,
          document01Status: true,
          document01RejectReason: true,
          document02Type: true,
          document02Comment: true,
          document02Url: true,
          document02Status: true,
          document02RejectReason: true,
          document03Type: true,
          document03Comment: true,
          document03Url: true,
          document03Status: true,
          document03RejectReason: true,
          document04Type: true,
          document04Comment: true,
          document04Url: true,
          document04Status: true,
          document04RejectReason: true,
          document05Type: true,
          document05Comment: true,
          document05Url: true,
          document05Status: true,
          document05RejectReason: true,
          document06Type: true,
          document06Comment: true,
          document06Url: true,
          document06Status: true,
          document06RejectReason: true,
          document07Type: true,
          document07Comment: true,
          document07Url: true,
          document07Status: true,
          document07RejectReason: true,
          document08Type: true,
          document08Comment: true,
          document08Url: true,
          document08Status: true,
          document08RejectReason: true,
          document09Type: true,
          document09Comment: true,
          document09Url: true,
          document09Status: true,
          document09RejectReason: true,
          document10Type: true,
          document10Comment: true,
          document10Url: true,
          document10Status: true,
          document10RejectReason: true,
          document11Type: true,
          document11Comment: true,
          document11Url: true,
          document11Status: true,
          document11RejectReason: true,
          document12Type: true,
          document12Comment: true,
          document12Url: true,
          document12Status: true,
          document12RejectReason: true,
          document13Type: true,
          document13Comment: true,
          document13Url: true,
          document13Status: true,
          document13RejectReason: true,
          document14Type: true,
          document14Comment: true,
          document14Url: true,
          document14Status: true,
          document14RejectReason: true,
          document15Type: true,
          document15Comment: true,
          document15Url: true,
          document15Status: true,
          document15RejectReason: true,
          document16Type: true,
          document16Comment: true,
          document16Url: true,
          document16Status: true,
          document16RejectReason: true,
          document17Type: true,
          document17Comment: true,
          document17Url: true,
          document17Status: true,
          document17RejectReason: true,
          document18Type: true,
          document18Comment: true,
          document18Url: true,
          document18Status: true,
          document18RejectReason: true,
          document19Type: true,
          document19Comment: true,
          document19Url: true,
          document19Status: true,
          document19RejectReason: true,
          document20Type: true,
          document20Comment: true,
          document20Url: true,
          document20Status: true,
          document20RejectReason: true
        }
      });

      let previousApprovedData = await tx.approvedSupportDocuments.findUnique({
        where: {
          tspId: candidateId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedSupportDocuments.create({
          data: {
            tspId: candidateId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }

      let notAuditingFields = {};
      let auditingFields = {};
      const bulkFields = [];

      /**
       * custom logic to approve referee data
       */

      for (let i = 1; i <= 20; i++) {
        if (
          data[`document${i.toString().padStart(2, '0')}Status`] !== 'approved'
        ) {
          bulkFields.push(
            `document${i.toString().padStart(2, '0')}Type`,
            `document${i.toString().padStart(2, '0')}Comment`,
            `document${i.toString().padStart(2, '0')}Url`
          );
        }
      }

      if (previousApprovedData && lastData) {
        notAuditingFields = Object.entries(previousApprovedData)
          .filter(([key]) => !bulkFields.includes(key))
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

      await tx.approvedSupportDocuments.update({
        where: { tspId: candidateId },
        data: {
          ...notAuditingFields,
          ...auditingFields,
          updatedFlag: 3,
          approvedAt: now,
          approvedBy: tspId
        }
      });

      const fieldsMandatory = ['document01Url'];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return (
          prev +
          (supportDocumentsData[curr] && supportDocumentsData[curr] !== ''
            ? 1
            : 0)
        );
      }, 0);

      const fieldsAudited = [
        'document01Status',
        'document02Status',
        'document03Status',
        'document04Status',
        'document05Status',
        'document06Status',
        'document07Status',
        'document08Status',
        'document09Status',
        'document10Status',
        'document11Status',
        'document12Status',
        'document13Status',
        'document14Status',
        'document15Status',
        'document16Status',
        'document17Status',
        'document18Status',
        'document19Status',
        'document20Status'
      ];

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (supportDocumentsData[curr] &&
          ['approved', 'rejected'].includes(supportDocumentsData[curr])
            ? 1
            : 0)
        );
      }, 0);

      const supportDataCount = `${filledMandatoryFieldCount}/${fieldsMandatory.length}`;

      await tx.hrisProgress.upsert({
        where: {
          tspId: candidateId
        },
        update: {
          // supportDataEmp: filledMandatoryFieldCount,
          supportDataAuditor: auditedFieldCount,
          supportDataCount: supportDataCount
        },
        create: {
          tspId: candidateId,
          // supportDataEmp: filledMandatoryFieldCount,
          supportDataAuditor: auditedFieldCount,
          supportDataCount: supportDataCount
        }
      });

      const details = await tx.hrisSupportDocuments.findFirst({
        where: {
          tspId: candidateId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          document01Type: true,
          document01Comment: true,
          document01Url: true,
          document01Status: true,
          document01RejectReason: true,
          document02Type: true,
          document02Comment: true,
          document02Url: true,
          document02Status: true,
          document02RejectReason: true,
          document03Type: true,
          document03Comment: true,
          document03Url: true,
          document03Status: true,
          document03RejectReason: true,
          document04Type: true,
          document04Comment: true,
          document04Url: true,
          document04Status: true,
          document04RejectReason: true,
          document05Type: true,
          document05Comment: true,
          document05Url: true,
          document05Status: true,
          document05RejectReason: true,
          document06Type: true,
          document06Comment: true,
          document06Url: true,
          document06Status: true,
          document06RejectReason: true,
          document07Type: true,
          document07Comment: true,
          document07Url: true,
          document07Status: true,
          document07RejectReason: true,
          document08Type: true,
          document08Comment: true,
          document08Url: true,
          document08Status: true,
          document08RejectReason: true,
          document09Type: true,
          document09Comment: true,
          document09Url: true,
          document09Status: true,
          document09RejectReason: true,
          document10Type: true,
          document10Comment: true,
          document10Url: true,
          document10Status: true,
          document10RejectReason: true,
          document11Type: true,
          document11Comment: true,
          document11Url: true,
          document11Status: true,
          document11RejectReason: true,
          document12Type: true,
          document12Comment: true,
          document12Url: true,
          document12Status: true,
          document12RejectReason: true,
          document13Type: true,
          document13Comment: true,
          document13Url: true,
          document13Status: true,
          document13RejectReason: true,
          document14Type: true,
          document14Comment: true,
          document14Url: true,
          document14Status: true,
          document14RejectReason: true,
          document15Type: true,
          document15Comment: true,
          document15Url: true,
          document15Status: true,
          document15RejectReason: true,
          document16Type: true,
          document16Comment: true,
          document16Url: true,
          document16Status: true,
          document16RejectReason: true,
          document17Type: true,
          document17Comment: true,
          document17Url: true,
          document17Status: true,
          document17RejectReason: true,
          document18Type: true,
          document18Comment: true,
          document18Url: true,
          document18Status: true,
          document18RejectReason: true,
          document19Type: true,
          document19Comment: true,
          document19Url: true,
          document19Status: true,
          document19RejectReason: true,
          document20Type: true,
          document20Comment: true,
          document20Url: true,
          document20Status: true,
          document20RejectReason: true
        }
      });

      const approvedDetails = await tx.approvedSupportDocuments.findUnique({
        where: {
          tspId: candidateId
        },
        select: {
          document01Type: true,
          document01Comment: true,
          document01Url: true,
          document02Type: true,
          document02Comment: true,
          document02Url: true,
          document03Type: true,
          document03Comment: true,
          document03Url: true,
          document04Type: true,
          document04Comment: true,
          document04Url: true,
          document05Type: true,
          document05Comment: true,
          document05Url: true,
          document06Type: true,
          document06Comment: true,
          document06Url: true,
          document07Type: true,
          document07Comment: true,
          document07Url: true,
          document08Type: true,
          document08Comment: true,
          document08Url: true,
          document09Type: true,
          document09Comment: true,
          document09Url: true,
          document10Type: true,
          document10Comment: true,
          document10Url: true,
          document11Type: true,
          document11Comment: true,
          document11Url: true,
          document12Type: true,
          document12Comment: true,
          document12Url: true,
          document13Type: true,
          document13Comment: true,
          document13Url: true,
          document14Type: true,
          document14Comment: true,
          document14Url: true,
          document15Type: true,
          document15Comment: true,
          document15Url: true,
          document16Type: true,
          document16Comment: true,
          document16Url: true,
          document17Type: true,
          document17Comment: true,
          document17Url: true,
          document18Type: true,
          document18Comment: true,
          document18Url: true,
          document19Type: true,
          document19Comment: true,
          document19Url: true,
          document20Type: true,
          document20Comment: true,
          document20Url: true
        }
      });
      return { details, approvedDetails };
    });
  }
}
