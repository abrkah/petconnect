import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyPhoneCodeDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
