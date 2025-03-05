import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsNotEmpty
} from 'class-validator';

export class FetchPersonalContactInfoDto {}
export class SubmitPersonalContactInfoDto {}
export class PersonalContactInfo200Response {}

export class FetchGraSessionAvailabilityDto {}
export class SubmitSessionAvailabilityDto {}
export class SessionAvailability200Response {}

export class FetchEducationalQualificationDto {}
export class SubmitEducationalQualificationDto {}
export class EducationalQualification200Response {}

export class TutorSubmitApplication200Dto {}
export class AllRemainingFieldsApplication200Dto {}