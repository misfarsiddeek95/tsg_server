import { Test, TestingModule } from '@nestjs/testing';
import { NewEmailController } from './new-email.controller';
import { NewEmailService } from './new-email.service';

describe('NewEmailController', () => {
  let controller: NewEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewEmailController],
      providers: [NewEmailService],
    }).compile();

    controller = module.get<NewEmailController>(NewEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
