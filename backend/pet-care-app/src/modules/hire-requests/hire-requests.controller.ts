import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { HireRequestsService } from './hire-requests.service';
import { CreateHireRequestDto } from './dto/create-hire-request.dto';
import { UpdateHireRequestDto } from './dto/update-hire-request.dto';
import { Roles } from '../auth/decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';

@Controller('hire-requests')
export class HireRequestsController {
  constructor(private readonly hireRequestsService: HireRequestsService) {}

  @Post()
  @Roles(UserRole.OWNER)
  create(@AuthUser() user: CurrentUser, @Body() dto: CreateHireRequestDto) {
    return this.hireRequestsService.create(user.id, dto);
  }

  @Get('mine')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  findMine(@AuthUser() user: CurrentUser) {
    return this.hireRequestsService.listFor(user.id, user.role);
  }

  @Get('notifications')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  notifications(@AuthUser() user: CurrentUser) {
    if (user.role === UserRole.PROVIDER) {
      return this.hireRequestsService.providerNotifications(user.id);
    }
    return this.hireRequestsService.ownerNotifications(user.id);
  }

  @Patch(':id/mark-seen')
  @Roles(UserRole.OWNER)
  markSeen(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.hireRequestsService.markOwnerSeen(user.id, id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  update(
    @AuthUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateHireRequestDto,
  ) {
    return this.hireRequestsService.updateRequest(user.id, user.role, id, dto);
  }
}
