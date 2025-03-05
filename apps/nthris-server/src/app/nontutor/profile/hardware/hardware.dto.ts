import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

export class HardwareDataDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  profileStatus: string;

  @IsOptional()
  @IsString()
  havePc: string;

  @IsOptional()
  @IsString()
  havePcStatus: string;

  @IsOptional()
  @IsString()
  havePcRejectReason: string;

  @IsOptional()
  @IsString()
  pcType: string;

  @IsOptional()
  @IsString()
  pcTypeStatus: string;

  @IsOptional()
  @IsString()
  pcTypeRejectReason: string;

  @IsOptional()
  @IsString()
  pcOwnership: string;

  @IsOptional()
  @IsString()
  pcOwnershipStatus: string;

  @IsOptional()
  @IsString()
  pcOwnershipRejectReason: string;

  @IsOptional()
  @IsString()
  pcBrand: string;

  @IsOptional()
  @IsString()
  pcBrandStatus: string;

  @IsOptional()
  @IsString()
  pcBrandRejectReason: string;

  @IsOptional()
  @IsString()
  pcBrandOther: string;

  @IsOptional()
  @IsString()
  pcBrandOtherStatus: string;

  @IsOptional()
  @IsString()
  pcBrandOtherRejectReason: string;

  @IsOptional()
  @IsString()
  pcModel: string;

  @IsOptional()
  @IsString()
  pcModelStatus: string;

  @IsOptional()
  @IsString()
  pcModelRejectReason: string;

  @IsOptional()
  @IsString()
  pcBitVersion: string;

  @IsOptional()
  @IsString()
  pcBitVersionStatus: string;

  @IsOptional()
  @IsString()
  pcBitVersionRejectReason: string;

  @IsOptional()
  @IsString()
  laptopSerial: string;

  @IsOptional()
  @IsString()
  laptopSerialStatus: string;

  @IsOptional()
  @IsString()
  laptopSerialRejectReason: string;

  @IsOptional()
  @IsString()
  laptopBatteryAge: string;

  @IsOptional()
  @IsString()
  laptopBatteryAgeStatus: string;

  @IsOptional()
  @IsString()
  laptopBatteryAgeRejectReason: string;

  @IsOptional()
  @IsString()
  laptopBatteryRuntime: string;

  @IsOptional()
  @IsString()
  laptopBatteryRuntimeStatus: string;

  @IsOptional()
  @IsString()
  laptopBatteryRuntimeRejectReason: string;

  @IsOptional()
  @IsString()
  pcOs: string;

  @IsOptional()
  @IsString()
  pcOsStatus: string;

  @IsOptional()
  @IsString()
  pcOsRejectReason: string;

  @IsOptional()
  @IsString()
  pcOsOther: string;

  @IsOptional()
  @IsString()
  pcOsOtherStatus: string;

  @IsOptional()
  @IsString()
  pcOsOtherRejectReason: string;

  @IsOptional()
  @IsString()
  pcProcessor: string;

  @IsOptional()
  @IsString()
  pcProcessorStatus: string;

  @IsOptional()
  @IsString()
  pcProcessorRejectReason: string;

  @IsOptional()
  @IsString()
  pcProcessorOther: string;

  @IsOptional()
  @IsString()
  pcProcessorOtherStatus: string;

  @IsOptional()
  @IsString()
  pcProcessorOtherRejectReason: string;

  @IsOptional()
  @IsString()
  pcRam: string;

  @IsOptional()
  @IsString()
  pcRamStatus: string;

  @IsOptional()
  @IsString()
  pcRamRejectReason: string;

  @IsOptional()
  @IsString()
  hdType: string;

  @IsOptional()
  @IsString()
  hdTypeStatus: string;

  @IsOptional()
  @IsString()
  hdTypeRejectReason: string;

  @IsOptional()
  @IsString()
  hdCapacity: string;

  @IsOptional()
  @IsString()
  hdCapacityStatus: string;

  @IsOptional()
  @IsString()
  hdCapacityRejectReason: string;

  @IsOptional()
  @IsString()
  pcBrowsers: string;

  @IsOptional()
  @IsString()
  pcBrowsersStatus: string;

  @IsOptional()
  @IsString()
  pcBrowsersRejectReason: string;

  @IsOptional()
  @IsString()
  pcAntivirus: string;

  @IsOptional()
  @IsString()
  pcAntivirusStatus: string;

  @IsOptional()
  @IsString()
  pcAntivirusRejectReason: string;

  @IsOptional()
  @IsString()
  pcAntivirusOther: string;

  @IsOptional()
  @IsString()
  pcAntivirusOtherStatus: string;

  @IsOptional()
  @IsString()
  pcAntivirusOtherRejectReason: string;

  @IsOptional()
  @IsString()
  lastServiceDate: string;

  @IsOptional()
  @IsString()
  lastServiceDateStatus: string;

  @IsOptional()
  @IsString()
  lastServiceDateRejectReason: string;

  @IsOptional()
  @IsString()
  pcIPAddress: string;

  @IsOptional()
  @IsString()
  pcIPAddressStatus: string;

  @IsOptional()
  @IsString()
  pcIPAddressRejectReason: string;

  @IsOptional()
  @IsString()
  ramUrl: string;

  @IsOptional()
  @IsString()
  ramUrlStatus: string;

  @IsOptional()
  @IsString()
  ramUrlRejectReason: string;

  @IsOptional()
  @IsString()
  pcUrl: string;

  @IsOptional()
  @IsString()
  pcUrlStatus: string;

  @IsOptional()
  @IsString()
  pcUrlRejectReason: string;

  @IsOptional()
  @IsString()
  desktopUps: string;

  @IsOptional()
  @IsString()
  desktopUpsStatus: string;

  @IsOptional()
  @IsString()
  desktopUpsRejectReason: string;

  @IsOptional()
  @IsString()
  desktopUpsUrl: string;

  @IsOptional()
  @IsString()
  desktopUpsUrlStatus: string;

  @IsOptional()
  @IsString()
  desktopUpsUrlRejectReason: string;

  @IsOptional()
  @IsString()
  desktopUpsRuntime: string;

  @IsOptional()
  @IsString()
  desktopUpsRuntimeStatus: string;

  @IsOptional()
  @IsString()
  desktopUpsRuntimeRejectReason: string;

  @IsOptional()
  @IsString()
  haveHeadset: string;

  @IsOptional()
  @IsString()
  haveHeadsetStatus: string;

  @IsOptional()
  @IsString()
  haveHeadsetRejectReason: string;

  @IsOptional()
  @IsString()
  headsetUsb: string;

  @IsOptional()
  @IsString()
  headsetUsbStatus: string;

  @IsOptional()
  @IsString()
  headsetUsbRejectReason: string;

  @IsOptional()
  @IsString()
  headsetConnectivityType: string;

  @IsOptional()
  @IsString()
  headsetConnectivityTypeStatus: string;

  @IsOptional()
  @IsString()
  headsetConnectivityTypeRejectReason: string;

  @IsOptional()
  @IsString()
  headsetMuteBtn: string;

  @IsOptional()
  @IsString()
  headsetMuteBtnStatus: string;

  @IsOptional()
  @IsString()
  headsetMuteBtnRejectReason: string;

  @IsOptional()
  @IsString()
  headsetNoiseCancel: string;

  @IsOptional()
  @IsString()
  headsetNoiseCancelStatus: string;

  @IsOptional()
  @IsString()
  headsetNoiseCancelRejectReason: string;

  @IsOptional()
  @IsString()
  headsetSpecs: string;

  @IsOptional()
  @IsString()
  headsetSpecsStatus: string;

  @IsOptional()
  @IsString()
  headsetSpecsRejectReason: string;

  @IsOptional()
  @IsString()
  headsetUrl: string;

  @IsOptional()
  @IsString()
  headsetUrlStatus: string;

  @IsOptional()
  @IsString()
  headsetUrlRejectReason: string;

  @IsOptional()
  @IsString()
  primaryConnectionType: string;

  @IsOptional()
  @IsString()
  primaryConnectionTypeStatus: string;

  @IsOptional()
  @IsString()
  primaryConnectionTypeRejectReason: string;

  @IsOptional()
  @IsString()
  primaryIsp: string;

  @IsOptional()
  @IsString()
  primaryIspStatus: string;

  @IsOptional()
  @IsString()
  primaryIspRejectReason: string;

  @IsOptional()
  @IsString()
  primaryIspOther: string;

  @IsOptional()
  @IsString()
  primaryIspOtherStatus: string;

  @IsOptional()
  @IsString()
  primaryIspOtherRejectReason: string;

  @IsOptional()
  @IsString()
  primaryConnectedCount: string;

  @IsOptional()
  @IsString()
  primaryConnectedCountStatus: string;

  @IsOptional()
  @IsString()
  primaryConnectedCountRejectReason: string;

  @IsOptional()
  @IsString()
  primaryDownloadSpeed: string;

  @IsOptional()
  @IsString()
  primaryDownloadSpeedStatus: string;

  @IsOptional()
  @IsString()
  primaryDownloadSpeedRejectReason: string;

  @IsOptional()
  @IsString()
  primaryUploadSpeed: string;

  @IsOptional()
  @IsString()
  primaryUploadSpeedStatus: string;

  @IsOptional()
  @IsString()
  primaryUploadSpeedRejectReason: string;

  @IsOptional()
  @IsString()
  primaryPing: string;

  @IsOptional()
  @IsString()
  primaryPingStatus: string;

  @IsOptional()
  @IsString()
  primaryPingRejectReason: string;

  @IsOptional()
  @IsString()
  haveSecondaryConnection: string;

  @IsOptional()
  @IsString()
  haveSecondaryConnectionStatus: string;

  @IsOptional()
  @IsString()
  haveSecondaryConnectionRejectReason: string;

  @IsOptional()
  @IsString()
  secondaryConnectionType: string;

  @IsOptional()
  @IsString()
  secondaryConnectionTypeStatus: string;

  @IsOptional()
  @IsString()
  secondaryConnectionTypeRejectReason: string;

  @IsOptional()
  @IsString()
  secondaryIsp: string;

  @IsOptional()
  @IsString()
  secondaryIspStatus: string;

  @IsOptional()
  @IsString()
  secondaryIspRejectReason: string;

  @IsOptional()
  @IsString()
  secondaryIspOther: string;

  @IsOptional()
  @IsString()
  secondaryIspOtherStatus: string;

  @IsOptional()
  @IsString()
  secondaryIspOtherRejectReason: string;

  @IsOptional()
  @IsString()
  secondaryDownloadSpeed: string;

  @IsOptional()
  @IsString()
  secondaryDownloadSpeedStatus: string;

  @IsOptional()
  @IsString()
  secondaryDownloadSpeedRejectReason: string;

  @IsOptional()
  @IsString()
  secondaryUploadSpeed: string;

  @IsOptional()
  @IsString()
  secondaryUploadSpeedStatus: string;

  @IsOptional()
  @IsString()
  secondaryUploadSpeedRejectReason: string;

  @IsOptional()
  @IsString()
  secondaryPing: string;

  @IsOptional()
  @IsString()
  secondaryPingStatus: string;

  @IsOptional()
  @IsString()
  secondaryPingRejectReason: string;

  @IsOptional()
  @IsString()
  primarySpeedUrl: string;

  @IsOptional()
  @IsString()
  primarySpeedUrlStatus: string;

  @IsOptional()
  @IsString()
  primarySpeedUrlRejectReason: string;

  @IsOptional()
  @IsString()
  secondarySpeedUrl: string;

  @IsOptional()
  @IsString()
  secondarySpeedUrlStatus: string;

  @IsOptional()
  @IsString()
  secondarySpeedUrlRejectReason: string;

  @IsOptional()
  @IsString()
  responsibleItCheck: string;
}

export class AuditorSubmitDetailsDto extends HardwareDataDto {
  @IsNumber()
  nonTutorId: number;
}
