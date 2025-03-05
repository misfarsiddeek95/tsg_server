import { HttpException, Injectable } from '@nestjs/common';
import { SubmitPersonalContactInfoDto } from './gra-application.dto';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import moment = require('moment');

@Injectable()
export class GraApplicationService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  //Candidate/Nontutor: Fetch Personal Contact Info
  async fetchPersonalContactInfo(tspId: number) {
    try {
      if (!tspId) {
        throw new Error('TSP ID invalid');
      }
      const hrisPersonalDataFetched =
        await this.prisma.hrisPersonalData.findFirst({
          where: {
            tspId
          },
          orderBy: {
            id: 'desc'
          },
          select: {
            firstName: true,
            surname: true,
            gender: true,
            dob: true,
            age: true,
            nic: true,
            idLanguage: true
          }
        });
      const hrisContactDataFetched =
        await this.prisma.hrisContactData.findFirst({
          where: {
            tspId
          },
          orderBy: {
            id: 'desc'
          },
          select: {
            personalEmail: true,
            workEmail: true,
            mobileNumber: true,
            mobileNumberVerified: true,
            residingCountry: true,
            residingProvince: true,
            residingDistrict: true
          }
        });
      const hrisPersonalDataRecordCount =
        await this.prisma.hrisPersonalData.count({
          where: {
            tspId
          }
        });

      return {
        success: true,
        data: {
          ...hrisPersonalDataFetched,
          ...hrisContactDataFetched,
          ...(hrisPersonalDataRecordCount > 0
            ? { hrisPersonalDataRecordCount: hrisPersonalDataRecordCount }
            : {})
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: fetchPersonalContactInfo

  //Candidate: Submit Personal Contact Info
  async submitPersonalContactInfo(
    tspId: number,
    data: any
    // data: SubmitPersonalContactInfoDto
  ) {
    const now = new Date().toISOString();
    const { ...rest } = data;
    try {
      if (!tspId) {
        throw new Error('TSP ID invalid');
      }
      const hrisPersonalDataEx = await this.prisma.hrisPersonalData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        }
      });
      const { id: _, ...hrisPersonalDataExRest } = hrisPersonalDataEx || {};
      const hrisContactDataEx = await this.prisma.hrisContactData.findFirst({
        where: {
          tspId
        },
        orderBy: {
          id: 'desc'
        }
      });
      const { id: __, ...hrisContactDataExRest } = hrisContactDataEx || {};

      return this.prisma.$transaction(async (tx) => {
        const hrisPersonalDataFetched = await tx.hrisPersonalData.create({
          data: {
            tspId,
            ...hrisPersonalDataExRest,
            firstName: rest.firstName,
            surname: rest.surname,
            gender: rest.gender,
            dob: rest.dob,
            nic: rest.nic,
            idLanguage: rest.idLanguage,
            shortName: (rest.firstName + ' ' + rest.surname).trim(),
            age: rest.dob ? moment().diff(moment(rest.dob), 'years') : null,
            updatedAt: now,
            updatedBy: tspId,
            auditedAt: null,
            auditedBy: null
          },
          select: {
            firstName: true,
            surname: true,
            gender: true,
            dob: true,
            nic: true,
            idLanguage: true
          }
        });
        await tx.approvedPersonalData.update({
          where: { tspId: tspId },
          data: {
            firstName: rest.firstName,
            surname: rest.surname,
            shortName: (rest.firstName + ' ' + rest.surname).trim(),
            updatedFlag: 3,
            approvedAt: now,
            approvedBy: tspId
          }
        });

        const hrisContactDataFetched = await tx.hrisContactData.create({
          data: {
            tspId,
            ...hrisContactDataExRest,
            personalEmail: rest.personalEmail,
            workEmail: rest.workEmail,
            mobileNumber: rest.mobileNumber,
            mobileNumberVerified: rest.mobileNumberVerified,
            residingCountry: rest.residingCountry,
            residingProvince: rest.residingProvince,
            residingDistrict: rest.residingDistrict,
            updatedAt: now,
            updatedBy: tspId,
            auditedAt: null,
            auditedBy: null
          },
          select: {
            personalEmail: true,
            workEmail: true,
            mobileNumber: true,
            mobileNumberVerified: true,
            residingCountry: true,
            residingProvince: true,
            residingDistrict: true
          }
        });
        await tx.approvedContactData.update({
          where: { tspId: tspId },
          data: {
            workEmail: rest.workEmail,
            mobileNumber: rest.mobileNumber,
            mobileNumberVerified: rest.mobileNumberVerified,
            updatedFlag: 3,
            approvedAt: now,
            approvedBy: tspId
          }
        });

        const hrisPersonalDataRecordCount = await tx.hrisPersonalData.count({
          where: {
            tspId
          }
        });

        return {
          success: true,
          data: {
            ...hrisPersonalDataFetched,
            ...hrisContactDataFetched,
            ...(hrisPersonalDataRecordCount > 0
              ? { hrisPersonalDataRecordCount: hrisPersonalDataRecordCount }
              : {})
          }
        };
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: submitPersonalContactInfo

  //Candidate/Nontutor: Fetch Educational Qualification Info
  async fetchEducationalQualification(tspId: number) {
    try {
      if (!tspId) {
        throw new Error('TSP ID invalid');
      }
      const hrisEducationDataFetched =
        await this.prisma.hrisEducationData.findFirst({
          where: {
            tspId
          },
          orderBy: {
            id: 'desc'
          },
          select: {
            olSyllabus: true,
            olYear: true,
            olMaths: true,
            olEnglish: true
          }
        });
      const hrisWorkDataFetched = await this.prisma.hrisWorkExpData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          havePreTsg: true
        }
      });
      const hrisQualificationDataFetched =
        await this.prisma.hrisQualificationsData.findFirst({
          where: {
            tspId: tspId
          },
          orderBy: {
            id: 'desc'
          },
          select: {
            haveStartedHq: true,
            xother_quali_data: {
              select: {
                courseType: true,
                fieldStudy: true,
                hasCompleted: true,
                mainInst: true,
                affiInst: true
              }
            }
          }
        });
      const hrisQualificationDataFetchedFlat =
        hrisQualificationDataFetched &&
        hrisQualificationDataFetched.xother_quali_data[0]
          ? {
              haveStartedHq: hrisQualificationDataFetched.haveStartedHq,
              ...hrisQualificationDataFetched.xother_quali_data[0]
            }
          : hrisQualificationDataFetched ?? {};
      return {
        success: true,
        data: {
          ...hrisEducationDataFetched,
          ...(hrisQualificationDataFetched
            ? { haveStartedHq: hrisQualificationDataFetched.haveStartedHq }
            : {}),
          ...hrisQualificationDataFetchedFlat,
          ...hrisWorkDataFetched
        }
      };
    } catch (error) {
      console.log('error_fetchEducationalQualification', error);
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: fetchEducationalQualification

  //Candidate: Submit Educational Qualification Info
  async submitEducationalQualification(tspId: number, data: any) {
    const { ...rest } = data;
    const now = new Date().toISOString();

    try {
      if (!tspId) {
        throw new Error('TSP ID invalid');
      }
      const hrisEducationDataEx = await this.prisma.hrisEducationData.findFirst(
        {
          where: {
            tspId
          },
          orderBy: {
            id: 'desc'
          }
        }
      );
      const { id: __, ...hrisEducationDataExRest } = hrisEducationDataEx || {};
      const hrisWorkDataEx = await this.prisma.hrisWorkExpData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: {
          id: true,
          havePreTsg: true
        }
      });
      const hrisQualificationsDataEx =
        await this.prisma.hrisQualificationsData.findFirst({
          where: {
            tspId: tspId
          },
          orderBy: {
            id: 'desc'
          },
          select: {
            id: true,
            haveStartedHq: true,
            xother_quali_data: {
              select: {
                id: true,
                courseType: true,
                fieldStudy: true,
                hasCompleted: true,
                mainInst: true,
                affiInst: true
              }
            }
          }
        });

      return this.prisma.$transaction(async (tx) => {
        const hrisEducationDataFetched = await tx.hrisEducationData.create({
          data: {
            tspId,
            ...hrisEducationDataExRest,
            olSyllabus: rest.olSyllabus,
            olMaths: rest.olMaths,
            olEnglish: rest.olEnglish,
            olYear: rest.olYear ? +rest.olYear : null,
            updatedAt: now,
            updatedBy: tspId,
            auditedAt: null,
            auditedBy: null
          },
          select: {
            olSyllabus: true,
            olYear: true,
            olMaths: true,
            olEnglish: true
          }
        });

        let hrisWorkExpDataFetched = {};
        if (hrisWorkDataEx) {
          hrisWorkExpDataFetched = await tx.hrisWorkExpData.update({
            where: { id: hrisWorkDataEx.id },
            data: {
              tspId,
              havePreTsg: rest.havePreTsg,
              updatedAt: now,
              updatedBy: tspId,
              auditedAt: null,
              auditedBy: null
            },
            select: {
              havePreTsg: true
            }
          });
        } else {
          hrisWorkExpDataFetched = await tx.hrisWorkExpData.create({
            data: {
              tspId,
              havePreTsg: rest.havePreTsg,
              updatedAt: now,
              updatedBy: tspId,
              auditedAt: null,
              auditedBy: null
            },
            select: {
              havePreTsg: true
            }
          });
        }

        let hrisQualificationsDataFetched = {};
        let hrisQualificationsDataXotherFetched = {};
        if (
          hrisQualificationsDataEx &&
          hrisQualificationsDataEx.xother_quali_data[0]
        ) {
          hrisQualificationsDataFetched =
            await tx.hrisQualificationsData.update({
              where: { id: hrisQualificationsDataEx.id },
              data: {
                haveStartedHq: rest.haveStartedHq,
                updatedAt: now,
                updatedBy: tspId,
                auditedAt: null,
                auditedBy: null
              },
              select: {
                haveStartedHq: true
              }
            });
          hrisQualificationsDataXotherFetched = await tx.xotherQualiData.update(
            {
              where: { id: hrisQualificationsDataEx.xother_quali_data[0].id },
              data: {
                courseType: rest.courseType,
                fieldStudy: rest.fieldStudy,
                hasCompleted: rest.hasCompleted,
                mainInst: rest.mainInst,
                affiInst: rest.affiInst
              },
              select: {
                courseType: true,
                fieldStudy: true,
                hasCompleted: true,
                mainInst: true,
                affiInst: true
              }
            }
          );
        } else {
          hrisQualificationsDataFetched =
            await tx.hrisQualificationsData.create({
              data: {
                tspId: tspId,
                haveStartedHq: rest.haveStartedHq,
                updatedAt: now,
                updatedBy: tspId,
                auditedAt: null,
                auditedBy: null
              },
              select: {
                id: true,
                haveStartedHq: true
              }
            });
          if (rest.haveStartedHq === 'Yes') {
            hrisQualificationsDataXotherFetched =
              await tx.xotherQualiData.create({
                data: {
                  qId: hrisQualificationsDataFetched['id'],
                  tspId: tspId,
                  courseType: rest.courseType,
                  fieldStudy: rest.fieldStudy,
                  hasCompleted: rest.hasCompleted,
                  mainInst: rest.mainInst,
                  affiInst: rest.affiInst
                },
                select: {
                  courseType: true,
                  fieldStudy: true,
                  hasCompleted: true,
                  mainInst: true,
                  affiInst: true
                }
              });
          }
        }

        return {
          success: true,
          data: {
            ...hrisEducationDataFetched,
            ...hrisWorkExpDataFetched,
            ...hrisQualificationsDataFetched,
            ...hrisQualificationsDataXotherFetched
          }
        };
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: submitEducationalQualification

  //Candidate/Nontutor: Fetch Session Avilability
  async fetchGraSessionAvailability(tspId: number) {
    try {
      if (!tspId) {
        throw new Error('TSP ID invalid');
      }
      const [days, timeRange, graSlot] = await Promise.all([
        this.prisma.gOADaysOFWeek.findMany(),
        this.prisma.gRATimeRange.findMany(),
        this.prisma.gRASlot.findMany({
          where: {
            tspId: tspId
          }
        })
      ]);

      const result = days.map((day) => {
        return {
          [day.date]: timeRange.map((time) => {
            // Check if there is a matching entry in graSlot
            const isSelect = graSlot.some(
              (d) => d.timeRangeId === time.id && d.dateId === day.id
            );

            return {
              dayId: day.id,
              timeRangeId: time.id,
              timeRange: time.timeRange,
              isRequired: time.required,
              isSelect: isSelect // Set isSelect to true or false
            };
          })
        };
      });

      return { data: result };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: fetchGraSessionAvailability

  //Candidate: Submit Personal Contact Info
  async submitGraSessionAvailability(tspId: number, slots: any) {
    try {
      if (!tspId) {
        throw new Error('TSP ID invalid');
      }
      return this.prisma.$transaction(async (tx) => {
        await tx.gRASlot.deleteMany({
          where: {
            tspId: tspId
          }
        });

        await tx.gRASlot.createMany({
          data: slots.map((e) => {
            return {
              tspId: tspId,
              dateId: e.dayId,
              timeRangeId: e.timeRangeId,
              status: 1
            };
          })
        });

        const [days, timeRange, graSlot] = await Promise.all([
          tx.gOADaysOFWeek.findMany(),
          tx.gRATimeRange.findMany(),
          tx.gRASlot.findMany({
            where: {
              tspId: tspId
            }
          })
        ]);

        const result = days.map((day) => {
          return {
            [day.date]: timeRange.map((time) => {
              // Check if there is a matching entry in graSlot
              const isSelect = graSlot.some(
                (d) => d.timeRangeId === time.id && d.dateId === day.id
              );

              return {
                dayId: day.id,
                timeRangeId: time.id,
                timeRange: time.timeRange,
                isRequired: time.required,
                isSelect: isSelect // Set isSelect to true or false
              };
            })
          };
        });
        return { data: result };
      });
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: submitGraSessionAvailability

  //Candidate: Fetch Remaining Required Field list
  async remainingFieldsApplication(tspId: number) {
    try {
      if (!tspId) {
        throw new Error('TSP ID invalid');
      }
      const contactDetails = await this.prisma.approvedContactData.findUnique({
        where: {
          tspId: tspId
        },
        select: { residingCountry: true }
      });

      const emptyAllFields: Record<string, string[]> = {};

      const fieldSets = {
        PersonalData: [
          'firstName',
          'surname',
          'gender',
          'dob',
          'idLanguage',
          'nic'
        ],
        ContactData: [
          'personalEmail',
          'workEmail',
          'mobileNumber',
          'residingCountry',
          ...(contactDetails.residingCountry === 'Sri Lanka'
            ? ['mobileNumberVerified', 'residingDistrict']
            : ['residingProvince'])
        ],
        EducationData: ['olSyllabus', 'olYear', 'olMaths', 'olEnglish'],
        QualificationsData: ['haveStartedHq'],
        WorkExpData: ['havePreTsg']
      };
      let requiredFieldCount = Object.values(fieldSets).reduce(
        (count, arr) => count + arr.length,
        0
      );

      for (const tableName in fieldSets) {
        emptyAllFields[tableName] = await getEmptyFields(
          this.prisma,
          `hris${tableName}`,
          tspId,
          fieldSets[tableName]
        );
      }

      // find if gra avilability for candidate is empty
      const availabilityProgress = await this.prisma.gRASlot.count({
        where: {
          tspId: tspId,
          status: 1
        }
      });
      if (availabilityProgress === 0) {
        emptyAllFields['AvailabilityData'] = ['session'];
      }

      const lastQualiData = await this.prisma.hrisQualificationsData.findFirst({
        where: {
          tspId: tspId
        },
        orderBy: {
          id: 'desc'
        },
        select: { id: true, haveStartedHq: true }
      });

      if (lastQualiData && lastQualiData.haveStartedHq === 'Yes') {
        const QualificationsData = [
          'courseType',
          'fieldStudy',
          'hasCompleted',
          'mainInst'
        ];
        requiredFieldCount += QualificationsData.length;

        const xOtherQualiData = await this.prisma.xotherQualiData.findFirst({
          where: {
            qId: lastQualiData.id
          },
          orderBy: {
            id: 'asc'
          }
        });

        const qualiEmptyFields = QualificationsData.filter((field) => {
          return !xOtherQualiData || isFieldEmpty(xOtherQualiData[field]);
        });
        emptyAllFields['QualificationsData'] = qualiEmptyFields;
      }

      const remainingRequiredFieldCount = Object.values(emptyAllFields).reduce(
        (count, arr) => count + arr.length,
        0
      );
      const nextSectionToFill =
        remainingRequiredFieldCount === 0
          ? 'Bravo you have completed your application, Press Submit Application to submit.'
          : (emptyAllFields.PersonalData &&
              emptyAllFields.PersonalData.length > 0) ||
            (emptyAllFields.ContactData &&
              emptyAllFields.ContactData.length > 0)
          ? 'Complete this section by adding your Personal Details to continue your journey with us.'
          : (emptyAllFields.EducationData &&
              emptyAllFields.EducationData.length > 0) ||
            (emptyAllFields.QualificationsData &&
              emptyAllFields.QualificationsData.length > 0) ||
            (emptyAllFields.WorkExpData &&
              emptyAllFields.WorkExpData.length > 0)
          ? 'Complete next section by adding Professional Qualifications.'
          : availabilityProgress === 0
          ? 'Complete the final section by adding your Session Availability.'
          : 'Unknown';

      return {
        success: true,
        remainingFildsList: emptyAllFields,
        requiredFieldsCompleted: remainingRequiredFieldCount === 0,
        remainingFieldsDivision:
          requiredFieldCount -
          remainingRequiredFieldCount +
          '/' +
          requiredFieldCount,
        remainingFieldsPercentage:
          ((requiredFieldCount - remainingRequiredFieldCount) * 100) /
          requiredFieldCount,
        nextSectionToFill: nextSectionToFill
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  } //end: remainingFieldsApplication

  //Candidate: Submit Application form
  async submitApplication(tspId: number) {
    try {
      if (!tspId) {
        throw new Error('TSP ID invalid');
      }
      //check if required fields are filled
      const remainingFieldsApplicationFetched =
        await this.remainingFieldsApplication(tspId);
      if (
        remainingFieldsApplicationFetched &&
        Object.values(remainingFieldsApplicationFetched).some(
          (arr) => Array.isArray(arr) && arr.length > 0
        )
      ) {
        throw new HttpException('Mandatory fields pending', 400);
      }

      //check if candidate level is acceptable
      const bsCandidateLevelFetched =
        await this.prisma.candidateLevel.findUnique({
          where: { candidate_id: tspId }
        });
      if (
        !(
          bsCandidateLevelFetched &&
          bsCandidateLevelFetched.level === 2 &&
          !['Pass', 'Skip', 'Fail'].includes(bsCandidateLevelFetched.step2)
        )
      ) {
        throw new HttpException('Unable to submit Application', 400);
      }

      //fetch data to apply pass fail logic of application submission
      const fetchedPersonalContactInfo = await this.fetchPersonalContactInfo(
        tspId
      );
      const fetchedEducationalQualification =
        await this.fetchEducationalQualification(tspId);

      //conditions for failing a candidate
      const ageConditionPass =
        fetchedPersonalContactInfo.data.age &&
        fetchedPersonalContactInfo.data.age <= 55 &&
        fetchedPersonalContactInfo.data.age >= 18;
      const mathConditionPass =
        fetchedEducationalQualification.data.olMaths &&
        ['A', 'A*', 'B'].includes(fetchedEducationalQualification.data.olMaths);
      const englishConditionPass =
        fetchedEducationalQualification.data.olMaths &&
        ['A', 'A*', 'B', 'IELTS- 6.5 or more than 6.5'].includes(
          fetchedEducationalQualification.data.olEnglish
        );
      const hqConditionPass =
        fetchedEducationalQualification.data.haveStartedHq &&
        ['Yes'].includes(fetchedEducationalQualification.data.haveStartedHq);

      //update approved hris tables with collected info
      await this.prisma.approvedPersonalData.update({
        where: { tspId: tspId },
        data: {
          firstName: fetchedPersonalContactInfo.data.firstName,
          surname: fetchedPersonalContactInfo.data.surname,
          shortName: (
            fetchedPersonalContactInfo.data.firstName +
            ' ' +
            fetchedPersonalContactInfo.data.surname
          ).trim(),
          gender: fetchedPersonalContactInfo.data.gender,
          dob: fetchedPersonalContactInfo.data.dob,
          age: fetchedPersonalContactInfo.data.age,
          nic: fetchedPersonalContactInfo.data.nic
        }
      });
      await this.prisma.approvedContactData.update({
        where: { tspId: tspId },
        data: {
          personalEmail: fetchedPersonalContactInfo.data.personalEmail,
          workEmail: fetchedPersonalContactInfo.data.workEmail,
          mobileNumber: fetchedPersonalContactInfo.data.mobileNumber,
          residingCountry: fetchedPersonalContactInfo.data.residingCountry,
          residingProvince: fetchedPersonalContactInfo.data.residingProvince,
          residingDistrict: fetchedPersonalContactInfo.data.residingDistrict
        }
      });

      if (
        !(
          ageConditionPass &&
          mathConditionPass &&
          englishConditionPass &&
          hqConditionPass
        )
      ) {
        //fail outcome
        const reasonsArray = [];
        !mathConditionPass &&
          reasonsArray.push(
            '<b>O/L Mathematics:</b> We require a minimum grade of B in O/L Mathematics, and your result does not meet this criterion.<br>'
          );
        !englishConditionPass &&
          reasonsArray.push(
            '<b>O/L English or IELTS:</b> We require a minimum grade of B in O/L English or an IELTS score of 6.5 or higher. Your result does not meet this requirement.'
          );
        !hqConditionPass &&
          reasonsArray.push(
            '<b>Higher Education:</b> Our selection criteria include the pursuit or completion of higher education, which is a requirement that your application does not meet.'
          );
        !ageConditionPass &&
          reasonsArray.push(
            '<b>Age Requirement:</b> We require candidates to be between 18 and 55 years of age, and unfortunately, you do not meet this age requirement at this time.'
          );
        console.log('reasonsArray', reasonsArray);

        let specialNoteString = 'fail_application';
        specialNoteString =
          !mathConditionPass || !mathConditionPass
            ? specialNoteString + '_ol'
            : specialNoteString;
        specialNoteString = !hqConditionPass
          ? specialNoteString + '_hq'
          : specialNoteString;
        specialNoteString = !ageConditionPass
          ? specialNoteString + '_age'
          : specialNoteString;

        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: tspId
          },
          create: {
            candidate_id: tspId,
            level: 2,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step2UpdatedAt: new Date().toISOString(),
            step1: 'Skip',
            step2: 'Fail',
            specialNote: specialNoteString
          },
          update: {
            level: 2,
            updatedAt: new Date().toISOString(),
            step2UpdatedAt: new Date().toISOString(),
            step2: 'Fail',
            specialNote: specialNoteString
          }
        });

        await this.mailService.sendGraApplicationFailEmail(
          fetchedPersonalContactInfo.data.workEmail,
          fetchedPersonalContactInfo.data.firstName,
          reasonsArray
        );

        return {
          success: true,
          message: 'application submitted',
          outcome: 'Fail'
        };
      } else {
        //pass outcome
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: tspId
          },
          create: {
            candidate_id: tspId,
            level: 3,
            updatedAt: new Date().toISOString(),
            step1UpdatedAt: new Date().toISOString(),
            step2UpdatedAt: new Date().toISOString(),
            step1: 'Skip',
            step2: 'Pass'
          },
          update: {
            level: 3,
            updatedAt: new Date().toISOString(),
            step2UpdatedAt: new Date().toISOString(),
            step2: 'Pass'
          }
        });

        await this.mailService.sendGraApplicationPassEmail(
          fetchedPersonalContactInfo.data.workEmail,
          fetchedPersonalContactInfo.data.firstName
        );

        return {
          success: true,
          message: 'application submitted',
          outcome: 'Pass'
        };
      }
    } catch (error) {
      throw new HttpException(error.message, 400);
      // throw new HttpException({ success: false, error }, 400);
    }
  } //end: submitApplication
}

// Define a function to get empty fields for a specific table
async function getEmptyFields(prisma, tableName, userId, mandatoryFields) {
  const emptyMandatoryFields = await prisma[tableName].findFirst({
    where: {
      tspId: userId
    },
    orderBy: {
      id: 'desc'
    }
  });

  const emptyFields = mandatoryFields.filter((field) => {
    return !emptyMandatoryFields || isFieldEmpty(emptyMandatoryFields[field]);
  });

  return emptyFields;
}

// Define a function to check if a field is empty
function isFieldEmpty(fieldValue: string | number) {
  return (
    fieldValue === null ||
    fieldValue === undefined ||
    fieldValue === '' ||
    fieldValue === 0
  );
}
