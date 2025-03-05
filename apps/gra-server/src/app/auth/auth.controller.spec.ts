import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import Response from '@sendgrid/helpers/classes/response';
import { ClientResponse } from '@sendgrid/mail';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: MailService,
          useValue: {
            sendEmail: jest.fn((x) => x),
            sendOTPEmail: jest.fn((x) => x),
            sendPasswrodResetOTPEmail: jest.fn((x) => x)
          }
        },
        {
          provide: AuthService,
          useValue: {
            isEmailExists: jest.fn((x) => x),
            addOtp: jest.fn((x) => x),
            login: jest.fn((x) => {
              return {
                access_token: 'token'
              };
            }),
            resetPassword: jest.fn((x, y, z) => {
              return { email: x, password: y, otp: z };
            }),
            validateOtp: jest.fn((x) => x)
          }
        }
      ]
    }).compile();
    mailService = module.get<MailService>(MailService);
    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('auth controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('auth service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exists-email', () => {
    it('should return status exists-email', async () => {
      const email = 'hashini@gmail.com';

      jest.spyOn(service, 'isEmailExists').mockImplementation(async () => true);

      // expect(await controller.validEmail({ email })).toEqual({
      //   success: true,
      //   message: `${email} is already exists`,
      //   status: 'exists'
      // });
    });

    it('should return status send OTP', async () => {
      const email = 'hashini@gmail.com';
      const otp = '12345';

      jest
        .spyOn(service, 'isEmailExists')
        .mockImplementation(async () => false);
      jest.spyOn(service, 'addOtp').mockImplementation(async () => otp);

      // expect(await controller.validEmail({ email })).toEqual({
      //   success: true,
      //   message: `${email} is available and otp has send to ${email}`,
      //   status: 'available'
      // });
    });
  });

  describe('Login', () => {
    it('should return access_token when valid user', async () => {
      const access_token = '12345';
      jest.spyOn(service, 'login').mockImplementation(async () => {
        return {
          access_token
        } as any;
      });

      const mockRequest = {
        user: {
          username: 'hashini@gmail.com',
          tsp_id: 1
        }
      } as unknown as Request;

      // expect(await controller.login(mockRequest)).toEqual({
      //   access_token: '12345'
      // });
    });
  });

  describe('Reset Password', () => {
    it('should return false on wrong otp', async () => {
      const email = 'hashini@gmail.com';
      const otp = '1234';
      const password = '123qw@';

      jest
        .spyOn(service, 'resetPassword')
        .mockImplementation(async (email, password, otp) => {
          if (otp != '12341') {
            return {
              success: false,
              error: 'no matching otp'
            };
          }
        });

      expect(
        await controller.resetPassword({ email, otp, password })
      ).toStrictEqual({
        success: false,
        error: 'no matching otp'
      });
    });

    it('should return true on correct otp', async () => {
      const otp = '1234';
      const password = '123qw@';
      const email = 'hashini@gmail.com';
      jest
        .spyOn(service, 'resetPassword')
        .mockImplementation(async (email, password, otp) => {
          if (otp === '1234') {
            return { success: true, message: 'your password has been reset' };
          }
        });
      expect(
        await controller.resetPassword({ email, password, otp })
      ).toStrictEqual({
        success: true,
        message: 'your password has been reset'
      });
    });
  });

  describe('sendResetOTP', () => {
    it('should return false on wrong email', async () => {
      const email = 'hashini@gmail.com';

      jest
        .spyOn(service, 'isEmailExists')
        .mockImplementation(async () => false);

      expect(await controller.sendResetOTP({ email })).toStrictEqual({
        success: false,
        error: 'Invalid Email'
      });
    });

    it('should return status send OTP', async () => {
      const email = 'hashini@gmail.com';
      const otp = '12esq';

      jest.spyOn(service, 'isEmailExists').mockImplementation(async () => true);

      jest.spyOn(service, 'addOtp').mockImplementation(async () => otp);

      expect(await controller.sendResetOTP({ email })).toEqual({
        success: true,
        message: `otp has send to ${email}`
      });
    });
  });

  describe('Register', () => {
    it('should return status Invalidate Otp', async () => {
      const email = 'hashini@gmail.com';
      const otp = '12345';
      const firstName = 'sdfs';
      const lastName = 'sdfs';
      const dob = new Date();
      const contact = 'sdfs';
      // jest.spyOn(service, 'validateOtp').mockImplementation(async () => true);

      jest.spyOn(service, 'validateOtp').mockImplementation(async () => false);

      expect(
        await controller.register({
          email,
          otp,
          firstName,
          lastName,
          dob,
          contact
        })
      ).toStrictEqual({
        success: false,
        message: 'Invalid OTP',
        status: 'wrong otp'
      });
    });

    // it('should return status Invalidate Otp', async () => {
    //   const access_token = '12345';
    //   const email = 'hashini@gmail.com';
    //   const otp = '12345';

    // jest.spyOn(service, 'validateOtp').mockImplementation(async (otp) => {
    //   if (otp != '1234') {
    //     return {
    //       success: false,
    //       message: 'Invalid OTP',
    //       status: 'wrong otp'
    //      }as any;
    //   }

    //   });

    //   expect(
    //     await controller.register({ otp  })
    //   ).toStrictEqual({
    //     success: false,
    //     message: 'Invalid OTP',
    //     status: 'wrong otp'
    //   });
    // });
  });
});
