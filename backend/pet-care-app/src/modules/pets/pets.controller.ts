import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Roles } from '../auth/decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';
import { petPhotoUploadOptions } from './pets-upload.config';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles(UserRole.OWNER)
  @UseInterceptors(FileInterceptor('photo', petPhotoUploadOptions))
  create(
    @AuthUser() user: CurrentUser,
    @Body() dto: CreatePetDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.petsService.createForOwner(user.id, dto, photo);
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
  @UseInterceptors(FileInterceptor('photo', petPhotoUploadOptions))
  update(
    @AuthUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdatePetDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.petsService.updateForOwner(user.id, id, dto, photo);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  remove(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.petsService.removeForOwner(user.id, id);
  }
}
