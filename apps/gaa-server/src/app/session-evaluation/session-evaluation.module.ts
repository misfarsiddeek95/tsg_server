import { Module } from "@nestjs/common";
import { SessionEvaluationService } from "./session-evaluation.service";
import { SessionEvaluationController } from "./session-evaluation.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { NewEmailModule } from "../new-email/new-email.module";
@Module({
  controllers: [SessionEvaluationController],
  providers: [SessionEvaluationService],
  imports: [PrismaModule, NewEmailModule],
})
export class SessionEvaluationModule {}
