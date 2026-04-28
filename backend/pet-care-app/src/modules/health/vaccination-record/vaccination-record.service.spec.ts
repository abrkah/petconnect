import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationRecordService } from './vaccination-record.service';

describe('VaccinationRecordService', () => {
  let service: VaccinationRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaccinationRecordService],
    }).compile();

    service = module.get<VaccinationRecordService>(VaccinationRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
