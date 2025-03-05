import { ApiProperty } from '@nestjs/swagger';

export class ApssEventValidationsResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      '1': {
        eventId: 1,
        eventType: 'PI',
        candidateEditBtnTime: 30,
        candidateJoinBtnTime: 10,
        candidateRescheduleLimit: 2,
        candidateSlotBookingBtnTime: 30,
        interviewerCheckBtnTime: 10,
        interviewerSlotAvailableBtnTime: 5
      },
      '2': {
        eventId: 2,
        eventType: 'TI',
        candidateEditBtnTime: 30,
        candidateJoinBtnTime: 50,
        candidateRescheduleLimit: 22,
        candidateSlotBookingBtnTime: 30,
        interviewerCheckBtnTime: 10,
        interviewerSlotAvailableBtnTime: 5
      },
      '3': {
        eventId: 3,
        eventType: 'FA',
        candidateEditBtnTime: 30,
        candidateJoinBtnTime: 10,
        candidateRescheduleLimit: 2,
        candidateSlotBookingBtnTime: 30,
        interviewerCheckBtnTime: 10,
        interviewerSlotAvailableBtnTime: 5
      },
      '4': {
        eventId: 4,
        eventType: 'NA',
        candidateEditBtnTime: null,
        candidateJoinBtnTime: null,
        candidateRescheduleLimit: null,
        candidateSlotBookingBtnTime: null,
        interviewerCheckBtnTime: null,
        interviewerSlotAvailableBtnTime: null
      }
    }
  })
  data: object;
}
