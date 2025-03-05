import { Prisma } from '@prisma/client';

export const tutorPaymentRates: Prisma.GOATutorPaymentRatesCreateManyInput[] = [
  {
    id: 1,
    rate_code: 'AVL',
    tier_id: 1,
    description: 'Availability',
    country: 'SL',
    amount: 200,
    deduction: false,
    effective_date: '2023-01-15T00:00:00.000Z',
    updated_by: 0,
    created_at: '2023-01-15T00:00:00.000Z',
    tutoring_country: 'UK'
  },
  {
    id: 2,
    rate_code: 'SES_DE',
    tier_id: 1,
    description: 'Session Delivery\n',
    country: 'SL',
    amount: 550,
    deduction: false,
    effective_date: '2023-01-15T00:00:00.000Z',
    updated_by: 0,
    created_at: '2023-01-15T00:00:00.000Z',
    tutoring_country: 'UK'
  },
  {
    id: 3,
    rate_code: 'SES_AD_SEC',
    tier_id: 1,
    description: 'Additional Top Up (secondary)',
    country: 'SL',
    amount: 350,
    deduction: false,
    effective_date: '2023-01-15T00:00:00.000Z',
    updated_by: 0,
    created_at: '2023-01-15T00:00:00.000Z',
    tutoring_country: 'UK'
  },
  {
    id: 4,
    rate_code: 'STAT_ALW',
    tier_id: 1,
    description: 'Statutory allowance',
    country: 'SL',
    amount: 350,
    deduction: false,
    effective_date: '2023-01-15T00:00:00.000Z',
    updated_by: 0,
    created_at: '2023-01-15T00:00:00.000Z',
    tutoring_country: 'UK'
  }
];

export const holidayTypes: Prisma.HolidaysTypeCreateManyInput[] = [
  {
    id: 1,
    holiday_type: 'Statutory Holiday'
  },
  {
    id: 2,
    holiday_type: 'Office Closed'
  },
  {
    id: 3,
    holiday_type: 'Term End'
  },
  {
    id: 4,
    holiday_type: 'Term 2 Start'
  }
];

export const goaSlotStatus: Prisma.GOASlotStatusCreateManyInput[] = [
  {
    id: 1,
    code: 'P',
    description: 'Primary'
  },
  {
    id: 2,
    code: 'S',
    description: 'Secondary'
  },
  {
    id: 3,
    code: 'PC',
    description: 'Primary Cover'
  },
  {
    id: 4,
    code: 'SC',
    description: 'Secondary Cover'
  },
  {
    id: 5,
    code: 'N',
    description: 'No / Reject'
  },
  {
    id: 6,
    code: 'Y',
    description: 'Yes (Availability given by Candidate)'
  },
  {
    id: 7,
    code: 'TO',
    description: 'Time Off'
  },
  {
    id: 8,
    code: 'H',
    description: 'On Hold'
  }
];

export const goaTimeRanges: Prisma.GOATimeRangeCreateManyInput[] = [
  {
    hh_time: '13:30',
    oh_time: '14:00'
  },
  {
    hh_time: '14:30',
    oh_time: '15:00'
  },
  {
    hh_time: '15:30',
    oh_time: '16:00'
  },
  {
    hh_time: '16:30',
    oh_time: '17:00'
  },
  {
    hh_time: '18:30',
    oh_time: '19:00'
  },
  {
    hh_time: '19:30',
    oh_time: '20:00'
  },
  {
    hh_time: '20:30',
    oh_time: '21:00'
  }
];

export const daylightSaving: Prisma.DaylightSavingCreateManyInput[] = [
  {
    start_Date: new Date('02/03/2023').toISOString(),
    end_Date: new Date('02/07/2023').toISOString(),
    effective_hours: -1.0
  }
];

export const goaDayofWeek: Prisma.GOADaysOFWeekCreateManyInput[] = [
  { id: 1, date: 'Monday' },
  { id: 2, date: 'Tuesday' },
  { id: 3, date: 'Wednesday' },
  { id: 4, date: 'Thursday' },
  { id: 5, date: 'Friday' }
];

export const goaSlot: Prisma.GOASlotCreateManyInput[] = [
  {
    id: 1,
    status: 'active',
    date_id: 1,
    time_range_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    status: 'active',
    date_id: 1,
    time_range_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    status: 'active',
    date_id: 1,
    time_range_id: 3,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    status: 'active',
    date_id: 1,
    time_range_id: 4,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 5,
    status: 'active',
    date_id: 1,
    time_range_id: 5,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 6,
    status: 'active',
    date_id: 1,
    time_range_id: 6,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 7,
    status: 'active',
    date_id: 1,
    time_range_id: 7,
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 8,
    status: 'active',
    date_id: 2,
    time_range_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 9,
    status: 'active',
    date_id: 2,
    time_range_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 10,
    status: 'active',
    date_id: 2,
    time_range_id: 3,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 11,
    status: 'active',
    date_id: 2,
    time_range_id: 4,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 12,
    status: 'active',
    date_id: 2,
    time_range_id: 5,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 13,
    status: 'active',
    date_id: 2,
    time_range_id: 6,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 14,
    status: 'active',
    date_id: 2,
    time_range_id: 7,
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 15,
    status: 'active',
    date_id: 3,
    time_range_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 16,
    status: 'active',
    date_id: 3,
    time_range_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 17,
    status: 'active',
    date_id: 3,
    time_range_id: 3,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 18,
    status: 'active',
    date_id: 3,
    time_range_id: 4,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 19,
    status: 'active',
    date_id: 3,
    time_range_id: 5,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 20,
    status: 'active',
    date_id: 3,
    time_range_id: 6,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 21,
    status: 'active',
    date_id: 3,
    time_range_id: 7,
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 22,
    status: 'active',
    date_id: 4,
    time_range_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 23,
    status: 'active',
    date_id: 4,
    time_range_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 24,
    status: 'active',
    date_id: 4,
    time_range_id: 3,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 25,
    status: 'active',
    date_id: 4,
    time_range_id: 4,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 26,
    status: 'active',
    date_id: 4,
    time_range_id: 5,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 27,
    status: 'active',
    date_id: 4,
    time_range_id: 6,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 28,
    status: 'active',
    date_id: 4,
    time_range_id: 7,
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 29,
    status: 'active',
    date_id: 5,
    time_range_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 30,
    status: 'active',
    date_id: 5,
    time_range_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 31,
    status: 'active',
    date_id: 5,
    time_range_id: 3,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 32,
    status: 'active',
    date_id: 5,
    time_range_id: 4,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 33,
    status: 'active',
    date_id: 5,
    time_range_id: 5,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 34,
    status: 'active',
    date_id: 5,
    time_range_id: 6,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 35,
    status: 'active',
    date_id: 5,
    time_range_id: 7,
    created_at: new Date(),
    updated_at: new Date()
  }
];
