import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OnboardOwnerDto } from './dto/onboard-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Roles } from '../auth/decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post('profile')
  @Roles(UserRole.OWNER)
  onboard(@AuthUser() user: CurrentUser, @Body() dto: OnboardOwnerDto) {
    return this.ownerService.onboard(user.id, dto);
  }

  @Get('profile')
  @Roles(UserRole.OWNER)
  getProfile(@AuthUser() user: CurrentUser) {
    return this.ownerService.getByUserId(user.id);
  }

  @Patch('profile')
  @Roles(UserRole.OWNER)
  updateProfile(@AuthUser() user: CurrentUser, @Body() dto: UpdateOwnerDto) {
    return this.ownerService.updateByUserId(user.id, dto);
  }
}
