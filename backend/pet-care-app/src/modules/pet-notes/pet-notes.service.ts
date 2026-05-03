import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetNote } from './entities/pet-note.entity';
import { CreatePetNoteDto } from './dto/create-pet-note.dto';
import { Pet } from '../pets/entities/pet.entity';

@Injectable()
export class PetNotesService {
  constructor(
    @InjectRepository(PetNote)
    private readonly repo: Repository<PetNote>,
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
  ) {}

  async create(ownerUserId: string, dto: CreatePetNoteDto) {
    const pet = await this.petRepo.findOne({
      where: { id: dto.petId, owner: { user: { id: ownerUserId } } },
    });
    if (!pet) throw new NotFoundException('Pet not found');
    const note = this.repo.create({ pet, content: dto.content });
    return this.repo.save(note);
  }

  async listForPet(ownerUserId: string, petId: string) {
    const pet = await this.petRepo.findOne({
      where: { id: petId, owner: { user: { id: ownerUserId } } },
    });
    if (!pet) throw new NotFoundException('Pet not found');
    return this.repo.find({
      where: { pet: { id: petId } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(ownerUserId: string, id: string) {
    const note = await this.repo.findOne({
      where: { id },
      relations: ['pet', 'pet.owner', 'pet.owner.user'],
    });
    if (!note) throw new NotFoundException('Note not found');
    if (note.pet.owner.user.id !== ownerUserId) {
      throw new NotFoundException('Note not found');
    }
    await this.repo.remove(note);
    return { deleted: true };
  }
}
