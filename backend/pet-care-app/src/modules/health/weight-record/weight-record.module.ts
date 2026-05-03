import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightRecordService } from './weight-record.service';
import { WeightRecordController } from './weight-record.controller';
import { WeightRecord } from './entities/weight-record.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { ProviderProfile } from '../../provider/entities/provider.entity';
import { ProviderPetAssignment } from '../../provider-pet-assignment/entities/provider-pet-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WeightRecord,
      Pet,
      ProviderProfile,
      ProviderPetAssignment,
    ]),
  ],
  controllers: [WeightRecordController],
  providers: [WeightRecordService],
  exports: [WeightRecordService],
})
export class WeightRecordModule {}
