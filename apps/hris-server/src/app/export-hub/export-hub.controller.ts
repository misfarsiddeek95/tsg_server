import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExportHubService } from '../export-hub/export-hub.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Analytic: Export Hub APIs')
@Controller('exports')
export class ExportHubController {
  constructor(private ExportHubService: ExportHubService) {}

  @Get('community-bsa-hris-data')
  @ApiOperation({ summary: 'Community / BSA HRIS data' })
  async fetchTutorProfiles(@Query() query: any) {
    return this.ExportHubService.fetchTutorProfiles();
  }

  @Get('hris-latest-qualifications-data')
  @ApiOperation({ summary: 'Latest Qualifications' })
  async fetchLatestQualifications(@Query() query: any) {
    return this.ExportHubService.fetchLatestQualifications();
  }

  @Get('hris-latest-hardware-data')
  @ApiOperation({ summary: 'Latest Hardware Data' })
  async fetchLatestHardware(@Query() query: any) {
    return this.ExportHubService.fetchLatestHardware();
  }

  @Get('hris-latest-personal-contact-data')
  @ApiOperation({ summary: 'Latest Personal & Contact Data' })
  async fetchLatestPersonalContactData(@Query() query: any) {
    return this.ExportHubService.fetchLatestPersonalContactData();
  }

  @Get('profile-completion')
  @ApiOperation({ summary: 'Profile Completion' })
  async fetchProfileCompletion(@Query() query: any) {
    return this.ExportHubService.fetchProfileCompletion();
  }

  @Get('tms-history')
  @ApiOperation({ summary: 'TMS History' })
  async fetchTmsHistoryData(@Query() query: any) {
    return this.ExportHubService.fetchTmsHistoryData(query);
  }

  @Get('tms-approval')
  @ApiOperation({ summary: 'TMS Approval' })
  async fetchTmsApprovalData(@Query() query: any) {
    return this.ExportHubService.fetchTmsApprovalData();
  }

  @Get('nthris-leave-applications')
  @ApiOperation({ summary: 'NTHRIS all leave records' })
  async fetchNthrisLeaveApplicationsData(@Query() query: any) {
    return this.ExportHubService.fetchNthrisLeaveApplicationsData(query);
  }

  @Get('nthris-pending-leave-report')
  @ApiOperation({ summary: 'NTHRIS pending leave report' })
  async fetchNthrisPendingLeaveReportData(@Query() query: any) {
    return this.ExportHubService.fetchNthrisPendingLeaveReportData(query);
  }
}
