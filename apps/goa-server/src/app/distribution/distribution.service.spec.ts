import { Test, TestingModule } from '@nestjs/testing';
import { DistributionService } from './distribution.service';
import { PrismaService } from '../prisma/prisma.service';
import { SlotsService } from '../slots/slots.service';
import { UserService } from '../user/service/user.service';
// import * as moment from 'moment';
import moment = require('moment-timezone');

describe('DistributionService - tutorDistribution', () => {
  let service: DistributionService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistributionService,
        {
          provide: PrismaService,
          useValue: {
            gOATimeRange: {
              findFirst: jest.fn() // Jest mock function
            },
            tslUser: {
              findFirst: jest.fn() // Mock the Prisma method
            },
            goaTslBookedDetails: {
              findMany: jest.fn() // Mock the Prisma method
            },
            gOASlot: {
              findFirst: jest.fn() // Mock the Prisma method
            },
            gOATutorsSlots: {
              findFirst: jest.fn() // Mock the Prisma method
            },
            gOASessionSwap: {
              create: jest.fn() // Mock the Prisma method
            }
          }
        },
        {
          provide: SlotsService,
          useValue: {
            // Mock SlotsService methods if necessary
          }
        },
        {
          provide: UserService,
          useValue: {
            // Mock UserService methods if necessary
          }
        }
      ]
    }).compile();

    service = module.get<DistributionService>(DistributionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('tutorDistribution', () => {
    //Primary - AM -  Should check with the digram
    it('should return tutorIds for Primary phase and AM time', async () => {
      // Mocking the gOATimeRange.findFirst method to return a specific ID
      // Here, we return an ID of 1, which falls into the 'AM' category
      (prismaService.gOATimeRange.findFirst as jest.Mock).mockResolvedValue({
        id: 1
      });
      // Mocking the getAvailability method to return a list of tutor objects
      // Each tutor has a tsl_id, tutor_phase, and session_count
      // The list is specifically structured to test the logic for selecting tutors in the AM time slot
      jest.spyOn(service, 'getAvailability').mockResolvedValue([
        { tsl_id: 1, tutor_phase: 'Primary', session_count: 5 }, // A Primary tutor with higher session count
        { tsl_id: 2, tutor_phase: 'Primary and Secondary', session_count: 2 }, // A Primary and Secondary tutor with lower session count
        { tsl_id: 3, tutor_phase: 'Primary', session_count: 1 }, // Another Primary tutor with the lowest session count
        { tsl_id: 4, tutor_phase: 'Primary and Secondary', session_count: 1 } // Another Primary tutor with the lowest session count
      ]);
      // Call the tutorDistribution method with the specific parameters
      const tutorIds = await service.tutorDistribution(
        '2024-01-01', // startDateString
        '2024-01-02', // endDateString
        'OH', // hourState
        'Primary', // tutorPhase
        '2024-01-01', // weeklyStartDate
        '2024-01-02', // weeklyEndDate
        1, //goaSlotId
        1, //Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
        3, // numberOfStudents
        true // requesting cover tutors
      );
      // The expectation is that the method will select the tutors based on the AM time logic:
      // - Priority 1: Secondary tutors should be chosen first
      // - Priority 2: If there aren't enough Secondary tutors, the method should fill with Primary tutors
      // - Priority 3: Tutors with the least session_count should be selected
      // Since tutor tsl_id 2 (Primary and Secondary) has the lowest session count and is a Secondary tutor,
      // it should be selected first. Then, tutor tsl_id 3 (Primary) with the lowest session count among Primary tutors is selected.
      expect(tutorIds).toEqual([4, 2, 3]);
    });
    //Primary - PM - Should check with the digram
    it('should return tutorIds for Primary phase and PM time', async () => {
      // Mocking the gOATimeRange.findFirst method to return a specific ID
      // Here, we return an ID of 5, which falls into the 'PM' category
      (prismaService.gOATimeRange.findFirst as jest.Mock).mockResolvedValue({
        id: 5
      });
      // Mocking the getAvailability method to return a list of tutor objects
      // Each tutor has a tsl_id, tutor_phase, and session_count
      // The list is specifically structured to test the logic for selecting tutors in the AM time slot
      jest.spyOn(service, 'getAvailability').mockResolvedValue([
        { tsl_id: 1, tutor_phase: 'Primary', session_count: 5 }, // A Primary tutor with higher session count
        { tsl_id: 2, tutor_phase: 'Primary and Secondary', session_count: 2 }, // A Primary and Secondary tutor with lower session count
        { tsl_id: 3, tutor_phase: 'Primary', session_count: 1 }, // Another Primary tutor with the lowest session count
        { tsl_id: 4, tutor_phase: 'Primary', session_count: 3 } // Another Primary tutor with the lowest session count
      ]);
      // Call the tutorDistribution method with the specific parameters
      const tutorIds = await service.tutorDistribution(
        '2024-01-01', // startDateString
        '2024-01-02', // endDateString
        'OH', // hourState
        'Primary', // tutorPhase
        '2024-01-01', // weeklyStartDate
        '2024-01-02', // weeklyEndDate
        1, //goaSlotId
        5, //Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
        3, // numberOfStudents
        false // requesting cover tutors
      );
      // The expectation is that the method will select the tutors based on the AM time logic:
      // - Priority 1: Secondary tutors should be chosen first
      // - Priority 2: If there aren't enough Secondary tutors, the method should fill with Primary tutors
      // - Priority 3: Tutors with the least session_count should be selected
      // Since tutor tsl_id 2 (Primary and Secondary) has the lowest session count and is a Secondary tutor,
      // it should be selected first. Then, tutor tsl_id 3 (Primary) with the lowest session count among Primary tutors is selected.
      expect(tutorIds).toEqual([3, 4, 1]);
    });

    //Secondary - PM (Tutor filtering not depend on the PM or AM)
    it('should return tutorIds for Secondary phase', async () => {
      // Mocking the gOATimeRange.findFirst method to return a specific ID
      // Here, we return an ID of 5, which does not fall into the 'AM' category
      // This indicates that the time slot is in the PM
      (prismaService.gOATimeRange.findFirst as jest.Mock).mockResolvedValue({
        id: 5
      });
      // Mocking the getAvailability method to return a list of tutor objects
      // Each tutor has a tsl_id, tutor_phase, and session_count
      // The list is structured to test the logic for selecting tutors in the Secondary phase
      jest.spyOn(service, 'getAvailability').mockResolvedValue([
        { tsl_id: 1, tutor_phase: 'Primary and Secondary', session_count: 5 }, // A Secondary tutor with higher session count
        { tsl_id: 2, tutor_phase: 'Primary and Secondary', session_count: 2 }, // A Secondary tutor with lower session count
        { tsl_id: 3, tutor_phase: 'Primary', session_count: 1 } // Another Secondary tutor with the lowest session count
      ]);
      // Call the tutorDistribution method with the specific parameters
      const tutorIds = await service.tutorDistribution(
        '2024-01-01', // startDateString
        '2024-01-02', // endDateString
        'OH', // hourState
        'Secondary', // tutorPhase
        '2024-01-01', // weeklyStartDate
        '2024-01-02', // weeklyEndDate
        1, //goaSlotId
        5, //Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
        2, // numberOfStudents
        false // requesting cover tutors
      );
      // The expectation is that the method will select the tutors based on the Secondary phase logic:
      // - The method should select tutors who are eligible for both Primary and Secondary phases,
      //   prioritizing those with the least session_count
      // Since tutor tsl_id 3 has the lowest session_count, it should be selected first,
      // followed by tutor tsl_id 2, which has the next lowest session_count.
      expect(tutorIds).toEqual([2, 1]);
    });

    //Secondary - AM (Tutor filtering not depend on the PM or AM)
    it('should return tutorIds for Secondary phase', async () => {
      // Mocking the gOATimeRange.findFirst method to return a specific ID
      // Here, we return an ID of 5, which does not fall into the 'AM' category
      // This indicates that the time slot is in the AM
      (prismaService.gOATimeRange.findFirst as jest.Mock).mockResolvedValue({
        id: 2
      });
      // Mocking the getAvailability method to return a list of tutor objects
      // Each tutor has a tsl_id, tutor_phase, and session_count
      // The list is structured to test the logic for selecting tutors in the Secondary phase
      jest.spyOn(service, 'getAvailability').mockResolvedValue([
        { tsl_id: 1, tutor_phase: 'Primary and Secondary', session_count: 5 }, // A Secondary tutor with higher session count
        { tsl_id: 2, tutor_phase: 'Primary and Secondary', session_count: 2 }, // A Secondary tutor with lower session count
        { tsl_id: 3, tutor_phase: 'Primary', session_count: 1 } // Another Secondary tutor with the lowest session count
      ]);
      // Call the tutorDistribution method with the specific parameters
      const tutorIds = await service.tutorDistribution(
        '2024-01-01', // startDateString
        '2024-01-02', // endDateString
        'OH', // hourState
        'Secondary', // tutorPhase
        '2024-01-01', // weeklyStartDate
        '2024-01-02', // weeklyEndDate
        1, //goaSlotId
        2, //Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
        2, // numberOfStudents
        false // requesting cover tutors
      );
      // The expectation is that the method will select the tutors based on the Secondary phase logic:
      // - The method should select tutors who are eligible for both Primary and Secondary phases,
      //   prioritizing those with the least session_count
      // Since tutor tsl_id 3 has the lowest session_count, it should be selected first,
      // followed by tutor tsl_id 2, which has the next lowest session_count.
      expect(tutorIds).toEqual([2, 1]);
    });
    //Error handling
    // it('should handle errors gracefully', async () => {
    //   // Mocking the gOATimeRange.findFirst method to simulate an error
    //   // Here, we simulate a database error using mockRejectedValue
    //   (prismaService.gOATimeRange.findFirst as jest.Mock).mockRejectedValue(
    //     new Error('Database error')
    //   );
    //   // Call the tutorDistribution method with the specific parameters
    //   const result = await service.tutorDistribution(
    //     '2024-01-01', // startDateString
    //     '2024-01-02', // endDateString
    //     'OH', // hourState
    //     'Primary', // tutorPhase
    //     '2024-01-01', // weeklyStartDate
    //     '2024-01-02', // weeklyEndDate
    //     1, //goaSlotId
    //     5, //Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
    //     2, // numberOfStudents
    //     true // requesting cover tutors
    //   );
    //   // The expectation is that the method will catch the error and return an appropriate error response
    //   // The returned object should contain success: false and an error message describing the issue
    //   expect(result).toEqual({ success: false, error: 'Database error' });
    // });
  });

  describe('SWAP - TMS', () => {
    it('should perform a permanent swap when LWD is more than 2 days away', async () => {
      // Mock `tslUser` to return a tutor ID
      (prismaService.tslUser.findFirst as jest.Mock).mockResolvedValue({
        tsl_id: 1
      });

      // Mock `permanantSwap` to return session details
      jest
        .spyOn(service, 'permanantSwap')
        .mockResolvedValue([{ session_id: 101, tutor_id: 2 }]);

      // Call the method with parameters indicating LWD is more than 2 days away
      await service.swapTMS(
        '2024-12-01',
        123,
        'Resignation',
        'Reason for swap',
        6 //Type - Resignation
      );

      expect(prismaService.tslUser.findFirst).toHaveBeenCalledWith({
        where: { tsp_id: 123 },
        select: { tsl_id: true }
      });
      expect(service.permanantSwap).toHaveBeenCalled();
    });
    it('should perform temporary and permanent swaps when LWD is 2 days or fewer away', async () => {
      // Mock `tslUser` to return a tutor ID
      (prismaService.tslUser.findFirst as jest.Mock).mockResolvedValue({
        tsl_id: 1
      });

      // Mock `tempSwap` and `permanantSwap`
      jest
        .spyOn(service, 'tempSwap')
        .mockResolvedValue([{ session_id: 101, tutor_id: 2 }]);
      jest
        .spyOn(service, 'permanantSwap')
        .mockResolvedValue([{ session_id: 102, tutor_id: 3 }]);

      // Call the method with parameters indicating LWD is 2 days away
      const tommorrowDate = moment().add(1, 'days'); // Add12 days to today's date
      await service.swapTMS(
        tommorrowDate, //'2024-11-26'
        123,
        'Termination',
        'Reason for swap',
        7 // type - Termination
      );

      expect(prismaService.tslUser.findFirst).toHaveBeenCalled();
      expect(service.tempSwap).toHaveBeenCalled();
      expect(service.permanantSwap).toHaveBeenCalled();
    });

    // it('should handle scenarios where no tutors are found', async () => {
    //   // Mock `tslUser` to return null
    //   (prismaService.tslUser.findFirst as jest.Mock).mockResolvedValue(null);

    //   // Call the method and expect an error
    //   await expect(
    //     service.swapTMS('2024-12-01', 123, 'Termination', 'Reason for swap', 7)
    //   ).rejects.toThrow('No tutor found for the given tspId');
    // });

    // it('should handle database errors gracefully', async () => {
    //   // Mock `tslUser` to throw an error
    //   (prismaService.tslUser.findFirst as jest.Mock).mockRejectedValue(
    //     new Error('Database error')
    //   );

    //   const result = await service.swapTMS(
    //     '2024-12-01',
    //     123,
    //     'Resignation',
    //     'Reason for swap',
    //     6
    //   );
    //   expect(result).toEqual({ success: false, error: 'Database error' });
    // });

    // it('should validate correct arguments passed to Prisma for permanent swap', async () => {
    //   // Mock `tslUser` to return a tutor ID
    //   (prismaService.tslUser.findFirst as jest.Mock).mockResolvedValue({
    //     tsl_id: 1
    //   });

    //   // Mock booked sessions to return session data
    //   (
    //     prismaService.goaTslBookedDetails.findMany as jest.Mock
    //   ).mockResolvedValue([
    //     { sessionId: 1, goaSlotId: 1, hourSlot: 'OH', sessionType: 'Primary' }
    //   ]);

    //   // Mock `permanantSwap` call
    //   jest
    //     .spyOn(service, 'permanantSwap')
    //     .mockResolvedValue([{ session_id: 101, tutor_id: 2 }]);

    //   await service.swapTMS(
    //     '2024-12-01',
    //     123,
    //     'Termination',
    //     'Reason for swap',
    //     6
    //   );

    //   expect(prismaService.goaTslBookedDetails.findMany).toHaveBeenCalledWith({
    //     where: { tutorId: 1, sessionDate: { gte: expect.any(Date) } }
    //   });
    //   expect(service.permanantSwap).toHaveBeenCalled();
    // });
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { DistributionService } from './distribution.service';
// import { PrismaService } from '../prisma/prisma.service';
// import { SlotsService } from '../slots/slots.service';
// import { UserService } from '../user/service/user.service';
// // import * as moment from 'moment';
// import moment = require('moment-timezone');

// describe('DistributionService - tutorDistribution', () => {
//   let service: DistributionService;
//   let prismaService: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         DistributionService,
//         {
//           provide: PrismaService,
//           useValue: {
//             gOATimeRange: {
//               findFirst: jest.fn() // Jest mock function
//             },
//             tslUser: {
//               findFirst: jest.fn() // Mock the Prisma method
//             },
//             goaTslBookedDetails: {
//               findMany: jest.fn() // Mock the Prisma method
//             },
//             gOASlot: {
//               findFirst: jest.fn() // Mock the Prisma method
//             },
//             gOATutorsSlots: {
//               findFirst: jest.fn() // Mock the Prisma method
//             },
//             gOASessionSwap: {
//               create: jest.fn() // Mock the Prisma method
//             }
//           }
//         },
//         {
//           provide: SlotsService,
//           useValue: {
//             // Mock SlotsService methods if necessary
//           }
//         },
//         {
//           provide: UserService,
//           useValue: {
//             // Mock UserService methods if necessary
//           }
//         }
//       ]
//     }).compile();

//     service = module.get<DistributionService>(DistributionService);
//     prismaService = module.get<PrismaService>(PrismaService);
//   });

//   // describe('tutorDistribution', () => {
//   //   //Primary - AM -  Should check with the digram
//   //   it('should return tutorIds for Primary phase and AM time', async () => {
//   //     // Mocking the gOATimeRange.findFirst method to return a specific ID
//   //     // Here, we return an ID of 1, which falls into the 'AM' category
//   //     (prismaService.gOATimeRange.findFirst as jest.Mock).mockResolvedValue({
//   //       id: 1
//   //     });

//   //     // Mocking the getAvailability method to return a list of tutor objects
//   //     // Each tutor has a tsl_id, tutor_phase, and session_count
//   //     // The list is specifically structured to test the logic for selecting tutors in the AM time slot
//   //     jest.spyOn(service, 'getAvailability').mockResolvedValue([
//   //       { tsl_id: 1, tutor_phase: 'Primary', session_count: 5 }, // A Primary tutor with higher session count
//   //       { tsl_id: 2, tutor_phase: 'Primary and Secondary', session_count: 2 }, // A Primary and Secondary tutor with lower session count
//   //       { tsl_id: 3, tutor_phase: 'Primary', session_count: 1 }, // Another Primary tutor with the lowest session count
//   //       { tsl_id: 4, tutor_phase: 'Primary and Secondary', session_count: 1 } // Another Primary tutor with the lowest session count
//   //     ]);

//   //     // Call the tutorDistribution method with the specific parameters
//   //     const tutorIds = await service.tutorDistribution(
//   //       '2024-01-01', // startDateString
//   //       '2024-01-02', // endDateString
//   //       'OH', // hourState
//   //       'Primary', // tutorPhase
//   //       '2024-01-01', // weeklyStartDate
//   //       '2024-01-02', // weeklyEndDate
//   //       1, //goaSlotId
//   //       1, //Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
//   //       3, // numberOfStudents
//   //       true // requesting cover tutors
//   //     );

//   //     // The expectation is that the method will select the tutors based on the AM time logic:
//   //     // - Priority 1: Secondary tutors should be chosen first
//   //     // - Priority 2: If there aren't enough Secondary tutors, the method should fill with Primary tutors
//   //     // - Priority 3: Tutors with the least session_count should be selected

//   //     // Since tutor tsl_id 2 (Primary and Secondary) has the lowest session count and is a Secondary tutor,
//   //     // it should be selected first. Then, tutor tsl_id 3 (Primary) with the lowest session count among Primary tutors is selected.
//   //     expect(tutorIds).toEqual([4, 2, 3]);
//   //   });

//   //   //Primary - PM - Should check with the digram
//   //   it('should return tutorIds for Primary phase and PM time', async () => {
//   //     // Mocking the gOATimeRange.findFirst method to return a specific ID
//   //     // Here, we return an ID of 5, which falls into the 'PM' category
//   //     (prismaService.gOATimeRange.findFirst as jest.Mock).mockResolvedValue({
//   //       id: 5
//   //     });

//   //     // Mocking the getAvailability method to return a list of tutor objects
//   //     // Each tutor has a tsl_id, tutor_phase, and session_count
//   //     // The list is specifically structured to test the logic for selecting tutors in the AM time slot
//   //     jest.spyOn(service, 'getAvailability').mockResolvedValue([
//   //       { tsl_id: 1, tutor_phase: 'Primary', session_count: 5 }, // A Primary tutor with higher session count
//   //       { tsl_id: 2, tutor_phase: 'Primary and Secondary', session_count: 2 }, // A Primary and Secondary tutor with lower session count
//   //       { tsl_id: 3, tutor_phase: 'Primary', session_count: 1 }, // Another Primary tutor with the lowest session count
//   //       { tsl_id: 4, tutor_phase: 'Primary', session_count: 3 } // Another Primary tutor with the lowest session count
//   //     ]);

//   //     // Call the tutorDistribution method with the specific parameters
//   //     const tutorIds = await service.tutorDistribution(
//   //       '2024-01-01', // startDateString
//   //       '2024-01-02', // endDateString
//   //       'OH', // hourState
//   //       'Primary', // tutorPhase
//   //       '2024-01-01', // weeklyStartDate
//   //       '2024-01-02', // weeklyEndDate
//   //       '01:30', // slotStringSL
//   //       3 // numberOfStudents
//   //     );

//   //     // The expectation is that the method will select the tutors based on the AM time logic:
//   //     // - Priority 1: Secondary tutors should be chosen first
//   //     // - Priority 2: If there aren't enough Secondary tutors, the method should fill with Primary tutors
//   //     // - Priority 3: Tutors with the least session_count should be selected

//   //     // Since tutor tsl_id 2 (Primary and Secondary) has the lowest session count and is a Secondary tutor,
//   //     // it should be selected first. Then, tutor tsl_id 3 (Primary) with the lowest session count among Primary tutors is selected.
//   //     expect(tutorIds).toEqual([3, 4, 1]);
//   //   });
//   //   //
//   //   //Secondary - PM (Tutor filtering not depend on the PM or AM)
//   //   it('should return tutorIds for Secondary phase', async () => {
//   //     // Mocking the gOATimeRange.findFirst method to return a specific ID
//   //     // Here, we return an ID of 5, which does not fall into the 'AM' category
//   //     // This indicates that the time slot is in the PM
//   //     (prismaService.gOATimeRange.findFirst as jest.Mock).mockResolvedValue({
//   //       id: 5
//   //     });

//   //     // Mocking the getAvailability method to return a list of tutor objects
//   //     // Each tutor has a tsl_id, tutor_phase, and session_count
//   //     // The list is structured to test the logic for selecting tutors in the Secondary phase
//   //     jest.spyOn(service, 'getAvailability').mockResolvedValue([
//   //       { tsl_id: 1, tutor_phase: 'Primary and Secondary', session_count: 5 }, // A Secondary tutor with higher session count
//   //       { tsl_id: 2, tutor_phase: 'Primary and Secondary', session_count: 2 }, // A Secondary tutor with lower session count
//   //       { tsl_id: 3, tutor_phase: 'Primary', session_count: 1 } // Another Secondary tutor with the lowest session count
//   //     ]);

//   //     // Call the tutorDistribution method with the specific parameters
//   //     const tutorIds = await service.tutorDistribution(
//   //       '2024-01-01', // startDateString
//   //       '2024-01-02', // endDateString
//   //       'OH', // hourState
//   //       'Secondary', // tutorPhase
//   //       '2024-01-01', // weeklyStartDate
//   //       '2024-01-02', // weeklyEndDate
//   //       '11:30', // slotStringSL
//   //       2 // numberOfStudents
//   //     );

//   //     // The expectation is that the method will select the tutors based on the Secondary phase logic:
//   //     // - The method should select tutors who are eligible for both Primary and Secondary phases,
//   //     //   prioritizing those with the least session_count

//   //     // Since tutor tsl_id 3 has the lowest session_count, it should be selected first,
//   //     // followed by tutor tsl_id 2, which has the next lowest session_count.
//   //     expect(tutorIds).toEqual([2, 1]);
//   //   });
//   //   //
//   //   //Secondary - AM (Tutor filtering not depend on the PM or AM)
//   //   it('should return tutorIds for Secondary phase', async () => {
//   //     // Mocking the gOATimeRange.findFirst method to return a specific ID
//   //     // Here, we return an ID of 5, which does not fall into the 'AM' category
//   //     // This indicates that the time slot is in the AM
//   //     (prismaService.gOATimeRange.findFirst as jest.Mock).mockResolvedValue({
//   //       id: 2
//   //     });

//   //     // Mocking the getAvailability method to return a list of tutor objects
//   //     // Each tutor has a tsl_id, tutor_phase, and session_count
//   //     // The list is structured to test the logic for selecting tutors in the Secondary phase
//   //     jest.spyOn(service, 'getAvailability').mockResolvedValue([
//   //       { tsl_id: 1, tutor_phase: 'Primary and Secondary', session_count: 5 }, // A Secondary tutor with higher session count
//   //       { tsl_id: 2, tutor_phase: 'Primary and Secondary', session_count: 2 }, // A Secondary tutor with lower session count
//   //       { tsl_id: 3, tutor_phase: 'Primary', session_count: 1 } // Another Secondary tutor with the lowest session count
//   //     ]);

//   //     // Call the tutorDistribution method with the specific parameters
//   //     const tutorIds = await service.tutorDistribution(
//   //       '2024-01-01', // startDateString
//   //       '2024-01-02', // endDateString
//   //       'OH', // hourState
//   //       'Secondary', // tutorPhase
//   //       '2024-01-01', // weeklyStartDate
//   //       '2024-01-02', // weeklyEndDate
//   //       '11:30', // slotStringSL
//   //       2 // numberOfStudents
//   //     );

//   //     // The expectation is that the method will select the tutors based on the Secondary phase logic:
//   //     // - The method should select tutors who are eligible for both Primary and Secondary phases,
//   //     //   prioritizing those with the least session_count

//   //     // Since tutor tsl_id 3 has the lowest session_count, it should be selected first,
//   //     // followed by tutor tsl_id 2, which has the next lowest session_count.
//   //     expect(tutorIds).toEqual([2, 1]);
//   //   });

//   //   //Error handling
//   //   it('should handle errors gracefully', async () => {
//   //     // Mocking the gOATimeRange.findFirst method to simulate an error
//   //     // Here, we simulate a database error using mockRejectedValue
//   //     (prismaService.gOATimeRange.findFirst as jest.Mock).mockRejectedValue(
//   //       new Error('Database error')
//   //     );

//   //     // Call the tutorDistribution method with the specific parameters
//   //     const result = await service.tutorDistribution(
//   //       '2024-01-01', // startDateString
//   //       '2024-01-02', // endDateString
//   //       'OH', // hourState
//   //       'Primary', // tutorPhase
//   //       '2024-01-01', // weeklyStartDate
//   //       '2024-01-02', // weeklyEndDate
//   //       '11:30', // slotStringSL
//   //       2 // numberOfStudents
//   //     );

//   //     // The expectation is that the method will catch the error and return an appropriate error response
//   //     // The returned object should contain success: false and an error message describing the issue
//   //     expect(result).toEqual({ success: false, error: 'Database error' });
//   //   });
//   // });
//   describe('swapTMS', () => {
//     it('should handle a permanent swap when the last working day is more than 2 days away', async () => {
//       // Mocking Prisma TslUser with all required fields
//       jest.spyOn(prismaService.tslUser, 'findFirst').mockResolvedValue({
//         tsl_id: 1, // Assuming tsl_id is a bigint
//         tsp_id: 1, // Add any other required fields here
//         tsl_first_name: 'John',
//         tsl_last_name: 'Doe',
//         tsl_full_name: 'John Doe',
//         tsl_email: 'johndoe@example.com'
//       });

//       // Mocking GoaTslBookedDetails with all required fields
//       jest
//         .spyOn(prismaService.goaTslBookedDetails, 'findMany')
//         .mockResolvedValue([
//           {
//             id: 1, // Required and must be an integer
//             sessionId: 123, // Required and must be an integer
//             tutorId: BigInt(1), // Optional but provided as BigInt
//             tspId: 1, // Optional and integer
//             schoolId: 2, // Optional and integer
//             studentId: 3, // Optional and integer
//             studentName: 'John Doe', // Optional and string
//             sessionType: 'Primary', // Optional and string
//             hourSlot: 'OH', // Optional and string
//             goaSlotId: 4, // Optional and integer
//             sessionDate: new Date('2024-01-01'), // Optional but provided as a Date
//             createdAt: new Date(), // Optional but provided as a Date
//             updatedAt: new Date(), // Optional but provided as a Date
//             sessionPlannedAt: new Date('2024-01-01T10:00:00Z'), // Optional and Date
//             sessionEndAt: new Date('2024-01-01T11:00:00Z') // Optional and Date
//           }
//         ]);
//       // Mocking gOASlot with all required fields
//       jest.spyOn(prismaService.gOASlot, 'findFirst').mockResolvedValue({
//         id: 1, // Assuming id is a bigint
//         time_range_id: 5,
//         date_id: 2,
//         status: 'active',
//         created_at: new Date(),
//         updated_at: new Date()
//       });

//       // Mocking permanantSwap and sendSwappedDataToTSL
//       const mockPermanentSwap = jest
//         .spyOn(service, 'permanantSwap')
//         .mockResolvedValue([{ session_id: '123', tutor_id: BigInt(2) }]);

//       const mockSendSwappedData = jest
//         .spyOn(service, 'sendSwappedDataToTSL')
//         .mockResolvedValue(true);

//       // Invoke the method
//       const lastWorkingDay = moment().add(5, 'days').toISOString();
//       await service.swapTMS(lastWorkingDay, 1, 'category', 'reason');

//       // Assertions
//       expect(prismaService.tslUser.findFirst).toHaveBeenCalledWith({
//         where: { tsp_id: 1 },
//         select: { tsl_id: true }
//       });
//       expect(mockPermanentSwap).toHaveBeenCalled();
//       expect(mockSendSwappedData).toHaveBeenCalled();
//     });

//     // it('should handle a temporary and permanent swap when the last working day is 2 days away or sooner', async () => {
//     //   jest
//     //     .spyOn(prismaService.tslUser, 'findFirst')
//     //     .mockResolvedValue({ tsl_id: 1 });
//     //   jest
//     //     .spyOn(prismaService.goaTslBookedDetails, 'findMany')
//     //     .mockResolvedValue([
//     //       {
//     //         sessionDate: moment().toISOString(),
//     //         sessionId: 123,
//     //         studentId: 1,
//     //         goaSlotId: 2,
//     //         sessionType: 'Primary',
//     //         hourSlot: 'OH',
//     //         tutorId: 1
//     //       }
//     //     ]);
//     //   jest
//     //     .spyOn(prisma.gOASlot, 'findFirst')
//     //     .mockResolvedValue({ time_range_id: 5 });

//     //   const mockTempSwap = jest
//     //     .spyOn(service, 'tempSwap')
//     //     .mockResolvedValue([{ session_id: 123, tutor_id: 2 }]);

//     //   const mockPermanentSwap = jest
//     //     .spyOn(service, 'permanantSwap')
//     //     .mockResolvedValue([{ session_id: 123, tutor_id: 2 }]);

//     //   const mockSendSwappedData = jest
//     //     .spyOn(service, 'sendSwappedDataToTSL')
//     //     .mockResolvedValue(true);

//     //   const lastWorkingDay = moment().toISOString();
//     //   await service.swapTMS(lastWorkingDay, 1, 'category', 'reason');

//     //   expect(prisma.tslUser.findFirst).toHaveBeenCalledWith({
//     //     where: { tsp_id: 1 },
//     //     select: { tsl_id: true }
//     //   });
//     //   expect(mockTempSwap).toHaveBeenCalled();
//     //   expect(mockPermanentSwap).toHaveBeenCalled();
//     //   expect(mockSendSwappedData).toHaveBeenCalledTimes(2); // Temporary and Permanent swaps
//     // });

//     // it('should throw an error if no tutor is found', async () => {
//     //   jest.spyOn(prisma.tslUser, 'findFirst').mockResolvedValue(null);

//     //   const lastWorkingDay = moment().toISOString();

//     //   await expect(
//     //     service.swapTMS(lastWorkingDay, 1, 'category', 'reason')
//     //   ).rejects.toThrow('No tutor found for the given tspId');
//     // });
//   });
// });
