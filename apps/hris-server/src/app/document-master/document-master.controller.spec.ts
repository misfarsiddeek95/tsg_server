import { Test, TestingModule } from '@nestjs/testing';
import { DocumentMasterController } from './document-master.controller';

describe('DocumentMasterController', () => {
  let controller: DocumentMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentMasterController],
    }).compile();

    controller = module.get<DocumentMasterController>(DocumentMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
