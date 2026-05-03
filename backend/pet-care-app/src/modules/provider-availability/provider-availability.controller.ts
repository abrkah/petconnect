import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProviderAvailabilityService } from './provider-availability.service';
import { ReplaceAvailabilityDto } from './dto/replace-availability.dto';
import { Public } from '../auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';

@Controller('provider-availability')
export class ProviderAvailabilityController {
  constructor(private readonly svc: ProviderAvailabilityService) {}

  @Public()
  @Get('provider/:providerProfileId')
  publicList(@Param('providerProfileId') providerProfileId: string) {
    return this.svc.listForProfile(providerProfileId);
  }

  @Put('me')
  @Roles(UserRole.PROVIDER)
  replace(@AuthUser() user: CurrentUser, @Body() dto: ReplaceAvailabilityDto) {
    return this.svc.replaceForUser(user.id, dto);
  }
}
