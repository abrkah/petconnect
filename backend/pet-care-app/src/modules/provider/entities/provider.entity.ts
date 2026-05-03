import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { HireRequest } from '../../hire-requests/entities/hire-request.entity';
import { ServiceType } from '../../../common/service-type.enum';
import { ProviderPetAssignment } from '../../provider-pet-assignment/entities/provider-pet-assignment.entity';
import { ProviderAvailability } from '../../provider-availability/entities/provider-availability.entity';

@Entity()
export class ProviderProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.providerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
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

  @OneToMany(() => ProviderPetAssignment, (a) => a.provider)
  assignments!: ProviderPetAssignment[];

  @OneToMany(() => ProviderAvailability, (a) => a.provider)
  availabilities!: ProviderAvailability[];
}
