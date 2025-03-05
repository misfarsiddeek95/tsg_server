import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import fetch from 'node-fetch';

import { PrismaService } from '../../prisma.service';
import { FlexiUserSubmitDto } from './user.dto';
import { ExamService } from '../exam/exam.service';
// import fetch from 'cross-fetch';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private examService: ExamService
  ) {}

  async createFlexiquizUser(newUser: FlexiUserSubmitDto) {
    try {
      if (!newUser.skipCreatingAccount) {
        const response = await fetch('https://www.flexiquiz.com/api/v1/users', {
          method: 'POST',
          body: JSON.stringify({
            user_name: newUser.email,
            password: 'password',
            user_type: 'respondent',
            email_address: newUser.email,
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            suspended: false,
            manage_users: false,
            manage_groups: false,
            edit_quizzes: false,
            send_welcome_email: false
          }),
          headers: {
            'X-API-KEY': process.env.NX_FLEXIQUIZZ_API_KEY,
            'Content-Type': 'application/json'
          }
        });

        return await response.json().then(async (result) => {
          if ('user_id' in result) {
            // check the api response error
            newUser.flexCanId = result.user_id;
            await this.prisma.flexiCandidate.create({
              data: {
                user: { connect: { tsp_id: newUser.tspId } },
                flexi_cadidate_id: newUser.flexCanId
              }
            });
            return { success: true };
          } else {
            console.error(result);
            return { success: false, error: result.message };
          }
        });
      } else {
        newUser.flexCanId = '*****';
        await this.prisma.flexiCandidate.create({
          data: {
            user: { connect: { tsp_id: newUser.tspId } },
            flexi_cadidate_id: newUser.flexCanId
          }
        });
      }
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async createFlexiquizJWT(userId: number) {
    const userData = await this.prisma.flexiCandidate.findUnique({
      where: {
        tsp_id: userId
      }
    });

    if (userData) {
      const response = await fetch(
        `https://www.flexiquiz.com/api/v1/users/${userData.flexi_cadidate_id}/jwt`,
        {
          method: 'GET',
          headers: {
            'X-API-KEY': process.env.NX_FLEXIQUIZZ_API_KEY
            // 'Content-Type': 'application/json'
          }
        }
      );

      return await response
        .text()
        .then(async (result) => {
          return { jwt: result };
        })
        .catch((error) => {
          return { error: error.message };
        });
    } else {
      return { error: 'Prisma User Id not found' };
    }
  }

  async getUserDetail(id: number) {
    const data = await this.prisma.flexiCandidate.findUnique({
      where: {
        id: id
      },
      select: {
        user: {
          select: {
            username: true,
            tsp_id: true,
            approved_personal_data: {
              select: {
                firstName: true
              }
            }
          }
        }
      }
    });

    return { success: true, data };
  }

  async createUserAndAssignExam(data: FlexiUserSubmitDto) {
    try {
      await this.createFlexiquizUser(data);
      await this.examService.flexiQuizAutomaticAssignService(
        data.tspId,
        data.skipCreatingAccount
      );
      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }
}
