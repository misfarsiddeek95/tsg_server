import {
  Body,
  Request,
  Controller,
  Post,
  UseGuards,
  Get
} from '@nestjs/common';
import { MailService } from './../mail/mail.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {
  Register201Dto,
  Register400Dto,
  RegisterUserDto
} from './register-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
  SendResetOtpDto
} from './auth.dto';
import { PrismaService } from '../prisma.service';

@ApiTags('GRA Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private prisma: PrismaService
  ) {}

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
      await this.mailService.sendOTPEmail(email, otp, firstName);

      return {
        success: true,
        message: `${email} is available and otp has send to ${email}`,
        status: 'available'
      };
    }
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

  // NOT IN USE!
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
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
  @ApiResponse({
    status: 201,
    type: Login201Dto
  })
  @ApiResponse({
    status: 401,
    type: Login401Dto
  })
  @ApiResponse({
    status: 400,
    type: Login400Dto
  })
  async login(@Request() req, @Body() { ipAdr }) {
    return this.authService.login(req.user, ipAdr);
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

      if (!exists) return { success: false, error: 'Invalid Email' };

      const otp = await this.authService.addOtp(email);

      const name = await this.prisma.user.findUnique({
        where: {
          username: email
        },
        include: {
          approved_personal_data: {
            select: {
              firstName: true
            }
          }
        }
      });

      await this.mailService.sendPasswrodResetOTPEmail(
        email,
        otp,
        name.approved_personal_data?.firstName ?? ''
      );

      return {
        success: true,
        message: `otp has send to ${email}`
      };
    } catch (error) {
      return {
        success: false,
        error
      };
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout-stamp')
  async logout(@Request() req: any) {
    return this.authService.addLogoutStamp(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('set-redirect-auth-token')
  async redirectAuth(@Request() req: any) {
    // console.log('tid', req.user.userId);
    return this.authService.setRedirectAuthToken(req.user.userId);
  }
}
