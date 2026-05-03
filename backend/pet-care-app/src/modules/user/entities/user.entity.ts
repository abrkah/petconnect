import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { OwnerProfile } from '../../owner/entities/owner.entity'; 
import { ProviderProfile } from '../../provider/entities/provider.entity';

export enum UserRole {
  OWNER = 'OWNER',
  PROVIDER = 'PROVIDER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;
   @Column({ default: false })
  isDeleted!: boolean;

  @Column({ default: true })
  isFirstLogin!: boolean;

  /** Updated when the user disconnects from realtime chat (socket). */
  @Column({ type: 'timestamptz', nullable: true })
  lastSeenAt!: Date | null;

  @OneToOne(() => OwnerProfile, (owner) => owner.user)
  ownerProfile!: OwnerProfile;

  @OneToOne(() => ProviderProfile, (provider) => provider.user)
  providerProfile!: ProviderProfile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}