import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "./../prisma.service";
import { LocalStrategy } from "./local.stategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.stategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "tsg@devs",
      signOptions: { expiresIn: "60000s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
