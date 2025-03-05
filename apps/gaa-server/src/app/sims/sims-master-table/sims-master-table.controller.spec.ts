import { Test, TestingModule } from '@nestjs/testing';
import { SimsMasterTableController } from './sims-master-table.controller';
import { SimsMasterTableService } from './sims-master-table.service';

describe('SimsMasterTableController', () => {
  let controller: SimsMasterTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimsMasterTableController],
      providers: [SimsMasterTableService],
    }).compile();

    controller = module.get<SimsMasterTableController>(SimsMasterTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
