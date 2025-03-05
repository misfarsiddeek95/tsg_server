import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../../mail/mail.service';
import { JwtStrategy } from '../../auth/jwt.stategy';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';
// import { BankController } from './bank/bank.controller';
// import { BankService } from './bank/bank.service';
// import { ContactController } from './contact/contact.controller';
// import { ContactService } from './contact/contact.service';
// import { EducationController } from './education/education.controller';
// import { EducationService } from './education/education.service';
// import { ExperienceController } from './experience/experience.controller';
// import { ExperienceService } from './experience/experience.service';
// import { HardwareController } from './hardware/hardware.controller';
// import { HealthController } from './health/health.controller';
// import { JobController } from './job/job.controller';
// import { PersonalController } from './personal/personal.controller';
// import { QualificationController } from './qualification/qualification.controller';
// import { RightToWorkController } from './right-to-work/right-to-work.controller';
// import { HardwareService } from './hardware/hardware.service';
// import { HealthService } from './health/health.service';
// import { JobService } from './job/job.service';
// import { PersonalService } from './personal/personal.service';
// import { QualificationService } from './qualification/qualification.service';
// import { ReferenceService } from './reference/reference.service';
// import { RightToWorkService } from './right-to-work/right-to-work.service';
// import { ReferenceController } from './reference/reference.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [
    DashboardController,
    AuditController
    // BankController,
    // ContactController,
    // EducationController,
    // ExperienceController,
    // HardwareController,
    // HealthController,
    // JobController,
    // PersonalController,
    // QualificationController,
    // ReferenceController,
    // RightToWorkController
  ],
  providers: [
    DashboardService,
    AuditService,
    // BankService,
    // ContactService,
    // EducationService,
    // ExperienceService,
    // HardwareService,
    // HealthService,
    // JobService,
    // PersonalService,
    // QualificationService,
    // ReferenceService,
    // RightToWorkService,
    MailService,
    JwtStrategy
  ]
})
export class ProfileModule {}
