import {
  IsString,
  IsUUID,
  IsNumber,
  IsEmail,
  IsMilitaryTime,
  Length
} from 'class-validator';

export class USSessionDto {
  @IsUUID()
  @IsString()
  sessionID: string;

  @IsString()
  status: string;

  @IsNumber()
  sessionscheduleddate: number;

  @IsString()
  @IsMilitaryTime()
  sessionscheduledtime: string;

  @IsNumber()
  length: number;

  @IsString()
  @Length(5, 5)
  tutoruserID: string;

  @IsString()
  tutorname: string;

  @IsEmail()
  tutoremail: string;
}
