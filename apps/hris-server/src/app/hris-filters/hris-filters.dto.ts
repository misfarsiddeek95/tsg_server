import { ApiProperty } from '@nestjs/swagger';

export class SearchTutorByName200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 15,
        name: 'Banukax Paniyanduwage'
      },
      {
        tspId: 23,
        name: 'Banukacc Ccc'
      },
      {
        tspId: 29,
        name: 'Banuka Paniyanduwage'
      }
    ]
  })
  data: any[];
}

export class FetchActiveAuditors200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 3,
        name: 'auditor@tsg.com'
      },
      {
        tspId: 17,
        name: 'auditor2@tsg.com'
      }
    ]
  })
  data: any[];
}

export class FetchAssignedAuditors200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        tspId: 3,
        name: 'auditor@tsg.com'
      },
      {
        tspId: 17,
        name: 'auditor2@tsg.com'
      }
    ]
  })
  data: any[];
}

export class FetchAuditStatusList00Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        tutorStatus: 'audit in progress'
      },
      {
        tutorStatus: 'onboarding ready'
      },
      {
        tutorStatus: 'audit pending'
      },
      {
        tutorStatus: 'initial audit fail'
      }
    ]
  })
  data: any[];
}

export class FetchProfileStatusList00Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: [],
    example: [
      {
        profileStatus: 'onboarding ready'
      },
      {
        profileStatus: 'active'
      }
    ]
  })
  data: any[];
}
