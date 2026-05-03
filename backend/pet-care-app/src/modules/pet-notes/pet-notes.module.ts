import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetNotesService } from './pet-notes.service';
import { PetNotesController } from './pet-notes.controller';
import { PetNote } from './entities/pet-note.entity';
import { Pet } from '../pets/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetNote, Pet])],
  controllers: [PetNotesController],
  providers: [PetNotesService],
})
export class PetNotesModule {}
