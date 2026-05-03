import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from '../../../common/service-type.enum';

export class OnboardProviderDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsString()
  @MinLength(5)
  phoneNumber!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hourlyPayment!: number;

  @IsString()
  gender!: string;

  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @IsOptional()
  @IsString()
  bio?: string;
}
