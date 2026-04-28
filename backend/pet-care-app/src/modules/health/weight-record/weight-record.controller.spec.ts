import { Test, TestingModule } from '@nestjs/testing';
import { WeightRecordController } from './weight-record.controller';
import { WeightRecordService } from './weight-record.service';

describe('WeightRecordController', () => {
  let controller: WeightRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeightRecordController],
      providers: [WeightRecordService],
    }).compile();

    controller = module.get<WeightRecordController>(WeightRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
