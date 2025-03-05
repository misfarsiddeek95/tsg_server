import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkExperienceDto {
  @IsNotEmpty()
  jobTitle?: string;

  @IsNotEmpty()
  employerName?: string;

  @IsNotEmpty()
  employmentType?: string;

  @IsNotEmpty()
  currentlyEmployed?: string;

  @IsNotEmpty()
  startDate?: string;

  @IsNotEmpty()
  endDate?: string;

}
