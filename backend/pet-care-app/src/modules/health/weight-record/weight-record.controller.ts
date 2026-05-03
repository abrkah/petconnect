import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WeightRecordService } from './weight-record.service';
import { CreateWeightRecordDto } from './dto/create-weight-record.dto';
import { UpdateWeightRecordDto } from './dto/update-weight-record.dto';
import { Roles } from '../../auth/decorator/roles.decorators';
import { UserRole } from '../../user/entities/user.entity';
import { AuthUser } from '../../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../../auth/types/current-user';

@Controller('weight-record')
export class WeightRecordController {
  constructor(private readonly weightRecordService: WeightRecordService) {}

  @Get('pet/:petId')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  listForPet(
    @AuthUser() user: CurrentUser,
    @Param('petId') petId: string,
  ) {
    return this.weightRecordService.listForPet(user.id, user.role, petId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  create(@AuthUser() user: CurrentUser, @Body() dto: CreateWeightRecordDto) {
    return this.weightRecordService.create(user.id, user.role, dto);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  update(
    @AuthUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateWeightRecordDto,
  ) {
    return this.weightRecordService.update(user.id, user.role, id, dto);
  }

  @Post(':id/approve')
  @Roles(UserRole.PROVIDER)
  approve(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.weightRecordService.approve(user.id, id);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  remove(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.weightRecordService.remove(user.id, user.role, id);
  }
}
