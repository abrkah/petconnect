import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OwnerProfile } from '../../owner/entities/owner.entity'; 
import { VaccinationRecord } from '../../health/vaccination-record/entities/vaccination-record.entity';
import { WeightRecord } from '../../health/weight-record/entities/weight-record.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OwnerProfile, (owner) => owner.pets)
  owner!: OwnerProfile;

  @Column()
  name!: string;

  @Column()
  breed!: string;

  @Column()
  age!: number;

  @Column({ nullable: true })
  weight!: number;

  @Column({ nullable: true })
  gender!: string;

  @Column({ nullable: true })
  photoUrl!: string;

  @OneToMany(() => VaccinationRecord, (v) => v.pet)
  vaccinations!: VaccinationRecord[];

  @OneToMany(() => WeightRecord, (w) => w.pet)
  weights!: WeightRecord[];

  @OneToMany(() => Booking, (b) => b.pet)
  bookings!: Booking[];
}