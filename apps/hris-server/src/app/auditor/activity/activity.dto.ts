import { ApiProperty } from '@nestjs/swagger';

export class GetAuditorActivities200Dto {
  @ApiProperty({
    example: {
      success: true,
      data: {
        pendingAuditCount: 0,
        pendingAudits: [],
        auditFailCount: 0,
        failedAudits: []
      }
    }
  })
  data: object;
}

export class GetAuditorChartData200Dto {
  @ApiProperty({
    example: {
      success: true,
      data: {
        initialAuditPending: 0,
        initialAuditPass: 0,
        initialAuditFail: 0,
        initialAuditRejected: 0,
        finalAuditPass: 0,
        finalAuditFail: 0
      }
    }
  })
  data: object;
}
