import { Test, TestingModule } from '@nestjs/testing';
import { SimsUserAccessController } from './sims-user-access.controller';
import { SimsUserAccessService } from './sims-user-access.service';

describe('SimsUserAccessController', () => {
  let controller: SimsUserAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimsUserAccessController],
      providers: [SimsUserAccessService],
    }).compile();

    controller = module.get<SimsUserAccessController>(SimsUserAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
