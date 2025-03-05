import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SessionEvaluationModule } from './session-evaluation/session-evaluation.module';
import { MetadataModule } from './metadata/metadata.module';
import { NewEmailModule } from './new-email/new-email.module';
import { AuthModule } from './auth/auth.module';
import { SessionInvestigationModule } from './session-investigation/session-investigation.module';
import { UserModule } from './user/user.module';
import { SessionForEvaluationModule } from './sessions-for-evaluation/sessions-for-evaluation.module';
import { SimsEmailModule } from './sims/sims-email/sims-email.module';
import { SimsMasterTableModule } from './sims/sims-master-table/sims-master-table.module';
import { SimsTicketFormModule } from './sims/sims-ticket-form/sims-ticket-form.module';
import { SimsMetaDataModule } from './sims/sims-meta-data/sims-meta-data.module';
import { SimsUserAccessModule } from './sims/sims-user-access/sims-user-access.module';
import { SessionTrackerModule } from './session-tracker/session-tracker.module';

@Module({
  // Importing other modules to use their components
  imports: [
    UserModule,
    PrismaModule,
    SessionEvaluationModule,
    SessionForEvaluationModule,
    MetadataModule,
    NewEmailModule,
    AuthModule,
    SessionInvestigationModule,
    SimsEmailModule,
    SimsMasterTableModule,
    SimsTicketFormModule,
    SimsMetaDataModule,
    SimsUserAccessModule,
    SessionTrackerModule
  ],
  // Controllers handle incoming requests
  controllers: [AppController],
  // Providers are injectable components used across the application
  providers: [AppService]
})
export class AppModule {}
