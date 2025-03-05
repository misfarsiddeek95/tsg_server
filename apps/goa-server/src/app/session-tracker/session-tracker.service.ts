import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
@Injectable()
export class SessionTrackerService {
  constructor(private prisma: PrismaService) {}

  //Update Session table status service
  async authentication(data: any) {
    try {
      console.log('auth' + data.key);
      const response1 = await this.prisma.accessAuthentication.updateMany({
        where: {
          key: data.key
        },
        data: {
          active: true,
          updatedAt: new Date()
        }
      });

      const response2 = await this.prisma.accessAuthentication.findFirst({
        where: {
          key: data.key
        },
        select: {
          tspId: true
        }
      });
      console.log('response' + JSON.stringify(response2));
      const response3 = await this.prisma.user.findFirst({
        where: {
          tsp_id: response2.tspId
        },
        select: {
          tsp_id: true,
          username: true,
          level: true
        }
      });
      console.log('response' + JSON.stringify(response3));
      return { success: true, status: 200, data: response3 };
    } catch (error) {
      console.log('This is error', error);
      return { success: false, error: error.message };
    }
  }
}
