import { Test, TestingModule } from '@nestjs/testing';
import { MasterViewController } from './master-view.controller';

describe('MasterViewController', () => {
  let controller: MasterViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterViewController],
    }).compile();

    controller = module.get<MasterViewController>(MasterViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
