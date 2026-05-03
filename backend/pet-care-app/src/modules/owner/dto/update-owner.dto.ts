import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { OnboardOwnerDto } from './onboard-owner.dto';

export class UpdateOwnerDto extends PartialType(OnboardOwnerDto) {
  @IsOptional()
  @IsString()
  profileImage?: string;
}
