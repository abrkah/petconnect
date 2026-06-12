import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { OwnerProfile } from '../owner/entities/owner.entity';
import { ProviderPetAssignment } from '../provider-pet-assignment/entities/provider-pet-assignment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { VaccinationRecord } from '../health/vaccination-record/entities/vaccination-record.entity';
import { WeightRecord } from '../health/weight-record/entities/weight-record.entity';
import { PetNote } from '../pet-notes/entities/pet-note.entity';
import { FileService } from '../common/file.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
    @InjectRepository(OwnerProfile)
    private readonly ownerRepo: Repository<OwnerProfile>,
    @InjectRepository(ProviderPetAssignment)
    private readonly assignRepo: Repository<ProviderPetAssignment>,
    private readonly fileService: FileService,
  ) {}

  private photoUrlFromFile(file: Express.Multer.File): string {
    const filename = this.fileService.saveFile(file, 'pets');
    return `/uploads/pets/${filename}`;
  }

  private async ownerProfileFor(userId: string) {
    const owner = await this.ownerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!owner) throw new BadRequestException('Complete owner onboarding first');
    return owner;
  }

  async createForOwner(
    userId: string,
    dto: CreatePetDto,
    photo?: Express.Multer.File,
  ) {
    const owner = await this.ownerProfileFor(userId);
    const pet = this.petRepo.create({
      ...dto,
      owner,
      photoUrl: photo ? this.photoUrlFromFile(photo) : undefined,
    });
    const saved = await this.petRepo.save(pet);
    return {
      message: `${saved.name} was added successfully`,
      pet: saved,
    };
  }

  async findAllForOwner(userId: string) {
    const owner = await this.ownerProfileFor(userId);
    return this.petRepo.find({
      where: { owner: { id: owner.id } },
      order: { name: 'ASC' },
    });
  }

  async findOneForOwner(userId: string, petId: string) {
    const owner = await this.ownerProfileFor(userId);
    const pet = await this.petRepo.findOne({
      where: { id: petId, owner: { id: owner.id } },
      relations: ['owner'],
    });
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  async updateForOwner(
    userId: string,
    petId: string,
    dto: UpdatePetDto,
    photo?: Express.Multer.File,
  ) {
    const pet = await this.findOneForOwner(userId, petId);
    Object.assign(pet, dto);
    if (photo) {
      pet.photoUrl = this.photoUrlFromFile(photo);
    }
    const saved = await this.petRepo.save(pet);
    return {
      message: `${saved.name} was updated successfully`,
      pet: saved,
    };
  }

  async removeForOwner(userId: string, petId: string) {
    const pet = await this.findOneForOwner(userId, petId);
    const name = pet.name;

    await this.petRepo.manager.transaction(async (em) => {
      await em.delete(Booking, { pet: { id: petId } });
      await em.delete(VaccinationRecord, { pet: { id: petId } });
      await em.delete(WeightRecord, { pet: { id: petId } });
      await em.delete(PetNote, { pet: { id: petId } });
      await em.delete(ProviderPetAssignment, { pet: { id: petId } });
      await em.delete(Pet, { id: petId });
    });

    return { message: `${name} was deleted successfully`, deleted: true };
  }

  async findManagedForProvider(userId: string) {
    const rows = await this.assignRepo.find({
      where: {
        isActive: true,
        provider: { user: { id: userId } },
      },
      relations: ['pet', 'pet.owner', 'owner'],
    });
    return rows.map((r) => ({
      assignmentId: r.id,
      pet: r.pet,
      owner: r.owner,
    }));
  }

  async ensureOwnerPet(userId: string, petId: string) {
    return this.findOneForOwner(userId, petId);
  }

  async getAssignedPet(userId: string, petId: string) {
    const pet = await this.ensureProviderCanAccessPet(userId, petId);
    return this.petRepo.findOne({
      where: { id: pet.id },
      relations: ['owner', 'assignments'],
    });
  }

  async ensureProviderCanAccessPet(userId: string, petId: string) {
    const row = await this.assignRepo.findOne({
      where: {
        pet: { id: petId },
        isActive: true,
        provider: { user: { id: userId } },
      },
      relations: ['pet', 'provider'],
    });
    if (!row) throw new ForbiddenException('Not assigned to this pet');
    return row.pet;
  }
}
