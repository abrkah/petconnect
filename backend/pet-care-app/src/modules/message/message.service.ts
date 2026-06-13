import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async getDisplayName(userId: string): Promise<string | null> {
    const names = await this.getDisplayNames([userId]);
    return names.get(userId) ?? null;
  }

  private async getDisplayNames(userIds: string[]): Promise<Map<string, string>> {
    const unique = [...new Set(userIds.filter(Boolean))];
    const map = new Map<string, string>();
    if (unique.length === 0) return map;

    const users = await this.userRepo.find({
      where: { id: In(unique), isDeleted: false },
      relations: ['ownerProfile', 'providerProfile'],
    });

    for (const user of users) {
      const name =
        user.ownerProfile?.fullName?.trim() ||
        user.providerProfile?.fullName?.trim();
      if (name) map.set(user.id, name);
    }

    return map;
  }

  async send(senderId: string, dto: CreateMessageDto) {
    if (senderId === dto.receiverUserId) {
      throw new BadRequestException('Cannot message yourself');
    }
    const peer = await this.userRepo.findOne({
      where: { id: dto.receiverUserId, isDeleted: false },
    });
    if (!peer) throw new NotFoundException('Recipient not found');

    const msg = this.repo.create({
      senderUserId: senderId,
      receiverUserId: dto.receiverUserId,
      messageText: dto.messageText,
      isRead: false,
    });
    const saved = await this.repo.save(msg);
    this.chatGateway.emitNewMessage(dto.receiverUserId, saved);
    const totalUnread = await this.countUnread(dto.receiverUserId);
    this.chatGateway.emitUnreadBadge(dto.receiverUserId, totalUnread);
    return saved;
  }

  async countUnread(receiverUserId: string): Promise<number> {
    return this.repo.count({
      where: { receiverUserId, isRead: false },
    });
  }

  async unreadNotifications(receiverUserId: string): Promise<{
    total: number;
    items: {
      senderUserId: string;
      senderDisplayName: string | null;
      unreadCount: number;
      previewText: string;
      lastMessageAt: string;
    }[];
  }> {
    const total = await this.countUnread(receiverUserId);
    const groups = await this.repo
      .createQueryBuilder('m')
      .select('m.senderUserId', 'senderUserId')
      .addSelect('COUNT(*)', 'cnt')
      .addSelect('MAX(m.createdAt)', 'lastAt')
      .where('m.receiverUserId = :uid AND m.isRead = false', {
        uid: receiverUserId,
      })
      .groupBy('m.senderUserId')
      .getRawMany<{ senderUserId: string; cnt: string; lastAt: Date }>();

    groups.sort(
      (a, b) =>
        new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime(),
    );

    const senderIds = groups.map((g) => g.senderUserId);
    const displayNames = await this.getDisplayNames(senderIds);

    const items: {
      senderUserId: string;
      senderDisplayName: string | null;
      unreadCount: number;
      previewText: string;
      lastMessageAt: string;
    }[] = [];

    for (const g of groups) {
      const latest = await this.repo.findOne({
        where: {
          senderUserId: g.senderUserId,
          receiverUserId,
          isRead: false,
        },
        order: { createdAt: 'DESC' },
      });
      items.push({
        senderUserId: g.senderUserId,
        senderDisplayName: displayNames.get(g.senderUserId) ?? null,
        unreadCount: Number(g.cnt),
        previewText: latest?.messageText ?? '',
        lastMessageAt:
          latest?.createdAt instanceof Date
            ? latest.createdAt.toISOString()
            : String(g.lastAt),
      });
    }

    return { total, items };
  }

  async markConversationRead(me: string, peerId: string): Promise<{
    totalUnread: number;
  }> {
    await this.repo.update(
      { receiverUserId: me, senderUserId: peerId, isRead: false },
      { isRead: true },
    );
    const totalUnread = await this.countUnread(me);
    this.chatGateway.emitUnreadBadge(me, totalUnread);
    return { totalUnread };
  }

  async conversation(userId: string, otherUserId: string) {
    return this.repo
      .createQueryBuilder('m')
      .where(
        '(m.senderUserId = :me AND m.receiverUserId = :o) OR (m.senderUserId = :o AND m.receiverUserId = :me)',
        { me: userId, o: otherUserId },
      )
      .orderBy('m.createdAt', 'ASC')
      .getMany();
  }

  async inbox(userId: string) {
    const rows = await this.repo
      .createQueryBuilder('m')
      .where('m.senderUserId = :id OR m.receiverUserId = :id', { id: userId })
      .orderBy('m.createdAt', 'DESC')
      .getMany();

    const latestByPeer = new Map<string, Message>();
    for (const m of rows) {
      const peer =
        m.senderUserId === userId ? m.receiverUserId : m.senderUserId;
      if (!latestByPeer.has(peer)) latestByPeer.set(peer, m);
    }

    const peerIds = [...latestByPeer.keys()];
    const displayNames = await this.getDisplayNames(peerIds);

    return [...latestByPeer.entries()].map(([peerId, lastMessage]) => ({
      userId: peerId,
      displayName: displayNames.get(peerId) ?? null,
      lastMessage,
    }));
  }
}
