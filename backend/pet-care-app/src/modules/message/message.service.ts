import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User, UserRole } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { PresenceService } from './presence.service';
import { OwnerProfile } from '../owner/entities/owner.entity';
import { ProviderProfile } from '../provider/entities/provider.entity';
import { HireRequest } from '../hire-requests/entities/hire-request.entity';
import { ProviderPetAssignment } from '../provider-pet-assignment/entities/provider-pet-assignment.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(OwnerProfile)
    private readonly ownerRepo: Repository<OwnerProfile>,
    @InjectRepository(ProviderProfile)
    private readonly providerRepo: Repository<ProviderProfile>,
    @InjectRepository(HireRequest)
    private readonly hireRepo: Repository<HireRequest>,
    @InjectRepository(ProviderPetAssignment)
    private readonly assignRepo: Repository<ProviderPetAssignment>,
    private readonly chatGateway: ChatGateway,
    private readonly presence: PresenceService,
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

  async contacts(userId: string, role: UserRole) {
    const peerMeta = new Map<
      string,
      { displayName?: string | null; subtitle?: string | null }
    >();

    const addPeer = (
      peerUserId: string | undefined,
      meta: { displayName?: string | null; subtitle?: string | null },
    ) => {
      if (!peerUserId || peerUserId === userId) return;
      const existing = peerMeta.get(peerUserId);
      peerMeta.set(peerUserId, {
        displayName: meta.displayName ?? existing?.displayName ?? null,
        subtitle: meta.subtitle ?? existing?.subtitle ?? null,
      });
    };

    if (role === UserRole.OWNER) {
      const owner = await this.ownerRepo.findOne({
        where: { user: { id: userId } },
      });
      if (owner) {
        const hires = await this.hireRepo.find({
          where: { owner: { id: owner.id } },
          relations: ['provider', 'provider.user'],
        });
        for (const hire of hires) {
          addPeer(hire.provider.user?.id, {
            displayName: hire.provider.fullName,
            subtitle: 'Service provider',
          });
        }
      }
    } else {
      const provider = await this.providerRepo.findOne({
        where: { user: { id: userId } },
      });
      if (provider) {
        const hires = await this.hireRepo.find({
          where: { provider: { id: provider.id } },
          relations: ['owner', 'owner.user'],
        });
        for (const hire of hires) {
          addPeer(hire.owner.user?.id, {
            displayName: hire.owner.fullName,
            subtitle: 'Pet owner',
          });
        }

        const assignments = await this.assignRepo.find({
          where: { provider: { id: provider.id }, isActive: true },
          relations: ['owner', 'owner.user'],
        });
        for (const row of assignments) {
          addPeer(row.owner.user?.id, {
            displayName: row.owner.fullName,
            subtitle: 'Pet owner',
          });
        }
      }
    }

    const inboxRows = await this.inbox(userId);
    for (const row of inboxRows) {
      addPeer(row.userId, {
        displayName: row.displayName,
        subtitle:
          role === UserRole.OWNER ? 'Service provider' : 'Pet owner',
      });
    }

    const peerIds = [...peerMeta.keys()];
    const displayNames = await this.getDisplayNames(peerIds);

    const items = await Promise.all(
      peerIds.map(async (peerId) => {
        const meta = peerMeta.get(peerId)!;
        const presence = await this.presence.getPresence(peerId);
        return {
          userId: peerId,
          displayName: displayNames.get(peerId) ?? meta.displayName ?? null,
          subtitle: meta.subtitle ?? null,
          online: presence.online,
          lastSeenAt: presence.lastSeenAt,
        };
      }),
    );

    items.sort((a, b) => {
      if (a.online !== b.online) return a.online ? -1 : 1;
      return (a.displayName ?? '').localeCompare(b.displayName ?? '');
    });

    return items;
  }

  async presenceBatch(userIds: string[]) {
    const unique = [...new Set(userIds.filter(Boolean))];
    const entries = await Promise.all(
      unique.map(async (id) => [id, await this.presence.getPresence(id)] as const),
    );
    return Object.fromEntries(entries);
  }
}
