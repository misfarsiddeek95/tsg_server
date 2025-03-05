import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    try {
      const data = await this.prisma.user.findUnique({
        where: {
          tsp_id: id
        }
      });
      let obj = {};
      if (data) {
        obj = {
          id: data.tsp_id,
          userName: data.username,
          name: '',
          level: data.level
        };
      }
      return {
        success: true,
        data: obj
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
