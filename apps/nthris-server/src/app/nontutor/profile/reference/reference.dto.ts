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

export class ReferenceDataDto {
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
  refereeTitle1: string;

  @IsOptional()
  @IsString()
  refereeFirstName1: string;

  @IsOptional()
  @IsString()
  refereeLastName1: string;

  @IsOptional()
  @IsString()
  refereeRelationship1: string;

  @IsOptional()
  @IsString()
  refereeEmail1: string;

  @IsOptional()
  @IsString()
  refereeTelephoneNumber1: string;

  @IsOptional()
  @IsString()
  refereeConfirmation1: string;

  @IsOptional()
  @IsString()
  refereeTitle2: string;

  @IsOptional()
  @IsString()
  refereeFirstName2: string;

  @IsOptional()
  @IsString()
  refereeLastName2: string;

  @IsOptional()
  @IsString()
  refereeRelationship2: string;

  @IsOptional()
  @IsString()
  refereeEmail2: string;

  @IsOptional()
  @IsString()
  refereeTelephoneNumber2: string;

  @IsOptional()
  @IsString()
  refereeConfirmation2: string;

  @IsOptional()
  @IsString()
  acknowledgement1: string;

  @IsOptional()
  @IsString()
  acknowledgement2: string;

  @IsOptional()
  @IsString()
  referee1Status: string;

  @IsOptional()
  @IsString()
  referee1RejectReason: string;

  @IsOptional()
  @IsString()
  referee2Status: string;

  @IsOptional()
  @IsString()
  referee2RejectReason: string;

  @IsOptional()
  @IsString()
  confirmation: string;
}

export class AuditorSubmitReferenceDetailsDto extends ReferenceDataDto {
  @IsNumber()
  nonTutorId: number;
}
