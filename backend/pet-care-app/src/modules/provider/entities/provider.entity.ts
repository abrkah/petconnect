import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { HireRequest } from '../../hire-requests/entities/hire-request.entity';

export enum ServiceType {
  DOG_WALKING = 'DOG_WALKING',
  VACCINATION = 'VACCINATION',
  GENERAL_SERVICE = 'GENERAL_SERVICE',
}

@Entity()
export class ProviderProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.providerProfile, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @Column()
  fullName!: string;

  @Column()
  phoneNumber!: string;

  @Column('decimal')
  hourlyPayment!: number;

  @Column()
  gender!: string;

  @Column({ type: 'enum', enum: ServiceType })
  serviceType!: ServiceType;

  @Column({ nullable: true })
  bio!: string;

  @Column({ nullable: true })
  profileImage!: string;

  @OneToMany(() => Booking, (booking) => booking.provider)
  bookings!: Booking[];

  @OneToMany(() => HireRequest, (h) => h.provider)
  hireRequests!: HireRequest[];
}