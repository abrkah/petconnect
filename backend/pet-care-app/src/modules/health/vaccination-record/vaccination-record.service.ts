import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { VaccinationRecord } from './entities/vaccination-record.entity';
import { CreateVaccinationRecordDto } from './dto/create-vaccination-record.dto';
import { UpdateVaccinationRecordDto } from './dto/update-vaccination-record.dto';
import { Pet } from '../../pets/entities/pet.entity';
import { ProviderProfile } from '../../provider/entities/provider.entity';
import { ProviderPetAssignment } from '../../provider-pet-assignment/entities/provider-pet-assignment.entity';
import { UserRole } from '../../user/entities/user.entity';

@Injectable()
export class VaccinationRecordService {
  constructor(
    @InjectRepository(VaccinationRecord)
    private readonly repo: Repository<VaccinationRecord>,
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
    @InjectRepository(ProviderProfile)
    private readonly providerRepo: Repository<ProviderProfile>,
    @InjectRepository(ProviderPetAssignment)
    private readonly assignRepo: Repository<ProviderPetAssignment>,
  ) {}

  async listForPet(viewerId: string, role: UserRole, petId: string) {
    if (role === UserRole.OWNER) {
      const pet = await this.petRepo.findOne({
        where: { id: petId, owner: { user: { id: viewerId } } },
      });
      if (!pet) throw new NotFoundException('Pet not found');
      return this.repo
        .createQueryBuilder('v')
        .where('v.petId = :petId', { petId })
        .andWhere(
          new Brackets((qb) => {
            qb.where('v.addedByProviderId IS NULL').orWhere(
              'v.isApproved = true',
            );
          }),
        )
        .orderBy('v.vaccinationDate', 'DESC')
        .getMany();
    }

    if (role === UserRole.PROVIDER) {
      await this.ensureProviderPet(viewerId, petId);
      return this.repo.find({
        where: { pet: { id: petId } },
        relations: ['addedByProvider'],
        order: { vaccinationDate: 'DESC' },
      });
    }

    throw new ForbiddenException();
  }

  private async ensureProviderPet(providerUserId: string, petId: string) {
    const ok = await this.assignRepo.findOne({
      where: {
        pet: { id: petId },
        isActive: true,
        provider: { user: { id: providerUserId } },
      },
    });
    if (!ok) throw new ForbiddenException('No access to this pet');
  }

  async create(viewerId: string, role: UserRole, dto: CreateVaccinationRecordDto) {
    const pet = await this.petRepo.findOne({
      where: { id: dto.petId },
      relations: ['owner', 'owner.user'],
    });
    if (!pet) throw new NotFoundException('Pet not found');

    if (role === UserRole.OWNER) {
      if (pet.owner.user.id !== viewerId) throw new ForbiddenException();
      const row = this.repo.create({
        pet,
        vaccineName: dto.vaccineName,
        vaccinationDate: new Date(dto.vaccinationDate),
        nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
        isApproved: true,
        addedByProvider: null,
      });
      return this.repo.save(row);
    }

    if (role === UserRole.PROVIDER) {
      await this.ensureProviderPet(viewerId, dto.petId);
      const provider = await this.providerRepo.findOne({
        where: { user: { id: viewerId } },
      });
      if (!provider) throw new BadRequestException('Provider profile missing');
      const row = this.repo.create({
        pet,
        vaccineName: dto.vaccineName,
        vaccinationDate: new Date(dto.vaccinationDate),
        nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
        isApproved: false,
        addedByProvider: provider,
      });
      return this.repo.save(row);
    }

    throw new ForbiddenException();
  }

  async update(
    viewerId: string,
    role: UserRole,
    id: string,
    dto: UpdateVaccinationRecordDto,
  ) {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['pet', 'pet.owner', 'pet.owner.user', 'addedByProvider', 'addedByProvider.user'],
    });
    if (!row) throw new NotFoundException('Record not found');

    if (role === UserRole.OWNER) {
      if (row.pet.owner.user.id !== viewerId) throw new ForbiddenException();
      if (row.addedByProvider) {
        throw new ForbiddenException('Cannot edit provider records');
      }
      if (dto.vaccineName != null) row.vaccineName = dto.vaccineName;
      if (dto.vaccinationDate != null) {
        row.vaccinationDate = new Date(dto.vaccinationDate);
      }
      if (dto.nextDueDate !== undefined) {
        row.nextDueDate = dto.nextDueDate
          ? new Date(dto.nextDueDate)
          : null;
      }
      return this.repo.save(row);
    }

    if (role === UserRole.PROVIDER) {
      await this.ensureProviderPet(viewerId, row.pet.id);
      if (!row.addedByProvider || row.addedByProvider.user.id !== viewerId) {
        throw new ForbiddenException('Can only edit your own entries');
      }
      if (dto.vaccineName != null) row.vaccineName = dto.vaccineName;
      if (dto.vaccinationDate != null) {
        row.vaccinationDate = new Date(dto.vaccinationDate);
      }
      if (dto.nextDueDate !== undefined) {
        row.nextDueDate = dto.nextDueDate
          ? new Date(dto.nextDueDate)
          : null;
      }
      return this.repo.save(row);
    }

    throw new ForbiddenException();
  }

  async approve(viewerId: string, id: string) {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['pet', 'addedByProvider', 'addedByProvider.user'],
    });
    if (!row) throw new NotFoundException('Record not found');
    if (!row.addedByProvider) {
      throw new BadRequestException('Nothing to approve');
    }
    if (row.addedByProvider.user.id !== viewerId) {
      throw new ForbiddenException();
    }
    await this.ensureProviderPet(viewerId, row.pet.id);
    row.isApproved = true;
    return this.repo.save(row);
  }

  async remove(viewerId: string, role: UserRole, id: string) {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['pet', 'pet.owner', 'pet.owner.user', 'addedByProvider', 'addedByProvider.user'],
    });
    if (!row) throw new NotFoundException('Record not found');

    if (role === UserRole.OWNER) {
      if (row.pet.owner.user.id !== viewerId) throw new ForbiddenException();
      if (row.addedByProvider) {
        throw new ForbiddenException('Cannot delete provider records');
      }
      await this.repo.remove(row);
      return { deleted: true };
    }

    if (role === UserRole.PROVIDER) {
      await this.ensureProviderPet(viewerId, row.pet.id);
      if (!row.addedByProvider || row.addedByProvider.user.id !== viewerId) {
        throw new ForbiddenException();
      }
      await this.repo.remove(row);
      return { deleted: true };
    }

    throw new ForbiddenException();
  }
}
