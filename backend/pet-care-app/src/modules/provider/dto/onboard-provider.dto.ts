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
import { ProviderGender } from '../../../common/provider-gender.enum';

export class OnboardProviderDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hourlyPayment!: number;

  @IsEnum(ProviderGender)
  gender!: ProviderGender;

  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @IsOptional()
  @IsString()
  bio?: string;
}
