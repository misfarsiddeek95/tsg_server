import { Test, TestingModule } from '@nestjs/testing';
import { AdditionalDocumentsTbController } from './additional-documents-tb.controller';

describe('AdditionalDocumentsTbController', () => {
  let controller: AdditionalDocumentsTbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdditionalDocumentsTbController],
    }).compile();

    controller = module.get<AdditionalDocumentsTbController>(AdditionalDocumentsTbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
