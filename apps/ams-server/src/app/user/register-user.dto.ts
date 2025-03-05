import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
