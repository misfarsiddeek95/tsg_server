import { Module } from "@nestjs/common";
import { SessionsForEvaluationController } from "./controllers/sessions-for-evaluation/sessions-for-evaluation.controller";
import { SessionsForEvaluationService } from "./services/sessions-for-evaluation/sessions-for-evaluation.service";

@Module({
  controllers: [SessionsForEvaluationController],
  providers: [SessionsForEvaluationService],
  exports: [],
})
export class SessionForEvaluationModule {}
