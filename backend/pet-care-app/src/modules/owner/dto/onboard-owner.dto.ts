import { IsOptional, IsString, MinLength } from 'class-validator';

export class OnboardOwnerDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
