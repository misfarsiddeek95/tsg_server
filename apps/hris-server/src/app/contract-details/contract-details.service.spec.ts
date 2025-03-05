import { Test, TestingModule } from "@nestjs/testing";
import { ContractDetailsService } from "./contract-details.service";

describe("ContractDetailsService", () => {
  let service: ContractDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractDetailsService],
    }).compile();

    service = module.get<ContractDetailsService>(ContractDetailsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
