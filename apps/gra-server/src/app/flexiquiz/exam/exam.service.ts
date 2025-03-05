import { Injectable } from '@nestjs/common';
import moment = require('moment');
import fetch from 'node-fetch';
import { PrismaService } from '../../prisma.service';
import { ExamSubmitDetailsDto, ExamSubmitMainDto } from './exam.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add new exam service
   * @param newExamData
   * @returns
   */

  async addNewExamService(newExamData: ExamSubmitMainDto) {
    try {
      // try

      // Data saving using prisma
      const newExam = await this.prisma.flexiExam.create({
        data: {
          exam_id: newExamData.examId,
          exam_name: newExamData.examName,
          exam_type: newExamData.examType,
          active_status: newExamData.activeStatus
        }
      });
      return { success: true, data: newExam }; // return success state with create value
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all the exams from the flexiExam table
   * @returns
   */
  async getAllExams() {
    try {
      // try

      // Get all the exams using prisma
      const exams = await this.prisma.flexiExam.findMany();
      return { success: true, data: exams }; // return success state with exams
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getAllCandidateExamDetail(
    take,
    skip,
    candidateName,
    mobileNo,
    email,
    score,
    outcome
  ) {
    try {
      const scoreQuery = {
        0: {},
        1: {
          gt: 0,
          lte: 40
        },
        2: {
          gt: 40,
          lte: 70
        },
        3: {
          gt: 70,
          lte: 100
        }
      };

      const filterWhereClause = {
        exam_status:
          outcome != 0
            ? {
                equals: outcome
              }
            : {},
        FlexiCandidate: {
          user: {
            approved_personal_data: {
              shortName: {
                contains: candidateName
              }
            },
            approved_contact_data: {
              workEmail: {
                contains: email
              },
              mobileNumber: {
                contains: mobileNo
              }
            }
          }
        },
        FlexiCandidateExamDetails: {
          every: {
            percentage_score: scoreQuery[score]
          }
        }
      };

      const [count, details] = await this.prisma.$transaction([
        this.prisma.flexiCandidateExam.count({
          where: filterWhereClause
        }),
        this.prisma.flexiCandidateExam.findMany({
          where: filterWhereClause,
          skip,
          take,
          select: {
            FlexiCandidateExamDetails: {
              select: {
                percentage_score: true,
                exam_submitted_date: true
              }
            },
            FlexiCandidate: {
              select: {
                user: {
                  select: {
                    approved_personal_data: {
                      select: {
                        shortName: true
                      }
                    },
                    approved_contact_data: {
                      select: {
                        workEmail: true,
                        mobileNumber: true
                      }
                    }
                  }
                }
              }
            },
            exam_status: true
          }
        })
      ]);

      const data = details.map((d, index) => {
        const status = {
          1: 'Not Started',
          2: 'Pending Result',
          3: 'Completed',
          4: 'Skipped'
        };

        const row = {
          id: index,
          outcome: status[d.exam_status] ?? 'Un Assigned',
          name: d.FlexiCandidate.user.approved_personal_data?.shortName ?? '',
          mobileNum:
            d.FlexiCandidate.user.approved_contact_data?.mobileNumber ?? '',
          email: d.FlexiCandidate.user.approved_contact_data?.workEmail ?? '',
          score:
            d.FlexiCandidateExamDetails[d.FlexiCandidateExamDetails.length - 1]
              ?.percentage_score ?? 'No Score',
          submittedDate: d.FlexiCandidateExamDetails[
            d.FlexiCandidateExamDetails.length - 1
          ]
            ? moment(
                d.FlexiCandidateExamDetails[
                  d.FlexiCandidateExamDetails.length - 1
                ]?.exam_submitted_date
              ).format('DD/MM/YYYY')
            : 'No Date'
        };

        return row;
      });

      return { success: true, data, count }; // return success state with exams
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get exam by its id from the flexiExam table
   * @param id
   * @returns
   */
  async getById(id: number) {
    try {
      // try

      //get the exam using it's id from table using prisma
      const exam = await this.prisma.flexiExam.findUnique({
        where: {
          id: id
        }
      });
      return { success: true, data: exam }; // return success state with exam
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getExamStatus(id: number) {
    try {
      const examStatus = await this.prisma.flexiCandidateExam.findUnique({
        select: {
          exam_status: true
        },
        where: {
          id: id
        }
      });
      return { success: true, data: examStatus }; // return success state with exam
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get the exams assigned for user using tsp id
   * @param tspId
   * @returns
   */
  async getAssignedExamsForUserService(tspId: number) {
    try {
      // try

      // get the assigned exams using id of flexiCandidate table
      const exams = await this.prisma.flexiCandidateExam.findMany({
        where: {
          FlexiCandidate: {
            tsp_id: tspId
          }
        },
        include: {
          FlexiExam: true,
          FlexiCandidate: true
        }
      });

      return { success: true, data: exams }; // return success state with exam
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get exam using flexiquiz exam id
   * eg: "e05526f8-6c3b-4879-8b73-9dc38c359f6d"
   * @param id
   * @returns
   */
  async getByFlexiId(id: string) {
    try {
      // try

      // get the exam from flexiExam table using exam is
      const exam = await this.prisma.flexiExam.findFirst({
        where: {
          exam_id: id
        }
      });
      return { success: true, data: exam }; // return success state with exam
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   *
   * @param id
   * @param status
   * @returns
   */
  async updateActiveStatusOfExam(id: number, status: boolean) {
    try {
      // try

      const exam = await this.prisma.flexiExam.update({
        where: {
          id: id
        },
        data: {
          active_status: status,
          updated_at: new Date().toISOString()
        }
      });
      return { success: true, data: exam };
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async flexiQuizAutomaticAssignService(tspId: number, bonus = false) {
    try {
      // try

      const { flexCandidate, activeExams } = await this.prisma.$transaction(
        async (prisma: any) => {
          const flexCandidate = await prisma.flexiCandidate.findUnique({
            where: {
              tsp_id: tspId
            }
          });

          const activeExams = await this.prisma.flexiExam.findMany({
            where: {
              active_status: true
            }
          });

          return { flexCandidate, activeExams };
        }
      );

      for (const exam of activeExams) {
        const existingRecord = await this.prisma.flexiCandidateExam.findFirst({
          where: {
            flexi_candidate_id: flexCandidate.id,
            flexi_exam_id: exam.id
          }
        });

        if (!existingRecord) {
          if (bonus) {
            await this.prisma.flexiCandidateExam.create({
              data: {
                FlexiCandidate: { connect: { id: flexCandidate.id } },
                FlexiExam: { connect: { id: exam.id } },
                exam_status: 4
              }
            });
          } else {
            const response = await fetch(
              `https://www.flexiquiz.com/api/v1/users/${flexCandidate.flexi_cadidate_id}/quizzes?quiz_id=${exam.exam_id}`,
              {
                method: 'POST',
                headers: {
                  'X-API-KEY': process.env.NX_FLEXIQUIZZ_API_KEY
                }
              }
            );

            await response
              .text()
              .then(async (result) => {
                await this.prisma.flexiCandidateExam.create({
                  data: {
                    FlexiCandidate: { connect: { id: flexCandidate.id } },
                    FlexiExam: { connect: { id: exam.id } },
                    exam_status: 1
                  }
                });
              })
              .catch((error) => {
                console.error(error);
                // return { success: false, error: error.message };
              });
          }
        }
      }

      return { success: true };
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async flexiQuizManualAssignService(tspId: number, examId: string) {
    try {
      // try
      const flexCandidate = await this.prisma.flexiCandidate.findUnique({
        where: {
          tsp_id: tspId
        }
      });

      const exam = await this.prisma.flexiExam.findFirst({
        where: {
          exam_id: examId
        }
      });

      const existingRecord = await this.prisma.flexiCandidateExam.findFirst({
        where: {
          flexi_candidate_id: flexCandidate.id,
          flexi_exam_id: exam.id
        }
      });

      if (!existingRecord) {
        const response = await fetch(
          `https://www.flexiquiz.com/api/v1/users/${flexCandidate.flexi_cadidate_id}/quizzes?quiz_id=${exam.exam_id}`,
          {
            method: 'POST',
            headers: {
              'X-API-KEY': process.env.NX_FLEXIQUIZZ_API_KEY
            }
          }
        );

        const res = await response
          .text()
          .then(async (result) => {
            await this.prisma.flexiCandidateExam.create({
              data: {
                FlexiCandidate: { connect: { id: flexCandidate.id } },
                FlexiExam: { connect: { id: exam.id } },
                exam_status: 1
              }
            });
            return { success: true };
          })
          .catch((error) => {
            console.error(error);
            throw new Error(error.message);
          });

        return res;
      } else {
        throw new Error('Record Already Exists');
      }
    } catch (error) {
      // error
      console.error(error);
      return { success: false, error: error.message };
    }
  }

  async updateCandidateExamStateService(stateId: number, examId: number) {
    try {
      // try

      const update = await this.prisma.flexiCandidateExam.update({
        where: {
          id: examId
        },
        data: {
          exam_status: stateId,
          updated_at: new Date().toISOString()
        }
      });

      return { success: true, data: update };
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async updateCandidateExamStateByTableId(stateId: number, id: number) {
    try {
      // try
      const update = await this.prisma.flexiCandidateExam.update({
        where: {
          id: id
        },
        data: {
          exam_status: stateId,
          updated_at: new Date().toISOString()
        }
      });

      return { success: true, data: update };
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getCandidateAssignedExamByFlexiUserIdAndFlexiExam(
    examId: string,
    userId: string
  ) {
    try {
      // try
      const flexCandidate = await this.prisma.flexiCandidate.findFirst({
        where: {
          flexi_cadidate_id: userId
        }
      });

      const exam = await this.prisma.flexiExam.findFirst({
        where: {
          exam_id: examId
        }
      });

      const examRecord = await this.prisma.flexiCandidateExam.findFirst({
        where: {
          flexi_candidate_id: flexCandidate.id,
          flexi_exam_id: exam.id
        }
      });

      return { success: true, data: examRecord };
    } catch (error) {
      // error
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async getCandidateExamResults(candidateExamId: string) {
    try {
      const examResults = await this.prisma.flexiCandidateExamDetails.findFirst(
        {
          where: {
            flexi_candidate_id: candidateExamId
          }
        }
      );

      if (examResults !== null) {
        return { success: true, data: examResults };
      } else {
        return { success: false, message: 'Exam Results not found' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async eportMathTest({
    candidateName,
    mobileNo,
    email,
    score,
    outcome
  }: Omit<ExamSubmitDetailsDto, 'take' | 'skip'>) {
    try {
      const scoreQuery = {
        0: {},
        1: {
          gt: 0,
          lte: 40
        },
        2: {
          gt: 40,
          lte: 70
        },
        3: {
          gt: 70,
          lte: 100
        }
      };

      const isWhere = candidateName || mobileNo || email || score || outcome;
      const filterWhereClause = isWhere
        ? {
            exam_status: outcome && outcome != 0 ? { equals: +outcome } : {},
            FlexiCandidate: {
              user: {
                approved_personal_data: {
                  shortName: candidateName ? { contains: candidateName } : {}
                },
                approved_contact_data: {
                  workEmail: email ? { contains: email } : {},
                  mobileNumber: mobileNo ? { contains: mobileNo } : {}
                }
              }
            },
            FlexiCandidateExamDetails: score
              ? {
                  every: {
                    percentage_score: scoreQuery[+score]
                  }
                }
              : {}
          }
        : {};

      const [count, details] = await this.prisma.$transaction([
        this.prisma.flexiCandidateExam.count({
          where: filterWhereClause
        }),
        this.prisma.flexiCandidateExam.findMany({
          where: filterWhereClause,
          select: {
            FlexiCandidateExamDetails: {
              select: {
                percentage_score: true,
                exam_submitted_date: true
              }
            },
            FlexiCandidate: {
              select: {
                user: {
                  select: {
                    approved_personal_data: {
                      select: {
                        shortName: true
                      }
                    },
                    approved_contact_data: {
                      select: {
                        workEmail: true,
                        mobileNumber: true
                      }
                    }
                  }
                }
              }
            },
            exam_status: true
          }
        })
      ]);

      const data = details.map((d, index) => {
        const status = {
          1: 'Not Started',
          2: 'Pending Result',
          3: 'Completed',
          4: 'Skipped'
        };

        const row = {
          id: index,
          outcome: status[d.exam_status] ?? 'Un Assigned',
          name: d.FlexiCandidate.user.approved_personal_data?.shortName ?? '',
          mobileNum:
            d.FlexiCandidate.user.approved_contact_data?.mobileNumber ?? '',
          email: d.FlexiCandidate.user.approved_contact_data?.workEmail ?? '',
          score:
            d.FlexiCandidateExamDetails[d.FlexiCandidateExamDetails.length - 1]
              ?.percentage_score ?? 'No Score',
          submittedDate: d.FlexiCandidateExamDetails[
            d.FlexiCandidateExamDetails.length - 1
          ]
            ? moment(
                d.FlexiCandidateExamDetails[
                  d.FlexiCandidateExamDetails.length - 1
                ]?.exam_submitted_date
              ).format('DD/MM/YYYY')
            : 'No Date'
        };

        return row;
      });

      return { success: true, data, count }; // return success state with exams
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }
}
