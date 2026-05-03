import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreatePetNoteDto {
  @IsUUID()
  petId!: string;

  @IsString()
  @MinLength(1)
  content!: string;
}
