import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExistsEmailDto {
  @ApiProperty({
    type: 'string',
    example: 'gishan@thirdspaceglobal.com'
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'Gishan'
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    type: 'string',
    example: 'IGHKFGYDG6858967476IGHIUFOYIGV678'
  })
  @IsOptional()
  @IsString()
  token?: string;
}

export class SendResetOtpDto {
  @ApiProperty({
    type: 'string',
    example: 'ibrahim+1@thirdspaceglobal.com'
  })
  @IsString()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    type: 'string',
    example: 'ibrahim+3@thirdspaceglobal.com'
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: 'string',
    example: '1234#abcd'
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    example: '357180'
  })
  @IsString()
  otp: string;
}

export class ExistsEmail400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [
      ['email must be a string', 'firstName must be a string'],
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

export class ExistsEmail201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['available', 'exists'],
    example: 'available'
  })
  status: string;

  @ApiProperty({
    type: 'string',
    examples: [
      'gishan@thirdspaceglobal.com is available and otp has send to gishan@thirdspaceglobal.com',
      'gishan+14@thirdspaceglobal.com is already exists'
    ],
    example:
      'gishan@thirdspaceglobal.com is available and otp has send to gishan@thirdspaceglobal.com'
  })
  message: string;
}

export class ResendOtp201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['otp has send to gishan14@thirdspaceglobal.com'],
    example: 'otp has send to gishan14@thirdspaceglobal.com'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    examples: ['exists'],
    example: 'exists'
  })
  status: string;
}

export class ResendOtp400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [
      ['email must be a string', 'firstName must be a string'],
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

export class Login201Dto {
  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlicmFoaW0rMUB0aGlyZHNwYWNlZ2xvYmFsLmNvbSIsInN1YiI6MywiaWF0IjoxNjY3MzgzNjIwLCJleHAiOjE2Njc0NDM2MjB9.LhY7ha32z56sBCxd_6q-7VdvP7F4GZvV-YjMdOjzKx0'
  })
  access_token: string;
}

export class Login401Dto {
  @ApiProperty({
    type: 'number',
    example: 401
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unauthorized'
  })
  messages: string;
}

export class Login400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    examples: [
      ['Unexpected token } in JSON at position 62'],
      'Unexpected token : in JSON at position 50'
    ],
    example: 'Unexpected token } in JSON at position 62'
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class ResetPassword201Dto {
  @ApiProperty({
    type: 'boolean',
    examples: ['true', 'false'],
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['no matching otp', 'your password has been reset'],
    example: 'your password has been reset'
  })
  message: string;
}
export class ResetPassword400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  success: number;

  @ApiProperty({
    type: 'string',
    examples: [
      'Unexpected token : in JSON at position 26',
      'email must be a string'
    ],
    example: 'Unexpected token : in JSON at position 26'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  error: string;
}

export class SendResetOtp201Dto {
  @ApiProperty({
    type: 'boolean',
    examples: ['true, false'],
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: [
      'otp has send to ibrahim+1@thirdspaceglobal.com',
      'Invalid Email'
    ],
    example: 'otp has send to ibrahim+1@thirdspaceglobal.com'
  })
  message: string;
}

export class SendResetOtp400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    examples: [
      'email must be a string',
      'Unexpected token } in JSON at position 14'
    ],
    example: 'email must be a string'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  error: string;
}

export class ValidateOtpDto {
  @ApiProperty({
    type: 'string',
    example: 'ibrahim+3@thirdspaceglobal.com'
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: 'string',
    example: '123456'
  })
  @IsString()
  otp: string;
}

export class ChangePassword200Dto {
  @ApiProperty({
    type: 'boolean',
    example: 'true'
  })
  @IsBoolean()
  success: boolean;
}

export class ChangePassword400Dto {
  @ApiProperty({
    type: 'boolean',
    example: 'true'
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: 'New Password is not matching with conform field'
  })
  @IsString()
  error: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    type: 'string',
    example: 'pass@123A'
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    type: 'string',
    example: 'newpass@123A'
  })
  @IsString()
  newPassword: string;

  @ApiProperty({
    type: 'string',
    example: 'newpass@123a'
  })
  @IsString()
  confirmNewPassword: string;
}
