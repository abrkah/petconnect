import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { VaccinationRecordModule } from './vaccination-record/vaccination-record.module';
import { WeightRecordModule } from './weight-record/weight-record.module';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
  imports: [VaccinationRecordModule, WeightRecordModule]
})
export class HealthModule {}
