import { Injectable } from '@nestjs/common';

import { PrismaService } from './../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: email
      }
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }
}
