import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SubmitItDetailsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 55
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: 'candidate'
  })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'country',
    example: 'Sri Lanka'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Profile Status',
    example: 'active'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'have Pc',
    example: 'Yes'
  })
  havePc: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'have Pc Status',
    example: 'pending'
  })
  havePcStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'have Pc Reject Reason',
    example: ''
  })
  havePcRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Type',
    example: 'Desktop'
  })
  pcType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Type Status',
    example: 'pending'
  })
  pcTypeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Type Reject Reason',
    example: ''
  })
  pcTypeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Ownership',
    example: '3rd party PC'
  })
  pcOwnership: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Ownership Status',
    example: 'pending'
  })
  pcOwnershipStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Ownership Reject Reason',
    example: null
  })
  pcOwnershipRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Brand',
    example: 'Dell'
  })
  pcBrand: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Brand Status',
    example: 'pending'
  })
  pcBrandStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Brand Reject Reason',
    example: null
  })
  pcBrandRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Brand Other',
    example: ''
  })
  pcBrandOther: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Brand Other Status',
    example: ''
  })
  pcBrandOtherStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Brand Other Reject Reason',
    example: ''
  })
  pcBrandOtherRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Model',
    example: '3'
  })
  pcModel: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Model Status',
    example: 'pending'
  })
  pcModelStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Model Reject Reason',
    example: null
  })
  pcModelRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Bit Version',
    example: '32 bit'
  })
  pcBitVersion: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Bit Version Status',
    example: 'pending'
  })
  pcBitVersionStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'pc Bit Version Reject Reason',
    example: null
  })
  pcBitVersionRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'laptop Serial',
    example: ''
  })
  laptopSerial: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'laptop Serial Status',
    example: ''
  })
  laptopSerialStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'laptop Serial Reject Reason',
    example: ''
  })
  laptopSerialRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'laptop Battery Age',
    example: ''
  })
  laptopBatteryAge: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Laptop battery age status',
    example: ''
  })
  laptopBatteryAgeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Laptop battery age reject reason',
    example: ''
  })
  laptopBatteryAgeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Laptop battery runtime',
    example: ''
  })
  laptopBatteryRuntime: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Laptop battery runtime status',
    example: ''
  })
  laptopBatteryRuntimeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Laptop battery runtime reject reason',
    example: ''
  })
  laptopBatteryRuntimeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc os',
    example: 'Windows 10'
  })
  pcOs: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc os status',
    example: 'pending'
  })
  pcOsStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc os reject reason',
    example: null
  })
  pcOsRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc os other',
    example: ''
  })
  pcOsOther: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc os other status',
    example: ''
  })
  pcOsOtherStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc os other reject reason',
    example: ''
  })
  pcOsOtherRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc processor',
    example: 'I3 10th Generation'
  })
  pcProcessor: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc processor status',
    example: 'pending'
  })
  pcProcessorStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc processor reject reason',
    example: null
  })
  pcProcessorRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc processor other',
    example: ''
  })
  pcProcessorOther: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc processor other status',
    example: ''
  })
  pcProcessorOtherStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc processor other reject reason',
    example: ''
  })
  pcProcessorOtherRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc ram',
    example: '16gb'
  })
  pcRam: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc ram status',
    example: 'pending'
  })
  pcRamStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc ram reject reason',
    example: ''
  })
  pcRamRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd type',
    example: 'HDD'
  })
  hdType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd type status',
    example: 'pending'
  })
  hdTypeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd type reject reason',
    example: ''
  })
  hdTypeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd capacity',
    example: '2'
  })
  hdCapacity: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd capacity status',
    example: 'pending'
  })
  hdCapacityStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd capacity reject reason',
    example: ''
  })
  hdCapacityRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc browsers',
    example: 'Opera,Google Chrome'
  })
  pcBrowsers: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc browsers status',
    example: 'pending'
  })
  pcBrowsersStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc browsers reject reason',
    example: ''
  })
  pcBrowsersRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc antivirus',
    example: 'McAfee'
  })
  pcAntivirus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc antivirus status',
    example: 'pending'
  })
  pcAntivirusStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc antivirus reject reason',
    example: ''
  })
  pcAntivirusRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc antivirus other',
    example: ''
  })
  pcAntivirusOther: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc antivirus other status',
    example: ''
  })
  pcAntivirusOtherStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc antivirus other reject reason',
    example: ''
  })
  pcAntivirusOtherRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Last service date',
    example: '1 Year ago'
  })
  lastServiceDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Last service date status',
    example: 'pending'
  })
  lastServiceDateStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Last service date reject reason',
    example: ''
  })
  lastServiceDateRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc ip address',
    example: '33'
  })
  pcIPAddress: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc ip address status',
    example: 'pending'
  })
  pcIPAddressStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc ip address reject reason',
    example: ''
  })
  pcIPAddressRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Ram url',
    example: ''
  })
  ramUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Ram url status',
    example: ''
  })
  ramUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Ram url reject reason',
    example: ''
  })
  ramUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc url',
    example: ''
  })
  pcUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc url status',
    example: ''
  })
  pcUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pc url reject reason',
    example: ''
  })
  pcUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups',
    example: ''
  })
  desktopUps: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups status',
    example: 'pending'
  })
  desktopUpsStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups reject reason',
    example: ''
  })
  desktopUpsRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups url',
    example: ''
  })
  desktopUpsUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups url status',
    example: ''
  })
  desktopUpsUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups url reject reason',
    example: ''
  })
  desktopUpsUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups runtime',
    example: ''
  })
  desktopUpsRuntime: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups runtime status',
    example: 'pending'
  })
  desktopUpsRuntimeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Desktop ups runtime reject reason',
    example: ''
  })
  desktopUpsRuntimeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have headset',
    example: 'Yes'
  })
  haveHeadset: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have headset status',
    example: 'pending'
  })
  haveHeadsetStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have headset reject reason',
    example: ''
  })
  haveHeadsetRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset usb',
    example: 'Yes'
  })
  headsetUsb: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset usb status',
    example: 'pending'
  })
  headsetUsbStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset usb reject reason',
    example: ''
  })
  headsetUsbRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset connectivity type',
    example: 'USB A'
  })
  headsetConnectivityType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset connectivity type status',
    example: 'pending'
  })
  headsetConnectivityTypeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset connectivity type reject reason',
    example: ''
  })
  headsetConnectivityTypeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset mute btn',
    example: 'Yes'
  })
  headsetMuteBtn: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset mute btn status',
    example: 'pending'
  })
  headsetMuteBtnStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset mute btn reject reason',
    example: ''
  })
  headsetMuteBtnRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset noise cancel',
    example: 'Yes'
  })
  headsetNoiseCancel: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset noise cancel status',
    example: 'pending'
  })
  headsetNoiseCancelStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset noise cancel reject reason',
    example: ''
  })
  headsetNoiseCancelRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset specs',
    example: '55'
  })
  headsetSpecs: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset specs status',
    example: 'pending'
  })
  headsetSpecsStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset specs reject reason',
    example: ''
  })
  headsetSpecsRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset url',
    example: '/129856/it_requirements/1701769285082_____28aprilcheck.jpeg'
  })
  headsetUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset url status',
    example: 'pending'
  })
  headsetUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Headset url reject reason',
    example: ''
  })
  headsetUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary connection type',
    example: 'Wired - 4G Router'
  })
  primaryConnectionType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary connection type status',
    example: 'pending'
  })
  primaryConnectionTypeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary connection type reject reason',
    example: ''
  })
  primaryConnectionTypeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary isp',
    example: 'Airtel'
  })
  primaryIsp: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary isp status',
    example: 'pending'
  })
  primaryIspStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary isp reject reason',
    example: ''
  })
  primaryIspRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary isp other',
    example: ''
  })
  primaryIspOther: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary isp other status',
    example: ''
  })
  primaryIspOtherStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary isp other reject reason',
    example: ''
  })
  primaryIspOtherRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary connected count',
    example: ''
  })
  primaryConnectedCount: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary connected count status',
    example: ''
  })
  primaryConnectedCountStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary connected count reject reason',
    example: ''
  })
  primaryConnectedCountRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary download speed',
    example: '4mbps or above'
  })
  primaryDownloadSpeed: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary download speed status',
    example: 'approved'
  })
  primaryDownloadSpeedStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary download speed reject reason',
    example: ''
  })
  primaryDownloadSpeedRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary upload speed',
    example: '2mbps or above'
  })
  primaryUploadSpeed: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary upload speed status',
    example: 'pending'
  })
  primaryUploadSpeedStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary upload speed reject reason',
    example: ''
  })
  primaryUploadSpeedRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary ping',
    example: '140ms or above'
  })
  primaryPing: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary ping status',
    example: 'pending'
  })
  primaryPingStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary ping reject reason',
    example: ''
  })
  primaryPingRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have secondary connection',
    example: 'Yes'
  })
  haveSecondaryConnection: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have secondary connection status',
    example: 'pending'
  })
  haveSecondaryConnectionStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have secondary connection reject reason',
    example: ''
  })
  haveSecondaryConnectionRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary connection type',
    example: 'Wired - Fiber'
  })
  secondaryConnectionType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary connection type status',
    example: 'pending'
  })
  secondaryConnectionTypeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary connection type reject reason',
    example: ''
  })
  secondaryConnectionTypeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary isp',
    example: 'BSNL'
  })
  secondaryIsp: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary isp status',
    example: 'pending'
  })
  secondaryIspStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary isp reject reason',
    example: ''
  })
  secondaryIspRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary isp other',
    example: ''
  })
  secondaryIspOther: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary isp other status',
    example: ''
  })
  secondaryIspOtherStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary isp other reject reason',
    example: ''
  })
  secondaryIspOtherRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary download speed',
    example: '4mbps or above'
  })
  secondaryDownloadSpeed: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary download speed status',
    example: 'pending'
  })
  secondaryDownloadSpeedStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary download speed reject reason',
    example: ''
  })
  secondaryDownloadSpeedRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary upload speed',
    example: '2mbps or above'
  })
  secondaryUploadSpeed: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary upload speed status',
    example: 'pending'
  })
  secondaryUploadSpeedStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary upload speed reject reason',
    example: ''
  })
  secondaryUploadSpeedRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary ping',
    example: '80ms or below'
  })
  secondaryPing: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary ping status',
    example: 'pending'
  })
  secondaryPingStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary ping reject reason',
    example: ''
  })
  secondaryPingRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary speed url',
    example:
      '/129856/it_requirements/1701769285127_____28-framed-size-small.png'
  })
  primarySpeedUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary speed url status',
    example: 'pending'
  })
  primarySpeedUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Primary speed url reject reason',
    example: ''
  })
  primarySpeedUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary speed url',
    example: ''
  })
  secondarySpeedUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary speed url status',
    example: 'pending'
  })
  secondarySpeedUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Secondary speed url reject reason',
    example: ''
  })
  secondarySpeedUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Responsible it check',
    example: 'agree'
  })
  responsibleItCheck: string;
}

export class HardwareDetails200Response {
  @ApiProperty({
    example: {
      havePc: 'Yes',
      havePcStatus: 'pending',
      havePcRejectReason: '',
      pcType: 'Desktop',
      pcTypeStatus: 'pending',
      pcTypeRejectReason: '',
      pcOwnership: '3rd party PC',
      pcOwnershipStatus: 'pending',
      pcOwnershipRejectReason: null,
      pcBrand: 'Dell',
      pcBrandStatus: 'pending',
      pcBrandRejectReason: null,
      pcBrandOther: '',
      pcBrandOtherStatus: '',
      pcBrandOtherRejectReason: '',
      pcModel: '3',
      pcModelStatus: 'pending',
      pcModelRejectReason: null,
      pcBitVersion: '32 bit',
      pcBitVersionStatus: 'pending',
      pcBitVersionRejectReason: null,
      laptopSerial: '',
      laptopSerialStatus: '',
      laptopSerialRejectReason: '',
      laptopBatteryAge: '',
      laptopBatteryAgeStatus: '',
      laptopBatteryAgeRejectReason: '',
      laptopBatteryRuntime: '',
      laptopBatteryRuntimeStatus: '',
      laptopBatteryRuntimeRejectReason: '',
      pcOs: 'Windows 10',
      pcOsStatus: 'pending',
      pcOsRejectReason: null,
      pcOsOther: '',
      pcOsOtherStatus: '',
      pcOsOtherRejectReason: '',
      pcProcessor: 'I3 10th Generation',
      pcProcessorStatus: 'pending',
      pcProcessorRejectReason: null,
      pcProcessorOther: '',
      pcProcessorOtherStatus: '',
      pcProcessorOtherRejectReason: '',
      pcRam: '16gb',
      pcRamStatus: 'pending',
      pcRamRejectReason: null,
      hdType: 'HDD',
      hdTypeStatus: 'pending',
      hdTypeRejectReason: null,
      hdCapacity: '1',
      hdCapacityStatus: 'pending',
      hdCapacityRejectReason: null,
      pcBrowsers: 'Opera,Microsoft Edge',
      pcBrowsersStatus: 'pending',
      pcBrowsersRejectReason: null,
      pcAntivirus: 'Windows Defender',
      pcAntivirusStatus: 'pending',
      pcAntivirusRejectReason: null,
      pcAntivirusOther: '',
      pcAntivirusOtherStatus: '',
      pcAntivirusOtherRejectReason: '',
      lastServiceDate: 'More than 2 years ago',
      lastServiceDateStatus: 'pending',
      lastServiceDateRejectReason: null,
      pcIPAddress: '3333',
      pcIPAddressStatus: 'pending',
      pcIPAddressRejectReason: null,
      ramUrl: '/8/it_requirements/1701770360842_____28-framed-size-small.png',
      ramUrlStatus: 'pending',
      ramUrlRejectReason: null,
      pcUrl: '',
      pcUrlStatus: null,
      pcUrlRejectReason: null,
      desktopUps: 'Yes',
      desktopUpsStatus: 'pending',
      desktopUpsRejectReason: null,
      desktopUpsUrl: null,
      desktopUpsUrlStatus: null,
      desktopUpsUrlRejectReason: null,
      desktopUpsRuntime: '1 Hour',
      desktopUpsRuntimeStatus: 'pending',
      desktopUpsRuntimeRejectReason: null,
      haveHeadset: 'Yes',
      haveHeadsetStatus: 'pending',
      haveHeadsetRejectReason: null,
      headsetUsb: 'Yes',
      headsetUsbStatus: 'pending',
      headsetUsbRejectReason: '',
      headsetConnectivityType: 'USB C',
      headsetConnectivityTypeStatus: 'pending',
      headsetConnectivityTypeRejectReason: '',
      headsetMuteBtn: 'No',
      headsetMuteBtnStatus: 'pending',
      headsetMuteBtnRejectReason: '',
      headsetNoiseCancel: 'Yes',
      headsetNoiseCancelStatus: 'pending',
      headsetNoiseCancelRejectReason: '',
      headsetSpecs: '34',
      headsetSpecsStatus: 'pending',
      headsetSpecsRejectReason: '',
      headsetUrl: '',
      headsetUrlStatus: '',
      headsetUrlRejectReason: '',
      primaryConnectionType: 'Wired - Fiber',
      primaryConnectionTypeStatus: 'pending',
      primaryConnectionTypeRejectReason: null,
      primaryIsp: 'SLT Mobitel',
      primaryIspStatus: 'pending',
      primaryIspRejectReason: null,
      primaryIspOther: '',
      primaryIspOtherStatus: '',
      primaryIspOtherRejectReason: '',
      primaryConnectedCount: '',
      primaryConnectedCountStatus: null,
      primaryConnectedCountRejectReason: null,
      primaryDownloadSpeed: '4mbps or below',
      primaryDownloadSpeedStatus: 'pending',
      primaryDownloadSpeedRejectReason: null,
      primaryUploadSpeed: '2mbps or above',
      primaryUploadSpeedStatus: 'pending',
      primaryUploadSpeedRejectReason: null,
      primaryPing: '140ms or above',
      primaryPingStatus: 'pending',
      primaryPingRejectReason: null,
      haveSecondaryConnection: 'Yes',
      haveSecondaryConnectionStatus: 'pending',
      haveSecondaryConnectionRejectReason: null,
      secondaryConnectionType: 'Wired - Fiber',
      secondaryConnectionTypeStatus: 'pending',
      secondaryConnectionTypeRejectReason: '',
      secondaryIsp: 'Airtel',
      secondaryIspStatus: 'pending',
      secondaryIspRejectReason: '',
      secondaryIspOther: '',
      secondaryIspOtherStatus: '',
      secondaryIspOtherRejectReason: '',
      secondaryDownloadSpeed: '4mbps or below',
      secondaryDownloadSpeedStatus: 'pending',
      secondaryDownloadSpeedRejectReason: '',
      secondaryUploadSpeed: '2mbps or above',
      secondaryUploadSpeedStatus: 'pending',
      secondaryUploadSpeedRejectReason: '',
      secondaryPing: '80ms or below',
      secondaryPingStatus: 'pending',
      secondaryPingRejectReason: '',
      primarySpeedUrl: null,
      primarySpeedUrlStatus: null,
      primarySpeedUrlRejectReason: null,
      secondarySpeedUrl: '',
      secondarySpeedUrlStatus: '',
      secondarySpeedUrlRejectReason: '',
      statusId: 79,
      responsibleItCheck: ''
    }
  })
  data: object;
}

export class AuditorItDetails200Response {
  @ApiProperty({
    example: {
      havePc: 'Yes',
      havePcStatus: 'approved',
      havePcRejectReason: '',
      pcType: 'Laptop',
      pcTypeStatus: 'approved',
      pcTypeRejectReason: '',
      pcOwnership: 'Personal PC',
      pcOwnershipStatus: 'approved',
      pcOwnershipRejectReason: '',
      pcBrand: 'Dell',
      pcBrandStatus: 'approved',
      pcBrandRejectReason: '',
      pcBrandOther: '',
      pcBrandOtherStatus: '',
      pcBrandOtherRejectReason: '',
      pcModel: 'ccc',
      pcModelStatus: 'approved',
      pcModelRejectReason: '',
      pcBitVersion: '32 bit',
      pcBitVersionStatus: 'approved',
      pcBitVersionRejectReason: '',
      laptopSerial: '44',
      laptopSerialStatus: 'approved',
      laptopSerialRejectReason: '',
      laptopBatteryAge: '2 year old',
      laptopBatteryAgeStatus: 'approved',
      laptopBatteryAgeRejectReason: '',
      laptopBatteryRuntime: '2 hours',
      laptopBatteryRuntimeStatus: 'approved',
      laptopBatteryRuntimeRejectReason: '',
      pcOs: 'Mac OS Catalina',
      pcOsStatus: 'approved',
      pcOsRejectReason: '',
      pcOsOther: '',
      pcOsOtherStatus: '',
      pcOsOtherRejectReason: '',
      pcProcessor: 'I3 8th Generation',
      pcProcessorStatus: 'approved',
      pcProcessorRejectReason: '',
      pcProcessorOther: '',
      pcProcessorOtherStatus: '',
      pcProcessorOtherRejectReason: '',
      pcRam: '16gb',
      pcRamStatus: 'approved',
      pcRamRejectReason: '',
      hdType: 'SSD',
      hdTypeStatus: 'approved',
      hdTypeRejectReason: '',
      hdCapacity: '2',
      hdCapacityStatus: 'approved',
      hdCapacityRejectReason: '',
      pcBrowsers: 'Opera,Google Chrome',
      pcBrowsersStatus: 'approved',
      pcBrowsersRejectReason: '',
      pcAntivirus: 'McAfee',
      pcAntivirusStatus: 'approved',
      pcAntivirusRejectReason: '',
      pcAntivirusOther: '',
      pcAntivirusOtherStatus: '',
      pcAntivirusOtherRejectReason: '',
      lastServiceDate: '1 Year ago',
      lastServiceDateStatus: 'approved',
      lastServiceDateRejectReason: '',
      pcIPAddress: '33',
      pcIPAddressStatus: 'approved',
      pcIPAddressRejectReason: '',
      ramUrl: '',
      ramUrlStatus: 'approved',
      ramUrlRejectReason: '',
      pcUrl: '',
      pcUrlStatus: 'approved',
      pcUrlRejectReason: '',
      desktopUps: '',
      desktopUpsStatus: '',
      desktopUpsRejectReason: '',
      desktopUpsUrl: '',
      desktopUpsUrlStatus: '',
      desktopUpsUrlRejectReason: '',
      desktopUpsRuntime: '',
      desktopUpsRuntimeStatus: '',
      desktopUpsRuntimeRejectReason: '',
      haveHeadset: 'Yes',
      haveHeadsetStatus: 'approved',
      haveHeadsetRejectReason: '',
      headsetUsb: 'Yes',
      headsetUsbStatus: 'approved',
      headsetUsbRejectReason: '',
      headsetConnectivityType: 'USB A',
      headsetConnectivityTypeStatus: 'approved',
      headsetConnectivityTypeRejectReason: '',
      headsetMuteBtn: 'Yes',
      headsetMuteBtnStatus: 'approved',
      headsetMuteBtnRejectReason: '',
      headsetNoiseCancel: 'Yes',
      headsetNoiseCancelStatus: 'approved',
      headsetNoiseCancelRejectReason: '',
      headsetSpecs: '55',
      headsetSpecsStatus: 'approved',
      headsetSpecsRejectReason: '',
      headsetUrl: '/129856/it_requirements/1701769285082_____28aprilcheck.jpeg',
      headsetUrlStatus: 'approved',
      headsetUrlRejectReason: '',
      primaryConnectionType: 'Wired - 4G Router',
      primaryConnectionTypeStatus: 'pending',
      primaryConnectionTypeRejectReason: '',
      primaryIsp: 'Airtel',
      primaryIspStatus: 'pending',
      primaryIspRejectReason: '',
      primaryIspOther: '',
      primaryIspOtherStatus: '',
      primaryIspOtherRejectReason: '',
      primaryConnectedCount: '',
      primaryConnectedCountStatus: '',
      primaryConnectedCountRejectReason: '',
      primaryDownloadSpeed: '4mbps or above',
      primaryDownloadSpeedStatus: 'approved',
      primaryDownloadSpeedRejectReason: '',
      primaryUploadSpeed: '2mbps or above',
      primaryUploadSpeedStatus: 'approved',
      primaryUploadSpeedRejectReason: '',
      primaryPing: '140ms or above',
      primaryPingStatus: 'approved',
      primaryPingRejectReason: '',
      haveSecondaryConnection: 'Yes',
      haveSecondaryConnectionStatus: 'approved',
      haveSecondaryConnectionRejectReason: '',
      secondaryConnectionType: 'Wired - Fiber',
      secondaryConnectionTypeStatus: 'approved',
      secondaryConnectionTypeRejectReason: '',
      secondaryIsp: 'BSNL',
      secondaryIspStatus: 'approved',
      secondaryIspRejectReason: '',
      secondaryIspOther: '',
      secondaryIspOtherStatus: '',
      secondaryIspOtherRejectReason: '',
      secondaryDownloadSpeed: '4mbps or above',
      secondaryDownloadSpeedStatus: 'approved',
      secondaryDownloadSpeedRejectReason: '',
      secondaryUploadSpeed: '2mbps or above',
      secondaryUploadSpeedStatus: 'approved',
      secondaryUploadSpeedRejectReason: '',
      secondaryPing: '80ms or below',
      secondaryPingStatus: 'approved',
      secondaryPingRejectReason: '',
      primarySpeedUrl:
        '/129856/it_requirements/1701769285127_____28-framed-size-small.png',
      primarySpeedUrlStatus: 'approved',
      primarySpeedUrlRejectReason: '',
      secondarySpeedUrl: '',
      secondarySpeedUrlStatus: 'approved',
      secondarySpeedUrlRejectReason: '',
      statusId: 79,
      responsibleItCheck: 'agree'
    }
  })
  details: object;

  @ApiProperty({
    example: {
      havePc: 'Yes',
      pcType: 'Laptop',
      pcOwnership: 'Personal PC',
      pcBrand: 'Dell',
      pcBrandOther: null,
      pcModel: 'ccc',
      pcBitVersion: '32 bit',
      laptopSerial: '44',
      laptopBatteryAge: '2 year old',
      laptopBatteryRuntime: '2 hours',
      pcOs: 'Mac OS Catalina',
      pcOsOther: null,
      pcProcessor: 'I3 8th Generation',
      pcProcessorOther: null,
      pcRam: '16gb',
      hdType: 'SSD',
      hdCapacity: '2',
      pcBrowsers: 'Opera,Google Chrome',
      pcAntivirus: 'McAfee',
      pcAntivirusOther: null,
      lastServiceDate: '1 Year ago',
      pcIPAddress: '33',
      ramUrl: '',
      pcUrl: '',
      desktopUps: null,
      desktopUpsUrl: null,
      desktopUpsRuntime: null,
      haveHeadset: 'Yes',
      headsetUsb: 'Yes',
      headsetConnectivityType: 'USB A',
      headsetMuteBtn: 'Yes',
      headsetNoiseCancel: 'Yes',
      headsetSpecs: '55',
      headsetUrl: '/129856/it_requirements/1701769285082_____28aprilcheck.jpeg',
      primaryConnectionType: null,
      primaryIsp: null,
      primaryIspOther: null,
      primaryConnectedCount: null,
      primaryDownloadSpeed: '4mbps or above',
      primaryUploadSpeed: '2mbps or above',
      primaryPing: '140ms or above',
      haveSecondaryConnection: 'Yes',
      secondaryConnectionType: 'Wired - Fiber',
      secondaryIsp: 'BSNL',
      secondaryIspOther: null,
      secondaryDownloadSpeed: '4mbps or above',
      secondaryUploadSpeed: '2mbps or above',
      secondaryPing: '80ms or below',
      primarySpeedUrl:
        '/129856/it_requirements/1701769285127_____28-framed-size-small.png',
      secondarySpeedUrl: '',
      statusId: 79,
      responsibleItCheck: 'agree'
    }
  })
  approvedDetails: object;
}
export class AuditorItSubmitDetailsDto extends SubmitItDetailsDto {
  @IsNumber()
  candidateId: number;
}

export class FetchHardwareDetailsDto {
  @ApiProperty({
    example: {
      id: 204,
      tspId: 129856,
      havePc: 'Yes',
      havePcStatus: 'pending',
      havePcRejectReason: '',
      pcType: 'Laptop',
      pcTypeStatus: 'pending',
      pcTypeRejectReason: '',
      pcOwnership: 'Personal PC',
      pcOwnershipStatus: 'pending',
      pcOwnershipRejectReason: '',
      pcBrand: 'Dell',
      pcBrandStatus: 'pending',
      pcBrandRejectReason: '',
      pcBrandOther: '',
      pcBrandOtherStatus: '',
      pcBrandOtherRejectReason: '',
      pcModel: 'ccc',
      pcModelStatus: 'pending',
      pcModelRejectReason: '',
      pcBitVersion: '64 bit',
      pcBitVersionStatus: 'pending',
      pcBitVersionRejectReason: '',
      laptopSerial: '44',
      laptopSerialStatus: 'pending',
      laptopSerialRejectReason: '',
      laptopBatteryAge: 'Less than 1 year',
      laptopBatteryAgeStatus: 'pending',
      laptopBatteryAgeRejectReason: '',
      laptopBatteryRuntime: '2 hours',
      laptopBatteryRuntimeStatus: 'pending',
      laptopBatteryRuntimeRejectReason: '',
      pcOs: 'Mac OS Catalina',
      pcOsStatus: 'pending',
      pcOsRejectReason: '',
      pcOsOther: '',
      pcOsOtherStatus: '',
      pcOsOtherRejectReason: '',
      pcProcessor: 'I3 8th Generation',
      pcProcessorStatus: 'pending',
      pcProcessorRejectReason: '',
      pcProcessorOther: '',
      pcProcessorOtherStatus: '',
      pcProcessorOtherRejectReason: '',
      pcRam: '16gb',
      pcRamStatus: 'pending',
      pcRamRejectReason: '',
      hdType: 'HDD',
      hdTypeStatus: 'pending',
      hdTypeRejectReason: '',
      hdCapacity: '2',
      hdCapacityStatus: 'pending',
      hdCapacityRejectReason: '',
      pcBrowsers: 'Opera,Google Chrome',
      pcBrowsersStatus: 'pending',
      pcBrowsersRejectReason: '',
      pcAntivirus: 'McAfee',
      pcAntivirusStatus: 'pending',
      pcAntivirusRejectReason: '',
      pcAntivirusOther: '',
      pcAntivirusOtherStatus: '',
      pcAntivirusOtherRejectReason: '',
      lastServiceDate: '1 Year ago',
      lastServiceDateStatus: 'pending',
      lastServiceDateRejectReason: '',
      pcIPAddress: '33',
      pcIPAddressStatus: 'pending',
      pcIPAddressRejectReason: '',
      ramUrl: '',
      ramUrlStatus: '',
      ramUrlRejectReason: '',
      pcUrl: '',
      pcUrlStatus: '',
      pcUrlRejectReason: '',
      desktopUps: '',
      desktopUpsStatus: 'pending',
      desktopUpsRejectReason: '',
      desktopUpsUrl: '',
      desktopUpsUrlStatus: '',
      desktopUpsUrlRejectReason: '',
      desktopUpsRuntime: '',
      desktopUpsRuntimeStatus: 'pending',
      desktopUpsRuntimeRejectReason: '',
      haveHeadset: 'Yes',
      haveHeadsetStatus: 'pending',
      haveHeadsetRejectReason: '',
      headsetUsb: 'Yes',
      headsetUsbStatus: 'pending',
      headsetUsbRejectReason: '',
      headsetConnectivityType: 'USB A',
      headsetConnectivityTypeStatus: 'pending',
      headsetConnectivityTypeRejectReason: '',
      headsetMuteBtn: 'Yes',
      headsetMuteBtnStatus: 'pending',
      headsetMuteBtnRejectReason: '',
      headsetNoiseCancel: 'Yes',
      headsetNoiseCancelStatus: 'pending',
      headsetNoiseCancelRejectReason: '',
      headsetSpecs: '55',
      headsetSpecsStatus: 'pending',
      headsetSpecsRejectReason: '',
      headsetUrl: '/129856/it_requirements/1701769285082_____28aprilcheck.jpeg',
      headsetUrlStatus: 'pending',
      headsetUrlRejectReason: '',
      primaryConnectionType: 'Wired - 4G Router',
      primaryConnectionTypeStatus: 'pending',
      primaryConnectionTypeRejectReason: '',
      primaryIsp: 'Airtel',
      primaryIspStatus: 'pending',
      primaryIspRejectReason: '',
      primaryIspOther: '',
      primaryIspOtherStatus: '',
      primaryIspOtherRejectReason: '',
      primaryConnectedCount: '',
      primaryConnectedCountStatus: '',
      primaryConnectedCountRejectReason: '',
      primaryDownloadSpeed: '4mbps or above',
      primaryDownloadSpeedStatus: 'approved',
      primaryDownloadSpeedRejectReason: '',
      primaryUploadSpeed: '2mbps or above',
      primaryUploadSpeedStatus: 'pending',
      primaryUploadSpeedRejectReason: '',
      primaryPing: '140ms or above',
      primaryPingStatus: 'pending',
      primaryPingRejectReason: '',
      haveSecondaryConnection: 'Yes',
      haveSecondaryConnectionStatus: 'pending',
      haveSecondaryConnectionRejectReason: '',
      secondaryConnectionType: 'Wired - Fiber',
      secondaryConnectionTypeStatus: 'pending',
      secondaryConnectionTypeRejectReason: '',
      secondaryIsp: 'BSNL',
      secondaryIspStatus: 'pending',
      secondaryIspRejectReason: '',
      secondaryIspOther: '',
      secondaryIspOtherStatus: '',
      secondaryIspOtherRejectReason: '',
      secondaryDownloadSpeed: '4mbps or above',
      secondaryDownloadSpeedStatus: 'pending',
      secondaryDownloadSpeedRejectReason: '',
      secondaryUploadSpeed: '2mbps or above',
      secondaryUploadSpeedStatus: 'pending',
      secondaryUploadSpeedRejectReason: '',
      secondaryPing: '80ms or below',
      secondaryPingStatus: 'pending',
      secondaryPingRejectReason: '',
      primarySpeedUrl:
        '/129856/it_requirements/1701769285127_____28-framed-size-small.png',
      primarySpeedUrlStatus: 'pending',
      primarySpeedUrlRejectReason: '',
      secondarySpeedUrl: '',
      secondarySpeedUrlStatus: '',
      secondarySpeedUrlRejectReason: '',
      statusId: 79,
      responsibleItCheck: 'agree',
      updatedBy: 129856,
      updatedAt: '2023-12-05T09:43:00.000Z',
      auditedBy: null,
      auditedAt: null
    }
  })
  details: object;

  @ApiProperty({
    example: {
      havePc: 'Yes',
      pcType: 'Laptop',
      pcOwnership: 'Personal PC',
      pcBrand: 'Dell',
      pcBrandOther: null,
      pcModel: 'ccc',
      pcBitVersion: '32 bit',
      laptopSerial: '44',
      laptopBatteryAge: '2 year old',
      laptopBatteryRuntime: '2 hours',
      pcOs: 'Mac OS Catalina',
      pcOsOther: null,
      pcProcessor: 'I3 8th Generation',
      pcProcessorOther: null,
      pcRam: '16gb',
      hdType: 'SSD',
      hdCapacity: '2',
      pcBrowsers: 'Opera,Google Chrome',
      pcAntivirus: 'McAfee',
      pcAntivirusOther: null,
      lastServiceDate: '1 Year ago',
      pcIPAddress: '33',
      ramUrl: '',
      pcUrl: '',
      desktopUps: null,
      desktopUpsUrl: null,
      desktopUpsRuntime: null,
      haveHeadset: 'Yes',
      headsetUsb: 'Yes',
      headsetConnectivityType: 'USB A',
      headsetMuteBtn: 'Yes',
      headsetNoiseCancel: 'Yes',
      headsetSpecs: '55',
      headsetUrl: '/129856/it_requirements/1701769285082_____28aprilcheck.jpeg',
      primaryConnectionType: null,
      primaryIsp: null,
      primaryIspOther: null,
      primaryConnectedCount: null,
      primaryDownloadSpeed: '4mbps or above',
      primaryUploadSpeed: '2mbps or above',
      primaryPing: '140ms or above',
      haveSecondaryConnection: 'Yes',
      secondaryConnectionType: 'Wired - Fiber',
      secondaryIsp: 'BSNL',
      secondaryIspOther: null,
      secondaryDownloadSpeed: '4mbps or above',
      secondaryUploadSpeed: '2mbps or above',
      secondaryPing: '80ms or below',
      primarySpeedUrl:
        '/129856/it_requirements/1701769285127_____28-framed-size-small.png',
      secondarySpeedUrl: '',
      statusId: 79,
      responsibleItCheck: 'agree'
    }
  })
  approvedDetails: object;
}

class HrisMetaDataValueDto {
  @ApiProperty()
  valueName: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  status: number;
}

class SubCategoryDto {
  @ApiProperty()
  subCategory: string;

  @ApiProperty({ type: [HrisMetaDataValueDto] })
  HrisMetaDataValue: HrisMetaDataValueDto[];
}

export class AuditorDetailsData200Dto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: [SubCategoryDto],
    example: [
      {
        subCategory: 'havePc',
        HrisMetaDataValue: [
          {
            valueName: 'Yes',
            value: 'Yes',
            status: 1
          },
          {
            valueName: 'No',
            value: 'No',
            status: 0
          }
        ]
      },
      {
        subCategory: 'pcType',
        HrisMetaDataValue: [
          {
            valueName: 'Desktop',
            value: 'Desktop',
            status: 1
          },
          {
            valueName: 'Laptop',
            value: 'Laptop',
            status: 1
          }
        ]
      },
      {
        subCategory: 'pcBrand',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'pcModel',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'pcBitVersion',
        HrisMetaDataValue: [
          {
            valueName: '32 bit',
            value: '32 bit',
            status: 1
          },
          {
            valueName: '64 bit',
            value: '64 bit',
            status: 1
          }
        ]
      },
      {
        subCategory: 'laptopSerial',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'pcOs',
        HrisMetaDataValue: [
          {
            valueName: 'Windows xp',
            value: 'Windows xp',
            status: 0
          },
          {
            valueName: 'Windows 7',
            value: 'Windows 7',
            status: 0
          },
          {
            valueName: 'Windows xp',
            value: 'Windows xp',
            status: 0
          },
          {
            valueName: 'Windows 7',
            value: 'Windows 7',
            status: 0
          },
          {
            valueName: 'Windows 8',
            value: 'Windows 8',
            status: 1
          },
          {
            valueName: 'Windows 10',
            value: 'Windows 10',
            status: 1
          },
          {
            valueName: 'Windows 11',
            value: 'Windows 11',
            status: 1
          },
          {
            valueName: 'Mac OS High Serra',
            value: 'Mac OS High Serra',
            status: 1
          },
          {
            valueName: 'Mac OS Mojave',
            value: 'Mac OS Mojave',
            status: 1
          },
          {
            valueName: 'Mac OS Catalina',
            value: 'Mac OS Catalina',
            status: 1
          },
          {
            valueName: 'Mac OS Big Sur',
            value: 'Mac OS Big Sur',
            status: 1
          },
          {
            valueName: 'Mac OS Monterey',
            value: 'Mac OS Monterey',
            status: 1
          },
          {
            valueName: 'Mac OS Ventura',
            value: 'Mac OS Ventura',
            status: 1
          },
          {
            valueName: 'Ubuntu Trusty Tahr',
            value: 'Ubuntu Trusty Tahr',
            status: 1
          },
          {
            valueName: 'Ubuntu Bionic Beaver',
            value: 'Ubuntu Bionic Beaver',
            status: 1
          },
          {
            valueName: 'Ubuntu Focal Fossa',
            value: 'Ubuntu Focal Fossa',
            status: 1
          },
          {
            valueName: 'Ubuntu Jammy Jellyfish',
            value: 'Ubuntu Jammy Jellyfish',
            status: 1
          },
          {
            valueName: 'Ubuntu Kinetic Kudu',
            value: 'Ubuntu Kinetic Kudu',
            status: 1
          }
        ]
      },
      {
        subCategory: 'pcProcessor',
        HrisMetaDataValue: [
          {
            valueName: 'I3 5th Generation and below',
            value: 'I3 5th Generation and below',
            status: 0
          },
          {
            valueName: 'I3 6th Generation',
            value: 'I3 6th Generation',
            status: 1
          },
          {
            valueName: 'I3 7th Generation',
            value: 'I3 7th Generation',
            status: 1
          },
          {
            valueName: 'I3 8th Generation',
            value: 'I3 8th Generation',
            status: 1
          },
          {
            valueName: 'I3 9th Generation',
            value: 'I3 9th Generation',
            status: 1
          },
          {
            valueName: 'I3 10th Generation',
            value: 'I3 10th Generation',
            status: 1
          },
          {
            valueName: 'I3 11th Generation',
            value: 'I3 11th Generation',
            status: 1
          },
          {
            valueName: 'I3 12th Generation',
            value: 'I3 12th Generation',
            status: 1
          },
          {
            valueName: 'I3 13th Generation',
            value: 'I3 13th Generation',
            status: 1
          },
          {
            valueName: 'I5 5th Generation and below',
            value: 'I5 5th Generation and below',
            status: 1
          },
          {
            valueName: 'I5 6th Generation',
            value: 'I5 6th Generation',
            status: 1
          },
          {
            valueName: 'I5 7th Generation',
            value: 'I5 7th Generation',
            status: 1
          },
          {
            valueName: 'I5 8th Generation',
            value: 'I5 8th Generation',
            status: 1
          },
          {
            valueName: 'I5 9th Generation',
            value: 'I5 9th Generation',
            status: 1
          },
          {
            valueName: 'I5 10th Generation',
            value: 'I5 10th Generation',
            status: 1
          },
          {
            valueName: 'I5 11th Generation',
            value: 'I5 11th Generation',
            status: 1
          },
          {
            valueName: 'I5 12th Generation',
            value: 'I5 12th Generation',
            status: 1
          },
          {
            valueName: 'I5 13th Generation',
            value: 'I5 13th Generation',
            status: 1
          },
          {
            valueName: 'I7 5th Generation and below',
            value: 'I7 5th Generation and below',
            status: 1
          },
          {
            valueName: 'I7 6th Generation',
            value: 'I7 6th Generation',
            status: 1
          },
          {
            valueName: 'I7 7th Generation',
            value: 'I7 7th Generation',
            status: 1
          },
          {
            valueName: 'I7 8th Generation',
            value: 'I7 8th Generation',
            status: 1
          },
          {
            valueName: 'I7 9th Generation',
            value: 'I7 9th Generation',
            status: 1
          },
          {
            valueName: 'I7 10th Generation',
            value: 'I7 10th Generation',
            status: 1
          },
          {
            valueName: 'I7 11th Generation',
            value: 'I7 11th Generation',
            status: 1
          },
          {
            valueName: 'I7 12th Generation',
            value: 'I7 12th Generation',
            status: 1
          },
          {
            valueName: 'I7 13th Generation',
            value: 'I7 13th Generation',
            status: 1
          },
          {
            valueName: 'M1 Chip',
            value: 'M1 Chip',
            status: 1
          },
          {
            valueName: 'M2 Chip',
            value: 'M2 Chip',
            status: 1
          },
          {
            valueName: 'M3 Chip',
            value: 'M3 Chip',
            status: 1
          }
        ]
      },
      {
        subCategory: 'pcRam',
        HrisMetaDataValue: [
          {
            valueName: '4gb',
            value: '4gb',
            status: 0
          },
          {
            valueName: '8gb',
            value: '8gb',
            status: 1
          },
          {
            valueName: '12gb',
            value: '12gb',
            status: 1
          },
          {
            valueName: '16gb',
            value: '16gb',
            status: 1
          },
          {
            valueName: '32gb',
            value: '32gb',
            status: 1
          },
          {
            valueName: '64gb',
            value: '64gb',
            status: 1
          },
          {
            valueName: '128gb',
            value: '128gb',
            status: 1
          }
        ]
      },
      {
        subCategory: 'pcBrowsers',
        HrisMetaDataValue: [
          {
            valueName: 'Google Chrome',
            value: 'Google Chrome',
            status: 1
          },
          {
            valueName: 'Mozilla Firefox',
            value: 'Mozilla Firefox',
            status: 1
          },
          {
            valueName: 'Opera',
            value: 'Opera',
            status: 1
          },
          {
            valueName: 'Microsoft Edge',
            value: 'Microsoft Edge',
            status: 1
          }
        ]
      },
      {
        subCategory: 'desktopUps',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'desktopUpsRuntime',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'haveHeadset',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'headsetUsb',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'headsetConnectivityType',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'headsetMuteBtn',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'headsetNoiseCancel',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'headsetSpecs',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'headsetUrl',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'primaryConnectionType',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'primaryIsp',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'primaryIspOther',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'primaryDownloadSpeed',
        HrisMetaDataValue: [
          {
            valueName: '4mbps or above',
            value: '4mbps or above',
            status: 1
          },
          {
            valueName: '4mbps or below',
            value: '4mbps or below',
            status: 0
          }
        ]
      },
      {
        subCategory: 'primaryUploadSpeed',
        HrisMetaDataValue: [
          {
            valueName: '2mbps or above',
            value: '2mbps or above',
            status: 1
          },
          {
            valueName: '2mbps or below',
            value: '2mbps or below',
            status: 0
          }
        ]
      },
      {
        subCategory: 'primaryPing',
        HrisMetaDataValue: [
          {
            valueName: '80ms or below',
            value: '80ms or below',
            status: 1
          },
          {
            valueName: '140ms or above',
            value: '140ms or above',
            status: 0
          }
        ]
      },
      {
        subCategory: 'haveSecondaryConnection',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'secondaryConnectionType',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'secondaryIsp',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'secondaryDownloadSpeed',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'secondaryUploadSpeed',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'secondaryPing',
        HrisMetaDataValue: []
      },
      {
        subCategory: 'laptopBatteryRuntime',
        HrisMetaDataValue: [
          {
            valueName: '1 hour or less',
            value: '1 hour or less',
            status: 0
          },
          {
            valueName: '2 hours',
            value: '2 hours',
            status: 1
          },
          {
            valueName: '3 hours',
            value: '3 hours',
            status: 1
          },
          {
            valueName: '4 hours',
            value: '4 hours',
            status: 1
          },
          {
            valueName: '5 hours',
            value: '5 hours',
            status: 1
          },
          {
            valueName: '6 hours',
            value: '6 hours',
            status: 1
          },
          {
            valueName: '7 hours',
            value: '7 hours',
            status: 1
          },
          {
            valueName: '8 hours',
            value: '8 hours',
            status: 1
          }
        ]
      },
      {
        subCategory: 'Status',
        HrisMetaDataValue: [
          {
            valueName: 'Candidate In Progress',
            value: 'In Progress',
            status: 1
          },
          {
            valueName: 'Candidate Submit',
            value: 'Submit',
            status: 1
          },
          {
            valueName: 'Audit Pass',
            value: 'Audit Pass',
            status: 1
          },
          {
            valueName: 'Audit Fail',
            value: 'Audit Fail',
            status: 1
          }
        ]
      }
    ]
  })
  data: SubCategoryDto[];
}
