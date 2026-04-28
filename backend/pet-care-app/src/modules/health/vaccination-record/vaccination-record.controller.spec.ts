import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationRecordController } from './vaccination-record.controller';
import { VaccinationRecordService } from './vaccination-record.service';

describe('VaccinationRecordController', () => {
  let controller: VaccinationRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccinationRecordController],
      providers: [VaccinationRecordService],
    }).compile();

    controller = module.get<VaccinationRecordController>(VaccinationRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
