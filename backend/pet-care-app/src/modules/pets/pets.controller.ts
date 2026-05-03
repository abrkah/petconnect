import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Roles } from '../auth/decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles(UserRole.OWNER)
  create(@AuthUser() user: CurrentUser, @Body() dto: CreatePetDto) {
    return this.petsService.createForOwner(user.id, dto);
  }

  @Get('mine')
  @Roles(UserRole.OWNER)
  findMine(@AuthUser() user: CurrentUser) {
    return this.petsService.findAllForOwner(user.id);
  }

  @Get('managed')
  @Roles(UserRole.PROVIDER)
  findManaged(@AuthUser() user: CurrentUser) {
    return this.petsService.findManagedForProvider(user.id);
  }

  @Get('assigned/:id')
  @Roles(UserRole.PROVIDER)
  findAssigned(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.petsService.getAssignedPet(user.id, id);
  }

  @Get(':id')
  @Roles(UserRole.OWNER)
  findOne(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.petsService.findOneForOwner(user.id, id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER)
  update(
    @AuthUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdatePetDto,
  ) {
    return this.petsService.updateForOwner(user.id, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  remove(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.petsService.removeForOwner(user.id, id);
  }
}
