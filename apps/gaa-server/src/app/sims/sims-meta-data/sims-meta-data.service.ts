// sims-meta-data.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Service for handling operations related to Sims Meta Data.
@Injectable()
export class SimsMetaDataService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves meta data from the database and processes it.
   * The function fetches Sims meta data, groups it by category, and returns it.
   * In case of an error, it returns an object with the error message.
   * @returns An object with a success status and data or error message.
   */
  async getMetaData() {
    try {
      // Retrieve metadata from the database
      const result = await this.prisma.simsMetaData.findMany({
        where: { status: '1' },
        select: { id: true, value: true, category: true }
      });

      // Group results by category 
      const groupedResult = result.reduce((acc, { id, value, category }) => {
        if (!acc[category]) acc[category] = [];
        acc[category].push({ value: id, label: value });
        return acc;
      }, {});

      // Return successful response with grouped data
      return { success: true, data: groupedResult };
    } catch (error) {
      // Return error response in case of failure
      return { success: false, error: error.message };
    }
  }
}
