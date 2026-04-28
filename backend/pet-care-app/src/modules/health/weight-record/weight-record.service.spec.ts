import { Test, TestingModule } from '@nestjs/testing';
import { WeightRecordService } from './weight-record.service';

describe('WeightRecordService', () => {
  let service: WeightRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeightRecordService],
    }).compile();

    service = module.get<WeightRecordService>(WeightRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
