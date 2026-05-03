import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProviderProfile } from '../../provider/entities/provider.entity';

@Entity()
export class ProviderAvailability {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ProviderProfile, (p) => p.availabilities, {
    onDelete: 'CASCADE',
  })
  provider!: ProviderProfile;

  /** 0 = Sunday … 6 = Saturday */
  @Column({ type: 'int' })
  dayOfWeek!: number;

  @Column({ length: 8 })
  startTime!: string;

  @Column({ length: 8 })
  endTime!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
