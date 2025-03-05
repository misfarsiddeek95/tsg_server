import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { LocalStrategy } from "./local.stategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.stategy";
import { PassportModule } from "@nestjs/passport";
import { MailService } from "../mail/mail.service";
import { MailModule } from "../mail/mail.module";
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "tsg@devs",
      signOptions: { expiresIn: "60000s" },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    MailService,
  ],
})
export class AuthModule {}
