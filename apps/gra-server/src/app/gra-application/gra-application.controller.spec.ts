import { Test, TestingModule } from '@nestjs/testing';
import { GraApplicationController } from './gra-application.controller';

describe('GraApplicationController', () => {
  let controller: GraApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraApplicationController]
    }).compile();

    controller = module.get<GraApplicationController>(GraApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
