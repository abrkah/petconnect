import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Server } from 'socket.io';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PresenceService {
  private server: Server | null = null;

  /** Connected socket count per user (multiple tabs). */
  private readonly connections = new Map<string, number>();

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  isOnline(userId: string): boolean {
    return (this.connections.get(userId) ?? 0) > 0;
  }

  async getLastSeenIso(userId: string): Promise<string | null> {
    const u = await this.userRepo.findOne({
      where: { id: userId },
      select: ['lastSeenAt'],
    });
    return u?.lastSeenAt?.toISOString() ?? null;
  }

  async getPresence(userId: string): Promise<{
    online: boolean;
    lastSeenAt: string | null;
  }> {
    const online = this.isOnline(userId);
    const lastSeenAt = await this.getLastSeenIso(userId);
    return { online, lastSeenAt };
  }

  /** @returns true if user became online (first connection). */
  userConnected(userId: string): boolean {
    const next = (this.connections.get(userId) ?? 0) + 1;
    this.connections.set(userId, next);
    const becameOnline = next === 1;
    if (becameOnline) this.broadcastPresence(userId, true, null);
    return becameOnline;
  }

  /** @returns true if user became fully offline. */
  async userDisconnected(userId: string): Promise<boolean> {
    const prev = this.connections.get(userId) ?? 0;
    if (prev <= 1) {
      this.connections.delete(userId);
      const now = new Date();
      await this.userRepo.update({ id: userId }, { lastSeenAt: now });
      this.broadcastPresence(userId, false, now);
      return true;
    }
    this.connections.set(userId, prev - 1);
    return false;
  }

  private broadcastPresence(
    userId: string,
    online: boolean,
    lastSeenAt: Date | null,
  ) {
    this.server?.emit('presence:changed', {
      userId,
      online,
      lastSeenAt: lastSeenAt?.toISOString() ?? null,
    });
  }
}
