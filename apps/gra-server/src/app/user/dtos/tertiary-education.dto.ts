import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTertiaryEducationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  // @ArrayMaxSize(2)
  @Type(() => TertiaryEducation)
  educations: TertiaryEducation[];
}

class TertiaryEducation {
  @IsNotEmpty()
  hqCourseType?: string;

  @ValidateIf((o) => o.hqCourseType !== 'Not Applicable')
  @IsNotEmpty()
  hqMainInst?: string;

  @ValidateIf((o) => o.hqCourseType !== 'Not Applicable')
  @IsNotEmpty()
  hqFieldStudy?: string;

  @ValidateIf((o) => o.hqCourseType !== 'Not Applicable')
  @IsDateString()
  @IsNotEmpty()
  hqStartDate?: Date;

  @ValidateIf((o) => o.hqCourseType !== 'Not Applicable')
  @IsDateString()
  @IsNotEmpty()
  hqCompletionDate?: Date;

  @Allow()
  hasMathStat?: boolean | null;
}
