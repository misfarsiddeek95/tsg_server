import { ApiProperty } from '@nestjs/swagger';

export class AllRejectedFields200Dto {
  @ApiProperty({
    type: [],
    example: {
      bankData: {},
      educationData: {},
      personalData: {
        dob: '2000-02-16T00:00:00.000Z',
        dobStatus: 'rejected',
        dobRejectReason: 'sds',
        nicUrl:
          '/21/personal_information/1686031841525_____111_sample_vector-big.png',
        nicUrlStatus: 'rejected',
        nicUrlRejectReason: 'test'
      },
      contactData: {
        residingAddressL1: 'Dsfsd',
        residingAddressL1Status: 'rejected',
        residingAddressL1RejectReason: 'sd',
        permanentAddressL1: 'Dsfsd',
        permanentAddressL1Status: 'rejected',
        permanentAddressL1RejectReason: 'sd'
      },
      rightToWorkData: {},
      referenceData: {},
      ItData: {},
      healthData: {},
      qualificationData: {},
      workExperienceData: {},
      tableCountWithDiscrepencies: 2
    }
  })
  data: any[];
}
