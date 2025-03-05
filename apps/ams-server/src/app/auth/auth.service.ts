import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';
import { Login } from './dtos/login';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';
import fetch from 'node-fetch';
import moment from 'moment';
import { GetObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  RegisterUserDto,
  CandidateSignUpDto,
  WebsiteRegisterUserDto
} from './dtos/register-user.dto';
import { ChangePasswordDto } from './dtos/auth.dto';

const credentials = {
  accessKeyId: process.env.NX_ERP_BUCKET_KEY,
  secretAccessKey: process.env.NX_ERP_BUCKET_SECRET
};

const bucket = process.env.NX_ERP_BUCKET_NAME;
const region = process.env.NX_ERP_BUCKET_REGION;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async login({ username, password }: Login) {
    try {
      let accessToken = 'No Token';
      let authResponse = null;

      //Fetch the user form db
      const currentUser = await this.prisma.user.findUnique({
        where: {
          username: username
        }
      });

      const now = new Date().toISOString();

      if (currentUser) {
        //Matching login password and user password
        const isMatch = await bcrypt.compare(password, currentUser.password);
        if (isMatch) {
          // Check user is active or inactive
          if (currentUser.level < 1) {
            throw new Error('This user is inactive');
          }
          if (currentUser.isDeactivated === true) {
            throw new Error('This user is inactive');
          }

          //update login time in table
          await this.prisma.user.update({
            where: {
              tsp_id: currentUser.tsp_id
            },
            data: {
              last_login_at: now
            }
          });

          //ensure record exists in hris_progress for candidates & tutors
          if ([1, 2].includes(currentUser.level)) {
            const userDataFetch = await this.prisma.user.findUnique({
              where: {
                tsp_id: currentUser.tsp_id
              },
              select: {
                username: true
              }
            });

            await this.prisma.hrisProgress.upsert({
              where: {
                tspId: currentUser.tsp_id
              },
              update: {
                ipAddress: 'TODO'
              },
              create: {
                tspId: currentUser.tsp_id,
                // lmsEmail: userDataFetch.username ?? null,
                ipAddress: 'TODO'
              }
            });
          }

          let moduleIdListMain: any = [];
          let groupIdListMain: any = [];
          const { password, ...result } = currentUser;
          //----------------------------------------------------------------------
          //get user permissions from Groups
          const userPermissionsGroup =
            await this.prisma.accessUsersOnGroups.findMany({
              where: {
                tspId: currentUser.tsp_id,
                authorization: 1
              },
              select: {
                groupId: true,
                accessGroupsRef: {
                  select: {
                    accessGroupsOnModules: {
                      select: {
                        moduleId: true
                      }
                    }
                  }
                }
              }
            });

          const groupIdList = userPermissionsGroup.map(
            (group) => group.groupId
          );
          const moduleIdListGroup = userPermissionsGroup.flatMap((group) =>
            group.accessGroupsRef?.accessGroupsOnModules?.map(
              (modu) => modu.moduleId
            )
          );

          //get user permissions from Modules. Add in to the permission list
          const userPermissionsModuleAdd =
            await this.prisma.accessUsersOnModules.findMany({
              where: {
                tspId: currentUser.tsp_id,
                authorization: 1
              },
              select: {
                moduleId: true
              }
            });

          //filter the module ids from modules for Add
          const moduleIdListAdd = userPermissionsModuleAdd.map(
            (item: any) => item.moduleId
          );
          //----------------------------------------------------------------------
          //get user permissions from Modules. Remove from permission list
          const userPermissionsModuleRemove =
            await this.prisma.accessUsersOnModules.findMany({
              where: {
                tspId: currentUser.tsp_id,
                authorization: 0
              },
              select: {
                moduleId: true
              }
            });
          //filter the module ids from modules for Remove
          const moduleIdListRemove = userPermissionsModuleRemove.map(
            (item: any) => item.moduleId
          );
          //----------------------------------------------------------------------
          //Remove Module ids from moduleIdListGroup (unauthorization module ids)
          const moduleIdListGroupNew = moduleIdListGroup.filter(
            (item) => !moduleIdListRemove.includes(item)
          );
          //Concatenating moduleIdListGroup array and moduleIdListAdd array
          moduleIdListMain = [...moduleIdListGroupNew, ...moduleIdListAdd];
          //Unique & sort ascending
          moduleIdListMain = [...new Set(moduleIdListMain)].sort();
          groupIdListMain = [...new Set(groupIdList)].sort();
          // console.log('permission_list:' + JSON.stringify(moduleIdListMain));
          // console.log(
          //   'permission_role_groups:' + JSON.stringify(groupIdListMain)
          // );

          //Get Journey Details and User Level for token
          const userDetails = await this.prisma.user.findUnique({
            where: {
              tsp_id: currentUser.tsp_id
            },
            select: {
              level: true,
              CandidateLevel: true,
              user_hris_progress: {
                select: {
                  tutorStatus: true
                }
              }
            }
          });

          let journeyDetails;

          const permissions = await this.permissionNamesList(
            currentUser.tsp_id
          );

          if (userDetails.level === 2) {
            journeyDetails = {
              journey: userDetails.CandidateLevel.level,
              tutorStatus: userDetails.user_hris_progress.tutorStatus,
              journeyStatus: {
                1: userDetails.CandidateLevel.step1,
                2: userDetails.CandidateLevel.step2,
                3: userDetails.CandidateLevel.step3,
                4: userDetails.CandidateLevel.step4,
                5: userDetails.CandidateLevel.step5,
                6: userDetails.CandidateLevel.step6,
                7: userDetails.CandidateLevel.step7,
                8: userDetails.CandidateLevel.step8
              },
              journeyLms: {
                ftLvl1Enabled: userDetails.CandidateLevel?.ftLvl1Enabled,
                ftLvl1Completed: userDetails.CandidateLevel?.ftLvl1Completed,
                ftLvl2Enabled: userDetails.CandidateLevel?.ftLvl2Enabled,
                ftLvl2Completed: userDetails.CandidateLevel?.ftLvl2Completed
              }
            };
          }

          //----------------------------------------------------------------------
          //Create JWT token
          const payload = {
            username: currentUser.username,
            sub: currentUser.tsp_id
          };
          accessToken = this.jwtService.sign(payload);
          //Create other user data
          const user = {
            access_token: accessToken,
            short_name: '', //yet to develop
            user_role: '', //yet to develop
            permission_list: moduleIdListMain,
            permissions,
            journeyDetails: userDetails.level === 2 ? journeyDetails : null
          };
          //prepare response
          authResponse = {
            success: true,
            data: { ...user, ...result }
          };
          //----------------------------------------------------------------------
        } else {
          authResponse = {
            ...authResponse,
            success: false
          };
        }
      } else {
        authResponse = {
          success: false
        };
      }

      return authResponse;
      //get User Role
      //   if (updatedRecord) {
      //     userRole = await this.prisma.laravel_master_directory_v2.findUnique({
      //       where: {
      //         hr_tsp_id: updatedRecord.tsp_id,
      //       },
      //       select: {
      //         role_profile: true,
      //       },
      //     });
      //   }

      //   return {
      //     accessToken: accessToken,
      //     data: updatedRecord,
      //     userRole: userRole,
      //     success: true,
      //     status: 200,
      //   };
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async permissionNamesList(tspId: number) {
    try {
      const groupsOnUser = await this.prisma.accessUsersOnGroups.findMany({
        where: {
          tspId
        },
        select: {
          accessGroupsRef: {
            select: {
              accessGroupsOnModules: {
                select: {
                  accessSystemModulesRef: {
                    select: {
                      permissionName: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      const permissions = groupsOnUser.flatMap((groupOnUser) => {
        return groupOnUser.accessGroupsRef.accessGroupsOnModules.map(
          (accessGroupOnModule) =>
            accessGroupOnModule.accessSystemModulesRef.permissionName
        );
      });

      return permissions.reduce((prev, permission) => {
        prev[permission] = true;
        return prev;
      }, {});
    } catch (error) {
      return {};
    }
  }

  async isAttemptsExceeded(email: string, type: number): Promise<boolean> {
    const row = await this.prisma.userTemporaryDisable.findFirst({
      where: {
        email,
        type
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    if (row && row.attempts >= 10) {
      return true;
    } else {
      false;
    }
  }

  async updateAttempts(email: string, type: number) {
    try {
      // return this.prisma.userTemporaryDisable.upsert({
      //   where: {
      //     email
      //   },
      //   create: {
      //     email,
      //     type,
      //     attempts: 1
      //   },
      //   update: {
      //     email,
      //     type,
      //     attempts: {
      //       increment: 1
      //     }
      //   }
      // });

      const exist = await this.prisma.userTemporaryDisable.findFirst({
        where: {
          email: email,
          type: type
        }
      });

      if (exist) {
        return await this.prisma.userTemporaryDisable.updateMany({
          where: {
            email: email,
            type: type
          },
          data: {
            attempts: {
              increment: 1
            }
          }
        });
      } else {
        return await this.prisma.userTemporaryDisable.create({
          data: {
            email: email,
            type,
            attempts: 1
          }
        });
      }
    } catch (error) {
      console.log('updateAttempts-error', error.message);
      return null;
    }
  }

  removeEntry(email: string, type: number) {
    return this.prisma.userTemporaryDisable.deleteMany({
      where: {
        email,
        type
      }
    });
  }

  async disableUser(email: string) {
    return this.prisma.user.update({
      where: {
        username: email
      },
      data: {
        isTemporaryDisabled: true
      }
    });
  }

  //NOT IN USE
  async isEmailExists(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: email
      }
    });

    if (user) {
      return true;
    }
    return false;
  }

  async addOtp(email: string): Promise<string | null> {
    const random = Math.floor(100000 + Math.random() * 900000);

    try {
      await this.prisma.otpRegister.upsert({
        where: {
          email: email
        },
        update: {
          updatedAt: new Date().toISOString(),
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

  async validateOtp(email: string, otp: string): Promise<boolean> {
    try {
      const entry = await this.prisma.otpRegister.findFirst({
        where: {
          email,
          otp
        }
      });

      if (!entry) {
        await this.updateAttempts(email, 2);
        return false;
      } else {
        await this.removeEntry(email, 2);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  //NOT IN USE
  async register({ email, firstName, lastName, dob }: RegisterUserDto) {
    const password = generator.generate({
      length: 10,
      numbers: true
    });

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    // const tspId = Math.round(Math.random() * 10000);

    const lastUser = await this.prisma.user.findFirst({
      orderBy: {
        tsp_id: 'desc'
      }
    });

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

        const today = new Date();
        const birthDate = new Date(dob);
        const ageCalculated =
          today.getMonth() > birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate())
            ? today.getFullYear() - birthDate.getFullYear() - 1
            : today.getFullYear() - birthDate.getFullYear();
        const ageMoment = dob
          ? Math.round(Math.abs(moment().diff(moment(dob), 'years', true)))
          : 0;

        await this.prisma.hrisPersonalData.create({
          data: {
            tspId: createdUser.tsp_id,
            firstName: firstName,
            surname: lastName,
            shortName: firstName + ' ' + lastName,
            dob: new Date(dob).toISOString()
          }
        });

        await this.prisma.hrisContactData.create({
          data: {
            tspId: createdUser.tsp_id,
            // mobileNumber: contact,
            personalEmail: email,
            workEmail: email
          }
        });

        await this.prisma.hrisAccess.create({
          data: {
            tsp_id: createdUser.tsp_id,
            access: 1,
            access_type: 'profile',
            module: 'recruitment'
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
            dob: new Date(dob).toISOString()
          },
          create: {
            tspId: createdUser.tsp_id,
            firstName: firstName,
            surname: lastName,
            shortName: firstName + ' ' + lastName,
            dob: new Date(dob).toISOString()
          }
        });

        await this.prisma.approvedContactData.upsert({
          where: {
            tspId: createdUser.tsp_id
          },
          update: {
            // mobileNumber: contact,
            personalEmail: email,
            workEmail: email
          },
          create: {
            tspId: createdUser.tsp_id,
            // mobileNumber: contact,
            personalEmail: email,
            workEmail: email
          }
        });

        await this.prisma.graRegistrationData.upsert({
          where: {
            tspId: createdUser.tsp_id
          },
          create: {
            tspId: createdUser.tsp_id,
            progress: 1
          },
          update: {
            progress: 1
          }
        });

        // update / insert candidate level
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: createdUser.tsp_id
          },
          create: {
            candidate_id: createdUser.tsp_id,
            level: 1
          },
          update: {
            level: 1
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

  async validateReCaptchaToken(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY_V2_INVISIBLE;
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: 'POST' }
    );
    const data = await response.json();
    console.log('recaptcha return', data); //TODO: remove on production
    return data ? data.success : false;
  }

  formatPhoneNumber(phoneNumber) {
    // Check & modify input if matching one of the specified country criteria
    if (typeof phoneNumber === 'string') {
      if (phoneNumber.startsWith('+94') && phoneNumber.length === 12) {
        // Sri Lanka
        return phoneNumber.replace(
          /^(\+94)(\d{2})(\d{3})(\d{4})$/,
          '$1 $2 $3 $4'
        );
      } else if (phoneNumber.startsWith('+91') && phoneNumber.length === 13) {
        // India
        return phoneNumber.replace(/^(\+91)(\d{5})(\d{5})$/, '$1 $2-$3');
      } else if (phoneNumber.startsWith('+44') && phoneNumber.length === 13) {
        // UK
        return phoneNumber.replace(/^(\+44)(\d{4})(\d{6})$/, '$1 $2 $3');
      }
    }
    // Return the original input if it doesn't match any criteria
    return phoneNumber;
  }

  //New Version
  async webSiteSignupCandidates({
    email,
    firstName,
    lastName,
    // contact,
    ageCheck,
    knewAboutUs,
    residence
  }: CandidateSignUpDto) {
    try {
      const password = generator.generate({
        length: 10,
        numbers: true
      });

      // const formattedPhoneNumber = this.formatPhoneNumber(contact);

      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);

      const lastUser = await this.prisma.user.findFirst({
        orderBy: {
          tsp_id: 'desc'
        }
      });

      const data: Prisma.UserCreateInput = {
        tsp_id: lastUser ? lastUser.tsp_id + 1 : 1,
        username: email,
        password: hash,
        level: 2
      };

      const isExist = await this.isEmailExists(email);

      if (isExist) {
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
            shortName: firstName + ' ' + lastName
          }
        });

        await this.prisma.hrisContactData.create({
          data: {
            tspId: createdUser.tsp_id,
            // mobileNumber: formattedPhoneNumber,
            personalEmail: email,
            workEmail: email
          }
        });

        await this.prisma.hrisAccess.create({
          data: {
            tsp_id: createdUser.tsp_id,
            access: 1,
            access_type: 'profile',
            module: 'recruitment'
          }
        });

        await this.prisma.approvedPersonalData.upsert({
          where: {
            tspId: createdUser.tsp_id
          },
          update: {
            firstName: firstName,
            surname: lastName,
            shortName: firstName + ' ' + lastName
          },
          create: {
            tspId: createdUser.tsp_id,
            firstName: firstName,
            surname: lastName,
            shortName: firstName + ' ' + lastName
          }
        });

        await this.prisma.approvedContactData.upsert({
          where: {
            tspId: createdUser.tsp_id
          },
          update: {
            // mobileNumber: formattedPhoneNumber,
            personalEmail: email,
            workEmail: email
          },
          create: {
            tspId: createdUser.tsp_id,
            // mobileNumber: formattedPhoneNumber,
            personalEmail: email,
            workEmail: email
          }
        });

        await this.prisma.graRegistrationData.upsert({
          where: {
            tspId: createdUser.tsp_id
          },
          update: {
            progress: 2,
            knewAboutUs: knewAboutUs
          },
          create: {
            tspId: createdUser.tsp_id,
            progress: 2,
            knewAboutUs: knewAboutUs
          }
        });

        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: createdUser.tsp_id
          },
          update: {
            level: 1
          },
          create: {
            candidate_id: createdUser.tsp_id,
            level: 1
          }
        });

        const status = await this.checkCandidateEligibility({
          email: email,
          tspId: createdUser.tsp_id,
          firstName: firstName,
          lastName: lastName,
          residence: residence,
          ageCheck: ageCheck,
          password: password
        });

        return {
          success: true,
          status: status
        };
      }
    } catch (error) {
      return { success: false, error };
    }
  }

  async checkCandidateEligibility({
    email,
    tspId,
    firstName,
    residence,
    ageCheck,
    password
  }: {
    email: string;
    tspId: number;
    firstName: string;
    lastName: string;
    ageCheck: string;
    residence: string;
    password: string;
  }) {
    try {
      const contactData = await this.prisma.hrisContactData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        }
      });

      if (contactData) {
        await this.prisma.hrisContactData.update({
          where: {
            id: contactData.id
          },
          data: {
            residingCountry: residence
          }
        });
      } else {
        await this.prisma.hrisContactData.create({
          data: {
            tspId: tspId,
            residingCountry: residence
          }
        });
      }

      const approvedContactData =
        await this.prisma.approvedContactData.findFirst({
          where: {
            tspId
          }
        });

      if (approvedContactData) {
        await this.prisma.approvedContactData.update({
          where: {
            tspId
          },
          data: {
            residingCountry: residence
          }
        });
      } else {
        await this.prisma.approvedContactData.create({
          data: {
            tspId,
            residingCountry: residence
          }
        });
      }

      //conditions for failing a candidate
      const ageConditionFail = ageCheck !== 'Yes';
      const residingCountryConditionFail = !['Sri Lanka', 'India'].includes(
        residence
      );
      const isIndianCandidate = ['India'].includes(residence);

      if (ageConditionFail || residingCountryConditionFail) {
        //fail outcome

        const reasonsString =
          ageConditionFail && residingCountryConditionFail
            ? '<b>Age Requirement:</b> Applicants must be 18 years of age or older to be considered for this position.<br><b>Residency Requirement:</b> This opportunity is currently open to residents of Sri Lanka only.'
            : residingCountryConditionFail
            ? '<b>Residency Requirement:</b> This opportunity is currently open to residents of Sri Lanka only.'
            : ageConditionFail
            ? '<b>Age Requirement:</b> Applicants must be 18 years of age or older to be considered for this position.<br>'
            : '';

        const thankYouMsg =
          ageConditionFail && residingCountryConditionFail
            ? ''
            : residingCountryConditionFail
            ? ' Rest assured, we will notify you when positions become available outside of Sri Lanka.'
            : ageConditionFail && isIndianCandidate
            ? ' Additionally, we have paused recruitment for tutor positions from India for the moment. However, we will keep your details on record and contact you as soon as recruitment resumes. We hope to connect with you in the future.'
            : ageConditionFail
            ? ' We encourage you to consider applying again once you meet the age criteria.'
            : '';

        // const headerText =
        //   ageConditionFail && !residingCountryConditionFail
        //     ? "<span style='color:#5cb7da'>You're </span><span style='color:#5bbfd0'>Almost </span><span style='color:#56cbbd'>There!</span>"
        //     : "<span style='color:#60adea'>We're Sorry! </span><span style='color:#5cb7da'>Lets Try </span><span style='color:#5bbfd0'>Next </span><span style='color:#56cbbd'>Time</span>";
        const headerText =
          "<span style='color:#60adea'>Step 1 </span><span style='color:#5cb7da'>- Sign Up </span><span style='color:#5bbfd0'>for Online </span><span style='color:#56cbbd'>Maths Tutor</span>";

        await this.mailService.sendWebFailEmail(
          email,
          firstName,
          reasonsString,
          thankYouMsg,
          headerText
        );

        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: tspId
          },
          create: {
            candidate_id: tspId,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'Fail'
          },
          update: {
            level: 1,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'Fail'
          }
        });
        return 'fail';
      } else if (isIndianCandidate) {
        // on hold - India
        const headerText =
          "<span style='color:#60adea'>Step 1 </span><span style='color:#5cb7da'>- Sign Up </span><span style='color:#5bbfd0'>for Online </span><span style='color:#56cbbd'>Maths Tutor</span>";

        await this.mailService.sendWebOnHoldIndiaEmail(
          email,
          firstName,
          headerText
        );

        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: tspId
          },
          create: {
            candidate_id: tspId,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'On Hold'
          },
          update: {
            level: 1,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'On Hold'
          }
        });
        return 'fail';
      } else {
        //pass outcome
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: tspId
          },
          create: {
            candidate_id: tspId,
            level: 2,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'Pass'
          },
          update: {
            level: 2,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'Pass'
          }
        });

        await this.mailService.sendWebPassEmail(
          email,
          firstName,
          password,
          tspId
        );
        return 'pass';
      }
    } catch (error) {
      return 'fail';
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: email
      }
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const { password, ...result } = user;
        // if success remove entry from temporary disabled list
        await this.removeEntry(email, 1);
        return result;
      } else {
        const attemptsExceeded = await this.isAttemptsExceeded(email, 1);
        if (attemptsExceeded) {
          await this.disableUser(email);
          return { isTemporaryDisabled: true };
        } else {
          await this.updateAttempts(email, 1);
          return null;
        }
      }
    }
    return null;
  }

  async getUserDetails({ userId }: { username: string; userId: number }) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          tsp_id: userId
        },
        select: {
          username: true,
          level: true,
          approved_personal_data: {
            select: {
              firstName: true,
              surname: true,
              shortName: true,
              dob: true,
              nationality: true,
              nic: true
            }
          },
          hris_personal_data: {
            select: { ppUrl: true },
            orderBy: {
              id: 'desc'
            }
          },
          approved_contact_data: {
            select: {
              residingCountry: true,
              residingDistrict: true,
              residingProvince: true,
              mobileNumber: true
            }
          },
          graRegistrationData: {
            select: {
              whichPartner: true,
              knewAboutUs: true,
              bankStatus: true,
              // status: true,
              progress: true,
              documentsList: true
            }
          },
          hris_access: {
            select: {
              access: true,
              access_type: true,
              module: true
            },
            where: {
              access: 1
            }
          },
          user_hris_progress: {
            select: {
              tutorStatus: true,
              profileStatus: true,
              initialAuditPassDate: true,
              contractAuditPassDate: true,
              finalAuditPassDate: true,
              dbsAuditPassDate: true
            }
          },
          tm_approved_status: {
            select: {
              employeeStatus: true,
              movementType: true
            }
          },
          approved_dbs_data: {
            select: {
              isPcApplied: true,
              pcReportUrl: true,
              dbsState: true,
              isPhysicalDbsChecked: true
            }
          },
          approved_right2work_data: {
            select: {
              pccState: true
            }
          },
          hris_right2work_data: {
            select: {
              gsUrl: true,
              gsUrlStatus: true,
              pccUrl: true,
              pccUrlStatus: true
            },
            orderBy: {
              id: 'desc'
            },
            take: 1
          },
          // EducationResult: {
          //   select: {
          //     examStatus: true
          //   },
          //   orderBy: {
          //     id: 'desc'
          //   }
          // },
          CandidateLevel: true
        }
      });

      //----------------------------------------------------------------------
      // tutor related statuses generated (BK)
      let gsStateX = '';
      let pccStateX = '';
      let pcStateX = '';
      let dbsStateX = '';
      if (user.level && user.level === 2) {
        // dynamically generate a SHOW-FOR: GS-State for tutor dashboard
        if (
          user?.hris_right2work_data &&
          user?.hris_right2work_data[0] &&
          ![null, ''].includes(user?.hris_right2work_data[0].gsUrl)
        ) {
          if (user?.hris_right2work_data[0].pccUrlStatus === 'approved') {
            gsStateX = 'Approved';
          } else if (
            user?.hris_right2work_data[0].pccUrlStatus === 'rejected'
          ) {
            gsStateX = 'Rejected';
          } else {
            gsStateX = 'Audit Pending';
          }
        } else {
          gsStateX = 'Upload Pending';
        }

        // dynamically generate a SHOW-FOR: PCC-State for tutor profile
        if (
          ['Valid', 'Valid - In Progress'].includes(
            user?.approved_right2work_data?.pccState
          )
        ) {
          pccStateX = user?.approved_right2work_data?.pccState;
        } else if (
          ['Expired'].includes(user?.approved_right2work_data?.pccState)
        ) {
          if (
            user?.hris_right2work_data &&
            user?.hris_right2work_data[0] &&
            ![null, ''].includes(user?.hris_right2work_data[0].pccUrl) &&
            user?.hris_right2work_data[0].pccUrlStatus === 'pending'
          ) {
            pccStateX = 'Audit Pending';
          } else {
            pccStateX = 'Expired';
          }
        } else {
          if (
            user?.hris_right2work_data &&
            user?.hris_right2work_data[0] &&
            ![null, ''].includes(user?.hris_right2work_data[0].pccUrl) &&
            ['', null, 'pending'].includes(
              user?.hris_right2work_data[0].pccUrlStatus
            )
          ) {
            pccStateX = 'New - In Progress';
          } else {
            pccStateX = 'Upload Pending';
          }
        }

        // dynamically generate a SHOW-FOR: PC-State for tutor profile
        if (user?.approved_dbs_data?.isPcApplied == 1) {
          if (![null, ''].includes(user?.approved_dbs_data?.pcReportUrl)) {
            pcStateX = 'PC Uploaded';
          } else {
            pcStateX = 'PC Applied Only';
          }
        } else {
          pcStateX = 'Not Applied Yet';
        }

        // dynamically generate a SHOW-FOR: DBS-State for tutor profile
        if (user?.approved_dbs_data?.isPhysicalDbsChecked == 1) {
          dbsStateX = 'Verified by TSL';
        } else {
          dbsStateX = 'Not Verified Yet';
        }
      }

      // console.log(
      //   '\npccState::', pccStateX,
      //   '\npcState::', pcStateX,
      //   '\ndbsState::', dbsStateX,
      // )
      //----------------------------------------------------------------------
      /**
       * Access fetch logic by Inusha ft. Banuka
       */
      let moduleIdListMain: any = [];
      let groupIdListMain: any = [];
      if (user.level && user.level === 3) {
        const moduleIdListGroup: any = [];
        const moduleIdListAdd: any = [];
        const moduleIdListRemove: any = [];
        //get user permissions from Groups
        const userPermissionsGroup =
          await this.prisma.accessUsersOnGroups.findMany({
            where: {
              tspId: userId,
              authorization: 1
            },
            select: {
              groupId: true,
              accessGroupsRef: {
                select: {
                  accessGroupsOnModules: {
                    select: {
                      id: false,
                      groupId: false,
                      moduleId: true,
                      description: false
                    }
                  }
                }
              }
            }
          });
        // console.log("userPermissionsGroup:" + JSON.stringify(userPermissionsGroup));

        //filter the module ids from groups
        userPermissionsGroup.map((item1: any) => {
          item1?.groupId && groupIdListMain.push(item1?.groupId);

          item1?.accessGroupsRef?.accessGroupsOnModules?.map((item2: any) => {
            moduleIdListGroup.push(item2.moduleId);
          });
        });
        // console.log("groupIdListMain:" + JSON.stringify(groupIdListMain));
        //----------------------------------------------------------------------
        //get user permissions from Modules. Add in to the permission list
        const userPermissionsModuleAdd =
          await this.prisma.accessUsersOnModules.findMany({
            where: {
              tspId: userId,
              authorization: 1
            },
            select: {
              moduleId: true
            }
          });

        //filter the module ids from modules for Add
        userPermissionsModuleAdd.map((item: any) => {
          moduleIdListAdd.push(item.moduleId);
        });
        //----------------------------------------------------------------------
        //get user permissions from Modules. Remove from permission list
        const userPermissionsModuleRemove =
          await this.prisma.accessUsersOnModules.findMany({
            where: {
              tspId: userId,
              authorization: 0
            },
            select: {
              moduleId: true
            }
          });
        //filter the module ids from modules for Remove
        userPermissionsModuleRemove.map((item: any) => {
          moduleIdListRemove.push(item.moduleId);
        });
        //----------------------------------------------------------------------
        //Remove Module ids from moduleIdListGroup (unauthorization module ids)
        const moduleIdListGroupNew = moduleIdListGroup.filter(
          (item) => !moduleIdListRemove.includes(item)
        );
        //Concatenating moduleIdListGroup array and moduleIdListAdd array
        moduleIdListMain = [...moduleIdListGroupNew, ...moduleIdListAdd];
        //Unique & sort ascending
        moduleIdListMain = [...new Set(moduleIdListMain)].sort();
        groupIdListMain = [...new Set(groupIdListMain)].sort();

        //----------------------------------------------------------------------
      }

      // On Hold, Pass, Fail
      // let journeyStatus = 'Pass';

      // switch (user.CandidateLevel.level) {
      //   case 1:
      //     if (user.graRegistrationData.status === 'Pass') {
      //       journeyStatus = 'Pass';
      //     } else if (user.graRegistrationData.status === 'Fail') {
      //       journeyStatus = 'Fail';
      //     } else if (user.graRegistrationData.status === 'On Hold') {
      //       journeyStatus = 'On Hold';
      //     }
      //     break;
      //   case 2:
      //     journeyStatus = 'Pass';
      //     break;
      //   default:
      //     journeyStatus = 'Pass';
      // }

      const permissions = await this.permissionNamesList(userId);

      const s3Configuration: S3ClientConfig = {
        credentials,
        region
      };

      const path = user.hris_personal_data[0]?.ppUrl ?? null;
      let signedPPUrl = '';
      // console.log('s3 -.', s3Configuration);

      if (path) {
        const s3 = new S3Client(s3Configuration);
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key:
            path && path.charAt(0) === '/' ? `${path}`.slice(1) : path ?? 'NA'
        });
        const signedUrlPromise = getSignedUrl(s3, command, {
          expiresIn: 60000
        }); // expires in seconds
        // Create a GET request from S3 url.
        signedPPUrl = await signedUrlPromise;
      }

      return {
        success: true,
        data: {
          permission_list: moduleIdListMain,
          permission_role_groups: groupIdListMain,
          ...user.approved_contact_data,
          ...user.approved_personal_data,
          ...user.graRegistrationData,
          email: user.username,
          userId,
          level: user.level,
          access: user.hris_access,
          journey: user.CandidateLevel ? user.CandidateLevel.level : null,
          journeyStatus: {
            1: user.CandidateLevel?.step1,
            2: user.CandidateLevel?.step2,
            3: user.CandidateLevel?.step3,
            4: user.CandidateLevel?.step4,
            5: user.CandidateLevel?.step5,
            6: user.CandidateLevel?.step6,
            7: user.CandidateLevel?.step7,
            8: user.CandidateLevel?.step8
          },
          journeyLms: {
            ftLvl1Enabled: user.CandidateLevel?.ftLvl1Enabled,
            ftLvl1Completed: user.CandidateLevel?.ftLvl1Completed,
            ftLvl2Enabled: user.CandidateLevel?.ftLvl2Enabled,
            ftLvl2Completed: user.CandidateLevel?.ftLvl2Completed
          },
          tutorStatus: user?.user_hris_progress?.tutorStatus ?? '',
          profileStatus: user?.user_hris_progress?.profileStatus ?? '',
          initialAuditPassDate:
            user?.user_hris_progress?.initialAuditPassDate ?? '',
          contractAuditPassDate:
            user?.user_hris_progress?.contractAuditPassDate ?? '',
          finalAuditPassDate:
            user?.user_hris_progress?.finalAuditPassDate ?? '',
          dbsAuditPassDate: user?.user_hris_progress?.dbsAuditPassDate ?? '',
          tmEmployeeStatus: user?.tm_approved_status?.employeeStatus ?? '',
          tmMovementType: user?.tm_approved_status?.movementType ?? '',
          gsStateX,
          pccStateX,
          pcStateX,
          dbsStateX,
          profilePicture: signedPPUrl,
          permissions
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  /*
  async checkUserDetails({
    tspId,
    username,
    firstName,
    residence,
    dob,
    otherCountry
  }: {
    username: string;
    firstName: string;
    tspId: number;
    residence: string;
    dob: Date;
    otherCountry: string;
  }) {
    // console.log(userId);
    try {
      // let district = null;
      // let state = null;
      // if (details.residence === 'Sri Lanka') {
      //   district = details.district;
      //   details.state = details.district;
      // } else if (details.residence === 'India') {
      //   state = details.state;
      //   details.district = details.state;
      // }

      // const lastContactData = await this.prisma.hrisContactData.findFirst({
      //   where: {
      //     tspId: userId
      //   },
      //   orderBy: {
      //     id: 'desc'
      //   }
      // });

      // const lastPersonalData = await this.prisma.hrisPersonalData.findFirst({
      //   where: {
      //     tspId: userId
      //   },
      //   orderBy: {
      //     id: 'desc'
      //   }
      // });

      const contactData = await this.prisma.hrisContactData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        }
      });

      if (contactData) {
        await this.prisma.hrisContactData.update({
          where: {
            id: contactData.id
          },
          data: {
            residingCountry: residence === 'Other' ? otherCountry : residence
            // residingDistrict: district,
            // residingProvince: state,
            // residingCity: details.city
          }
        });
      } else {
        await this.prisma.hrisContactData.create({
          data: {
            tspId,
            residingCountry: residence === 'Other' ? otherCountry : residence
            // residingDistrict: district,
            // residingProvince: state,
            // residingCity: details.city
          }
        });
      }

      // Todo: approved tables has to updated

      const approvedContactData =
        await this.prisma.approvedContactData.findFirst({
          where: {
            tspId
          }
        });

      if (approvedContactData) {
        await this.prisma.approvedContactData.update({
          where: {
            tspId
          },
          data: {
            residingCountry: residence === 'Other' ? otherCountry : residence
          }
        });
      } else {
        await this.prisma.approvedContactData.create({
          data: {
            tspId,
            residingCountry: residence === 'Other' ? otherCountry : residence
          }
        });
      }

      // send onhold email
      // - work in TSG - not applicable
      // - Nationality - other

      // const workingCondition = details.working !== 'Not Applicable';
      // const nationalityCondition = details.nationality === 'Other';

      // send fail email
      // - age 18-55
      // - bank account - first two options
      // - indian - [Punjab, Himachal, Haryana] - some cities
      // - Have an English Id

      const years = dob
        ? Math.round(Math.abs(moment().diff(moment(dob), 'years', true)))
        : 0;

      // all the conditions are met fail status

      const ageCondition = !(years >= 18 && years <= 55);
      // const bankCondition = ![
      //   'Yes, I have an active bank account either in Sri Lanka or India',
      //   `No, I don't have one but I am willing to open a bank account either in Sri Lanka or India`
      // ].includes(details.bankAccount);

      // const cityCondition = false;

      // if (
      //   details.residence === 'India' &&
      //   ['Punjab', 'Himachal Pradesh', 'Haryana'].includes(details.state)
      // ) {
      //   citiesByStates[details.state].forEach((city) => {
      //     if (city.value === details.city && !city.accepted) {
      //       cityCondition = true;
      //     }
      //   });
      // }

      const residingCountryCondition = !['Sri Lanka', 'India'].includes(
        residence
      );

      // const englishIdCondition = details.documentsList.includes(
      //   'I do not have any of the above documents in English'
      // );

      if (
        ageCondition ||
        // bankCondition ||
        // cityCondition ||
        residingCountryCondition
        // englishIdCondition
      ) {
        // failing
        const errors = [];

        ageCondition && errors.push('Age between 18-55');

        // bankCondition &&
        //   errors.push(
        //     'Do not currently hold or not willing to open a bank account in SL or India'
        //   );

        // if (cityCondition) {
        //   errors.push(
        //     'Due to contractual obligations, as a result of you being a candidate from ' +
        //       details.state
        //   );
        //   contents.push(
        //     'However, we are happy to process your application in future, in the event you have relocated out from a radius of 120km, from Ludhiana. Thus, to do the same, you can get in touch with us by sharing documentary proof of your current residential address(relocated address) as a reply to this email.'
        //   );
        // }

        if (residingCountryCondition) {
          // errors.push(
          //   ' you are currently residing in a country where data protection and network regulations prohibit the delivery of sessions.'
          // );
          errors.push('Residing in Sri Lanka or India');
        }

        // if (englishIdCondition && details.nationality === 'Sri Lankan') {
        //   errors.push('your NIC/Passport/Driving Liscence is not in English');
        //   contents.push(
        //     'However, if you are able to submit the identical document in English, we would be pleased to review it'
        //   );
        // } else if (englishIdCondition && details.nationality === 'Indian') {
        //   errors.push(
        //     'your Aadhar Card/Passport/Driving Liscence is not in English'
        //   );
        //   contents.push(
        //     'However, if you are able to submit the identical document in English, we would be pleased to review it'
        //   );
        // } else if (englishIdCondition && details.nationality === 'Other') {
        //   errors.push('Your Passport is not in English');
        // }

        // if (errors.length > 1) {
        //   contents.splice(0);
        // }

        console.log('errors: ' + errors);

        await this.mailService.sendWebFailEmail(username, firstName, errors);

        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: tspId
          },
          create: {
            candidate_id: tspId,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'Fail'
          },
          update: {
            level: 1,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'Fail'
          }
        });
        return 'fail';
      } else {
        // if not onhold - update candidate level to 2
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: tspId
          },
          create: {
            candidate_id: tspId,
            level: 2, //TODO: for testing hris, set this to 5
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'Pass'
          },
          update: {
            level: 2, //TODO: for testing hris, set this to 5
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step1: 'Pass'
          }
        });
        await this.mailService.sendWebPassEmail(username, firstName);
        return 'pass';
      }

      // gra extra registration data
      // await this.prisma.graRegistrationData.upsert({
      //   where: {
      //     tspId: userId
      //   },
      //   create: {
      //     tspId: userId,
      //     whichPartner: details.working,
      //     knewAboutUs: details.aboutUs,
      //     bankStatus: details.bankAccount,
      //     documentsList: details.documentsList,
      //     progress: 2
      //   },
      //   update: {
      //     tspId: userId,
      //     whichPartner: details.working,
      //     knewAboutUs: details.aboutUs,
      //     bankStatus: details.bankAccount,
      //     documentsList: details.documentsList,
      //     progress: 2
      //   }
      // });
    } catch (error) {
      return 'fail';
    }
  }
*/

  //Change Password
  async changePassword(changePasswordData: ChangePasswordDto, userId: string) {
    try {
      const { currentPassword, newPassword, confirmNewPassword } =
        changePasswordData;
      const saltOrRounds = 10;

      const user = await this.prisma.user.findUnique({
        where: {
          tsp_id: +userId
        }
      });

      if (user) {
        const isCurrentPassMatch = await bcrypt.compare(
          currentPassword,
          user.password
        );

        if (isCurrentPassMatch) {
          if (newPassword === confirmNewPassword) {
            const hash = await bcrypt.hash(newPassword, saltOrRounds);

            const data: Prisma.UserUpdateInput = {
              password: hash
            };

            await this.prisma.user.update({
              where: {
                tsp_id: user.tsp_id
              },
              data
            });

            return { success: true };
          } else {
            throw new Error('New Password is not matching with conform field');
          }
        } else {
          throw new Error('Current Password is Incorrect');
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new HttpException({ success: false, error: error.message }, 400);
    }
  }

  async checkOtpAttempts(email: string) {
    try {
      const result = await this.prisma.userTemporaryDisable.findFirst({
        where: {
          email: email,
          type: 3
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      if (result && result.attempts > 10) {
        return {
          success: false,
          attempts: result.attempts
        };
      } else if (result) {
        await this.prisma.userTemporaryDisable.updateMany({
          where: {
            email,
            type: 3
          },
          data: {
            attempts: {
              increment: 1
            }
          }
        });

        return {
          success: true,
          attempts: result.attempts + 1
        };
      } else {
        await this.prisma.userTemporaryDisable.createMany({
          data: {
            email,
            type: 3,
            attempts: 1
          }
        });

        return {
          success: true,
          attempts: 1
        };
      }

      // const attempts = await this.prisma.userTemporaryDisable.upsert({
      //   where: {
      //     email
      //   },
      //   create: {
      //     email,
      //     type: 3,
      //     attempts: 1
      //   },
      //   update: {
      //     email,
      //     type: 3,
      //     attempts: {
      //       increment: 1
      //     }
      //   }
      // });

      // return {
      //   success: true,
      //   attempts: attempts.attempts
      // };
    } catch (error) {
      throw new HttpException({ message: error.message }, 400);
    }
  }
}
