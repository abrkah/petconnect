import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  HireRequest,
  HireStatus,
} from './entities/hire-request.entity';
import { CreateHireRequestDto } from './dto/create-hire-request.dto';
import { UpdateHireRequestDto } from './dto/update-hire-request.dto';
import { OwnerProfile } from '../owner/entities/owner.entity';
import { ProviderProfile } from '../provider/entities/provider.entity';
import { Pet } from '../pets/entities/pet.entity';
import { ProviderPetAssignment } from '../provider-pet-assignment/entities/provider-pet-assignment.entity';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class HireRequestsService {
  constructor(
    @InjectRepository(HireRequest)
    private readonly hireRepo: Repository<HireRequest>,
    @InjectRepository(OwnerProfile)
    private readonly ownerRepo: Repository<OwnerProfile>,
    @InjectRepository(ProviderProfile)
    private readonly providerRepo: Repository<ProviderProfile>,
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
    @InjectRepository(ProviderPetAssignment)
    private readonly assignRepo: Repository<ProviderPetAssignment>,
  ) {}

  async create(ownerUserId: string, dto: CreateHireRequestDto) {
    const owner = await this.ownerRepo.findOne({
      where: { user: { id: ownerUserId } },
    });
    if (!owner) throw new BadRequestException('Owner profile required');

    const provider = await this.providerRepo.findOne({
      where: { id: dto.providerId },
    });
    if (!provider) throw new NotFoundException('Provider not found');

    for (const petId of dto.petIds) {
      const pet = await this.petRepo.findOne({
        where: { id: petId, owner: { id: owner.id } },
      });
      if (!pet) {
        throw new BadRequestException(`Invalid pet ${petId}`);
      }
    }

    const hire = this.hireRepo.create({
      owner,
      provider,
      petIds: dto.petIds,
      status: HireStatus.PENDING,
    });
    return this.hireRepo.save(hire);
  }

  async listFor(userId: string, role: UserRole) {
    if (role === UserRole.OWNER) {
      const owner = await this.ownerRepo.findOne({
        where: { user: { id: userId } },
      });
      if (!owner) return [];
      return this.hireRepo.find({
        where: { owner: { id: owner.id } },
        relations: ['provider', 'owner'],
        order: { createdAt: 'DESC' },
      });
    }
    const provider = await this.providerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!provider) return [];
    return this.hireRepo.find({
      where: { provider: { id: provider.id } },
      relations: ['owner', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  private async activateAssignments(hire: HireRequest) {
    const full = await this.hireRepo.findOne({
      where: { id: hire.id },
      relations: ['owner', 'provider'],
    });
    if (!full) return;
    const ids = full.petIds ?? [];
    for (const petId of ids) {
      const pet = await this.petRepo.findOne({
        where: { id: petId, owner: { id: full.owner.id } },
      });
      if (!pet) continue;
      let row = await this.assignRepo.findOne({
        where: {
          pet: { id: petId },
          provider: { id: full.provider.id },
        },
      });
      if (row) {
        row.isActive = true;
        row.hireRequest = full;
        await this.assignRepo.save(row);
      } else {
        await this.assignRepo.save(
          this.assignRepo.create({
            pet,
            provider: full.provider,
            owner: full.owner,
            hireRequest: full,
            isActive: true,
          }),
        );
      }
    }
  }

  async updateRequest(
    userId: string,
    role: UserRole,
    id: string,
    dto: UpdateHireRequestDto,
  ) {
    const hire = await this.hireRepo.findOne({
      where: { id },
      relations: ['owner', 'owner.user', 'provider', 'provider.user'],
    });
    if (!hire) throw new NotFoundException('Hire request not found');

    if (role === UserRole.PROVIDER) {
      if (hire.provider.user.id !== userId) throw new ForbiddenException();
      if (hire.status !== HireStatus.PENDING) {
        throw new BadRequestException('Request is no longer pending');
      }
      if (
        dto.status !== HireStatus.APPROVED &&
        dto.status !== HireStatus.REJECTED
      ) {
        throw new BadRequestException('Invalid status');
      }
      hire.status = dto.status;
      await this.hireRepo.save(hire);
      if (dto.status === HireStatus.APPROVED) {
        await this.activateAssignments(hire);
      }
      return hire;
    }

    if (role === UserRole.OWNER) {
      if (hire.owner.user.id !== userId) throw new ForbiddenException();
      if (hire.status !== HireStatus.PENDING) {
        throw new BadRequestException('Cannot modify');
      }
      if (dto.status !== HireStatus.REJECTED) {
        throw new BadRequestException('Owners can only cancel with REJECTED');
      }
      hire.status = HireStatus.REJECTED;
      await this.hireRepo.save(hire);
      return hire;
    }

    throw new ForbiddenException();
  }
}
