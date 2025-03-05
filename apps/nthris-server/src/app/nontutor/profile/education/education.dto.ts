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

export class EducationDataDto {
  @ApiProperty({
    type: 'string',
    example: 'London'
  })
  @IsOptional()
  @IsString()
  olSyllabus: string;

  @ApiProperty({
    type: 'string',
    example: '2010'
  })
  @IsOptional()
  @IsString()
  olYear: string;

  @ApiProperty({
    type: 'string',
    example: '27/education_details_nthris/1699598430454_____certificate.jpg'
  })
  @IsOptional()
  @IsString()
  olCertificateUrl: string;

  @ApiProperty({
    type: 'string',
    example: 'yes'
  })
  @IsOptional()
  @IsString()
  alCheck: string;

  @ApiProperty({
    type: 'string',
    example: 'London'
  })
  @IsOptional()
  @IsString()
  alSyllabus: string;

  @ApiProperty({
    type: 'string',
    example: '2022'
  })
  @IsOptional()
  @IsString()
  alYear: string;

  @ApiProperty({
    type: 'string',
    example: 'Bio'
  })
  @IsOptional()
  @IsString()
  alStream: string;

  @ApiProperty({
    type: 'string',
    example: '27/education_details_nthris/1699598430454_____certificate.jpg'
  })
  @IsOptional()
  @IsString()
  alCertificateUrl: string;

  @ApiProperty({
    type: 'string',
    example: 'Invalid'
  })
  @IsOptional()
  @IsString()
  olSyllabusRejectReason: string;

  @ApiProperty({
    type: 'string',
    example: 'Approved'
  })
  @IsOptional()
  @IsString()
  olSyllabusStatus: string;

  @ApiProperty({
    type: 'string',
    example: 'Invalid'
  })
  @IsOptional()
  @IsString()
  olYearRejectReason: string;

  @ApiProperty({
    type: 'string',
    example: 'Approved'
  })
  @IsOptional()
  @IsString()
  olYearStatus: string;

  @ApiProperty({
    type: 'string',
    example: 'Invalid'
  })
  @IsOptional()
  @IsString()
  olCertificateUrlRejectReason: string;

  @ApiProperty({
    type: 'string',
    example: 'Pending'
  })
  @IsOptional()
  @IsString()
  olCertificateUrlStatus: string;

  @ApiProperty({
    type: 'nstring',
    example: 'Invalid'
  })
  @IsOptional()
  @IsString()
  alSyllabusRejectReason: string;

  @ApiProperty({
    type: 'nstring',
    example: 'Approved'
  })
  @IsOptional()
  @IsString()
  alSyllabusStatus: string;

  @ApiProperty({
    type: 'string',
    example: 'Invalid'
  })
  @IsOptional()
  @IsString()
  alYearRejectReason: string;

  @ApiProperty({
    type: 'string',
    example: 'Approved'
  })
  @IsOptional()
  @IsString()
  alYearStatus: string;

  @ApiProperty({
    type: 'string',
    example: 'Invalid'
  })
  @IsOptional()
  @IsString()
  alStreamRejectReason: string;

  @ApiProperty({
    type: 'string',
    example: 'Approved'
  })
  @IsOptional()
  @IsString()
  alStreamStatus: string;

  @ApiProperty({
    type: 'string',
    example: 'Invalid'
  })
  @IsOptional()
  @IsString()
  alCertificateUrlRejectReason: string;

  @ApiProperty({
    type: 'string',
    example: 'Approved'
  })
  @IsOptional()
  @IsString()
  alCertificateUrlStatus: string;

  @IsArray()
  @ValidateNested()
  @Type(() => XotherEducationData)
  xother_education_data: XotherEducationData[];
}

class XotherEducationData {
  @IsOptional()
  @IsNumber()
  eId: number;

  @IsOptional()
  @IsString()
  alSubject: string;

  @IsOptional()
  @IsString()
  alSubjectStatus: string;

  @IsOptional()
  @IsString()
  alSubjectRejectReason: string;

  @IsOptional()
  @IsString()
  alSubjectResult: string;

  @IsOptional()
  @IsString()
  alSubjectResultStatus: string;

  @IsOptional()
  @IsString()
  alSubjectResultRejectReason: string;
}

export class AuditorSubmitDetailsDto extends EducationDataDto {
  @IsNumber()
  nonTutorId: number;
}
