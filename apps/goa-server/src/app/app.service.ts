import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getData(): { message: string } {
    return { message: 'Welcome to ams-server!' };
  }

  async getTypeOfLeave() {
    try {
      const type_Of_Leave = await this.prisma.gOATypeOfLeave.findMany({
        select: {
          id: true,
          type_of_leave: true
        }
      });
      return { success: true, data: type_Of_Leave };
    } catch (error) {
      return error;
    }
  }
}
