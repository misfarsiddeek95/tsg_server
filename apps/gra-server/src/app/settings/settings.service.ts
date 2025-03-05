import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  getStemDetails() {
    return this.prisma.stemCriteria.findMany();
  }
}
