import { IsOptional, IsString } from 'class-validator';

export class CandidateMasterDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  skip: string;

  @IsOptional()
  @IsString()
  take: string;

  @IsOptional()
  @IsString()
  export2Csv: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  auditStatus: string;

  @IsOptional()
  @IsString()
  auditorId: string;

  @IsOptional()
  @IsString()
  tspId: string;

  @IsOptional()
  @IsString()
  profileStatus: string;
}
