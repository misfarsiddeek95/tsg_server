import { Test, TestingModule } from '@nestjs/testing';
import { SimsTicketFormService } from './sims-ticket-form.service';

describe('SimsTicketFormService', () => {
  let service: SimsTicketFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimsTicketFormService],
    }).compile();

    service = module.get<SimsTicketFormService>(SimsTicketFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
