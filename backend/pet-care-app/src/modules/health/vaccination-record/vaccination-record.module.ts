import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinationRecordService } from './vaccination-record.service';
import { VaccinationRecordController } from './vaccination-record.controller';
import { VaccinationRecord } from './entities/vaccination-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VaccinationRecord])],
  controllers: [VaccinationRecordController],
  providers: [VaccinationRecordService],
  exports: [VaccinationRecordService],
})
export class VaccinationRecordModule {}
