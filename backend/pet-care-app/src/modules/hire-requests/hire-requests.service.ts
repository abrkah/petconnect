import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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
import { ChatGateway } from '../message/chat.gateway';

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
    private readonly chatGateway: ChatGateway,
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
      message: dto.message?.trim() || null,
      status: HireStatus.PENDING,
    });
    const saved = await this.hireRepo.save(hire);

    const providerWithUser = await this.providerRepo.findOne({
      where: { id: provider.id },
      relations: ['user'],
    });
    if (providerWithUser?.user) {
      const pendingCount = await this.countPendingForProvider(provider.id);
      this.chatGateway.emitHirePending(providerWithUser.user.id, {
        pendingCount,
      });
    }

    return saved;
  }

  private async countPendingForProvider(providerId: string): Promise<number> {
    return this.hireRepo.count({
      where: {
        provider: { id: providerId },
        status: HireStatus.PENDING,
      },
    });
  }

  async providerNotifications(providerUserId: string) {
    const provider = await this.providerRepo.findOne({
      where: { user: { id: providerUserId } },
    });
    if (!provider) return { total: 0, items: [] };

    const pending = await this.hireRepo.find({
      where: { provider: { id: provider.id }, status: HireStatus.PENDING },
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });

    return {
      total: pending.length,
      items: pending.map((hire) => this.toProviderNotificationItem(hire)),
    };
  }

  async ownerNotifications(ownerUserId: string) {
    const owner = await this.ownerRepo.findOne({
      where: { user: { id: ownerUserId } },
    });
    if (!owner) return { total: 0, items: [] };

    const unread = await this.hireRepo.find({
      where: {
        owner: { id: owner.id },
        status: HireStatus.REJECTED,
        decidedByRole: UserRole.PROVIDER,
        ownerSeenAt: IsNull(),
      },
      relations: ['provider'],
      order: { updatedAt: 'DESC' },
    });

    return {
      total: unread.length,
      items: unread.map((hire) => this.toOwnerNotificationItem(hire)),
    };
  }

  private async countUnreadOwnerRejections(ownerId: string): Promise<number> {
    return this.hireRepo.count({
      where: {
        owner: { id: ownerId },
        status: HireStatus.REJECTED,
        decidedByRole: UserRole.PROVIDER,
        ownerSeenAt: IsNull(),
      },
    });
  }

  private toProviderNotificationItem(hire: HireRequest) {
    return {
      id: hire.id,
      ownerFullName: hire.owner.fullName,
      message: hire.message,
      petCount: hire.petIds?.length ?? 0,
      createdAt:
        hire.createdAt instanceof Date
          ? hire.createdAt.toISOString()
          : String(hire.createdAt),
    };
  }

  private toOwnerNotificationItem(hire: HireRequest) {
    return {
      id: hire.id,
      providerFullName: hire.provider.fullName,
      status: hire.status,
      message: hire.message,
      responseMessage: hire.responseMessage,
      petCount: hire.petIds?.length ?? 0,
      updatedAt:
        hire.updatedAt instanceof Date
          ? hire.updatedAt.toISOString()
          : String(hire.updatedAt),
    };
  }

  async markOwnerSeen(ownerUserId: string, hireId: string) {
    const owner = await this.ownerRepo.findOne({
      where: { user: { id: ownerUserId } },
    });
    if (!owner) throw new BadRequestException('Owner profile required');

    const hire = await this.hireRepo.findOne({
      where: { id: hireId, owner: { id: owner.id } },
      relations: ['owner', 'owner.user'],
    });
    if (!hire) throw new NotFoundException('Hire request not found');

    if (!hire.ownerSeenAt) {
      hire.ownerSeenAt = new Date();
      await this.hireRepo.save(hire);
      const unreadCount = await this.countUnreadOwnerRejections(owner.id);
      this.chatGateway.emitHireOwnerUpdate(ownerUserId, { unreadCount });
    }

    return hire;
  }

  async ownerHasApprovedHire(
    ownerUserId: string,
    providerId: string,
  ): Promise<boolean> {
    const owner = await this.ownerRepo.findOne({
      where: { user: { id: ownerUserId } },
    });
    if (!owner) return false;

    const approved = await this.hireRepo.findOne({
      where: {
        owner: { id: owner.id },
        provider: { id: providerId },
        status: HireStatus.APPROVED,
      },
    });
    return !!approved;
  }

  async requireApprovedHire(ownerUserId: string, providerId: string) {
    const ok = await this.ownerHasApprovedHire(ownerUserId, providerId);
    if (!ok) {
      throw new BadRequestException(
        'You must be hired by this provider before booking. Send a hire request and wait for approval.',
      );
    }
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
      if (dto.responseMessage !== undefined) {
        hire.responseMessage = dto.responseMessage.trim() || null;
      }
      hire.decidedByRole = UserRole.PROVIDER;
      if (dto.status === HireStatus.REJECTED) {
        hire.ownerSeenAt = null;
      }
      await this.hireRepo.save(hire);
      if (dto.status === HireStatus.APPROVED) {
        await this.activateAssignments(hire);
      }
      const pendingCount = await this.countPendingForProvider(hire.provider.id);
      this.chatGateway.emitHirePending(hire.provider.user.id, { pendingCount });
      if (dto.status === HireStatus.REJECTED) {
        const unreadCount = await this.countUnreadOwnerRejections(hire.owner.id);
        this.chatGateway.emitHireOwnerUpdate(hire.owner.user.id, {
          unreadCount,
        });
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
      hire.decidedByRole = UserRole.OWNER;
      await this.hireRepo.save(hire);
      return hire;
    }

    throw new ForbiddenException();
  }
}
