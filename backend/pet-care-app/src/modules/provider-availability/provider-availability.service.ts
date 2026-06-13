import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderAvailability } from './entities/provider-availability.entity';
import { ProviderProfile } from '../provider/entities/provider.entity';
import { ReplaceAvailabilityDto } from './dto/replace-availability.dto';
import { getAvailabilityOverlapMessage } from '../../common/availability-overlap';

@Injectable()
export class ProviderAvailabilityService {
  constructor(
    @InjectRepository(ProviderAvailability)
    private readonly repo: Repository<ProviderAvailability>,
    @InjectRepository(ProviderProfile)
    private readonly providerRepo: Repository<ProviderProfile>,
  ) {}

  async listForProfile(providerProfileId: string) {
    const p = await this.providerRepo.findOne({ where: { id: providerProfileId } });
    if (!p) throw new NotFoundException('Provider not found');
    return this.repo.find({
      where: { provider: { id: providerProfileId } },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async replaceForUser(userId: string, dto: ReplaceAvailabilityDto) {
    const provider = await this.providerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!provider) throw new NotFoundException('Provider profile not found');

    const slots = dto.slots ?? [];

    const overlapMessage = getAvailabilityOverlapMessage(slots);
    if (overlapMessage) {
      throw new BadRequestException(overlapMessage);
    }

    await this.repo
      .createQueryBuilder()
      .delete()
      .where('providerId = :providerId', { providerId: provider.id })
      .execute();

    if (slots.length === 0) return [];

    const rows = slots.map((s) =>
      this.repo.create({
        provider,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }),
    );
    return this.repo.save(rows);
  }
}
