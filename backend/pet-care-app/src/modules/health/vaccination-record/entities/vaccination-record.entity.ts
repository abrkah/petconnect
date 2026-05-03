import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
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

  @Column({ type: 'date' })
  vaccinationDate!: Date;

  @Column({ type: 'date', nullable: true })
  nextDueDate!: Date | null;

  @ManyToOne(() => ProviderProfile, { nullable: true })
  addedByProvider!: ProviderProfile | null;

  @Column({ default: false })
  isApproved!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}