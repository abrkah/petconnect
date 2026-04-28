import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Pet } from '../../../pets/entities/pet.entity';
import { ProviderProfile } from '../../../provider/entities/provider.entity';

@Entity()
export class VaccinationRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pet, (pet) => pet.vaccinations)
  pet!: Pet;

  @Column()
  vaccineName!: string;

  @Column()
  vaccinationDate!: Date;

  @Column({ nullable: true })
  nextDueDate!: Date;

  @ManyToOne(() => ProviderProfile, { nullable: true })
  addedByProvider!: ProviderProfile;

  @Column({ default: false })
  isApproved!: boolean;
}