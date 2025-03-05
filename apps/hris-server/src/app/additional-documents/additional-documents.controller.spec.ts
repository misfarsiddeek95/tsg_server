import { Test, TestingModule } from '@nestjs/testing';
import { AdditionalDocumentsController } from './additional-documents.controller';

describe('AdditionalDocumentsController', () => {
  let controller: AdditionalDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdditionalDocumentsController],
    }).compile();

    controller = module.get<AdditionalDocumentsController>(AdditionalDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
