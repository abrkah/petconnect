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
export class WeightRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pet, (pet) => pet.weights)
  pet!: Pet;

  @Column('float')
  weight!: number;

  @Column({ type: 'date' })
  recordDate!: Date;

  @ManyToOne(() => ProviderProfile, { nullable: true })
  addedByProvider!: ProviderProfile | null;

  @Column({ default: false })
  isApproved!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}