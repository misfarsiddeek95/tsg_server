const dt = new Date();
export const leavePoliciesData = [
  {
    id: 1,
    hr_policy_id: 1,
    policy_name: 'Annual Leave',
    days_per_year: 14,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'Annual'
  },
  {
    id: 2,
    hr_policy_id: 2,
    policy_name: 'Casual Leave',
    days_per_year: 7,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'Casual'
  },
  {
    id: 3,
    hr_policy_id: 3,
    policy_name: 'Medical Leave',
    days_per_year: 7,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'Medical'
  },
  {
    id: 4,
    hr_policy_id: 4,
    policy_name: 'Personal',
    days_per_year: 7,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'Personal'
  },
  {
    id: 5,
    hr_policy_id: 20,
    policy_name: 'ANP',
    days_per_year: 7,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'ANP'
  },
  {
    id: 6,
    hr_policy_id: 21,
    policy_name: 'Maternity Leave',
    days_per_year: 90,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'Maternity'
  },
  {
    id: 7,
    hr_policy_id: 22,
    policy_name: 'Paternity Leave',
    days_per_year: 3,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'Paternity'
  },
  {
    id: 8,
    hr_policy_id: 23,
    policy_name: 'Special Leave',
    days_per_year: 7,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'Special'
  },
  {
    id: 9,
    hr_policy_id: 24,
    policy_name: 'Lieu Leave',
    days_per_year: 7,
    status: 1,
    created_by: 1,
    created_at: dt,
    updated_by: 1,
    updated_at: dt,
    short_title: 'Lieu'
  }
];

export const leaveMetaData = [
  {
    id: 1,
    metaType: 'leave_duration',
    metaValue: 1,
    metaName: 'Full Day',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 2,
    metaType: 'leave_duration',
    metaValue: 2,
    metaName: 'First Half',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 3,
    metaType: 'leave_duration',
    metaValue: 3,
    metaName: 'Second Half',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 4,
    metaType: 'leave_reason',
    metaValue: 1,
    metaName: 'Personal',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 5,
    metaType: 'leave_reason',
    metaValue: 2,
    metaName: 'Medical',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 6,
    metaType: 'leave_reason',
    metaValue: 3,
    metaName: 'Study Leaves',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 7,
    metaType: 'leave_reason',
    metaValue: 4,
    metaName: 'Power Cuts',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 8,
    metaType: 'leave_reason',
    metaValue: 5,
    metaName: 'Religious',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 9,
    metaType: 'leave_reason',
    metaValue: 6,
    metaName: 'Other',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 11,
    metaType: 'cancel_reason',
    metaValue: 1,
    metaName: 'Change of dates',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 12,
    metaType: 'cancel_reason',
    metaValue: 2,
    metaName: 'Erroneous entry',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 13,
    metaType: 'cancel_reason',
    metaValue: 3,
    metaName: 'Business requirement',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 14,
    metaType: 'cancel_reason',
    metaValue: 4,
    metaName: 'Other',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 15,
    metaType: 'leave_shift',
    metaValue: 1,
    metaName: 'SL',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 16,
    metaType: 'leave_shift',
    metaValue: 2,
    metaName: 'UK',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 17,
    metaType: 'leave_shift',
    metaValue: 3,
    metaName: 'Flexi',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 18,
    metaType: 'year_start',
    metaValue: 1,
    metaName: '2023-08-01',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 19,
    metaType: 'year_end',
    metaValue: 1,
    metaName: '2024-07-31',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 20,
    metaType: 'leave_status',
    metaValue: 0,
    metaName: 'application-pending',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 21,
    metaType: 'leave_status',
    metaValue: 1,
    metaName: 'cancel-pending',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 22,
    metaType: 'leave_status',
    metaValue: 2,
    metaName: 'application-approved',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 23,
    metaType: 'leave_status',
    metaValue: 3,
    metaName: 'application-rejected',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 24,
    metaType: 'leave_status',
    metaValue: 4,
    metaName: 'cancel-approved',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  },
  {
    id: 25,
    metaType: 'leave_status',
    metaValue: 5,
    metaName: 'cancel-rejected',
    status: 1,
    createdBy: 1,
    createdAt: dt,
    updatedBy: 1,
    updatedAt: dt
  }
];

export const holidaysTypes = [
  {
    id: 1,
    holiday_type: 'Statutory Holiday',
    color_code: '#2779F5'
  },
  {
    id: 2,
    holiday_type: 'Office Closed',
    color_code: '#212121'
  },
  {
    id: 3,
    holiday_type: 'Term End',
    color_code: '#FF0C3E'
  },
  {
    id: 4,
    holiday_type: 'Term Start',
    color_code: '#00BC89'
  },
  {
    id: 5,
    holiday_type: 'Half Term',
    color_code: '#FF9800'
  },
  {
    id: 6,
    holiday_type: 'Few Sessions',
    color_code: '#F9DD4A'
  },
  {
    id: 7,
    holiday_type: 'No Tutor Week',
    color_code: '#CC6C3F'
  },
  {
    id: 8,
    holiday_type: 'No Sessions',
    color_code: '#9E9E9E'
  },
  {
    id: 9,
    holiday_type: 'HR Events',
    color_code: '#84CC16'
  },
  {
    id: 10,
    holiday_type: 'Academic Events',
    color_code: '#9670FF'
  },
  {
    id: 11,
    holiday_type: 'Operations Events',
    color_code: '#00B8D4'
  },
  {
    id: 12,
    holiday_type: 'Marketing Events',
    color_code: '#CC6C3F'
  }
];

export const calendar = [
  {
    id: 1,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2022-09-08 00:00:00',
    description: 'Onam or Thiru onam day'
  },
  {
    id: 2,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2022-10-02 00:00:00',
    description: 'Mahatma Gandhi Jayanti'
  },
  {
    id: 3,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2022-10-05 00:00:00',
    description: 'Dussehra'
  },
  {
    id: 4,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2022-10-09 00:00:00',
    description: 'Milad-un-Nabi or Id-e-Milad (Birthday of Prophet Mohammad)'
  },
  {
    id: 5,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2022-10-24 00:00:00',
    description: 'Diwali (Deepavali) (G) Naraka Chaturdasi (R)'
  },
  {
    id: 6,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2022-11-08 00:00:00',
    description: "Guru Nanak's Birthday"
  },
  {
    id: 7,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2022-12-25 00:00:00',
    description: 'Christmas Day'
  },
  {
    id: 8,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-01-26 00:00:00',
    description: 'Republic Day'
  },
  {
    id: 9,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-03-08 00:00:00',
    description: 'Holi'
  },
  {
    id: 10,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-03-30 00:00:00',
    description: 'Ram Navami'
  },
  {
    id: 11,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-04-04 00:00:00',
    description: 'Mahavir Jayanti'
  },
  {
    id: 12,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-04-07 00:00:00',
    description: 'Good Friday'
  },
  {
    id: 13,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-04-22 00:00:00',
    description: 'Eid-ul-Fitr'
  },
  {
    id: 14,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-05-05 00:00:00',
    description: 'Buddha Purnima'
  },
  {
    id: 15,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-06-29 00:00:00',
    description: 'Id-ul-Zuha (Bakrid)'
  },
  {
    id: 16,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-07-29 00:00:00',
    description: 'Muharram'
  },
  {
    id: 17,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-08-15 00:00:00',
    description: 'Independence Day'
  },
  {
    id: 18,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-09-07 00:00:00',
    description: 'Janmashtami (Vaishnava)'
  },
  {
    id: 19,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-09-28 00:00:00',
    description: 'Milad-un-Nabi or Id-e-Milad (Birthday of Prophet Muhammad)'
  },
  {
    id: 20,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-10-02 00:00:00',
    description: 'Mahatma Gandhi’s Birthday'
  },
  {
    id: 21,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-10-24 00:00:00',
    description: 'Dussehra'
  },
  {
    id: 22,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-11-12 00:00:00',
    description: 'Diwali (Deepavali)'
  },
  {
    id: 23,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-11-27 00:00:00',
    description: 'Guru Nanak’s Birthday'
  },
  {
    id: 24,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2023-12-25 00:00:00',
    description: 'Christmas Day'
  },
  {
    id: 25,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2022-10-08 00:00:00',
    description: "Prophet's Bday"
  },
  {
    id: 26,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2022-12-25 00:00:00',
    description: 'Christmas Day'
  },
  {
    id: 27,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-01-15 00:00:00',
    description: 'Tamil Thai Pongal Day'
  },
  {
    id: 28,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-02-04 00:00:00',
    description: 'Independance Day'
  },
  {
    id: 29,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-04-13 00:00:00',
    description: 'Day prior to Sinhala & Tamil New Year'
  },
  {
    id: 30,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-04-14 00:00:00',
    description: 'Sinhala & Tamil New Year'
  },
  {
    id: 31,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-05-01 00:00:00',
    description: 'May Day'
  },
  {
    id: 32,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-05-06 00:00:00',
    description: 'Day following Vesak Full Moon Poya Day'
  },
  {
    id: 33,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2022-08-11 00:00:00',
    description: 'Poya day'
  },
  {
    id: 34,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2022-09-10 00:00:00',
    description: 'Poya day'
  },
  {
    id: 35,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2022-10-09 00:00:00',
    description: 'Poya day'
  },
  {
    id: 36,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2022-11-07 00:00:00',
    description: 'Poya day'
  },
  {
    id: 37,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2022-12-07 00:00:00',
    description: 'Poya day'
  },
  {
    id: 38,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-01-06 00:00:00',
    description: 'Duruthu Full Moon Poya Day'
  },
  {
    id: 39,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-02-05 00:00:00',
    description: 'Navam Full Moon Poya Day'
  },
  {
    id: 40,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-03-06 00:00:00',
    description: 'Madin Full Moon Poya Day'
  },
  {
    id: 41,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-04-05 00:00:00',
    description: 'Bak Full Moon Poya Day'
  },
  {
    id: 42,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-05-05 00:00:00',
    description: 'Vesak Full Moon Poya Day'
  },
  {
    id: 43,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-06-03 00:00:00',
    description: 'Poson Full Moon Poya Day'
  },
  {
    id: 44,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-07-03 00:00:00',
    description: 'Adhi Esala Full Moon Poya Day'
  },
  {
    id: 45,
    holidays_type_id: 4,
    country: 'srilankan',
    effective_date: '2022-09-12 00:00:00',
    description: 'Term start'
  },
  {
    id: 46,
    holidays_type_id: 4,
    country: 'srilankan',
    effective_date: '2023-01-03 00:00:00',
    description: 'Term start'
  },
  {
    id: 47,
    holidays_type_id: 4,
    country: 'srilankan',
    effective_date: '2023-04-17 00:00:00',
    description: 'Term start'
  },
  {
    id: 48,
    holidays_type_id: 3,
    country: 'srilankan',
    effective_date: '2022-12-09 00:00:00',
    description: 'Term end'
  },
  {
    id: 49,
    holidays_type_id: 3,
    country: 'srilankan',
    effective_date: '2023-03-31 00:00:00',
    description: 'Term end'
  },
  {
    id: 50,
    holidays_type_id: 3,
    country: 'srilankan',
    effective_date: '2023-07-14 00:00:00',
    description: 'Term end'
  },
  {
    id: 51,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2022-12-26 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 52,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2022-12-27 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 53,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-01-02 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 54,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-04-07 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 55,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-04-10 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 56,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-05-01 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 57,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2022-08-11 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 58,
    holidays_type_id: 4,
    country: 'Indian',
    effective_date: '2022-09-12 00:00:00',
    description: 'Term start'
  },
  {
    id: 59,
    holidays_type_id: 4,
    country: 'Indian',
    effective_date: '2023-01-03 00:00:00',
    description: 'Term start'
  },
  {
    id: 60,
    holidays_type_id: 4,
    country: 'Indian',
    effective_date: '2023-04-17 00:00:00',
    description: 'Term start'
  },
  {
    id: 61,
    holidays_type_id: 3,
    country: 'Indian',
    effective_date: '2022-12-09 00:00:00',
    description: 'Term end'
  },
  {
    id: 62,
    holidays_type_id: 3,
    country: 'Indian',
    effective_date: '2023-03-31 00:00:00',
    description: 'Term end'
  },
  {
    id: 63,
    holidays_type_id: 3,
    country: 'Indian',
    effective_date: '2023-07-14 00:00:00',
    description: 'Term end'
  },
  {
    id: 64,
    holidays_type_id: 2,
    country: 'Indian',
    effective_date: '2022-12-26 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 65,
    holidays_type_id: 2,
    country: 'Indian',
    effective_date: '2022-12-27 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 66,
    holidays_type_id: 2,
    country: 'Indian',
    effective_date: '2023-01-02 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 67,
    holidays_type_id: 2,
    country: 'Indian',
    effective_date: '2023-04-07 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 68,
    holidays_type_id: 2,
    country: 'Indian',
    effective_date: '2023-04-10 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 69,
    holidays_type_id: 2,
    country: 'Indian',
    effective_date: '2023-05-01 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 70,
    holidays_type_id: 2,
    country: 'Indian',
    effective_date: '2022-08-11 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 71,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-17 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 72,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-18 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 73,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-19 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 74,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-20 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 75,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-21 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 76,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-24 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 77,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-25 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 78,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-26 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 79,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-27 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 80,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-28 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 81,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-07-31 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 82,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-01 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 83,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-02 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 84,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-03 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 85,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-04 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 86,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-07 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 87,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-08 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 88,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-09 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 89,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-10 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 90,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-11 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 91,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-14 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 92,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-15 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 93,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-16 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 94,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-17 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 95,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-18 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 96,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-21 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 97,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-22 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 98,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-23 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 99,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-24 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 100,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-25 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 101,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-28 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 102,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-29 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 103,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-30 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 104,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-08-31 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 105,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-09-01 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 106,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-09-04 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 107,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-09-05 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 108,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-09-06 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 109,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-09-07 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 110,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-09-08 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 111,
    holidays_type_id: 4,
    country: 'srilankan',
    effective_date: '2023-09-11 00:00:00',
    description: 'Term Start'
  },
  {
    id: 112,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-10-23 00:00:00',
    description: 'Half Term'
  },
  {
    id: 113,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-10-24 00:00:00',
    description: 'Half Term'
  },
  {
    id: 114,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-10-25 00:00:00',
    description: 'Half Term'
  },
  {
    id: 115,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-10-26 00:00:00',
    description: 'Half Term'
  },
  {
    id: 116,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-10-27 00:00:00',
    description: 'Half Term'
  },
  {
    id: 117,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-10-30 00:00:00',
    description: 'Half Term'
  },
  {
    id: 118,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-10-31 00:00:00',
    description: 'Half Term'
  },
  {
    id: 119,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-11-01 00:00:00',
    description: 'Half Term'
  },
  {
    id: 120,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-11-02 00:00:00',
    description: 'Half Term'
  },
  {
    id: 121,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2023-11-03 00:00:00',
    description: 'Half Term'
  },
  {
    id: 122,
    holidays_type_id: 3,
    country: 'srilankan',
    effective_date: '2023-12-15 00:00:00',
    description: 'Term End'
  },
  {
    id: 123,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-18 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 124,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-19 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 125,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-20 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 126,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-21 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 127,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-22 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 128,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-25 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 129,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-26 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 130,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-27 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 131,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-28 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 132,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2023-12-29 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 133,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-01-01 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 134,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-01-02 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 135,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-01-03 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 136,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-01-04 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 137,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-01-05 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 138,
    holidays_type_id: 4,
    country: 'srilankan',
    effective_date: '2024-01-08 00:00:00',
    description: 'Term Start'
  },
  {
    id: 139,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-12 00:00:00',
    description: 'Half Term '
  },
  {
    id: 140,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-13 00:00:00',
    description: 'Half Term'
  },
  {
    id: 141,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-14 00:00:00',
    description: 'Half Term'
  },
  {
    id: 142,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-15 00:00:00',
    description: 'Half Term'
  },
  {
    id: 143,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-16 00:00:00',
    description: 'Half Term'
  },
  {
    id: 144,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-19 00:00:00',
    description: 'Half Term'
  },
  {
    id: 145,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-20 00:00:00',
    description: 'Half Term'
  },
  {
    id: 146,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-21 00:00:00',
    description: 'Half Term'
  },
  {
    id: 147,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-22 00:00:00',
    description: 'Half Term'
  },
  {
    id: 148,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-02-23 00:00:00',
    description: 'Half Term'
  },
  {
    id: 149,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-03-25 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 150,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-03-26 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 151,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-03-27 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 152,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-03-28 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 153,
    holidays_type_id: 3,
    country: 'srilankan',
    effective_date: '2024-03-28 00:00:00',
    description: 'Term End'
  },
  {
    id: 154,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-03-29 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 156,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-04-01 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 157,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-04-02 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 158,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-04-03 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 159,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-04-04 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 160,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-04-05 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 161,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-05-06 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 162,
    holidays_type_id: 4,
    country: 'srilankan',
    effective_date: '2024-04-08 00:00:00',
    description: 'Term Start'
  },
  {
    id: 163,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-04-08 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 164,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-04-09 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 165,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-04-10 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 166,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-04-11 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 167,
    holidays_type_id: 5,
    country: 'srilankan',
    effective_date: '2024-04-12 00:00:00',
    description: 'Easter Break'
  },
  {
    id: 168,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-05-27 00:00:00',
    description: 'Half Term'
  },
  {
    id: 169,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-05-28 00:00:00',
    description: 'Half Term'
  },
  {
    id: 170,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-05-29 00:00:00',
    description: 'Half Term'
  },
  {
    id: 171,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-05-30 00:00:00',
    description: 'Half Term'
  },
  {
    id: 172,
    holidays_type_id: 8,
    country: 'srilankan',
    effective_date: '2024-05-31 00:00:00',
    description: 'Half Term'
  },
  {
    id: 173,
    holidays_type_id: 3,
    country: 'srilankan',
    effective_date: '2024-07-19 00:00:00',
    description: 'Term End'
  },
  {
    id: 174,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-10-23 00:00:00',
    description: 'Half Term'
  },
  {
    id: 175,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-10-24 00:00:00',
    description: 'Half Term'
  },
  {
    id: 176,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-10-25 00:00:00',
    description: 'Half Term'
  },
  {
    id: 177,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-10-26 00:00:00',
    description: 'Half Term'
  },
  {
    id: 178,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-10-27 00:00:00',
    description: 'Half Term'
  },
  {
    id: 179,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-10-30 00:00:00',
    description: 'Half Term'
  },
  {
    id: 180,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-10-31 00:00:00',
    description: 'Half Term'
  },
  {
    id: 181,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-11-01 00:00:00',
    description: 'Half Term'
  },
  {
    id: 182,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-11-02 00:00:00',
    description: 'Half Term'
  },
  {
    id: 183,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2023-11-03 00:00:00',
    description: 'Half Term'
  },
  {
    id: 184,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-12 00:00:00',
    description: 'Half Term'
  },
  {
    id: 185,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-13 00:00:00',
    description: 'Half Term'
  },
  {
    id: 186,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-14 00:00:00',
    description: 'Half Term'
  },
  {
    id: 187,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-15 00:00:00',
    description: 'Half Term'
  },
  {
    id: 188,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-16 00:00:00',
    description: 'Half Term'
  },
  {
    id: 189,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-19 00:00:00',
    description: 'Half Term'
  },
  {
    id: 190,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-20 00:00:00',
    description: 'Half Term'
  },
  {
    id: 191,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-21 00:00:00',
    description: 'Half Term'
  },
  {
    id: 192,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-22 00:00:00',
    description: 'Half Term'
  },
  {
    id: 193,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-02-23 00:00:00',
    description: 'Half Term'
  },
  {
    id: 194,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-03-25 00:00:00',
    description: 'Half Term'
  },
  {
    id: 195,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-03-26 00:00:00',
    description: 'Half Term'
  },
  {
    id: 196,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-03-27 00:00:00',
    description: 'Half Term'
  },
  {
    id: 197,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-03-28 00:00:00',
    description: 'Half Term'
  },
  {
    id: 198,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-04-08 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 199,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-04-09 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 200,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-04-10 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 201,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-04-11 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 202,
    holidays_type_id: 6,
    country: 'srilankan',
    effective_date: '2024-04-12 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 203,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-10-23 00:00:00',
    description: 'Half Term'
  },
  {
    id: 204,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-10-24 00:00:00',
    description: 'Half Term'
  },
  {
    id: 205,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-10-25 00:00:00',
    description: 'Half Term'
  },
  {
    id: 206,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-10-26 00:00:00',
    description: 'Half Term'
  },
  {
    id: 207,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-10-27 00:00:00',
    description: 'Half Term'
  },
  {
    id: 208,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-10-30 00:00:00',
    description: 'Half Term'
  },
  {
    id: 209,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-10-31 00:00:00',
    description: 'Half Term'
  },
  {
    id: 210,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-11-01 00:00:00',
    description: 'Half Term'
  },
  {
    id: 211,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-11-02 00:00:00',
    description: 'Half Term'
  },
  {
    id: 212,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2023-11-03 00:00:00',
    description: 'Half Term'
  },
  {
    id: 213,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-12 00:00:00',
    description: 'Half Term'
  },
  {
    id: 214,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-13 00:00:00',
    description: 'Half Term'
  },
  {
    id: 215,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-14 00:00:00',
    description: 'Half Term'
  },
  {
    id: 216,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-15 00:00:00',
    description: 'Half Term'
  },
  {
    id: 217,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-16 00:00:00',
    description: 'Half Term'
  },
  {
    id: 218,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-19 00:00:00',
    description: 'Half Term'
  },
  {
    id: 219,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-20 00:00:00',
    description: 'Half Term'
  },
  {
    id: 220,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-21 00:00:00',
    description: 'Half Term'
  },
  {
    id: 221,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-22 00:00:00',
    description: 'Half Term'
  },
  {
    id: 222,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-02-23 00:00:00',
    description: 'Half Term'
  },
  {
    id: 223,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-03-25 00:00:00',
    description: 'Half Term'
  },
  {
    id: 224,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-03-26 00:00:00',
    description: 'Half Term'
  },
  {
    id: 225,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-03-27 00:00:00',
    description: 'Half Term'
  },
  {
    id: 226,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-03-28 00:00:00',
    description: 'Half Term'
  },
  {
    id: 227,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-04-08 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 228,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-04-09 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 229,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-04-10 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 230,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-04-11 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 231,
    holidays_type_id: 6,
    country: 'indian',
    effective_date: '2024-04-12 00:00:00',
    description: '22% of Schools'
  },
  {
    id: 232,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-07-31 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 233,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-08-01 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 234,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-12-28 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 235,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-12-26 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 236,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2024-01-01 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 237,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2024-05-28 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 238,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-12-27 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 239,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-12-25 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 240,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2023-12-29 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 241,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2024-03-29 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 242,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2024-05-06 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 243,
    holidays_type_id: 2,
    country: 'srilankan',
    effective_date: '2024-05-27 00:00:00',
    description: 'Office Closed Day'
  },
  {
    id: 244,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-08-01 00:00:00',
    description: 'Esala Poya Day'
  },
  {
    id: 245,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-08-30 00:00:00',
    description: 'Nikini Poya Day'
  },
  {
    id: 246,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-09-29 00:00:00',
    description: 'Binara Poya Day'
  },
  {
    id: 247,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-10-28 00:00:00',
    description: 'Vap Poya Day'
  },
  {
    id: 248,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-11-26 00:00:00',
    description: 'Ill Poya Day'
  },
  {
    id: 249,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-12-26 00:00:00',
    description: 'Uduvap Poya Day'
  },
  {
    id: 250,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-01-25 00:00:00',
    description: 'Duruthu Poya Day'
  },
  {
    id: 251,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-02-24 00:00:00',
    description: 'Navam Poya Day'
  },
  {
    id: 252,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-03-25 00:00:00',
    description: 'Madin Poya Day'
  },
  {
    id: 253,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-04-23 00:00:00',
    description: 'Bak Poya Day'
  },
  {
    id: 254,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-05-23 00:00:00',
    description: 'Vesak Poya Day'
  },
  {
    id: 255,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-06-22 00:00:00',
    description: 'Poson Poya Day'
  },
  {
    id: 256,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-07-21 00:00:00',
    description: 'Esala Poya Day'
  },
  {
    id: 257,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-01-01 00:00:00',
    description: "New Year's Day"
  },
  {
    id: 258,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-03-29 00:00:00',
    description: 'Good Friday'
  },
  {
    id: 259,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-05-06 00:00:00',
    description: 'May Bank Holiday'
  },
  {
    id: 260,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-05-27 00:00:00',
    description: 'Spring Bank Holiday'
  },
  {
    id: 261,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-12-25 00:00:00',
    description: 'Christmas Day'
  },
  {
    id: 262,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-12-26 00:00:00',
    description: 'Boxing Day'
  },
  {
    id: 263,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-02-04 00:00:00',
    description: 'Independence day'
  },
  {
    id: 264,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-05-06 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 265,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-04-12 00:00:00',
    description: 'Sinhala & Tamil New Year (Day prior)'
  },
  {
    id: 266,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-05-01 00:00:00',
    description: 'May Day'
  },
  {
    id: 267,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-04-13 00:00:00',
    description: 'Sinhala & Tamil New Year '
  },
  {
    id: 268,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-01-15 00:00:00',
    description: 'Thai Pongal day'
  },
  {
    id: 269,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2023-09-28 00:00:00',
    description: "Prophet's Bday"
  },
  {
    id: 270,
    holidays_type_id: 1,
    country: 'srilankan',
    effective_date: '2024-05-24 00:00:00',
    description: 'Day Following Vesak'
  },
  {
    id: 271,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-17 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 272,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-18 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 273,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-19 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 274,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-20 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 275,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-21 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 276,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-24 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 277,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-25 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 278,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-26 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 279,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-27 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 280,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-28 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 281,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-07-31 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 282,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-01 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 283,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-02 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 284,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-03 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 285,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-04 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 286,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-07 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 287,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-08 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 288,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-09 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 289,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-10 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 290,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-11 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 291,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-14 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 292,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-15 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 293,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-16 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 294,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-17 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 295,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-18 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 296,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-21 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 297,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-22 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 298,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-23 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 299,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-24 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 300,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-25 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 301,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-28 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 302,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-29 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 303,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-30 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 304,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-08-31 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 305,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-09-01 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 306,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-09-04 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 307,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-09-05 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 308,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-09-06 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 309,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-09-07 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 310,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-09-08 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 311,
    holidays_type_id: 4,
    country: 'indian',
    effective_date: '2023-09-11 00:00:00',
    description: 'Term Start'
  },
  {
    id: 312,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-10-23 00:00:00',
    description: 'Half Term'
  },
  {
    id: 313,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-10-24 00:00:00',
    description: 'Half Term'
  },
  {
    id: 314,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-10-25 00:00:00',
    description: 'Half Term'
  },
  {
    id: 315,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-10-26 00:00:00',
    description: 'Half Term'
  },
  {
    id: 316,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-10-27 00:00:00',
    description: 'Half Term'
  },
  {
    id: 317,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-10-30 00:00:00',
    description: 'Half Term'
  },
  {
    id: 318,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-10-31 00:00:00',
    description: 'Half Term'
  },
  {
    id: 319,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-11-01 00:00:00',
    description: 'Half Term'
  },
  {
    id: 320,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-11-02 00:00:00',
    description: 'Half Term'
  },
  {
    id: 321,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2023-11-03 00:00:00',
    description: 'Half Term'
  },
  {
    id: 322,
    holidays_type_id: 3,
    country: 'indian',
    effective_date: '2023-12-15 00:00:00',
    description: 'Term End'
  },
  {
    id: 323,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-18 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 324,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-19 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 325,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-20 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 326,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-21 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 327,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-22 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 328,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-25 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 329,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-26 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 330,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-27 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 331,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-28 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 332,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2023-12-29 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 333,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-01-01 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 334,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-01-02 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 335,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-01-03 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 336,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-01-04 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 337,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-01-05 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 338,
    holidays_type_id: 4,
    country: 'indian',
    effective_date: '2024-01-08 00:00:00',
    description: 'Term Start'
  },
  {
    id: 339,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-12 00:00:00',
    description: 'Half Term '
  },
  {
    id: 340,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-13 00:00:00',
    description: 'Half Term '
  },
  {
    id: 341,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-14 00:00:00',
    description: 'Half Term '
  },
  {
    id: 342,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-15 00:00:00',
    description: 'Half Term '
  },
  {
    id: 343,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-16 00:00:00',
    description: 'Half Term '
  },
  {
    id: 344,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-19 00:00:00',
    description: 'Half Term '
  },
  {
    id: 345,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-20 00:00:00',
    description: 'Half Term '
  },
  {
    id: 346,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-21 00:00:00',
    description: 'Half Term '
  },
  {
    id: 347,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-22 00:00:00',
    description: 'Half Term '
  },
  {
    id: 348,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-02-23 00:00:00',
    description: 'Half Term '
  },
  {
    id: 349,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-03-25 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 350,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-03-26 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 351,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-03-27 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 352,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-03-28 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 353,
    holidays_type_id: 3,
    country: 'indian',
    effective_date: '2024-03-28 00:00:00',
    description: 'Term End'
  },
  {
    id: 354,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-03-29 00:00:00',
    description: 'No Sessions'
  },
  {
    id: 355,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-04-01 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 356,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-04-02 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 357,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-04-03 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 358,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-04-04 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 359,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-04-05 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 360,
    holidays_type_id: 4,
    country: 'indian',
    effective_date: '2024-04-08 00:00:00',
    description: 'Term Start'
  },
  {
    id: 361,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-04-08 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 362,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-04-09 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 363,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-04-10 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 364,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-04-11 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 365,
    holidays_type_id: 5,
    country: 'indian',
    effective_date: '2024-04-12 00:00:00',
    description: 'Easter Break '
  },
  {
    id: 366,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-05-27 00:00:00',
    description: 'Half Term'
  },
  {
    id: 367,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-05-28 00:00:00',
    description: 'Half Term'
  },
  {
    id: 368,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-05-29 00:00:00',
    description: 'Half Term'
  },
  {
    id: 369,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-05-30 00:00:00',
    description: 'Half Term'
  },
  {
    id: 370,
    holidays_type_id: 8,
    country: 'indian',
    effective_date: '2024-05-31 00:00:00',
    description: 'Half Term'
  },
  {
    id: 371,
    holidays_type_id: 3,
    country: 'indian',
    effective_date: '2024-07-19 00:00:00',
    description: 'Term End'
  },
  {
    id: 372,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2023-07-31 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 373,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2023-08-01 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 374,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2023-12-28 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 375,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2023-12-26 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 376,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2024-01-01 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 377,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2024-05-28 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 378,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2023-12-27 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 379,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2023-12-25 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 380,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2023-12-29 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 381,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2024-03-29 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 382,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2024-05-06 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 383,
    holidays_type_id: 2,
    country: 'indian',
    effective_date: '2024-05-27 00:00:00',
    description: 'Office closed Days'
  },
  {
    id: 384,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-01-15 00:00:00',
    description: 'Makara Sankranti/ Pongal'
  },
  {
    id: 385,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-01-26 00:00:00',
    description: 'Republic Day'
  },
  {
    id: 386,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-03-08 00:00:00',
    description: 'Maha Shivaratri'
  },
  {
    id: 387,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-03-25 00:00:00',
    description: 'Holi'
  },
  {
    id: 388,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-03-29 00:00:00',
    description: 'Good Friday'
  },
  {
    id: 389,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-04-09 00:00:00',
    description: 'Ugadi'
  },
  {
    id: 390,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-04-10 00:00:00',
    description: "Idu'l Fitr"
  },
  {
    id: 391,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-04-17 00:00:00',
    description: 'Ram Navami'
  },
  {
    id: 392,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-04-21 00:00:00',
    description: 'Mahavir Jayanti'
  },
  {
    id: 393,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-05-23 00:00:00',
    description: 'Buddha Purnima'
  },
  {
    id: 394,
    holidays_type_id: 1,
    country: 'indian',
    effective_date: '2024-06-17 00:00:00',
    description: 'Id-ul-Zuha(Bakrid)'
  }
];

export const nonTutors = [
  {
    hr_tsp_id: 24,
    nic: '123',
    epf: '321',
    full_name: null,
    name_with_initias: null,
    short_name: null,
    preferred_name: null,
    status: null,
    status_reason: null,
    contract_type: null,
    job_title: null,
    management_level: null,
    supervisor: null,
    supervisor_id: 1,
    division: null,
    division_head: null,
    department: null,
    joining_date_or_contract_start_date: null,
    contract_end_date: null,
    contract_number: null,
    gender: null,
    dob: null,
    religion: null,
    marital_status: null,
    current_address: null,
    current_address_city: null,
    permanat_address: null,
    permanat_address_district: null,
    permanent_address_province: null,
    contact_no: null,
    emergency_contact_person: null,
    relationship_to_emergency_contact_person: null,
    emergency_contact_number: null,
    tsg_email: null,
    personal_email_address: null,
    bank: null,
    bank_branch: null,
    branch_code: null,
    name_as_per_bank: null,
    bank_account_no: null,
    b_card: null,
    resignation_given_date: null,
    lwd: null,
    resignation_withdrawal_date: null,
    pcc_status: null,
    pcc_submitted_date: null,
    pcc_issued_date: null,
    pcc_reference_no: null,
    work_email: null,
    tutor_id: null,
    primary: null,
    secondary: null,
    exp_code_or_pay_grade: null,
    shift: null,
    batch: null,
    sub_department: null,
    absorbed_from_omt_ftc_internship_to_non_tutor_role: null,
    absorbed_from_omt_ftc_to_non_tutor_role_date: null,
    contract_start_date: null,
    probation_start_date: null,
    probation_end_date: null,
    employment_type: null,
    entity: null,
    location: null,
    residence_country: null,
    bank_swift_code: null,
    pcc_required: null,
    time_stamp: null,
    with_effective: null,
    movement_updated_in_hris__tutor: null,
    final_approval: null,
    id: null,
    hr_entry_state: null,
    approval_status: null,
    updated_by: null,
    reason: null,
    update_at: null,
    entity_76: null
  },
  {
    hr_tsp_id: 25,
    nic: '123',
    epf: '321',
    full_name: null,
    name_with_initias: null,
    short_name: null,
    preferred_name: null,
    status: null,
    status_reason: null,
    contract_type: null,
    job_title: null,
    management_level: null,
    supervisor: null,
    supervisor_id: 25,
    division: null,
    division_head: null,
    department: null,
    joining_date_or_contract_start_date: null,
    contract_end_date: null,
    contract_number: null,
    gender: null,
    dob: null,
    religion: null,
    marital_status: null,
    current_address: null,
    current_address_city: null,
    permanat_address: null,
    permanat_address_district: null,
    permanent_address_province: null,
    contact_no: null,
    emergency_contact_person: null,
    relationship_to_emergency_contact_person: null,
    emergency_contact_number: null,
    tsg_email: null,
    personal_email_address: null,
    bank: null,
    bank_branch: null,
    branch_code: null,
    name_as_per_bank: null,
    bank_account_no: null,
    b_card: null,
    resignation_given_date: null,
    lwd: null,
    resignation_withdrawal_date: null,
    pcc_status: null,
    pcc_submitted_date: null,
    pcc_issued_date: null,
    pcc_reference_no: null,
    work_email: null,
    tutor_id: null,
    primary: null,
    secondary: null,
    exp_code_or_pay_grade: null,
    shift: null,
    batch: null,
    sub_department: null,
    absorbed_from_omt_ftc_internship_to_non_tutor_role: null,
    absorbed_from_omt_ftc_to_non_tutor_role_date: null,
    contract_start_date: null,
    probation_start_date: null,
    probation_end_date: null,
    employment_type: null,
    entity: null,
    location: null,
    residence_country: null,
    bank_swift_code: null,
    pcc_required: null,
    time_stamp: null,
    with_effective: null,
    movement_updated_in_hris__tutor: null,
    final_approval: null,
    id: null,
    hr_entry_state: null,
    approval_status: null,
    updated_by: null,
    reason: null,
    update_at: null,
    entity_76: null
  },
  {
    hr_tsp_id: 26,
    nic: '123',
    epf: '321',
    full_name: null,
    name_with_initias: null,
    short_name: null,
    preferred_name: null,
    status: null,
    status_reason: null,
    contract_type: null,
    job_title: null,
    management_level: null,
    supervisor: null,
    supervisor_id: 1,
    division: null,
    division_head: null,
    department: null,
    joining_date_or_contract_start_date: null,
    contract_end_date: null,
    contract_number: null,
    gender: null,
    dob: null,
    religion: null,
    marital_status: null,
    current_address: null,
    current_address_city: null,
    permanat_address: null,
    permanat_address_district: null,
    permanent_address_province: null,
    contact_no: null,
    emergency_contact_person: null,
    relationship_to_emergency_contact_person: null,
    emergency_contact_number: null,
    tsg_email: null,
    personal_email_address: null,
    bank: null,
    bank_branch: null,
    branch_code: null,
    name_as_per_bank: null,
    bank_account_no: null,
    b_card: null,
    resignation_given_date: null,
    lwd: null,
    resignation_withdrawal_date: null,
    pcc_status: null,
    pcc_submitted_date: null,
    pcc_issued_date: null,
    pcc_reference_no: null,
    work_email: null,
    tutor_id: null,
    primary: null,
    secondary: null,
    exp_code_or_pay_grade: null,
    shift: null,
    batch: null,
    sub_department: null,
    absorbed_from_omt_ftc_internship_to_non_tutor_role: null,
    absorbed_from_omt_ftc_to_non_tutor_role_date: null,
    contract_start_date: null,
    probation_start_date: null,
    probation_end_date: null,
    employment_type: null,
    entity: null,
    location: null,
    residence_country: null,
    bank_swift_code: null,
    pcc_required: null,
    time_stamp: null,
    with_effective: null,
    movement_updated_in_hris__tutor: null,
    final_approval: null,
    id: null,
    hr_entry_state: null,
    approval_status: null,
    updated_by: null,
    reason: null,
    update_at: null,
    entity_76: null
  },
  {
    hr_tsp_id: 27,
    nic: '123',
    epf: '321',
    full_name: null,
    name_with_initias: null,
    short_name: null,
    preferred_name: null,
    status: null,
    status_reason: null,
    contract_type: null,
    job_title: null,
    management_level: null,
    supervisor: null,
    supervisor_id: 26,
    division: null,
    division_head: null,
    department: null,
    joining_date_or_contract_start_date: null,
    contract_end_date: null,
    contract_number: null,
    gender: null,
    dob: null,
    religion: null,
    marital_status: null,
    current_address: null,
    current_address_city: null,
    permanat_address: null,
    permanat_address_district: null,
    permanent_address_province: null,
    contact_no: null,
    emergency_contact_person: null,
    relationship_to_emergency_contact_person: null,
    emergency_contact_number: null,
    tsg_email: null,
    personal_email_address: null,
    bank: null,
    bank_branch: null,
    branch_code: null,
    name_as_per_bank: null,
    bank_account_no: null,
    b_card: null,
    resignation_given_date: null,
    lwd: null,
    resignation_withdrawal_date: null,
    pcc_status: null,
    pcc_submitted_date: null,
    pcc_issued_date: null,
    pcc_reference_no: null,
    work_email: null,
    tutor_id: null,
    primary: null,
    secondary: null,
    exp_code_or_pay_grade: null,
    shift: null,
    batch: null,
    sub_department: null,
    absorbed_from_omt_ftc_internship_to_non_tutor_role: null,
    absorbed_from_omt_ftc_to_non_tutor_role_date: null,
    contract_start_date: null,
    probation_start_date: null,
    probation_end_date: null,
    employment_type: null,
    entity: null,
    location: null,
    residence_country: null,
    bank_swift_code: null,
    pcc_required: null,
    time_stamp: null,
    with_effective: null,
    movement_updated_in_hris__tutor: null,
    final_approval: null,
    id: null,
    hr_entry_state: null,
    approval_status: null,
    updated_by: null,
    reason: null,
    update_at: null,
    entity_76: null
  },
  {
    hr_tsp_id: 28,
    nic: '123',
    epf: '321',
    full_name: null,
    name_with_initias: null,
    short_name: null,
    preferred_name: null,
    status: null,
    status_reason: null,
    contract_type: null,
    job_title: null,
    management_level: null,
    supervisor: null,
    supervisor_id: 26,
    division: null,
    division_head: null,
    department: null,
    joining_date_or_contract_start_date: null,
    contract_end_date: null,
    contract_number: null,
    gender: null,
    dob: null,
    religion: null,
    marital_status: null,
    current_address: null,
    current_address_city: null,
    permanat_address: null,
    permanat_address_district: null,
    permanent_address_province: null,
    contact_no: null,
    emergency_contact_person: null,
    relationship_to_emergency_contact_person: null,
    emergency_contact_number: null,
    tsg_email: null,
    personal_email_address: null,
    bank: null,
    bank_branch: null,
    branch_code: null,
    name_as_per_bank: null,
    bank_account_no: null,
    b_card: null,
    resignation_given_date: null,
    lwd: null,
    resignation_withdrawal_date: null,
    pcc_status: null,
    pcc_submitted_date: null,
    pcc_issued_date: null,
    pcc_reference_no: null,
    work_email: null,
    tutor_id: null,
    primary: null,
    secondary: null,
    exp_code_or_pay_grade: null,
    shift: null,
    batch: null,
    sub_department: null,
    absorbed_from_omt_ftc_internship_to_non_tutor_role: null,
    absorbed_from_omt_ftc_to_non_tutor_role_date: null,
    contract_start_date: null,
    probation_start_date: null,
    probation_end_date: null,
    employment_type: null,
    entity: null,
    location: null,
    residence_country: null,
    bank_swift_code: null,
    pcc_required: null,
    time_stamp: null,
    with_effective: null,
    movement_updated_in_hris__tutor: null,
    final_approval: null,
    id: null,
    hr_entry_state: null,
    approval_status: null,
    updated_by: null,
    reason: null,
    update_at: null,
    entity_76: null
  }
];
