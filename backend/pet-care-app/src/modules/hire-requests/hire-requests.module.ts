import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HireRequestsService } from './hire-requests.service';
import { HireRequestsController } from './hire-requests.controller';
import { HireRequest } from './entities/hire-request.entity';
import { OwnerProfile } from '../owner/entities/owner.entity';
import { ProviderProfile } from '../provider/entities/provider.entity';
import { Pet } from '../pets/entities/pet.entity';
import { ProviderPetAssignment } from '../provider-pet-assignment/entities/provider-pet-assignment.entity';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HireRequest,
      OwnerProfile,
      ProviderProfile,
      Pet,
      ProviderPetAssignment,
    ]),
    MessageModule,
  ],
  controllers: [HireRequestsController],
  providers: [HireRequestsService],
  exports: [HireRequestsService],
})
export class HireRequestsModule {}
