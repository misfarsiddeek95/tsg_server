import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BankDataDto {
  @ApiProperty({
    type: 'string',
    description: 'Bank Name',
    example: 'Cargills Bank'
  })
  @IsString()
  bankName: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Name Status',
    example: 'approved'
  })
  @IsString()
  bankNameStatus: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Name Reject Reason',
    example: 'Invalid'
  })
  @IsString()
  bankNameRejectReason: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Branch',
    example: 'Hawaeliya'
  })
  @IsString()
  bBranch: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Branch Status',
    example: 'approved'
  })
  @IsString()
  bBranchStatus: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Branch Reject Reason',
    example: 'Invalid'
  })
  @IsString()
  bBranchRejectReason: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Branch Code',
    example: '007'
  })
  @IsString()
  bBranchCode: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Account No',
    example: '123456789'
  })
  @IsString()
  bAccountNo: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Account No Status',
    example: 'rejected'
  })
  @IsString()
  bAccountNoStatus: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Account No Reject Reason',
    example: 'Invalid number'
  })
  @IsString()
  bAccountNoRejectReason: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Account Name',
    example: 'Dinesh Nelundeniya'
  })
  @IsString()
  bAccountName: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Account Name Status',
    example: 'approved'
  })
  @IsString()
  bAccountNameStatus: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Account Name Reject Reason',
    example: 'Incorrect name'
  })
  @IsString()
  bAccountNameRejectReason: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Swift',
    example: 'CGRBLKLX007'
  })
  @IsString()
  bSwift: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Passbook Url',
    example: '/27/bank_details_nthris/1699961123718_____photo.jpg'
  })
  @IsString()
  bPassbookUrl: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Passbook Url Status',
    example: 'approved'
  })
  @IsString()
  bPassbookUrlStatus: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Passbook Url Reject Reason',
    example: ''
  })
  @IsString()
  bPassbookUrlRejectReason: string;
}
export class BankDataAuditDto extends BankDataDto {
  @ApiProperty({
    type: 'number',
    description: 'Non Tutor Id',
    example: 123
  })
  @IsNumber()
  nonTutorId: number;
}

export class FetchBankBranchesDto {
  @ApiProperty({
    type: 'string',
    description: 'Bank Name',
    example: 'Cargills Bank'
  })
  @IsString()
  bankName: string;
}

export class BankBranchesDto {}

class ApprovedDetailsDto {
  @ApiProperty({
    type: 'string',
    description: 'Bank Name',
    example: 'Cargills Bank'
  })
  bankName: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Branch',
    example: 'Hawaeliya'
  })
  bBranch: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Branch Code',
    example: '007'
  })
  bBranchCode: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Account No',
    example: '123456789'
  })
  bAccountNo: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Account Name',
    example: 'Dinesh Nelundeniya'
  })
  bAccountName: string;

  @ApiProperty({
    type: 'string',
    description: 'Bank Swift',
    example: 'CGRBLKLX007'
  })
  bSwift: string;
}

class DataDto {
  @ApiProperty({ type: BankDataDto })
  details: BankDataDto;

  @ApiProperty({ type: ApprovedDetailsDto })
  approved_details: ApprovedDetailsDto;
}
export class FetchBankDataDto {
  @ApiProperty({
    type: 'boolean',
    description: 'Success',
    example: true
  })
  success: boolean;

  @ApiProperty({ type: DataDto })
  data: DataDto;
}
