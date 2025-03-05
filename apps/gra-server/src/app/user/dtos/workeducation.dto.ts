import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkEducationDto {
  @IsNotEmpty()
  expTeaching?: string;

  @IsNotEmpty()
  expField?: string;

  @IsNotEmpty()
  expOnlineEdu?: string;

  @IsNotEmpty()
  expOrganization?: string;

  @IsNotEmpty()
  expTutor?: string;

  @IsNotEmpty()
  expRole?: string;

  @IsNotEmpty()
  expTutorDuration?: string;

}

// is_currently_employed
// current_emp_name
// current_emp_teaching
// current_emp_title
