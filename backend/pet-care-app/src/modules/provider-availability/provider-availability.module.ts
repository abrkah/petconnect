import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderAvailability } from './entities/provider-availability.entity';
import { ProviderAvailabilityService } from './provider-availability.service';
import { ProviderAvailabilityController } from './provider-availability.controller';
import { ProviderProfile } from '../provider/entities/provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProviderAvailability, ProviderProfile])],
  controllers: [ProviderAvailabilityController],
  providers: [ProviderAvailabilityService],
})
export class ProviderAvailabilityModule {}
