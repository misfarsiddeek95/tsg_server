import { Test, TestingModule } from '@nestjs/testing';
import { SimsTicketFormController } from './sims-ticket-form.controller';
import { SimsTicketFormService } from './sims-ticket-form.service';

describe('SimsTicketFormController', () => {
  let controller: SimsTicketFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimsTicketFormController],
      providers: [SimsTicketFormService],
    }).compile();

    controller = module.get<SimsTicketFormController>(SimsTicketFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
