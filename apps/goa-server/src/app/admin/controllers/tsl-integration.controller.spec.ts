import { Test, TestingModule } from '@nestjs/testing';
import { TslIntegrationController } from './tsl-integration.controller';

describe('TslIntegrationController', () => {
  let controller: TslIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TslIntegrationController]
    }).compile();

    controller = module.get<TslIntegrationController>(TslIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
