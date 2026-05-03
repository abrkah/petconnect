import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';

@Entity()
export class PetNote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pet, (p) => p.notes, { onDelete: 'CASCADE' })
  pet!: Pet;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
