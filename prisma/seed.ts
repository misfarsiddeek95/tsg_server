import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

import { stemCriteriaData } from './stem-criteria-data';
import { banksData } from './banks-data';
import {
  appointmentTypeRefData,
  slotTypeData,
  bookingStatusRefData,
  ValidationBookingData
} from './bs-booking-ref-data';
import { allBookingSlotData } from './bs-all-booking-slot-data';
// import {
//   timeSlots,
//   dateData,
//   slotData,
//   goaSlotStatusData
// } from './goa-ref-data';
import { sesRevampTemplateData, sesRevampMetaDataData } from './ses-ref-data';
import {
  accessSystemModulesRefData,
  accessGroupsRefData,
  accessGroupsOnModulesData
} from './access-management-data';

import { createTutor } from './create-tutor';
import { createNonTutor, isUserExist } from './create-non-tutor';
import {
  daylightSaving,
  goaDayofWeek,
  goaSlot,
  goaSlotStatus,
  goaTimeRanges,
  holidayTypes,
  tutorPaymentRates
} from './tasms';
import { goaTiers } from './invoicing';
import {
  calendar,
  holidaysTypes,
  leaveMetaData,
  leavePoliciesData,
  nonTutors
} from './leave-data';
import { slotMovementsTypes } from './goaSlotMovementTypes';

//for: tutor_batch_list
// const tutorBatchListData: Prisma.TutorBatchListCreateInput[] = [
//   { batch_name: '31-A' },
//   { batch_name: '31-B' },
//   { batch_name: '32-B' },
//   { batch_name: '33' },
//   { batch_name: '34' },
//   { batch_name: '35' }
// ];

//for: flexi_exam
const flexiExamData: Prisma.FlexiExamCreateInput[] = [
  {
    exam_id: 'fbf4437b-932f-4ce1-90af-e7f94ee2bc02',
    exam_name: 'Online Maths Assessment',
    exam_type: 'Sample',
    active_status: true
  }
];

async function main() {
  console.log(`Start seeding ...\n`);

  await prisma.$executeRawUnsafe('TRUNCATE TABLE stem_criteria');
  console.log('truncated: stem_criteria\n');

  await prisma.stemCriteria.createMany({
    data: stemCriteriaData,
    skipDuplicates: true
  });
  console.log('seeded: stem_criteria');

  /**
   * Seeding Data for:
   * Booking System (GRA)
   */
  await prisma.appointmentTypeRef.createMany({
    data: appointmentTypeRefData,
    skipDuplicates: true
  });
  console.log('seeded: bs_appintment_type_ref');

  await prisma.slotType.createMany({
    data: slotTypeData,
    skipDuplicates: true
  });
  console.log('seeded: bs_slot_type');

  await prisma.bookingStatusRef.createMany({
    data: bookingStatusRefData,
    skipDuplicates: true
  });
  console.log('seeded: bs_booking_status_ref');

  await prisma.allBookingSlot.createMany({
    data: allBookingSlotData,
    skipDuplicates: true
  });
  console.log('seeded: bs_all_booking_slot');

  /**
   * Seeding Data for:
   * FAS
   */
  // await prisma.tutorBatchList.createMany({
  //   data: tutorBatchListData,
  //   skipDuplicates: true
  // });
  // console.log('seeded: tutor_batch_list');

  /**
   * Seeding Data for:
   * HRIS
   */
  await prisma.banks.createMany({
    data: banksData,
    skipDuplicates: true
  });
  console.log('seeded: banks');

  /**
   * Seeding Data for:
   * Flexi Quizz
   */
  await prisma.flexiExam.createMany({
    data: flexiExamData,
    skipDuplicates: true
  });
  console.log('seeded: flexi_exam');

  await prisma.$executeRawUnsafe('TRUNCATE TABLE bs_validation');
  console.log('truncated: bs_validation\n');
  await prisma.validationBooking.createMany({
    data: ValidationBookingData,
    skipDuplicates: true
  });
  console.log('seeded: bs_validation');

  /**
   * Seeding Data for: GOA
   * Session Availability & Invoicing (GOA)
   */

  await prisma.gOATutorPaymentRates.createMany({
    data: tutorPaymentRates,
    skipDuplicates: true
  });
  console.log('seeded: Tutor Payment Rates');

  await prisma.holidaysType.createMany({
    data: holidayTypes,
    skipDuplicates: true
  });
  console.log('seeded: Holiday Types');

  await prisma.gOASlotStatus.createMany({
    data: goaSlotStatus,
    skipDuplicates: true
  });
  console.log('seeded: GOA Slot Status');

  await prisma.gOATimeRange.createMany({
    data: goaTimeRanges,
    skipDuplicates: true
  });
  console.log('seeded: GOA Time Range');

  await prisma.daylightSaving.createMany({
    data: daylightSaving,
    skipDuplicates: true
  });
  console.log('seeded: Daylight Saving');

  await prisma.gOADaysOFWeek.createMany({
    data: goaDayofWeek,
    skipDuplicates: true
  });
  console.log('seeded: Days of Week');

  await prisma.gOASlot.createMany({
    data: goaSlot,
    skipDuplicates: true
  });
  console.log('seeded: Slots');

  await prisma.gOATiers.createMany({
    data: goaTiers,
    skipDuplicates: true
  });
  console.log('seeded: Tiers');

  await prisma.gOASlotMovementType.createMany({
    data: slotMovementsTypes,
    skipDuplicates: true
  });
  console.log('seeded: Slot movement types');

  /**
   * Seeding Data for:
   * SES / AQAS
   */
  await prisma.sesRevampTemplate.createMany({
    data: sesRevampTemplateData,
    skipDuplicates: true
  });
  console.log('seeded: ses_revamp_template');

  await prisma.sesRevampMetaData.createMany({
    data: sesRevampMetaDataData,
    skipDuplicates: true
  });
  console.log('seeded: ses_revamp_meta_data');

  /**
   * Seeding Data for:
   * Access Management
   */

  await prisma.accessSystemModulesRef.createMany({
    data: accessSystemModulesRefData,
    skipDuplicates: true
  });
  console.log('seeded: access_system_modules_ref');

  await prisma.accessGroupsRef.createMany({
    data: accessGroupsRefData.map((d) => {
      return {
        id: d.id,
        description: d.description
      };
    }),
    skipDuplicates: true
  });
  console.log('seeded: access_groups_ref');

  await prisma.accessGroupsOnModules.createMany({
    data: accessGroupsRefData.flatMap((groupRef) => {
      return groupRef.moduleIds.map((moduleId) => {
        return {
          moduleId,
          groupId: groupRef.id
        };
      });
    }),
    skipDuplicates: true
  });
  console.log('seeded: access_groups_on_modules');

  await prisma.nTHRISLeavePolicies.createMany({
    data: leavePoliciesData,
    skipDuplicates: true
  });
  console.log('seeded: leave policies');

  await prisma.nTHRISLeaveMeta.createMany({
    data: leaveMetaData,
    skipDuplicates: true
  });
  console.log('seeded: leave meta data');

  await prisma.holidaysType.createMany({
    data: holidaysTypes,
    skipDuplicates: true
  });
  console.log('seeded: holiday types');

  // await prisma.calendar.createMany({
  //   data: calendar,
  //   skipDuplicates: true
  // });
  // console.log('seeded: calendar');

  await prisma.nonTutorDirectory.createMany({
    data: nonTutors,
    skipDuplicates: true
  });
  console.log('seeded: non tutor directory');

  /**
   * Fix columns updated_at to automatically update timestamp
   */
  // update updated_at columns default value

  /**
   // UPDATE: commented this as everytime we do db push these fields get reset.
  const tables = [
    'bs_validation',
    'bs_candidate_level',
    'gra_registration_data'
  ];

  await Promise.all(
    tables.map((table) =>
      prisma.$executeRawUnsafe(
        `ALTER TABLE ${table} CHANGE COLUMN updated_at updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`
      )
    )
  );
  */

  /**
   * create sample accounts non-tutor & tutor
   * for testing purpose only.
   * comment when deploying final ssytem
   */
  //function createNonTutor(level, tsp_id, username, fname, lname, ac_type = 'interviewer')
  let tsp_id = 1;
  let username = 'interviewer@tsg.com';
  let fname = 'Interviewer';
  let lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'interviewer'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 2;
  username = 'admin@tsg.com';
  fname = 'Admin';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'admin'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 3;
  username = 'auditor@tsg.com';
  fname = 'Auditor';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'auditor'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 4;
  username = 'hradmin@tsg.com';
  fname = 'HR Admin';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'hr admin'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 5;
  username = 'hruser@tsg.com';
  fname = 'HR User';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'hr user'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 6;
  username = 'capacity@tsg.com';
  fname = 'Capacity Team';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'capacity'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 7;
  username = 'operations@tsg.com';
  fname = 'Operations Team';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'operations'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 8;
  username = 'bsa@tsg.com';
  fname = 'BSA Team';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'bsa'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 9;
  username = 'rm1@tsg.com';
  fname = 'Relationship Mng1';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'rm'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 10;
  username = 'rm2@tsg.com';
  fname = 'Relationship Mng2';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'rm'));
  console.log('created acc: ', username, ' password: b');

  //function createTutor(tsp_id, username, fname, lname, tutor_level = 3 )
  tsp_id = 11;
  username = 'tutor2@tsg.com';
  fname = 'Tutor';
  lname = 'Edu';
  !(await isUserExist(tsp_id)) &&
    (await createTutor(tsp_id, username, fname, lname, 2));
  console.log('created tutor: ', username, ' password: b');

  tsp_id = 12;
  username = 'tutor3@tsg.com';
  fname = 'Tutor';
  lname = 'Math';
  !(await isUserExist(tsp_id)) &&
    (await createTutor(tsp_id, username, fname, lname, 3));
  console.log('created tutor: ', username, ' password: b');

  tsp_id = 13;
  username = 'tutor4@tsg.com';
  fname = 'Tutor';
  lname = 'PI';
  !(await isUserExist(tsp_id)) &&
    (await createTutor(tsp_id, username, fname, lname, 4));
  console.log('created tutor: ', username, ' password: b');

  tsp_id = 14;
  username = 'tutor5@tsg.com';
  fname = 'Tutor';
  lname = 'TI';
  !(await isUserExist(tsp_id)) &&
    (await createTutor(tsp_id, username, fname, lname, 5));
  console.log('created tutor: ', username, ' password: b');

  tsp_id = 15;
  username = 'tutor6@tsg.com';
  fname = 'Tutor';
  lname = 'FA';
  !(await isUserExist(tsp_id)) &&
    (await createTutor(tsp_id, username, fname, lname, 6));
  console.log('created tutor: ', username, ' password: b');

  tsp_id = 16;
  username = 'tutor7@tsg.com';
  fname = 'Tutor';
  lname = 'Complete';
  !(await isUserExist(tsp_id)) &&
    (await createTutor(tsp_id, username, fname, lname, 7));
  console.log('created tutor: ', username, ' password: b');

  tsp_id = 17;
  username = 'auditor2@tsg.com';
  fname = 'Auditortwo';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'auditor'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 18;
  username = 'auditor3@tsg.com';
  fname = 'Auditorthree';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'auditor'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 19;
  username = 'auditor4@tsg.com';
  fname = 'Auditorfour';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'auditor'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 20;
  username = 'auditor5@tsg.com';
  fname = 'Auditorfive';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'auditor'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 21;
  username = 'tms_am@tsg.com';
  fname = 'Assistant Mng';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'tms_am'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 22;
  username = 'tms_com@tsg.com';
  fname = 'Auditorfive';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'tms_com'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 23;
  username = 'it_auditor@tsg.com';
  fname = 'IT Auditor';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'it_auditor'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 24;
  username = 'nthris_hr_admin@tsg.com';
  fname = 'HR Admin';
  lname = 'NTHRIS';
  createNonTutor(tsp_id, username, fname, lname, 'hr admin');
  console.log('created acc: ', username, ' password: b');

  tsp_id = 25;
  username = 'nthris_hr_user@tsg.com';
  fname = 'HR User';
  lname = 'NTHRIS';
  createNonTutor(tsp_id, username, fname, lname, 'hr user');
  console.log('created acc: ', username, ' password: b');

  tsp_id = 26;
  username = 'nthris_leave_manager@tsg.com';
  fname = 'Leave Manager';
  lname = 'NTHRIS';
  createNonTutor(tsp_id, username, fname, lname, 'nthris manager');
  console.log('created acc: ', username, ' password: b');

  tsp_id = 27;
  username = 'nthris_leave_user1@tsg.com';
  fname = 'Leave User 1';
  lname = 'NTHRIS';
  createNonTutor(tsp_id, username, fname, lname, 'nthris user');
  console.log('created acc: ', username, ' password: b');

  tsp_id = 28;
  username = 'nthris_leave_user2@tsg.com';
  fname = 'Leave User 2';
  lname = 'NTHRIS';
  createNonTutor(tsp_id, username, fname, lname, 'nthris user');
  console.log('created acc: ', username, ' password: b');

  tsp_id = 29;
  username = 'interviewer2@tsg.com';
  fname = 'InterviewerTwo';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'interviewer'));
  console.log('created acc: ', username, ' password: b');

  tsp_id = 30;
  username = 'interviewer3@tsg.com';
  fname = 'InterviewerThree';
  lname = 'Acc';
  !(await isUserExist(tsp_id)) &&
    (await createNonTutor(tsp_id, username, fname, lname, 'interviewer'));
  console.log('created acc: ', username, ' password: b');

  console.log(`\nSeeding finished.`);

  // create
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
