import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class BankSubmitDetailsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 7
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
    description: 'Bank Name',
    example: 'Commercial Bank PLC'
  })
  bankName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Bank Branch',
    example: 'Colombo'
  })
  bBranch: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Branch Code',
    example: '4455'
  })
  bBranchCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Bank Account Number',
    example: '888666'
  })
  bAccountNo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Bank Account Name',
    example: 'Super Saver Account'
  })
  bAccountName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Bank Swift Code',
    example: 'CCEYLKLX'
  })
  bSwift: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Bank Passbook Url',
    example: '/5/bank_details/1686145841509_____2.jpeg'
  })
  bPassbookUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'IFSC Code',
    example: '455456'
  })
  ifscCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'IBAN Number',
    example: '917010046892261'
  })
  ibanNumber: string;

  @IsOptional()
  @IsString()
  recordApproved: string;

  //   @IsString()
  //   updated_by: string;
  //   @IsString()
  //   updated_at: string;
  //   @IsString()
  //   audited_by: string;
  //   @IsString()
  //   audited_at: string;
}

export class BankBranchesDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: '7010'
  })
  bankCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: 'Bank of Ceylon'
  })
  bankName: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: '679'
  })
  branchCode: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: 'Battaramulla'
  })
  branchName: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: 'BCEYLKLX679'
  })
  swiftCode: string;
}

export class AuditorBankSubmitDetails extends BankSubmitDetailsDto {
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Candidate ID',
    example: 55
  })
  candidateId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'tsp Id',
    example: 3
  })
  tspId: number;
}

export class FetchBankDetailsDto {
  @ApiProperty({
    example: {
      id: 235,
      tspId: 129793,
      bankName: 'Bank of China LTD',
      bankNameStatus: 'approved',
      bankNameRejectReason: '',
      bBranch: 'Colombo',
      bBranchStatus: 'approved',
      bBranchRejectReason: '',
      bBranchCode: '888',
      bAccountNo: '828299393020',
      bAccountNoStatus: 'approved',
      bAccountNoRejectReason: '',
      bAccountName: 'Test',
      bAccountNameStatus: 'approved',
      bAccountNameRejectReason: '',
      bSwift: 'BANKLKLX888',
      bPassbookUrl: '/129793/bank_details/1695641150662_____Passbook.jpg',
      bPassbookUrlStatus: 'approved',
      bPassbookUrlRejectReason: '',
      ifscCode: '',
      ibanNumber: '',
      bankStatus: 'approved',
      recordApproved: '',
      updatedBy: 100146,
      updatedAt: '2023-09-25T15:39:40.000Z',
      auditedBy: 100146,
      auditedAt: '2023-09-25T15:39:40.000Z'
    }
  })
  details: object;

  @ApiProperty({
    example: {
      bankName: 'Bank of China LTD',
      bBranch: 'Colombo',
      bBranchCode: '888',
      bAccountNo: '828299393020',
      bAccountName: 'Test',
      bSwift: 'BANKLKLX888',
      bPassbookUrl: '/129793/bank_details/1695641150662_____Passbook.jpg',
      ifscCode: '',
      ibanNumber: '',
      bankStatus: null
    }
  })
  approvedDetails: object;
}

export class BankDetails200Response {
  @ApiProperty({
    example: {
      bankName: 'Sampath Bank',
      bankNameStatus: 'pending',
      bankNameRejectReason: 'cffffdd',
      bBranch: 'Ambalangoda',
      bBranchStatus: 'pending',
      bBranchRejectReason: '',
      bBranchCode: '072',
      bAccountNo: '8886664',
      bAccountNoStatus: 'pending',
      bAccountNoRejectReason: '',
      bAccountName: 'D D S Hewage',
      bAccountNameStatus: 'pending',
      bAccountNameRejectReason: null,
      bSwift: 'BSAMLKLX072',
      bPassbookUrl: '/8/bank_details/1701754108869_____28aprilcheck.jpeg',
      bPassbookUrlStatus: 'pending',
      bPassbookUrlRejectReason: 'bnk doc rej',
      bankStatus: '',
      ifscCode: null,
      ibanNumber: null,
      recordApproved: ''
    }
  })
  data: object;
}

export class AuditorBankDetails200Response {
  @ApiProperty({
    example: {
      bankName: 'Bank of Ceylon',
      bankNameStatus: 'pending',
      bankNameRejectReason: '',
      bBranch: 'Agalawatta',
      bBranchStatus: 'pending',
      bBranchRejectReason: '',
      bBranchCode: '657',
      bAccountNo: '888666',
      bAccountNoStatus: 'approved',
      bAccountNoRejectReason: '',
      bAccountName: 'Boc',
      bAccountNameStatus: 'pending',
      bAccountNameRejectReason: '',
      bSwift: 'BCEYLKLX657',
      bPassbookUrl: '/62/bank_details/1685967302493_____28aprilcheck.jpeg',
      bPassbookUrlStatus: 'approved',
      bPassbookUrlRejectReason: '',
      bankStatus: 'approved',
      ifscCode: '',
      ibanNumber: '',
      recordApproved: ''
    }
  })
  details: object;

  @ApiProperty({
    example: {
      bankName: 'Amana Bank',
      bBranch: 'Akkaraipattu',
      bBranchCode: '015',
      bAccountNo: '888666',
      bAccountName: null,
      bSwift: 'AMNALKLX015',
      bPassbookUrl: '/62/bank_details/1685967302493_____28aprilcheck.jpeg',
      ifscCode: '',
      ibanNumber: '',
      bankStatus: 'approved'
    }
  })
  approvedDetails: object;
}
export class FetchBankBranchesDto {
  @IsString()
  bankName: string;
}
