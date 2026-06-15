import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import jwtConfig from '../auth/config/jwt.config';
import type { Message } from './entities/message.entity';
import { PresenceService } from './presence.service';

type JwtPayload = { sub: string };

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly presence: PresenceService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  onModuleInit() {
    this.presence.setServer(this.server);
  }

  async handleConnection(client: Socket) {
    try {
      const raw = client.handshake.auth?.token;
      const token = typeof raw === 'string' ? raw : null;
      if (!token) {
        client.disconnect();
        return;
      }
      const secret = this.jwtConfiguration.secret;
      if (!secret || typeof secret !== 'string') {
        this.logger.error('JWT secret missing or invalid type');
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify<JwtPayload>(token, { secret });
      const userId = payload.sub;
      if (!userId) {
        client.disconnect();
        return;
      }
      (client.data as { userId?: string }).userId = userId;
      await client.join(`user:${userId}`);
      this.presence.userConnected(userId);
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = (client.data as { userId?: string }).userId;
    if (!userId) return;
    await this.presence.userDisconnected(userId);
  }

  emitNewMessage(receiverUserId: string, msg: Message) {
    this.server.to(`user:${receiverUserId}`).emit('message:new', {
      id: msg.id,
      senderUserId: msg.senderUserId,
      receiverUserId: msg.receiverUserId,
      messageText: msg.messageText,
      createdAt:
        msg.createdAt instanceof Date
          ? msg.createdAt.toISOString()
          : msg.createdAt,
    });
  }

  emitUnreadBadge(userId: string, totalUnread: number) {
    this.server.to(`user:${userId}`).emit('message:unread', { totalUnread });
  }

  emitHirePending(providerUserId: string, payload: { pendingCount: number }) {
    this.server
      .to(`user:${providerUserId}`)
      .emit('hire:pending', payload);
  }

  emitHireOwnerUpdate(ownerUserId: string, payload: { unreadCount: number }) {
    this.server
      .to(`user:${ownerUserId}`)
      .emit('hire:owner-update', payload);
  }
}
