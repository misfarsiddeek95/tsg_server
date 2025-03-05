import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class UserDetailsDto {
  @ApiProperty({
    type: 'string',
    example: 'undergraduate'
  })
  @IsNotEmpty()
  aboutUs: string;

  @ApiProperty({
    type: 'string',
    example: '02145682'
  })
  @IsNotEmpty()
  bankAccount: string;

  @ApiProperty({
    type: 'string',
    example: 'Polonnaruwa',
    required: false
  })
  district: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  @IsNotEmpty()
  nationality: string;

  @ApiProperty({
    type: 'string',
    example: 'No',
    required: false
  })
  otherCountry: string;

  @ApiProperty({
    type: 'string',
    example: 'No'
  })
  otherNationality: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  @IsNotEmpty()
  residence: string;

  @ApiProperty({
    type: 'string',
    examples: ['NIC', 'Adhaar Card', 'Passport'],
    example: 'NIC',
    required: false
  })
  documentsList: string;

  // this can be nic, adhaar card or passport
  @ApiProperty({
    type: 'string',
    example: '971963520v',
    required: false
  })
  nic: string;

  @ApiProperty({
    type: 'string',
    example: 'North Central',
    required: false
  })
  state: string;

  @ApiProperty({
    type: 'string',
    example: 'Kaduruwela',
    required: false
  })
  city: string;

  @ApiProperty({
    type: 'string',
    example: 'Submited'
  })
  @IsNotEmpty()
  submitStatus: string;

  @ApiProperty({
    type: 'string',
    example: 'part-time'
  })
  @IsNotEmpty()
  working: string;

  @ApiProperty({
    type: 'string',
    example: '10/12/2021',
    required: false
  })
  date?: string;
}

export class PostUserDetails201Dto {
  @ApiProperty({
    type: 'boolean',
    examples: ['true', 'false'],
    example: 'true'
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: 'undergraduate'
  })
  aboutUs: string;

  @ApiProperty({
    type: 'string',
    example: '02145682'
  })
  bankAccount: string;

  @ApiProperty({
    type: 'string',
    example: 'Polonnaruwa'
  })
  district: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  nationality: string;

  @ApiProperty({
    type: 'string',
    example: 'No'
  })
  otherCountry: string;

  @ApiProperty({
    type: 'string',
    example: 'No'
  })
  otherNationality: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  residence: string;

  @ApiProperty({
    type: 'string',
    examples: ['NIC', 'Adhaar Card', 'Passport'],
    example: 'NIC'
  })
  documentsList: string;

  @ApiProperty({
    type: 'string',
    example: '971963520v'
  })
  nic: string;

  @ApiProperty({
    type: 'string',
    example: 'North Central'
  })
  state: string;

  @ApiProperty({
    type: 'string',
    example: 'Kaduruwela'
  })
  city: string;

  @ApiProperty({
    type: 'string',
    example: 'Submited'
  })
  submitStatus: string;

  @ApiProperty({
    type: 'string',
    examples: ['part-time', 'full-time'],
    example: 'full-time'
  })
  working: string;

  @ApiProperty({
    type: 'string',
    example: '10/12/2021'
  })
  date: string;
}

export class PostUserDetails400Dto {
  @ApiProperty({
    type: 'number',
    example: '400'
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    examples: [
      'aboutUs should not be empty',
      'nationality should not be empty'
    ],
    example: 'aboutUs should not be empty'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  error: string;
}

export interface Access {
  access: number;
  access_type: string;
  module: string;
}

export interface JourneyStatus {
  1: string | null;
  2?: string | null;
  3?: string | null;
  4?: string | null;
  5?: string | null;
  6?: string | null;
  7?: string | null;
  8?: string | null;
}

export class UserDetailsResponseData {
  @ApiProperty()
  residing_country: string;

  @ApiProperty()
  residing_district: string;

  @ApiProperty()
  mobile_number: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  shortName: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  nationality: string;

  @ApiProperty()
  whichPartner: string;

  @ApiProperty()
  knewAboutUs: string;

  @ApiProperty()
  bankStatus: string;

  @ApiProperty()
  progress: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  access: Access[];

  @ApiProperty()
  journey: number;

  @ApiProperty()
  journeyStatus: JourneyStatus;

  @ApiProperty()
  permission_list: number[];

  @ApiProperty()
  permission_role_groups: number[];
}

export class UserDetailsResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      residing_country: 'Sri Lanka',
      residing_district: 'Polonnaruwa',
      mobile_number: '0765409751',
      first_name: 'gishan',
      surname: 'gishan',
      shortName: 'g g',
      dob: '2022-10-31T10:21:02.778Z',
      nationality: 'Sri Lankan',
      whichPartner: 'gishan',
      knewAboutUs: 'good',
      bankStatus: 'gishan',
      progress: 0,
      email: 'gishan@gmail.com',
      userId: 0,
      level: 0
    }
  })
  data: UserDetailsResponseData;
}

export class UpdateUserDetailsDto {
  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: 'string',
    example: 'Ibrahim'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Abdalla'
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: 'string',
    example: '0765408785'
  })
  @IsString()
  contactNumber: string;

  @ApiProperty() //
  @IsNotEmpty()
  // aboutUs: string;
  @ApiProperty({
    type: 'string',
    example: '00847562'
  })
  @IsNotEmpty()
  bankAccount: string;

  @ApiProperty({
    type: 'string',
    example: 'polonnaruwa',
    required: false
  })
  district: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  @IsNotEmpty()
  nationality: string;

  @ApiProperty({
    type: 'string',
    example: '2022-10-31T10:21:02.778Z'
  })
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    type: 'string',
    example: 'no',
    required: false
  })
  otherCountry: string;

  @ApiProperty({
    type: 'string',
    example: 'no',
    required: false
  })
  otherNationality: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  @IsNotEmpty()
  residence: string;

  @ApiProperty({
    type: 'string',
    example: 'north central',
    required: false
  })
  state: string;

  @ApiProperty({
    type: 'string',
    example: 'kaduruwela',
    required: false
  })
  city: string;

  @ApiProperty() //
  @IsNotEmpty()
  // submitStatus: string;
  @ApiProperty({
    type: 'string',
    example: 'full-time'
  })
  @IsNotEmpty()
  working: string;

  @ApiProperty({
    type: 'string',
    example: '2022-10-31T10:21:02.778Z',
    required: false
  })
  date?: string;

  @ApiProperty({
    type: 'string',
    example: 'Facebook'
  })
  @IsString()
  @IsOptional()
  knewAboutUs: string;

  @ApiProperty({
    type: 'string',
    example: 'Notional Identity Card, Passport'
  })
  @IsString()
  @IsOptional()
  documentsList: string;
}

export class AdminUserDetails201Dto {
  @ApiProperty({
    type: 'boolean',
    examples: ['true', 'false'],
    example: 'true'
  })
  success: boolean;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  usreId: number;

  @ApiProperty({
    type: 'string',
    example: 'Ibrahim'
  })
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Abdalla'
  })
  lastName: string;

  @ApiProperty({
    type: 'string',
    example: '0765408785'
  })
  contactNumber: string;
  @ApiProperty({
    type: 'string',
    example: '00847562'
  })
  bankAccount: string;

  @ApiProperty({
    type: 'string',
    example: 'polonnaruwa'
  })
  district: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  nationality: string;

  @ApiProperty({
    type: 'string',
    example: '2022-10-31T10:21:02.778Z'
  })
  birthDate: string;

  @ApiProperty({
    type: 'string',
    example: 'no'
  })
  otherCountry: string;

  @ApiProperty({
    type: 'string',
    example: 'no'
  })
  otherNationality: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  residence: string;

  @ApiProperty({
    type: 'string',
    example: 'north central'
  })
  state: string;

  @ApiProperty({
    type: 'string',
    example: 'kaduruwela'
  })
  city: string;

  @ApiProperty({
    type: 'string',
    example: 'full-time'
  })
  working: string;

  @ApiProperty({
    type: 'string',
    example: '2022-10-31T10:21:02.778Z'
  })
  date?: string;
}

export class AdminUserDetails400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  success: number;

  @ApiProperty({
    type: 'string',
    examples: [
      'bankAccount should not be empty',
      'nationality should not be empty',
      'birthDate must be a valid ISO 8601 date string',
      'residence should not be empty'
    ],
    example: '"residence should not be empty"'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  error: string;
}

export class CheckNic200Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: '97856428v is available'
  })
  message: string;
}

export class CandidateNamesinBookingAll201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Abdalla'
  })
  candidate_name: string;

  @ApiProperty({
    type: 'string',
    example: '02'
  })
  candidate_id: string;

  @ApiProperty({
    type: 'string',
    example: 'ibrahim@gmail.com'
  })
  candidate_email: string;
}

export class InterviewerNamesInBookingStatusTableBookedResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        interviewer_name: 'Interviewer Acc - 1',
        interviewer_id: 1,
        interviewer_email: 'interviewer@tsg.com'
      },
      {
        interviewer_name: 'InterviewerNine Acc - 36',
        interviewer_id: 36,
        interviewer_email: 'interviewer9@tsg.com'
      }
    ]
  })
  data: object;
}

export class InterviewerNamesInBookingStatusTableBookedRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2024-04-25'
  })
  date: string;
}

export class CandidateNamesInBookingStatusTableBookedResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        candidate_name: 'Tutor ACChjddm - 57',
        candidate_id: 57,
        candidate_email: 'tutor+4_0006@tsg.com'
      },
      {
        candidate_name: 'Tutor ACCucemo - 59',
        candidate_id: 59,
        candidate_email: 'tutor+4_0008@tsg.com'
      }
    ]
  })
  data: object;
}

export class CandidateNamesInBookingStatusTableBookedRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2024-04-19'
  })
  date: string;
}
