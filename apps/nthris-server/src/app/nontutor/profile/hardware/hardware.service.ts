import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { HardwareDataDto, AuditorSubmitDetailsDto } from './hardware.dto';
import moment = require('moment');
@Injectable()
export class HardwareService {
  constructor(private prisma: PrismaService) {}

  async fetchHardwareDetails(tspId: number) {
    try {
      const approvedDetails = await this.prisma.approvedItData.findUnique({
        where: {
          tspId
        },
        select: {
          responsibleItCheck: true
        }
      });

      const details = await this.prisma.hrisItData.findFirst({
        where: {
          tspId: +tspId
        },
        select: {
          responsibleItCheck: true
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

  //Tutor: Submit It Details
  async saveHardwareDetails(tspId: number, data: HardwareDataDto) {
    //const { id, type, country, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    // const lastData = await this.prisma.hrisItData.findFirst({
    //   where: {
    //     tspId
    //   },
    //   orderBy: {
    //     id: 'desc'
    //   }
    // });

    // let lastDataReasons = {};
    // let updatedStatus = {};
    // let gotPendingFields = false; //logic to trigger email notification to hris@ticketsthirdspaceportal.com

    // if (lastData) {
    //   lastDataReasons = Object.entries(lastData)
    //     .filter(
    //       ([key, value]) => value !== null && key.includes('RejectReason')
    //     )
    //     .reduce((prev, [key, value]) => {
    //       prev[key] = value;
    //       return prev;
    //     }, {});

    //   updatedStatus = Object.entries(lastData)
    //     .filter(([key]) => key.includes('Status'))
    //     .map(([key, value]) => {
    //       const field = key.replace('Status', '');
    //       const newStatus = lastData[field] !== data[field] ? 'pending' : value;
    //       gotPendingFields = newStatus === 'pending' || gotPendingFields;
    //       return [key, newStatus];
    //     })
    //     .reduce((prev, [key, value]) => {
    //       prev[key as string] = value;
    //       return prev;
    //     }, {});
    // }

    return this.prisma.$transaction(async (tx) => {
      const hardwareData = await tx.hrisItData.create({
        data: {
          tspId,
          ...data,
          updatedAt: now,
          updatedBy: tspId
        },
        select: {
          responsibleItCheck: true
        }
      });

      // const fieldsMandatory = [
      //   'responsibleItCheck',
      //   'havePc',
      //   'haveHeadset',
      //   'primaryConnectionType',
      //   'primaryIsp',
      //   'primaryDownloadSpeed',
      //   'primaryUploadSpeed',
      //   'primaryPing',
      //   'haveSecondaryConnection',
      //   'primarySpeedUrl'
      // ];

      // const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
      //   return prev + (hardwareData[curr] && hardwareData[curr] !== '' ? 1 : 0);
      // }, 0);
      // await tx.hrisProgress.upsert({
      //   where: {
      //     tspId
      //   },
      //   update: {
      //     itDataEmp: filledMandatoryFieldCount
      //   },
      //   create: {
      //     tspId,
      //     itDataEmp: filledMandatoryFieldCount
      //   }
      // });

      // const details = await tx.hrisItData.findFirst({
      //   where: {
      //     tspId
      //   },
      //   orderBy: {
      //     id: 'desc'
      //   },
      //   select: {
      //     havePc: true,
      //     havePcStatus: true,
      //     havePcRejectReason: true,
      //     pcType: true,
      //     pcTypeStatus: true,
      //     pcTypeRejectReason: true,
      //     pcOwnership: true,
      //     pcOwnershipStatus: true,
      //     pcOwnershipRejectReason: true,
      //     pcBrand: true,
      //     pcBrandStatus: true,
      //     pcBrandRejectReason: true,
      //     pcBrandOther: true,
      //     pcBrandOtherStatus: true,
      //     pcBrandOtherRejectReason: true,
      //     pcModel: true,
      //     pcModelStatus: true,
      //     pcModelRejectReason: true,
      //     pcBitVersion: true,
      //     pcBitVersionStatus: true,
      //     pcBitVersionRejectReason: true,
      //     laptopSerial: true,
      //     laptopSerialStatus: true,
      //     laptopSerialRejectReason: true,
      //     laptopBatteryAge: true,
      //     laptopBatteryAgeStatus: true,
      //     laptopBatteryAgeRejectReason: true,
      //     laptopBatteryRuntime: true,
      //     laptopBatteryRuntimeStatus: true,
      //     laptopBatteryRuntimeRejectReason: true,
      //     pcOs: true,
      //     pcOsStatus: true,
      //     pcOsRejectReason: true,
      //     pcOsOther: true,
      //     pcOsOtherStatus: true,
      //     pcOsOtherRejectReason: true,
      //     pcProcessor: true,
      //     pcProcessorStatus: true,
      //     pcProcessorRejectReason: true,
      //     pcProcessorOther: true,
      //     pcProcessorOtherStatus: true,
      //     pcProcessorOtherRejectReason: true,
      //     pcRam: true,
      //     pcRamStatus: true,
      //     pcRamRejectReason: true,
      //     hdType: true,
      //     hdTypeStatus: true,
      //     hdTypeRejectReason: true,
      //     hdCapacity: true,
      //     hdCapacityStatus: true,
      //     hdCapacityRejectReason: true,
      //     pcBrowsers: true,
      //     pcBrowsersStatus: true,
      //     pcBrowsersRejectReason: true,
      //     pcAntivirus: true,
      //     pcAntivirusStatus: true,
      //     pcAntivirusRejectReason: true,
      //     pcAntivirusOther: true,
      //     pcAntivirusOtherStatus: true,
      //     pcAntivirusOtherRejectReason: true,
      //     lastServiceDate: true,
      //     lastServiceDateStatus: true,
      //     lastServiceDateRejectReason: true,
      //     pcIPAddress: true,
      //     pcIPAddressStatus: true,
      //     pcIPAddressRejectReason: true,
      //     ramUrl: true,
      //     ramUrlStatus: true,
      //     ramUrlRejectReason: true,
      //     pcUrl: true,
      //     pcUrlStatus: true,
      //     pcUrlRejectReason: true,
      //     desktopUps: true,
      //     desktopUpsStatus: true,
      //     desktopUpsRejectReason: true,
      //     desktopUpsUrl: true,
      //     desktopUpsUrlStatus: true,
      //     desktopUpsUrlRejectReason: true,
      //     desktopUpsRuntime: true,
      //     desktopUpsRuntimeStatus: true,
      //     desktopUpsRuntimeRejectReason: true,
      //     haveHeadset: true,
      //     haveHeadsetStatus: true,
      //     haveHeadsetRejectReason: true,
      //     headsetUsb: true,
      //     headsetUsbStatus: true,
      //     headsetUsbRejectReason: true,
      //     headsetConnectivityType: true,
      //     headsetConnectivityTypeStatus: true,
      //     headsetConnectivityTypeRejectReason: true,
      //     headsetMuteBtn: true,
      //     headsetMuteBtnStatus: true,
      //     headsetMuteBtnRejectReason: true,
      //     headsetNoiseCancel: true,
      //     headsetNoiseCancelStatus: true,
      //     headsetNoiseCancelRejectReason: true,
      //     headsetSpecs: true,
      //     headsetSpecsStatus: true,
      //     headsetSpecsRejectReason: true,
      //     headsetUrl: true,
      //     headsetUrlStatus: true,
      //     headsetUrlRejectReason: true,
      //     primaryConnectionType: true,
      //     primaryConnectionTypeStatus: true,
      //     primaryConnectionTypeRejectReason: true,
      //     primaryIsp: true,
      //     primaryIspStatus: true,
      //     primaryIspRejectReason: true,
      //     primaryIspOther: true,
      //     primaryIspOtherStatus: true,
      //     primaryIspOtherRejectReason: true,
      //     primaryConnectedCount: true,
      //     primaryConnectedCountStatus: true,
      //     primaryConnectedCountRejectReason: true,
      //     primaryDownloadSpeed: true,
      //     primaryDownloadSpeedStatus: true,
      //     primaryDownloadSpeedRejectReason: true,
      //     primaryUploadSpeed: true,
      //     primaryUploadSpeedStatus: true,
      //     primaryUploadSpeedRejectReason: true,
      //     primaryPing: true,
      //     primaryPingStatus: true,
      //     primaryPingRejectReason: true,
      //     haveSecondaryConnection: true,
      //     haveSecondaryConnectionStatus: true,
      //     haveSecondaryConnectionRejectReason: true,
      //     secondaryConnectionType: true,
      //     secondaryConnectionTypeStatus: true,
      //     secondaryConnectionTypeRejectReason: true,
      //     secondaryIsp: true,
      //     secondaryIspStatus: true,
      //     secondaryIspRejectReason: true,
      //     secondaryIspOther: true,
      //     secondaryIspOtherStatus: true,
      //     secondaryIspOtherRejectReason: true,
      //     secondaryDownloadSpeed: true,
      //     secondaryDownloadSpeedStatus: true,
      //     secondaryDownloadSpeedRejectReason: true,
      //     secondaryUploadSpeed: true,
      //     secondaryUploadSpeedStatus: true,
      //     secondaryUploadSpeedRejectReason: true,
      //     secondaryPing: true,
      //     secondaryPingStatus: true,
      //     secondaryPingRejectReason: true,
      //     primarySpeedUrl: true,
      //     primarySpeedUrlStatus: true,
      //     primarySpeedUrlRejectReason: true,
      //     secondarySpeedUrl: true,
      //     secondarySpeedUrlStatus: true,
      //     secondarySpeedUrlRejectReason: true,
      //     responsibleItCheck: true
      //   }
      // });

      // const hrisProgressFetched = await tx.user.findUnique({
      //   where: {
      //     tsp_id: tspId
      //   },
      //   include: {
      //     user_hris_progress: {
      //       select: {
      //         profileStatus: true
      //       }
      //     },
      //     approved_personal_data: {
      //       select: {
      //         shortName: true
      //       }
      //     },
      //     approved_contact_data: {
      //       select: {
      //         workEmail: true
      //       }
      //     }
      //   }
      // });
      // hrisProgressFetched &&
      //   hrisProgressFetched.user_hris_progress &&
      //   hrisProgressFetched.user_hris_progress.profileStatus &&
      //   hrisProgressFetched.user_hris_progress.profileStatus === 'active' &&
      //   gotPendingFields;
      // {
      //   // notify hris@ticketsthirdspaceportal.com on tutor updating key profile data
      //   // await this.mailService.sendNotification2Ticketsthirdspaceportal(
      //   //   tspId + '',
      //   //   hrisProgressFetched?.approved_personal_data?.shortName ?? '',
      //   //   hrisProgressFetched?.approved_contact_data?.workEmail ?? '',
      //   //   'IT Requirements'
      //   // );
      // }

      return hardwareData;
    });
  }

  async auditorSubmitDetails(tspId: number, data: AuditorSubmitDetailsDto) {
    const { id, type, country, nonTutorId, profileStatus, ...rest } = data;
    const now = new Date().toISOString();

    let lastData = await this.prisma.hrisItData.findFirst({
      where: {
        tspId: nonTutorId
      },
      orderBy: {
        id: 'desc'
      }
    });
    //if no lastData record found, create a dummy one to tackle bug
    if (!lastData) {
      lastData = await this.prisma.hrisItData.create({
        data: {
          tspId: nonTutorId
        }
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const hardwareData = await tx.hrisItData.create({
        data: {
          tspId: nonTutorId,
          ...rest,
          updatedAt: now,
          updatedBy: tspId,
          auditedAt: now,
          auditedBy: tspId
        },
        select: {
          havePc: true,
          havePcStatus: true,
          havePcRejectReason: true,
          pcType: true,
          pcTypeStatus: true,
          pcTypeRejectReason: true,
          pcOwnership: true,
          pcOwnershipStatus: true,
          pcOwnershipRejectReason: true,
          pcBrand: true,
          pcBrandStatus: true,
          pcBrandRejectReason: true,
          pcBrandOther: true,
          pcBrandOtherStatus: true,
          pcBrandOtherRejectReason: true,
          pcModel: true,
          pcModelStatus: true,
          pcModelRejectReason: true,
          pcBitVersion: true,
          pcBitVersionStatus: true,
          pcBitVersionRejectReason: true,
          laptopSerial: true,
          laptopSerialStatus: true,
          laptopSerialRejectReason: true,
          laptopBatteryAge: true,
          laptopBatteryAgeStatus: true,
          laptopBatteryAgeRejectReason: true,
          laptopBatteryRuntime: true,
          laptopBatteryRuntimeStatus: true,
          laptopBatteryRuntimeRejectReason: true,
          pcOs: true,
          pcOsStatus: true,
          pcOsRejectReason: true,
          pcOsOther: true,
          pcOsOtherStatus: true,
          pcOsOtherRejectReason: true,
          pcProcessor: true,
          pcProcessorStatus: true,
          pcProcessorRejectReason: true,
          pcProcessorOther: true,
          pcProcessorOtherStatus: true,
          pcProcessorOtherRejectReason: true,
          pcRam: true,
          pcRamStatus: true,
          pcRamRejectReason: true,
          hdType: true,
          hdTypeStatus: true,
          hdTypeRejectReason: true,
          hdCapacity: true,
          hdCapacityStatus: true,
          hdCapacityRejectReason: true,
          pcBrowsers: true,
          pcBrowsersStatus: true,
          pcBrowsersRejectReason: true,
          pcAntivirus: true,
          pcAntivirusStatus: true,
          pcAntivirusRejectReason: true,
          pcAntivirusOther: true,
          pcAntivirusOtherStatus: true,
          pcAntivirusOtherRejectReason: true,
          lastServiceDate: true,
          lastServiceDateStatus: true,
          lastServiceDateRejectReason: true,
          pcIPAddress: true,
          pcIPAddressStatus: true,
          pcIPAddressRejectReason: true,
          ramUrl: true,
          ramUrlStatus: true,
          ramUrlRejectReason: true,
          pcUrl: true,
          pcUrlStatus: true,
          pcUrlRejectReason: true,
          desktopUps: true,
          desktopUpsStatus: true,
          desktopUpsRejectReason: true,
          desktopUpsUrl: true,
          desktopUpsUrlStatus: true,
          desktopUpsUrlRejectReason: true,
          desktopUpsRuntime: true,
          desktopUpsRuntimeStatus: true,
          desktopUpsRuntimeRejectReason: true,
          haveHeadset: true,
          haveHeadsetStatus: true,
          haveHeadsetRejectReason: true,
          headsetUsb: true,
          headsetUsbStatus: true,
          headsetUsbRejectReason: true,
          headsetConnectivityType: true,
          headsetConnectivityTypeStatus: true,
          headsetConnectivityTypeRejectReason: true,
          headsetMuteBtn: true,
          headsetMuteBtnStatus: true,
          headsetMuteBtnRejectReason: true,
          headsetNoiseCancel: true,
          headsetNoiseCancelStatus: true,
          headsetNoiseCancelRejectReason: true,
          headsetSpecs: true,
          headsetSpecsStatus: true,
          headsetSpecsRejectReason: true,
          headsetUrl: true,
          headsetUrlStatus: true,
          headsetUrlRejectReason: true,
          primaryConnectionType: true,
          primaryConnectionTypeStatus: true,
          primaryConnectionTypeRejectReason: true,
          primaryIsp: true,
          primaryIspStatus: true,
          primaryIspRejectReason: true,
          primaryIspOther: true,
          primaryIspOtherStatus: true,
          primaryIspOtherRejectReason: true,
          primaryConnectedCount: true,
          primaryConnectedCountStatus: true,
          primaryConnectedCountRejectReason: true,
          primaryDownloadSpeed: true,
          primaryDownloadSpeedStatus: true,
          primaryDownloadSpeedRejectReason: true,
          primaryUploadSpeed: true,
          primaryUploadSpeedStatus: true,
          primaryUploadSpeedRejectReason: true,
          primaryPing: true,
          primaryPingStatus: true,
          primaryPingRejectReason: true,
          haveSecondaryConnection: true,
          haveSecondaryConnectionStatus: true,
          haveSecondaryConnectionRejectReason: true,
          secondaryConnectionType: true,
          secondaryConnectionTypeStatus: true,
          secondaryConnectionTypeRejectReason: true,
          secondaryIsp: true,
          secondaryIspStatus: true,
          secondaryIspRejectReason: true,
          secondaryIspOther: true,
          secondaryIspOtherStatus: true,
          secondaryIspOtherRejectReason: true,
          secondaryDownloadSpeed: true,
          secondaryDownloadSpeedStatus: true,
          secondaryDownloadSpeedRejectReason: true,
          secondaryUploadSpeed: true,
          secondaryUploadSpeedStatus: true,
          secondaryUploadSpeedRejectReason: true,
          secondaryPing: true,
          secondaryPingStatus: true,
          secondaryPingRejectReason: true,
          primarySpeedUrl: true,
          primarySpeedUrlStatus: true,
          primarySpeedUrlRejectReason: true,
          secondarySpeedUrl: true,
          secondarySpeedUrlStatus: true,
          secondarySpeedUrlRejectReason: true,
          responsibleItCheck: true
        }
      });

      let previousApprovedData = await tx.approvedItData.findUnique({
        where: {
          tspId: nonTutorId
        }
      });

      if (!previousApprovedData) {
        previousApprovedData = await tx.approvedItData.create({
          data: {
            tspId: nonTutorId,
            approvedAt: now,
            approvedBy: tspId
          }
        });
      }

      let notAuditingFields = {};
      let auditingFields = {};
      // const bulkFields =
      //   data.havePcStatus === 'approved'
      //     ? []
      //     : [
      //         'havePc',
      //         'pcType',
      //         'pcSpecs',
      //         'pcUrl',
      //         'haveHeadset',
      //         'headsetSpecs',
      //         'headsetUrl',
      //         'primaryConnectionType',
      //         'primaryIsp',
      //         'secondaryConnectionType',
      //         'secondaryIsp',
      //         'primaryDownloadSpeed',
      //         'primarySpeedUrl',
      //         'responsibleItCheck',
      //         'recordApproved',
      //         'powerStatus',
      //         'pcOwnership',
      //         'pcOs',
      //         'pcRam',
      //         'hdType',
      //         'hdCapacity',
      //         'hdCapacityUnit',
      //         'pcBrowsers',
      //         'pcAntivirus',
      //         'headsetUsb',
      //         'headsetMuteBtn',
      //         'headsetNoiseCancel',
      //         'primaryConnectedCount',
      //         'primaryIspOther',
      //         'primaryUploadSpeed',
      //         'primaryPing',
      //         'haveSecondaryConnection',
      //         'secondaryIspOther',
      //         'secondaryDownloadSpeed',
      //         'secondaryUploadSpeed',
      //         'secondaryPing'
      //       ];
      // .filter(([key]) => !bulkFields.includes(key))

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

      await tx.approvedItData.update({
        where: { tspId: nonTutorId },
        data: {
          ...notAuditingFields,
          ...auditingFields,
          approvedAt: now,
          approvedBy: tspId
        }
      });
      const fieldsMandatory = [
        'havePc',
        'haveHeadset',
        'primaryConnectionType',
        'primaryIsp',
        'primaryDownloadSpeed',
        'primaryUploadSpeed',
        'primaryPing',
        'haveSecondaryConnection',
        'primarySpeedUrl'
      ];

      const filledMandatoryFieldCount = fieldsMandatory.reduce((prev, curr) => {
        return prev + (hardwareData[curr] && hardwareData[curr] !== '' ? 1 : 0);
      }, 0);

      const fieldsAudited = [
        'havePcStatus',
        'pcTypeStatus',
        'pcOwnershipStatus',
        'pcBrandStatus',
        'pcBrandOtherStatus',
        'pcModelStatus',
        'pcBitVersionStatus',
        'laptopSerialStatus',
        'laptopBatteryAgeStatus',
        'laptopBatteryRuntimeStatus',
        'pcOsStatus',
        'pcOsOtherStatus',
        'pcProcessorStatus',
        'pcProcessorOtherStatus',
        'pcRamStatus',
        'hdTypeStatus',
        'hdCapacityStatus',
        'pcBrowsersStatus',
        'pcAntivirusStatus',
        'pcAntivirusOtherStatus',
        'lastServiceDateStatus',
        'pcIPAddressStatus',
        'ramUrlStatus',
        'pcUrlStatus',
        'desktopUpsStatus',
        'desktopUpsUrlStatus',
        'desktopUpsRuntimeStatus',
        'haveHeadsetStatus',
        'headsetUsbStatus',
        'headsetConnectivityTypeStatus',
        'headsetMuteBtnStatus',
        'headsetNoiseCancelStatus',
        'headsetSpecsStatus',
        'headsetUrlStatus',
        'primaryConnectionTypeStatus',
        'primaryIspStatus',
        'primaryIspOtherStatus',
        'primaryConnectedCountStatus',
        'primaryDownloadSpeedStatus',
        'primaryUploadSpeedStatus',
        'primaryPingStatus',
        'haveSecondaryConnectionStatus',
        'secondaryConnectionTypeStatus',
        'secondaryIspStatus',
        'secondaryIspOtherStatus',
        'secondaryDownloadSpeedStatus',
        'secondaryUploadSpeedStatus',
        'secondaryPingStatus',
        'primarySpeedUrlStatus',
        'secondarySpeedUrlStatus'
      ];

      const auditedFieldCount = fieldsAudited.reduce((prev, curr) => {
        return (
          prev +
          (hardwareData[curr] &&
          ['approved', 'rejected'].includes(hardwareData[curr])
            ? 1
            : 0)
        );
      }, 0);

      await tx.hrisProgress.upsert({
        where: {
          tspId: nonTutorId
        },
        update: {
          itDataEmp: filledMandatoryFieldCount,
          itDataAuditor: auditedFieldCount,
          itDataCount: `${filledMandatoryFieldCount}/9`
        },
        create: {
          tspId,
          itDataEmp: filledMandatoryFieldCount,
          itDataAuditor: auditedFieldCount,
          itDataCount: `${filledMandatoryFieldCount}/9`
        }
      });

      const details = await tx.hrisItData.findFirst({
        where: {
          tspId: nonTutorId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          havePc: true,
          havePcStatus: true,
          havePcRejectReason: true,
          pcType: true,
          pcTypeStatus: true,
          pcTypeRejectReason: true,
          pcOwnership: true,
          pcOwnershipStatus: true,
          pcOwnershipRejectReason: true,
          pcBrand: true,
          pcBrandStatus: true,
          pcBrandRejectReason: true,
          pcBrandOther: true,
          pcBrandOtherStatus: true,
          pcBrandOtherRejectReason: true,
          pcModel: true,
          pcModelStatus: true,
          pcModelRejectReason: true,
          pcBitVersion: true,
          pcBitVersionStatus: true,
          pcBitVersionRejectReason: true,
          laptopSerial: true,
          laptopSerialStatus: true,
          laptopSerialRejectReason: true,
          laptopBatteryAge: true,
          laptopBatteryAgeStatus: true,
          laptopBatteryAgeRejectReason: true,
          laptopBatteryRuntime: true,
          laptopBatteryRuntimeStatus: true,
          laptopBatteryRuntimeRejectReason: true,
          pcOs: true,
          pcOsStatus: true,
          pcOsRejectReason: true,
          pcOsOther: true,
          pcOsOtherStatus: true,
          pcOsOtherRejectReason: true,
          pcProcessor: true,
          pcProcessorStatus: true,
          pcProcessorRejectReason: true,
          pcProcessorOther: true,
          pcProcessorOtherStatus: true,
          pcProcessorOtherRejectReason: true,
          pcRam: true,
          pcRamStatus: true,
          pcRamRejectReason: true,
          hdType: true,
          hdTypeStatus: true,
          hdTypeRejectReason: true,
          hdCapacity: true,
          hdCapacityStatus: true,
          hdCapacityRejectReason: true,
          pcBrowsers: true,
          pcBrowsersStatus: true,
          pcBrowsersRejectReason: true,
          pcAntivirus: true,
          pcAntivirusStatus: true,
          pcAntivirusRejectReason: true,
          pcAntivirusOther: true,
          pcAntivirusOtherStatus: true,
          pcAntivirusOtherRejectReason: true,
          lastServiceDate: true,
          lastServiceDateStatus: true,
          lastServiceDateRejectReason: true,
          pcIPAddress: true,
          pcIPAddressStatus: true,
          pcIPAddressRejectReason: true,
          ramUrl: true,
          ramUrlStatus: true,
          ramUrlRejectReason: true,
          pcUrl: true,
          pcUrlStatus: true,
          pcUrlRejectReason: true,
          desktopUps: true,
          desktopUpsStatus: true,
          desktopUpsRejectReason: true,
          desktopUpsUrl: true,
          desktopUpsUrlStatus: true,
          desktopUpsUrlRejectReason: true,
          desktopUpsRuntime: true,
          desktopUpsRuntimeStatus: true,
          desktopUpsRuntimeRejectReason: true,
          haveHeadset: true,
          haveHeadsetStatus: true,
          haveHeadsetRejectReason: true,
          headsetUsb: true,
          headsetUsbStatus: true,
          headsetUsbRejectReason: true,
          headsetConnectivityType: true,
          headsetConnectivityTypeStatus: true,
          headsetConnectivityTypeRejectReason: true,
          headsetMuteBtn: true,
          headsetMuteBtnStatus: true,
          headsetMuteBtnRejectReason: true,
          headsetNoiseCancel: true,
          headsetNoiseCancelStatus: true,
          headsetNoiseCancelRejectReason: true,
          headsetSpecs: true,
          headsetSpecsStatus: true,
          headsetSpecsRejectReason: true,
          headsetUrl: true,
          headsetUrlStatus: true,
          headsetUrlRejectReason: true,
          primaryConnectionType: true,
          primaryConnectionTypeStatus: true,
          primaryConnectionTypeRejectReason: true,
          primaryIsp: true,
          primaryIspStatus: true,
          primaryIspRejectReason: true,
          primaryIspOther: true,
          primaryIspOtherStatus: true,
          primaryIspOtherRejectReason: true,
          primaryConnectedCount: true,
          primaryConnectedCountStatus: true,
          primaryConnectedCountRejectReason: true,
          primaryDownloadSpeed: true,
          primaryDownloadSpeedStatus: true,
          primaryDownloadSpeedRejectReason: true,
          primaryUploadSpeed: true,
          primaryUploadSpeedStatus: true,
          primaryUploadSpeedRejectReason: true,
          primaryPing: true,
          primaryPingStatus: true,
          primaryPingRejectReason: true,
          haveSecondaryConnection: true,
          haveSecondaryConnectionStatus: true,
          haveSecondaryConnectionRejectReason: true,
          secondaryConnectionType: true,
          secondaryConnectionTypeStatus: true,
          secondaryConnectionTypeRejectReason: true,
          secondaryIsp: true,
          secondaryIspStatus: true,
          secondaryIspRejectReason: true,
          secondaryIspOther: true,
          secondaryIspOtherStatus: true,
          secondaryIspOtherRejectReason: true,
          secondaryDownloadSpeed: true,
          secondaryDownloadSpeedStatus: true,
          secondaryDownloadSpeedRejectReason: true,
          secondaryUploadSpeed: true,
          secondaryUploadSpeedStatus: true,
          secondaryUploadSpeedRejectReason: true,
          secondaryPing: true,
          secondaryPingStatus: true,
          secondaryPingRejectReason: true,
          primarySpeedUrl: true,
          primarySpeedUrlStatus: true,
          primarySpeedUrlRejectReason: true,
          secondarySpeedUrl: true,
          secondarySpeedUrlStatus: true,
          secondarySpeedUrlRejectReason: true,
          responsibleItCheck: true
        }
      });

      const approvedDetails = await this.prisma.approvedItData.findUnique({
        where: {
          tspId: nonTutorId
        },
        select: {
          havePc: true,
          pcType: true,
          pcOwnership: true,
          pcBrand: true,
          pcBrandOther: true,
          pcModel: true,
          pcBitVersion: true,
          laptopSerial: true,
          laptopBatteryAge: true,
          laptopBatteryRuntime: true,
          pcOs: true,
          pcOsOther: true,
          pcProcessor: true,
          pcProcessorOther: true,
          pcRam: true,
          hdType: true,
          hdCapacity: true,
          pcBrowsers: true,
          pcAntivirus: true,
          pcAntivirusOther: true,
          lastServiceDate: true,
          pcIPAddress: true,
          ramUrl: true,
          pcUrl: true,
          desktopUps: true,
          desktopUpsUrl: true,
          desktopUpsRuntime: true,
          haveHeadset: true,
          headsetUsb: true,
          headsetConnectivityType: true,
          headsetMuteBtn: true,
          headsetNoiseCancel: true,
          headsetSpecs: true,
          headsetUrl: true,
          primaryConnectionType: true,
          primaryIsp: true,
          primaryIspOther: true,
          primaryConnectedCount: true,
          primaryDownloadSpeed: true,
          primaryUploadSpeed: true,
          primaryPing: true,
          haveSecondaryConnection: true,
          secondaryConnectionType: true,
          secondaryIsp: true,
          secondaryIspOther: true,
          secondaryDownloadSpeed: true,
          secondaryUploadSpeed: true,
          secondaryPing: true,
          primarySpeedUrl: true,
          secondarySpeedUrl: true,
          responsibleItCheck: true
        }
      });
      return { details, approvedDetails };
    });
  }
}
