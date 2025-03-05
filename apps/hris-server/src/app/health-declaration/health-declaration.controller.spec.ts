import { Test, TestingModule } from '@nestjs/testing';
import { HealthDeclarationController } from './health-declaration.controller';

describe('HealthDeclarationController', () => {
  let controller: HealthDeclarationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthDeclarationController],
    }).compile();

    controller = module.get<HealthDeclarationController>(HealthDeclarationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
