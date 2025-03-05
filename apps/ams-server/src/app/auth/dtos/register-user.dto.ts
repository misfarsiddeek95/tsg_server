import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    type: 'string',
    example: 'gishan@thirdspaceglobal.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'gishan'
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Abesinga'
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    type: 'string',
    example: '12/10/2022'
  })
  @IsNotEmpty()
  dob: Date;

  // @ApiProperty({
  //   type: 'string',
  //   example: 'gishan@thirdspaceglobal.com'
  // })
  // @IsNotEmpty()
  // @IsString()
  // contact: string;

  @ApiProperty({
    type: 'string',
    example: '023546'
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class Register201Dto {
  @ApiProperty({
    type: 'boolean',
    examples: ['true,fales'],
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: [
      'Invalid OTP',
      [
        'email:gishan@thirdspaceglobal.com,firstNamegishan,lastName:Abesinga,dob:12/10/1990,contact:gishan@thirdspaceglobal.com'
      ]
    ],
    example: 'user registered and send welcome email'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlicmFoaW0rM0B0aGlyZHNwYWNlZ2xvYmFsLmNvbSIsInN1YiI6NCwiaWF0IjoxNjY3NDQ4NzI0LCJleHAiOjE2Njc1MDg3MjR9.Gh-n0M1hff30dD_Z7Y7Ytdr6XuzuxcPdauCvO9ugGnI'
  })
  accessToken: string;
}

export class Register400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [
      [
        'email must be an email',
        'firstName must be a string',
        'firstName should not be empty',
        'lastName must be a string',
        'lastName should not be empty',
        'dob should not be empty',
        'contact must be a string',
        'contact should not be empty',
        'otp must be a string',
        'otp should not be empty'
      ],
      'Unexpected token : in JSON at position 69'
    ],
    example: ['email must be a string', 'firstName must be a string']
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class CandidateSignUpDto {
  @ApiProperty({
    type: 'string',
    example: 'gishan@thirdspaceglobal.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'gishan'
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Abesinga'
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  // @ApiProperty({
  //   type: 'string',
  //   example: '+94123123123'
  // })
  // @IsNotEmpty()
  // @IsString()
  // contact: string;

  @ApiProperty({
    type: 'string',
    example: '023546'
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  @IsNotEmpty()
  @IsString()
  residence: string;

  @ApiProperty({
    type: 'string',
    example: 'Yes'
  })
  @IsNotEmpty()
  @IsString()
  ageCheck: string;

  @ApiProperty({
    type: 'string',
    example: 'Referrals'
  })
  @IsNotEmpty()
  @IsString()
  knewAboutUs: string;
}

export class WebsiteRegisterUserDto {
  @ApiProperty({
    type: 'string',
    example: 'gishan@thirdspaceglobal.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'gishan'
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Abesinga'
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    type: 'string',
    example: '12/10/2022'
  })
  @IsNotEmpty()
  dob: Date;

  @ApiProperty({
    type: 'string',
    example: 'gishan@thirdspaceglobal.com'
  })
  @IsNotEmpty()
  @IsString()
  contact: string;

  @ApiProperty({
    type: 'string',
    example: '023546'
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    type: 'string',
    example: 'Sri Lanka'
  })
  @IsNotEmpty()
  @IsString()
  residence: string;

  @ApiProperty({
    type: 'string',
    example: 'Italy'
  })
  @IsString()
  otherCountry: string;
}

export class WebsiteRegister201Dto {
  @ApiProperty({
    type: 'boolean',
    examples: ['true,fales'],
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['Wrong OTP', 'Pass', 'Fail'],
    example: 'Pass'
  })
  status: string;
}

export class WebsiteRegister400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [
      [
        'email must be an email',
        'firstName must be a string',
        'firstName should not be empty',
        'lastName must be a string',
        'lastName should not be empty',
        'dob should not be empty',
        'contact must be a string',
        'contact should not be empty',
        'otp must be a string',
        'otp should not be empty'
      ],
      'Unexpected token : in JSON at position 69'
    ],
    example: ['email must be a string', 'firstName must be a string']
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}
