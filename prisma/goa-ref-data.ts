// import { Prisma } from '@prisma/client';

// //for: goa_date
// export const dateData: Prisma.DateCreateManyInput[] = [
//     { iddate: 1, date: 'Monday' },
//     { iddate: 2, date: 'Tuesday' },
//     { iddate: 3, date: 'Wednesday' },
//     { iddate: 4, date: 'Thursday' },
//     { iddate: 5, date: 'Friday' }
// ];

// //for: goa_time_slots
// export const timeSlots: Prisma.TimeSlotsCreateManyInput[] = [
//     {
//         oh_increase_time: '13:30',
//         hh_increase_time: '14:00',
//         oh_reduce_time: '13:30',
//         hh_reduce_time: '14:00'
//     },
//     {
//         oh_increase_time: '14:30',
//         hh_increase_time: '15:00',
//         oh_reduce_time: '14:30',
//         hh_reduce_time: '15:00'
//     },
//     {
//         oh_increase_time: '15:30',
//         hh_increase_time: '16:00',
//         oh_reduce_time: '15:30',
//         hh_reduce_time: '16:00'
//     },
//     {
//         oh_increase_time: '16:30',
//         hh_increase_time: '17:00',
//         oh_reduce_time: '16:30',
//         hh_reduce_time: '17:00'
//     },
//     {
//         oh_increase_time: '18:30',
//         hh_increase_time: '19:00',
//         oh_reduce_time: '18:30',
//         hh_reduce_time: '19:00'
//     },
//     {
//         oh_increase_time: '19:30',
//         hh_increase_time: '20:00',
//         oh_reduce_time: '19:30',
//         hh_reduce_time: '20:00'
//     },
//     {
//         oh_increase_time: '20:30',
//         hh_increase_time: '21:00',
//         oh_reduce_time: '20:30',
//         hh_reduce_time: '21:00'
//     }
// ];

// //for: goa_slot
// export const slotData: Prisma.GoaSlotCreateManyInput[] = [
//     { status: 'active', date_iddate: 1, time_slot: 1 },
//     { status: 'active', date_iddate: 1, time_slot: 2 },
//     { status: 'active', date_iddate: 1, time_slot: 3 },
//     { status: 'active', date_iddate: 1, time_slot: 4 },
//     { status: 'active', date_iddate: 1, time_slot: 5 },
//     { status: 'active', date_iddate: 1, time_slot: 6 },
//     { status: 'active', date_iddate: 1, time_slot: 7 },
//     { status: 'active', date_iddate: 2, time_slot: 1 },
//     { status: 'active', date_iddate: 2, time_slot: 2 },
//     { status: 'active', date_iddate: 2, time_slot: 3 },
//     { status: 'active', date_iddate: 2, time_slot: 4 },
//     { status: 'active', date_iddate: 2, time_slot: 5 },
//     { status: 'active', date_iddate: 2, time_slot: 6 },
//     { status: 'active', date_iddate: 2, time_slot: 7 },
//     { status: 'active', date_iddate: 3, time_slot: 1 },
//     { status: 'active', date_iddate: 3, time_slot: 2 },
//     { status: 'active', date_iddate: 3, time_slot: 3 },
//     { status: 'active', date_iddate: 3, time_slot: 4 },
//     { status: 'active', date_iddate: 3, time_slot: 5 },
//     { status: 'active', date_iddate: 3, time_slot: 6 },
//     { status: 'active', date_iddate: 3, time_slot: 7 },
//     { status: 'active', date_iddate: 4, time_slot: 1 },
//     { status: 'active', date_iddate: 4, time_slot: 2 },
//     { status: 'active', date_iddate: 4, time_slot: 3 },
//     { status: 'active', date_iddate: 4, time_slot: 4 },
//     { status: 'active', date_iddate: 4, time_slot: 5 },
//     { status: 'active', date_iddate: 4, time_slot: 6 },
//     { status: 'active', date_iddate: 4, time_slot: 7 },
//     { status: 'active', date_iddate: 5, time_slot: 1 },
//     { status: 'active', date_iddate: 5, time_slot: 2 },
//     { status: 'active', date_iddate: 5, time_slot: 3 },
//     { status: 'active', date_iddate: 5, time_slot: 4 },
//     { status: 'active', date_iddate: 5, time_slot: 5 },
//     { status: 'active', date_iddate: 5, time_slot: 6 },
//     { status: 'active', date_iddate: 5, time_slot: 7 }
// ];

// //for: goa_slot_status
// export const goaSlotStatusData: Prisma.GoaSlotStatusCreateManyInput[] = [
//     {
//         idslot_status: 1,
//         code: 'P',
//         description: 'Primary'
//     },
//     {
//         idslot_status: 2,
//         code: 'S',
//         description: 'Secondary'
//     },
//     {
//         idslot_status: 3,
//         code: 'PC',
//         description: 'Primary Cover'
//     },
//     {
//         idslot_status: 4,
//         code: 'SC',
//         description: 'Secondary Cover'
//     },
//     {
//         idslot_status: 5,
//         code: 'N',
//         description: 'No / Reject'
//     },
//     {
//         idslot_status: 6,
//         code: 'Y',
//         description: 'Yes (Availability given by Candidate)'
//     },
//     {
//         idslot_status: 7,
//         code: 'TO',
//         description: 'Time Off'
//     },
//     {
//         idslot_status: 8,
//         code: 'H',
//         description: 'On Hold'
//     }
// ];