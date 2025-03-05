import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { AdditionalDocumentsModule } from './additional-documents/additional-documents.module';
import { BankDetailsModule } from './bank-details/bank-details.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EducationDetailsModule } from './education-details/education-details.module';
import { HardwareInternetModule } from './hardware-internet/hardware-internet.module';
import { GeneralInformationModule } from './general-information/general-information.module';
import { HealthDeclarationModule } from './health-declaration/health-declaration.module';
import { InfoDiscrepanciesModule } from './info-discrepancies/info-discrepancies.module';
import { ProfessionalQualificationsModule } from './professional-qualifications/professional-qualifications.module';
import { SessionAvailabilityModule } from './session-availability/session-availability.module';
import { ProgressModule } from './progress/progress.module';
import { AuditorModule } from './auditor/auditor.module';
import { HrisAdminModule } from './hris-admin/hris-admin.module';
import { CandidateMasterModule } from './candidate-master/candidate-master.module';
import { EditHistoryMasterModule } from './edit-history-master/edit-history-master.module';
import { DocumentMasterModule } from './document-master/document-master.module';
import { ContractDetailsModule } from './contract-details/contract-details.module';
import { JobRequisitionModule } from './job-requisition/job-requisition.module';
import { NonTutorDashboardModule } from './non-tutor-dashboard/non-tutor-dashboard.module';
import { PendingApprovalsModule } from './pending-approvals/pending-approvals.module';

import { PrismaService } from './prisma.service';
import { MailModule } from './mail/mail.module';
import { PccMasterModule } from './pcc-master/pcc-master.module';
import { PccHistoryModule } from './pcc-history/pcc-history.module';
import { CronHrisModule } from './cron-hris/cron-hris.module';
import { HrisFiltersModule } from './hris-filters/hris-filters.module';
import { ITMasterModule } from './it-master/it-master.module';
import { PrismaModule } from './prisma.module';
import { RemainingFieldsModule } from './remaining-fields/remaining-fields.module';
import { AdditionalDocumentsTbModule } from './additional-documents-tb/additional-documents-tb.module';
import { ExportHubModule } from './export-hub/export-hub.module';

@Module({
  imports: [
    AuthModule,
    AdditionalDocumentsModule,
    BankDetailsModule,
    CandidateMasterModule,
    DashboardModule,
    EducationDetailsModule,
    HardwareInternetModule,
    GeneralInformationModule,
    HealthDeclarationModule,
    InfoDiscrepanciesModule,
    ProfessionalQualificationsModule,
    SessionAvailabilityModule,
    ProgressModule,
    EditHistoryMasterModule,
    DocumentMasterModule,
    ContractDetailsModule,
    JobRequisitionModule,
    NonTutorDashboardModule,
    AuditorModule,
    HrisAdminModule,
    PendingApprovalsModule,
    MailModule,
    PccMasterModule,
    PccHistoryModule,
    CronHrisModule,
    HrisFiltersModule,
    ITMasterModule,
    PrismaModule,
    RemainingFieldsModule,
    AdditionalDocumentsTbModule,
    ExportHubModule
  ],
  providers: [AppService, PrismaService],
  controllers: [AppController]
})
export class AppModule {}
