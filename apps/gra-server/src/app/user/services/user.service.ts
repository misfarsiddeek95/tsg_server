import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma.service';
import * as moment from 'moment';
import { MailService } from './../../mail/mail.service';
import {
  CandidateNamesInBookingStatusTableBookedRequestDto,
  InterviewerNamesInBookingStatusTableBookedRequestDto,
  UpdateUserDetailsDto,
  UserDetailsDto
} from '../dtos/user.dto';
import { CreateBookingStatusDto } from '../dtos/booking-status.dto';
import { citiesByStates } from '@erp-server/utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async userDetails(
    { userId, username }: { username: string; userId: number },
    details: UserDetailsDto
  ) {
    // console.log(userId);
    try {
      let district = null;
      let state = null;
      if (details.residence === 'Sri Lanka') {
        district = details.district;
        details.state = details.district;
      } else if (details.residence === 'India') {
        state = details.state;
        details.district = details.state;
      }

      const lastContactData = await this.prisma.hrisContactData.findFirst({
        where: {
          tspId: userId
        },
        orderBy: {
          id: 'desc'
        }
      });

      const lastPersonalData = await this.prisma.hrisPersonalData.findFirst({
        where: {
          tspId: userId
        },
        orderBy: {
          id: 'desc'
        }
      });

      await this.prisma.hrisContactData.update({
        where: {
          id: lastContactData.id
        },
        data: {
          residingCountry:
            details.residence === 'Other'
              ? details.otherCountry
              : details.residence,
          residingDistrict: district,
          residingProvince: state,
          residingCity: details.city
        }
      });
      await this.prisma.hrisPersonalData.update({
        where: {
          id: lastPersonalData.id
        },
        data: {
          nationality:
            details.nationality === 'Other'
              ? details.otherNationality
              : details.nationality,
          nic: details.nic
        }
      });
      // Todo: approved tables has to updated

      await this.prisma.approvedContactData.update({
        where: {
          tspId: userId
        },
        data: {
          residingCountry:
            details.residence === 'Other'
              ? details.otherCountry
              : details.residence,
          residingDistrict: district,
          residingProvince: state,
          residingCity: details.city
        }
      });

      await this.prisma.approvedPersonalData.update({
        where: {
          tspId: userId
        },
        data: {
          nationality:
            details.nationality === 'Other'
              ? details.otherNationality
              : details.nationality,
          nic: details.nic
        }
      });

      // send onhold email
      // - work in TSG - not applicable
      // - Nationality - other

      const workingCondition = details.working !== 'Not Applicable';
      const nationalityCondition = details.nationality === 'Other';

      // send fail email
      // - age 18-55
      // - bank account - first two options
      // - indian - [Punjab, Himachal, Haryana] - some cities
      // - Have an English Id

      const years = lastPersonalData.dob
        ? Math.round(
            Math.abs(moment().diff(+lastPersonalData.dob, 'years', true))
          )
        : 0;

      // all the conditions are met fail status

      const ageCondition = !(years >= 18 && years <= 55);
      const bankCondition = ![
        'Yes, I have an active bank account either in Sri Lanka or India',
        `No, I don't have one but I am willing to open a bank account either in Sri Lanka or India`
      ].includes(details.bankAccount);

      const cityCondition = false;

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
        details.residence
      );

      const englishIdCondition = details.documentsList.includes(
        'I do not have any of the above documents in English'
      );

      if (
        ageCondition ||
        bankCondition ||
        cityCondition ||
        residingCountryCondition ||
        englishIdCondition
      ) {
        // failing
        const errors = [];
        const contents = [];

        ageCondition &&
          errors.push('Not fitting the minimum/maximum age criteria');

        bankCondition &&
          errors.push(
            'Do not currently hold or not willing to open a bank account in SL or India'
          );

        if (cityCondition) {
          errors.push(
            'Due to contractual obligations, as a result of you being a candidate from ' +
              details.state
          );
          contents.push(
            'However, we are happy to process your application in future, in the event you have relocated out from a radius of 120km, from Ludhiana. Thus, to do the same, you can get in touch with us by sharing documentary proof of your current residential address(relocated address) as a reply to this email.'
          );
        }

        if (residingCountryCondition) {
          // errors.push(
          //   ' you are currently residing in a country where data protection and network regulations prohibit the delivery of sessions.'
          // );
          errors.push(
            'you are currently residing in a country where we do not operate in '
          );
        }

        if (englishIdCondition && details.nationality === 'Sri Lankan') {
          errors.push('your NIC/Passport/Driving Liscence is not in English');
          contents.push(
            'However, if you are able to submit the identical document in English, we would be pleased to review it'
          );
        } else if (englishIdCondition && details.nationality === 'Indian') {
          errors.push(
            'your Aadhar Card/Passport/Driving Liscence is not in English'
          );
          contents.push(
            'However, if you are able to submit the identical document in English, we would be pleased to review it'
          );
        } else if (englishIdCondition && details.nationality === 'Other') {
          errors.push('Your Passport is not in English');
        }

        if (errors.length > 1) {
          contents.splice(0);
        }

        await this.mail.sendFailEmail(
          lastPersonalData.firstName,
          username,
          errors,
          contents
        );

        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: userId
          },
          create: {
            candidate_id: userId,
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
      } else if (nationalityCondition || workingCondition) {
        // holding
        await this.mail.sendOnHoldEmail(lastPersonalData.firstName, username);
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: userId
          },
          create: {
            candidate_id: userId,
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
      } else {
        // if not onhold - update candidate level to 2
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: userId
          },
          create: {
            candidate_id: userId,
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
        // await this.mail.sendPassEmailv2(lastPersonalData.firstName, username);
      }

      // gra extra registration data
      await this.prisma.graRegistrationData.upsert({
        where: {
          tspId: userId
        },
        create: {
          tspId: userId,
          whichPartner: details.working,
          knewAboutUs: details.aboutUs,
          bankStatus: details.bankAccount,
          documentsList: details.documentsList,
          progress: 2
        },
        update: {
          tspId: userId,
          whichPartner: details.working,
          knewAboutUs: details.aboutUs,
          bankStatus: details.bankAccount,
          documentsList: details.documentsList,
          progress: 2
        }
      });

      return { success: true, details };
    } catch (error) {
      return { success: false, error };
    }
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
          NTProfile: {
            select: {
              job_title: true,
              division: true
            }
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
      if (user.level && [1, 2].includes(user.level)) {
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
          ntJobTitle:
            user?.NTProfile && user?.NTProfile.job_title
              ? user?.NTProfile.job_title
              : null,
          ntDivision:
            user?.NTProfile && user?.NTProfile.division
              ? user?.NTProfile.division
              : null,
          profilePicture: user.hris_personal_data[0]?.ppUrl ?? ''
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async getUserLevelThreeAll(details: UserDetailsDto) {
    try {
      const userLevel = await this.prisma.user.findMany({
        where: {
          level: 3,
          hris_access: {
            some: {
              access: 1,
              module: 'AP_INT'
            }
          }
        },
        select: {
          tsp_id: true,
          username: true,
          NTProfile: {
            select: {
              short_name: true
            }
          },
          approved_contact_data: {
            select: {
              workEmail: true
            }
          },
          approved_personal_data: {
            select: {
              shortName: true
            }
          }
        }
      });

      return {
        success: true,
        data: userLevel.map((item) => {
          const {
            tsp_id,
            username,
            NTProfile,
            approved_contact_data,
            approved_personal_data,
            ...rest
          } = item;
          return {
            ...rest,
            interviewer_name:
              approved_personal_data &&
              approved_personal_data?.shortName &&
              approved_personal_data?.shortName != ''
                ? approved_personal_data?.shortName
                : NTProfile &&
                  NTProfile.short_name &&
                  NTProfile.short_name != ''
                ? NTProfile.short_name
                : username,
            interviewer_id: tsp_id,
            interviewer_email: username
          };
        })
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async candidateNamesInUserTableAll(details: UserDetailsDto) {
    try {
      const userLevel = await this.prisma.user.findMany({
        where: {
          level: 2
        },
        select: {
          tsp_id: true,
          approved_contact_data: {
            select: {
              workEmail: true
            }
          },
          approved_personal_data: {
            select: {
              shortName: true
            }
          }
        }
      });

      const filter = userLevel.map((item) => {
        return {
          candidate_name:
            (item.approved_personal_data?.shortName ?? '') +
            ' - ' +
            item.tsp_id,
          candidate_id: item.tsp_id,
          candidate_email: item.approved_contact_data?.workEmail ?? ''
        };
      });

      const arr = [];
      const data = [];
      for (let j = 0; j <= filter.length - 1; j++) {
        if (!arr.includes(filter[j].candidate_id)) {
          data.push(filter[j]);
          arr.push(filter[j].candidate_id);
        }
      }
      //sort names in ascending order
      data.sort((a, b) => a.candidate_name.localeCompare(b.candidate_name));

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async candidateNamesInBookingStatusTableAll(details: UserDetailsDto) {
    try {
      const userLevel = await this.prisma.bookingStatus.findMany({
        where: {
          candidate: {
            level: 2
          }
        },
        select: {
          candidate: {
            select: {
              tsp_id: true,
              approved_contact_data: {
                select: {
                  workEmail: true
                }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });

      const filter = userLevel.map((item) => {
        const { candidate, ...rest } = item;
        return {
          ...rest,
          candidate_name:
            (candidate.approved_personal_data?.shortName ?? '') +
            ' - ' +
            candidate.tsp_id,
          candidate_id: candidate.tsp_id,
          candidate_email: candidate.approved_contact_data?.workEmail ?? ''
        };
      });

      const arr = [];
      const data = [];
      for (let j = 0; j <= filter.length - 1; j++) {
        if (!arr.includes(filter[j].candidate_id)) {
          data.push(filter[j]);
          arr.push(filter[j].candidate_id);
        }
      }
      //sort names in ascending order
      data.sort((a, b) => a.candidate_name.localeCompare(b.candidate_name));

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async interviewerNamesInBookingStatusTableAll(details: any) {
    //accepts optional fields startDate, endDate, date
    const startDate = details.startDate
      ? moment(details.startDate).startOf('date').toDate()
      : details.date
      ? moment(details.date).startOf('date').toDate()
      : null;
    const endDate = details.endDate
      ? moment(details.endDate).endOf('date').toDate()
      : details.date
      ? moment(details.date).endOf('date').toDate()
      : null;

    try {
      const userLevel = await this.prisma.bookingStatus.findMany({
        where: {
          date: startDate && endDate ? { gte: startDate, lte: endDate } : {},
          interviewer: {
            level: 3
          }
        },
        select: {
          interviewer: {
            select: {
              tsp_id: true,
              username: true,
              NTProfile: {
                select: { short_name: true }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });

      const filter = userLevel.map((item) => {
        const { interviewer, ...rest } = item;

        //first check in ntd then as a fallback cehck in hris tables
        const temp_interviewer_name =
          interviewer.approved_personal_data &&
          interviewer.approved_personal_data?.shortName &&
          interviewer.approved_personal_data?.shortName != ''
            ? interviewer.approved_personal_data?.shortName
            : interviewer.NTProfile &&
              interviewer.NTProfile.short_name &&
              interviewer.NTProfile.short_name != ''
            ? interviewer.NTProfile.short_name
            : interviewer.username;

        return {
          ...rest,
          interviewer_name: temp_interviewer_name + ' - ' + interviewer.tsp_id,
          interviewer_id: interviewer.tsp_id,
          interviewer_email: interviewer.username
        };
      });
      const arr = [];
      const data = [];
      for (let j = 0; j <= filter.length - 1; j++) {
        if (!arr.includes(filter[j].interviewer_id)) {
          data.push(filter[j]);
          arr.push(filter[j].interviewer_id);
        }
      }
      //sort names in ascending order
      data.sort((a, b) => a.interviewer_name.localeCompare(b.interviewer_name));

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async candidateNamesInBookingStatusTableBooked(
    details: CandidateNamesInBookingStatusTableBookedRequestDto
  ) {
    try {
      const userLevel = await this.prisma.bookingStatus.findMany({
        where: {
          candidate: {
            level: 2
          },
          status: 3,
          date: {
            equals: new Date(moment(details.date).format('YYYY-MM-DD'))
          }
        },
        select: {
          candidate: {
            select: {
              tsp_id: true,
              approved_contact_data: true,
              approved_personal_data: true
            }
          }
        }
      });

      const filter = userLevel.map((item) => {
        const { candidate, ...rest } = item;
        return {
          ...rest,
          candidate_name:
            (candidate.approved_personal_data?.shortName ?? '') +
            ' - ' +
            candidate.tsp_id,
          candidate_id: candidate.tsp_id,
          candidate_email: candidate.approved_contact_data?.workEmail ?? ''
        };
      });

      const arr = [];
      const data = [];
      for (let j = 0; j <= filter.length - 1; j++) {
        if (!arr.includes(filter[j].candidate_id)) {
          data.push(filter[j]);
          arr.push(filter[j].candidate_id);
        }
      }
      //sort names in ascending order
      data.sort((a, b) => a.candidate_name.localeCompare(b.candidate_name));

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async interviewerNamesInBookingStatusTableBooked(
    details: InterviewerNamesInBookingStatusTableBookedRequestDto
  ) {
    try {
      const userLevel = await this.prisma.bookingStatus.findMany({
        where: {
          interviewer: {
            level: 3
          },
          status: 3,
          date: {
            equals: new Date(moment(details.date).format('YYYY-MM-DD'))
          }
        },
        select: {
          interviewer: {
            select: {
              tsp_id: true,
              username: true,
              NTProfile: {
                select: { short_name: true }
              },
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });

      const filter = userLevel.map((item) => {
        const { interviewer, ...rest } = item;

        const temp_interviewer_name =
          interviewer.approved_personal_data &&
          interviewer.approved_personal_data?.shortName &&
          interviewer.approved_personal_data?.shortName != ''
            ? interviewer.approved_personal_data?.shortName
            : interviewer.NTProfile &&
              interviewer.NTProfile.short_name &&
              interviewer.NTProfile.short_name != ''
            ? interviewer.NTProfile.short_name
            : interviewer.username;

        return {
          ...rest,
          interviewer_name: temp_interviewer_name + ' - ' + interviewer.tsp_id,
          interviewer_id: interviewer.tsp_id,
          interviewer_email: interviewer.username
        };
      });

      const arr = [];
      const data = [];
      for (let j = 0; j <= filter.length - 1; j++) {
        if (!arr.includes(filter[j].interviewer_id)) {
          data.push(filter[j]);
          arr.push(filter[j].interviewer_id);
        }
      }
      //sort names in ascending order
      data.sort((a, b) => a.interviewer_name.localeCompare(b.interviewer_name));

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUserDetailsBySearchingName(name: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          level: {
            equals: 2
          },
          approved_personal_data: {
            shortName: {
              contains: name
            }
          }
        },
        select: {
          tsp_id: true,
          approved_personal_data: {
            select: {
              shortName: true
            }
          }
        }
      });

      const data = users.map((d) => {
        return {
          tspId: d.tsp_id,
          name: d.approved_personal_data?.shortName ?? ''
        };
      });

      //get unique values only
      const getUniqueListBy = (arr, key) => {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
      };
      const data2 = getUniqueListBy(data, 'name');

      // const data2 = [...new Map(data.map(item => [item['name'], item])).values()]

      return { success: true, data: data2 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async adminUpdateUserDetails(details: UpdateUserDetailsDto) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const prevCandidateData = await prisma.candidateLevel.findUnique({
          where: {
            candidate_id: details.userId
          }
        });

        const { workEmail } = await prisma.approvedContactData.findUnique({
          where: {
            tspId: +details.userId
          }
        });

        if (prevCandidateData.step1 === 'On Hold') {
          const { id, tspId, ...rest } =
            await prisma.hrisPersonalData.findFirst({
              where: {
                tspId: +details.userId
              },
              orderBy: {
                id: 'desc'
              }
            });

          await prisma.hrisPersonalData.create({
            data: {
              tspId: +details.userId,
              ...rest,
              firstName: details.firstName,
              surname: details.lastName,
              shortName: details.firstName + ' ' + details.lastName,
              dob: new Date(details.birthDate).toISOString()
            }
          });

          await prisma.approvedPersonalData.update({
            where: {
              tspId: details.userId
            },
            data: {
              firstName: details.firstName,
              surname: details.lastName,
              shortName: details.firstName + ' ' + details.lastName,
              dob: new Date(details.birthDate).toISOString()
            }
          });

          let district = null;
          let state = null;
          if (details.residence === 'Sri Lanka') {
            district = details.district;
            details.state = details.district;
          } else if (details.residence === 'India') {
            state = details.state;
            details.district = details.state;
          }

          const {
            id: pdId,
            tspId: pdTspId,
            ...pdRest
          } = await prisma.hrisPersonalData.findFirst({
            where: {
              tspId: +details.userId
            },
            orderBy: {
              id: 'desc'
            }
          });

          await prisma.hrisContactData.create({
            data: {
              tspId: details.userId,
              ...pdRest,
              residingCountry:
                details.residence === 'Other'
                  ? details.otherCountry
                  : details.residence,
              residingDistrict: district,
              residingProvince: state,
              residingCity: details.city,
              mobileNumber: details.contactNumber
                .replace(' ', '')
                .replace('-', '')
            }
          });
          await prisma.hrisPersonalData.create({
            data: {
              tspId: details.userId,
              nationality:
                details.nationality === 'Other'
                  ? details.otherNationality
                  : details.nationality
            }
          });
          // Todo: approved tables has to updated

          await prisma.approvedContactData.update({
            where: {
              tspId: details.userId
            },
            data: {
              residingCountry:
                details.residence === 'Other'
                  ? details.otherCountry
                  : details.residence,
              residingDistrict: district,
              residingProvince: state,
              residingCity: details.city,
              mobileNumber: details.contactNumber
                .replace(' ', '')
                .replace('-', '')
            }
          });

          await prisma.approvedPersonalData.update({
            where: {
              tspId: details.userId
            },
            data: {
              nationality:
                details.nationality === 'Other'
                  ? details.otherNationality
                  : details.nationality
            }
          });

          // send onhold email
          // - age 18-55
          // - bank account - first two options
          // - work in TSG - not applicable
          // - indian - [Punjab, Himachal, Haryana] - some cities

          const years = details.birthDate
            ? Math.round(
                Math.abs(moment().diff(details.birthDate, 'years', true))
              )
            : 0;

          // all the conditions are met onhold status

          const ageCondition = !(years >= 18 && years <= 55);
          const bankCondition = ![
            'Yes, I have an active bank account either in Sri Lanka or India',
            `No, I don't have one but I am willing to open a bank account either in Sri Lanka or India`
          ].includes(details.bankAccount);
          const workingCondition = details.working !== 'Not Applicable';

          const cityCondition = false;

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

          if (
            ageCondition ||
            bankCondition ||
            workingCondition ||
            cityCondition
          ) {
            console.log('Again On Hold');
            // await this.mail.sendOnHoldEmail(details.firstName, workEmail);
          } else {
            // if not onhold - update candidate level to 2
            await prisma.candidateLevel.upsert({
              where: {
                candidate_id: details.userId
              },
              create: {
                candidate_id: details.userId,
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
            await this.mail.sendPassEmailv2(details.firstName, workEmail);
          }

          // gra extra registration data
          await prisma.graRegistrationData.upsert({
            where: {
              tspId: details.userId
            },
            create: {
              tspId: details.userId,
              whichPartner: details.working,
              bankStatus: details.bankAccount,
              progress: 2,
              knewAboutUs: details.knewAboutUs,
              documentsList: details.documentsList
            },
            update: {
              tspId: details.userId,
              whichPartner: details.working,
              bankStatus: details.bankAccount,
              progress: 2,
              knewAboutUs: details.knewAboutUs,
              documentsList: details.documentsList
            }
          });
        } else {
          const { id, tspId, ...rest } =
            await prisma.hrisPersonalData.findFirst({
              where: {
                tspId: +details.userId
              },
              orderBy: {
                id: 'desc'
              }
            });

          let district = null;
          let state = null;
          if (details.residence === 'Sri Lanka') {
            district = details.district;
            details.state = details.district;
          } else if (details.residence === 'India') {
            state = details.state;
            details.district = details.state;
          }

          await prisma.hrisPersonalData.create({
            data: {
              tspId: +details.userId,
              ...rest,
              firstName: details.firstName,
              surname: details.lastName,
              shortName: details.firstName + ' ' + details.lastName
            }
          });

          await prisma.approvedPersonalData.update({
            where: {
              tspId: details.userId
            },
            data: {
              firstName: details.firstName,
              surname: details.lastName,
              shortName: details.firstName + ' ' + details.lastName
            }
          });

          const {
            id: pdId,
            tspId: pdTspId,
            ...pdRest
          } = await prisma.hrisContactData.findFirst({
            where: {
              tspId: +details.userId
            },
            orderBy: {
              id: 'desc'
            }
          });

          await prisma.hrisContactData.create({
            data: {
              tspId: details.userId,
              ...pdRest,
              residingCountry:
                details.residence === 'Other'
                  ? details.otherCountry
                  : details.residence,
              residingDistrict: district,
              residingProvince: state,
              residingCity: details.city,
              mobileNumber: details.contactNumber
                .replace(' ', '')
                .replace('-', '')
            }
          });
          // await prisma.hrisPersonalData.create({
          //   data: {
          //     tspId: details.userId,
          //     nationality:
          //       details.nationality === 'Other'
          //         ? details.otherNationality
          //         : details.nationality
          //   }
          // });
          // Todo: approved tables has to updated

          await prisma.approvedContactData.update({
            where: {
              tspId: details.userId
            },
            data: {
              residingCountry:
                details.residence === 'Other'
                  ? details.otherCountry
                  : details.residence,
              residingDistrict: district,
              residingProvince: state,
              residingCity: details.city,
              mobileNumber: details.contactNumber
                .replace(' ', '')
                .replace('-', '')
            }
          });

          //Added to allow update knew about us field
          await prisma.graRegistrationData.upsert({
            where: {
              tspId: details.userId
            },
            create: {
              knewAboutUs: details.knewAboutUs,
              documentsList: details.documentsList
            },
            update: {
              knewAboutUs: details.knewAboutUs,
              documentsList: details.documentsList
            }
          });
        }
      });

      return { success: true, details };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async checkNIC(nic: string) {
    try {
      const foundNIC = await this.prisma.approvedPersonalData.findFirst({
        where: {
          nic
        }
      });
      return foundNIC
        ? { success: false, message: `${nic} is already exists` }
        : { success: true, message: `${nic} is available` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
