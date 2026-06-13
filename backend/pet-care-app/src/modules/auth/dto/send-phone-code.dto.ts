import { IsNotEmpty, IsString } from 'class-validator';

export class SendPhoneCodeDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;
}
