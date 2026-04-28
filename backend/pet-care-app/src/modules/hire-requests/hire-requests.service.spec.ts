import { Test, TestingModule } from '@nestjs/testing';
import { HireRequestsService } from './hire-requests.service';

describe('HireRequestsService', () => {
  let service: HireRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HireRequestsService],
    }).compile();

    service = module.get<HireRequestsService>(HireRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
