import { Test, TestingModule } from '@nestjs/testing';
import { AdminSidebarController } from './admin-sidebar.controller';

describe('AdminSidebarController', () => {
  let controller: AdminSidebarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSidebarController],
    }).compile();

    controller = module.get<AdminSidebarController>(AdminSidebarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
