import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { OnboardProviderDto } from './dto/onboard-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Roles } from '../auth/decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';
import { Public } from '../auth/decorator/public.decorator';
import { ServiceType } from '../../common/service-type.enum';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Public()
  @Get('directory')
  directory(
    @Query('serviceType') serviceType?: ServiceType,
    @Query('minRate') minRate?: string,
    @Query('maxRate') maxRate?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: 'price_asc' | 'price_desc' | 'name',
  ) {
    return this.providerService.findDirectory({
      serviceType,
      minRate: minRate != null ? Number(minRate) : undefined,
      maxRate: maxRate != null ? Number(maxRate) : undefined,
      search,
      sort,
    });
  }

  @Public()
  @Get('public/:id')
  getPublicOne(@Param('id') id: string) {
    return this.providerService.getById(id);
  }

  @Post('profile')
  @Roles(UserRole.PROVIDER)
  onboard(@AuthUser() user: CurrentUser, @Body() dto: OnboardProviderDto) {
    return this.providerService.onboard(user.id, dto);
  }

  @Get('profile')
  @Roles(UserRole.PROVIDER)
  getProfile(@AuthUser() user: CurrentUser) {
    return this.providerService.getByUserId(user.id);
  }

  @Patch('profile')
  @Roles(UserRole.PROVIDER)
  updateProfile(
    @AuthUser() user: CurrentUser,
    @Body() dto: UpdateProviderDto,
  ) {
    return this.providerService.updateByUserId(user.id, dto);
  }
}
