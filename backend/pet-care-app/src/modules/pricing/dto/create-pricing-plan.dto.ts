// create-plan.dto.ts
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  @IsOptional()
  popular?: boolean;
}
