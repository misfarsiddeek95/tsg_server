import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubmitReferencesDetailsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 46
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Type',
    example: 'candidate'
  })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Country',
    example: 'Sri Lanka'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Profile status',
    example: 'active'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee title1',
    example: 'Mrs'
  })
  refereeTitle1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee first name1',
    example: 'Anula'
  })
  refereeFirstName1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee last name1',
    example: 'Perera'
  })
  refereeLastName1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee relationship1',
    example: 'Teacher'
  })
  refereeRelationship1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee email1',
    example: 'anula@gmail.com'
  })
  refereeEmail1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee telephone number1',
    example: '+94 77 755 5333'
  })
  refereeTelephoneNumber1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee confirmation1',
    example: 'agree'
  })
  refereeConfirmation1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee title2',
    example: 'Ms'
  })
  refereeTitle2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee first name2',
    example: 'Kasuni'
  })
  refereeFirstName2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee last name2',
    example: 'Gamagedara'
  })
  refereeLastName2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee relationship2',
    example: 'Friend'
  })
  refereeRelationship2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee email2',
    example: 'kasuni@gmail.com'
  })
  refereeEmail2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee telephone number2',
    example: '+94 77 777 7753'
  })
  refereeTelephoneNumber2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee confirmation2',
    example: 'agree'
  })
  refereeConfirmation2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Acknowledgement1',
    example: 'agree'
  })
  acknowledgement1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Acknowledgement2',
    example: 'agree'
  })
  acknowledgement2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee1 status',
    example: 'approved'
  })
  referee1Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee1 reject reason',
    example: ''
  })
  referee1RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee2 status',
    example: 'approved'
  })
  referee2Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Referee2 reject reason',
    example: ''
  })
  referee2RejectReason: string;
}

export class SubmitRightToWorkDetailsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 4
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Type',
    example: 'candidate'
  })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Country',
    example: 'candidate'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Profile status',
    example: 'candidate'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Contract url',
    example: '/954443235V-contract.pdf'
  })
  contractUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Contract url status',
    example: ''
  })
  contractUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Contract url reject reason',
    example: ''
  })
  contractUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Gs issued date',
    example: '2021-05-13T00:00:00.000Z'
  })
  gsIssuedDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Gs issued date status',
    example: 'pending'
  })
  gsIssuedDateStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Gs issued date reject reason',
    example: ''
  })
  gsIssuedDateRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Gs url',
    example: '/4/right_to_work/1686046010214_____3.jpeg'
  })
  gsUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Gs url status',
    example: 'approved'
  })
  gsUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Gs url reject reason',
    example: ''
  })
  gsUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc issued date',
    example: '2022-08-24T00:00:00.000Z'
  })
  pccIssuedDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc issued date status',
    example: 'pending'
  })
  pccIssuedDateStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc issued date reject reason',
    example: ''
  })
  pccIssuedDateRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc reference no',
    example: '22'
  })
  pccReferenceNo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc reference no status',
    example: 'approved'
  })
  pccReferenceNoStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc reference no reject reason',
    example: ''
  })
  pccReferenceNoRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc url',
    example: '/4/right_to_work/1702368026601_____28-framed-size-small.png'
  })
  pccUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc url status',
    example: 'approved'
  })
  pccUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc url reject reason',
    example: ''
  })
  pccUrlRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc expire date',
    example: '2024-08-24T00:00:00.000Z'
  })
  pccExpireDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc uploaded at',
    example: '2023-12-12T00:00:00.000Z'
  })
  pccUploadedAt: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pcc state',
    example: 'Valid'
  })
  pccState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Record approved',
    example: ''
  })
  recordApproved: string;
}

export class SubmitSupportDocumentsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 4
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: 'Candidate'
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
    description: 'profile status',
    example: 'active'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'country',
    example: ''
  })
  document01Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document01 comment',
    example: '1 test'
  })
  document01Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document01 url',
    example:
      '/8/support_documents/1699425801242_____360_F_183060270_CpRpjjddhJJJDJKMKDKNjnnjjfjfjfjjfjfjjfjfjfjfjfjjffjjff.jpeg'
  })
  document01Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document01 status',
    example: ''
  })
  document01Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document01 reject reason',
    example: ''
  })
  document01RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document02 type',
    example: 'Warning Letters'
  })
  document02Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document02 comment',
    example: '2'
  })
  document02Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document02 url',
    example: '/8/support_documents/1703175410188_____28aprilcheck.jpeg'
  })
  document02Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document02 status',
    example: ''
  })
  document02Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document02 reject reason',
    example: ''
  })
  document02RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document03 type',
    example: ''
  })
  document03Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document03 comment',
    example: ''
  })
  document03Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document03 url',
    example: ''
  })
  document03Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document03 status',
    example: ''
  })
  document03Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document03 reject reason',
    example: ''
  })
  document03RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document04 type',
    example: ''
  })
  document04Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document04 comment',
    example: ''
  })
  document04Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document04 url',
    example: ''
  })
  document04Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document04 status',
    example: ''
  })
  document04Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document04 reject reason',
    example: ''
  })
  document04RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document05 type',
    example: ''
  })
  document05Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document05 comment',
    example: ''
  })
  document05Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document05 url',
    example: ''
  })
  document05Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document05 status',
    example: ''
  })
  document05Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document05 reject reason',
    example: ''
  })
  document05RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document06 type',
    example: ''
  })
  document06Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document06 comment',
    example: ''
  })
  document06Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document06 url',
    example: ''
  })
  document06Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document06 status',
    example: ''
  })
  document06Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document06 reject reason',
    example: ''
  })
  document06RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document07 type',
    example: ''
  })
  document07Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document07 comment',
    example: ''
  })
  document07Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document07 url',
    example: ''
  })
  document07Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document07 status',
    example: ''
  })
  document07Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document07 reject reason',
    example: ''
  })
  document07RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document08 type',
    example: ''
  })
  document08Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document08 comment',
    example: ''
  })
  document08Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document08 url',
    example: ''
  })
  document08Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document08 status',
    example: ''
  })
  document08Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document08 reject reason',
    example: ''
  })
  document08RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document09 type',
    example: ''
  })
  document09Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document09 comment',
    example: ''
  })
  document09Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document09 url',
    example: ''
  })
  document09Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document09 status',
    example: ''
  })
  document09Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document09 reject reason',
    example: ''
  })
  document09RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document10 type',
    example: ''
  })
  document10Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document10 comment',
    example: ''
  })
  document10Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document10 url',
    example: ''
  })
  document10Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document10 status',
    example: ''
  })
  document10Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document10 reject reason',
    example: ''
  })
  document10RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document11 type',
    example: ''
  })
  document11Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document11 comment',
    example: ''
  })
  document11Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document11 url',
    example: ''
  })
  document11Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document11 status',
    example: ''
  })
  document11Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document11 reject reason',
    example: ''
  })
  document11RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document12 type',
    example: ''
  })
  document12Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document12 comment',
    example: ''
  })
  document12Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document12 url',
    example: ''
  })
  document12Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document12 status',
    example: ''
  })
  document12Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document12 reject reason',
    example: ''
  })
  document12RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document13 type',
    example: ''
  })
  document13Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document13 comment',
    example: ''
  })
  document13Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document13 url',
    example: ''
  })
  document13Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document13 status',
    example: ''
  })
  document13Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document13 reject reason',
    example: ''
  })
  document13RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document14 type',
    example: ''
  })
  document14Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document14 comment',
    example: ''
  })
  document14Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document14 url',
    example: ''
  })
  document14Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document14 status',
    example: ''
  })
  document14Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document14 reject reason',
    example: ''
  })
  document14RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document15 type',
    example: ''
  })
  document15Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document15 comment',
    example: ''
  })
  document15Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document15 url',
    example: ''
  })
  document15Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document15 status',
    example: ''
  })
  document15Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document15 reject reason',
    example: ''
  })
  document15RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document16 type',
    example: ''
  })
  document16Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document16 comment',
    example: ''
  })
  document16Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document16 url',
    example: ''
  })
  document16Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document16 status',
    example: ''
  })
  document16Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document16 reject reason',
    example: ''
  })
  document16RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document17 type',
    example: ''
  })
  document17Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document17 comment',
    example: ''
  })
  document17Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document17 url',
    example: ''
  })
  document17Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document17 status',
    example: ''
  })
  document17Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document17 reject reason',
    example: ''
  })
  document17RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document18 type',
    example: ''
  })
  document18Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document18 comment',
    example: ''
  })
  document18Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document18 url',
    example: ''
  })
  document18Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document18 status',
    example: ''
  })
  document18Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document18 reject reason',
    example: ''
  })
  document18RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document19 type',
    example: ''
  })
  document19Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document19 comment',
    example: ''
  })
  document19Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document19 url',
    example: ''
  })
  document19Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document19 status',
    example: ''
  })
  document19Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document19 reject reason',
    example: ''
  })
  document19RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document20 type',
    example: ''
  })
  document20Type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document20 comment',
    example: ''
  })
  document20Comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document20 url',
    example: ''
  })
  document20Url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document20 status',
    example: ''
  })
  document20Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Document20 reject reason',
    example: ''
  })
  document20RejectReason: string;
}

export class FetchReferencesDetailsDto {
  @ApiProperty({
    example: {
      id: 71,
      tspId: 4,
      refereeTitle1: 'Mrs',
      refereeFirstName1: 'Anula',
      refereeLastName1: 'Perera',
      refereeRelationship1: 'Teacher',
      refereeEmail1: 'anula@gmail.com',
      refereeTelephoneNumber1: '+94 77 755 5333',
      refereeConfirmation1: 'agree',
      refereeTitle2: 'Ms',
      refereeFirstName2: 'Kasuni',
      refereeLastName2: 'Gamagedara',
      refereeRelationship2: 'Friend',
      refereeEmail2: 'kasuni@gmail.com',
      refereeTelephoneNumber2: '+94 77 777 7753',
      refereeConfirmation2: 'agree',
      acknowledgement1: 'agree',
      acknowledgement2: 'agree',
      referee1Status: 'approved',
      referee1RejectReason: '',
      referee2Status: 'approved',
      referee2RejectReason: '',
      confirmation: null,
      updatedBy: 11,
      updatedAt: '2023-12-12T07:48:05.000Z',
      auditedBy: 11,
      auditedAt: '2023-12-12T07:48:05.000Z'
    }
  })
  details: object;

  @ApiProperty({
    example: {
      refereeTitle1: 'Mrs',
      refereeFirstName1: 'Anula',
      refereeLastName1: 'Perera',
      refereeRelationship1: 'Teacher',
      refereeEmail1: 'anula@gmail.com',
      refereeTelephoneNumber1: '+94 77 755 5333',
      refereeConfirmation1: 'agree',
      refereeTitle2: 'Ms',
      refereeFirstName2: 'Kasuni',
      refereeLastName2: 'Gamagedara',
      refereeRelationship2: 'Friend',
      refereeEmail2: 'kasuni@gmail.com',
      refereeTelephoneNumber2: '+94 77 777 7753',
      refereeConfirmation2: 'agree',
      acknowledgement1: 'agree',
      acknowledgement2: 'agree',
      emailFlag1: null,
      emailFlag2: null,
      submissionFlag1: null,
      submissionFlag2: null
    }
  })
  approvedDetails: object;
}
export class FetchRightToWorkDetailsDto {
  @ApiProperty({
    example: {
      id: 87,
      tspId: 4,
      contractUrl: '/954443235V-contract.pdf',
      contractUrlStatus: '',
      contractUrlRejectReason: '',
      gsIssuedDate: '2021-05-13T00:00:00.000Z',
      gsIssuedDateStatus: 'approved',
      gsIssuedDateRejectReason: '',
      gsUrl: '/4/right_to_work/1686046010214_____3.jpeg',
      gsUrlStatus: 'approved',
      gsUrlRejectReason: '',
      gsUploadedAt: null,
      pccIssuedDate: '2022-08-24T00:00:00.000Z',
      pccIssuedDateStatus: 'approved',
      pccIssuedDateRejectReason: '',
      pccReferenceNo: '22',
      pccReferenceNoStatus: 'approved',
      pccReferenceNoRejectReason: '',
      pccUrl: '/4/right_to_work/1702368026601_____28-framed-size-small.png',
      pccUrlStatus: 'approved',
      pccUrlRejectReason: '',
      pccUploadedAt: '2023-12-12T00:00:00.000Z',
      pccExpireDate: '2024-08-24T00:00:00.000Z',
      pccState: 'Valid',
      requireBackgroundCheck: null,
      contractStartDate: null,
      contractStartDateStatus: null,
      contractStartDateRejectReason: null,
      contractEndDate: null,
      contractEndDateStatus: null,
      contractEndDateRejectReason: null,
      contractType: null,
      contractTypeStatus: null,
      contractTypeRejectReason: null,
      recordApproved: '',
      updatedBy: 11,
      updatedAt: '2023-12-12T08:00:28.000Z',
      auditedBy: 11,
      auditedAt: '2023-12-12T08:00:28.000Z'
    }
  })
  details: object;

  @ApiProperty({
    example: {
      typeOfIdx: 'National Identity Card No.',
      nic: '954443235V',
      fullName: 'Dilki Wijewardhana',
      address: 'Sri Lanka',
      residingCountry: 'Sri Lanka',
      startDate: '2023-11-15T00:00:00.000Z',
      endDate: '2023-11-22T00:00:00.000Z',
      contractUrl: '',
      contract_assigned_at: '2023-11-08T00:00:00.000Z',
      contract_url_status: '',
      contract_url_reject_reason: '',
      tspId: 4,
      contractNo: 7
    }
  })
  contractDetails: object;

  @ApiProperty({
    example: {
      contractUrl: '/954443235V-contract.pdf',
      gsIssuedDate: '2021-05-13T00:00:00.000Z',
      gsUrl: '/4/right_to_work/1686046010214_____3.jpeg',
      pccIssuedDate: '2022-08-24T00:00:00.000Z',
      pccReferenceNo: '22',
      pccUrl: '/4/right_to_work/1702368026601_____28-framed-size-small.png',
      pccExpireDate: '2024-08-24T00:00:00.000Z',
      pccUploadedAt: '2023-12-12T00:00:00.000Z',
      pccState: 'Valid'
    }
  })
  approvedDetails: object;
}

export class RightToWorkDetails200Response {
  @ApiProperty({
    example: {
      contractUrl: '/954443235V-contract.pdf',
      contractUrlStatus: '',
      contractUrlRejectReason: '',
      gsIssuedDate: '2021-05-13T00:00:00.000Z',
      gsIssuedDateStatus: 'pending',
      gsIssuedDateRejectReason: '',
      gsUrl: '/4/right_to_work/1686046010214_____3.jpeg',
      gsUrlStatus: 'approved',
      gsUrlRejectReason: '',
      pccIssuedDate: '2022-08-24T00:00:00.000Z',
      pccIssuedDateStatus: 'pending',
      pccIssuedDateRejectReason: '',
      pccReferenceNo: '22',
      pccReferenceNoStatus: 'approved',
      pccReferenceNoRejectReason: '',
      pccUrl: '/4/right_to_work/1702368026601_____28-framed-size-small.png',
      pccUrlStatus: 'approved',
      pccUrlRejectReason: '',
      pccExpireDate: '2024-08-24T00:00:00.000Z',
      pccUploadedAt: '2023-12-12T00:00:00.000Z',
      pccState: 'Valid',
      recordApproved: ''
    }
  })
  data: object;
}
export class ReferenceDetails200Response {
  @ApiProperty({
    example: {
      refereeTitle1: 'Mrs',
      refereeFirstName1: 'Anula',
      refereeLastName1: 'Perera',
      refereeRelationship1: 'Teacher',
      refereeEmail1: 'anula@gmail.com',
      refereeTelephoneNumber1: '+94 77 755 5333',
      refereeConfirmation1: 'agree',
      refereeTitle2: 'Ms',
      refereeFirstName2: 'Kasuni',
      refereeLastName2: 'Gamagedara',
      refereeRelationship2: 'Friend',
      refereeEmail2: 'kasuni@gmail.com',
      refereeTelephoneNumber2: '+94 77 777 7753',
      refereeConfirmation2: 'agree',
      acknowledgement1: 'agree',
      acknowledgement2: 'agree',
      referee1Status: 'approved',
      referee1RejectReason: '',
      referee2Status: 'approved',
      referee2RejectReason: ''
    }
  })
  data: object;
}

export class AuditorRightToWorkDetails200Response {
  @ApiProperty({
    example: {
      contractUrl: '/954443235V-contract.pdf',
      contractUrlStatus: '',
      contractUrlRejectReason: '',
      gsIssuedDate: '2021-05-13T00:00:00.000Z',
      gsIssuedDateStatus: 'approved',
      gsIssuedDateRejectReason: '',
      gsUrl: '/4/right_to_work/1686046010214_____3.jpeg',
      gsUrlStatus: 'approved',
      gsUrlRejectReason: '',
      pccIssuedDate: '2022-08-24T00:00:00.000Z',
      pccIssuedDateStatus: 'approved',
      pccIssuedDateRejectReason: '',
      pccReferenceNo: '22',
      pccReferenceNoStatus: 'approved',
      pccReferenceNoRejectReason: '',
      pccUrl: '/4/right_to_work/1702368026601_____28-framed-size-small.png',
      pccUrlStatus: 'approved',
      pccUrlRejectReason: '',
      pccExpireDate: '2024-08-24T00:00:00.000Z',
      pccUploadedAt: '2023-12-12T00:00:00.000Z',
      pccState: 'Valid',
      recordApproved: ''
    }
  })
  details: object;

  @ApiProperty({
    example: {
      contractUrl: '/954443235V-contract.pdf',
      gsIssuedDate: '2021-05-13T00:00:00.000Z',
      gsUrl: '/4/right_to_work/1686046010214_____3.jpeg',
      pccIssuedDate: '2022-08-24T00:00:00.000Z',
      pccReferenceNo: '22',
      pccUrl: '/4/right_to_work/1702368026601_____28-framed-size-small.png',
      pccExpireDate: '2024-08-24T00:00:00.000Z',
      pccState: 'Valid'
    }
  })
  approvedDetails: object;
}
export class AuditorReferenceDetails200Response {
  @ApiProperty({
    example: {
      refereeTitle1: 'Mrs',
      refereeFirstName1: 'Anula',
      refereeLastName1: 'Perera',
      refereeRelationship1: 'Teacher',
      refereeEmail1: 'anula@gmail.com',
      refereeTelephoneNumber1: '+94 77 755 5333',
      refereeConfirmation1: 'agree',
      refereeTitle2: 'Ms',
      refereeFirstName2: 'Kasuni',
      refereeLastName2: 'Gamagedara',
      refereeRelationship2: 'Friend',
      refereeEmail2: 'kasuni@gmail.com',
      refereeTelephoneNumber2: '+94 77 777 7753',
      refereeConfirmation2: 'agree',
      acknowledgement1: 'agree',
      acknowledgement2: 'agree',
      referee1Status: 'approved',
      referee1RejectReason: '',
      referee2Status: 'approved',
      referee2RejectReason: ''
    }
  })
  details: object;
  @ApiProperty({
    example: {
      refereeTitle1: 'Mrs',
      refereeFirstName1: 'Anula',
      refereeLastName1: 'Perera',
      refereeRelationship1: 'Teacher',
      refereeEmail1: 'anula@gmail.com',
      refereeTelephoneNumber1: '+94 77 755 5333',
      refereeConfirmation1: 'agree',
      refereeTitle2: 'Ms',
      refereeFirstName2: 'Kasuni',
      refereeLastName2: 'Gamagedara',
      refereeRelationship2: 'Friend',
      refereeEmail2: 'kasuni@gmail.com',
      refereeTelephoneNumber2: '+94 77 777 7753',
      refereeConfirmation2: 'agree',
      acknowledgement1: 'agree',
      acknowledgement2: 'agree',
      emailFlag1: null,
      emailFlag2: null,
      submissionFlag1: null,
      submissionFlag2: null
    }
  })
  approvedDetails: object;
}

export class AuditorSubmitReferenceDetailsDto extends SubmitReferencesDetailsDto {
  @IsNumber()
  candidateId: number;
}
export class AuditorSubmitRightToWorkDetailsDto extends SubmitRightToWorkDetailsDto {
  @IsNumber()
  candidateId: number;
}

export class AuditorSubmitSupportDocumentsDto extends SubmitSupportDocumentsDto {
  @IsNumber()
  candidateId: number;
}
export class UpdateContractUrlDto {
  @IsString()
  url: string;
}

export class SetAuditorRefereeActionBtnFlagDto {
  @IsNumber()
  candidateId: number;

  @IsString()
  refereeAction: 'send_email' | 'edit_enable';

  @IsNumber()
  refereeCount: 1 | 2;
}
export class SetAuditorContractActionDto {
  @IsNumber()
  candidateId: number;

  @IsString()
  contractAction: 'approved' | 'rejected' | 'pending';

  @IsOptional()
  @IsString()
  contractRejectReason: string | null;
}
export class ReferenceFormDto {
  @IsNumber()
  tspId: number;

  @IsString()
  refereeId: string;

  @IsString()
  refereeEmail: string;

  @IsString()
  refereeName: string;

  @IsString()
  applicantName: string;

  @IsOptional()
  @IsString()
  refereeApplicantHowKnow: string;

  @IsOptional()
  @IsString()
  refereeApplicantKnowDuration: string;

  @IsOptional()
  @IsString()
  refereeApplicantNotWorkChildren: string;

  @IsOptional()
  @IsString()
  refereeApplicantEmploymentConsider: string;

  @IsOptional()
  @IsString()
  refereeApplicantPositionTutor: string;
}

export class FetchSupportDetailsDto {
  @ApiProperty({
    example: {
      id: 105,
      tspId: 67,
      document01Type: 'Warning Letters',
      document01Comment: 'first',
      document01Url: '/67/support_documents/1693483471020_____1.jpeg',
      document01Status: 'approved',
      document01RejectReason: '',
      document02Type: 'Employment Confirmation',
      document02Comment: 'fourth',
      document02Url: '/67/support_documents/1699423014229_____2.jpeg',
      document02Status: 'rejected',
      document02RejectReason: 'reject doc 2',
      document03Type: 'Salary Confirmation',
      document03Comment: 'test 6',
      document03Url:
        '/67/support_documents/1699424193398_____360_F_183060270_CpRpjjddhJJJDJKMKDKNjnnjjfjfjfjjfjfjjfjfjfjfjfjjffjjff.jpeg',
      document03Status: '',
      document03RejectReason: '',
      document04Type: 'Employment Confirmation',
      document04Comment: '',
      document04Url: '/67/support_documents/1699424549926_____3.jpeg',
      document04Status: '',
      document04RejectReason: '',
      document05Type: '',
      document05Comment: '',
      document05Url: '',
      document05Status: '',
      document05RejectReason: '',
      document06Type: '',
      document06Comment: '',
      document06Url: '',
      document06Status: '',
      document06RejectReason: '',
      document07Type: '',
      document07Comment: '',
      document07Url: '',
      document07Status: '',
      document07RejectReason: '',
      document08Type: '',
      document08Comment: '',
      document08Url: '',
      document08Status: '',
      document08RejectReason: '',
      document09Type: '',
      document09Comment: '',
      document09Url: '',
      document09Status: '',
      document09RejectReason: '',
      document10Type: '',
      document10Comment: '',
      document10Url: '',
      document10Status: '',
      document10RejectReason: '',
      document11Type: '',
      document11Comment: '',
      document11Url: '',
      document11Status: '',
      document11RejectReason: '',
      document12Type: '',
      document12Comment: '',
      document12Url: '',
      document12Status: '',
      document12RejectReason: '',
      document13Type: '',
      document13Comment: '',
      document13Url: '',
      document13Status: '',
      document13RejectReason: '',
      document14Type: '',
      document14Comment: '',
      document14Url: '',
      document14Status: '',
      document14RejectReason: '',
      document15Type: '',
      document15Comment: '',
      document15Url: '',
      document15Status: '',
      document15RejectReason: '',
      document16Type: '',
      document16Comment: '',
      document16Url: '',
      document16Status: '',
      document16RejectReason: '',
      document17Type: '',
      document17Comment: '',
      document17Url: '',
      document17Status: '',
      document17RejectReason: '',
      document18Type: '',
      document18Comment: '',
      document18Url: '',
      document18Status: '',
      document18RejectReason: '',
      document19Type: '',
      document19Comment: '',
      document19Url: '',
      document19Status: '',
      document19RejectReason: '',
      document20Type: '',
      document20Comment: '',
      document20Url: '',
      document20Status: '',
      document20RejectReason: '',
      updatedBy: 6,
      updatedAt: '2023-11-08T11:12:39.000Z',
      auditedBy: 6,
      auditedAt: '2023-11-08T11:12:39.000Z'
    }
  })
  details: object;

  @ApiProperty({
    example: {
      document01Type: 'Warning Letters',
      document01Comment: 'first',
      document01Url: '/67/support_documents/1693483471020_____1.jpeg',
      document02Type: null,
      document02Comment: null,
      document02Url: null,
      document03Type: 'Visa Letters',
      document03Comment: '4',
      document03Url: '/67/support_documents/1697528856829_____work$ex1.jpeg',
      document04Type: null,
      document04Comment: null,
      document04Url: null,
      document05Type: null,
      document05Comment: null,
      document05Url: null,
      document06Type: null,
      document06Comment: null,
      document06Url: null,
      document07Type: null,
      document07Comment: null,
      document07Url: null,
      document08Type: null,
      document08Comment: null,
      document08Url: null,
      document09Type: null,
      document09Comment: null,
      document09Url: null,
      document10Type: null,
      document10Comment: null,
      document10Url: null,
      document11Type: null,
      document11Comment: null,
      document11Url: null,
      document12Type: null,
      document12Comment: null,
      document12Url: null,
      document13Type: null,
      document13Comment: null,
      document13Url: null,
      document14Type: null,
      document14Comment: null,
      document14Url: null,
      document15Type: null,
      document15Comment: null,
      document15Url: null,
      document16Type: null,
      document16Comment: null,
      document16Url: null,
      document17Type: null,
      document17Comment: null,
      document17Url: null,
      document18Type: null,
      document18Comment: null,
      document18Url: null,
      document19Type: null,
      document19Comment: null,
      document19Url: null,
      document20Type: null,
      document20Comment: null,
      document20Url: null
    }
  })
  approvedDetails: object;
}

export class SupportDocuments200Response {
  @ApiProperty({
    example: {
      document01Type: 'Salary Confirmation',
      document01Comment: '1 testt',
      document01Url:
        '/8/support_documents/1699425801242_____360_F_183060270_CpRpjjddhJJJDJKMKDKNjnnjjfjfjfjjfjfjjfjfjfjfjfjjffjjff.jpeg',
      document01Status: '',
      document01RejectReason: '',
      document02Type: 'Warning Letters',
      document02Comment: '2',
      document02Url: '/8/support_documents/1703175410188_____28aprilcheck.jpeg',
      document02Status: '',
      document02RejectReason: '',
      document03Type: '',
      document03Comment: '',
      document03Url: '',
      document03Status: '',
      document03RejectReason: '',
      document04Type: '',
      document04Comment: '',
      document04Url: '',
      document04Status: '',
      document04RejectReason: '',
      document05Type: '',
      document05Comment: '',
      document05Url: '',
      document05Status: '',
      document05RejectReason: '',
      document06Type: '',
      document06Comment: '',
      document06Url: '',
      document06Status: '',
      document06RejectReason: '',
      document07Type: '',
      document07Comment: '',
      document07Url: '',
      document07Status: '',
      document07RejectReason: '',
      document08Type: '',
      document08Comment: '',
      document08Url: '',
      document08Status: '',
      document08RejectReason: '',
      document09Type: '',
      document09Comment: '',
      document09Url: '',
      document09Status: '',
      document09RejectReason: '',
      document10Type: '',
      document10Comment: '',
      document10Url: '',
      document10Status: '',
      document10RejectReason: '',
      document11Type: '',
      document11Comment: '',
      document11Url: '',
      document11Status: '',
      document11RejectReason: '',
      document12Type: '',
      document12Comment: '',
      document12Url: '',
      document12Status: '',
      document12RejectReason: '',
      document13Type: '',
      document13Comment: '',
      document13Url: '',
      document13Status: '',
      document13RejectReason: '',
      document14Type: '',
      document14Comment: '',
      document14Url: '',
      document14Status: '',
      document14RejectReason: '',
      document15Type: '',
      document15Comment: '',
      document15Url: '',
      document15Status: '',
      document15RejectReason: '',
      document16Type: '',
      document16Comment: '',
      document16Url: '',
      document16Status: '',
      document16RejectReason: '',
      document17Type: '',
      document17Comment: '',
      document17Url: '',
      document17Status: '',
      document17RejectReason: '',
      document18Type: '',
      document18Comment: '',
      document18Url: '',
      document18Status: '',
      document18RejectReason: '',
      document19Type: '',
      document19Comment: '',
      document19Url: '',
      document19Status: '',
      document19RejectReason: '',
      document20Type: '',
      document20Comment: '',
      document20Url: '',
      document20Status: '',
      document20RejectReason: ''
    }
  })
  data: object;
}

export class FetchTsgSupportDocDto {
  @ApiProperty({
    example: {
      success: true,
      details: {
        id: 40,
        tspId: 8,
        documentType: 'English Identification Letter',
        documentName: null,
        documentComment: 'test tsg upload doc',
        documentUrl: '/8/support_documents/1703175894986_____4.jpeg',
        documentEnable: 1,
        updatedBy: 11,
        updatedAt: '2023-12-21T16:24:56.000Z'
      }
    }
  })
  data: object;
}

export class AuditorSupportDocuments200Response {
  @ApiProperty({
    example: {
      document01Type: 'Warning Letters',
      document01Comment: 'warning letters comment',
      document01Url:
        '/4/support_documents/1703176597018_____28-framed-size-small.png',
      document01Status: 'approved',
      document01RejectReason: '',
      document02Type: '',
      document02Comment: '',
      document02Url: '',
      document02Status: '',
      document02RejectReason: '',
      document03Type: '',
      document03Comment: '',
      document03Url: '',
      document03Status: '',
      document03RejectReason: '',
      document04Type: '',
      document04Comment: '',
      document04Url: '',
      document04Status: '',
      document04RejectReason: '',
      document05Type: '',
      document05Comment: '',
      document05Url: '',
      document05Status: '',
      document05RejectReason: '',
      document06Type: '',
      document06Comment: '',
      document06Url: '',
      document06Status: '',
      document06RejectReason: '',
      document07Type: '',
      document07Comment: '',
      document07Url: '',
      document07Status: '',
      document07RejectReason: '',
      document08Type: '',
      document08Comment: '',
      document08Url: '',
      document08Status: '',
      document08RejectReason: '',
      document09Type: '',
      document09Comment: '',
      document09Url: '',
      document09Status: '',
      document09RejectReason: '',
      document10Type: '',
      document10Comment: '',
      document10Url: '',
      document10Status: '',
      document10RejectReason: '',
      document11Type: '',
      document11Comment: '',
      document11Url: '',
      document11Status: '',
      document11RejectReason: '',
      document12Type: '',
      document12Comment: '',
      document12Url: '',
      document12Status: '',
      document12RejectReason: '',
      document13Type: '',
      document13Comment: '',
      document13Url: '',
      document13Status: '',
      document13RejectReason: '',
      document14Type: '',
      document14Comment: '',
      document14Url: '',
      document14Status: '',
      document14RejectReason: '',
      document15Type: '',
      document15Comment: '',
      document15Url: '',
      document15Status: '',
      document15RejectReason: '',
      document16Type: '',
      document16Comment: '',
      document16Url: '',
      document16Status: '',
      document16RejectReason: '',
      document17Type: '',
      document17Comment: '',
      document17Url: '',
      document17Status: '',
      document17RejectReason: '',
      document18Type: '',
      document18Comment: '',
      document18Url: '',
      document18Status: '',
      document18RejectReason: '',
      document19Type: '',
      document19Comment: '',
      document19Url: '',
      document19Status: '',
      document19RejectReason: '',
      document20Type: '',
      document20Comment: '',
      document20Url: '',
      document20Status: '',
      document20RejectReason: ''
    }
  })
  details: object;

  @ApiProperty({
    example: {
      document01Type: 'Warning Letters',
      document01Comment: 'warning letters comment',
      document01Url:
        '/4/support_documents/1703176597018_____28-framed-size-small.png',
      document02Type: 'English Identification Letter',
      document02Comment: '2',
      document02Url: '',
      document03Type: null,
      document03Comment: null,
      document03Url: null,
      document04Type: null,
      document04Comment: null,
      document04Url: null,
      document05Type: null,
      document05Comment: null,
      document05Url: null,
      document06Type: null,
      document06Comment: null,
      document06Url: null,
      document07Type: null,
      document07Comment: null,
      document07Url: null,
      document08Type: null,
      document08Comment: null,
      document08Url: null,
      document09Type: null,
      document09Comment: null,
      document09Url: null,
      document10Type: null,
      document10Comment: null,
      document10Url: null,
      document11Type: null,
      document11Comment: null,
      document11Url: null,
      document12Type: null,
      document12Comment: null,
      document12Url: null,
      document13Type: null,
      document13Comment: null,
      document13Url: null,
      document14Type: null,
      document14Comment: null,
      document14Url: null,
      document15Type: null,
      document15Comment: null,
      document15Url: null,
      document16Type: null,
      document16Comment: null,
      document16Url: null,
      document17Type: null,
      document17Comment: null,
      document17Url: null,
      document18Type: null,
      document18Comment: null,
      document18Url: null,
      document19Type: null,
      document19Comment: null,
      document19Url: null,
      document20Type: null,
      document20Comment: null,
      document20Url: null
    }
  })
  approvedDetails: object;
}
