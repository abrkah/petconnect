import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { OwnerProfile } from '../owner/entities/owner.entity';
import { ProviderProfile } from '../provider/entities/provider.entity';
import { Pet } from '../pets/entities/pet.entity';
import { HireRequestsModule } from '../hire-requests/hire-requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      OwnerProfile,
      ProviderProfile,
      Pet,
    ]),
    HireRequestsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
