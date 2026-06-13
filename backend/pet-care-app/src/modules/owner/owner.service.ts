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
import { normalizeAustriaPhone } from '../../common/austria-phone';



@Injectable()

export class OwnerService {

  constructor(

    @InjectRepository(OwnerProfile)

    private readonly ownerRepo: Repository<OwnerProfile>,

    @InjectRepository(User)

    private readonly userRepo: Repository<User>,

  ) {}



  private optionalPhone(raw?: string): string | null {

    return normalizeAustriaPhone(raw);

  }



  async onboard(userId: string, dto: OnboardOwnerDto) {

    const user = await this.userRepo.findOne({

      where: { id: userId, isDeleted: false },

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

    const profile = await this.ownerRepo.save(

      this.ownerRepo.create({

        fullName: dto.fullName,

        phoneNumber: this.optionalPhone(dto.phoneNumber),

        user: { id: userId } as User,

      }),

    );

    user.isFirstLogin = false;

    await this.userRepo.save(user);

    return this.ownerRepo.findOne({

      where: { id: profile.id },

      relations: ['user', 'pets'],

    });

  }



  async hasProfile(userId: string): Promise<boolean> {

    const count = await this.ownerRepo.count({

      where: { user: { id: userId } },

    });

    return count > 0;

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

    if (dto.phoneNumber !== undefined) {

      profile.phoneNumber = this.optionalPhone(dto.phoneNumber);

    }

    if (dto.fullName != null) profile.fullName = dto.fullName;

    if (dto.profileImage != null) profile.profileImage = dto.profileImage;

    return this.ownerRepo.save(profile);

  }

}

