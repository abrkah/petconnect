import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHireRequestDto {
  @IsUUID()
  providerId!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  petIds!: string[];

  @IsOptional()
  @IsString()
  message?: string;
}
