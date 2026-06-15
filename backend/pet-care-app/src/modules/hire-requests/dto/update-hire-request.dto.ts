import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HireStatus } from '../entities/hire-request.entity';

export class UpdateHireRequestDto {
  @IsEnum(HireStatus)
  status!: HireStatus;

  @IsOptional()
  @IsString()
  responseMessage?: string;
}
