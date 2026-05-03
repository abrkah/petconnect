import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateWeightRecordDto {
  @IsUUID()
  petId!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight!: number;

  @IsDateString()
  recordDate!: string;
}
