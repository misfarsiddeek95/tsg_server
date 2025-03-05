import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { MailService } from '../../mail/mail.service';
import { CandidateLevelSlotDto } from '../dtos/candidate-level.dto';

@Injectable()
export class CandidateLevel {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async getCandidateLevel(details: CandidateLevelSlotDto) {
    try {
      // const candidateLevel = await this.prisma.candidateLevel.findMany({
      //   where: {
      //     candidate_id: 1
      //   },

      //   select: {
      //     id: true,
      //     candidate_id: true,
      //     level: true
      //   }
      // });

      const result = await this.prisma.$queryRaw(
        Prisma.sql`SELECT MAX(level) AS level FROM bs_candidate_level WHERE candidate_id = ${details.candidateId} `
      );

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
