import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma.service';
import { MailService } from './../../mail/mail.service';
import * as moment from 'moment';
import { CreateEducationDto } from '../dtos/education.dto';
import { FlexiUserSubmitDto } from '../../flexiquiz/user/user.dto';
import { UserService } from '../../flexiquiz/user/user.service';
import { ExamService } from '../../flexiquiz/exam/exam.service';

@Injectable()
export class EducationService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private userService: UserService,
    private examService: ExamService
  ) {}

  async educationDetails(
    { userId }: { userId: number },
    details: CreateEducationDto
  ) {
    try {
      const createdEducation = await this.prisma.hrisEducationData.create({
        data: {
          tspId: userId,
          olState: details.olState,
          olSyllabus: details.olSyllabus,
          olMaths: details.olMaths,
          olEnglish: details.olEnglish,
          alSyllabus: details.alSyllabus,
          alSubject1: 'English',
          alSubject1Result: details.alEnglish,
          other: details.other,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        },
        select: {
          tspId: true,
          olState: true,
          olSyllabus: true,
          olMaths: true,
          olEnglish: true,
          alSyllabus: true,
          alSubject1: true,
          alSubject1Result: true,
          other: true
        }
      });

      await this.prisma.approvedEducationData.upsert({
        where: {
          tspId: userId
        },
        update: {
          olState: details.olState,
          olSyllabus: details.olSyllabus,
          olMaths: details.olMaths,
          olEnglish: details.olEnglish,
          alSyllabus: details.alSyllabus,
          alSubject1: 'English',
          alSubject1Result: details.alEnglish,
          other: details.other
        },
        create: {
          tspId: userId,
          olState: details.olState,
          olSyllabus: details.olSyllabus,
          olMaths: details.olMaths,
          olEnglish: details.olEnglish,
          alSyllabus: details.alSyllabus,
          alSubject1: 'English',
          alSubject1Result: details.alEnglish,
          other: details.other
        }
      });

      // if secondary tertiary education is completed then check for conditions to send emails
      const result = await this.checkSTEM({ userId });

      return { success: true, details: createdEducation, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getEducationDetails({ userId }: { username: string; userId: number }) {
    try {
      const education = await this.prisma.hrisEducationData.findFirst({
        where: {
          tspId: userId
        }
      });
      const tertiary = await this.prisma.xotherQualiData.findMany({
        where: {
          tspId: userId
        }
      });
      return {
        success: true,
        data: {
          secondary: education,
          tertiary: tertiary.length > 0 ? tertiary : null
        }
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  async checkSTEM({ userId }: { userId: number }) {
    // const studyFields = [
    //   { subject: 'Accounting / CIMA / ACCA / AAT', score: 1 },
    //   { subject: 'Aeronautical Engineering', score: 1 },
    //   { subject: 'Aerospace Systems Engineering', score: 1 },
    //   { subject: 'Agricultural Technology', score: 1 },
    //   { subject: 'Aircraft Engineering', score: 1 },
    //   { subject: 'Analytical Chemistry', score: 1 },
    //   { subject: 'Animation and Visual Effects', score: 1 },
    //   { subject: 'Applied Mathematics', score: 1 },
    //   { subject: 'Architecture', score: 1 },
    //   { subject: 'Art, Fashion and Interior Design', score: 0 },
    //   { subject: 'Automotive Engineering', score: 1 },
    //   { subject: 'Banking', score: 1 },
    //   { subject: 'Biochemistry', score: 1 },
    //   { subject: 'Bioinformatics', score: 1 },
    //   {
    //     subject: 'Biomedical / Biomedical Engineering / Microbiology',
    //     score: 1
    //   },
    //   { subject: 'Biotechnology', score: 1 },
    //   { subject: 'Business Analytics', score: 1 },
    //   { subject: 'Business Management / Business Administration', score: 1 },
    //   { subject: 'Business Statistics', score: 1 },
    //   { subject: 'Business Studies', score: 1 },
    //   { subject: 'Chemical Engineering', score: 1 },
    //   { subject: 'Chemistry', score: 1 },
    //   { subject: 'Civil Engineering', score: 1 },
    //   { subject: 'Computer Networking', score: 1 },
    //   { subject: 'Computer Science', score: 1 },
    //   { subject: 'Computer Science Engineering', score: 1 },
    //   { subject: 'Computing and Systems Development', score: 1 },
    //   { subject: 'Cyber Security', score: 1 },
    //   { subject: 'Data Science', score: 1 },
    //   { subject: 'Design', score: 0 },
    //   { subject: 'Early Childhood Education', score: 1 },
    //   { subject: 'Economics and Management', score: 1 },
    //   { subject: 'Education / Teaching', score: 1 },
    //   { subject: 'Electrical Engineering.', score: 1 },
    //   { subject: 'Electronic Engineering', score: 1 },
    //   { subject: 'Environmental Management', score: 1 },
    //   { subject: 'Environmental Management and Forestry', score: 1 },
    //   { subject: 'Finance / Financial Management', score: 1 },
    //   { subject: 'Financial Mathematics', score: 1 },
    //   { subject: 'Food Science and Technology', score: 1 },
    //   { subject: 'Graphic Designing', score: 1 },
    //   { subject: 'Health Sciences', score: 0 },
    //   { subject: 'History and Civilization', score: 0 },
    //   { subject: 'Human Resource Management', score: 0 },
    //   { subject: 'Industrial Education', score: 1 },
    //   { subject: 'Industrial Statistics', score: 1 },
    //   { subject: 'Information Systems', score: 1 },
    //   { subject: 'International Business and Finance', score: 1 },
    //   { subject: 'International Relations', score: 1 },
    //   { subject: 'Laboratory Technology', score: 1 },
    //   { subject: 'Languages', score: 0 },
    //   { subject: 'Law', score: 0 },
    //   { subject: 'Logistic Management', score: 1 },
    //   { subject: 'Management and Marketing', score: 1 },
    //   { subject: 'Marketing', score: 1 },
    //   { subject: 'Mathematics', score: 1 },
    //   { subject: 'Mechanical Engineering', score: 1 },
    //   { subject: 'Mechatronics Engineering', score: 1 },
    //   { subject: 'Media', score: 0 },
    //   { subject: 'Medical Science / Laboratory Science', score: 1 },
    //   { subject: 'Medicine / Pre Medicine', score: 1 },
    //   { subject: 'Natural science', score: 1 },
    //   { subject: 'Network & Systems Administration', score: 1 },
    //   { subject: 'Network Engineering', score: 1 },
    //   { subject: 'Pharmaceutical Science', score: 1 },
    //   { subject: 'Physical Science / Applied Science', score: 1 },
    //   { subject: 'Physics', score: 1 },
    //   { subject: 'Population Genetics', score: 1 },
    //   { subject: 'Psychology', score: 1 },
    //   { subject: 'Pure Mathematics', score: 1 },
    //   { subject: 'Quantity Surveying', score: 1 },
    //   { subject: 'Social Science', score: 0 },
    //   { subject: 'Software Engineering', score: 1 },
    //   { subject: 'Telecommunications Engineering', score: 1 },
    //   { subject: 'Tourism & Hospitality', score: 0 },
    //   { subject: 'Transport and Logistics Management', score: 1 },
    //   { subject: 'Web programming', score: 1 },
    //   { subject: 'Zoology / Botany', score: 1 },
    //   { subject: 'Other', score: 0 }
    // ];

    try {
      const userDetails = await this.prisma.user.findUnique({
        where: { tsp_id: userId },
        include: {
          approved_personal_data: {
            select: {
              firstName: true,
              surname: true
            }
          },
          approved_contact_data: {
            select: {
              residingCountry: true,
              workEmail: true
            }
          },
          hris_contact_data: {
            select: {
              residingCountry: true
            }
          },
          hris_education_data: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          },
          hris_qualifications_data: {
            orderBy: {
              id: 'desc'
            },
            take: 1,
            include: {
              xother_quali_data: true
            }
          }
        }
      });

      // const secondaryEducation = await this.prisma.hrisEducationData.findFirst({
      //   where: {
      //     tsp_id: userId
      //   },
      //   orderBy: {
      //     id: 'desc'
      //   }
      // });
      const secondaryEducation = userDetails.hris_education_data[0];
      const tertiaryEducation =
        userDetails.hris_qualifications_data[0].xother_quali_data;

      let scoreSL = 0;
      let bonus = false; // if true exam will be skipped
      let passFailStatus = false;

      // 1. Not meeting Maths Qualifications AND / OR
      // 2. Not meeting English Qualifications AND / OR
      // 3. Not meeting higher education qualifications
      let englishCondition = false;
      let mathsCondition = false;
      let higherEducationCondition = false;

      if (
        (secondaryEducation &&
          tertiaryEducation &&
          userDetails.approved_contact_data.residingCountry === 'Sri Lanka') ||
        (tertiaryEducation &&
          userDetails.approved_contact_data.residingCountry === 'India')
      ) {
        if (secondaryEducation) {
          if (secondaryEducation.olState === 'Completed') {
            if (secondaryEducation.olSyllabus === 'Local') {
              // What was your Local O/Level Maths result?
              if (['A', 'B', 'C'].includes(secondaryEducation.olMaths)) {
                scoreSL += 1;
                mathsCondition = true;
              }

              // What was your Local O/Level English result?
              // What did you obtain for your A/Level General English?
              // Have you followed any additional programme specificially for English?
              if (
                ['A'].includes(secondaryEducation.olEnglish) ||
                ['A', 'B'].includes(secondaryEducation.alSubject1Result) ||
                [
                  'Completed : IELTS - score more than 6.5',
                  'Completed other : 1 year course (minimum)'
                ].includes(secondaryEducation.other)
              ) {
                scoreSL += 1;
                englishCondition = true;
              }
            } else if (secondaryEducation.olSyllabus === 'London') {
              // What was your Local O/Level Maths result?
              if (['A*', 'A', 'B', 'C'].includes(secondaryEducation.olMaths)) {
                scoreSL += 1;
                mathsCondition = true;
              }
              // What was your Local O/Level English result?
              // What did you obtain for your A/Level General English?
              // Have you followed any additional programme specificially for English?
              if (
                ['A*', 'A', 'B', 'C'].includes(secondaryEducation.olEnglish) ||
                ['A*', 'A', 'B', 'C'].includes(
                  secondaryEducation.alSubject1Result
                ) ||
                [
                  'Completed : IELTS - score more than 6.5',
                  'Completed other : 1 year course (minimum)'
                ].includes(secondaryEducation.other)
              ) {
                scoreSL += 1;
                englishCondition = true;
              }
            }
          }
        }

        const allowedQualifications = [
          'Diploma / Level 4',
          'Higher National Diploma / Level 5',
          'Professional Qualification / Level 6',
          'Degree / Level 6',
          'Masters / Level 7',
          'Phd'
        ];

        const allowedWithStatorMathModule = [
          'Diploma / Level 4',
          'Higher National Diploma / Level 5'
        ];

        const skipMathQualifications = [
          'Degree / Level 6',
          'Masters / Level 7',
          'Phd'
        ];

        const discardFieldsofStudy = [
          'Design',
          'History and Civilization',
          'Languages',
          'Law',
          'Media',
          'Tourism & Hospitality',
          'Early Childhood Education',
          'Graphic Designing'
        ];

        if (tertiaryEducation) {
          // first condition - any course belongs to allowedQualifications
          // second condition - ?
          const conditions = {
            first: false,
            second: false
          };

          tertiaryEducation.forEach((qualification) => {
            if (
              allowedQualifications.includes(qualification.courseType) &&
              !discardFieldsofStudy.includes(qualification.fieldStudy)
            ) {
              // if (
              //   moment(qualification.completion_year).isBefore(
              //     moment().startOf('month')
              //   )
              // ) {
              conditions.first = conditions.first || true;

              if (qualification.hasMathStat !== null) {
                if (
                  allowedWithStatorMathModule.includes(
                    qualification.courseType
                  ) &&
                  qualification.hasMathStat === true
                ) {
                  conditions.second = conditions.second || true;
                } else if (qualification.hasMathStat === true) {
                  conditions.second = conditions.second || true;
                }
              } else {
                conditions.second = conditions.second || true;
              }
            }
            // }
          });

          scoreSL =
            scoreSL +
            Object.values(conditions).filter((condition) => condition).length;

          higherEducationCondition = conditions.first && conditions.second;

          // const qualified = tertiaryEducation.filter((qualification) => {
          //   return allowedQualifications.includes(qualification.course_type);
          // });

          // if (qualified.length > 0) {
          //   scoreSL += 1;
          // }

          // // const stemOrMath = qualified.filter((qualification) => {
          // //   return studyFields.find(
          // //     (field) =>
          // //       (field.subject === qualification.field_study &&
          // //         field.score === 1) ||
          // //       (field.subject === qualification.field_study &&
          // //         qualification.has_math_stat)
          // //   )
          // //     ? true
          // //     : false;
          // // });

          // // check if there is a math / stat module if it is not stem
          // const qualifiedByMathorStatModule = tertiaryEducation.filter(
          //   (qualification) => {
          //     return (
          //       allowedWithStatorMathModule.includes(
          //         qualification.course_type
          //       ) && qualification.has_math_stat
          //     );
          //   }
          // );

          // const qualifiedByMathorStatModuleCheckBack =
          //   qualifiedByMathorStatModule.flatMap((qualification) => {
          //     return [
          //       {
          //         field_of_qualification: qualification.field_study,
          //         is_stem: 1
          //       },
          //       {
          //         field_of_qualification: qualification.field_study,
          //         category: 'Science'
          //       },
          //       {
          //         field_of_qualification: qualification.field_study,
          //         category: 'Technology'
          //       }
          //     ];
          //   });

          // console.log(
          //   'qualifiedByMathorStatModule',
          //   qualifiedByMathorStatModule
          // );

          // const fieldStudies = qualified.map((qualification) => {
          //   return {
          //     field_of_qualification: qualification.field_study,
          //     is_stem: 1
          //   };
          // });
          // console.log(fieldStudies);
          // const stemOrMath = await this.prisma.stemCriteria.findMany({
          //   where: {
          //     OR: fieldStudies
          //   }
          // });

          // if (stemOrMath.length > 0 || qualifiedByMathorStatModule.length > 0) {
          //   scoreSL += 1;
          // }

          // check course type within the list of allowed qualifications and the year of completion is smaller than the current year
          const qualifiedForSkipMath = tertiaryEducation.filter(
            (qualification) =>
              skipMathQualifications.includes(qualification.courseType) &&
              moment(qualification.completionYear).isBefore(
                moment().startOf('month')
              )
          );

          const fieldStudiesForEngineering = qualifiedForSkipMath.flatMap(
            (qualification) => {
              return [
                {
                  field_of_qualification: qualification.fieldStudy,
                  category: 'Engineering'
                },
                {
                  field_of_qualification: qualification.fieldStudy,
                  category: 'Maths'
                }
              ];
            }
          );

          const engineering = await this.prisma.stemCriteria.findMany({
            where: {
              OR: fieldStudiesForEngineering
            }
          });

          if (engineering.length > 0) {
            bonus = true;
          }
        }

        const errors = [];

        if (userDetails.approved_contact_data.residingCountry === 'Sri Lanka') {
          !mathsCondition &&
            errors.push(
              'Not meeting the expected level of Maths qualification'
            );
          !englishCondition &&
            errors.push(
              'Not meeting the expected level of English language qualification.'
            );
          !higherEducationCondition &&
            errors.push(
              'Not meeting the expected level of Higher educational qualification.'
            );
        } else {
          !higherEducationCondition &&
            errors.push(
              'Not meeting the expected level of Higher educational qualification.'
            );
        }

        if (userDetails.approved_contact_data.residingCountry === 'Sri Lanka') {
          if (scoreSL == 4) {
            // return { type: 'SL', pass: true, score: scoreSL };
            if (bonus) {
              // If Candidate has done stem related qulification

              // const flexiCandidate =
              //   await this.prisma.flexiCandidate.findUnique({
              //     where: {
              //       tsp_id: userId
              //     },
              //     include: {
              //       FlexiExam: {
              //         orderBy: {
              //           id: 'desc'
              //         },
              //         take: 1
              //       }
              //     }
              //   });

              // const flexiCandidateExamId = flexiCandidate.FlexiExam[0].id;

              // await this.prisma.flexiCandidateExam.update({
              //   where: {
              //     id: flexiCandidateExamId
              //   },
              //   data: {
              //     exam_status: 4
              //   }
              // });

              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: userId
                },
                create: {
                  candidate_id: userId,
                  level: 4,
                  updatedAt: new Date().toISOString(),
                  step2UpdatedAt: new Date().toISOString(),
                  step2: 'Pass',
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Pass'
                },
                update: {
                  level: 4,
                  updatedAt: new Date().toISOString(),
                  step2UpdatedAt: new Date().toISOString(),
                  step2: 'Pass',
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Pass'
                }
              });

              await this.prisma.educationResult.create({
                data: {
                  tspId: userId,
                  score: scoreSL,
                  bonus: true,
                  examStatus: 'passed'
                }
              });

              await this.mail.sendQulificationBonusEmail(
                userDetails.approved_personal_data?.firstName ?? '',
                userDetails.username
              );
            } else {
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: userId
                },
                create: {
                  candidate_id: userId,
                  level: 3,
                  updatedAt: new Date().toISOString(),
                  step2UpdatedAt: new Date().toISOString(),
                  step2: 'Pass'
                },
                update: {
                  level: 3,
                  updatedAt: new Date().toISOString(),
                  step2UpdatedAt: new Date().toISOString(),
                  step2: 'Pass'
                }
              });
              await this.prisma.educationResult.create({
                data: {
                  tspId: userId,
                  score: scoreSL,
                  bonus: false,
                  examStatus: 'passed'
                }
              });

              await this.prisma.graRegistrationData.update({
                where: {
                  tspId: userId
                },
                data: {}
              });

              await this.mail.sendQulificationPassEmail(
                userDetails.approved_personal_data?.firstName ?? '',
                userDetails.username
              );
            }

            passFailStatus = true;
          } else {
            await this.prisma.candidateLevel.upsert({
              where: {
                candidate_id: userId
              },
              create: {
                candidate_id: userId,
                updatedAt: new Date().toISOString(),
                step2UpdatedAt: new Date().toISOString(),
                step2: 'Fail'
              },
              update: {
                updatedAt: new Date().toISOString(),
                step2UpdatedAt: new Date().toISOString(),
                step2: 'Fail'
              }
            });

            await this.prisma.educationResult.create({
              data: {
                tspId: userId,
                score: scoreSL,
                bonus: false,
                examStatus: 'failed'
              }
            });

            await this.mail.sendQulificationFailEmail(
              userDetails.approved_personal_data?.firstName ?? '',
              userDetails.username,
              errors
            );
          }
        } else if (
          userDetails.approved_contact_data.residingCountry === 'India'
        ) {
          if (scoreSL === 2) {
            if (bonus) {
              // const flexiCandidate =
              //   await this.prisma.flexiCandidate.findUnique({
              //     where: {
              //       tsp_id: userId
              //     },
              //     include: {
              //       FlexiExam: {
              //         orderBy: {
              //           id: 'desc'
              //         },
              //         take: 1
              //       }
              //     }
              //   });

              // const flexiCandidateExamId = flexiCandidate.FlexiExam[0].id;

              // await this.prisma.flexiCandidateExam.update({
              //   where: {
              //     id: flexiCandidateExamId
              //   },
              //   data: {
              //     exam_status: 4
              //   }
              // });

              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: userId
                },
                create: {
                  candidate_id: userId,
                  level: 4,
                  updatedAt: new Date().toISOString(),
                  step2UpdatedAt: new Date().toISOString(),
                  step2: 'Pass',
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Pass'
                },
                update: {
                  level: 4,
                  updatedAt: new Date().toISOString(),
                  step2UpdatedAt: new Date().toISOString(),
                  step2: 'Pass',
                  step3UpdatedAt: new Date().toISOString(),
                  step3: 'Pass'
                }
              });

              await this.prisma.educationResult.create({
                data: {
                  tspId: userId,
                  score: scoreSL,
                  bonus: true,
                  examStatus: 'passed'
                }
              });

              await this.mail.sendQulificationBonusEmail(
                userDetails.approved_personal_data?.firstName ?? '',
                userDetails.username
              );
            } else {
              await this.prisma.candidateLevel.upsert({
                where: {
                  candidate_id: userId
                },
                create: {
                  candidate_id: userId,
                  level: 3,
                  updatedAt: new Date().toISOString(),
                  step2UpdatedAt: new Date().toISOString(),
                  step2: 'Pass'
                },
                update: {
                  level: 3,
                  updatedAt: new Date().toISOString(),
                  step2UpdatedAt: new Date().toISOString(),
                  step2: 'Pass'
                }
              });

              await this.prisma.educationResult.create({
                data: {
                  tspId: userId,
                  score: scoreSL,
                  bonus: false,
                  examStatus: 'passed'
                }
              });

              await this.mail.sendQulificationPassEmail(
                userDetails.approved_personal_data?.firstName ?? '',
                userDetails.username
              );
            }
            passFailStatus = true;
          } else {
            await this.prisma.candidateLevel.upsert({
              where: {
                candidate_id: userId
              },
              create: {
                candidate_id: userId,
                level: 2,
                updatedAt: new Date().toISOString(),
                step2UpdatedAt: new Date().toISOString(),
                step2: 'Fail'
              },
              update: {
                updatedAt: new Date().toISOString(),
                step2UpdatedAt: new Date().toISOString(),
                step2: 'Fail'
              }
            });

            await this.prisma.educationResult.create({
              data: {
                tspId: userId,
                score: scoreSL,
                bonus: false,
                examStatus: 'failed'
              }
            });

            await this.mail.sendQulificationFailEmail(
              userDetails.approved_personal_data?.firstName ?? '',
              userDetails.username,
              errors
            );
          }
        }

        // Create a new flexiquiz user and assign an exam
        if (passFailStatus) {
          // create only when user pass in education qualifications

          const flexUser: FlexiUserSubmitDto = {
            tspId: userId,
            email: userDetails.approved_contact_data?.workEmail ?? '',
            firstName: userDetails.approved_personal_data?.firstName ?? '',
            lastName: userDetails.approved_personal_data?.surname ?? '',
            flexCanId: null,
            skipCreatingAccount: bonus
          };

          await this.userService.createFlexiquizUser(flexUser);

          /**
           * assign for the active exams
           */
          await this.examService.flexiQuizAutomaticAssignService(userId, bonus);
        }

        return {
          status: passFailStatus,
          bonus
        };
      } else {
        //country is not Sri Lanka or India. THIS should not happen
        await this.prisma.candidateLevel.upsert({
          where: {
            candidate_id: userId
          },
          create: {
            candidate_id: userId,
            level: 2,
            updatedAt: new Date().toISOString(),
            step2UpdatedAt: new Date().toISOString(),
            step2: 'On Hold'
          },
          update: {
            updatedAt: new Date().toISOString(),
            step2UpdatedAt: new Date().toISOString(),
            step2: 'On Hold'
          }
        });

        await this.mail.sendOnHoldEmail(
          userDetails.approved_personal_data?.firstName ?? '',
          userDetails.approved_contact_data?.workEmail ?? ''
        );

        return false;
      }

      // fail - not applicable
      // fail - al/ol
      // fail - certif
    } catch (error) {
      return false;
    }
  }
}
