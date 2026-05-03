import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  receiverUserId!: string;

  @IsString()
  @MinLength(1)
  messageText!: string;
}
