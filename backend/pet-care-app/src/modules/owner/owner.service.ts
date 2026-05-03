import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerProfile } from './entities/owner.entity';
import { OnboardOwnerDto } from './dto/onboard-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(OwnerProfile)
    private readonly ownerRepo: Repository<OwnerProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onboard(userId: string, dto: OnboardOwnerDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId, isDeleted: false },
      relations: ['ownerProfile'],
    });
    if (!user || user.role !== UserRole.OWNER) {
      throw new BadRequestException('Invalid account');
    }
    const existing = await this.ownerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (existing) {
      throw new BadRequestException('Profile already created');
    }
    const profile = this.ownerRepo.create({
      user,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
    });
    await this.ownerRepo.save(profile);
    user.isFirstLogin = false;
    await this.userRepo.save(user);
    return this.ownerRepo.findOne({
      where: { id: profile.id },
      relations: ['user', 'pets'],
    });
  }

  async getByUserId(userId: string) {
    const profile = await this.ownerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'pets'],
    });
    if (!profile) throw new NotFoundException('Owner profile not found');
    return profile;
  }

  async updateByUserId(userId: string, dto: UpdateOwnerDto) {
    const profile = await this.ownerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) throw new NotFoundException('Owner profile not found');
    Object.assign(profile, dto);
    return this.ownerRepo.save(profile);
  }
}
