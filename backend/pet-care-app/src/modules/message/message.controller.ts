import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';
import { PresenceService } from './presence.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly presenceService: PresenceService,
  ) {}

  @Post()
  send(@AuthUser() user: CurrentUser, @Body() dto: CreateMessageDto) {
    return this.messageService.send(user.id, dto);
  }

  @Get('inbox')
  inbox(@AuthUser() user: CurrentUser) {
    return this.messageService.inbox(user.id);
  }

  @Get('notifications')
  notifications(@AuthUser() user: CurrentUser) {
    return this.messageService.unreadNotifications(user.id);
  }

  @Post('read/:peerId')
  markRead(
    @AuthUser() user: CurrentUser,
    @Param('peerId') peerId: string,
  ) {
    return this.messageService.markConversationRead(user.id, peerId);
  }

  @Get('presence/:userId')
  peerPresence(@Param('userId') userId: string) {
    return this.presenceService.getPresence(userId);
  }

  @Get('conversation/:userId')
  conversation(
    @AuthUser() user: CurrentUser,
    @Param('userId') otherUserId: string,
  ) {
    return this.messageService.conversation(user.id, otherUserId);
  }
}
