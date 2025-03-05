import { Test, TestingModule } from '@nestjs/testing';
import { ContractDetailsController } from './contract-details.controller';

describe('ContractDetailsController', () => {
  let controller: ContractDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractDetailsController],
    }).compile();

    controller = module.get<ContractDetailsController>(ContractDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
