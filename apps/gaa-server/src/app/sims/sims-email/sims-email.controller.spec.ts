import { Test, TestingModule } from '@nestjs/testing';
import { SimsEmailController } from './sims-email.controller';
import { SimsEmailService } from './sims-email.service';

describe('SimsEmailController', () => {
  let controller: SimsEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimsEmailController],
      providers: [SimsEmailService],
    }).compile();

    controller = module.get<SimsEmailController>(SimsEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
