import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { HireRequest } from '../../hire-requests/entities/hire-request.entity';

@Entity()
export class OwnerProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.ownerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  fullName!: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'varchar', nullable: true })
  city!: string | null;

  @Column({ type: 'varchar', nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', nullable: true })
  emergencyContactName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  emergencyContactPhone!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ nullable: true })
  profileImage!: string;

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets!: Pet[];

  @OneToMany(() => Booking, (booking) => booking.owner)
  bookings!: Booking[];

  @OneToMany(() => HireRequest, (h) => h.owner)
  hireRequests!: HireRequest[];
}