import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
// import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}
  async updateUrlRedirectTable(data: any) {
    try {
      let accessToken = "No Token";
      let updatedRecord = null;
      let userRole = null;
      //Fetch the redirect table data
      const existingRecord =
        await this.prisma.sesRevampUrlRedirectValidation.findUnique({
          where: {
            id: data.id,
          },
          select: {
            action: true,
          },
        });
      //Check the action
      // if (existingRecord.action === 1 || data.redirect === true) {
      updatedRecord = await this.prisma.sesRevampUrlRedirectValidation.update({
        where: {
          id: data.id,
        },
        data: {
          action: data.action,
        },
      });
      const payload = { username: data.user_name, sub: data.tsp_id };
      accessToken = this.jwtService.sign(payload);
      // }

      //get User Role
      if (updatedRecord) {
        userRole = await this.prisma.laravel_master_directory_v2.findUnique({
          where: {
            hr_tsp_id: updatedRecord.tsp_id,
          },
          select: {
            role_profile: true,
          },
        });
      }

      return {
        accessToken: accessToken,
        data: updatedRecord,
        userRole: userRole,
        success: true,
        status: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async createJWTToken(data: any) {
    try {
      const payload = { username: data.userId, sub: data.timestamp };
      const jwtAccessToken = this.jwtService.sign(payload);

      return {
        jwtAccessToken: jwtAccessToken,
        success: true,
        status: 201,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
