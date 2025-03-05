import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as generator from 'generate-password';
import { PrismaService } from './../prisma.service';
import { Prisma, User } from '@prisma/client';
import { MailService } from './../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './register-user.dto';
import { UserService } from './../flexiquiz/user/user.service';
import { FlexiUserSubmitDto } from '../flexiquiz/user/user.dto';
import { ExamService } from '../flexiquiz/exam/exam.service';
import moment = require('moment');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
    private userService: UserService,
    private examService: ExamService
  ) {}

  async isEmailExists(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: email
      }
    });

    if (user) {
      return true;
    }
    return false;
  }

  // our username is email
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: email
      }
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }

  // NOT IN USE!
  async login(user: any, ipAdr: any) {
    const now = new Date().toISOString();

    await this.prisma.user.update({
      where: {
        tsp_id: user.tsp_id
      },
      data: {
        last_login_at: now
      }
    });

    await this.prisma.hrisProgress.upsert({
      where: {
        tspId: user.tsp_id
      },
      update: {
        ipAddress: ipAdr
      },
      create: {
        tspId: user.tsp_id,
        ipAddress: ipAdr
      }
    });

    const payload = { username: user.username, sub: user.tsp_id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async register({
    email,
    firstName,
    lastName,
    dob,
    contact
  }: RegisterUserDto) {
    const password = generator.generate({
      length: 10,
      numbers: true
    });

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const now = new Date().toISOString();

    // const tspId = Math.round(Math.random() * 10000);

    const lastUser = await this.prisma.user.findFirst({
      orderBy: {
        tsp_id: 'desc'
      }
    });

    email = email.toLowerCase();

    const data: Prisma.UserCreateInput = {
      tsp_id: lastUser ? lastUser.tsp_id + 1 : 1,
      username: email,
      password: hash,
      level: 2
    };

    try {
      const isExists = await this.isEmailExists(email);

      if (isExists) {
        return {
          success: false,
          error: 'email already exists'
        };
      } else {
        const createdUser = await this.prisma.user.create({
          data
        });

        await this.prisma.hrisPersonalData.create({
          data: {
            tspId: createdUser.tsp_id,
            firstName: firstName,
            surname: lastName,
            shortName: firstName + ' ' + lastName,
            dob: new Date(dob).toISOString(),
            age: dob ? moment().diff(moment(dob), 'years') : null,
            updatedBy: +createdUser.tsp_id,
            updatedAt: now
          }
        });

        await this.prisma.hrisContactData.create({
          data: {
            tspId: createdUser.tsp_id,
            mobileNumber: contact,
            personalEmail: email,
            updatedBy: +createdUser.tsp_id,
            updatedAt: now
          }
        });

        await this.prisma.hrisAccess.create({
          data: {
            tsp_id: createdUser.tsp_id,
            access: 1,
            access_type: 'profile',
            module: 'recruitment',
            updated_at: now
          }
        });

        await this.prisma.graCronTracker.create({
          data: {
            tspId: createdUser.tsp_id
          }
        });

        // Todo: approved tables has to updated
        await this.prisma.approvedPersonalData.upsert({
          where: {
            tspId: createdUser.tsp_id
          },
          update: {
            firstName: firstName,
            surname: lastName,
            shortName: firstName + ' ' + lastName,
            dob: new Date(dob).toISOString(),
            age: dob ? moment().diff(moment(dob), 'years') : null,
            approvedAt: now
          },
          create: {
            tspId: createdUser.tsp_id,
            firstName: firstName,
            surname: lastName,
            shortName: firstName + ' ' + lastName,
            dob: new Date(dob).toISOString(),
            age: dob ? moment().diff(moment(dob), 'years') : null,
            approvedAt: now
          }
        });

        await this.prisma.approvedContactData.upsert({
          where: {
            tspId: createdUser.tsp_id
          },
          update: {
            mobileNumber: contact,
            personalEmail: email,
            workEmail: email,
            approvedAt: now
          },
          create: {
            tspId: createdUser.tsp_id,
            mobileNumber: contact,
            personalEmail: email,
            workEmail: email,
            approvedAt: now
          }
        });

        await this.prisma.graRegistrationData.upsert({
          where: {
            tspId: createdUser.tsp_id
          },
          create: {
            tspId: createdUser.tsp_id,
            progress: 1,
            updatedAt: now
          },
          update: {
            progress: 1,
            updatedAt: now
          }
        });

        // update / insert candidate level
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: createdUser.tsp_id
          },
          create: {
            candidate_id: createdUser.tsp_id,
            level: 1,
            updatedAt: now
          },
          update: {
            level: 1,
            updatedAt: now
          }
        });

        await this.mailService.sendWelcomeEmail(email, password, firstName);

        const payload = { username: email, sub: createdUser.tsp_id };
        return {
          success: true,
          message: `user registered and send welcome email`,
          accessToken: this.jwtService.sign(payload)
        };
      }
    } catch (error) {
      return { success: false, error };
    }
  }

  async resetPassword(email: string, password: string, otp: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const data: Prisma.UserUpdateInput = {
      password: hash
    };

    try {
      const entry = await this.prisma.otpRegister.findFirst({
        where: {
          email,
          otp
        }
      });

      if (!entry) return { success: false, error: 'no matching otp' };

      await this.prisma.user.update({
        where: {
          username: email
        },
        data
      });

      await this.prisma.otpRegister.delete({
        where: {
          email
        }
      });

      return {
        success: true,
        message: 'your password has been reset'
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  async addOtp(email: string): Promise<string | null> {
    const random = Math.floor(100000 + Math.random() * 900000);

    try {
      await this.prisma.otpRegister.upsert({
        where: {
          email: email
        },
        update: {
          otp: `${random}`
        },
        create: {
          email,
          otp: `${random}`
        }
      });
      return `${random}`;
    } catch (error) {
      return null;
    }
  }

  async validateOtp(email: string, otp: string): Promise<boolean> {
    try {
      const entry = await this.prisma.otpRegister.findFirst({
        where: {
          email,
          otp
        }
      });

      if (!entry) return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  async addLogoutStamp(tspId: number) {
    try {
      await this.prisma.user.update({
        where: {
          tsp_id: tspId
        },
        data: {
          last_logout_at: new Date().toISOString()
        }
      });
      return { success: true };
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async setRedirectAuthToken(tspId: number) {
    console.log('tspId: ' + tspId);
    const now = new Date().toISOString();
    const token = this.generateToken(23);
    const hexTspId = tspId.toString(16);
    const key = token.trim() + 'X' + String(hexTspId).padStart(6, '0');

    try {
      await this.prisma.accessAuthentication.upsert({
        where: {
          tspId
        },
        update: {
          key: key,
          active: true,
          createdAt: now,
          updatedAt: null
        },
        create: {
          tspId,
          key: key,
          active: true,
          createdAt: now,
          updatedAt: null
        }
      });
      console.log('key:' + key);
      return { success: true, key };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Helper function to generate random string to be used as token
   * @param length
   * @returns
   */
  generateToken(length: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  }
}
