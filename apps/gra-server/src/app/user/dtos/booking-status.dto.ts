import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsArray,
  IsNumber,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingStatusDto {
  //* Added IsOptional() to each property
  @ApiProperty({
    type: Number,
    example: 11
  })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    type: Number,
    example: 4
  })
  @IsNumber()
  @IsOptional()
  timeSlotId: number;

  @ApiProperty({
    type: [Number],
    example: [12, 14]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  timeSlotIdArray: number[];

  @ApiProperty({
    type: Number,
    example: 112
  })
  @IsNumber()
  @IsOptional()
  interviewerId?: number;
  @ApiProperty({
    type: [Number],
    example: 11
  })
  @IsArray() // * Change to type array
  @Type(() => Number)
  @IsOptional()
  interviewerIds?: number[];

  @ApiProperty({
    type: String,
    example: 'yes'
  })
  @IsString()
  @IsOptional()
  appointment?: string;

  @ApiProperty({
    type: Number,
    example: 1
  })
  @IsNumber()
  @IsOptional()
  status: number;

  @ApiProperty({
    type: Number,
    example: 14
  })
  @IsNumber()
  @IsOptional()
  bookingStatusId: number;

  @ApiProperty({
    type: Number,
    example: 120
  })
  @IsNumber()
  @IsOptional()
  candidateId?: number;

  @ApiProperty({
    type: Number,
    example: 10
  })
  @IsNumber()
  @IsOptional()
  appointmentTypeId?: number;

  @ApiProperty({
    type: Number,
    example: 112
  })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({
    type: String,
    example: 'evening'
  })
  @IsString()
  @IsOptional()
  appointmentType: string;

  @ApiProperty({
    type: String,
    example: 'good'
  })
  @IsString()
  @IsOptional()
  status2?: string;

  @ApiProperty({
    type: String,
    example: 'Abdalla'
  })
  @IsString()
  @IsOptional()
  candidateName?: string;

  @ApiProperty({
    type: String,
    example: 'gishan'
  })
  @IsString()
  @IsOptional()
  interviewerName?: string;
  // @IsNotEmpty()

  @ApiProperty({
    type: String,
    example: '10/10/2022'
  })
  @IsString()
  @IsOptional()
  date: string;

  @ApiProperty({
    type: String,
    example: '2022-10-19'
  })
  @IsString()
  @IsOptional()
  bookingDate: string;

  @ApiProperty({
    type: [String],
    example: ['2022-01-01']
  })
  @IsOptional()
  dateArray: string[];

  @ApiProperty({
    type: String,
    example: 'gishan@gmail.com'
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  interviewerEmail: string;

  @ApiProperty({
    type: Number,
    example: '80'
  })
  @IsOptional()
  @IsNumber()
  slotId: number;

  @ApiProperty({
    type: String,
    example: '2023-02-02'
  })
  @IsOptional()
  @IsString()
  dateSelected: string;

  @ApiProperty({
    type: Number,
    example: 1
  })
  @IsOptional()
  @IsNumber()
  slotType: number;

  @ApiProperty({
    type: Number,
    example: 1
  })
  @IsOptional()
  @IsNumber()
  withdrawBookingId?: number;

  @ApiProperty({
    type: String,
    example: 'Booking'
  })
  @IsOptional()
  @IsString()
  bookingScenario: string;
}

export class Data {
  @ApiProperty()
  id: number;

  @ApiProperty()
  slotType: number;

  @ApiProperty()
  timeSlotId: number;

  @ApiProperty()
  interviewerId: number;

  @ApiProperty()
  interviewerIds: number;

  @ApiProperty()
  appointment: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  bookingStatusId: number;

  @ApiProperty()
  candidateId: number;

  @ApiProperty()
  appointmentTypeId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  appointmentType: string;

  @ApiProperty()
  status2: string;

  @ApiProperty()
  candidateName: string;

  @ApiProperty()
  interviewerName: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  interviewerEmail: string;
}

export class CoverAndRemoveSlotResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'message',
    example: 'Slot removed successfully'
  })
  message: string;
}

export class CoverAndRemoveSlotRequestDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 224
  })
  id: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'status',
    example: 13
  })
  status: number;
}

export class FetchAvailableSlotsDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'appointment Type Id',
    example: 3
  })
  appointmentTypeId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'booking Status Id',
    example: 1
  })
  bookingStatusId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'candidate Id',
    example: 51
  })
  candidateId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2024-04-09'
  })
  date: string;
}

export class AvailableSlotsResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      morning: [
        {
          id: 223,
          interviewer_id: 1,
          appointment_type_ref_id: 2,
          slot_capacity: 1,
          slot_time: '08:00 - 09:00 AM',
          slot_start_time: '1970-01-01T08:00:00.000Z',
          slotId: 176,
          slot_type: 1
        }
      ],
      afternoon: [
        {
          id: 227,
          interviewer_id: 1,
          appointment_type_ref_id: 2,
          slot_capacity: 1,
          slot_time: '12:00 - 01:00 PM',
          slot_start_time: '1970-01-01T12:00:00.000Z',
          slotId: 180,
          slot_type: 2
        },
        {
          id: 228,
          interviewer_id: 1,
          appointment_type_ref_id: 2,
          slot_capacity: 1,
          slot_time: '01:00 - 02:00 PM',
          slot_start_time: '1970-01-01T13:00:00.000Z',
          slotId: 181,
          slot_type: 2
        }
      ],
      evening: []
    }
  })
  data: object;
}

export class CandidateBookAppointmentRequestDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'appointment Type Id',
    example: 2
  })
  appointmentTypeId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'booking Scenario',
    example: 'Reschedule'
  })
  bookingScenario: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'candidate Id',
    example: 50
  })
  candidateId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Selected date',
    example: '2024-04-10'
  })
  dateSelected: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 231
  })
  id: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Slot Id',
    example: 134
  })
  slotId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Status',
    example: 3
  })
  status: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'withdraw Booking Id',
    example: 228
  })
  withdrawBookingId: number;
}

export class CandidateBookAppointmentResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: Number,
    description: 'job id',
    example: 3
  })
  jobId: number;
}

export class CandidateUpdateWithdrawBookingDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    example: 219
  })
  id: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    example: 1
  })
  status: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Not interested'
  })
  withdrawReason: string;
}

export class DailyInterviewerCalendarFetchRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'date',
    example: '2024-04-11T10:05:14.323Z'
  })
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'interviewer Id',
    example: 2
  })
  interviewerId?: number;
}

export class DailyInterviewerCalendarFetchResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        time: '08:00 AM',
        meetings: []
      },
      {
        time: '09:00 AM',
        meetings: []
      },
      {
        time: '10:00 AM',
        meetings: [
          {
            slotSession: 'AM',
            slotStartTime: '10:00',
            slotEndTime: '10:45',
            start1: 10,
            start: 0,
            end: 45,
            duration: 45,
            booking_status_id: 236,
            event_title: 'Final Assessment',
            eventId: 3,
            appointment_type_id: 3,
            candiTspId: '',
            candiEmail: '',
            candiMobile: '',
            candiCountry: '',
            name: '',
            slot: '10:00 - 10:45 AM',
            status: 'AVAILABLE',
            history: []
          }
        ]
      },
      {
        time: '11:00 AM',
        meetings: []
      },
      {
        time: '12:00 PM',
        meetings: [
          {
            slotSession: 'PM',
            slotStartTime: '12:00',
            slotEndTime: '12:40',
            start1: 12,
            start: 0,
            end: 40,
            duration: 40,
            booking_status_id: 233,
            event_title: 'Phone Interview',
            eventId: 1,
            appointment_type_id: 1,
            candiTspId: '',
            candiEmail: '',
            candiMobile: '',
            candiCountry: '',
            name: '',
            slot: '12:00 - 12:40 PM',
            status: 'AVAILABLE',
            history: []
          }
        ]
      },
      {
        time: '01:00 PM',
        meetings: []
      },
      {
        time: '02:00 PM',
        meetings: []
      },
      {
        time: '03:00 PM',
        meetings: []
      },
      {
        time: '04:00 PM',
        meetings: []
      },
      {
        time: '05:00 PM',
        meetings: []
      },
      {
        time: '06:00 PM',
        meetings: []
      },
      {
        time: '07:00 PM',
        meetings: []
      },
      {
        time: '08:00 PM',
        meetings: []
      },
      {
        time: '09:00 PM',
        meetings: []
      },
      {
        time: '10:00 PM',
        meetings: []
      }
    ]
  })
  data: object[];
}

export class CandidateUpdateWithdrawBookingResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Succesfully Updated'
  })
  message: boolean;
}

export class AddBulkEventAvailabilityDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'appointmentTypeId',
    example: 1
  })
  appointmentTypeId: number;

  @IsOptional()
  @ApiProperty({
    type: 'string[]',
    isArray: true,
    description: 'dateArray',
    example: ['2024-04-11', '2024-04-12']
  })
  dateArray: string[];

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'interviewerId',
    example: 1
  })
  interviewerId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'status',
    example: 1
  })
  status: number;

  @IsOptional()
  @ApiProperty({
    type: [Number],
    isArray: true,
    description: 'timeSlotIdArray',
    example: [76, 82, 81]
  })
  timeSlotIdArray: number[];
}

export class AddBulkEventAvailabilityResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      timeSlotIdArray: [76, 82, 81],
      interviewerId: 1,
      status: 1,
      dateArray: ['2024-04-11', '2024-04-12'],
      appointmentTypeId: 1,
      slotsToCreateAll: {
        '2024-04-11': [76, 82, 81],
        '2024-04-12': [82]
      },
      overlappingSlotsAll: {
        '2024-04-12': [76, 81]
      },
      slotsToCreateAllCount: 4,
      overlappingSlotsAllCount: 2
    }
  })
  details: Data;
}

export class FetchSlotsForSwapRequestDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'appointment type id',
    example: 1
  })
  appointmentTypeId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2024-04-09'
  })
  date: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'status2',
    example: 'COVER'
  })
  status: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'timeSlotId',
    example: 77
  })
  timeSlotId: number;
}

export class FetchSlotsForSwapResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      id: 286,
      status: 1,
      interviewer_id: 1,
      name: 'Interviewer Acc',
      isOnLeave: 0
    }
  })
  data: object;
}

export class BulkReschedulingTableFetchRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'appointment',
    example: '1'
  })
  appointment: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'candidate Id',
    example: 51
  })
  candidateId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2024-04-09'
  })
  date: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'interviewer Id',
    example: 1
  })
  interviewerId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'status2',
    example: '3'
  })
  status2: string;
}

export class BulkReschedulingTableFetchResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        id: 311,
        slot_id: 71,
        slot_time: '08:00 - 08:40 AM',
        interviewer_id: 1,
        date: '2024-05-01',
        interviewer_name: 'Interviewer Acc',
        candidate_id: 57,
        candidate_name: 'Tutor ACChjddm',
        appointment_type_id: 1,
        appointment_type: 'PI',
        time_slot_list: [
          {
            id: 311,
            slot_id: 71,
            slot_time: '08:00 - 08:40 AM'
          },
          {
            id: 312,
            slot_id: 75,
            slot_time: '12:00 - 12:40 PM'
          },
          {
            id: 313,
            slot_id: 72,
            slot_time: '09:00 - 09:40 AM'
          },
          {
            id: 314,
            slot_id: 73,
            slot_time: '10:00 - 10:40 AM'
          },
          {
            id: 315,
            slot_id: 83,
            slot_time: '08:00 - 08:40 PM'
          }
        ]
      }
    ]
  })
  data: object;
}

export class BulkSwapAndRescheduleRequestDto {
  @ApiProperty({
    example: [
      {
        oldBookingStatusId: 317,
        newBookingStatusId: 319,
        candidateId: 57,
        date: '2024-05-02'
      },
      {
        oldBookingStatusId: 316,
        newBookingStatusId: 320,
        candidateId: 59,
        date: '2024-05-02'
      }
    ]
  })
  bookings: {
    oldBookingStatusId: number;
    newBookingStatusId: number;
    candidateId: number;
    date: string;
  }[];
}

export class BulkSwapAndRescheduleResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;
}

export class BookingStatusResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      id: 34,
      slotType: 34,
      timeSlotId: 345,
      interviewerId: 4568,
      interviewerIds: 1,
      appointment: '001',
      status: 1,
      bookingStatusId: 101,
      candidateId: 111,
      appointmentTypeId: 10,
      userId: 101,
      appointmentType: 'online',
      status2: 'Good',
      candidateName: 'Sithira',
      interviewerName: 'Avishka',
      date: '2022-10-31T10:21:02.778Z',
      interviewerEmail: 'aviska@thirdspaceglobal.com'
    }
  })
  data: object;
}

export class AvailableSlotsInterviewerDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'bookingStatusId',
    example: 1
  })
  bookingStatusId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'appointmentTypeId',
    example: 1
  })
  appointmentTypeId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'interviewerId',
    example: 1
  })
  interviewerId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2024-04-03'
  })
  date: string;
}

export class AvailableSlotsInterviewerResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      morning: [],
      afternoon: [
        {
          id: 172,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '12:15 - 12:30 PM',
          slotId: 18,
          slot_type: 2
        },
        {
          id: 173,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '12:30 - 12:45 PM',
          slotId: 19,
          slot_type: 2
        },
        {
          id: 176,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '01:15 - 01:30 PM',
          slotId: 22,
          slot_type: 2
        },
        {
          id: 177,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '01:30 - 01:45 PM',
          slotId: 23,
          slot_type: 2
        },
        {
          id: 178,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '01:45 - 02:00 PM',
          slotId: 24,
          slot_type: 2
        },
        {
          id: 179,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '02:00 - 02:15 PM',
          slotId: 25,
          slot_type: 2
        },
        {
          id: 180,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '02:15 - 02:30 PM',
          slotId: 26,
          slot_type: 2
        },
        {
          id: 181,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '02:30 - 02:45 PM',
          slotId: 27,
          slot_type: 2
        },
        {
          id: 182,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '02:45 - 03:00 PM',
          slotId: 28,
          slot_type: 2
        },
        {
          id: 183,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '03:00 - 03:15 PM',
          slotId: 29,
          slot_type: 2
        },
        {
          id: 184,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '03:15 - 03:30 PM',
          slotId: 30,
          slot_type: 2
        },
        {
          id: 185,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '03:30 - 03:45 PM',
          slotId: 31,
          slot_type: 2
        },
        {
          id: 186,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '03:45 - 04:00 PM',
          slotId: 32,
          slot_type: 2
        },
        {
          id: 187,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '04:00 - 04:15 PM',
          slotId: 33,
          slot_type: 2
        },
        {
          id: 188,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '04:15 - 04:30 PM',
          slotId: 34,
          slot_type: 2
        },
        {
          id: 189,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '04:30 - 04:45 PM',
          slotId: 35,
          slot_type: 2
        },
        {
          id: 190,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '04:45 - 05:00 PM',
          slotId: 36,
          slot_type: 2
        },
        {
          id: 191,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '05:00 - 05:15 PM',
          slotId: 37,
          slot_type: 2
        },
        {
          id: 192,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '05:15 - 05:30 PM',
          slotId: 38,
          slot_type: 2
        },
        {
          id: 193,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '05:30 - 05:45 PM',
          slotId: 39,
          slot_type: 2
        },
        {
          id: 194,
          date: '2024-04-03T00:00:00.000Z',
          slot_time: '05:45 - 06:00 PM',
          slotId: 40,
          slot_type: 2
        }
      ],
      evening: []
    }
  })
  data: object;
}

export class CandidateNameInBooking201Dto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false],
    example: true
  })
  success: boolean;
  @ApiProperty({
    type: String,
    example: []
  })
  data: string;
}

export class CandidateNameInBooking400Dto {
  @ApiProperty({
    type: Number,
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string[]',
    examples: [
      ['Id Must be entered', 'It must be a Number'],
      'Unexpected token : in JSON at position 69'
    ],
    example: [
      'All IDs and Slot Type must be a number conforming to the specified constraints',
      'Date must be a date Type'
    ]
  })
  messages: string[];

  @ApiProperty({
    type: String,
    examples: [
      'interviewerId must be a number conforming to the specified constraints',
      'interviewerIds must be a number conforming to the specified constraints',
      'appointment must be a string',
      'status must be a number conforming to the specified constraints',
      'bookingStatusId must be a number conforming to the specified constraints'
    ],
    example:
      'interviewerIds must be a number conforming to the specified constraints'
  })
  message: string;

  @ApiProperty({
    type: String,
    example: 'Bad Request'
  })
  'error': string;
}

export class ExistsBookingStatus201Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: String,
    examples: ['available', 'exists'],
    example: 'available'
  })
  status: string;

  @ApiProperty({
    type: String,
    examples: ['This slot is Available.', 'This slot is already exists'],
    example: 'This slot is Available.'
  })
  message: string;
}

export class AdminMasterTableResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: Number,
    description: 'count',
    example: 120
  })
  count: number;

  @ApiProperty({
    example: [
      {
        id: 325,
        candidateId: null,
        candidateName: '',
        status: 1,
        statusText: 'AVAILABLE',
        appointmentType: 'PI',
        appointmentTypeId: 1,
        appointmentTypeText: 'Phone Interview',
        date: '2024-05-03',
        time: '08:00 - 08:40 PM',
        duration: 40,
        slotTimeID: 83,
        interviewerID: 1,
        interviewerName: 'Interviewer Acc'
      },
      {
        id: 320,
        candidateId: 59,
        candidateName: 'Tutor ACCucemo',
        candidateLevel: 4,
        status: 3,
        statusText: 'BOOKED',
        appointmentType: 'PI',
        appointmentTypeId: 1,
        appointmentTypeText: 'Phone Interview',
        date: '2024-05-02',
        time: '08:00 - 08:40 PM',
        duration: 40,
        slotTimeID: 83,
        interviewerID: 1,
        interviewerName: 'Interviewer Acc',
        history: [
          {
            booking_history_id: 163,
            type: 'PI',
            event_title: 'Phone Interview',
            date: '2024-05-02',
            slot: '10:00 - 10:40 AM',
            status: 'WITHDRAW'
          },
          {
            booking_history_id: 164,
            type: 'PI',
            event_title: 'Phone Interview',
            date: '2024-05-02',
            slot: '08:00 - 08:40 AM',
            status: 'BOOKED'
          }
        ]
      }
    ]
  })
  data: object;
}

export class AdminMasterTableRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'appointment Type',
    example: '2'
  })
  appointmentType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'filter booking Id',
    example: '2'
  })
  filterBookingId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2024-04-09'
  })
  date: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'interviewer Id',
    example: 1
  })
  interviewerId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'candidate Id',
    example: 1
  })
  candidateId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'page',
    example: 1
  })
  page: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'page Size',
    example: 10
  })
  pageSize: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'status',
    example: 1
  })
  status: number;
}

export class GetCandidateBookingStatus200Dto {
  @ApiProperty({
    example: {
      success: false
    }
  })
  data: object;
}

export class getCandidateBookingStatus404Dto {}

export class getCandidateBookingStatus403Dto {}

export class GetRescheduleCountDto {
  @ApiProperty({
    type: Number,
    example: 1
  })
  @IsNumber()
  tspId: number;
}

export class GetRescheduleCountResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: Number,
    example: 2
  })
  @IsNumber()
  count: number;
}

export class GetInterviewerContractDetailsDto {
  @ApiProperty({
    type: [Number],
    description: 'interviewerIds',
    example: [12, 14]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  interviewerIds: number[];
}

export class GetInterviewerContractDetailsResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'Interviewer Acc',
        mail: 'interviewer@tsg.com',
        meetingLink: 'https://meet.google.com/kab-wwqr-001',
        PI: 1,
        TI: 1,
        FA: 1,
        D1: 1,
        D2: 1
      },
      {
        id: 20,
        name: 'Auditorfive Acc',
        mail: 'interviewer_12324567890@tsg.com',
        meetingLink: null,
        PI: 1,
        TI: 1,
        FA: 1,
        D1: 0,
        D2: 0
      }
    ]
  })
  data: object[];
}

export class InterviewerContractUpdateDto {
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'index',
    example: 1
  })
  id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Interviewer name',
    example: 'James Bond'
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Interviewer email',
    example: 'inteviwer@tsg.com'
  })
  mail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'meetingLink',
    example: 'inteviwer@tsg.com'
  })
  meetingLink: string;

  [key: string]: string | number;
}

export class InterviewerContractUpdateResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      [
        {
          id: 18,
          user_id: 20,
          status: 1,
          appointment_type: 1,
          created_at: '2024-04-10T16:46:03.000Z',
          created_by: 2,
          updated_at: '2024-04-27T04:50:50.000Z',
          updated_by: 2
        },
        {
          id: 17,
          user_id: 20,
          status: 1,
          appointment_type: 2,
          created_at: '2024-04-10T16:46:03.000Z',
          created_by: 2,
          updated_at: '2024-04-27T04:50:50.000Z',
          updated_by: 2
        }
      ],
      [
        {
          id: 4,
          user_id: 29,
          status: 1,
          appointment_type: 1,
          created_at: '2024-04-03T11:41:17.000Z',
          created_by: null,
          updated_at: '2024-04-27T04:50:50.000Z',
          updated_by: 2
        }
      ]
    ]
  })
  data: object[];
}

export class InterviewerTimeTableFetchDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'filter date',
    example: '2024-04-27'
  })
  date: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'skip',
    example: '0'
  })
  skip: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'take',
    example: '10'
  })
  take: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'interviewerId',
    example: '1'
  })
  interviewerId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty({
    type: [Number],
    description: 'array of status ids',
    example: [1, 2]
  })
  status: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty({
    type: [Number],
    description: 'array of eventType ids',
    example: [1, 2]
  })
  eventType: number[];
}

export class InterviewerTimeTableFetchDailyResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: Number,
    description: 'count',
    example: 2
  })
  count: number;

  @ApiProperty({
    example: [
      {
        id: 1,
        interviewerName: 'Interviewer Acc',
        interviewerEmail: 'interviewer@tsg.com',
        isOnLeave: false,
        leaveApplications: [],
        '08:00 - 09:00': [],
        '09:00 - 10:00': [],
        '10:00 - 11:00': [],
        '11:00 - 12:00': [],
        '12:00 - 13:00': [],
        '13:00 - 14:00': [],
        '14:00 - 15:00': [],
        '15:00 - 16:00': [],
        '16:00 - 17:00': [],
        '17:00 - 18:00': [],
        '18:00 - 19:00': [],
        '19:00 - 20:00': [],
        '20:00 - 21:00': [],
        '21:00 - 22:00': [],
        '22:00 - 23:00': []
      }
    ]
  })
  data: object[];
}

export class InterviewerTimeTableDailyExportResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        bookingId: 1240,
        interviewerId: 1,
        interviewerName: 'Interviewer Acc',
        interviewerEmail: 'interviewer@tsg.com',
        appointmentTypeId: 2,
        appointmentTypeCode: 'TI',
        appointmentTypeTitle: 'Teaching Interview',
        slotTime: '12:00 - 12:30 PM',
        slotStartTime: '1970-01-01T12:00:00.000Z',
        slotEndTime: '1970-01-01T12:30:00.000Z',
        slotDuration: 30,
        bookingStatus: 'AVAILABLE'
      },
      {
        bookingId: 1241,
        interviewerId: 1,
        interviewerName: 'Interviewer Acc',
        interviewerEmail: 'interviewer@tsg.com',
        appointmentTypeId: 2,
        appointmentTypeCode: 'TI',
        appointmentTypeTitle: 'Teaching Interview',
        slotTime: '12:30 - 01:00 PM',
        slotStartTime: '1970-01-01T12:30:00.000Z',
        slotEndTime: '1970-01-01T13:00:00.000Z',
        slotDuration: 30,
        bookingStatus: 'AVAILABLE'
      }
    ]
  })
  data: object[];
}

export class InterviewerTimeTableFetchWeeklyResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: Number,
    description: 'count',
    example: 2
  })
  count: number;

  @ApiProperty({
    example: [
      {
        id: 1,
        interviewerName: 'Interviewer Acc',
        interviewerEmail: 'interviewer@tsg.com',
        isOnLeave: false,
        leaveApplications: [],
        Monday: {
          totalCount: 1,
          available: 1,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Tuesday: {
          totalCount: 0,
          available: 0,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Wednesday: {
          totalCount: 0,
          available: 0,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Thursday: {
          totalCount: 3,
          available: 2,
          cover: 0,
          booked: 1,
          completed: 0
        },
        Friday: {
          totalCount: 19,
          available: 17,
          cover: 0,
          booked: 2,
          completed: 0
        },
        Saturday: {
          totalCount: 19,
          available: 19,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Sunday: {
          totalCount: 0,
          available: 0,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Week: {
          totalCount: 42,
          available: 39,
          cover: 0,
          booked: 3,
          completed: 0
        }
      },
      {
        id: 20,
        interviewerName: 'Auditorfive Acc',
        interviewerEmail: 'interviewer_12324567890@tsg.com',
        isOnLeave: false,
        leaveApplications: [],
        Monday: {
          totalCount: 1,
          available: 1,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Tuesday: {
          totalCount: 20,
          available: 0,
          cover: 20,
          booked: 0,
          completed: 0
        },
        Wednesday: {
          totalCount: 0,
          available: 0,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Thursday: {
          totalCount: 9,
          available: 9,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Friday: {
          totalCount: 6,
          available: 6,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Saturday: {
          totalCount: 26,
          available: 26,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Sunday: {
          totalCount: 0,
          available: 0,
          cover: 0,
          booked: 0,
          completed: 0
        },
        Week: {
          totalCount: 62,
          available: 42,
          cover: 20,
          booked: 0,
          completed: 0
        }
      }
    ]
  })
  data: object[];
}

export class InterviewerTimeTableFetchWeeklyExportResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        id: 1,
        interviewerName: 'Interviewer Acc',
        interviewerEmail: 'interviewer@tsg.com',
        totalCount: 42,
        cover: 0,
        booked: 3,
        completed: 0,
        available: 39
      },
      {
        id: 20,
        interviewerName: 'Auditorfive Acc',
        interviewerEmail: 'interviewer_12324567890@tsg.com',
        totalCount: 62,
        cover: 20,
        booked: 0,
        completed: 0,
        available: 42
      }
    ]
  })
  data: object[];
}
export class ConvertAllSlotsToCoverRequestDto {
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'interviewer Id',
    example: 1
  })
  interviewerId: number;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2022-10-10'
  })
  date: string;
}

export class ConvertAllSlotsToCoverResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'message',
    example: 'Succesfully converted 4 slots to cover'
  })
  message: string;
}

export class InterviewerAvailabilitySlotsFetchRequestDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'appointmentTypeId',
    example: 2
  })
  appointmentTypeId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2024-04-09'
  })
  date: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'interviewerId',
    example: 1
  })
  interviewerId: number;
}

export class InterviewerAvailabilitySlotsFetchResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: {
      morning: [
        {
          id: 86,
          slot_time: '08:00 - 08:45 AM',
          start_time: '1970-01-01T08:00:00.000Z',
          end_time: '1970-01-01T08:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 87,
          slot_time: '09:00 - 09:45 AM',
          start_time: '1970-01-01T09:00:00.000Z',
          end_time: '1970-01-01T09:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 88,
          slot_time: '10:00 - 10:45 AM',
          start_time: '1970-01-01T10:00:00.000Z',
          end_time: '1970-01-01T10:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 89,
          slot_time: '11:00 - 11:45 AM',
          start_time: '1970-01-01T11:00:00.000Z',
          end_time: '1970-01-01T11:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        }
      ],
      afternoon: [
        {
          id: 90,
          slot_time: '12:00 - 12:45 PM',
          start_time: '1970-01-01T12:00:00.000Z',
          end_time: '1970-01-01T12:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 91,
          slot_time: '01:00 - 01:45 PM',
          type: 3,
          alreadySelected: true
        },
        {
          id: 92,
          slot_time: '02:00 - 02:45 PM',
          start_time: '1970-01-01T14:00:00.000Z',
          end_time: '1970-01-01T14:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 93,
          slot_time: '03:00 - 03:45 PM',
          start_time: '1970-01-01T15:00:00.000Z',
          end_time: '1970-01-01T15:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 94,
          slot_time: '04:00 - 04:45 PM',
          start_time: '1970-01-01T16:00:00.000Z',
          end_time: '1970-01-01T16:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 95,
          slot_time: '05:00 - 05:45 PM',
          start_time: '1970-01-01T17:00:00.000Z',
          end_time: '1970-01-01T17:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        }
      ],
      evening: [
        {
          id: 96,
          slot_time: '06:00 - 06:45 PM',
          start_time: '1970-01-01T18:00:00.000Z',
          end_time: '1970-01-01T18:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 97,
          slot_time: '07:00 - 07:45 PM',
          start_time: '1970-01-01T19:00:00.000Z',
          end_time: '1970-01-01T19:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        },
        {
          id: 98,
          slot_time: '08:00 - 08:45 PM',
          type: 3,
          alreadySelected: true
        },
        {
          id: 99,
          slot_time: '09:00 - 09:45 PM',
          type: 3,
          alreadySelected: true
        },
        {
          id: 100,
          slot_time: '10:00 - 10:45 PM',
          start_time: '1970-01-01T22:00:00.000Z',
          end_time: '1970-01-01T22:45:00.000Z',
          duration: 45,
          type: 3,
          alreadySelected: false
        }
      ]
    }
  })
  data: object;
}

export class RemoveAllOpenSlotsDto {
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 1
  })
  interviewerId: number;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'date',
    example: '2022-10-10'
  })
  date: string;
}

export class RemoveAllOpenSlotsResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: String,
    description: 'message',
    example: 'Succesfully removed 4 / 4 slots'
  })
  message: string;
}

export class GetAppointmentDetailsResponseDto {
  @ApiProperty({
    example: {
      id: 2,
      type: 'TI',
      event_title: 'Teaching Interview',
      event_duration: 30
    }
  })
  data: object;
}

export class GetJobStatusResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Job not finished'
  })
  'error': string;

  @ApiProperty({
    type: String,
    example: '2024-04-27 03:23 PM'
  })
  'jobFinishedAt': string;

  @ApiProperty({
    example: {
      id: 1251,
      date: '2024-04-27T00:00:00.000Z',
      slotTime: '05:30 - 06:00 PM',
      slotStartTime: '1970-01-01T17:30:00.000Z',
      slotEndTime: '1970-01-01T18:00:00.000Z',
      candidateLevel: 5,
      slotId: 120,
      lastBookingStatus: 3,
      interviewerId: 1
    }
  })
  details: object;
}

export class ApssAdminMetaDataResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    example: [
      {
        id: 1,
        status: 'Available'
      },
      {
        id: 3,
        status: 'Booked'
      }
    ]
  })
  bookingStatusOptions: object[];

  @ApiProperty({
    example: [
      {
        id: 1,
        type: 'PI',
        event_title: 'Phone Interview',
        enabled: 1
      },
      {
        id: 2,
        type: 'TI',
        event_title: 'Teaching Interview',
        enabled: 1
      }
    ]
  })
  eventTypeOptions: object[];

  @ApiProperty({
    example: [
      {
        id: 1,
        type: 'PI',
        event_title: 'Phone Interview',
        enabled: 1
      },
      {
        id: 2,
        type: 'TI',
        event_title: 'Teaching Interview',
        enabled: 1
      }
    ]
  })
  usedEventTypeOptions: object[];

  @ApiProperty({
    example: [15, 20, 30, 40, 45, 50, 60]
  })
  eventDurationOptions: number[];
}

export class ApssAdminBookAppointmentTableFetchRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'candidateId',
    example: '2'
  })
  candidateId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'candidateEmail',
    example: 'int@tsg.com'
  })
  candidateEmail: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'appointmentTypeId',
    example: '1'
  })
  appointmentTypeId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'bookingDate',
    example: '2024-01-01'
  })
  bookingDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'bookingStatusId',
    example: '3'
  })
  bookingStatusId: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'skip',
    example: '0'
  })
  skip: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'take',
    example: '10'
  })
  take: number;
}

export class ApssAdminBookAppointmentTableFetchResponseDto {
  @ApiProperty({
    type: Boolean,
    examples: [true, false]
  })
  success: boolean;

  @ApiProperty({
    type: Number,
    description: 'count',
    example: 120
  })
  count: number;

  @ApiProperty({
    example: [
      {
        id: 11,
        candidateId: 11,
        candidateLevel: 2,
        candidateEmail: 'tutor2@tsg.com',
        candidateName: 'Tutor Edu',
        bookingId: null,
        bookingStatusId: null,
        bookingStatus: null,
        appointmentTypeId: null,
        appointmentTypeCode: null,
        appointmentType: null,
        bookingDate: null,
        slotId: null,
        slotTime: null,
        interviewerId: null,
        interviewerEmail: null,
        interviewerName: null
      },
      {
        id: 12,
        candidateId: 12,
        candidateLevel: 3,
        candidateEmail: 'tutor3@tsg.com',
        candidateName: 'Tutor Math',
        bookingId: null,
        bookingStatusId: null,
        bookingStatus: null,
        appointmentTypeId: null,
        appointmentTypeCode: null,
        appointmentType: null,
        bookingDate: null,
        slotId: null,
        slotTime: null,
        interviewerId: null,
        interviewerEmail: null,
        interviewerName: null
      }
    ]
  })
  data: object;
}

export class JobTerminationsResponseDto {
  @ApiProperty({
    type: Boolean,
    example: [true, false]
  })
  success: boolean;
}
