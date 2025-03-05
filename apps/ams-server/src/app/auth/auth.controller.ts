import {
  Controller,
  Post,
  Body,
  HttpException,
  UseGuards,
  Req,
  Request,
  Get
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './dtos/login';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';

import {
  ChangePassword200Dto,
  ChangePassword400Dto,
  ChangePasswordDto,
  ExistsEmail201Dto,
  ExistsEmail400Dto,
  ExistsEmailDto,
  Login201Dto,
  Login400Dto,
  Login401Dto,
  ResendOtp201Dto,
  ResendOtp400Dto,
  ResetPassword201Dto,
  ResetPassword400Dto,
  ResetPasswordDto,
  SendResetOtp201Dto,
  SendResetOtp400Dto,
  SendResetOtpDto,
  ValidateOtpDto
} from './dtos/auth.dto';

import {
  CandidateSignUpDto,
  Register201Dto,
  Register400Dto,
  RegisterUserDto,
  WebsiteRegister201Dto,
  WebsiteRegister400Dto,
  WebsiteRegisterUserDto
} from './dtos/register-user.dto';

import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private prisma: PrismaService
  ) {}

  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'login ' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'ibrahim+1@thirdspaceglobal.com',
          description: 'User email'
        },
        password: {
          type: 'string',
          example: 'vYVyNIdCzL',
          description: 'password'
        }
      }
    }
  })
  @Post('login')
  async login(@Body() login: Login) {
    return await this.authService.login(login);
  }

  @Post('exists-email')
  @ApiOperation({ summary: 'Check Exists Emails' })
  @ApiResponse({
    status: 201,
    description: 'Email Exists or Available',
    type: ExistsEmail201Dto
  })
  @ApiResponse({
    status: 400,
    type: ExistsEmail400Dto
  })
  async existsEmail(@Body() { email, firstName }: ExistsEmailDto) {
    const exists = await this.authService.isEmailExists(email);

    if (exists) {
      return {
        success: true,
        message: `${email} is already exists`,
        status: 'exists'
      };
    } else {
      const otp = await this.authService.addOtp(email);
      console.log(otp);
      await this.mailService.sendOTPEmail(email, otp, firstName);

      return {
        success: true,
        message: `${email} is available, OTP has been sent to the email`,
        status: 'available'
      };
    }
  }

  @Post('registration-exists-email')
  @ApiOperation({ summary: 'Check Exists Emails' })
  @ApiResponse({
    status: 201,
    description: 'Email Exists or Available',
    type: ExistsEmail201Dto
  })
  @ApiResponse({
    status: 400,
    type: ExistsEmail400Dto
  })
  async existsEmailRegistration(
    @Body() { email, firstName, token }: ExistsEmailDto
  ) {
    try {
      const isHuman = await this.authService.validateReCaptchaToken(token);
      if (!isHuman) {
        return {
          success: true,
          message: `invalid recaptcha`,
          status: 'invalid-recaptcha'
        };
      }

      const exists = await this.authService.isEmailExists(email);

      if (exists) {
        return {
          success: true,
          message: `${email} is already exists`,
          status: 'exists'
        };
      }

      // const { attempts } = await this.authService.checkOtpAttempts(email);

      // if (attempts < 10) {
      const otp = await this.authService.addOtp(email);
      console.log(otp);
      const otpSent = await this.mailService.sendOTPEmail(
        email,
        otp,
        firstName
      );

      if (otpSent) {
        return {
          success: true,
          message: `${email} is available, OTP has been sent to the email`,
          status: 'available'
        };
      } else {
        return {
          success: true,
          message: `${email} is available, OTP not sent`,
          status: 'sent otp'
        };
      }
      // } else {
      //   return {
      //     success: false,
      //     message: `number of otp request emails for ${email} is exceeded`,
      //     status: 'otp-email-attempts-exceeded'
      //   };
      // }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('send-reset-otp')
  @ApiOperation({ summary: 'Reset OTP' })
  @ApiResponse({
    status: 201,
    type: SendResetOtp201Dto
  })
  @ApiResponse({
    status: 400,
    type: SendResetOtp400Dto
  })
  async sendResetOTP(@Body() { email }: SendResetOtpDto) {
    try {
      const exists = await this.authService.isEmailExists(email);

      if (!exists) throw new Error('Invalid Email');

      const otp = await this.authService.addOtp(email);
      console.log(otp);

      const name = await this.prisma.user.findUnique({
        where: {
          username: email
        },
        include: {
          approved_personal_data: {
            select: {
              firstName: true
            }
          },
          user_hris_progress: {
            select: {
              profileStatus: true
            }
          }
        }
      });
      if (name.level < 1) {
        throw new Error('User account is permenetly deactivated');
      }
      // updated logic: pw reset disabled for new accounts yet to be hris enabled.
      if (
        name.tsp_id > 135300 &&
        name.level == 2 &&
        !name.user_hris_progress?.profileStatus
      ) {
        throw new Error(
          'New candidates will be provided with login credentials within 48 hours following the Phone Interview'
        );
      }
      let first_name =
        name &&
        name.approved_personal_data &&
        name.approved_personal_data.firstName
          ? name.approved_personal_data.firstName
          : '';

      if (first_name === '') {
        // if no entry is found in approved_personal_data check in non_tutor_directory
        const name2 = await this.prisma.nonTutorDirectory.findUnique({
          where: {
            hr_tsp_id: name.tsp_id
          },
          select: {
            short_name: true
          }
        });
        first_name =
          name2 && name2.short_name
            ? name2.short_name.split(' ')[0]
            : first_name;
      }

      await this.mailService.sendPasswrodResetOTPEmail(email, otp, first_name);

      return {
        success: true,
        message: `otp has send to ${email}`
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({
    status: 201,
    type: ResetPassword201Dto
  })
  @ApiResponse({
    status: 400,
    type: ResetPassword400Dto
  })
  async resetPassword(@Body() { email, password, otp }: ResetPasswordDto) {
    return this.authService.resetPassword(email, password, otp);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    type: Register201Dto
  })
  @ApiResponse({
    status: 400,
    type: Register400Dto
  })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const isOtpValid = await this.authService.validateOtp(
      registerUserDto.email,
      registerUserDto.otp
    );

    if (!isOtpValid) {
      return {
        success: false,
        message: 'Invalid OTP',
        status: 'wrong otp'
      };
    }
    return this.authService.register(registerUserDto);
  }

  //Old Version
  // @Post('website-register')
  // @ApiOperation({ summary: 'Register User' })
  // @ApiResponse({
  //   status: 201,
  //   type: WebsiteRegister201Dto
  // })
  // @ApiResponse({
  //   status: 400,
  //   type: WebsiteRegister400Dto
  // })
  // async websiteRegister(@Body() registerUserDto: WebsiteRegisterUserDto) {
  //   const isOtpValid = await this.authService.validateOtp(
  //     registerUserDto.email,
  //     registerUserDto.otp
  //   );

  //   if (!isOtpValid) {
  //     return {
  //       success: false,
  //       message: 'Invalid OTP',
  //       status: 'wrong otp'
  //     };
  //   }
  //   return this.authService.websiteRegister(registerUserDto);
  // }

  //New Version
  @Post('website-register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    type: WebsiteRegister201Dto
  })
  @ApiResponse({
    status: 400,
    type: WebsiteRegister400Dto
  })
  async websiteRegister(@Body() candidateDetails: CandidateSignUpDto) {
    const isOtpValid = await this.authService.validateOtp(
      candidateDetails.email,
      candidateDetails.otp
    );

    // const isAttemptsExceededCheck = await this.authService.isAttemptsExceeded(
    //   candidateDetails.email,
    //   2
    // );

    // if (isAttemptsExceededCheck) {
    //   return {
    //     success: false,
    //     message:
    //       'You have reached the maximum number of OTP verification attempts',
    //     status: 'disabled otp verification'
    //   };
    // }

    if (!isOtpValid) {
      return {
        success: false,
        message: 'Invalid OTP',
        status: 'wrong otp'
      };
    }
    return this.authService.webSiteSignupCandidates(candidateDetails);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP' })
  @ApiResponse({
    status: 201,
    type: Register201Dto
  })
  @ApiResponse({
    status: 400,
    type: Register400Dto
  })
  async validateOtp(@Body() { email, otp }: ValidateOtpDto) {
    const isOtpValid = await this.authService.validateOtp(email, otp);

    if (!isOtpValid) {
      throw new HttpException(
        {
          success: false,
          message: 'Invalid OTP',
          status: 'wrong otp'
        },
        400
      );
    }
    return { success: true };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/user-details')
  @ApiOperation({
    summary: 'Get User Details'
  })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Response when user found',
  //   type: UserDetailsResponseDto
  // })
  // @ApiResponse({
  //   status: 401,
  //   type: Unauthorized401Dto
  // })
  getUserDetails(@Request() req: any) {
    return this.authService.getUserDetails(req.user);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Re-Send OTP' })
  @ApiResponse({
    status: 201,
    type: ResendOtp201Dto
  })
  @ApiResponse({
    status: 400,
    type: ResendOtp400Dto
  })
  async sendOTP(@Body() { email, firstName }: ExistsEmailDto) {
    try {
      const exists = await this.authService.isEmailExists(email);

      if (exists) return { success: false, error: 'Invalid Email' };

      const otp = await this.authService.addOtp(email);

      const valid = await this.mailService.sendOTPEmail(email, otp, firstName);

      if (valid) {
        return {
          success: true,
          message: `otp has send to ${email}`,
          status: 'exists'
        };
      } else {
        return {
          success: true,
          message: `${email} is available`,
          status: 'sent otp'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('registration-resend-otp')
  @ApiOperation({ summary: 'Re-Send OTP' })
  @ApiResponse({
    status: 201,
    type: ResendOtp201Dto
  })
  @ApiResponse({
    status: 400,
    type: ResendOtp400Dto
  })
  async sendOTPRegistration(
    @Body() { email, firstName, token }: ExistsEmailDto
  ) {
    try {
      const isHuman = await this.authService.validateReCaptchaToken(token);
      if (!isHuman) {
        return {
          success: true,
          message: `invalid recaptcha`,
          status: 'invalid-recaptcha'
        };
      }

      const exists = await this.authService.isEmailExists(email);

      if (exists) {
        return {
          success: true,
          message: `${email} is already exists`,
          status: 'exists'
        };
      }

      // const { attempts } = await this.authService.checkOtpAttempts(email);

      // if (attempts <= 10) {
      const otp = await this.authService.addOtp(email);
      console.log(otp);
      const otpSent = await this.mailService.sendOTPEmail(
        email,
        otp,
        firstName
      );

      if (otpSent) {
        return {
          success: true,
          message: `${email} is available, OTP has been sent to the email`,
          status: 'available'
        };
      } else {
        return {
          success: true,
          message: `${email} is available, OTP not sent`,
          status: 'sent otp'
        };
      }
      // } else {
      //   return {
      //     success: false,
      //     message: `number of otp request emails for ${email} is exceeded`,
      //     status: 'otp-email-attempts-exceeded'
      //   };
      // }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({
    status: 200,
    type: ChangePassword200Dto
  })
  @ApiResponse({
    status: 400,
    type: ChangePassword400Dto
  })
  async changePassword(
    @Body()
    changePasswordData: ChangePasswordDto,
    @Request() req: any
  ) {
    return this.authService.changePassword(changePasswordData, req.user.userId);
  }
}
