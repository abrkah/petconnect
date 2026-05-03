import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { OnboardProviderDto } from './onboard-provider.dto';

export class UpdateProviderDto extends PartialType(OnboardProviderDto) {
  @IsOptional()
  @IsString()
  profileImage?: string;
}
