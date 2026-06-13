import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { OwnerProfile } from '../owner/entities/owner.entity';
import { ProviderProfile } from '../provider/entities/provider.entity';
import { Pet } from '../pets/entities/pet.entity';
import { UserRole } from '../user/entities/user.entity';
import { HireRequestsService } from '../hire-requests/hire-requests.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(OwnerProfile)
    private readonly ownerRepo: Repository<OwnerProfile>,
    @InjectRepository(ProviderProfile)
    private readonly providerRepo: Repository<ProviderProfile>,
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
    private readonly hireRequestsService: HireRequestsService,
  ) {}

  private async ownerEntity(userId: string) {
    const o = await this.ownerRepo.findOne({ where: { user: { id: userId } } });
    if (!o) throw new BadRequestException('Owner profile required');
    return o;
  }

  private async providerEntity(userId: string) {
    const p = await this.providerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!p) throw new BadRequestException('Provider profile required');
    return p;
  }

  async createForOwner(userId: string, dto: CreateBookingDto) {
    const owner = await this.ownerEntity(userId);
    const pet = await this.petRepo.findOne({
      where: { id: dto.petId, owner: { id: owner.id } },
    });
    if (!pet) throw new NotFoundException('Pet not found');

    const provider = await this.providerRepo.findOne({
      where: { id: dto.providerId },
    });
    if (!provider) throw new NotFoundException('Provider not found');

    await this.hireRequestsService.requireApprovedHire(userId, dto.providerId);

    const booking = this.bookingRepo.create({
      owner,
      provider,
      pet,
      serviceType: dto.serviceType,
      startDate: dto.startDate,
      endDate: dto.endDate,
      timeSlot: dto.timeSlot ?? null,
      status: BookingStatus.PENDING,
    });
    return this.bookingRepo.save(booking);
  }

  async listForUser(userId: string, role: UserRole) {
    if (role === UserRole.OWNER) {
      const owner = await this.ownerEntity(userId);
      return this.bookingRepo.find({
        where: { owner: { id: owner.id } },
        relations: ['provider', 'pet', 'owner'],
        order: { startDate: 'DESC' },
      });
    }
    const provider = await this.providerEntity(userId);
    return this.bookingRepo.find({
      where: { provider: { id: provider.id } },
      relations: ['owner', 'pet', 'provider'],
      order: { startDate: 'DESC' },
    });
  }

  async updateBooking(
    userId: string,
    role: UserRole,
    id: string,
    dto: UpdateBookingDto,
  ) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['owner', 'owner.user', 'provider', 'provider.user', 'pet'],
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (role === UserRole.OWNER) {
      if (booking.owner.user.id !== userId) {
        throw new ForbiddenException();
      }
      if (dto.status && dto.status !== BookingStatus.PENDING) {
        throw new ForbiddenException('Owners cannot set this status');
      }
    } else if (role === UserRole.PROVIDER) {
      if (booking.provider.user.id !== userId) {
        throw new ForbiddenException();
      }
    }

    const { petId, providerId, serviceType, startDate, endDate, timeSlot, status } =
      dto;

    if (petId) {
      const pet = await this.petRepo.findOne({
        where: { id: petId, owner: { id: booking.owner.id } },
      });
      if (!pet) throw new NotFoundException('Pet not found');
      booking.pet = pet;
    }

    if (providerId) {
      const provider = await this.providerRepo.findOne({
        where: { id: providerId },
      });
      if (!provider) throw new NotFoundException('Provider not found');
      if (role === UserRole.OWNER) {
        await this.hireRequestsService.requireApprovedHire(userId, providerId);
      }
      booking.provider = provider;
    }

    if (serviceType != null) booking.serviceType = serviceType;
    if (startDate != null) booking.startDate = startDate;
    if (endDate != null) booking.endDate = endDate;
    if (timeSlot !== undefined) booking.timeSlot = timeSlot ?? null;
    if (status != null) booking.status = status;

    const saved = await this.bookingRepo.save(booking);
    return {
      message: 'Booking updated successfully',
      booking: saved,
    };
  }

  async remove(userId: string, role: UserRole, id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['owner', 'owner.user', 'provider', 'provider.user'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (role === UserRole.OWNER && booking.owner.user.id !== userId) {
      throw new ForbiddenException();
    }
    if (role === UserRole.PROVIDER && booking.provider.user.id !== userId) {
      throw new ForbiddenException();
    }
    await this.bookingRepo.remove(booking);
    return { deleted: true };
  }
}
