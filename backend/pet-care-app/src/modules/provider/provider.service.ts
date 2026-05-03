import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderProfile } from './entities/provider.entity';
import { OnboardProviderDto } from './dto/onboard-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/entities/user.entity';
import { ServiceType } from '../../common/service-type.enum';

export type DirectoryQuery = {
  serviceType?: ServiceType;
  minRate?: number;
  maxRate?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name';
};

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(ProviderProfile)
    private readonly providerRepo: Repository<ProviderProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onboard(userId: string, dto: OnboardProviderDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!user || user.role !== UserRole.PROVIDER) {
      throw new BadRequestException('Invalid account');
    }
    const existing = await this.providerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (existing) {
      throw new BadRequestException('Profile already created');
    }
    const profile = this.providerRepo.create({
      user,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      hourlyPayment: dto.hourlyPayment,
      gender: dto.gender,
      serviceType: dto.serviceType,
      bio: dto.bio ?? '',
    });
    await this.providerRepo.save(profile);
    user.isFirstLogin = false;
    await this.userRepo.save(user);
    return this.providerRepo.findOne({
      where: { id: profile.id },
      relations: ['user', 'availabilities'],
    });
  }

  async getByUserId(userId: string) {
    const profile = await this.providerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'availabilities'],
    });
    if (!profile) throw new NotFoundException('Provider profile not found');
    return profile;
  }

  async getById(id: string) {
    const profile = await this.providerRepo.findOne({
      where: { id },
      relations: ['user', 'availabilities'],
    });
    if (!profile) throw new NotFoundException('Provider not found');
    return profile;
  }

  async updateByUserId(userId: string, dto: UpdateProviderDto) {
    const profile = await this.providerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) throw new NotFoundException('Provider profile not found');
    Object.assign(profile, dto);
    return this.providerRepo.save(profile);
  }

  async findDirectory(q: DirectoryQuery) {
    const qb = this.providerRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.availabilities', 'a');

    if (q.serviceType) {
      qb.andWhere('p.serviceType = :st', { st: q.serviceType });
    }
    if (q.minRate != null) {
      qb.andWhere('p.hourlyPayment >= :min', { min: q.minRate });
    }
    if (q.maxRate != null) {
      qb.andWhere('p.hourlyPayment <= :max', { max: q.maxRate });
    }
    if (q.search?.trim()) {
      qb.andWhere(
        '(LOWER(p.fullName) LIKE LOWER(:s) OR LOWER(p.bio) LIKE LOWER(:s))',
        { s: `%${q.search.trim()}%` },
      );
    }

    const sort = q.sort ?? 'name';
    if (sort === 'price_asc') qb.orderBy('p.hourlyPayment', 'ASC');
    else if (sort === 'price_desc') qb.orderBy('p.hourlyPayment', 'DESC');
    else qb.orderBy('p.fullName', 'ASC');

    return qb.getMany();
  }
}
