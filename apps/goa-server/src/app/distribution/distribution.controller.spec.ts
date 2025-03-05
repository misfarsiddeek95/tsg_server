import { Test, TestingModule } from '@nestjs/testing';
import { DistributionController } from './distribution.controller';
import { DistributionService } from './distribution.service';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if necessary
import { SlotsService } from '../slots/slots.service';
import { UserService } from '../user/service/user.service';

describe('DistributionController', () => {
  let controller: DistributionController;
  let distributionService: DistributionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistributionController],
      providers: [
        DistributionService,
        {
          provide: PrismaService,
          useValue: {
            // mock PrismaService methods if necessary
          }
        },
        {
          provide: SlotsService,
          useValue: {
            // mock SlotsService methods if necessary
          }
        },
        {
          provide: UserService,
          useValue: {
            // mock UserService methods if necessary
          }
        }
      ]
    }).compile();

    controller = module.get<DistributionController>(DistributionController);
    distributionService = module.get<DistributionService>(DistributionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
