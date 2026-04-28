import {
  IsEmail,
  IsString,
  IsEnum,
  MinLength,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole; // ✅ OWNER | PROVIDER

  // Optional (handled later in OwnerProfile / ProviderProfile)
  @IsString()
  @IsOptional()
  user_image?: string;
}