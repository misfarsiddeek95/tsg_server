import { Prisma } from '@prisma/client';

//for: bs_appintment_type_ref
export const appointmentTypeRefData: Prisma.AppointmentTypeRefCreateInput[] = [
  {
    id: 1,
    type: 'PI',
    event_title: 'Phone Interview',
    event_duration: 15,
    candi_reschedule_limit: 2,
    candi_join_btn_time: 5,
    candi_edit_btn_time: 30,
    candi_slot_booking_btn_time: 30,
    int_check_btn_time: 10,
    int_slot_available_btn_time: 10,
    enabled: 0
  },
  {
    id: 2,
    type: 'TI',
    event_title: 'Teaching Interview',
    event_duration: 40,
    candi_reschedule_limit: 2,
    candi_join_btn_time: 5,
    candi_edit_btn_time: 30,
    candi_slot_booking_btn_time: 30,
    int_check_btn_time: 10,
    int_slot_available_btn_time: 10
  },
  {
    id: 3,
    type: 'FA',
    event_title: 'Final Assessment Demo',
    event_duration: 40,
    candi_reschedule_limit: 2,
    candi_join_btn_time: 5,
    candi_edit_btn_time: 30,
    candi_slot_booking_btn_time: 30,
    int_check_btn_time: 10,
    int_slot_available_btn_time: 10
  },
  {
    id: 4,
    type: 'NA',
    event_title: 'Default',
    event_duration: 0,
    enabled: 0
  },
  {
    id: 5,
    type: 'ESA',
    event_title: 'Essential Skills Assessment',
    event_duration: 30,
    candi_reschedule_limit: 3,
    candi_join_btn_time: 5,
    candi_edit_btn_time: 30,
    candi_slot_booking_btn_time: 1440,
    int_check_btn_time: 10,
    int_slot_available_btn_time: 10
  }
];

//for: bs_slot_type
export const slotTypeData: Prisma.SlotTypeCreateInput[] = [
  { id: 1, short_name: 'M', name: 'Morning' },
  { id: 2, short_name: 'A', name: 'Afternoon' },
  { id: 3, short_name: 'E', name: 'Evening' }
];

//for: bs_booking_status_ref
export const bookingStatusRefData: Prisma.BookingStatusRefCreateInput[] = [
  { id: 1, status: 'AVAILABLE' },
  { id: 2, status: 'NOT_BOOKED' },
  { id: 3, status: 'BOOKED' },
  { id: 4, status: 'COMPLETED' },
  { id: 5, status: 'NOT_COMPLETED' },
  { id: 6, status: 'ACTIVE' },
  { id: 7, status: 'WITHDRAW' },
  { id: 8, status: 'COVER' },
  { id: 9, status: 'FAILED' },
  { id: 10, status: 'PASSED' },
  { id: 11, status: 'MISSED' },
  { id: 12, status: 'RE_PREPARE' },
  { id: 13, status: 'REMOVE' },
  { id: 14, status: 'DROPOUT' },
  { id: 15, status: 'ONHOLD' }
];

//for: bs_validation
export const ValidationBookingData: Prisma.ValidationBookingCreateInput[] = [
  { validation_name: 'candidate_join_btn', validation_value: 10 },
  { validation_name: 'candidate_edit_btn', validation_value: 10 },
  { validation_name: 'candidate_slot_booking_btn', validation_value: 15 },
  { validation_name: 'Interviewer_check_btn', validation_value: 10 },
  { validation_name: 'interviewer_slot_available_btn', validation_value: 5 }
];
