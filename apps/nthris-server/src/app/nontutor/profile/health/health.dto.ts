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

export class HealthDataDto {
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
  hd1Heart: string;

  @IsOptional()
  @IsString()
  hd1HeartState: string;

  @IsOptional()
  @IsString()
  hd2Neck: string;

  @IsOptional()
  @IsString()
  hd2NeckState: string;

  @IsOptional()
  @IsString()
  hd3High: string;

  @IsOptional()
  @IsString()
  hd3HighState: string;

  @IsOptional()
  @IsString()
  hd4Arthritis: string;

  @IsOptional()
  @IsString()
  hd4ArthritisState: string;

  @IsOptional()
  @IsString()
  hd5Terminally: string;

  @IsOptional()
  @IsString()
  hd5TerminallyState: string;

  @IsOptional()
  @IsString()
  hd6Unusual: string;

  @IsOptional()
  @IsString()
  hd6UnusualState: string;

  @IsOptional()
  @IsString()
  hd7Asthma: string;

  @IsOptional()
  @IsString()
  hd7AsthmaState: string;

  @IsOptional()
  @IsString()
  hd8Fainting: string;

  @IsOptional()
  @IsString()
  hd8FaintingState: string;

  @IsOptional()
  @IsString()
  hd9Depression: string;

  @IsOptional()
  @IsString()
  hd9DepressionState: string;

  @IsOptional()
  @IsString()
  hd10Throat: string;

  @IsOptional()
  @IsString()
  hd10ThroatState: string;

  @IsOptional()
  @IsString()
  hd12Vision: string;

  @IsOptional()
  @IsString()
  hd12VisionState: string;

  @IsOptional()
  @IsString()
  hd11Other: string;

  @IsOptional()
  @IsString()
  hd11OtherExplain: string;

  @IsOptional()
  @IsString()
  hdPageStatus: string;

  @IsOptional()
  @IsString()
  hdPageRejectReason: string;

  @IsOptional()
  @IsString()
  recordApproved: string;

  @IsOptional()
  @IsString()
  healthUrl_1: string;

  @IsOptional()
  @IsString()
  healthUrl_1Status: string;

  @IsOptional()
  @IsString()
  healthUrl_1RejectReason: string;

  @IsOptional()
  @IsString()
  healthUrl_2: string;

  @IsOptional()
  @IsString()
  healthUrl_2Status: string;

  @IsOptional()
  @IsString()
  healthUrl_2RejectReason: string;

  @IsOptional()
  @IsString()
  healthUrl_3: string;

  @IsOptional()
  @IsString()
  healthUrl_3Status: string;

  @IsOptional()
  @IsString()
  healthUrl_3RejectReason: string;

  @IsOptional()
  @IsString()
  healthUrl_4: string;

  @IsOptional()
  @IsString()
  healthUrl_4Status: string;

  @IsOptional()
  @IsString()
  healthUrl_4RejectReason: string;

  @IsOptional()
  @IsString()
  healthUrl_5: string;

  @IsOptional()
  @IsString()
  healthUrl_5Status: string;

  @IsOptional()
  @IsString()
  healthUrl_5RejectReason: string;

  @IsOptional()
  @IsNumber()
  healthUrlCount: number;

  @IsOptional()
  @IsNumber()
  updatedBy: number;

  @IsOptional()
  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsNumber()
  auditedBy: number;

  @IsOptional()
  @IsString()
  auditedAt: string;
}

export class AuditorSubmitDetailsDto extends HealthDataDto {
  @IsNumber()
  nonTutorId: number;
}
