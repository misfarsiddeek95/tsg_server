import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from './dashboard/dashboard.controller';
import { MailService } from '../../mail/mail.service';
import { JwtStrategy } from '../../auth/jwt.stategy';
import { DashboardService } from './dashboard/dashboard.service';
import { BankController } from './bank/bank.controller';
import { BankService } from './bank/bank.service';
import { ContactController } from './contact/contact.controller';
import { ContactService } from './contact/contact.service';
import { EducationController } from './education/education.controller';
import { EducationService } from './education/education.service';
import { ExperienceController } from './experience/experience.controller';
import { ExperienceService } from './experience/experience.service';
import { HardwareController } from './hardware/hardware.controller';
import { HealthController } from './health/health.controller';
import { JobController } from './job/job.controller';
import { PersonalController } from './personal/personal.controller';
import { QualificationController } from './qualification/qualification.controller';
import { RightToWorkController } from './right-to-work/right-to-work.controller';
import { SummaryController } from './summary/summary.controller';
import { HardwareService } from './hardware/hardware.service';
import { HealthService } from './health/health.service';
import { JobService } from './job/job.service';
import { PersonalService } from './personal/personal.service';
import { QualificationService } from './qualification/qualification.service';
import { ReferenceService } from './reference/reference.service';
import { RightToWorkService } from './right-to-work/right-to-work.service';
import { SummaryService } from './summary/summary.service';
import { ReferenceController } from './reference/reference.controller';
import { CommonService } from '../../common/common.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [
    DashboardController,
    BankController,
    ContactController,
    EducationController,
    ExperienceController,
    HardwareController,
    HealthController,
    JobController,
    PersonalController,
    QualificationController,
    ReferenceController,
    RightToWorkController,
    SummaryController
  ],
  providers: [
    DashboardService,
    BankService,
    ContactService,
    EducationService,
    ExperienceService,
    HardwareService,
    HealthService,
    JobService,
    PersonalService,
    QualificationService,
    ReferenceService,
    RightToWorkService,
    SummaryService,
    MailService,
    JwtStrategy,
    CommonService
  ]
})
export class ProfileModule {}
