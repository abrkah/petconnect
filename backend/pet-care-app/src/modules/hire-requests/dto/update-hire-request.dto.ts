import { IsEnum } from 'class-validator';
import { HireStatus } from '../entities/hire-request.entity';

export class UpdateHireRequestDto {
  @IsEnum(HireStatus)
  status!: HireStatus;
}
