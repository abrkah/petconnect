import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightRecordService } from './weight-record.service';
import { WeightRecordController } from './weight-record.controller';
import { WeightRecord } from './entities/weight-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeightRecord])],
  controllers: [WeightRecordController],
  providers: [WeightRecordService],
  exports: [WeightRecordService],
})
export class WeightRecordModule {}
