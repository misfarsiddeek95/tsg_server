import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from '../../prisma.service';
import { HttpException } from '@nestjs/common';
import { rejects } from 'assert';

describe('EventService', () => {
  let service: EventService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, PrismaService]
    }).compile();

    service = module.get<EventService>(EventService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Check create event function', () => {
    const details = {
      type: 'PIN',
      event_title: 'Phone Interview New',
      duration: 50,
      description: 'This is Phone Interview New'
    };

    const lastIndex = {
      id: 1,
      type: 'PI',
      event_title: 'Phone Interview',
      created_by: 1,
      event_duration: 40,
      event_description: 'This is Phone Interview',
      enabled: 1
    };

    const response = {
      id: 2,
      type: 'PIN',
      event_title: 'Phone Interview New',
      created_by: 1,
      event_duration: 50,
      event_description: 'This is Phone Interview New',
      enabled: 1
    };

    it('should be created successfully', async () => {
      jest
        .spyOn(prisma.appointmentTypeRef, 'findFirst')
        .mockResolvedValue(lastIndex as any);

      jest
        .spyOn(prisma.appointmentTypeRef, 'create')
        .mockResolvedValue(response as any);

      const result = await service.createEventType({
        details: details,
        userId: 1
      });

      expect(result).toEqual({ success: true, data: response });
    });

    it('should be failed', async () => {
      jest
        .spyOn(prisma.appointmentTypeRef, 'findFirst')
        .mockRejectedValue(null);
      try {
        await service.createEventType({
          details: details,
          userId: 1
        });
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Http Exception');
      }
    });
  });

  describe('Allocate users to events', () => {
    const request = {
      userId: 1,
      appointmentType: 1
    };

    const response = {
      user_id: 1,
      appointment_type: 1,
      status: 1,
      created_by: 2
    };

    const error = {
      message: 'User not found'
    };

    it('Should be assign user successfully', async () => {
      jest
        .spyOn(prisma.interviewerAppointmentTypeRef, 'create')
        .mockResolvedValue(response as any);

      const result = await service.allocateUsersToEvents({
        details: request,
        userId: 2
      });

      expect(result).toEqual({ success: true, response });
    });

    it('Should not assign user to events', async () => {
      jest
        .spyOn(prisma.interviewerAppointmentTypeRef, 'create')
        .mockRejectedValue(error);

      try {
        await service.allocateUsersToEvents({
          details: request,
          userId: 2
        });
        // If the above line doesn't throw an error, fail the test
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Http Exception');
      }
    });
  });
});
