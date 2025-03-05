import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { PrismaService } from '../../prisma.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationService, PrismaService]
    }).compile();

    service = module.get<ValidationService>(ValidationService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get Validation Rules for Event Type', () => {
    const request = {
      eventId: 1
    };

    const response = {
      eventId: 1,
      eventType: 'PI',
      candidateEditBtnTime: 10,
      candidateJoinBtnTime: 10,
      candidateRescheduleLimit: 2,
      candidateSlotBookingBtnTime: 15,
      interviewerCheckBtnTime: 10,
      interviewerSlotAvailableBtnTime: 5
    };

    it('Should Return Correct Validations for event type', async () => {
      jest
        .spyOn(prisma.appointmentTypeRef, 'findFirst')
        .mockResolvedValue(response as any);

      const result = await service.getValidationRules();

      expect(result).toEqual({ success: true, data: response });
    });
  });
});
