import { IsString, MinLength } from 'class-validator';

export class OnboardOwnerDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsString()
  @MinLength(5)
  phoneNumber!: string;
}
