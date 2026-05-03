import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinationRecordService } from './vaccination-record.service';
import { VaccinationRecordController } from './vaccination-record.controller';
import { VaccinationRecord } from './entities/vaccination-record.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { ProviderProfile } from '../../provider/entities/provider.entity';
import { ProviderPetAssignment } from '../../provider-pet-assignment/entities/provider-pet-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VaccinationRecord,
      Pet,
      ProviderProfile,
      ProviderPetAssignment,
    ]),
  ],
  controllers: [VaccinationRecordController],
  providers: [VaccinationRecordService],
  exports: [VaccinationRecordService],
})
export class VaccinationRecordModule {}
