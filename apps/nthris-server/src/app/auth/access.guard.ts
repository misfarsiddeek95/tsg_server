import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private prisma: PrismaService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp()?.getRequest();
    const tspId = request?.user.userId;

    const accessesList = this.reflector.getAllAndOverride<string[]>(
      'accesses',
      [context.getHandler(), context.getClass()]
    );

    const accesses = await this.prisma.hrisAccess.findMany({
      where: {
        tsp_id: +tspId,
        access: 1,
        module: {
          in: accessesList
        }
      }
    });

    request.accesses = accesses.map((access) => access.module);

    if (accesses.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

export const Accesses = (...accesses: string[]) =>
  SetMetadata('accesses', accesses);
