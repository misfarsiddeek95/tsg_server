import { ApiProperty } from '@nestjs/swagger';

export class ResposeSimMetaData200Dto {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: 'array',
    example: {
      POINT_OF_INVESTIGATION: [
        {
          value: 1,
          label: 'TSL Ticket'
        },
        {
          value: 2,
          label: 'Session end time'
        },
        {
          value: 3,
          label: 'Red Flag - Safeguarding'
        },
        {
          value: 4,
          label: 'Red Flag - Others'
        },
        {
          value: 5,
          label: 'Red Flag - Disruptive behaviour (severe)'
        },
        {
          value: 6,
          label: 'Raised by tutor'
        },
        {
          value: 7,
          label: 'QA Findings'
        },
        {
          value: 8,
          label: 'OPs Findings'
        },
        {
          value: 9,
          label: 'New tutor'
        },
        {
          value: 10,
          label: 'Negative Pupil Comment'
        },
        {
          value: 11,
          label: 'Data outlier'
        },
        {
          value: 12,
          label: 'LMS course completion'
        },
        {
          value: 137,
          label: 'Coaching Session'
        }
      ],
      VALIDITY_OF_THE_CASE: [
        {
          value: 26,
          label: 'Valid'
        },
        {
          value: 27,
          label: 'Not Valid'
        }
      ],
      CONCERN_CATEGORY: [
        {
          value: 28,
          label: 'Used unprofessional, offensive language and expressions'
        },
        {
          value: 29,
          label:
            'Used non English language to communicate with the student/third party'
        },
        {
          value: 30,
          label: 'Used inappropriate tone of voice'
        },
        {
          value: 31,
          label: 'UPFR'
        },
        {
          value: 32,
          label: 'Unavailability and Non Responsiveness during work hours'
        },
        {
          value: 33,
          label: 'Tutor unresponsive in the session'
        },
        {
          value: 34,
          label: 'Tutor receiving poor session quality ratings - Tier 2'
        },
        {
          value: 35,
          label: 'Tutor receiving poor session quality ratings - Tier 1'
        },
        {
          value: 36,
          label: 'Technical issues'
        },
        {
          value: 37,
          label: 'Taught the wrong s2s'
        },
        {
          value: 38,
          label: 'Taught the wrong LO'
        },
        {
          value: 39,
          label: 'Taught the same LO for more than 3 times'
        },
        {
          value: 40,
          label: 'Student disruption - Availability Decrease'
        },
        {
          value: 41,
          label: 'Spent too much time on the reflection slide'
        },
        {
          value: 42,
          label: 'Spent too much time on the introduction slide'
        },
        {
          value: 43,
          label: 'Slot disruption - 3rd instance'
        },
        {
          value: 44,
          label: 'Slot disruption - 2nd instance, more than 10'
        },
        {
          value: 45,
          label: 'Shared personal information with the student'
        },
        {
          value: 46,
          label: 'Reported technical findings inaccurately'
        },
        {
          value: 47,
          label: 'Raised an incorrect red flag'
        },
        {
          value: 48,
          label: 'Not maintaining the professionalism'
        },
        {
          value: 49,
          label: 'Not joining mandatory webinars'
        },
        {
          value: 50,
          label: 'Not following the session flow'
        },
        {
          value: 51,
          label: 'Not following the leave procedure'
        },
        {
          value: 52,
          label: 'Marked S2S inaccurately'
        },
        {
          value: 53,
          label: 'Late launch'
        },
        {
          value: 54,
          label: 'Inquired student’s personal information'
        },
        {
          value: 55,
          label: 'Failure to pass an LMS course'
        },
        {
          value: 56,
          label: 'Failure to launch'
        },
        {
          value: 57,
          label: 'Failure to extend the session'
        },
        {
          value: 58,
          label: 'Failure to complete LMS courses on time'
        },
        {
          value: 59,
          label: 'Failed to troubleshoot effectively'
        },
        {
          value: 60,
          label: 'Failed to respond to the student'
        },
        {
          value: 61,
          label: 'Failed to respond to student’s safeguarding'
        },
        {
          value: 62,
          label: 'Failed to report student’s safeguarding'
        },
        {
          value: 63,
          label: 'Failed to report “NO LEARNING HAPPENED” sessions accurately'
        },
        {
          value: 64,
          label: 'Failed to report “ABSENT” sessions accurately'
        },
        {
          value: 65,
          label: 'Failed to record required details in the tutor’s comment'
        },
        {
          value: 66,
          label:
            'Failed to record required details in the red flag/ internal notes'
        },
        {
          value: 119,
          label: 'Failed to recognize student’s safeguarding'
        },
        {
          value: 120,
          label: 'Failed to raise a red flag'
        },
        {
          value: 121,
          label: 'Failed to manage background noise'
        },
        {
          value: 122,
          label: 'Failed to extend the session'
        },
        {
          value: 123,
          label:
            'Failed to delete the LOs which are untouched during that session'
        },
        {
          value: 124,
          label: 'Failed to complete LMS Courses - Session Critical'
        },
        {
          value: 125,
          label: 'Failed to complete LMS Courses - Regular'
        },
        {
          value: 126,
          label: 'Failed to adhere to the teacher’s request'
        },
        {
          value: 127,
          label: 'Failed to adhere to AC feedback/ reflection guidelines'
        },
        {
          value: 128,
          label: 'Ended the session late'
        },
        {
          value: 129,
          label: 'Ended the session early'
        },
        {
          value: 130,
          label: 'Distracted with other activities during session'
        },
        {
          value: 131,
          label: 'Didn’t conduct reflection'
        },
        {
          value: 132,
          label: 'Didn’t conduct mini plenary'
        },
        {
          value: 133,
          label: 'Conversations recorded prior to student joining time'
        },
        {
          value: 134,
          label: 'Background noise'
        },
        {
          value: 135,
          label: 'Attitude towards work'
        },
        {
          value: 136,
          label: 'Asked the student to do the follow-me part'
        },
        {
          value: 138,
          label: 'Marked Student Engagement Inaccurately'
        },
        {
          value: 139,
          label: 'Breach of Contract'
        }
      ],
      ACADEMIC_CYCLE: [
        {
          value: 67,
          label: 'T1 C1'
        },
        {
          value: 68,
          label: 'T1 C2'
        },
        {
          value: 69,
          label: 'T2 C3'
        },
        {
          value: 70,
          label: 'T2 C4'
        },
        {
          value: 71,
          label: 'T3 C5'
        },
        {
          value: 72,
          label: 'T3 C6'
        }
      ],
      IMPACT_LEVEL: [
        {
          value: 73,
          label: 'Insignificant incident'
        },
        {
          value: 74,
          label: 'Minor Incident'
        },
        {
          value: 75,
          label: 'Major Incident'
        },
        {
          value: 76,
          label: 'Critical Incident'
        }
      ]
    }
  })
  data: [];
}
