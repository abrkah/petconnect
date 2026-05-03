import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VaccinationRecordService } from './vaccination-record.service';
import { CreateVaccinationRecordDto } from './dto/create-vaccination-record.dto';
import { UpdateVaccinationRecordDto } from './dto/update-vaccination-record.dto';
import { Roles } from '../../auth/decorator/roles.decorators';
import { UserRole } from '../../user/entities/user.entity';
import { AuthUser } from '../../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../../auth/types/current-user';

@Controller('vaccination-record')
export class VaccinationRecordController {
  constructor(private readonly vaccinationRecordService: VaccinationRecordService) {}

  @Get('pet/:petId')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  listForPet(
    @AuthUser() user: CurrentUser,
    @Param('petId') petId: string,
  ) {
    return this.vaccinationRecordService.listForPet(user.id, user.role, petId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  create(@AuthUser() user: CurrentUser, @Body() dto: CreateVaccinationRecordDto) {
    return this.vaccinationRecordService.create(user.id, user.role, dto);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  update(
    @AuthUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateVaccinationRecordDto,
  ) {
    return this.vaccinationRecordService.update(user.id, user.role, id, dto);
  }

  @Post(':id/approve')
  @Roles(UserRole.PROVIDER)
  approve(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.vaccinationRecordService.approve(user.id, id);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  remove(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.vaccinationRecordService.remove(user.id, user.role, id);
  }
}
