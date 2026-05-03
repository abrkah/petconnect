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
import { Pet } from '../../pets/entities/pet.entity';
import { ServiceType } from '../../../common/service-type.enum';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OwnerProfile, (o) => o.bookings)
  owner!: OwnerProfile;

  @ManyToOne(() => ProviderProfile, (p) => p.bookings)
  provider!: ProviderProfile;

  @ManyToOne(() => Pet, (p) => p.bookings)
  pet!: Pet;

  @Column({ type: 'enum', enum: ServiceType })
  serviceType!: ServiceType;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  timeSlot!: string | null;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
