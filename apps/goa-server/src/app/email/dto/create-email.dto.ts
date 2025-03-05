import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailDto {}

export class TutorTimeOffActionedMail201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'PraveenK' })
  first_name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string', example: '2022/01/22' })
  date: string;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: ['isReason:true', 'reasonDesc:Test Reason']
  })
  reason: any;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        sessionTime: '13.00',
        timeOffReason: 'Personal',
        status: 'Approved',
        isApproved: true
      },
      {
        sessionTime: '14.00',
        timeOffReason: 'Medical',
        status: 'Rejected'
      },
      {
        sessionTime: '13.00',
        timeOffReason: 'Personal',
        status: 'Approved',
        isApproved: true
      },
      {
        sessionTime: '14.00',
        timeOffReason: 'Medical',
        status: 'Rejected'
      }
    ]
  })
  requests: any;
}
export class TutorTimeOffActionedMailDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class TutorTimeOffRequestMail201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Praveen' })
  first_name: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 12345 })
  tutorId: number;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        date: '2022/09/08',
        slots: [
          {
            slotData: '1',
            isActive: true
          },
          {
            slotData: '2',
            isActive: true
          },
          {
            slotData: '3',
            isActive: true
          },
          {
            slotData: '4'
          },
          {
            slotData: '5'
          },
          {
            slotData: '6'
          },
          {
            slotData: '7'
          }
        ]
      },
      {
        date: '2022/09/08',
        slots: [
          {
            slotData: '1'
          },
          {
            slotData: '2'
          },
          {
            slotData: '3',
            isActive: true
          },
          {
            slotData: '4',
            isActive: true
          },
          {
            slotData: '5',
            isActive: true
          },
          {
            slotData: '6'
          },
          {
            slotData: '7'
          }
        ]
      }
    ]
  })
  requests: any;
}

export class TutorSubbordinateTimeOffMail201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Praveen' })
  tutorName: string;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        date: '2022/09/08',
        slots: [
          {
            slotData: '1',
            isActive: true
          },
          {
            slotData: '2',
            isActive: true
          },
          {
            slotData: '3',
            isActive: true
          },
          {
            slotData: '4'
          },
          {
            slotData: '5'
          },
          {
            slotData: '6'
          },
          {
            slotData: '7'
          }
        ]
      },
      {
        date: '2022/09/08',
        slots: [
          {
            slotData: '1'
          },
          {
            slotData: '2'
          },
          {
            slotData: '3',
            isActive: true
          },
          {
            slotData: '4',
            isActive: true
          },
          {
            slotData: '5',
            isActive: true
          },
          {
            slotData: '6'
          },
          {
            slotData: '7'
          }
        ]
      }
    ]
  })
  requests: any;
}

export class AdminTimeOffCancellationMail201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Praveen' })
  tutorName: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 12345 })
  tutorId: number;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        sessionDate: '12.12.2022',
        sessionTime: '13.00',
        cancellationReason: 'Sample Reason'
      },
      {
        sessionDate: '12.12.2022',
        sessionTime: '13.00',
        cancellationReason: 'Sample Reason'
      },
      {
        sessionDate: '12.12.2022',
        sessionTime: '13.00',
        cancellationReason: 'Sample Reason'
      }
    ]
  })
  requests: any;
}

export class TutorTimeOffCancellationMail201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Praveen test' })
  tutorName: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 12345 })
  tutorId: number;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      { sessionDate: '12.12.2022', sessionTime: '13.00', sessionDay: 'Sunday' },
      { sessionDate: '12.12.2022', sessionTime: '13.00', sessionDay: 'Sunday' },
      { sessionDate: '12.12.2022', sessionTime: '13.00', sessionDay: 'Sunday' }
    ]
  })
  requests: any;
}

export class AdminAvailabilityChangeRequest201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Praveen test' })
  tutorName: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 12345 })
  tutorId: number;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 15 })
  currentAvailability: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string', example: '2022/07/09' })
  effectiveDate: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Personal' })
  reasonForChange: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 10 })
  increasedSlots: number;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 20 })
  decreasedSlots: number;
}

export class TutorAvailabilityChangeRequestActioned201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Praveen' })
  tutorName: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 12345 })
  tutorId: number;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    example: { isRejected: true, reason: 'Test reason' }
  })
  rejectedReason: any;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    example: { isunAccepted: true, reason: 'Test reason' }
  })
  unAcceptedReason: any;
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        sessionDay: '12.12.2022',
        sessionTime: '13.00',
        sessionChange: true,
        isApproved: true
      },
      { sessionDay: '12.12.2022', sessionTime: '13.00', isUnAccepted: true },
      {
        sessionDay: '12.12.2022',
        sessionTime: '13.00',
        sessionChange: true,
        isRejected: true
      },
      { sessionDay: '12.12.2022', sessionTime: '13.00', isApproved: true }
    ]
  })
  requests: any;
}

export class TutorChangesMadeToAvailabilityByAdmin201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Praveen' })
  tutorName: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string', example: '2022/09/24' })
  effectiveDate: string;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    example: { isTrue: true, reason: 'Test reason' }
  })
  unAcceptedToInactive: any;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    example: { isTrue: true, reason: 'Test reason' }
  })
  activeToInactive: any;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    example: { isTrue: true, reason: 'Test reason' }
  })
  activeToUnaccepted: any;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      {
        sessionDay: '12.12.2022',
        sessionTime: '13.00',
        isUnAccepted1: true,
        isActive2: true
      },
      {
        sessionDay: '12.12.2022',
        sessionTime: '13.00',
        isUnAccepted1: true,
        isInactive2: true
      },
      {
        sessionDay: '12.12.2022',
        sessionTime: '13.00',
        isInactive1: true,
        isUnAccepted2: true
      },
      {
        sessionDay: '12.12.2022',
        sessionTime: '13.00',
        isActive1: true,
        isUnAccepted2: true
      }
    ]
  })
  requests: any;
}

export class TutorInitialAvailabilityActioned201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Praveen' })
  tutorName: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string', example: '2022/09/24' })
  effectiveDate: string;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    example: { isTrue: true, reason: 'Test reason' }
  })
  unAcceptedToInactive: any;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    example: { isTrue: true, reason: 'Test reason' }
  })
  activeToInactive: any;

  @IsNotEmpty()
  @ApiProperty({
    type: {},
    example: { isTrue: true, reason: 'Test reason' }
  })
  activeToUnaccepted: any;

  @IsNotEmpty()
  @ApiProperty({
    type: [],
    example: [
      { sessionDay: '12.12.2022', sessionTime: '13.00', isUnAccepted: true },
      { sessionDay: '12.12.2022', sessionTime: '13.00', isUnAccepted: true },
      { sessionDay: '12.12.2022', sessionTime: '13.00', isInactive: true },
      { sessionDay: '12.12.2022', sessionTime: '13.00', isActive: true }
    ]
  })
  requests: any;
}

export class PermanentSwapNotification201 {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'PraveenK' })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'praveen@thirdspaceglobal.com' })
  tutorManagerEmail: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 12345 })
  tutorId: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string', example: '2022/01/22' })
  sessionType: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string', example: '2022/01/22' })
  date: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string', example: '2022/01/22' })
  sessionSlot: string;
}

export class PermanentSwapNotifiactionDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}
