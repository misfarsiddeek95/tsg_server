import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SubmitDetailsDto {
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
    description: 'Hd1 heart',
    example: 'yes'
  })
  hd1Heart: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd1 heart state',
    example: 'Still on Follow up'
  })
  hd1HeartState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd2 neck',
    example: 'no'
  })
  hd2Neck: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd2 neck state',
    example: ''
  })
  hd2NeckState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd3 high',
    example: 'yes'
  })
  hd3High: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd3 high state',
    example: 'Receiving treatment'
  })
  hd3HighState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd4 arthritis',
    example: 'no'
  })
  hd4Arthritis: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd4 arthritis state',
    example: ''
  })
  hd4ArthritisState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd5 terminally',
    example: 'no'
  })
  hd5Terminally: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd5 terminally state',
    example: ''
  })
  hd5TerminallyState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd6 unusual',
    example: 'no'
  })
  hd6Unusual: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd6 unusual state',
    example: ''
  })
  hd6UnusualState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd7 asthma',
    example: 'yes'
  })
  hd7Asthma: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd7 asthma state',
    example: 'Fully recovered'
  })
  hd7AsthmaState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd8 fainting',
    example: 'no'
  })
  hd8Fainting: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd8 fainting state',
    example: ''
  })
  hd8FaintingState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd9 depression',
    example: 'no'
  })
  hd9Depression: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd9 depression state',
    example: ''
  })
  hd9DepressionState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd10 throat',
    example: 'no'
  })
  hd10Throat: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd10 throat state',
    example: ''
  })
  hd10ThroatState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd12 vision',
    example: 'no'
  })
  hd12Vision: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd12 vision state',
    example: ''
  })
  hd12VisionState: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd11 other',
    example: 'no'
  })
  hd11Other: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd11 other explain',
    example: ''
  })
  hd11OtherExplain: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd page status',
    example: 'approved'
  })
  hdPageStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Hd page reject reason',
    example: ''
  })
  hdPageRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Record approved',
    example: ''
  })
  recordApproved: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 1',
    example: '/129856/health_declaration/1695354343381_____Medical Report.png'
  })
  healthUrl_1: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 1 status',
    example: ''
  })
  healthUrl_1Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 1 reject reason',
    example: ''
  })
  healthUrl_1RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 2',
    example: ''
  })
  healthUrl_2: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 2 status',
    example: ''
  })
  healthUrl_2Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 2 reject reason',
    example: ''
  })
  healthUrl_2RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 3',
    example: ''
  })
  healthUrl_3: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 3 status',
    example: ''
  })
  healthUrl_3Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 3 reject reason',
    example: ''
  })
  healthUrl_3RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 4',
    example: ''
  })
  healthUrl_4: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 4 status',
    example: ''
  })
  healthUrl_4Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 4 reject reason',
    example: ''
  })
  healthUrl_4RejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 5',
    example: ''
  })
  healthUrl_5: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 5 status',
    example: ''
  })
  healthUrl_5Status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Health url 5 reject reason',
    example: ''
  })
  healthUrl_5RejectReason: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Health url 5 reject reason',
    example: 0
  })
  healthUrlCount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Health url 5 reject reason',
    example: 10022
  })
  updatedBy: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Updated at',
    example: '2023-12-11T05:21:16.000Z'
  })
  updatedAt: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Health url 5 reject reason',
    example: 10027
  })
  auditedBy: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Audited at',
    example: '2023-12-11T05:21:16.000Z'
  })
  auditedAt: string;
}

export class FetchHealthDetailsDto {
  @ApiProperty({
    example: {
      id: 293,
      tspId: 129856,
      hd1Heart: 'yes',
      hd1HeartState: 'Still on Follow up',
      hd2Neck: 'no',
      hd2NeckState: '',
      hd3High: 'yes',
      hd3HighState: 'Receiving treatment',
      hd4Arthritis: 'no',
      hd4ArthritisState: '',
      hd5Terminally: 'no',
      hd5TerminallyState: '',
      hd6Unusual: 'no',
      hd6UnusualState: '',
      hd7Asthma: 'yes',
      hd7AsthmaState: 'Fully recovered',
      hd8Fainting: 'no',
      hd8FaintingState: '',
      hd9Depression: 'no',
      hd9DepressionState: '',
      hd10Throat: 'no',
      hd10ThroatState: '',
      hd12Vision: 'no',
      hd12VisionState: '',
      hd11Other: 'no',
      hd11OtherExplain: '',
      hdPageStatus: 'approved',
      hdPageRejectReason: '',
      recordApproved: '',
      healthUrl_1:
        '/129856/health_declaration/1695354343381_____Medical Report.png',
      healthUrl_1Status: '',
      healthUrl_1RejectReason: '',
      healthUrl_2: '',
      healthUrl_2Status: '',
      healthUrl_2RejectReason: '',
      healthUrl_3: '',
      healthUrl_3Status: '',
      healthUrl_3RejectReason: '',
      healthUrl_4: '',
      healthUrl_4Status: '',
      healthUrl_4RejectReason: '',
      healthUrl_5: '',
      healthUrl_5Status: '',
      healthUrl_5RejectReason: '',
      healthUrlCount: 0,
      updatedBy: 100146,
      updatedAt: '2023-12-11T05:21:16.000Z',
      auditedBy: 100146,
      auditedAt: '2023-12-11T05:21:16.000Z'
    }
  })
  details: object;

  @ApiProperty({
    example: {
      hd1Heart: 'yes',
      hd1HeartState: 'Still on Follow up',
      hd2Neck: 'no',
      hd2NeckState: '',
      hd3High: 'yes',
      hd3HighState: 'Receiving treatment',
      hd4Arthritis: 'no',
      hd4ArthritisState: '',
      hd5Terminally: 'no',
      hd5TerminallyState: '',
      hd6Unusual: 'no',
      hd6UnusualState: '',
      hd7Asthma: 'yes',
      hd7AsthmaState: 'Fully recovered',
      hd8Fainting: 'no',
      hd8FaintingState: '',
      hd9Depression: 'no',
      hd9DepressionState: '',
      hd10Throat: 'no',
      hd10ThroatState: '',
      hd12Vision: 'no',
      hd12VisionState: '',
      hd11Other: 'no',
      hd11OtherExplain: '',
      healthUrl_1: null,
      healthUrl_2: null,
      healthUrl_3: null,
      healthUrl_4: null,
      healthUrl_5: null,
      healthUrlCount: 0
    }
  })
  approvedDetails: object;
}

export class AuditorSubmitDetailsDto extends SubmitDetailsDto {
  @IsNumber()
  candidateId: number;
}

export class AuditorHealthDetails200Response {
  @ApiProperty({
    example: {
      hd1Heart: 'yes',
      hd1HeartState: 'Still on Follow up',
      hd2Neck: 'no',
      hd2NeckState: '',
      hd3High: 'yes',
      hd3HighState: 'Receiving treatment',
      hd4Arthritis: 'no',
      hd4ArthritisState: '',
      hd5Terminally: 'no',
      hd5TerminallyState: '',
      hd6Unusual: 'no',
      hd6UnusualState: '',
      hd7Asthma: 'yes',
      hd7AsthmaState: 'Fully recovered',
      hd8Fainting: 'no',
      hd8FaintingState: '',
      hd9Depression: 'no',
      hd9DepressionState: '',
      hd10Throat: 'no',
      hd10ThroatState: '',
      hd12Vision: 'no',
      hd12VisionState: '',
      hd11Other: 'no',
      hd11OtherExplain: '',
      hdPageStatus: 'approved',
      hdPageRejectReason: '',
      recordApproved: '',
      healthUrl_1:
        '/129856/health_declaration/1695354343381_____Medical Report.png',
      healthUrl_1Status: '',
      healthUrl_1RejectReason: '',
      healthUrl_2: '',
      healthUrl_2Status: '',
      healthUrl_2RejectReason: '',
      healthUrl_3: '',
      healthUrl_3Status: '',
      healthUrl_3RejectReason: '',
      healthUrl_4: '',
      healthUrl_4Status: '',
      healthUrl_4RejectReason: '',
      healthUrl_5: '',
      healthUrl_5Status: '',
      healthUrl_5RejectReason: '',
      healthUrlCount: 0
    }
  })
  details: object;

  @ApiProperty({
    example: {
      hd1Heart: 'yes',
      hd1HeartState: 'Still on Follow up',
      hd2Neck: 'no',
      hd2NeckState: '',
      hd3High: 'yes',
      hd3HighState: 'Receiving treatment',
      hd4Arthritis: 'no',
      hd4ArthritisState: '',
      hd5Terminally: 'no',
      hd5TerminallyState: '',
      hd6Unusual: 'no',
      hd6UnusualState: '',
      hd7Asthma: 'yes',
      hd7AsthmaState: 'Fully recovered',
      hd8Fainting: 'no',
      hd8FaintingState: '',
      hd9Depression: 'no',
      hd9DepressionState: '',
      hd10Throat: 'no',
      hd10ThroatState: '',
      hd12Vision: 'no',
      hd12VisionState: '',
      hd11Other: 'no',
      hd11OtherExplain: '',
      healthUrl_1: null,
      healthUrl_2: null,
      healthUrl_3: null,
      healthUrl_4: null,
      healthUrl_5: null,
      healthUrlCount: 0
    }
  })
  approvedDetails: object;
}

export class HealthDetails200Response {
  @ApiProperty({
    example: {
      hd1Heart: 'yes',
      hd1HeartState: 'Still on Follow up',
      hd2Neck: 'no',
      hd2NeckState: '',
      hd3High: 'yes',
      hd3HighState: 'Receiving treatment',
      hd4Arthritis: 'no',
      hd4ArthritisState: '',
      hd5Terminally: 'no',
      hd5TerminallyState: '',
      hd6Unusual: 'no',
      hd6UnusualState: '',
      hd7Asthma: 'yes',
      hd7AsthmaState: 'Fully recovered',
      hd8Fainting: 'no',
      hd8FaintingState: '',
      hd9Depression: 'no',
      hd9DepressionState: '',
      hd10Throat: 'no',
      hd10ThroatState: '',
      hd12Vision: 'no',
      hd12VisionState: '',
      hd11Other: 'no',
      hd11OtherExplain: null,
      hdPageStatus: 'approved',
      hdPageRejectReason: '',
      recordApproved: '',
      healthUrl_1:
        '/129856/health_declaration/1695354343381_____Medical Report.png',
      healthUrl_1Status: '',
      healthUrl_1RejectReason: '',
      healthUrl_2: '',
      healthUrl_2Status: '',
      healthUrl_2RejectReason: '',
      healthUrl_3: '',
      healthUrl_3Status: '',
      healthUrl_3RejectReason: '',
      healthUrl_4: '',
      healthUrl_4Status: '',
      healthUrl_4RejectReason: '',
      healthUrl_5: '',
      healthUrl_5Status: '',
      healthUrl_5RejectReason: '',
      healthUrlCount: 0
    }
  })
  data: object;
}
