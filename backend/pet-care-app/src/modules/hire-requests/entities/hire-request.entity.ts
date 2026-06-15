import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { OwnerProfile } from '../../owner/entities/owner.entity';
import { ProviderProfile } from '../../provider/entities/provider.entity';

export enum HireStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class HireRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OwnerProfile, (owner) => owner.hireRequests, {
    onDelete: 'CASCADE',
  })
  owner!: OwnerProfile;

  @ManyToOne(() => ProviderProfile, (provider) => provider.hireRequests, {
    onDelete: 'CASCADE',
  })
  provider!: ProviderProfile;

  @Column({ type: 'enum', enum: HireStatus, default: HireStatus.PENDING })
  status!: HireStatus;

  @Column({ type: 'text', nullable: true })
  message!: string | null;

  @Column({ type: 'text', nullable: true })
  responseMessage!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  petIds!: string[] | null;

  @Column({ type: 'varchar', nullable: true })
  decidedByRole!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  ownerSeenAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}