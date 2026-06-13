import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ServiceType } from '../../../common/service-type.enum';

export class CreateBookingDto {
  @IsUUID()
  petId!: string;

  @IsUUID()
  providerId!: string;

  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  timeSlot?: string;
}
12