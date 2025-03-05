import { Module } from "@nestjs/common";
import { SessionInvestigationService } from "./session-investigation.service";
import { SessionInvestigationController } from "./session-investigation.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  controllers: [SessionInvestigationController],
  providers: [SessionInvestigationService],
  imports: [PrismaModule],
})
export class SessionInvestigationModule {}
