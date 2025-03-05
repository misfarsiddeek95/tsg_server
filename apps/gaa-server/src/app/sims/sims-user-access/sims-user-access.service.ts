// Import necessary modules and dependencies
import { Injectable } from '@nestjs/common';
import { GetSimsUserAccessDto } from './dto/create-sims-user-access.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class SimsUserAccessService {
  // Constructor to inject required services
  constructor(private prisma: PrismaService) {}

  // **************** Service method to get user access level ****************
  async getUserAccessLevelService(dto: GetSimsUserAccessDto) {
    const { userId } = dto;
    try {
      const data = await this.prisma.nonTutorDirectory.findUnique({
        where: {
          hr_tsp_id: userId
        },
        select: {
          division: true
        }
      });

      return {
        success: true,
        division: data.division,
        accessLevel: data.division === 'Human Resources' ? 'HR' : 'OTHER'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
