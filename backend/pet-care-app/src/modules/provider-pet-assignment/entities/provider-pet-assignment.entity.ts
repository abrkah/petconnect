import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProviderProfile } from '../../provider/entities/provider.entity';
import { OwnerProfile } from '../../owner/entities/owner.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { HireRequest } from '../../hire-requests/entities/hire-request.entity';

@Entity()
export class ProviderPetAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ProviderProfile, (p) => p.assignments, {
    onDelete: 'CASCADE',
  })
  provider!: ProviderProfile;

  @ManyToOne(() => OwnerProfile, { onDelete: 'CASCADE' })
  owner!: OwnerProfile;

  @ManyToOne(() => Pet, (p) => p.assignments, { onDelete: 'CASCADE' })
  pet!: Pet;

  @ManyToOne(() => HireRequest, { nullable: true, onDelete: 'SET NULL' })
  hireRequest!: HireRequest | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
