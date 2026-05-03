import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PetNotesService } from './pet-notes.service';
import { CreatePetNoteDto } from './dto/create-pet-note.dto';
import { Roles } from '../auth/decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';

@Controller('pet-notes')
export class PetNotesController {
  constructor(private readonly petNotesService: PetNotesService) {}

  @Post()
  @Roles(UserRole.OWNER)
  create(@AuthUser() user: CurrentUser, @Body() dto: CreatePetNoteDto) {
    return this.petNotesService.create(user.id, dto);
  }

  @Get('pet/:petId')
  @Roles(UserRole.OWNER)
  list(@AuthUser() user: CurrentUser, @Param('petId') petId: string) {
    return this.petNotesService.listForPet(user.id, petId);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  remove(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.petNotesService.remove(user.id, id);
  }
}
